/**
 * Resend client singleton + helpers d'envoi typés.
 *
 * Usage :
 *   import { sendEmail, emitEvent } from '~/lib/resend';
 *   await sendEmail({ to, subject, react });
 *   await emitEvent('lead_magnet_downloaded', { contactId, ... });
 *
 * Cf docs/09-integrations.md pour la stratégie complète.
 */

// Import dynamique pour ne pas casser le bundle Astro/Vite SSR au build :
// `import { Resend } from "resend"` (import statique) provoquait l'exclusion
// silencieuse de tous les fichiers /api/*.ts qui le transitaient (404 en prod
// post-bascule monorepo 2026-04-27, validé via /api/healthcheck OK et
// /api/diag-resend HTML catch-all).
const apiKey = import.meta.env.RESEND_API_KEY;
if (!apiKey && import.meta.env.PROD) {
  console.error("[resend] RESEND_API_KEY missing in production env");
}

let _resend: import("resend").Resend | null = null;
async function getResend() {
  if (_resend) return _resend;
  const { Resend } = await import("resend");
  _resend = new Resend(apiKey ?? "dummy-key-dev");
  return _resend;
}

// EMAIL_FROM · alias virtuoseweb.fr (domaine déjà vérifié sur Resend, partagé
// avec sitewebastro). Override via env Vercel : EMAIL_FROM="Waimia <…>".
// Migration vers bonjour@waimia.fr possible plus tard quand DNS waimia.com
// sera configuré + domaine ajouté dans Resend.
export const EMAIL_FROM =
  import.meta.env.EMAIL_FROM ?? "Waimia <waimia@virtuoseweb.fr>";
// Reply-to par défaut · client peut répondre directement au mail confirmation
export const EMAIL_REPLY_TO =
  import.meta.env.EMAIL_REPLY_TO ?? "contact@virtuoseweb.fr";
export const EMAIL_INTERNAL_TO =
  import.meta.env.EMAIL_INTERNAL_TO ?? "contact@virtuoseweb.fr";

/* ───── Helper · envoi typé ───── */
interface SendArgs {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  /** Tags Resend pour filtrage analytics (ex: ['contact', 'fr']) */
  tags?: { name: string; value: string }[];
  /** Reply-to si différent du From */
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  react,
  tags,
  replyTo,
}: SendArgs) {
  if (!apiKey) {
    console.warn("[resend] skipped (no API key)", { to, subject });
    return { id: "dev-no-send", skipped: true };
  }
  const resend = await getResend();
  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    react,
    tags,
    // Si l'appelant ne précise pas, on route les replies vers EMAIL_REPLY_TO
    // (boîte humaine surveillée), pas vers EMAIL_FROM (alias d'envoi seul).
    replyTo: replyTo ?? EMAIL_REPLY_TO,
  });
  if (result.error) {
    console.error("[resend] send error", result.error);
    throw new Error(result.error.message);
  }
  return { id: result.data?.id, skipped: false };
}

/* ───── Helper · événement Automations ─────
   Émet un event qui déclenche une séquence Resend Automations configurée
   dans le dashboard. Les triggers actifs : lead_magnet_downloaded,
   academy_completed, contact_submitted (cf docs/09-integrations.md). */
type EventName =
  | "lead_magnet_downloaded"
  | "academy_completed"
  | "contact_submitted";

interface EventPayload {
  contactId?: string;
  email: string;
  [key: string]: unknown;
}

export async function emitEvent(name: EventName, payload: EventPayload) {
  if (!apiKey) {
    console.warn("[resend] event skipped (no API key)", { name, payload });
    return { skipped: true };
  }
  // Resend Automations se déclenchent via les TAGS d'email envoyé
  // (cf docs/09-integrations.md). On ajoute juste le contact à l'audience
  // si configuré, sinon no-op : les emails sendEmail() embarquent les tags
  // et c'est ce que les Automations dashboard Resend écoutent.
  const audienceId = import.meta.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    console.info("[resend] no audience configured, event tag-only", {
      name,
      email: payload.email,
    });
    return { skipped: false, audienceless: true };
  }
  try {
    const resend = await getResend();
    await resend.contacts.create({
      email: payload.email,
      audienceId,
      firstName:
        typeof payload.firstName === "string" ? payload.firstName : undefined,
    });
    return { skipped: false };
  } catch (err) {
    // Idempotent : si le contact existe déjà, c'est OK
    console.warn("[resend] event error (likely duplicate)", err);
    return { skipped: false, idempotent: true };
  }
}
