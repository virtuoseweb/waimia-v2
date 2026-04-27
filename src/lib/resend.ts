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

import { Resend } from "resend";

const apiKey = import.meta.env.RESEND_API_KEY;
if (!apiKey && import.meta.env.PROD) {
  // En prod, on log mais on ne crash pas (failover graceful)
  console.error("[resend] RESEND_API_KEY missing in production env");
}

export const resend = new Resend(apiKey ?? "dummy-key-dev");

export const EMAIL_FROM =
  import.meta.env.EMAIL_FROM ?? "Waimia <bonjour@waimia.fr>";
export const EMAIL_INTERNAL_TO =
  import.meta.env.EMAIL_INTERNAL_TO ?? "alerts@waimia.fr";

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
  const result = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    react,
    tags,
    replyTo,
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
