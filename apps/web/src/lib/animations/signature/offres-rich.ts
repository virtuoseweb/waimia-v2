import { gsap, ScrollTrigger } from '../gsap-init';

export function initOffresRich(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Effect 1 : Horizontal scroll section Methode */
  const methodSection = document.querySelector<HTMLElement>('.off-method');
  if (methodSection) {
    const timelineList = methodSection.querySelector<HTMLElement>('.timeline-vertical');
    if (timelineList) {
      const outer = document.createElement('div');
      outer.className = 'off-method-scroll-outer';
      const inner = document.createElement('div');
      inner.className = 'off-method-scroll-inner';
      outer.style.position = 'relative';

      const items = Array.from(timelineList.querySelectorAll<HTMLElement>('.timeline-item'));
      if (items.length >= 2) {
        items.forEach((item) => inner.appendChild(item));
        outer.appendChild(inner);

        const progressBar = document.createElement('div');
        progressBar.className = 'off-method-progress-bar';
        outer.appendChild(progressBar);

        timelineList.appendChild(outer);

        ScrollTrigger.refresh();
        const totalWidth = inner.scrollWidth - outer.clientWidth;

        ScrollTrigger.create({
          trigger: methodSection,
          start: 'top top+=72',
          end: () => `+=${totalWidth + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            gsap.set(inner, { x: -self.progress * totalWidth });
            gsap.set(progressBar, { width: `${self.progress * 100}%` });
          },
        });
      }
    }
  }

  /* Effect 2 : Parallax chiffres Proof */
  const proofSection = document.querySelector<HTMLElement>('.off-proof');
  if (proofSection) {
    const metrics = proofSection.querySelectorAll<HTMLElement>('[class*="col-"]');
    metrics.forEach((metric, i) => {
      const dir = i % 2 === 0 ? -18 : 18;
      gsap.fromTo(
        metric,
        { y: dir },
        {
          y: -dir,
          ease: 'none',
          scrollTrigger: {
            trigger: proofSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        }
      );
    });
  }

  /* Effect 3 : Stagger reveal livrables */
  const delivGrid = document.querySelector<HTMLElement>('.off-del-grid');
  if (delivGrid) {
    const items = delivGrid.querySelectorAll<HTMLElement>('.deliverable');
    items.forEach((item, i) => {
      const fromX = i % 2 === 0 ? -32 : 32;
      gsap.fromTo(
        item,
        { opacity: 0, x: fromX },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
          },
          delay: (i % 2) * 0.12,
        }
      );
    });
  }

  /* Effect 4 : Scroll progress bar si pas deja present */
  const pageProgress = document.querySelector<HTMLElement>('.scroll-progress');
  if (!pageProgress) {
    const bar = document.createElement('div');
    bar.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'height:2px',
      'background:var(--accent,#C94F2E)',
      'z-index:9999',
      'transform-origin:left',
      'width:100%',
      'transform:scaleX(0)',
      'pointer-events:none',
    ].join(';');
    document.body.prepend(bar);
    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { scrub: true },
    });
  }
}
