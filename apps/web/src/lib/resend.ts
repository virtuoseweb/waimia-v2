/**
 * Resend client · fetch() direct vers l'API Resend (sans SDK).
 *
 * Pourquoi pas le SDK `resend` ?
 * Le SDK npm `resend@6.x` a des exports ESM/CJS qui plantent silencieusement
 * le bundle Astro/Vite SSR sur Vercel monorepo (validé empiriquement le
 * 2026-04-27 : tous les /api/*.ts qui importaient lib/resend disparaissaient
 * du bundle entry.mjs → 404 en prod). Cf docs/known-issues.md #1.
 *
 * Solution : appel direct à l'API REST Resend via fetch(). Zéro SDK, zéro
 * bundle issue. Compatible 100% serverless Vercel.
 *
 * API Resend · https://resend.com/docs/api-reference/emails/send-email
 *   POST https://api.resend.com/emails
 *   Authorization: Bearer ${apiKey}
 *   Body: { from, to, subject, html | text, reply_to, tags }
 *
 * Usage :
 *   import { sendEmail, emitEvent } from '~/lib/resend';
 *   await sendEmail({ to, subject, react });
 */

import { render } from "@react-email/render";
import type { ReactElement } from "react";

const RESEND_API_URL = "https://api.resend.com";
const apiKey = import.meta.env.RESEND_API_KEY;

if (!apiKey && import.meta.env.PROD) {
  console.error("[resend] RESEND_API_KEY missing in production env");
}

// EMAIL_FROM · alias virtuoseweb.fr (domaine déjà vérifié sur Resend, partagé
// avec sitewebastro). Override via env Vercel : EMAIL_FROM="Waimia <…>".
export const EMAIL_FROM =
  import.meta.env.EMAIL_FROM ?? "Waimia <waimia@virtuoseweb.fr>";
export const EMAIL_REPLY_TO =
  import.meta.env.EMAIL_REPLY_TO ?? "contact@virtuoseweb.fr";
export const EMAIL_INTERNAL_TO =
  import.meta.env.EMAIL_INTERNAL_TO ?? "contact@virtuoseweb.fr";

interface SendArgs {
  to: string | string[];
  subject: string;
  /** React Email element · sera rendu en HTML via @react-email/render */
  react: ReactElement;
  /** Tags Resend pour filtrage analytics (ex: [{name:'type',value:'contact'}]) */
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

  // Render React Email element → HTML string
  const html = await render(react);

  const body = {
    from: EMAIL_FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    reply_to: replyTo ?? EMAIL_REPLY_TO,
    ...(tags && tags.length > 0 ? { tags } : {}),
  };

  const response = await fetch(`${RESEND_API_URL}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("[resend] send error", response.status, errBody);
    throw new Error(`Resend API ${response.status}: ${errBody.slice(0, 200)}`);
  }

  const data = (await response.json()) as { id?: string };
  return { id: data.id, skipped: false };
}

/* ───── Helper · événement Automations ─────
   Ajoute le contact à l'audience Resend (déclenche les Automations dashboard
   qui écoutent sur audience + tags d'email). Cf docs/09-integrations.md. */
type EventName =
  | "lead_magnet_downloaded"
  | "academy_completed"
  | "contact_submitted";

interface EventPayload {
  contactId?: string;
  email: string;
  firstName?: string;
  [key: string]: unknown;
}

export async function emitEvent(name: EventName, payload: EventPayload) {
  if (!apiKey) {
    console.warn("[resend] event skipped (no API key)", { name, payload });
    return { skipped: true };
  }

  const audienceId = import.meta.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    console.info("[resend] no audience configured, event tag-only", {
      name,
      email: payload.email,
    });
    return { skipped: false, audienceless: true };
  }

  const body = {
    email: payload.email,
    ...(typeof payload.firstName === "string"
      ? { first_name: payload.firstName }
      : {}),
  };

  const response = await fetch(
    `${RESEND_API_URL}/audiences/${audienceId}/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  // Idempotent : Resend retourne 200 OK pour duplicate, ou 422 selon version
  if (!response.ok && response.status !== 422) {
    const errBody = await response.text();
    console.warn("[resend] event error (non-fatal)", response.status, errBody);
    return { skipped: false, idempotent: true };
  }

  return { skipped: false };
}
