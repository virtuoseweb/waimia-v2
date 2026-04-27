/**
 * Email · LeadMagnetDelivery
 * Délivrance PDF livre blanc + lien tracking (custom domain track.waimia.com).
 * Trigger : POST /api/lead-magnet
 */
import { Section, Text } from "@react-email/components";
import * as React from "react";
import {
  EmailLayout,
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
}: Props) {
  return (
    <EmailLayout preview={`${title} · votre PDF est prêt`} webUrl={pageUrl}>
      <Text style={h1Style}>Le PDF est prêt, {firstName}.</Text>
      <Text style={pStyle}>
        Voici <strong>{title}</strong>. 32 pages, signé par notre équipe,
        NDA-protected pour les chiffres sensibles. Vous pouvez le télécharger en
        cliquant ci-dessous.
      </Text>

      <Section style={{ textAlign: "center" as const, padding: "20px 0" }}>
        <a href={pdfUrl} style={buttonLinkStyle}>
          Télécharger le PDF →
        </a>
      </Section>

      <Text style={mutedStyle}>
        Ce qui arrive ensuite : 3 emails sur 14 jours (1 insight RevOps · 1 cas
        Plateau · 1 invitation RDV facultative). Désinscription en 1 clic dans
        chaque email.
      </Text>
      <Text style={mutedStyle}>
        Question ?{" "}
        <a href="mailto:bonjour@waimia.fr" style={accentLinkStyle}>
          bonjour@waimia.fr
        </a>
      </Text>
    </EmailLayout>
  );
}
