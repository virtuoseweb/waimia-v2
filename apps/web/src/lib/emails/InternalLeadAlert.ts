// Email · InternalLeadAlert · alerte équipe Waimia interne (Slack-ready)
// Envoyé en interne sur chaque lead reçu (toutes sources).
import {
  wrapEmail,
  escapeHtml,
  h1Style,
  pStyle,
  mutedStyle,
} from "./_layout";

interface Props {
  source: "contact" | "lead-magnet" | "academy" | "devis" | "newsletter";
  email: string;
  company?: string;
  role?: string;
  brief?: string;
  /** Score academy (0-24) si source=academy */
  score?: number;
  /** Liste tags pour qualification (ex: ['hot', 'fintech']) */
  tags?: string[];
}

export default function InternalLeadAlert({
  source,
  email,
  company,
  role,
  brief,
  score,
  tags,
}: Props): string {
  const isHot = source === "academy" && score !== undefined && score < 12;
  const sourceSafe = escapeHtml(source);
  const emailSafe = escapeHtml(email);
  const companySafe = company ? escapeHtml(company) : "";
  const roleSafe = role ? escapeHtml(role) : "";
  const briefSafe = brief ? escapeHtml(brief) : "";

  const headerLabel = isHot ? "🔥 Lead chaud" : "Nouveau lead";
  const previewSuffix = isHot ? " · 🔥 hot" : "";

  const scoreLine =
    score !== undefined
      ? `<p style="${pStyle}">Score academy : <strong>${escapeHtml(score)}/24</strong> ${
          isHot
            ? "· prospect chaud (relance équipe sous 24h)"
            : "· prospect tiède"
        }</p>`
      : "";

  const briefLine = brief
    ? `<p style="${pStyle}font-style:italic;">« ${briefSafe} »</p>`
    : "";

  const tagsLine =
    tags && tags.length > 0
      ? `<p style="${mutedStyle}">Tags : ${tags.map(escapeHtml).join(" · ")}</p>`
      : "";

  const identityLine =
    `<p style="${pStyle}margin:0 0 8px;"><strong>${emailSafe}</strong>` +
    (companySafe ? ` · ${companySafe}` : "") +
    (roleSafe ? ` · ${roleSafe}` : "") +
    `</p>`;

  const content =
    `<h1 style="${h1Style}">${headerLabel} · ${sourceSafe}</h1>` +
    `<div style="background:#EFEAE0;padding:18px;border-radius:8px;margin:16px 0;">` +
    identityLine +
    scoreLine +
    briefLine +
    `</div>` +
    tagsLine +
    `<p style="${mutedStyle}">Action attendue : répondre sous 24h ouvrées (sous 4h si lead chaud).</p>`;

  return wrapEmail(content, `Lead ${source} · ${email}${previewSuffix}`);
}
