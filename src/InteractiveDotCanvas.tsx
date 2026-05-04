'use client';

import React, { CSSProperties, useEffect, useRef } from 'react';

export interface InteractiveDotCanvasProps {
  position?: 'fixed' | 'absolute';
  dotColor?: string;
  spacing?: number;
  style?: CSSProperties;
}

const DOT_R = 1.2;
const MAX_DISP = 10;
const SPRING_K = 0.048;
const FRICTION = 0.88;
const IDLE_EPS = 0.06;
const INFLUENCE = 115;

const RIPPLE_SPEED = 3.2;
const RIPPLE_BAND = 40;
const RIPPLE_STRENGTH = 14;
const RIPPLE_MIN_R = 180;
const RIPPLE_MAX_R = 440;
const RIPPLE_HOLD_MS = 800;
const MAX_RIPPLES = 5;

function InteractiveDotCanvas({
  position = 'fixed',
  dotColor,
  spacing = 28,
  style,
}: InteractiveDotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return undefined;
    const canvas: HTMLCanvasElement = currentCanvas;

    const currentContext = canvas.getContext('2d');
    if (!currentContext) return undefined;
    const ctx: CanvasRenderingContext2D = currentContext;

    let dotCount = 0;
    let ox = new Float32Array();
    let oy = new Float32Array();
    let dx = new Float32Array();
    let dy = new Float32Array();
    let vx = new Float32Array();
    let vy = new Float32Array();

    type Ripple = { x: number; y: number; radius: number; maxR: number };

    let ripples: Ripple[] = [];
    let rafId = 0;
    let isMoving = false;
    let moveTimer: ReturnType<typeof setTimeout> | undefined;
    let needsDraw = true;
    let mouseDownTime = 0;
    const mouse = { x: -9999, y: -9999 };

    const isDarkAtInit = document.documentElement.getAttribute('data-color-mode') === 'dark';
    let restFill: string;
    let glowRgb: string;
    let glowColor: string;

    if (dotColor) {
      restFill = dotColor.replace(/[\d.]+\)$/, '0.35)');
      const match = dotColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      glowRgb = match ? `${match[1]},${match[2]},${match[3]}` : '200,220,255';
      glowColor = dotColor.replace(/[\d.]+\)$/, '1)');
    } else {
      restFill = isDarkAtInit ? 'rgba(200,220,255,0.35)' : 'rgba(80,100,190,0.35)';
      glowRgb = isDarkAtInit ? '190,215,255' : '70,115,245';
      glowColor = isDarkAtInit ? 'rgba(190,215,255,1)' : 'rgba(70,115,245,1)';
    }

    function wake() {
      needsDraw = true;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function buildDots() {
      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;
      dotCount = cols * rows;
      ox = new Float32Array(dotCount);
      oy = new Float32Array(dotCount);
      dx = new Float32Array(dotCount);
      dy = new Float32Array(dotCount);
      vx = new Float32Array(dotCount);
      vy = new Float32Array(dotCount);

      let i = 0;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const px = col * spacing;
          const py = row * spacing;
          ox[i] = px;
          oy[i] = py;
          dx[i] = px;
          dy[i] = py;
          vx[i] = 0;
          vy[i] = 0;
          i += 1;
        }
      }
    }

    function resize() {
      const parent = canvas.parentElement;
      if (position === 'absolute' && parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      buildDots();
      wake();
    }

    let solidContentX = -9999;
    let solidContentY = -9999;
    let solidContentResult = false;

    function isOverSolidContent(clientX: number, clientY: number): boolean {
      const el = document.elementFromPoint(clientX, clientY);
      if (!el || el === document.body || el === document.documentElement) return false;

      let cur: Element | null = el;
      while (cur && cur !== document.body) {
        if (cur instanceof HTMLElement) {
          const bg = window.getComputedStyle(cur).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            if (cur.offsetHeight > window.innerHeight * 1.5) {
              cur = cur.parentElement;
              continue;
            }
            return true;
          }
        }
        cur = cur.parentElement;
      }

      return false;
    }

    function isOverSolidCached(clientX: number, clientY: number): boolean {
      if (Math.hypot(clientX - solidContentX, clientY - solidContentY) < 20) {
        return solidContentResult;
      }

      solidContentX = clientX;
      solidContentY = clientY;
      solidContentResult = isOverSolidContent(clientX, clientY);
      return solidContentResult;
    }

    function tick() {
      for (const ripple of ripples) ripple.radius += RIPPLE_SPEED;
      ripples = ripples.filter((ripple) => ripple.radius < ripple.maxR);

      let anyActive = isMoving || ripples.length > 0 || mouse.x > -9000;
      if (!anyActive) {
        for (let i = 0; i < dotCount; i += 1) {
          if (
            Math.abs(vx[i]) > IDLE_EPS ||
            Math.abs(vy[i]) > IDLE_EPS ||
            Math.abs(dx[i] - ox[i]) > IDLE_EPS ||
            Math.abs(dy[i] - oy[i]) > IDLE_EPS
          ) {
            anyActive = true;
            break;
          }
        }
      }

      if (anyActive || needsDraw) {
        needsDraw = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const mx = mouse.x;
        const my = mouse.y;

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.fillStyle = restFill;
        ctx.beginPath();

        const glowIndices: number[] = [];
        const glowVals: number[] = [];

        for (let i = 0; i < dotCount; i += 1) {
          let tx = ox[i];
          let ty = oy[i];

          if (isMoving) {
            const dotX = ox[i] - mx;
            const dotY = oy[i] - my;
            const dist = Math.sqrt(dotX * dotX + dotY * dotY);
            if (dist < INFLUENCE && dist > 0) {
              const t = 1 - dist / INFLUENCE;
              const disp = t * t * (3 - 2 * t) * MAX_DISP;
              tx = ox[i] + (dotX / dist) * disp;
              ty = oy[i] + (dotY / dist) * disp;
            }
          }

          vx[i] += (tx - dx[i]) * SPRING_K;
          vy[i] += (ty - dy[i]) * SPRING_K;

          for (const ripple of ripples) {
            const dotX = ox[i] - ripple.x;
            const dotY = oy[i] - ripple.y;
            const dist = Math.sqrt(dotX * dotX + dotY * dotY);
            const diff = Math.abs(dist - ripple.radius);
            if (diff < RIPPLE_BAND && dist > 0) {
              const t = 1 - diff / RIPPLE_BAND;
              const profile = t * t * (3 - 2 * t);
              const decay = Math.cos((ripple.radius / ripple.maxR) * Math.PI * 0.5);
              const impulse = profile * RIPPLE_STRENGTH * decay * decay;
              vx[i] += (dotX / dist) * impulse;
              vy[i] += (dotY / dist) * impulse;
            }
          }

          vx[i] *= FRICTION;
          vy[i] *= FRICTION;
          dx[i] += vx[i];
          dy[i] += vy[i];

          let hoverGlow = 0;
          if (mx > -9000) {
            const hoverDist = Math.sqrt((ox[i] - mx) ** 2 + (oy[i] - my) ** 2);
            if (hoverDist < INFLUENCE) {
              const t = 1 - hoverDist / INFLUENCE;
              hoverGlow = t * t * (3 - 2 * t);
            }
          }

          const disp = Math.sqrt((dx[i] - ox[i]) ** 2 + (dy[i] - oy[i]) ** 2);
          const rippleGlow = Math.min(disp / 6, 1);
          const glow = Math.max(hoverGlow, rippleGlow);

          if (glow > 0.02) {
            glowIndices.push(i);
            glowVals.push(glow);
          } else {
            ctx.moveTo(dx[i] + DOT_R, dy[i]);
            ctx.arc(dx[i], dy[i], DOT_R, 0, Math.PI * 2);
          }
        }

        ctx.fill();

        if (glowIndices.length > 0) {
          ctx.shadowColor = glowColor;
          for (let g = 0; g < glowIndices.length; g += 1) {
            const i = glowIndices[g];
            const glow = glowVals[g];
            let hoverGlow = 0;
            if (mx > -9000) {
              const hoverDist = Math.sqrt((ox[i] - mx) ** 2 + (oy[i] - my) ** 2);
              if (hoverDist < INFLUENCE) {
                const t = 1 - hoverDist / INFLUENCE;
                hoverGlow = t * t * (3 - 2 * t);
              }
            }

            const disp = Math.sqrt((dx[i] - ox[i]) ** 2 + (dy[i] - oy[i]) ** 2);
            const rippleGlow = Math.min(disp / 6, 1);

            ctx.fillStyle = `rgba(${glowRgb},${(0.18 + glow * 0.8).toFixed(2)})`;
            ctx.shadowBlur = glow * 36;
            ctx.beginPath();
            ctx.arc(dx[i], dy[i], DOT_R + hoverGlow * 0.8 + rippleGlow * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
        }
      }

      if (anyActive) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    }

    function toLocal(clientX: number, clientY: number) {
      if (position === 'absolute' && canvas.parentElement) {
        const rect = canvas.parentElement.getBoundingClientRect();
        return { x: clientX - rect.left, y: clientY - rect.top };
      }

      return { x: clientX, y: clientY };
    }

    function onMouseMove(event: MouseEvent) {
      if (isOverSolidCached(event.clientX, event.clientY)) {
        mouse.x = -9999;
        mouse.y = -9999;
        isMoving = false;
        if (moveTimer) clearTimeout(moveTimer);
        wake();
        return;
      }

      const { x, y } = toLocal(event.clientX, event.clientY);
      mouse.x = x;
      mouse.y = y;
      if (!isMoving) wake();
      isMoving = true;
      if (moveTimer) clearTimeout(moveTimer);
      moveTimer = setTimeout(() => {
        isMoving = false;
      }, 150);
    }

    function onMouseDown(event: MouseEvent) {
      if (isOverSolidCached(event.clientX, event.clientY)) return;
      mouseDownTime = performance.now();
    }

    function onClick(event: MouseEvent) {
      if (isOverSolidCached(event.clientX, event.clientY)) return;

      const { x, y } = toLocal(event.clientX, event.clientY);
      const held = mouseDownTime > 0 ? performance.now() - mouseDownTime : 0;
      const t = Math.min(held / RIPPLE_HOLD_MS, 1);
      const eased = t * t * (3 - 2 * t);
      const maxR = RIPPLE_MIN_R + eased * (RIPPLE_MAX_R - RIPPLE_MIN_R);

      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({ x, y, radius: 0, maxR });
      wake();
    }

    resize();
    tick();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('click', onClick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (moveTimer) clearTimeout(moveTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('click', onClick);
    };
  }, [position, dotColor, spacing]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    />
  );
}

export default React.memo(InteractiveDotCanvas);
