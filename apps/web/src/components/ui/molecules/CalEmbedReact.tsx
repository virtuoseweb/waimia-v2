/* CalEmbedReact · Cal.com inline booking widget (SaaS officiel)
 *
 * Bascule 2026-05-08 : du self-host cal.waimia.com vers cal.com SaaS.
 * Hydraté `client:only="react"` côté Astro pour éviter le SSR sur `window`.
 * Snippet de référence : https://app.cal.com/event-types · embed React
 */
import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

interface Props {
  /** Namespace Cal isolant l'instance sur la page (default: "audit") */
  namespace?: string;
  /** Slug `username/event-type` (default: "simonberos/audit") */
  calLink?: string;
  /** Thème (default: "light") */
  theme?: 'auto' | 'light' | 'dark';
}

export default function CalEmbedReact({
  namespace = 'audit',
  calLink = 'simonberos/audit',
  theme = 'light',
}: Props) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace });
      cal('ui', {
        theme,
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, [namespace, theme]);

  return (
    <Cal
      namespace={namespace}
      calLink={calLink}
      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
      config={{
        layout: 'month_view',
        theme,
        // Cal.com quirk : "true"/"false" en string, pas booléen
        useSlotsViewOnSmallScreen: 'true',
      }}
    />
  );
}
