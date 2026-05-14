/**
 * API · POST /api/devis
 * Devis configurateur (offre flagship) → récap client + alerte interne.
 */
import type { APIRoute } from "astro";
import { sendEmail, EMAIL_INTERNAL_TO, emitEvent } from "../../lib/resend";
import DevisRecap from "../../lib/emails/DevisRecap";
import InternalLeadAlert from "../../lib/emails/InternalLeadAlert";
import { z } from "zod";

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
function msg(key: MsgKey, lang: Lang = "fr"): string {
  return (MSGS[lang] ?? MSGS.fr)[key];
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://waimia.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

const DevisSchema = z.object({
  email: z.string().email(),
  slug: z.string().min(1).max(100),
  brief: z.string().min(1).max(5000),
  company: z.string().max(100).optional(),
  firstName: z.string().max(100).optional(),
  budget: z.string().max(50).optional(),
  lang: z.enum(["fr", "en"]).optional().default("fr"),
});

const OFFERS: Record<string, string> = {
  "site-web-ia": "Site web IA-native (Astro+React 95% IA)",
  "poc-mvp-sprint": "POC MVP Sprint · agent en prod en 4 sem",
  "audit-maturite-ia": "Audit de maturité IA · 10 jours fixes",
};

function generateRef() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `WAI-${ts}-${rand}`;
}

// Workaround bug @astrojs/vercel@10 (POST exclu du bundle). Cf known-issues #1.
export const ALL: APIRoute = async ({ request }) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? request.headers.get("cf-connecting-ip") ?? "unknown";
  if (!rateOk(ip, 3, 5 * 60 * 1000)) {
    return Response.json({ ok: false, error: msg("too_many_requests") }, { status: 429, headers: CORS_HEADERS });
  }

  let rawPayload: unknown;
  try {
    const ct = request.headers.get("content-type") ?? "";
    rawPayload = ct.includes("application/json")
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {
    return Response.json({ ok: false, error: msg("invalid_body") }, { status: 400, headers: CORS_HEADERS });
  }

  const parsed = DevisSchema.safeParse(rawPayload);
  if (!parsed.success) {
    const rawLang = (rawPayload as Record<string, string>).lang === "en" ? "en" : "fr";
    return Response.json(
      { ok: false, error: msg("missing_fields", rawLang as Lang) },
      { status: 400, headers: CORS_HEADERS },
    );
  }
  const { email, lang, slug, brief, company, firstName } = parsed.data;
  const budget = (parsed.data.budget ?? "starter") as "starter" | "standard" | "custom";
  const offerLabel = OFFERS[slug] ?? `Offre ${slug}`;

  const reference = generateRef();

  try {
    await Promise.all([
      sendEmail({
        to: email,
        subject: `Devis ${reference} · ${offerLabel}`,
        html: DevisRecap({
          firstName,
          reference,
          offerSlug: slug,
          offerLabel,
          budget,
          brief,
        }),
        tags: [
          { name: "event", value: "devis_submitted" },
          { name: "offer", value: slug },
          { name: "budget", value: budget },
        ],
      }),
      sendEmail({
        to: EMAIL_INTERNAL_TO,
        subject: `[Lead] devis · ${slug} · ${budget} · ${email}`,
        html: InternalLeadAlert({
          source: "devis",
          email,
          company,
          brief,
          tags: [slug, budget],
        }),
        tags: [
          { name: "event", value: "devis_submitted" },
          { name: "kind", value: "internal" },
        ],
      }),
      emitEvent("contact_submitted", { email, firstName, reference, slug }),
    ]);
    const maskedEmail = email.replace(/(?<=.{3}).(?=.*@)/g, "*");
    console.log(JSON.stringify({ ts: new Date().toISOString(), action: "devis_submitted", ip, email: maskedEmail }));
    return Response.json({ ok: true, reference, redirect: "/bienvenue/devis" }, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("[api/devis] error", err);
    return Response.json({ ok: false, error: msg("send_failed", lang) }, { status: 500, headers: CORS_HEADERS });
  }
};
