// Email · LeadMagnetDelivery · POST /api/lead-magnet
// Délivrance PDF livre blanc + lien tracking (custom domain track.waimia.com).
import {
  wrapEmail,
  escapeHtml,
  escapeUrl,
  h1Style,
  pStyle,
  mutedStyle,
  buttonLinkStyle,
  accentLinkStyle,
} from "./_layout";

interface Props {
  firstName?: string;
  /** Titre du livre blanc */
  title: string;
  /** URL du PDF (signed url ou tracked link) */
  pdfUrl: string;
  /** URL canonique de la page lead magnet pour rappel */
  pageUrl: string;
}

export default function LeadMagnetDelivery({
  firstName = "bonjour",
  title,
  pdfUrl,
  pageUrl,
}: Props): string {
  const fn = escapeHtml(firstName);
  const titleSafe = escapeHtml(title);
  const pdfHref = escapeUrl(pdfUrl);

  const content =
    `<h1 style="${h1Style}">Le PDF est prêt, ${fn}.</h1>` +
    `<p style="${pStyle}">Voici <strong>${titleSafe}</strong>. 32 pages, signé par notre équipe, NDA-protected pour les chiffres sensibles. Vous pouvez le télécharger en cliquant ci-dessous.</p>` +
    `<div style="text-align:center;padding:20px 0;">` +
    `<a href="${pdfHref}" style="${buttonLinkStyle}">Télécharger le PDF →</a>` +
    `</div>` +
    `<p style="${mutedStyle}">Ce qui arrive ensuite : 3 emails sur 14 jours (1 insight RevOps · 1 cas Plateau · 1 invitation RDV facultative). Désinscription en 1 clic dans chaque email.</p>` +
    `<p style="${mutedStyle}">Question ? <a href="mailto:bonjour@waimia.fr" style="${accentLinkStyle}">bonjour@waimia.fr</a></p>`;

  return wrapEmail(content, `${title} · votre PDF est prêt`, pageUrl);
}
