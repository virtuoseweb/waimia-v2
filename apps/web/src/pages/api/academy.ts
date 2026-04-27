/**
 * API · POST /api/academy
 * Diagnostic 12 questions → scorecard + email résultats + alerte si hot lead.
 */
import type { APIRoute } from "astro";
import { sendEmail, EMAIL_INTERNAL_TO, emitEvent } from "../../lib/resend";
import AcademyResults from "../../lib/emails/AcademyResults";
import InternalLeadAlert from "../../lib/emails/InternalLeadAlert";

export const prerender = false;

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

export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, string>;
  try {
    const ct = request.headers.get("content-type") ?? "";
    payload = ct.includes("application/json")
      ? await request.json()
      : (Object.fromEntries(await request.formData()) as Record<
          string,
          string
        >);
  } catch {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // 12 questions q1-q12 attendues, scores 0-2 chacune (max 24)
  let score = 0;
  for (let i = 1; i <= 12; i++) {
    const v = parseInt(payload[`q${i}`] ?? "0", 10);
    if (!isNaN(v)) score += Math.max(0, Math.min(2, v));
  }
  const { email, firstName, company, role } = payload;
  if (!email) {
    return Response.json(
      { ok: false, error: "missing_email" },
      { status: 400 },
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
    return Response.json({
      ok: true,
      score,
      category,
      redirect: "/bienvenue/academy",
    });
  } catch (err) {
    console.error("[api/academy] error", err);
    return Response.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
};
