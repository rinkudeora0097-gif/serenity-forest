import React, { useEffect, useState } from 'react';
import NatureParticles from './NatureParticles';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: string;
  duration: string;
}

interface Leaf {
  id: number;
  left: string;
  delay: string;
  size: number;
  rotation: number;
  animationType: 'animate-leaf-1' | 'animate-leaf-2';
}

export default function NatureBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    // Generate organic positions for particles (fireflies)
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: 30 + Math.random() * 60, // percentage
      size: Math.random() * 6 + 3, // radius in px
      delay: `${Math.random() * 6}s`,
      duration: `${5 + Math.random() * 10}s`,
    }));
    setParticles(newParticles);

    // Generate drift leaves
    const newLeaves = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 95}%`,
      delay: `${Math.random() * 15}s`,
      size: Math.random() * 14 + 10, // px
      rotation: Math.random() * 360,
      animationType: i % 2 === 0 ? 'animate-leaf-1' : ('animate-leaf-2' as any),
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dynamic Ambient Gradient - Representing Sunset to Sunrise Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EBF2F1]/50 via-[#F8F9F3]/85 to-beige-50" />

      {/* Gentle Nature Particles Layer */}
      <NatureParticles />

      {/* Floating Soft Clouds */}
      <div className="absolute top-12 left-0 w-[400px] h-[150px] opacity-25 blur-xl pointer-events-none animate-cloud-slow">
        <div className="bg-white rounded-full w-full h-[80px]" />
        <div className="bg-white rounded-full w-[240px] h-[100px] -mt-12 ml-16" />
      </div>
      <div className="absolute top-48 right-0 w-[500px] h-[180px] opacity-20 blur-2xl pointer-events-none animate-cloud-fast">
        <div className="bg-white rounded-full w-full h-[90px]" />
        <div className="bg-white rounded-full w-[300px] h-[110px] -mt-16 ml-32" />
      </div>

      {/* Deep Forest Landscape Silhouette Behind Content */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[280px] sm:h-[380px] opacity-30 select-none">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full fill-forest-900/10 preserve-3d" preserveAspectRatio="none">
          {/* Background mountain line */}
          <path d="M0,224L120,202.7C240,181,480,139,720,138.7C960,139,1200,181,1320,202.7L1440,224L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" className="fill-forest-600/5" />
          {/* Midground organic forest hills */}
          <path d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,160C672,160,768,192,864,208C960,224,1056,224,1152,213.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" className="fill-forest-700/10" />
          {/* Foreground beautiful mountain peaks */}
          <path d="M0,288L90,261.3C180,235,360,181,540,176C720,171,900,213,1080,218.7C1260,224,1440,192,1490,176L1540,160L1540,320L1490,320C1440,320,1260,320,1080,320C900,320,720,320,540,320C360,320,180,320,90,320L0,320Z" className="fill-forest-800/15" />
        </svg>
      </div>

      {/* Floating Sage/Forest Leaves */}
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className={`absolute pointer-events-none top-[-50px] ${leaf.animationType}`}
          style={{
            left: leaf.left,
            animationDelay: leaf.delay,
            transform: `rotate(${leaf.rotation}deg)`,
          }}
        >
          {/* Floating Organic Leaf SVG */}
          <svg
            width={leaf.size}
            height={leaf.size}
            viewBox="0 0 24 24"
            fill="none"
            className="text-forest-600/30 fill-sage-400/20"
          >
            <path
              d="M12 2C6.5 2 2 6.5 2 12c0 2.8 1.1 5.3 3 7.1L12 22l7-2.9c1.9-1.8 3-4.3 3-7.1 0-5.5-4.5-10-10-10zm0 18.5c-3.6 0-6.5-2.9-6.5-6.5S8.4 7.5 12 7.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5z"
              fill="currentColor"
              fillOpacity="0.15"
            />
            <path
              d="M12 2v20M2 12h20M12 12c3 0 5-2 5-5M12 12c-3 0-5 2-5 5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />
          </svg>
        </div>
      ))}

      {/* Glowing Fireflies / Forest Lantern Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-sage-300 rounded-full animate-glow mix-blend-screen"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            filter: 'blur(1px)',
            boxShadow: '0 0 8px #bcf0ae, 0 0 15px #a1d494',
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
