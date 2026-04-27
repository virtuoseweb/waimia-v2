/**
 * Email · ContactConfirmation
 * Confirmation envoi form contact côté client.
 * Trigger : POST /api/contact
 */
import { Section, Text } from "@react-email/components";
import * as React from "react";
import {
  EmailLayout,
  h1Style,
  pStyle,
  mutedStyle,
  accentLinkStyle,
} from "./_layout";

interface Props {
  firstName?: string;
  /** Brief envoyé · pour rappel client */
  brief: string;
}

export default function ContactConfirmation({
  firstName = "bonjour",
  brief,
}: Props) {
  return (
    <EmailLayout preview="Votre message est arrivé · réponse en 24h ouvrées">
      <Text style={h1Style}>Reçu, {firstName}.</Text>
      <Text style={pStyle}>
        Votre brief est arrivé chez nous. Un humain (pas un agent IA) vous
        répond dans les 24 heures ouvrées — souvent plus vite si la question est
        simple.
      </Text>

      <Section
        style={{
          background: "#EFEAE0",
          padding: "18px 22px",
          borderRadius: 8,
          margin: "20px 0",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#7A6F60",
            margin: "0 0 8px",
          }}
        >
          Votre brief
        </Text>
        <Text style={{ ...pStyle, margin: 0, fontStyle: "italic" }}>
          « {brief} »
        </Text>
      </Section>

      <Text style={pStyle}>
        En attendant, deux ressources qui peuvent répondre directement :
      </Text>
      <Text style={mutedStyle}>
        —{" "}
        <a
          href="https://waimia.com/ressources/cas/plateau"
          style={accentLinkStyle}
        >
          Cas Plateau · refonte RevOps
        </a>
        <br />—{" "}
        <a href="https://waimia.com/offres/conseil" style={accentLinkStyle}>
          Hub Conseil · 7 services
        </a>
      </Text>

      <Text style={mutedStyle}>
        Si urgent :{" "}
        <a href="mailto:bonjour@waimia.fr" style={accentLinkStyle}>
          bonjour@waimia.fr
        </a>
      </Text>
    </EmailLayout>
  );
}
