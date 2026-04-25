/* BootSplash · cinématique d'entrée 620ms.
 * Ce qui rend mémorable : on attend une fraction de seconde — le wordmark s'imprime, puis disparaît.
 * Hydraté `client:only="react"` pour éviter le flash SSR. */
import { useEffect, useState } from 'react';

interface Props {
  lang: 'fr' | 'en';
}

export default function BootSplash({ lang }: Props) {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setGone(true), 1100);
    return () => window.clearTimeout(t);
  }, []);
  if (gone) return null;
  return (
    <div className={'boot' + (gone ? ' gone' : '')} aria-hidden>
      <div>
        <div className="m">
          Waim<i>i</i>a<span style={{ color: 'var(--accent)' }}>.</span>
        </div>
        <div className="st">
          {lang === 'fr' ? 'Architectes de systèmes agentiques' : 'Architects of agentic systems'}
        </div>
      </div>
      <style>{`
        .boot{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:var(--paper);z-index:200;transition:opacity 620ms var(--ease)}
        .boot.gone{opacity:0;pointer-events:none}
        .boot .m{font-family:var(--font-display);font-size:clamp(64px,10vw,110px);line-height:1;letter-spacing:-0.03em;text-align:center}
        .boot .m i{font-style:italic}
        .boot .st{font-family:var(--font-mono);font-size:11px;letter-spacing:.16em;color:var(--muted);margin-top:16px;text-transform:uppercase;text-align:center}
      `}</style>
    </div>
  );
}
