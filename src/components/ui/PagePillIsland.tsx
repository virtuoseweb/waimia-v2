/* PagePillIsland · React island MINIMAL · démonstration du pattern Slots Astro.
 *
 * Pourquoi React : la logique d'apparition (scroll > showAfter) et de masquage proche
 * du footer demande une réactivité que CSS pur ne peut pas exprimer proprement.
 *
 * Pourquoi Slots (children) : tout le contenu visible (libellés, séparateurs, lien /atlas)
 * est rendu par Astro côté serveur → indexable par GPTBot/ClaudeBot/Google sans
 * exécution JS. React n'enrobe que les classes `is-visible` / `is-near-bottom`.
 *
 * Coût bundle : ~600 B après tree-shaking React partagé. */
import { useEffect, useState, type ReactNode } from 'react';

interface Props {
  /** Contenu rendu côté Astro (HTML statique, indexable). */
  children: ReactNode;
  /** Y de scroll à partir duquel le pill apparaît. */
  showAfter?: number;
  /** Distance au bas de page à laquelle on masque (pour ne pas chevaucher le footer). */
  hideBeforeBottom?: number;
}

export default function PagePillIsland({
  children,
  showAfter = 220,
  hideBeforeBottom = 320,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const distBottom =
        document.documentElement.scrollHeight - (y + window.innerHeight);
      setVisible(y > showAfter && distBottom > hideBeforeBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [showAfter, hideBeforeBottom]);

  return (
    <div
      className={'page-pill' + (visible ? ' is-visible' : '')}
      role="complementary"
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}
