import React, { useEffect, useRef } from 'react';

interface ParticleInstance {
  id: number;
  element: HTMLDivElement;
  x: number;       // percentage 0 - 100
  y: number;       // percentage 0 - 100
  vx: number;      // velocity x (-0.05 to 0.05% per frame)
  vy: number;      // velocity y (-0.08 to -0.02% per frame, slow upward/sideways drift)
  r: number;       // current rotation in degrees
  vr: number;      // rotation speed
  scale: number;   // size scale
  opacity: number; // base low opacity (nominally around 0.1)
}

export default function NatureParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeParticlesRef = useRef<ParticleInstance[]>([]);
  const idCounterRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(0);

  // Throttled spawning setup
  const MAX_PARTICLES = 16;
  const SPAWN_INTERVAL_MS = 800; // Throttle spawn to once every 800ms
  const emojis = ['🍃', '🌸', '🌿'];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Function to dynamically spawn a single particle in the DOM
    const createParticle = (initialY: number) => {
      if (activeParticlesRef.current.length >= MAX_PARTICLES) return;

      const id = idCounterRef.current++;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];

      const el = document.createElement('div');
      el.textContent = emoji;
      
      // Hardware-accelerated presentation styling
      el.className = "absolute pointer-events-none select-none transition-transform duration-75 ease-out";
      el.style.fontSize = '1.2rem';
      el.style.willChange = 'transform, top, left, opacity';
      el.style.position = 'absolute';
      
      // Randomize visual properties
      const x = Math.random() * 100;
      const y = initialY;
      const vx = (Math.random() - 0.5) * 0.04; // subtle sideways sway
      const vy = -(0.02 + Math.random() * 0.04); // steady upward drift
      const r = Math.random() * 360;
      const vr = (Math.random() - 0.5) * 0.5;
      const scale = 0.6 + Math.random() * 0.5;
      const opacity = 0.18 + Math.random() * 0.14; // balanced visibility keeping it ambient yet clear

      // Set initial state
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.style.transform = `translate(-50%, -50%) rotate(${r}deg) scale(${scale})`;
      el.style.opacity = `${opacity}`;

      // Append directly to the nature background layer
      container.appendChild(el);

      const p: ParticleInstance = {
        id,
        element: el,
        x,
        y,
        vx,
        vy,
        r,
        vr,
        scale,
        opacity
      };

      activeParticlesRef.current.push(p);
    };

    // Seed a few initial particles at random heights so the screen isn't fully empty on mount
    for (let i = 0; i < 5; i++) {
      createParticle(Math.random() * 90);
    }
    lastSpawnTimeRef.current = Date.now();

    let animationId: number;

    // Animation Loop
    const tick = () => {
      const now = Date.now();

      // Throttled spawning check
      if (now - lastSpawnTimeRef.current > SPAWN_INTERVAL_MS) {
        if (activeParticlesRef.current.length < MAX_PARTICLES) {
          // Spawn new particles from the bottom of the screen
          createParticle(105);
          lastSpawnTimeRef.current = now;
        }
      }

      const activeParticles = activeParticlesRef.current;
      const remainingParticles: ParticleInstance[] = [];

      for (let i = 0; i < activeParticles.length; i++) {
        const p = activeParticles[i];

        // Move particle coordinates slightly
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;

        // Cleanup element from DOM as soon as it drifts completely off-screen
        const isOffscreen = p.y < -10 || p.x < -10 || p.x > 110;

        if (isOffscreen) {
          if (p.element && p.element.parentNode) {
            p.element.parentNode.removeChild(p.element);
          }
        } else {
          // Direct styling update bypasses React render trigger for maximum frame rate
          p.element.style.left = `${p.x}%`;
          p.element.style.top = `${p.y}%`;
          p.element.style.transform = `translate(-50%, -50%) rotate(${p.r}deg) scale(${p.scale})`;
          p.element.style.opacity = `${p.opacity}`;
          remainingParticles.push(p);
        }
      }

      activeParticlesRef.current = remainingParticles;
      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    // Complete cleanup on unmount - leaves zero residual DOM elements or memory overhead
    return () => {
      cancelAnimationFrame(animationId);
      activeParticlesRef.current.forEach(p => {
        if (p.element && p.element.parentNode) {
          p.element.parentNode.removeChild(p.element);
        }
      });
      activeParticlesRef.current = [];
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none"
      id="nature-floating-particles-layer"
    />
  );
}
