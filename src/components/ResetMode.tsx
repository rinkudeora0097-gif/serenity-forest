import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, X, Play, Volume2, VolumeX, Sparkles, HelpCircle, Heart, ArrowRight } from 'lucide-react';

interface ResetModeProps {
  isOpen: boolean;
  onClose: () => void;
}

// Beautiful customized SVG Leaf for floating leaves overlay
const LeafGraphic = ({ color = '#a1d494' }: { color?: string }) => (
  <svg viewBox="0 0 24 24" fill={color} className="w-5 h-5 opacity-40 select-none pointer-events-none">
    <path d="M17 8C15.62 8 13.9 8.86 12 10.14C10.1 8.86 8.38 8 7 8C4.5 8 3 9.79 3 12C3 15.6 7 21 12 21C17 21 21 15.6 21 12C21 9.79 19.5 8 17 8ZM12 19.5C8 19.5 4.8 15 4.8 12C4.8 10.87 5.48 9.8 7 9.8C8.03 9.8 9.38 10.45 11.1 11.66L11.16 11.7C11.39 11.87 11.69 11.97 12 11.97C12.31 11.97 12.61 11.87 12.84 11.7L12.9 11.66C14.62 10.45 15.97 9.8 17 9.8C18.52 9.8 19.2 10.87 19.2 12C19.2 15 16 19.5 12 19.5Z" />
  </svg>
);

export default function ResetMode({ isOpen, onClose }: ResetModeProps) {
  const [status, setStatus] = useState<'intro' | 'active' | 'complete'>('intro');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [leaves, setLeaves] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number; rotate: number }>>([]);
  
  // Ref for River Soundtrack
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop other ambient sound sources when we open Reset Mode
  useEffect(() => {
    if (isOpen) {
      // Dispatch a custom global event to pause other sound components
      window.dispatchEvent(new CustomEvent('stop-all-ambient-audio'));
      setStatus('intro');
      setCurrentTime(0);
      
      // Seed random leaf settings for floating canvas
      const generatedLeaves = Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: 5 + Math.random() * 90, // percent
        delay: Math.random() * 8, // seconds delay
        duration: 8 + Math.random() * 7, // seconds to fall
        size: 0.6 + Math.random() * 0.8, // scale factor
        rotate: Math.random() * 360, // degrees
      }));
      setLeaves(generatedLeaves);
    }
  }, [isOpen]);

  // Audio setup and destruction
  useEffect(() => {
    // Create pre-loaded audio stream
    audioRef.current = new Audio('https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/river.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0; // Starts completely silent

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Synthesize Tibetan Meditation Bowl using Web Audio API (Offline, latency-free, professional sound)
  const playTibetanBowlChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      // Fundametal bass pitch - grounding
      const oscBase = ctx.createOscillator();
      const gainBase = ctx.createGain();
      oscBase.type = 'sine';
      oscBase.frequency.setValueAtTime(144, now); // 144Hz deep hum
      
      // Harmonious Mid resonance
      const oscMid = ctx.createOscillator();
      const gainMid = ctx.createGain();
      oscMid.type = 'sine';
      oscMid.frequency.setValueAtTime(288, now); // Ideal octave harmony
      
      // Tibetan metal shimmer / overtone
      const oscShimmer = ctx.createOscillator();
      const gainShimmer = ctx.createGain();
      oscShimmer.type = 'triangle';
      oscShimmer.frequency.setValueAtTime(432, now); // Cosmic 432Hz tuning harmony
      
      // Setup dynamic low-frequency oscillator (LFO) for that vibrating, swelling "singing bowl" modulation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(4.5, now); // 4.5Hz vibration
      lfoGain.gain.setValueAtTime(10, now); // scale frequency wobble

      // Master volume stage
      const masterGain = ctx.createGain();
      
      // Attach LFO to shimmer to create natural metallic oscillation (vibrato)
      lfo.connect(lfoGain);
      lfoGain.connect(oscShimmer.frequency);
      
      // Volume shaping envelopes
      gainBase.gain.setValueAtTime(0, now);
      gainBase.gain.linearRampToValueAtTime(0.4, now + 0.1); // Fast attack
      gainBase.gain.exponentialRampToValueAtTime(0.001, now + 6); // Very long decay
      
      gainMid.gain.setValueAtTime(0, now);
      gainMid.gain.linearRampToValueAtTime(0.25, now + 0.15); 
      gainMid.gain.exponentialRampToValueAtTime(0.001, now + 5.5);
      
      gainShimmer.gain.setValueAtTime(0, now);
      gainShimmer.gain.linearRampToValueAtTime(0.12, now + 0.05); 
      gainShimmer.gain.exponentialRampToValueAtTime(0.001, now + 4.5);
      
      masterGain.gain.setValueAtTime(0.9, now);
      
      // Connect nodes
      oscBase.connect(gainBase);
      gainBase.connect(masterGain);
      
      oscMid.connect(gainMid);
      gainMid.connect(masterGain);
      
      oscShimmer.connect(gainShimmer);
      gainShimmer.connect(masterGain);
      
      masterGain.connect(ctx.destination);
      
      // Trigger oscillators
      lfo.start(now);
      oscBase.start(now);
      oscMid.start(now);
      oscShimmer.start(now);
      
      // Stop to clean memory
      lfo.stop(now + 6);
      oscBase.stop(now + 6);
      oscMid.stop(now + 6);
      oscShimmer.stop(now + 6);

      // Trigger standard mobile vibration feedback if supported
      if (navigator.vibrate) {
        navigator.vibrate([150, 100, 200]);
      }
    } catch (e) {
      console.warn("Tibetan Singing Bowl creation blocked or failed:", e);
    }
  };

  // Main 1-minute countdown state wheel
  useEffect(() => {
    let intervalId: any;
    
    if (status === 'active') {
      intervalId = setInterval(() => {
        setCurrentTime((prev) => {
          const nextVal = prev + 1;
          
          if (nextVal >= 60) {
            clearInterval(intervalId);
            setStatus('complete');
            playTibetanBowlChime();
            return 60;
          }
          return nextVal;
        });
      }, 1000);
    } else {
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0;
      }
    }

    return () => clearInterval(intervalId);
  }, [status]);

  // Audio fader synchronization loop
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (status === 'active' && audioEnabled) {
      // Soft nature sound fades in gracefully between 10s and 30s
      if (currentTime >= 10 && currentTime < 54) {
        if (audio.paused) {
          audio.play().catch((err) => console.log('Audio playback policy check:', err));
        }
        // Smooth linear volume ramp-up over 4 seconds
        const targetVol = Math.min(0.65, (currentTime - 10) / 4);
        audio.volume = targetVol;
      } 
      // Sound fades out gradually during the final 6 seconds of the cleanse
      else if (currentTime >= 54 && currentTime <= 60) {
        const remainingTime = 60 - currentTime;
        const targetVol = Math.max(0, 0.65 * (remainingTime / 6));
        audio.volume = targetVol;
        if (targetVol <= 0.01 && !audio.paused) {
          audio.pause();
        }
      } else {
        // Silent outside the 10-60 range
        audio.volume = 0;
      }
    } else {
      // Handle manual mutes or inactive status
      audio.volume = 0;
      if (!audio.paused && (status !== 'active' || !audioEnabled)) {
        audio.pause();
      }
    }
  }, [currentTime, status, audioEnabled]);

  const handleStartCleanse = () => {
    // Play an entry water sound/chime to unlock browser audio context
    playTibetanBowlChime();
    setStatus('active');
  };

  const handleCloseAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onClose();
  };

  if (!isOpen) return null;

  // Derive breathing sequence timing (10-second cycle: 4s Inhale, 2s Hold, 4s Exhale)
  const cycleSeconds = currentTime % 10;
  let breathState: 'Inhale' | 'Hold' | 'Exhale' = 'Inhale';
  let breathText = 'Inhale deeply...';
  let breathScale = 1.0;

  if (cycleSeconds < 4) {
    breathState = 'Inhale';
    breathText = 'Breathe in slowly...';
    // scale up from 1 to 1.45
    breathScale = 1.0 + (cycleSeconds / 4) * 0.45;
  } else if (cycleSeconds < 6) {
    breathState = 'Hold';
    breathText = 'Hold and feel the quiet...';
    breathScale = 1.45;
  } else {
    breathState = 'Exhale';
    breathText = 'Exhale and release tension...';
    // scale down from 1.45 to 1
    breathScale = 1.45 - ((cycleSeconds - 6) / 4) * 0.45;
  }

  // Determine current active narrative theme based on timeline seconds
  let timelineMessage = "";
  if (currentTime < 10) {
    timelineMessage = "Centering your heart rate";
  } else if (currentTime < 30) {
    timelineMessage = "Surrendering to nature's stream";
  } else if (currentTime < 50) {
    timelineMessage = "Watching stress float away like autumn leaves";
  } else {
    timelineMessage = "Embracing calm control";
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#06150a] text-beige-50 flex flex-col justify-between p-6 overflow-hidden md:p-12 select-none"
      id="reset-mode-screen"
    >
      {/* Stylesheet injected locally for leaf physics to prevent build bugs */}
      <style>{`
        @keyframes float-leaf-fall {
          0% {
            transform: translateY(-8vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--leaf-opacity, 0.45);
          }
          90% {
            opacity: var(--leaf-opacity, 0.45);
          }
          100% {
            transform: translateY(108vh) translateX(60px) rotate(280deg);
            opacity: 0;
          }
        }
        .falling-leaf {
          animation: float-leaf-fall var(--fall-duration) linear infinite;
          animation-delay: var(--fall-delay);
        }
      `}</style>

      {/* Decorative Forest Glow Effects */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-950/40 via-transparent to-[#051108] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sage-400/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Floating Leaves Overlay - Renders only during stage 3 (30–50 sec) and onwards */}
      {status === 'active' && currentTime >= 30 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {leaves.map((leaf) => (
            <div
              key={leaf.id}
              className="absolute falling-leaf"
              style={{
                left: `${leaf.left}%`,
                top: `-20px`,
                transform: `rotate(${leaf.rotate}deg)`,
                '--fall-delay': `${leaf.delay}s`,
                '--fall-duration': `${leaf.duration}s`,
                '--leaf-opacity': '0.45',
              } as React.CSSProperties}
            >
              <LeafGraphic color={leaf.id % 2 === 0 ? '#b2e2a5' : '#85ab79'} />
            </div>
          ))}
        </div>
      )}

      {/* TOP BAR INFORMATION */}
      <nav className="relative z-20 flex justify-between items-center max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <Leaf className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="font-serif font-bold text-xs sm:text-sm uppercase tracking-widest text-emerald-300">
            RESET MODE – MINDFUL LAB
          </span>
        </div>

        {status === 'active' && (
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-sage-350">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{60 - currentTime}s remaining</span>
          </div>
        )}

        <button
          onClick={handleCloseAll}
          className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 text-sage-200 hover:text-white rounded-full border border-white/10 transition cursor-pointer"
          title="Return to Serenity Forest"
        >
          <X className="w-4 h-4 sm:w-5 h-5" />
        </button>
      </nav>

      {/* CORE DISPLAY WINDOW (AnimatePresence used to trigger state changes elegantly) */}
      <main className="relative z-20 my-auto flex flex-col items-center justify-center text-center w-full max-w-2xl mx-auto px-4 min-h-[380px]">
        <AnimatePresence mode="wait">
          
          {/* INTRODUCTORY PHASE */}
          {status === 'intro' && (
            <motion.div
              key="intro-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 max-w-lg"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-300 mx-auto shadow-lg shadow-emerald-950/50 animate-bounce">
                <Leaf className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  1-Minute Mind Cleanse
                </h2>
                <div className="h-0.5 w-16 bg-emerald-500/40 mx-auto rounded-full" />
                <p className="text-emerald-300/80 font-mono text-[10px] tracking-widest uppercase">
                  Somatic Reset • Instant Stress Release
                </p>
              </div>

              <p className="text-sage-200/90 text-sm sm:text-base leading-relaxed">
                Take a 60-second break from emails, notifications, and cognitive overload. We will synchronize your breathing, play gentle forest waters, bathe you in floating flora, and finish with a peaceful reminder.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleStartCleanse}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-full shadow-lg shadow-emerald-500/20 transition-all scale-100 hover:scale-[1.03] active:scale-95 flex items-center gap-2.5 mx-auto cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Begin Mind Cleanse 🌿</span>
                </button>
              </div>

              <p className="text-[10px] text-sage-500 font-mono">
                Clicking activates full immersion. Audio will play dynamically.
              </p>
            </motion.div>
          )}

          {/* ACTIVE GUIDED EXPERIENCE */}
          {status === 'active' && (
            <motion.div
              key="active-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12 w-full flex flex-col items-center justify-center relative"
            >
              {/* Circular timeline tracking wheel */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                
                {/* Clean background ring */}
                <div className="absolute inset-0 rounded-full border border-white/5" />

                {/* Animated svg ring of cumulative progress (60 seconds) */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="47%"
                    fill="transparent"
                    stroke="rgba(16, 185, 129, 0.1)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="47%"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="295"
                    strokeDashoffset={295 - (295 * currentTime) / 60}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                {/* Breathing Glowing Sphere */}
                <div 
                  className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out"
                  style={{
                    transform: `scale(${breathScale})`,
                    backgroundColor: breathState === 'Inhale' 
                      ? 'rgba(16, 185, 129, 0.25)' 
                      : breathState === 'Hold' 
                      ? 'rgba(56, 189, 248, 0.25)' 
                      : 'rgba(4, 120, 87, 0.3)',
                    boxShadow: breathState === 'Inhale'
                      ? '0 0 35px rgba(16, 185, 129, 0.5)'
                      : breathState === 'Hold'
                      ? '0 0 45px rgba(56, 189, 248, 0.5)'
                      : '0 0 20px rgba(4, 120, 87, 0.3)'
                  }}
                >
                  <Heart className={`w-6 h-6 text-emerald-300 transition-transform duration-1000 ${breathState === 'Inhale' ? 'scale-115' : 'scale-90 animate-pulse'}`} />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-200 mt-1">{breathState}</span>
                </div>

                {/* Ambient dynamic water ripples (renders from 10s to 30s) */}
                {currentTime >= 10 && currentTime < 30 && (
                  <div className="absolute inset-4 rounded-full border border-emerald-400/20 animate-pulse" style={{ animationDuration: '3s' }} />
                )}
              </div>

              {/* Instructional Guides & Timeline Milestones */}
              <div className="space-y-4 max-w-md min-h-[90px] flex flex-col items-center justify-center">
                {/* Rhythmic breathing textual helper */}
                <h3 className="font-serif text-lg sm:text-2xl text-white font-medium italic select-none">
                  "{breathText}"
                </h3>

                {/* Dynamic positive messaging appearing specifically at 50-60 seconds */}
                {currentTime >= 50 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 shadow-md backdrop-blur-sm shadow-emerald-950/40"
                  >
                    <p className="font-serif text-md sm:text-xl font-bold text-emerald-250 animate-pulse">
                      "You are safe. You are calm. You are in control."
                    </p>
                  </motion.div>
                )}

                {/* Subtext describing timeline phase progress */}
                {currentTime < 50 && (
                  <p className="text-xs text-emerald-400/70 font-mono tracking-wide uppercase select-none">
                    {timelineMessage}
                  </p>
                )}
              </div>

              {/* Atmospheric soundscape indicator */}
              {currentTime >= 10 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 justify-center text-[10px] text-sage-400 font-mono bg-white/5 px-4 py-1.5 rounded-full border border-white/5"
                >
                  {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-sage-500" />}
                  <span>River Audio playing locally • Click right to toggle mute</span>
                  <button 
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className="ml-1 text-emerald-300 hover:text-white underline cursor-pointer"
                  >
                    {audioEnabled ? 'Mute' : 'Play'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* COMPLETION PHASE */}
          {status === 'complete' && (
            <motion.div
              key="complete-screen"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6 max-w-lg"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Cleanse Complete
                </h2>
                <div className="h-0.5 w-16 bg-emerald-500 mx-auto rounded-full" />
                <p className="text-emerald-300/80 font-mono text-[10px] tracking-widest uppercase">
                  Mind Re-Centered • Quiet Focus Achieved
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-white/[0.03] border border-white/10 rounded-2xl max-w-md mx-auto space-y-3">
                <p className="text-sage-200 text-sm leading-relaxed font-sans">
                  Your 60-second mental slate is clean. Your physical breathing is balanced, and your adrenaline is stabilized. Carry this quiet sanctuary with you.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCloseAll}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-full shadow-lg shadow-emerald-500/20 transition-all scale-100 hover:scale-[1.03] active:scale-95 flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <span>Return to Serenity Forest</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER METRICS & CONTROLS */}
      <footer className="relative z-20 flex flex-col sm:flex-row justify-between items-center max-w-6xl w-full mx-auto text-[9px] sm:text-[10px] text-sage-550 border-t border-white/5 pt-4 gap-2 text-center font-mono select-none">
        <span>Tibetan Bowl synthesized on browser • Zero network latency</span>
        {status === 'active' && (
          <div className="flex gap-4 items-center">
            <span>Progress: {Math.round((currentTime / 60) * 100)}%</span>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(currentTime / 60) * 100}%` }} />
            </div>
          </div>
        )}
        <span>Safe & Private • Serenity Forest Sanctuary</span>
      </footer>
    </div>
  );
}
