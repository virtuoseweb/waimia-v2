/**
 * API · POST /api/contact
 * Form contact → 2 emails (client confirmation + équipe alert).
 */
import type { APIRoute } from "astro";
import { sendEmail, EMAIL_INTERNAL_TO, emitEvent } from "../../lib/resend";
import ContactConfirmation from "../../lib/emails/ContactConfirmation";
import InternalLeadAlert from "../../lib/emails/InternalLeadAlert";

export const prerender = false;

// Bug @astrojs/vercel@10 adapter : `export const POST` exclu du bundle SSR
// monorepo. Workaround validé empiriquement : utiliser `ALL` + dispatch
// méthode interne. Cf docs/known-issues.md #1. Reverser en POST direct
// quand le bug upstream sera fixé.
export const ALL: APIRoute = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
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
    return Response.json({ ok: true, redirect: "/bienvenue/contact" });
  } catch (err) {
    console.error("[api/contact] error", err);
    return Response.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
};
