/**
 * API · POST /api/contact
 * Form contact → 2 emails (client confirmation + équipe alert).
 */
import type { APIRoute } from "astro";
import { sendEmail, EMAIL_INTERNAL_TO, emitEvent } from "../../lib/resend";

// Imports dynamiques des templates email · évite que @react-email/components
// fasse partie du graphe d'import statique du bundle SSR Astro/Vite, qui
// excluait silencieusement la route /api/contact en prod (cf known-issues #1).

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
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
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const { name, email, company, role, brief } = payload;
  if (!email || !brief) {
    return Response.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }

  const firstName = name?.split(" ")[0] ?? undefined;
  try {
    const [{ default: ContactConfirmation }, { default: InternalLeadAlert }] =
      await Promise.all([
        import("../../lib/emails/ContactConfirmation"),
        import("../../lib/emails/InternalLeadAlert"),
      ]);
    await Promise.all([
      sendEmail({
        to: email,
        subject: "Votre brief est arrivé · Waimia",
        react: ContactConfirmation({ firstName, brief }),
        tags: [{ name: "event", value: "contact_submitted" }],
        replyTo: EMAIL_INTERNAL_TO,
      }),
      sendEmail({
        to: EMAIL_INTERNAL_TO,
        subject: `[Lead] contact · ${email}${company ? " · " + company : ""}`,
        react: InternalLeadAlert({
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
    return Response.json({ ok: true, redirect: "/bienvenue/contact" });
  } catch (err) {
    console.error("[api/contact] error", err);
    return Response.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
};
