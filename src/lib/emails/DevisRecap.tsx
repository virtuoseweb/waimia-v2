/**
 * Email · DevisRecap
 * Récapitulatif devis configurateur (offre flagship, ex: site web IA).
 * Trigger : POST /api/devis
 */
import { Section, Text } from "@react-email/components";
import * as React from "react";
import {
  EmailLayout,
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

const budgetLabel = {
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
}: Props) {
  return (
    <EmailLayout preview={`Devis ${reference} · récap envoyé`}>
      <Text style={h1Style}>Devis reçu, {firstName}.</Text>
      <Text style={pStyle}>
        Voici le récapitulatif de votre demande. Notre équipe revient vers vous
        sous 24h ouvrées avec un audit gratuit de 10 jours en option (préalable
        à tout devis ferme).
      </Text>

      <Section
        style={{
          background: "#EFEAE0",
          padding: 22,
          borderRadius: 8,
          margin: "20px 0",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: ACCENT,
            margin: "0 0 6px",
          }}
        >
          Référence · {reference}
        </Text>
        <Text
          style={{
            ...pStyle,
            margin: "0 0 14px",
            fontWeight: 500,
            fontSize: 18,
          }}
        >
          {offerLabel}
        </Text>
        <Text style={{ ...pStyle, margin: "0 0 14px" }}>
          <strong>Budget visé :</strong> {budgetLabel[budget]}
        </Text>
        <Text style={{ ...pStyle, margin: 0, fontStyle: "italic" }}>
          « {brief} »
        </Text>
      </Section>

      <Section style={{ textAlign: "center" as const, padding: "12px 0 24px" }}>
        <a href="https://waimia.com/contact" style={buttonLinkStyle}>
          Réserver l'audit 10 jours →
        </a>
      </Section>

      <Text style={mutedStyle}>
        Tous les chiffres sont indicatifs. Devis ferme après audit. Pas de frais
        cachés.
      </Text>
    </EmailLayout>
  );
}
