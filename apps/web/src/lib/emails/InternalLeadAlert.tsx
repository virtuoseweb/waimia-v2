/**
 * Email · InternalLeadAlert
 * Alerte équipe Waimia interne (Slack-ready) · brief lead chaud reçu.
 */
import { Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, h1Style, pStyle, mutedStyle } from "./_layout";

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
}: Props) {
  const isHot = source === "academy" && score !== undefined && score < 12;
  return (
    <EmailLayout
      preview={`Lead ${source} · ${email}${isHot ? " · 🔥 hot" : ""}`}
    >
      <Text style={h1Style}>
        {isHot ? "🔥 Lead chaud" : "Nouveau lead"} · {source}
      </Text>
      <Section
        style={{
          background: "#EFEAE0",
          padding: 18,
          borderRadius: 8,
          margin: "16px 0",
        }}
      >
        <Text style={{ ...pStyle, margin: "0 0 8px" }}>
          <strong>{email}</strong>
          {company ? ` · ${company}` : ""}
          {role ? ` · ${role}` : ""}
        </Text>
        {score !== undefined && (
          <Text style={pStyle}>
            Score academy : <strong>{score}/24</strong>{" "}
            {isHot
              ? "· prospect chaud (relance équipe sous 24h)"
              : "· prospect tiède"}
          </Text>
        )}
        {brief && (
          <Text style={{ ...pStyle, fontStyle: "italic" }}>« {brief} »</Text>
        )}
      </Section>
      {tags && tags.length > 0 && (
        <Text style={mutedStyle}>Tags : {tags.join(" · ")}</Text>
      )}
      <Text style={mutedStyle}>
        Action attendue : répondre sous 24h ouvrées (sous 4h si lead chaud).
      </Text>
    </EmailLayout>
  );
}
