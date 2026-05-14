/**
 * API · POST /api/lead-magnet
 * Lead magnet download → email PDF + tag séquence nurturing 14 jours.
 */
import type { APIRoute } from "astro";
import { sendEmail, EMAIL_INTERNAL_TO, emitEvent } from "../../lib/resend";
import LeadMagnetDelivery from "../../lib/emails/LeadMagnetDelivery";
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

const LeadMagnetSchema = z.object({
  email: z.string().email(),
  slug: z.string().min(1).max(100),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  firstName: z.string().max(100).optional(),
  lang: z.enum(["fr", "en"]).optional().default("fr"),
});

// Workaround bug @astrojs/vercel@10 (POST exclu du bundle). Cf known-issues #1.

const MAGNETS: Record<string, { title: string; pdfUrl: string }> = {
  "ai-act-readiness": {
    title: "Êtes-vous prêt pour l'AI Act ? · Checklist 47 critères",
    pdfUrl: "https://waimia.com/pdf/ai-act-readiness.pdf",
  },
  "revops-guide": {
    title: "Guide RevOps · Réconcilier CRM, entrepôt et finance",
    pdfUrl: "https://waimia.com/pdf/revops-guide.pdf",
  },
};

export const ALL: APIRoute = async ({ request }) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? request.headers.get("cf-connecting-ip") ?? "unknown";
  if (!rateOk(ip, 5, 10 * 60 * 1000)) {
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

  const parsed = LeadMagnetSchema.safeParse(rawPayload);
  if (!parsed.success) {
    const rawLang = (rawPayload as Record<string, string>).lang === "en" ? "en" : "fr";
    return Response.json(
      { ok: false, error: msg("invalid_request", rawLang as Lang) },
      { status: 400, headers: CORS_HEADERS },
    );
  }
  const { email, lang, slug, company, role, firstName } = parsed.data;
  const magnet = MAGNETS[slug];
  if (!magnet) {
    return Response.json(
      { ok: false, error: msg("invalid_request", lang) },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const pageUrl = `https://waimia.com/ressources/livres-blancs/${slug}`;

  try {
    await Promise.all([
      sendEmail({
        to: email,
        subject: `${magnet.title} · votre PDF`,
        html: LeadMagnetDelivery({
          firstName,
          title: magnet.title,
          pdfUrl: magnet.pdfUrl,
          pageUrl,
        }),
        tags: [
          { name: "event", value: "lead_magnet_downloaded" },
          { name: "magnet", value: slug },
        ],
      }),
      sendEmail({
        to: EMAIL_INTERNAL_TO,
        subject: `[Lead] livre-blanc · ${slug} · ${email}`,
        html: InternalLeadAlert({
          source: "lead-magnet",
          email,
          company,
          role,
          tags: [slug],
        }),
        tags: [
          { name: "event", value: "lead_magnet_downloaded" },
          { name: "kind", value: "internal" },
        ],
      }),
      emitEvent("lead_magnet_downloaded", { email, firstName, slug }),
    ]);
    const maskedEmail = email.replace(/(?<=.{3}).(?=.*@)/g, "*");
    console.log(JSON.stringify({ ts: new Date().toISOString(), action: "lead_magnet_downloaded", ip, email: maskedEmail }));
    return Response.json({ ok: true, redirect: "/bienvenue/livre-blanc" }, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("[api/lead-magnet] error", err);
    return Response.json({ ok: false, error: msg("send_failed", lang) }, { status: 500, headers: CORS_HEADERS });
  }
};
