import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import { sendEmail, EMAIL_INTERNAL_TO, emitEvent } from "../lib/resend";
import ContactConfirmation from "../lib/emails/ContactConfirmation";
import InternalLeadAlert from "../lib/emails/InternalLeadAlert";
import AcademyResults from "../lib/emails/AcademyResults";
import WelcomeNewsletter from "../lib/emails/WelcomeNewsletter";
import DevisRecap from "../lib/emails/DevisRecap";
import LeadMagnetDelivery from "../lib/emails/LeadMagnetDelivery";
import { rateLimit, getClientIp, logSubmission, setSubmittedCookie, msg } from "./_shared";

const OFFERS: Record<string, string> = {
  "site-web-ia": "Site web IA-native (Astro+React 95% IA)",
  "poc-mvp-sprint": "POC MVP Sprint · agent en prod en 4 sem",
  "audit-maturite-ia": "Audit de maturité IA · 10 jours fixes",
};

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

const NEXT_ACTIONS_BY_CAT = {
  discovery: [
    { title: "Audit de maturité IA · 10 jours fixes", effort: "10 j", impact: "Carte précise du chantier" },
    { title: "Définir une source de vérité unique sur le funnel", effort: "4 sem", impact: "Stoppe les débats comité" },
    { title: "Choisir 1 cas d'usage IA livrable en 6 sem", effort: "1 sprint", impact: "Valide l'approche" },
  ],
  building: [
    { title: "Audit gouvernance & qualité données", effort: "4 sem", impact: "Élimine 47 contradictions silencieuses" },
    { title: "Mettre en place trail audit re-rejouable", effort: "3 sem", impact: "Conformité AI Act" },
    { title: "Auditer la facture LLM (FinOps)", effort: "2 sem", impact: "−40 à −70 % des coûts" },
  ],
  mature: [
    { title: "Pen test des agents IA déployés", effort: "3-6 sem", impact: "Détection vecteurs prompt injection" },
    { title: "Migration RPA → agents Claude", effort: "3 sem", impact: "Élimine la dette RPA fantôme" },
    { title: "Documenter Annexe IV AI Act", effort: "4 sem", impact: "Exportable régulateur ACPR" },
  ],
};

function categorize(score: number): "discovery" | "building" | "mature" {
  if (score < 9) return "discovery";
  if (score < 17) return "building";
  return "mature";
}

function generateRef(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `WAI-${ts}-${rand}`;
}

export const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      email: z.email(),
      name: z.string().max(100).optional(),
      brief: z.string().min(1).max(5000),
      company: z.string().max(100).optional(),
      role: z.string().max(100).optional(),
      lang: z.enum(["fr", "en"]).optional().default("fr"),
      _hp: z.string().optional(),
    }),
    handler: async (input, context) => {
      if (input._hp) return { ok: true, redirect: "/bienvenue/contact" };

      const ip = getClientIp(context.request.headers);
      const { ok } = await rateLimit({ ip, action: "contact", max: 3, windowMs: 5 * 60 * 1000 });
      if (!ok) {
        throw new ActionError({ code: "TOO_MANY_REQUESTS", message: msg("too_many_requests", input.lang) });
      }

      const { email, lang, name, brief, company, role } = input;
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
            html: InternalLeadAlert({ source: "contact", email, company, role, brief }),
            tags: [
              { name: "event", value: "contact_submitted" },
              { name: "kind", value: "internal" },
            ],
          }),
          emitEvent("contact_submitted", { email, firstName }),
        ]);
        logSubmission({ ip, action: "contact_submitted", email });
        setSubmittedCookie(context.cookies, "contact");
        return { ok: true, redirect: "/bienvenue/contact" };
      } catch (err) {
        console.error("[actions/contact] error", err);
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR", message: msg("send_failed", lang) });
      }
    },
  }),

  newsletter: defineAction({
    accept: "form",
    input: z.object({
      email: z.email(),
      firstName: z.string().max(100).optional(),
      lang: z.enum(["fr", "en"]).optional().default("fr"),
      _hp: z.string().optional(),
    }),
    handler: async (input, context) => {
      if (input._hp) return { ok: true, redirect: "/bienvenue/newsletter" };

      const ip = getClientIp(context.request.headers);
      const { ok } = await rateLimit({ ip, action: "newsletter", max: 5, windowMs: 10 * 60 * 1000 });
      if (!ok) {
        throw new ActionError({ code: "TOO_MANY_REQUESTS", message: msg("too_many_requests", input.lang) });
      }

      const { email, lang, firstName } = input;

      try {
        await sendEmail({
          to: email,
          subject: "Bienvenue · Waimia",
          html: WelcomeNewsletter({ firstName }),
          tags: [{ name: "event", value: "newsletter_signup" }],
        });
        await emitEvent("contact_submitted", { email, firstName });
        logSubmission({ ip, action: "newsletter_signup", email });
        setSubmittedCookie(context.cookies, "newsletter");
        return {
          ok: true,
          redirect: lang === "en" ? "/en/bienvenue/newsletter" : "/bienvenue/newsletter",
        };
      } catch (err) {
        console.error("[actions/newsletter] error", err);
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR", message: msg("send_failed", lang) });
      }
    },
  }),

  academy: defineAction({
    accept: "form",
    input: z.object({
      email: z.email(),
      firstName: z.string().max(100).optional(),
      company: z.string().max(100).optional(),
      role: z.string().max(100).optional(),
      lang: z.enum(["fr", "en"]).optional().default("fr"),
      _hp: z.string().optional(),
      q1: z.coerce.number().int().min(0).max(3).optional(),
      q2: z.coerce.number().int().min(0).max(3).optional(),
      q3: z.coerce.number().int().min(0).max(3).optional(),
      q4: z.coerce.number().int().min(0).max(3).optional(),
      q5: z.coerce.number().int().min(0).max(3).optional(),
      q6: z.coerce.number().int().min(0).max(3).optional(),
      q7: z.coerce.number().int().min(0).max(3).optional(),
      q8: z.coerce.number().int().min(0).max(3).optional(),
      q9: z.coerce.number().int().min(0).max(3).optional(),
      q10: z.coerce.number().int().min(0).max(3).optional(),
      q11: z.coerce.number().int().min(0).max(3).optional(),
      q12: z.coerce.number().int().min(0).max(3).optional(),
    }),
    handler: async (input, context) => {
      if (input._hp) return { ok: true, redirect: "/bienvenue/academy", score: 0, category: "discovery" as const };

      const ip = getClientIp(context.request.headers);
      const { ok } = await rateLimit({ ip, action: "academy", max: 5, windowMs: 10 * 60 * 1000 });
      if (!ok) {
        throw new ActionError({ code: "TOO_MANY_REQUESTS", message: msg("too_many_requests", input.lang) });
      }

      const { email, lang, firstName, company, role } = input;

      // Score 0-24 (12 questions × max 2 pts)
      const qs = [input.q1, input.q2, input.q3, input.q4, input.q5, input.q6,
                  input.q7, input.q8, input.q9, input.q10, input.q11, input.q12];
      let score = 0;
      for (const v of qs) {
        if (v !== undefined) score += Math.max(0, Math.min(2, v));
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
        logSubmission({ ip, action: "academy_completed", email });
        setSubmittedCookie(context.cookies, "academy");
        return { ok: true, score, category, redirect: "/bienvenue/academy" };
      } catch (err) {
        console.error("[actions/academy] error", err);
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR", message: msg("send_failed", lang) });
      }
    },
  }),

  devis: defineAction({
    accept: "form",
    input: z.object({
      email: z.email(),
      slug: z.string().min(1).max(100),
      brief: z.string().min(1).max(5000),
      company: z.string().max(100).optional(),
      firstName: z.string().max(100).optional(),
      budget: z.enum(["starter", "standard", "custom"]).optional().default("starter"),
      lang: z.enum(["fr", "en"]).optional().default("fr"),
      _hp: z.string().optional(),
    }),
    handler: async (input, context) => {
      if (input._hp) return { ok: true, redirect: "/bienvenue/devis", reference: "" };

      const ip = getClientIp(context.request.headers);
      const { ok } = await rateLimit({ ip, action: "devis", max: 3, windowMs: 5 * 60 * 1000 });
      if (!ok) {
        throw new ActionError({ code: "TOO_MANY_REQUESTS", message: msg("too_many_requests", input.lang) });
      }

      const { email, lang, slug, brief, company, firstName, budget } = input;
      const offerLabel = OFFERS[slug] ?? `Offre ${slug}`;
      const reference = generateRef();

      try {
        await Promise.all([
          sendEmail({
            to: email,
            subject: `Devis ${reference} · ${offerLabel}`,
            html: DevisRecap({ firstName, reference, offerSlug: slug, offerLabel, budget, brief }),
            tags: [
              { name: "event", value: "devis_submitted" },
              { name: "offer", value: slug },
              { name: "budget", value: budget },
            ],
          }),
          sendEmail({
            to: EMAIL_INTERNAL_TO,
            subject: `[Lead] devis · ${slug} · ${budget} · ${email}`,
            html: InternalLeadAlert({ source: "devis", email, company, brief, tags: [slug, budget] }),
            tags: [
              { name: "event", value: "devis_submitted" },
              { name: "kind", value: "internal" },
            ],
          }),
          emitEvent("contact_submitted", { email, firstName, reference, slug }),
        ]);
        logSubmission({ ip, action: "devis_submitted", email });
        setSubmittedCookie(context.cookies, "devis");
        return { ok: true, reference, redirect: "/bienvenue/devis" };
      } catch (err) {
        console.error("[actions/devis] error", err);
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR", message: msg("send_failed", lang) });
      }
    },
  }),

  leadMagnet: defineAction({
    accept: "form",
    input: z.object({
      email: z.email(),
      slug: z.string().min(1).max(100),
      company: z.string().max(100).optional(),
      role: z.string().max(100).optional(),
      firstName: z.string().max(100).optional(),
      lang: z.enum(["fr", "en"]).optional().default("fr"),
      _hp: z.string().optional(),
    }),
    handler: async (input, context) => {
      if (input._hp) return { ok: true, redirect: "/bienvenue/livre-blanc" };

      const ip = getClientIp(context.request.headers);
      const { ok } = await rateLimit({ ip, action: "leadMagnet", max: 5, windowMs: 10 * 60 * 1000 });
      if (!ok) {
        throw new ActionError({ code: "TOO_MANY_REQUESTS", message: msg("too_many_requests", input.lang) });
      }

      const { email, lang, slug, company, role, firstName } = input;
      const magnet = MAGNETS[slug];
      if (!magnet) {
        throw new ActionError({ code: "BAD_REQUEST", message: msg("invalid_request", lang) });
      }

      const pageUrl = `https://waimia.com/ressources/livres-blancs/${slug}`;

      try {
        await Promise.all([
          sendEmail({
            to: email,
            subject: `${magnet.title} · votre PDF`,
            html: LeadMagnetDelivery({ firstName, title: magnet.title, pdfUrl: magnet.pdfUrl, pageUrl }),
            tags: [
              { name: "event", value: "lead_magnet_downloaded" },
              { name: "magnet", value: slug },
            ],
          }),
          sendEmail({
            to: EMAIL_INTERNAL_TO,
            subject: `[Lead] livre-blanc · ${slug} · ${email}`,
            html: InternalLeadAlert({ source: "lead-magnet", email, company, role, tags: [slug] }),
            tags: [
              { name: "event", value: "lead_magnet_downloaded" },
              { name: "kind", value: "internal" },
            ],
          }),
          emitEvent("lead_magnet_downloaded", { email, firstName, slug }),
        ]);
        logSubmission({ ip, action: "lead_magnet_downloaded", email });
        setSubmittedCookie(context.cookies, "lead-magnet");
        return { ok: true, redirect: "/bienvenue/livre-blanc" };
      } catch (err) {
        console.error("[actions/leadMagnet] error", err);
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR", message: msg("send_failed", lang) });
      }
    },
  }),
};
