/* KineticHeadline · titre du hero qui mute en font-weight + scale au scroll.
 * Effet signature de la homepage Direction 1 (Apparatus).
 * Hydraté `client:visible` — ne charge que quand le hero entre dans le viewport. */
import { useEffect, useRef } from 'react';

interface Props {
  lang: 'fr' | 'en';
}

export default function KineticHeadline({ lang }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (reduced) return;

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, 1 - r.bottom / (vh + r.height * 0.5)));
      el.style.setProperty('--kw', String(300 + p * 520));
      el.style.setProperty('--ks', String(1 - p * 0.12));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={wrapRef}
      style={
        {
          ['--kw' as string]: 400,
          ['--ks' as string]: 1,
        } as React.CSSProperties
      }
    >
      {/* Newspaper meta row · masthead */}
      <div
        className="par"
        data-par="-0.04"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 32,
          borderBottom: '1px solid var(--hairline)',
          paddingBottom: 16,
          marginBottom: 40,
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--muted)',
          letterSpacing: '.1em',
          textTransform: 'uppercase',
        }}
      >
        <span>Vol. 03 · № 01</span>
        <span>Paris / Genève</span>
        <span>{lang === 'fr' ? 'Bilingue FR · EN' : 'Bilingual EN · FR'}</span>
        <span style={{ textAlign: 'right' }}>
          <span style={{ color: 'var(--accent)' }}>◉</span> {lang === 'fr' ? 'Booking T3 2026' : 'Booking Q3 2026'}
        </span>
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(64px, 12vw, 190px)',
          lineHeight: 0.93,
          letterSpacing: '-0.025em',
          fontWeight: 'var(--kw, 400)' as unknown as number,
          textWrap: 'balance' as React.CSSProperties['textWrap'],
          transform: 'scale(var(--ks, 1))',
          transformOrigin: 'left center',
          fontStyle: 'normal',
        }}
      >
        {lang === 'fr' ? (
          <>
            Architectes de <i style={{ fontStyle: 'italic' }}>systèmes</i>
            <br />
            <i style={{ fontStyle: 'italic' }}>agentiques</i>. Claude-native.
          </>
        ) : (
          <>
            Architects of <i style={{ fontStyle: 'italic' }}>agentic</i>
            <br />
            systems. <i style={{ fontStyle: 'italic' }}>Claude</i>-native.
          </>
        )}
      </h1>

      {/* Footnote strip · texture éditoriale */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 18,
          borderTop: '1px solid var(--hairline)',
          display: 'flex',
          gap: 48,
          flexWrap: 'wrap',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--muted)',
          letterSpacing: '.06em',
        }}
      >
        <span>
          <span style={{ color: 'var(--ink)' }}>¹</span>&nbsp; {lang === 'fr' ? 'Tous les chiffres re-mesurables sous NDA.' : 'All figures re-measurable under NDA.'}
        </span>
        <span>
          <span style={{ color: 'var(--ink)' }}>²</span>&nbsp; Claude Opus · Sonnet · Haiku · {lang === 'fr' ? 'fallback open-source.' : 'open-source fallback.'}
        </span>
        <span>
          <span style={{ color: 'var(--ink)' }}>³</span>&nbsp; {lang === 'fr' ? 'Bilingue FR/EN — règles typo respectées dans les deux.' : 'Bilingual EN/FR — typographic rules observed in both.'}
        </span>
      </div>
    </div>
  );
}
