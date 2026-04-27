/**
 * API · POST /api/newsletter
 * Newsletter signup → welcome email + tag pour Resend Automations.
 */
import type { APIRoute } from "astro";
import { sendEmail, emitEvent } from "../../lib/resend";
import WelcomeNewsletter from "../../lib/emails/WelcomeNewsletter";

export const prerender = false;

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

  const { email, firstName } = payload;
  if (!email || !email.includes("@")) {
    return Response.json(
      { ok: false, error: "invalid_email" },
      { status: 400 },
    );
  }

  try {
    await sendEmail({
      to: email,
      subject: "Bienvenue · Waimia",
      react: WelcomeNewsletter({ firstName }),
      tags: [{ name: "event", value: "newsletter_signup" }],
    });
    await emitEvent("contact_submitted", { email, firstName });
    return Response.json({ ok: true, redirect: "/bienvenue/newsletter" });
  } catch (err) {
    console.error("[api/newsletter] error", err);
    return Response.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
};
