/**
 * API · POST /api/academy
 * Diagnostic 12 questions → scorecard + email résultats + alerte si hot lead.
 */
import type { APIRoute } from "astro";
import { sendEmail, EMAIL_INTERNAL_TO, emitEvent } from "../../lib/resend";
import AcademyResults from "../../lib/emails/AcademyResults";
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

function categorize(score: number): "discovery" | "building" | "mature" {
  if (score < 9) return "discovery";
  if (score < 17) return "building";
  return "mature";
}

const NEXT_ACTIONS_BY_CAT = {
  discovery: [
    {
      title: "Audit de maturité IA · 10 jours fixes",
      effort: "10 j",
      impact: "Carte précise du chantier",
    },
    {
      title: "Définir une source de vérité unique sur le funnel",
      effort: "4 sem",
      impact: "Stoppe les débats comité",
    },
    {
      title: "Choisir 1 cas d'usage IA livrable en 6 sem",
      effort: "1 sprint",
      impact: "Valide l'approche",
    },
  ],
  building: [
    {
      title: "Audit gouvernance & qualité données",
      effort: "4 sem",
      impact: "Élimine 47 contradictions silencieuses",
    },
    {
      title: "Mettre en place trail audit re-rejouable",
      effort: "3 sem",
      impact: "Conformité AI Act",
    },
    {
      title: "Auditer la facture LLM (FinOps)",
      effort: "2 sem",
      impact: "−40 à −70 % des coûts",
    },
  ],
  mature: [
    {
      title: "Pen test des agents IA déployés",
      effort: "3-6 sem",
      impact: "Détection vecteurs prompt injection",
    },
    {
      title: "Migration RPA → agents Claude",
      effort: "3 sem",
      impact: "Élimine la dette RPA fantôme",
    },
    {
      title: "Documenter Annexe IV AI Act",
      effort: "4 sem",
      impact: "Exportable régulateur ACPR",
    },
  ],
};

// Workaround bug @astrojs/vercel@10 (POST exclu du bundle). Cf known-issues #1.
export const ALL: APIRoute = async ({ request }) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? request.headers.get("cf-connecting-ip") ?? "unknown";
  if (!rateOk(ip, 5, 10 * 60 * 1000)) {
    return Response.json({ ok: false, error: msg("too_many_requests") }, { status: 429, headers: CORS_HEADERS });
  }

  let payload: Record<string, string>;
  try {
    const ct = request.headers.get("content-type") ?? "";
    payload = ct.includes("application/json")
      ? await request.json()
      : (Object.fromEntries(await request.formData()) as Record<string, string>);
  } catch {
    return Response.json({ ok: false, error: msg("invalid_body") }, { status: 400, headers: CORS_HEADERS });
  }

  const lang: Lang = payload.lang === "en" ? "en" : "fr";

  // 12 questions q1-q12 attendues, scores 0-2 chacune (max 24)
  let score = 0;
  for (let i = 1; i <= 12; i++) {
    const v = parseInt(payload[`q${i}`] ?? "0", 10);
    if (!isNaN(v)) score += Math.max(0, Math.min(2, v));
  }
  const { email, firstName, company, role } = payload;
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json(
      { ok: false, error: msg("missing_email", lang) },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const category = categorize(score);
  const isHot = score < 12;
  const nextActions = NEXT_ACTIONS_BY_CAT[category];

  try {
    await Promise.all([
      sendEmail({
        to: email,
        subject: `Votre scorecard · ${score}/24`,
        html: AcademyResults({ firstName, score, category, nextActions }),
        tags: [
          { name: "event", value: "academy_completed" },
          { name: "score-category", value: category },
        ],
      }),
      sendEmail({
        to: EMAIL_INTERNAL_TO,
        subject: `[Lead${isHot ? " 🔥" : ""}] academy · ${score}/24 · ${email}`,
        html: InternalLeadAlert({
          source: "academy",
          email,
          company,
          role,
          score,
          tags: isHot ? ["hot", category] : [category],
        }),
        tags: [
          { name: "event", value: "academy_completed" },
          { name: "kind", value: "internal" },
        ],
      }),
      emitEvent("academy_completed", { email, firstName, score, category }),
    ]);
    const maskedEmail = email.replace(/(?<=.{3}).(?=.*@)/g, "*");
    console.log(JSON.stringify({ ts: new Date().toISOString(), action: "academy_completed", ip, email: maskedEmail }));
    return Response.json(
      { ok: true, score, category, redirect: "/bienvenue/academy" },
      { status: 200, headers: CORS_HEADERS },
    );
  } catch (err) {
    console.error("[api/academy] error", err);
    return Response.json({ ok: false, error: msg("send_failed", lang) }, { status: 500, headers: CORS_HEADERS });
  }
};
