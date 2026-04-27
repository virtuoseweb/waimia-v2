/**
 * Email · WelcomeNewsletter
 * Welcome email pour signup newsletter mensuelle Waimia.
 * Trigger : POST /api/newsletter
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
}

export default function WelcomeNewsletter({ firstName = "bonjour" }: Props) {
  return (
    <EmailLayout preview="Bienvenue · une note par mois, jamais de promotion">
      <Text style={h1Style}>Bienvenue, {firstName}.</Text>
      <Text style={pStyle}>
        Vous êtes inscrit·e à la newsletter mensuelle Waimia. Une note longue le
        15 de chaque mois. Pas de pensum SEO. Pas de promotion. Juste ce qu'on
        aurait voulu lire avant de commencer un chantier.
      </Text>

      <Section
        style={{
          background: "#EFEAE0",
          padding: 18,
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
          Les 3 dernières notes
        </Text>
        <Text style={{ ...pStyle, margin: 0 }}>
          —{" "}
          <a
            href="https://waimia.com/ressources/blog/brain-circuit"
            style={accentLinkStyle}
          >
            Le cerveau-circuit arrive toujours avant le travail
          </a>
          <br />—{" "}
          <a
            href="https://waimia.com/ressources/cas/plateau"
            style={accentLinkStyle}
          >
            Cas Plateau · refonte RevOps · +€2.4M pipeline
          </a>
          <br />—{" "}
          <a href="https://waimia.com/ressources/blog" style={accentLinkStyle}>
            Toutes les notes →
          </a>
        </Text>
      </Section>

      <Text style={mutedStyle}>
        Désabonnement en 1 clic dans chaque email. RGPD-compliant.
      </Text>
    </EmailLayout>
  );
}
