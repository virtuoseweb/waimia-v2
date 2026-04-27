/* ProductReel · sticky scroll-driven console viewer
 * 4 panels (Workspace · Kernel · Agent runtime · Pipeline) qui scrollent ensemble.
 * Hydraté `client:visible` · pas de children (data interne pour rester typé). */
import { Fragment, useEffect, useRef, useState } from 'react';

const SCREENS = [
  {
    label: '00 · Workspace',
    title: { en: 'A workspace per client, isolated.', fr: 'Un workspace par client, isolé.' },
    rows: [
      ['plateau-saas',     'SaaS B2B',     'active'],
      ['halcyon-health',   'Healthtech',    'active'],
      ['northbound-fin',   'Fintech EU',    'active'],
      ['caserne-ind',      'Industry FR',   'active'],
    ],
  },
  {
    label: '01 · Kernel',
    title: { en: 'Kernel ships agents, audit trail, locale rules.', fr: "Le kernel livre agents, trace d'audit, règles de locale." },
    rows: [
      ['kernel.version',  '2.4.1'],
      ['kernel.locale',   'fr-FR · typo rules on'],
      ['agents.loaded',   '14 / 14 ◉'],
      ['audit.trail',     'open · 12 min'],
      ['kernel.uptime',   '31 d 04 h 22 m'],
      ['storage.used',    '412 GB / 2 TB'],
    ],
  },
  {
    label: '02 · Agent runtime',
    title: { en: 'Agents do one job. Audited. Reversible.', fr: 'Les agents font une seule chose. Audités. Réversibles.' },
    rows: [
      ['revops.router',   'routing 14 handoffs',   '2s'],
      ['hubspot.sync',    'synced 482 contacts',   'ok'],
      ['dbt.runner',      'materialising 24 models','48s'],
      ['claude.triage',   'triaged 127 inbound',   'ok'],
      ['billing.dunning', '3 invoices chased',     'ok'],
    ],
  },
  {
    label: '03 · Pipeline',
    title: { en: 'Your pipeline, operable in-app.', fr: "Votre pipeline, opérable dans l'app." },
    rows: [
      ['Lead',      '42', '€ 126 k'],
      ['Qualified', '18', '€ 84 k'],
      ['Proposal',  '7',  '€ 42 k'],
      ['Won',       '2',  '€ 19,5 k'],
    ],
  },
] as const;

interface Props {
  lang: 'fr' | 'en';
}

/* Rend une chaîne en remplaçant chaque `◉` par un span accent — safe (pas de innerHTML). */
function withAccentDot(text: string) {
  const parts = text.split('◉');
  return parts.flatMap((p, i) =>
    i < parts.length - 1
      ? [<Fragment key={i}>{p}</Fragment>, <span key={`d${i}`} style={{ color: 'var(--accent)' }}>◉</span>]
      : [<Fragment key={i}>{p}</Fragment>],
  );
}

export default function ProductReel({ lang }: Props) {
  const [step, setStep] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, -r.top / (r.height - vh)));
      setStep(Math.min(SCREENS.length - 1, Math.floor(p * SCREENS.length)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cur = SCREENS[step];
  const screenLabel = cur.label.split(' · ')[1]?.toLowerCase() ?? '';

  return (
    <div ref={wrapRef} style={{ height: '320vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', padding: '0 clamp(20px,4vw,48px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 'clamp(32px,5vw,64px)', alignItems: 'center', width: '100%', maxWidth: 1500, margin: '0 auto' }}>
          {/* Steps left */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>
              Live scroll · {step + 1} / {SCREENS.length}
            </div>
            {SCREENS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: '14px 0',
                  borderTop: '1px solid var(--hairline)',
                  opacity: i === step ? 1 : 0.28,
                  transition: 'opacity 500ms var(--ease)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.12em', color: 'var(--accent)', marginBottom: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,2.5vw,36px)', lineHeight: 1.02, letterSpacing: '-0.02em' }}>
                  {s.title[lang]}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.08em' }}>
              ↓ {lang === 'fr' ? 'CONTINUER LE SCROLL' : 'SCROLL TO CONTINUE'}
            </div>
          </div>

          {/* Console right */}
          <div style={{ background: 'var(--paper)', border: '1px solid var(--ink)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 40px 120px rgba(12,11,9,.14)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--hairline)', background: 'var(--paper-2)' }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 9, height: 9, borderRadius: 9, background: 'var(--hairline-strong)' }} />
              ))}
              <span style={{ marginLeft: 14, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
                virtuoseos · {screenLabel}
              </span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)' }}>◉ live</span>
            </div>
            <div style={{ minHeight: 360, padding: 14, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink)' }}>
              {step === 0 && (
                <>
                  <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                    Workspaces · 4 active
                  </div>
                  {cur.rows.map((row, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 120px 80px',
                        padding: '12px 0',
                        borderTop: i === 0 ? 'none' : '1px solid var(--hairline)',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: i === 0 ? 'var(--accent)' : 'var(--ink)' }}>
                        {i === 0 ? '▸ ' : '  '}
                        {row[0]}
                      </span>
                      <span style={{ color: 'var(--muted)', fontSize: 11 }}>{row[1]}</span>
                      <span style={{ color: 'var(--accent)', fontSize: 11 }}>◉ {row[2]}</span>
                    </div>
                  ))}
                </>
              )}
              {step === 1 && (
                <>
                  <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                    Kernel · plateau-saas
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8 }}>
                    {cur.rows.map((row, i) => (
                      <Fragment key={i}>
                        <span style={{ color: 'var(--muted)' }}>{row[0]}</span>
                        <span>{withAccentDot(row[1])}</span>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, padding: 12, background: 'var(--paper-2)', borderRadius: 6 }}>
                    <div style={{ color: 'var(--accent)' }}>$ virtuose kernel.status --workspace=plateau-saas</div>
                    <div style={{ color: 'var(--muted)', marginTop: 6 }}>kernel ok · 14 agents running · 0 errors · rev 2.4.1</div>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                    Agents · 14 active
                  </div>
                  {cur.rows.map((row, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 1fr 60px',
                        padding: '10px 0',
                        borderTop: i === 0 ? 'none' : '1px solid var(--hairline)',
                        alignItems: 'baseline',
                      }}
                    >
                      <span style={{ color: 'var(--ink)' }}>◦ {row[0]}</span>
                      <span style={{ color: 'var(--muted)', fontSize: 11 }}>{row[1]}</span>
                      <span style={{ color: row[2] === 'ok' ? 'var(--accent)' : 'var(--muted)', fontSize: 11, textAlign: 'right' }}>
                        {row[2]}
                      </span>
                    </div>
                  ))}
                </>
              )}
              {step === 3 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
                    <span>Pipeline · plateau-saas</span>
                    <span style={{ color: 'var(--accent)' }}>€ 19 540 active</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
                    {cur.rows.map((row, i) => (
                      <div key={i} style={{ background: 'var(--paper-2)', borderRadius: 6, padding: 10 }}>
                        <div style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase' }}>{row[0]}</div>
                        <div style={{ fontSize: 22, color: 'var(--ink)', marginTop: 6, fontFamily: 'var(--font-display)' }}>{row[1]}</div>
                        <div style={{ color: 'var(--accent)', fontSize: 11, marginTop: 2 }}>{row[2]}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
