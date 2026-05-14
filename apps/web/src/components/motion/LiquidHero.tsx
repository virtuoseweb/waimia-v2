/* LiquidHero · canvas blobs terracotta + parallax mouse + grain
 * Hydraté `client:visible` — pure animation, no children.
 * Source : virtuoseweb/waimia DirectionB.tsx · LiquidHero */
import { useEffect, useRef } from 'react';

export default function LiquidHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 1, h = 1;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;

    const resize = () => {
      const parent = canvas.parentElement;
      w = Math.max(1, parent ? parent.offsetWidth : window.innerWidth);
      h = Math.max(1, parent ? parent.offsetHeight : window.innerHeight);
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      tmx = (e.clientX - r.left) / r.width;
      tmy = (e.clientY - r.top) / r.height;
    };
    window.addEventListener('mousemove', onMove);

    let t = 0, raf: number;
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

    const draw = () => {
      t += reduced ? 0 : 0.006;
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0C0B09';
      ctx.fillRect(0, 0, w, h);

      const blobs = [
        { x: 0.25 + Math.sin(t * 0.7) * 0.12, y: 0.4 + Math.cos(t * 0.5) * 0.1, r: 0.55, c: 'rgba(201,79,46,0.55)' },
        { x: 0.75 + Math.cos(t * 0.6) * 0.1, y: 0.65 + Math.sin(t * 0.8) * 0.08, r: 0.48, c: 'rgba(201,79,46,0.30)' },
        { x: 0.5 + Math.sin(t * 0.4) * 0.18, y: 0.3 + Math.cos(t * 0.7) * 0.14, r: 0.4, c: 'rgba(246,241,232,0.10)' },
        { x: mx, y: my, r: 0.28, c: 'rgba(246,241,232,0.16)' },
      ];
      for (const b of blobs) {
        const cx = b.x * w;
        const cy = b.y * h;
        const rad = b.r * Math.max(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, b.c);
        g.addColorStop(1, 'rgba(12,11,9,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      // Grain effect · fix flicker dérangeant signalé Simon (clignotement hero manifesto)
      // Avant : Math.random() < 0.5 + alpha 0.035 = grain dessiné 50% des frames = clignote
      // Après : Math.random() < 0.08 + alpha 0.018 + 30 dots = grain subtil sans clignotement
      if (!reduced && Math.random() < 0.08) {
        ctx.globalAlpha = 0.018;
        for (let i = 0; i < 30; i++) {
          ctx.fillStyle = '#F6F1E8';
          ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
        }
        ctx.globalAlpha = 1;
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div className="liquid-hero" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
