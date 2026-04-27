/**
 * API · POST /api/devis
 * Devis configurateur (offre flagship) → récap client + alerte interne.
 */
import type { APIRoute } from "astro";
import { sendEmail, EMAIL_INTERNAL_TO, emitEvent } from "../../lib/resend";
import DevisRecap from "../../lib/emails/DevisRecap";
import InternalLeadAlert from "../../lib/emails/InternalLeadAlert";

export const prerender = false;

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
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }
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

  const { slug, email, company, brief, firstName } = payload;
  const budget = (payload.budget ?? "starter") as
    | "starter"
    | "standard"
    | "custom";
  const offerLabel = OFFERS[slug] ?? `Offre ${slug}`;

  if (!email || !brief || !slug) {
    return Response.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }

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
    return Response.json({ ok: true, reference, redirect: "/bienvenue/devis" });
  } catch (err) {
    console.error("[api/devis] error", err);
    return Response.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
};
