/**
 * Email · AcademyResults
 * Scorecard diagnostic 12 questions + 3 prochaines actions priorisées.
 * Trigger : POST /api/academy
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
  /** Score total /24 */
  score: number;
  /** Catégorie déterminée (selon score) */
  category: "discovery" | "building" | "mature";
  /** 3 actions priorisées par coût-de-correction */
  nextActions: { title: string; effort: string; impact: string }[];
}

const categoryLabel: Record<Props["category"], { fr: string; tag: string }> = {
  discovery: { fr: "Découverte", tag: "0-8/24" },
  building: { fr: "En construction", tag: "9-16/24" },
  mature: { fr: "Mature", tag: "17-24/24" },
};

export default function AcademyResults({
  firstName = "bonjour",
  score,
  category,
  nextActions,
}: Props) {
  const cat = categoryLabel[category];
  return (
    <EmailLayout preview={`Scorecard · ${score}/24 · ${cat.fr}`}>
      <Text style={h1Style}>Votre scorecard, {firstName}.</Text>

      <Section
        style={{
          background: "#EFEAE0",
          padding: 24,
          borderRadius: 12,
          margin: "20px 0",
          textAlign: "center" as const,
        }}
      >
        <Text
          style={{
            fontSize: 56,
            lineHeight: 1,
            color: ACCENT,
            margin: 0,
            fontFamily: '"Instrument Serif", Georgia, "Times New Roman", serif',
          }}
        >
          {score}
          <span style={{ fontSize: 28, color: "#7A6F60" }}>/24</span>
        </Text>
        <Text
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#7A6F60",
            margin: "8px 0 0",
          }}
        >
          {cat.fr} · {cat.tag}
        </Text>
      </Section>

      <Text style={pStyle}>
        Voici les <strong>3 prochaines actions</strong> priorisées par
        coût-de-correction (l'inverse de la difficulté × l'impact attendu).
      </Text>

      {nextActions.map((action, i) => (
        <Section
          key={i}
          style={{
            border: "1px solid #E0DBD2",
            borderRadius: 8,
            padding: 16,
            margin: "12px 0",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: ACCENT,
              margin: "0 0 6px",
            }}
          >
            Action {i + 1}
          </Text>
          <Text style={{ ...pStyle, margin: "0 0 6px", fontWeight: 500 }}>
            {action.title}
          </Text>
          <Text style={mutedStyle}>
            Effort : {action.effort} · Impact : {action.impact}
          </Text>
        </Section>
      ))}

      <Section style={{ textAlign: "center" as const, padding: "20px 0" }}>
        <a href="https://waimia.com/contact" style={buttonLinkStyle}>
          En parler 45 min →
        </a>
      </Section>

      <Text style={mutedStyle}>
        Aucun rappel commercial automatique. Le diagnostic reste utile sans
        nous.
      </Text>
    </EmailLayout>
  );
}
