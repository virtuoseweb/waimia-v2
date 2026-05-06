/**
 * Local Waimia patch (upstream-impact, see .local-scripts/SMTP-FIX.md)
 *
 * Reason: nodemailer over Resend SMTP (smtp.resend.com:465) hangs/fails on
 * Vercel Lambda outbound. The Resend HTTPS API works reliably for the same
 * RESEND_API_KEY/EMAIL_FROM pair. This helper bypasses nodemailer entirely
 * and POSTs to https://api.resend.com/emails.
 *
 * Activated at runtime by _base-email.ts when RESEND_API_KEY is present and
 * RESEND_USE_HTTPS !== "false".
 */

type Headers = Record<string, string>;

type ResendPayload = {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  reply_to?: string | string[];
  headers?: Headers;
  attachments?: Array<{
    filename: string;
    content: string; // base64
  }>;
};

function toArray(value: unknown): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

function bufferToBase64(content: unknown): string {
  if (typeof content === "string") {
    // Assume the caller already encoded; otherwise treat as utf-8 text.
    return Buffer.from(content, "utf-8").toString("base64");
  }
  if (Buffer.isBuffer(content)) return content.toString("base64");
  if (content instanceof Uint8Array) return Buffer.from(content).toString("base64");
  return "";
}

function mapAttachments(
  payload: Record<string, unknown>
): ResendPayload["attachments"] | undefined {
  const raw = payload.attachments;
  if (!Array.isArray(raw)) return undefined;
  const mapped = raw
    .map((att) => {
      if (!att || typeof att !== "object") return null;
      const { filename, content } = att as { filename?: unknown; content?: unknown };
      if (typeof filename !== "string") return null;
      const base64 = bufferToBase64(content);
      if (!base64) return null;
      return { filename, content: base64 };
    })
    .filter((x): x is { filename: string; content: string } => x !== null);
  return mapped.length > 0 ? mapped : undefined;
}

export function shouldUseResendHttps(): boolean {
  if (!process.env.RESEND_API_KEY) return false;
  if (process.env.RESEND_USE_HTTPS === "false") return false;
  return true;
}

export async function sendViaResendHttps(
  payload: Record<string, unknown>
): Promise<{ id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from = typeof payload.from === "string" ? payload.from : process.env.EMAIL_FROM;
  if (!from) throw new Error("Resend HTTPS: missing 'from' (and EMAIL_FROM)");

  const to = toArray(payload.to);
  if (!to || to.length === 0) throw new Error("Resend HTTPS: missing 'to'");

  const subject = typeof payload.subject === "string" ? payload.subject : "";

  const body: ResendPayload = {
    from,
    to,
    subject,
    html: typeof payload.html === "string" ? payload.html : undefined,
    text: typeof payload.text === "string" ? payload.text : undefined,
    cc: toArray(payload.cc),
    bcc: toArray(payload.bcc),
    reply_to: toArray(payload.replyTo) ?? toArray(payload.reply_to),
    headers: (payload.headers as Headers | undefined) ?? undefined,
    attachments: mapAttachments(payload),
  };

  // Drop undefined keys for a clean request body.
  const cleanBody = Object.fromEntries(
    Object.entries(body).filter(([, value]) => value !== undefined)
  );

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(cleanBody),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "<no body>");
    throw new Error(
      `Resend HTTPS error: ${response.status} ${response.statusText} — ${text.slice(0, 500)}`
    );
  }

  const json = (await response.json().catch(() => ({}))) as { id?: string };
  return json;
}
