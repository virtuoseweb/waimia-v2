/**
 * API · POST /api/lead-magnet
 * Lead magnet download → email PDF + tag séquence nurturing 14 jours.
 */
import type { APIRoute } from "astro";
import { sendEmail, EMAIL_INTERNAL_TO, emitEvent } from "../../lib/resend";
import LeadMagnetDelivery from "../../lib/emails/LeadMagnetDelivery";
import InternalLeadAlert from "../../lib/emails/InternalLeadAlert";

export const prerender = false;

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

  const { slug, email, company, role, firstName } = payload;
  const magnet = MAGNETS[slug];
  if (!email || !magnet) {
    return Response.json(
      { ok: false, error: "invalid_request" },
      { status: 400 },
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
    return Response.json({ ok: true, redirect: "/bienvenue/livre-blanc" });
  } catch (err) {
    console.error("[api/lead-magnet] error", err);
    return Response.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
};
