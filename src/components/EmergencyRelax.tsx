import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Wind, Volume2, VolumeX, X, Heart, Compass, Flame, Sliders, Play, Pause, CloudRain, Waves } from 'lucide-react';

const restorativeMessages = [
  "Breathe in the calm. Let go of the weight.",
  "You are safe here in the forest. Let your thoughts wander.",
  "Release the tension in your jaw, drop your shoulders.",
  "Your worth isn't measured by your speed. It is okay to slow down.",
  "Like trees in the winter, it is healthy to rest and rebuild.",
  "This moment is yours. Nothing else demands your attention.",
  "Let your worries drift away like leaves on a quiet river.",
  "You are doing enough. You have done enough today."
];

interface SoundTrack {
  id: string;
  name: string;
  icon: React.ReactNode;
  active: boolean;
  src: string;
}

export default function EmergencyRelax() {
  const [isActive, setIsActive] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [countDown, setCountDown] = useState(4);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [soundTracks, setSoundTracks] = useState<SoundTrack[]>([
    { id: 'river', name: 'Whispering River', icon: <Compass className="w-4 h-4" />, active: false, src: 'https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/river.mp3' },
    { id: 'rain', name: 'Soft Rainstorm', icon: <CloudRain className="w-4 h-4" />, active: false, src: 'https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/rain/light-rain.mp3' },
    { id: 'wind', name: 'Mountain Breeze', icon: <Wind className="w-4 h-4" />, active: false, src: 'https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/wind.mp3' },
    { id: 'fire', name: 'Campfire Glow', icon: <Flame className="w-4 h-4" />, active: false, src: 'https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/campfire.mp3' },
    { id: 'nature', name: 'Forest Melodies', icon: <Sparkles className="w-4 h-4" />, active: false, src: 'https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/animals/birds.mp3' },
    { id: 'ocean', name: 'Ocean Waves', icon: <Waves className="w-4 h-4" />, active: false, src: 'https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/waves.mp3' }
  ]);

  // Premium audio deck master fader (0.0 to 1.0)
  const [masterVolume, setMasterVolume] = useState<number>(0.8);
  
  // Individual volume states for custom mixing
  const [volumes, setVolumes] = useState<{ [key: string]: number }>({
    river: 0.8,
    rain: 0.7,
    wind: 0.6,
    fire: 0.6,
    nature: 0.5,
    ocean: 0.6,
  });

  // References to keep persistent HTML5 Audio instances for loop playbacks
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const playTrack = (trackId: string) => {
    if (!audioEnabled) {
      setAudioEnabled(true);
    }
    setSoundTracks(prev => prev.map(t => t.id === trackId ? { ...t, active: true } : t));
  };

  const pauseTrack = (trackId: string) => {
    setSoundTracks(prev => prev.map(t => t.id === trackId ? { ...t, active: false } : t));
  };

  const handleVolumeChange = (trackId: string, val: number) => {
    setVolumes(prev => ({ ...prev, [trackId]: val }));
  };

  // Switch restorative text messages rhythmically
  useEffect(() => {
    let timer: any;
    if (isActive) {
      timer = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % restorativeMessages.length);
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  // Breathing Guide Loop
  useEffect(() => {
    let breathTimer: any;
    if (isActive) {
      breathTimer = setInterval(() => {
        setCountDown((prev) => {
          if (prev <= 1) {
            if (breathState === 'Inhale') {
              setBreathState('Hold');
              return 2; // Hold for 2s
            } else if (breathState === 'Hold') {
              setBreathState('Exhale');
              return 4; // Exhale for 4s
            } else {
              setBreathState('Inhale');
              return 4; // Inhale for 4s
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathState('Inhale');
      setCountDown(4);
    }
    return () => clearInterval(breathTimer);
  }, [isActive, breathState]);

  // Dynamic Audio player synchronization hook
  useEffect(() => {
    soundTracks.forEach(track => {
      let audio = audioRefs.current[track.id];

      if (isActive && audioEnabled && track.active) {
        if (!audio) {
          audio = new Audio(track.src);
          audio.loop = true;
          audioRefs.current[track.id] = audio;
        }

        // Apply specific fader volume mixed with the master volume level
        const currentChVolume = volumes[track.id] ?? 0.5;
        audio.volume = currentChVolume * masterVolume;

        if (audio.paused) {
          audio.play().catch(e => {
            console.warn(`Playback of ${track.name} was blocked or delayed by autoplay policy:`, e);
          });
        }
      } else {
        if (audio) {
          audio.pause();
        }
      }
    });
  }, [isActive, audioEnabled, soundTracks, volumes, masterVolume]);

  // Total cleanup on unmount
  useEffect(() => {
    return () => {
      (Object.values(audioRefs.current) as HTMLAudioElement[]).forEach(audio => {
        if (audio) {
          audio.pause();
        }
      });
    };
  }, []);

  // Stop all ambient audio on global request (e.g. from 1-min Reset Mode)
  useEffect(() => {
    const handleStopAll = () => {
      setAudioEnabled(false);
      (Object.values(audioRefs.current) as HTMLAudioElement[]).forEach(audio => {
        if (audio) audio.pause();
      });
    };
    window.addEventListener('stop-all-ambient-audio', handleStopAll);
    return () => window.removeEventListener('stop-all-ambient-audio', handleStopAll);
  }, []);

  // Individual track state togglers are handled directly by playTrack/pauseTrack functions

  const initAudio = () => {
    if (!audioEnabled) {
      setAudioEnabled(true);
    } else {
      // Pause currently running audio components cleanly
      (Object.values(audioRefs.current) as HTMLAudioElement[]).forEach(audio => {
        if (audio) audio.pause();
      });
      setAudioEnabled(false);
    }
  };

  const handleClose = () => {
    setIsActive(false);
    setAudioEnabled(false);
    (Object.values(audioRefs.current) as HTMLAudioElement[]).forEach(audio => {
      if (audio) {
        audio.pause();
      }
    });
  };

  return (
    <div id="emergency-section" className="relative py-16 px-6 max-w-7xl mx-auto">
      {/* Background soft lighting border */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#e3f2fd]/20 to-transparent pointer-events-none" />

      <div className="relative rounded-[2rem] bg-gradient-to-br from-forest-900 via-forest-800 to-[#13240c] text-beige-50 p-8 md:p-14 overflow-hidden shadow-2xl border border-forest-900/10">
        
        {/* Abstract animated nature rings inside card */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 border border-sage-400/10 rounded-full animate-wind pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 border border-sage-400/5 rounded-full animate-glow pointer-events-none" />

        {/* Floating background glowing spot */}
        <div className="absolute bottom-6 right-10 w-48 h-48 bg-sage-400 opacity-20 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-950/60 border border-forest-700/50 text-sage-300 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-sage-400" />
              Emergency Relief Center
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Need Calm <br className="hidden sm:inline" />Right Now?
            </h2>

            <p className="text-sage-200 text-md sm:text-lg leading-relaxed max-w-xl">
              Serenity Forest features a physical <b>Emergency Calm Button</b> built for overwhelming moments. When stress, panic, mental overload, or fatigue hits, access this sanctuary for a science-backed fast reset.
            </p>

            <div className="space-y-4 pt-1">
              <p className="text-xs font-bold uppercase tracking-widest text-sage-300">
                Instantly Active Trigger Reliever
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Stressed', 'Anxious', 'Overwhelmed', 'Tired', 'Restless', 'Unmotivated'].map((trigger) => (
                  <div key={trigger} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-forest-950/40 border border-[#2D4F1E]/10 text-xs text-sage-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage-400 animate-pulse" />
                    {trigger}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => setIsActive(true)}
                className="px-8 py-5 bg-peach-accent hover:bg-[#c96247] text-white font-bold rounded-full shadow-lg transition duration-300 ease-out flex items-center gap-3 group scale-100 hover:scale-[1.03] active:scale-95 cursor-pointer border-4 border-forest-900/40"
                id="activate-calm-button"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                Activate Emergency Calm Screen
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-forest-900/50 p-6 sm:p-8 rounded-2xl border border-forest-700/60 shadow-inner text-center space-y-6">
            <h4 className="font-serif text-xl font-medium text-white">How it works</h4>
            <ul className="space-y-4 text-left text-sm text-sage-100">
              <li className="flex gap-3">
                <span className="flex-none w-6 h-6 rounded-full bg-forest-800 border border-forest-600 flex items-center justify-center font-bold text-xs text-sage-300">1</span>
                <div>
                  <strong className="text-white">Guided Breathing:</strong> Sync with an expanding 10-second breath ring (4s inhale, 2s hold, 4s exhale) which targets your parasympathetic nervous system.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-none w-6 h-6 rounded-full bg-forest-800 border border-forest-600 flex items-center justify-center font-bold text-xs text-sage-300">2</span>
                <div>
                  <strong className="text-white">Natural Nature Sounds:</strong> Optional loops of actual forest water, streams, winds, birds, and crackles to calm your senses.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-none w-6 h-6 rounded-full bg-forest-800 border border-forest-600 flex items-center justify-center font-bold text-xs text-sage-300">3</span>
                <div>
                  <strong className="text-white">Positive Anchoring:</strong> Clean, highly specific restorative statements displayed rhythmically to quiet negative thoughts.
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* --- FULLSCREEN INTERACTIVE SOOTHING OVERLAY --- */}
      {isActive && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#061504] bg-radial-gradient flex flex-col justify-between p-6 transition-all duration-700" id="fullscreen-calm-overlay">
          
          {/* Nature atmosphere stars & ambient spots */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#154212,transparent_70%)] opacity-30" />
          <div className="absolute top-1/4 right-[10%] w-[300px] h-[300px] rounded-full bg-teal-500/10 blur-[80px]" />
          <div className="absolute bottom-1/4 left-[10%] w-[350px] h-[350px] rounded-full bg-emerald-700/10 blur-[90px]" />

          {/* Top Panel */}
          <div className="relative z-10 flex justify-between items-center w-full max-w-6xl mx-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-sage-400 animate-ping" />
              <span className="font-serif font-semibold text-lg text-sage-200 tracking-wide">Serenity Sanctuary</span>
            </div>
            
            <button
              onClick={handleClose}
              className="p-3 bg-white/5 hover:bg-white/15 text-sage-200 hover:text-white rounded-full border border-white/10 transition flex items-center gap-2 group cursor-pointer"
              title="Return to Website"
            >
              <X className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Close Sanctuary</span>
            </button>
          </div>

          {/* responsive layout for deep audio calibration */}
          <div className="relative z-10 my-auto w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
            
            {/* Left Column: Visual breath guide and therapeutic restorative text */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center text-center space-y-8">
              
              {/* Soft Breathing Graphic Widget */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                
                {/* Outer pulsing ring */}
                <div className="absolute inset-4 rounded-full border-2 border-[#a1d494]/20 animate-spin" style={{ animationDuration: '40s' }} />

                {/* Dynamic expanding glowing central coach element */}
                <div 
                  className={`absolute w-36 h-36 rounded-full transition-transform duration-1000 ease-in-out flex flex-col items-center justify-center
                    ${breathState === 'Inhale' ? 'scale-150 bg-forest-600/30' : ''}
                    ${breathState === 'Hold' ? 'scale-150 bg-sky-500/30' : ''}
                    ${breathState === 'Exhale' ? 'scale-95 bg-forest-800/40' : ''}
                  `}
                  style={{
                    boxShadow: breathState === 'Inhale' 
                      ? '0 0 45px rgba(161, 212, 148, 0.6)' 
                      : breathState === 'Hold' 
                      ? '0 0 55px rgba(66, 165, 245, 0.7)' 
                      : '0 0 25px rgba(21, 66, 18, 0.4)'
                  }}
                >
                  <Heart className={`w-8 h-8 mb-1 text-sage-300 transition-all duration-500 ${breathState === 'Inhale' ? 'scale-110' : 'scale-90'}`} />
                  <span className="text-xs font-bold uppercase tracking-widest text-sage-200">{breathState}</span>
                  <span className="text-2xl font-bold font-serif text-white">{countDown}s</span>
                </div>

                {/* Simple subtle visual helper circles */}
                <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute -inset-10 rounded-full border border-white/5 pointer-events-none" />
              </div>

              {/* Cycling Restorative Healing Messages Card */}
              <div className="h-28 flex flex-col items-center justify-center px-4 max-w-lg space-y-4">
                <p className="font-serif text-lg sm:text-2xl italic font-medium leading-relaxed text-sage-100">
                  "{restorativeMessages[messageIndex]}"
                </p>
              </div>

              <p className="text-xs text-sage-400 max-w-xs select-none">
                Sync your breathing with the expanding ring for the best biological calming results.
              </p>
            </div>

            {/* Right Column: Premium Audio Deck (Volume Sliders & Playback Switches) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Giant Amplified Pro Audio Console */}
              <div className="p-6 rounded-[2rem] bg-white/[0.04] border border-white/10 space-y-6 text-left shadow-xl backdrop-blur-md">
                
                {/* Header info */}
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Sliders className="w-5 h-5 text-peach-accent shrink-0 animate-pulse" />
                    <div>
                      <span className="font-serif text-md font-semibold text-white block">Natural Nature Sounds Deck</span>
                      <span className="text-[10px] text-sage-400 font-mono">Organic Atmospheric Nature Streams • No Synthesizers</span>
                    </div>
                  </div>
                  
                  {/* Master Power Audio Toggle */}
                  <button 
                    onClick={initAudio}
                    className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      audioEnabled 
                        ? 'bg-peach-accent text-white shadow-lg shadow-peach-accent/20 border border-peach-accent' 
                        : 'bg-white/5 text-sage-300 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {audioEnabled ? (
                      <>
                        <Volume2 className="w-4 h-4 animate-ping" />
                        <span>Sounds: ON</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>Sounds: OFF</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Synth active status banner */}
                {!audioEnabled ? (
                  <div className="p-6 rounded-2xl bg-forest-950/40 border border-sage-500/10 text-center space-y-3">
                    <p className="text-xs text-sage-200 font-sans leading-relaxed">
                      Turn on the high-quality organic forest logs channels to listen to whispering rivers, rainstorms, mountain breezes, campfires, forest bird melodies, and ocean waves.
                    </p>
                    <button
                      onClick={initAudio}
                      className="px-6 py-2.5 bg-peach-accent hover:bg-[#c96247] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition duration-200 cursor-pointer shadow-md shadow-peach-accent/10"
                    >
                      Power Sounds Online
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Master Volume with Extra Loud range slider */}
                    <div className="space-y-2.5 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] uppercase font-bold tracking-widest text-[#9DBEBB] flex items-center gap-1.5 font-mono">
                          <Volume2 className="w-4 h-4 text-peach-accent animate-pulse" />
                          <span>Overall Volume</span>
                        </label>
                        <span className="text-peach-accent font-mono text-xs font-semibold">{Math.round(masterVolume * 100)}% Loudness</span>
                      </div>
                      <input 
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={masterVolume}
                        onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-white/10 hover:bg-white/15 rounded-lg appearance-none cursor-pointer accent-peach-accent"
                      />
                      <div className="flex justify-between text-[9px] text-[#9DBEBB]/60 font-mono select-none">
                        <span>Gentle Whisper</span>
                        <span>Warm Baseline</span>
                        <span className="text-peach-accent">Standard Room Volume</span>
                      </div>
                    </div>

                    {/* Individual Loop Mixer Tracks Grid */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#9DBEBB] block select-none">
                        Nature Mix Channels (Blend the sounds to your preference):
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {soundTracks.map((track) => {
                          const isTrackPlaybackActive = track.active;
                          const currentVolume = volumes[track.id] ?? 0.6;
                          return (
                            <div 
                              key={track.id} 
                              className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 ${
                                isTrackPlaybackActive 
                                  ? 'bg-forest-950/70 border-peach-accent/30 shadow-md shadow-peach-accent/5' 
                                  : 'bg-white/[0.02] border-white/5 opacity-50'
                              }`}
                            >
                              {/* Track header controls */}
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-lg transition ${
                                    isTrackPlaybackActive 
                                      ? 'bg-peach-accent/20 text-peach-light border border-peach-accent/30' 
                                      : 'bg-white/5 text-sage-400 border border-white/5'
                                  }`}>
                                    {track.icon}
                                  </div>
                                  <div className="leading-tight">
                                    <span className={`text-[12px] font-bold block transition-colors ${
                                      isTrackPlaybackActive ? 'text-peach-light' : 'text-sage-300'
                                    }`}>
                                      {track.name}
                                    </span>
                                    <span className="text-[8px] text-sage-450 font-mono">
                                      {isTrackPlaybackActive ? 'Loop active' : 'Deck muted'}
                                    </span>
                                  </div>
                                </div>

                                {/* Individual Play & Pause buttons */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => playTrack(track.id)}
                                    disabled={isTrackPlaybackActive}
                                    className={`p-1.5 rounded-lg transition-all ${
                                      isTrackPlaybackActive
                                        ? 'bg-peach-accent/10 text-peach-light/30 border border-peach-accent/5 cursor-not-allowed'
                                        : 'bg-white/5 text-sage-300 hover:bg-white/10 hover:text-white border border-white/10 cursor-pointer'
                                    }`}
                                    title={`Play ${track.name}`}
                                  >
                                    <Play className="w-3 h-3 fill-current" />
                                  </button>
                                  <button
                                    onClick={() => pauseTrack(track.id)}
                                    disabled={!isTrackPlaybackActive}
                                    className={`p-1.5 rounded-lg transition-all ${
                                      !isTrackPlaybackActive
                                        ? 'bg-transparent text-sage-600 border border-transparent cursor-not-allowed'
                                        : 'bg-peach-accent text-white hover:bg-[#c96247] shadow-md border border-peach-accent cursor-pointer'
                                    }`}
                                    title={`Pause ${track.name}`}
                                  >
                                    <Pause className="w-3 h-3 fill-current" />
                                  </button>
                                </div>
                              </div>

                              {/* Slider Volume controls */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono select-none">
                                  <span className={isTrackPlaybackActive ? 'text-sage-300' : 'text-sage-500'}>Volume</span>
                                  <span className={`${isTrackPlaybackActive ? 'text-peach-accent font-semibold' : 'text-sage-600'}`}>
                                    {isTrackPlaybackActive ? `${Math.round(currentVolume * 100)}%` : '0%'}
                                  </span>
                                </div>
                                <input 
                                  type="range"
                                  min="0.0"
                                  max="1.0"
                                  step="0.02"
                                  value={currentVolume}
                                  onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                                  disabled={!isTrackPlaybackActive}
                                  className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-peach-accent disabled:opacity-25 disabled:cursor-not-allowed"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Generative Visual Wave Feedback */}
                    <div className="p-3 bg-forest-950/70 rounded-xl space-y-1.5 border border-white/5 select-none text-center">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-sage-400">Dynamic Nature Audio Bar Logs</span>
                      <div className="h-6 flex items-center justify-center gap-1">
                        {Array.from({ length: 18 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="w-1 bg-[#a1d494]/70 rounded-full transition-all duration-300" 
                            style={{ 
                              height: `${15 + (i * 4.5) % 85}%`,
                              animation: `pulse 0.7s infinite ease-in-out alternate`,
                              animationDelay: `${i * 0.05}s`
                            }} 
                          />
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Symmetrical footer information bar */}
          <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center py-4 border-t border-white/5 text-[10px] text-sage-500 gap-2 text-center select-none font-mono">
            <span>Serenity Forest Rescue v3.0 • Organic Nature Audio • Master Audio Console</span>
            <span>All soundscapes are real high-quality nature loops played locally.</span>
          </div>

        </div>
      )}

    </div>
  );
}
