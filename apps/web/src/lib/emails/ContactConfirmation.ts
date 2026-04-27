// Email · ContactConfirmation · POST /api/contact
// Confirmation envoi form contact côté client.
import {
  wrapEmail,
  escapeHtml,
  h1Style,
  pStyle,
  mutedStyle,
  accentLinkStyle,
  cardSoftStyle,
  eyebrowStyle,
} from "./_layout";

interface Props {
  firstName?: string;
  /** Brief envoyé · pour rappel client */
  brief: string;
}

export default function ContactConfirmation({
  firstName = "bonjour",
  brief,
}: Props): string {
  const fn = escapeHtml(firstName);
  const briefSafe = escapeHtml(brief);

  const content =
    `<h1 style="${h1Style}">Reçu, ${fn}.</h1>` +
    `<p style="${pStyle}">Votre brief est arrivé chez nous. Un humain (pas un agent IA) vous répond dans les 24 heures ouvrées — souvent plus vite si la question est simple.</p>` +
    `<div style="${cardSoftStyle}">` +
    `<p style="${eyebrowStyle}">Votre brief</p>` +
    `<p style="${pStyle}margin:0;font-style:italic;">« ${briefSafe} »</p>` +
    `</div>` +
    `<p style="${pStyle}">En attendant, deux ressources qui peuvent répondre directement :</p>` +
    `<p style="${mutedStyle}">— <a href="https://waimia.com/ressources/cas/plateau" style="${accentLinkStyle}">Cas Plateau · refonte RevOps</a><br />— <a href="https://waimia.com/offres/conseil" style="${accentLinkStyle}">Hub Conseil · 7 services</a></p>` +
    `<p style="${mutedStyle}">Si urgent : <a href="mailto:bonjour@waimia.fr" style="${accentLinkStyle}">bonjour@waimia.fr</a></p>`;

  return wrapEmail(
    content,
    "Votre message est arrivé · réponse en 24h ouvrées",
  );
}
