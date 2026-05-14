/**
 * API · POST /api/contact
 * Form contact → 2 emails (client confirmation + équipe alert).
 */
import type { APIRoute } from "astro";
import { sendEmail, EMAIL_INTERNAL_TO, emitEvent } from "../../lib/resend";
import ContactConfirmation from "../../lib/emails/ContactConfirmation";
import InternalLeadAlert from "../../lib/emails/InternalLeadAlert";

export const prerender = false;

const _rl = new Map<string, { n: number; resetAt: number }>();

function rateOk(ip: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const e = _rl.get(ip);
  if (!e || e.resetAt < now) { _rl.set(ip, { n: 1, resetAt: now + windowMs }); return true; }
  if (e.n >= max) return false;
  e.n++;
  return true;
}

const MSGS = {
  fr: {
    missing_email: "Email manquant ou invalide.",
    missing_fields: "Champs requis manquants.",
    invalid_email: "Email invalide.",
    invalid_request: "Requête invalide.",
    send_failed: "Erreur lors de l'envoi. Veuillez réessayer.",
    too_many_requests: "Trop de tentatives. Veuillez patienter.",
    invalid_body: "Corps de la requête invalide.",
  },
  en: {
    missing_email: "Missing or invalid email.",
    missing_fields: "Required fields missing.",
    invalid_email: "Invalid email address.",
    invalid_request: "Invalid request.",
    send_failed: "Send error. Please try again.",
    too_many_requests: "Too many attempts. Please wait.",
    invalid_body: "Invalid request body.",
  },
} as const;

type Lang = keyof typeof MSGS;
type MsgKey = keyof typeof MSGS.fr;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function msg(key: MsgKey, lang: Lang = "fr"): string {
  return (MSGS[lang] ?? MSGS.fr)[key];
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://waimia.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

// Bug @astrojs/vercel@10 adapter : `export const POST` exclu du bundle SSR
// monorepo. Workaround validé empiriquement : utiliser `ALL` + dispatch
// méthode interne. Cf docs/known-issues.md #1. Reverser en POST direct
// quand le bug upstream sera fixé.
export const ALL: APIRoute = async ({ request }) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? request.headers.get("cf-connecting-ip") ?? "unknown";
  if (!rateOk(ip, 3, 5 * 60 * 1000)) {
    return Response.json({ ok: false, error: msg("too_many_requests") }, { status: 429, headers: CORS_HEADERS });
  }

  let payload: Record<string, string>;
  try {
    const ct = request.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      payload = await request.json();
    } else {
      const fd = await request.formData();
      payload = Object.fromEntries(fd.entries()) as Record<string, string>;
    }
  } catch {
    return Response.json({ ok: false, error: msg("invalid_body") }, { status: 400, headers: CORS_HEADERS });
  }

  const lang: Lang = payload.lang === "en" ? "en" : "fr";
  const { name, email, company, role, brief } = payload;
  if (!email || !EMAIL_RE.test(email) || !brief) {
    return Response.json(
      { ok: false, error: msg("missing_fields", lang) },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const firstName = name?.split(" ")[0] ?? undefined;
  try {
    await Promise.all([
      sendEmail({
        to: email,
        subject: "Votre brief est arrivé · Waimia",
        html: ContactConfirmation({ firstName, brief }),
        tags: [{ name: "event", value: "contact_submitted" }],
        replyTo: EMAIL_INTERNAL_TO,
      }),
      sendEmail({
        to: EMAIL_INTERNAL_TO,
        subject: `[Lead] contact · ${email}${company ? " · " + company : ""}`,
        html: InternalLeadAlert({
          source: "contact",
          email,
          company,
          role,
          brief,
        }),
        tags: [
          { name: "event", value: "contact_submitted" },
          { name: "kind", value: "internal" },
        ],
      }),
      emitEvent("contact_submitted", { email, firstName }),
    ]);
    const maskedEmail = email.replace(/(?<=.{3}).(?=.*@)/g, "*");
    console.log(JSON.stringify({ ts: new Date().toISOString(), action: "contact_submitted", ip, email: maskedEmail }));
    return Response.json({ ok: true, redirect: "/bienvenue/contact" }, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("[api/contact] error", err);
    return Response.json({ ok: false, error: msg("send_failed", lang) }, { status: 500, headers: CORS_HEADERS });
  }
};
