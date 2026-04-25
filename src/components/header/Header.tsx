/* Waimia · Header.tsx · React island
 * Mega-menu hover/focus state, scroll-aware shrink, mobile sheet accordion.
 * Hydraté `client:load` car interactif dès le premier paint. */
import { useEffect, useRef, useState } from 'react';
import type { MegaMenu, SimpleNav, BiText } from '../../data/sitemap';

type NavEntry = MegaMenu | SimpleNav;

interface Props {
  nav: NavEntry[];
  lang: 'fr' | 'en';
  alternateHref: string;
  ctaHref: string;
}

function pick(t: BiText, lang: 'fr' | 'en') {
  return t[lang];
}

export default function Header({ nav, lang, alternateHref, ctaHref }: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fermeture mega au clic extérieur / Échap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenKey(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lock scroll body quand mobile sheet ouverte
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  function openMega(key: string) {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenKey(key);
  }

  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenKey(null), 180);
  }

  const activeMega = nav.find(
    (n): n is MegaMenu => n.key === openKey && !('simple' in n),
  );

  return (
    <>
      <header className={'hdr' + (scrolled ? ' is-scrolled' : '')}>
        <div className="hdr-inner">
          <a href={lang === 'fr' ? '/' : '/en'} className="wm" aria-label="Waimia">
            Waim<i>i</i>a
          </a>

          <nav className="hdr-nav" onMouseLeave={scheduleClose}>
            {nav.map((item) => {
              const isOpen = openKey === item.key;
              if ('simple' in item && item.simple) {
                return (
                  <div className="hdr-nav-item" key={item.key}>
                    <a className="hdr-nav-trigger" href={item.href}>
                      <span>{pick(item.label, lang)}</span>
                    </a>
                  </div>
                );
              }
              return (
                <div
                  className={'hdr-nav-item' + (isOpen ? ' is-open' : '')}
                  key={item.key}
                  onMouseEnter={() => openMega(item.key)}
                  onFocus={() => openMega(item.key)}
                >
                  <button
                    className="hdr-nav-trigger"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => setOpenKey(isOpen ? null : item.key)}
                  >
                    <span>{pick(item.label, lang)}</span>
                    <span className="caret">▾</span>
                  </button>
                </div>
              );
            })}
          </nav>

          <div className="hdr-end">
            <a href={alternateHref} className="lang-toggle" aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}>
              <span className={lang === 'fr' ? 'on' : ''}>FR</span>
              <span className="sep">/</span>
              <span className={lang === 'en' ? 'on' : ''}>EN</span>
            </a>
            <a href={ctaHref} className="cta" data-mag="0.18">
              {lang === 'fr' ? 'Réserver un audit' : 'Book an audit'}
              <span aria-hidden>→</span>
            </a>
            <button
              className={'burger' + (mobileOpen ? ' is-open' : '')}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <i /><i /><i />
            </button>
          </div>
        </div>
      </header>

      {/* Mega panel · une seule instance, contenu mute selon openKey */}
      {activeMega && (
        <div
          className={'mega is-open'}
          onMouseEnter={() => openMega(activeMega.key)}
          onMouseLeave={scheduleClose}
        >
          <MegaPanel item={activeMega} lang={lang} />
        </div>
      )}
      {openKey && <div className="mega-scrim is-open" onClick={() => setOpenKey(null)} />}

      {/* Mobile sheet */}
      <div className={'m-sheet' + (mobileOpen ? ' is-open' : '')}>
        <div className="m-sheet-top">
          <span className="wm">Waim<i>i</i>a</span>
          <button className="m-sheet-close" onClick={() => setMobileOpen(false)} aria-label="Close">×</button>
        </div>
        <div className="m-sheet-body">
          {nav.map((item) =>
            'simple' in item && item.simple ? (
              <a className="m-sheet-simple" href={item.href} key={item.key} onClick={() => setMobileOpen(false)}>
                {pick(item.label, lang)}
              </a>
            ) : (
              <div className={'m-sheet-acc' + (mobileAccordion === item.key ? ' is-open' : '')} key={item.key}>
                <button
                  className="m-sheet-acc-head"
                  onClick={() => setMobileAccordion(mobileAccordion === item.key ? null : item.key)}
                  aria-expanded={mobileAccordion === item.key}
                >
                  <span className="num">0{nav.indexOf(item) + 1}</span>
                  <span className="ttl">{pick(item.label, lang)}</span>
                  <span className="plus">+</span>
                </button>
                <div className="m-sheet-acc-body">
                  <div className="m-sheet-acc-inner">
                    {(item as MegaMenu).cols.map((col, i) => (
                      <div className="m-sheet-acc-col" key={i}>
                        <div className="k">{pick(col.kicker, lang)}</div>
                        <div className="t">{pick(col.label, lang)}</div>
                        {col.items.map((sub) => (
                          <a href={sub.href} key={sub.href} onClick={() => setMobileOpen(false)}>
                            {pick(sub.label, lang)}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
        <div className="m-sheet-end">
          <a href={alternateHref} className="btn btn-ghost" onClick={() => setMobileOpen(false)}>
            {lang === 'fr' ? 'English' : 'Français'} →
          </a>
          <a href={ctaHref} className="btn btn-primary" onClick={() => setMobileOpen(false)}>
            {lang === 'fr' ? 'Réserver un audit' : 'Book an audit'} →
          </a>
        </div>
      </div>
    </>
  );
}

function MegaPanel({ item, lang }: { item: MegaMenu; lang: 'fr' | 'en' }) {
  const cols = item.cols.length === 2 ? '2' : item.cols.length === 4 ? '4' : '3';
  return (
    <>
      <div className="mega-inner" data-cols={cols}>
        {item.cols.map((col, i) => (
          <div className="mega-col" key={i}>
            <div className="mega-col-hd">
              <div className="k">{pick(col.kicker, lang)}</div>
              <div className="t">{pick(col.label, lang)}</div>
            </div>
            <ul>
              {col.items.map((sub) => (
                <li key={sub.href}>
                  <a className="mega-link" href={sub.href}>
                    <span className="t">{pick(sub.label, lang)}</span>
                    {sub.lead && <span className="sub">{pick(sub.lead, lang)}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {item.featured && (
          <div className="mega-featured">
            <div className="badge">{pick(item.featured.kicker, lang)}</div>
            <div className="ttl">{pick(item.featured.label, lang)}</div>
            <div className="bd">{pick(item.featured.body, lang)}</div>
            <a className="img lift" href={item.featured.href} aria-hidden></a>
            <a className="cta" href={item.featured.href}>
              {pick(item.featured.cta, lang)}
            </a>
          </div>
        )}
      </div>
      <div className="mega-bottom">
        <span>{pick(item.lead, lang)}</span>
        <a href={item.href}>
          {lang === 'fr' ? `Voir le hub ${pick(item.label, lang)} →` : `See the ${pick(item.label, lang)} hub →`}
        </a>
      </div>
    </>
  );
}
