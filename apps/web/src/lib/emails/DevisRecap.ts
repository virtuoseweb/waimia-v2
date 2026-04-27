// Email · DevisRecap · POST /api/devis
// Récapitulatif devis configurateur (offre flagship, ex: site web IA).
import {
  wrapEmail,
  escapeHtml,
  h1Style,
  pStyle,
  mutedStyle,
  buttonLinkStyle,
  ACCENT,
} from "./_layout";

interface Props {
  firstName?: string;
  reference: string;
  offerSlug: string;
  offerLabel: string;
  budget: "starter" | "standard" | "custom";
  brief: string;
}

const budgetLabel: Record<Props["budget"], string> = {
  starter: "Starter (≤ 10 k€)",
  standard: "Standard (10-25 k€)",
  custom: "Custom (sur devis)",
};

export default function DevisRecap({
  firstName = "bonjour",
  reference,
  offerLabel,
  budget,
  brief,
}: Props): string {
  const fn = escapeHtml(firstName);
  const refSafe = escapeHtml(reference);
  const offerSafe = escapeHtml(offerLabel);
  const briefSafe = escapeHtml(brief);
  const budgetSafe = escapeHtml(budgetLabel[budget] ?? budget);

  const content =
    `<h1 style="${h1Style}">Devis reçu, ${fn}.</h1>` +
    `<p style="${pStyle}">Voici le récapitulatif de votre demande. Notre équipe revient vers vous sous 24h ouvrées avec un audit gratuit de 10 jours en option (préalable à tout devis ferme).</p>` +
    `<div style="background:#EFEAE0;padding:22px;border-radius:8px;margin:20px 0;">` +
    `<p style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${ACCENT};margin:0 0 6px;">Référence · ${refSafe}</p>` +
    `<p style="${pStyle}margin:0 0 14px;font-weight:500;font-size:18px;">${offerSafe}</p>` +
    `<p style="${pStyle}margin:0 0 14px;"><strong>Budget visé :</strong> ${budgetSafe}</p>` +
    `<p style="${pStyle}margin:0;font-style:italic;">« ${briefSafe} »</p>` +
    `</div>` +
    `<div style="text-align:center;padding:12px 0 24px;">` +
    `<a href="https://waimia.com/contact" style="${buttonLinkStyle}">Réserver l'audit 10 jours →</a>` +
    `</div>` +
    `<p style="${mutedStyle}">Tous les chiffres sont indicatifs. Devis ferme après audit. Pas de frais cachés.</p>`;

  return wrapEmail(content, `Devis ${reference} · récap envoyé`);
}
