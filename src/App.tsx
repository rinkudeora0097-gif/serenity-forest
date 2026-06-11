import React, { useState, useEffect, lazy, Suspense } from 'react';
import { 
  Leaf, Flower2, HelpCircle, ArrowRight, Download, Laptop, Smartphone,
  Flame, Compass, Wind, Smile, BookOpen, Sparkles, RefreshCw, Moon, 
  Sun, Heart, BarChart2, CheckCircle, Award, ShieldCheck, User, Globe,
  ArrowUpRight, Feather, Github, Star, ChevronRight
} from 'lucide-react';

import { useAuth } from './contexts/AuthContext';
import brandLogoImage from './assets/images/serenity_forest_elegant_logo_1781092348423.png';

// Lazy loading heavy sub-components for instant mobile startup and reduced initial JS chunk
const Forest3DCanvas = lazy(() => import('./components/Forest3DCanvas'));
const EmergencyRelax = lazy(() => import('./components/EmergencyRelax'));
const MoodWellnessSystem = lazy(() => import('./components/MoodWellnessSystem'));
const InteractivePhoneMockup = lazy(() => import('./components/InteractivePhoneMockup'));
const AchievementJourney = lazy(() => import('./components/AchievementJourney'));
const ContactFAQ = lazy(() => import('./components/ContactFAQ'));
const ResetMode = lazy(() => import('./components/ResetMode'));
const AuthGateway = lazy(() => import('./components/AuthGateway'));
const UserProfilePage = lazy(() => import('./components/UserProfilePage'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));

export default function App() {
  const { user, loading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'all' | 'focus' | 'mind' | 'tracking'>('all');
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'completed'>('idle');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isResetModeOpen, setIsResetModeOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup' | 'forgot'>('login');

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default mini-infobar on mobile browsers
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e);
      // Update state to indicate the app can be installed natively
      setIsInstallable(true);
      console.log('[Serenity Forest PWA] beforeinstallprompt captured.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if currently running in standalone (installed) mode
    if (
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true
    ) {
      setInstallStatus('completed');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const handleOpenAuth = (e: any) => {
      if (e.detail?.tab === 'signup') {
        setAuthTab('signup');
      } else if (e.detail?.tab === 'forgot') {
        setAuthTab('forgot');
      } else {
        setAuthTab('login');
      }
      setIsAuthOpen(true);
    };
    window.addEventListener('open-auth-modal', handleOpenAuth);
    return () => window.removeEventListener('open-auth-modal', handleOpenAuth);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Render peaceful loading spinner during setup checks
  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-stone-950 flex flex-col items-center justify-center gap-4 transition-colors duration-300">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-emerald-900/20 border-t-emerald-800 rounded-full animate-spin" />
          <Leaf className="w-5 h-5 text-emerald-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 animate-pulse" />
        </div>
        <p className="font-serif text-xs font-bold text-stone-500 animate-pulse uppercase tracking-widest">
          Syncing Serene Sanctuary...
        </p>
      </div>
    );
  }


  // Trigger Progressive Web App native installation
  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      // Graceful fallback for non-Chrome/Safari iOS or if prompt hasn't fired
      setInstallStatus('installing');
      setTimeout(() => {
        setInstallStatus('completed');
        alert("🌿 Serenity Forest: To install on Apple devices, tap the 'Share' icon in your Safari browser navigation bar and select 'Add to Home Screen'. For Android/Desktop browsers without native prompts, the app caches dynamically for offline support!");
      }, 1200);
      return;
    }

    try {
      setInstallStatus('installing');
      deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[Serenity Forest PWA] User prompt decision: ${outcome}`);
      
      if (outcome === 'accepted') {
        setInstallStatus('completed');
        setDeferredPrompt(null);
        setIsInstallable(false);
      } else {
        setInstallStatus('idle');
      }
    } catch (err) {
      console.warn('[Serenity Forest PWA] Installation request cancelled or failed:', err);
      setInstallStatus('idle');
    }
  };

  const coreFeatures = [
    { title: 'Focus Timer', desc: 'Sustained Pomodoro cycles resembling botanical seed growths to secure deep focus.', icon: <Flame className="w-5 h-5 text-amber-500" />, tab: 'focus' },
    { title: 'Meditation Center', desc: 'Acoustic audio portals designed to ground users and promote delta waves.', icon: <Compass className="w-5 h-5 text-emerald-600" />, tab: 'mind' },
    { title: 'Nature Sounds Library', desc: 'Synthesizer blenders layering real forest rainstorms, campfire logs, and winds.', icon: <Wind className="w-5 h-5 text-sky-500" />, tab: 'mind' },
    { title: 'Mood Tracker', desc: 'Document emotional baselines daily inside a visually interactive botanical calendar.', icon: <Smile className="w-5 h-5 text-yellow-500" />, tab: 'tracking' },
    { title: 'Gratitude Journal', desc: 'Transcribe micro positive notes on digital scrolls and plant them as trees.', icon: <BookOpen className="w-5 h-5 text-amber-600" />, tab: 'mind' },
    { title: 'Mind Detox Zone', desc: 'A focused space for high-cognitive stress relief to release distracting overhead.', icon: <Sparkles className="w-5 h-5 text-purple-500" />, tab: 'mind' },
    { title: 'Stress Relief Center', desc: 'Fast neural stabilization methods targeting hyperactive adrenaline loops.', icon: <RefreshCw className="w-5 h-5 text-rose-500" />, tab: 'mind' },
    { title: 'Sleep Wellness', desc: 'Acoustics pacing heartbeat to promote fast, deep, restorative rest states.', icon: <Moon className="w-5 h-5 text-indigo-500" />, tab: 'focus' },
    { title: 'Positive Affirmations', desc: 'Rhythmic, slow structural reminders framing daily self-compassion loops.', icon: <Sun className="w-5 h-5 text-orange-500" />, tab: 'mind' },
    { title: 'Guided Breathing Exercises', desc: 'Physiologically verified breathing cycles that trigger parasympathetic relief.', icon: <Heart className="w-5 h-5 text-red-500" />, tab: 'focus' },
    { title: 'Wellness Dashboard', desc: 'An elegant personal workspace with zero external ad telemetry tracker lines.', icon: <BarChart2 className="w-5 h-5 text-teal-500" />, tab: 'tracking' },
    { title: 'Progress Tracking', desc: 'Chronicle focus times and streaks to understand seasonal mental habits.', icon: <CheckCircle className="w-5 h-5 text-emerald-500" />, tab: 'tracking' },
    { title: 'Nature Achievement System', desc: 'Sprout your seedlings to strong forest guardians by establishing routine streaks.', icon: <Award className="w-5 h-5 text-amber-500" />, tab: 'tracking' },
    { title: 'Relaxation Sessions', desc: 'Deep dive sensory sequences including muscle scanning to relieve backaches.', icon: <ShieldCheck className="w-5 h-5 text-blue-500" />, tab: 'mind' },
    { title: 'Daily Wellness Check-In', desc: 'Check on hydration levels, physical pacing, and micro-meditation goals.', icon: <User className="w-5 h-5 text-[#6d4c41]" />, tab: 'tracking' },
    { title: 'Mood-Based Recommendations', desc: 'Procedural activity suggestions generated on active biometric vibes.', icon: <Globe className="w-5 h-5 text-[#3b6934]" />, tab: 'tracking' }
  ];

  const filteredFeatures = activeFeatureTab === 'all'
    ? coreFeatures
    : coreFeatures.filter(f => f.tab === activeFeatureTab);

  const benefitsData = [
    { title: 'Better Focus', desc: 'Nurture deep focus levels through bio-pacing chimes and seedling timers.', color: 'hover:border-amber-200 hover:bg-amber-50/10' },
    { title: 'Reduced Stress', desc: 'Dissolve emotional overloads within minutes using somatic emergency controls.', color: 'hover:border-rose-200 hover:bg-rose-50/10' },
    { title: 'Better Mental Clarity', desc: 'Flush cerebral distraction logs using targeted focus sessions.', color: 'hover:border-emerald-200 hover:bg-emerald-50/10' },
    { title: 'Improved Daily Habits', desc: 'Embed micro positive habits firmly inside your automated wellness calendar.', color: 'hover:border-indigo-200 hover:bg-indigo-50/10' },
    { title: 'Better Emotional Health', desc: 'Trace chronic anxiety triggers securely to balance your natural state.', color: 'hover:border-[#42a5f5]/30 hover:bg-blue-50/10' },
    { title: 'Improved Relaxation', desc: 'Lower persistent heartbeats through scientifically verified breathing loops.', color: 'hover:border-purple-200 hover:bg-purple-50/10' },
    { title: 'Better Sleep', desc: 'Settle high brain frequencies gracefully with midnight storm acoustics.', color: 'hover:border-teal-200 hover:bg-teal-50/10' },
    { title: 'Healthier Mindset', desc: 'Build permanent optimistic anchoring with custom gratitude scrolls.', color: 'hover:border-[#6d4c41]/30 hover:bg-amber-100/10' },
  ];

  return (
    <div className="min-h-screen bg-beige-50 text-forest-800 antialiased relative selection:bg-forest-800 selection:text-white overflow-hidden">

      {/* Decorative Background Elements */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-sage-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-forest-800 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

      {/* --- STICKY STYLMED GLASS NAVIGATION BAR --- */}
      <nav id="nav-bar" className="sticky top-0 z-40 bg-white/60 backdrop-blur-md border-b border-forest-800/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex justify-between items-center">
          
          <a href="#hero-section" className="flex items-center gap-3 group cursor-pointer focus:outline-none">
            <div className="relative">
              <img 
                src={brandLogoImage} 
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-cover rounded-full border border-forest-800/20 shadow-md group-hover:scale-[1.08] group-hover:rotate-6 transition duration-300 relative z-10" 
                alt="Serenity Forest Logo" 
              />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white z-20 animate-pulse" />
            </div>
            <div className="leading-tight">
              <span className="font-serif text-md sm:text-lg font-bold text-forest-900 tracking-tight block uppercase">Serenity Forest</span>
              <span className="text-[9px] uppercase tracking-wider text-forest-600 font-mono italic">Sanctuary</span>
            </div>
          </a>

          {/* Nav Links Desktop */}
          <div className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-forest-800/80">
            <a href="#hero-section" className="hover:text-sage-400 transition-colors">Home</a>
            <a href="#about-section-shortcut" className="hover:text-sage-400 transition-colors">About</a>
            <a href="#features-section" className="hover:text-sage-400 transition-colors">Features</a>
            <a href="#mission-section" className="hover:text-sage-400 transition-colors">Mission</a>
            <a href="#founder-section" className="hover:text-sage-400 transition-colors">Founder</a>
            <a href="#download-section" className="hover:text-sage-400 transition-colors">Download</a>
            <a href="#faq-section-anchor" className="hover:text-sage-400 transition-colors">FAQ</a>
            <a href="#contact-section" className="hover:text-sage-400 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-2">
            {/* Midnight Forest Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 border border-forest-800/15 bg-white/50 hover:bg-white text-forest-800 hover:text-forest-900 rounded-full transition duration-150 flex items-center justify-center cursor-pointer shadow-sm relative group"
              title={isDarkMode ? "Switch to Sunny Light Mode" : "Switch to Midnight Forest Dark Mode"}
              aria-label="Theme Toggle"
              id="theme-toggle-btn"
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 hover:rotate-45 transition duration-500" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800 hover:scale-110 transition duration-300" />
              )}
            </button>

            {/* Download App Shortcut */}
            <a
              href="#download-section"
              className="px-2.5 py-1.5 border border-amber-600/35 bg-amber-50 hover:bg-amber-100 text-[#7a4f1d] text-[10px] sm:text-[11px] font-bold uppercase rounded-full tracking-wide transition duration-150 flex items-center gap-1 cursor-pointer shadow-xs hidden md:flex animate-fade-in"
              id="header-download-btn"
            >
              <Download className="w-3 h-3 text-[#a7733a]" />
              <span>Download App</span>
            </a>

            {!user ? (
              <>
                <button
                  onClick={() => {
                    setAuthTab('login');
                    setIsAuthOpen(true);
                  }}
                  className="px-3 py-1.5 border border-forest-800/15 bg-white/50 hover:bg-white text-forest-800 text-[10px] sm:text-[11px] font-bold uppercase rounded-full transition duration-150 cursor-pointer shadow-sm"
                  id="nav-login-btn"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthTab('signup');
                    setIsAuthOpen(true);
                  }}
                  className="px-3 py-1.5 bg-forest-800 hover:bg-[#1f3614] text-white text-[10px] sm:text-[11px] font-bold uppercase rounded-full transition duration-150 cursor-pointer shadow-md shadow-emerald-900/10"
                  id="nav-signup-btn"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                {/* Account Profile Cabinet Toggle */}
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="p-1.5 sm:p-2 border border-forest-800/15 bg-white/50 hover:bg-white text-forest-800 hover:text-forest-900 rounded-full transition duration-150 flex items-center justify-center cursor-pointer shadow-sm relative"
                  title="Open Sanctuary Cabinet Profile"
                  id="profile-cabinet-toggle-btn"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800" />
                </button>
              </>
            )}

            <button
              onClick={() => setIsResetModeOpen(true)}
              className="px-3 py-1.5 border border-emerald-600/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-bold uppercase rounded-full tracking-wide transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm animate-pulse"
              id="header-reset-mode-btn"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 block animate-ping" />
              Reset Mode (1-Min)
            </button>
            <a
              href="#emergency-section"
              className="px-3 py-1.5 border border-peach-accent/30 bg-peach-light/30 hover:bg-peach-light/50 text-peach-accent text-[10px] sm:text-[11px] font-bold uppercase rounded-full tracking-wide transition duration-150 flex items-center gap-1.5 hidden sm:flex"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-peach-accent block animate-pulse" />
              Emergency Reset
            </a>
          </div>

        </div>
      </nav>


      {/* --- HERO SECTION --- */}
      <section id="hero-section" className="relative py-16 sm:py-24 lg:py-32 px-6 overflow-hidden">
        
        {/* Animated magical 3D forest background with dynamic Suspense skeleton */}
        <Suspense fallback={
          <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center bg-gradient-to-b from-[#ebf2f1] to-[#f5f8f6] dark:from-[#030a08] dark:to-stone-900 transition-all duration-700">
            <div className="flex flex-col items-center gap-3">
              <Leaf className="w-8 h-8 text-forest-600 animate-pulse text-[#2d5a27] dark:text-[#a1d494]" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-forest-700/60 dark:text-stone-400">Loading Sanctuary 3D...</span>
            </div>
          </div>
        }>
          <Forest3DCanvas isDarkMode={isDarkMode} />
        </Suspense>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 space-y-6 sm:space-y-8 text-left max-w-3xl">
            
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-100/50 border border-sage-300 text-forest-900 text-xs font-semibold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-current text-peach-accent" />
              Your Digital Sanctuary
            </span>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-7xl leading-[1.1] text-forest-900 tracking-tight">
              Find Peace in a <br className="hidden sm:inline" />
              <span className="italic font-light text-forest-800">Busy World</span>
            </h1>

            <p className="text-forest-800/85 text-md sm:text-lg md:text-xl leading-relaxed max-w-2xl font-sans">
              Serenity Forest helps you reduce stress and reconnect through nature-inspired, offline-first mindfulness.
            </p>

            {/* Quick stats inline strip to validate premium context */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2 border-t border-b border-forest-800/10">
              <div className="flex gap-2.5 items-center">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#16380c] dark:text-[#aee2a5]">0 Ads</span>
                <span className="text-[10px] text-[#1e4e11] dark:text-[#8abf81] uppercase font-mono font-semibold">Uncompromised Privacy</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#16380c] dark:text-[#aee2a5]">100%</span>
                <span className="text-[10px] text-[#1e4e11] dark:text-[#8abf81] uppercase font-mono font-semibold">Offline Sandbox</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#16380c] dark:text-[#aee2a5]">16+</span>
                <span className="text-[10px] text-[#1e4e11] dark:text-[#8abf81] uppercase font-mono font-semibold">Curated tools</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <button 
                onClick={() => {
                  if (user) {
                    const el = document.getElementById('download-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setAuthTab('signup');
                    setIsAuthOpen(true);
                  }
                }}
                className="px-6 py-3.5 bg-forest-800 hover:bg-[#1f3614] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all scale-100 hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer text-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                onClick={handleInstallApp}
                className="px-6 py-3.5 border border-forest-800/20 bg-white/50 hover:bg-white text-forest-800 font-semibold rounded-xl text-xs sm:text-sm text-center transition flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Laptop className="w-4 h-4 text-forest-700" />
                <span>
                  {installStatus === 'idle' && 'Install Web App'}
                  {installStatus === 'installing' && 'Registering...'}
                  {installStatus === 'completed' && 'PWA Registered 🌿'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-peach-accent animate-ping" />
              </button>

              <a
                href="#features-section"
                className="px-5 py-3 hover:text-[#2d5a27] text-stone-600 text-xs sm:text-sm font-bold text-center transition flex items-center justify-center gap-1.5"
              >
                <span>Explore Features</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Bouncing abstract floating landscape mockup displaying logo */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative animate-wind">
              {/* Dynamic ambient halo behind frame */}
              <div className="absolute inset-10 bg-forest-800/15 blur-[85px] rounded-full" />
              <div className="relative w-80 p-6 rounded-[2rem] bg-white/50 border border-white/70 shadow-lg backdrop-blur-md space-y-4 text-center">
                <div className="relative w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-md border border-forest-800/10 group bg-stone-50">
                  <img 
                    src={brandLogoImage} 
                    referrerPolicy="no-referrer"
                    alt="Serenity Forest Premium Logo" 
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition duration-500"
                  />
                  {/* Subtle inner shadow effect */}
                  <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                </div>
                <h4 className="font-serif font-bold text-md text-forest-900">Quietude Canopy</h4>
                <p className="text-[11px] text-forest-800/70 leading-relaxed">
                  "Take physical control of your headspace. Root deep like cedar, flow fast like valley creeks."
                </p>
                <div className="h-1 w-20 bg-sage-400 mx-auto rounded-full" />
                <span className="text-[9px] uppercase tracking-widest text-[#2D4F1E] font-mono leading-none font-bold">Serenity Active</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* --- RESET MODE PROMO BANNER --- */}
      <section className="py-6 px-6 max-w-7xl mx-auto -mt-6 mb-10" id="reset-mode-banner">
        <div className="bg-gradient-to-r from-emerald-900 to-[#0e2715] rounded-[2rem] border border-emerald-500/10 p-6 sm:p-8 relative overflow-hidden shadow-md flex flex-col md:flex-row justify-between items-center gap-6 text-left">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10 text-left">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
              <Leaf className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-300 block font-bold">New Release Feature</span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">RESET MODE – 1 Minute Mind Cleanse</h3>
              <p className="text-xs text-sage-200 leading-normal max-w-lg mt-0.5">
                Feeling stressed, overwhelmed, or anxious? Try this quick 60-second distraction-free guided breathing, organic audio, and serene focal reset to re-anchor your headspace.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsResetModeOpen(true)}
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition duration-200 scale-100 hover:scale-[1.02] cursor-pointer flex items-center gap-2 relative z-10 shrink-0 uppercase tracking-wider"
          >
            <span>Activate Reset Mode ⚡</span>
          </button>
        </div>
      </section>


      {/* --- ABOUT SERENITY FOREST SECTION --- */}
      <section id="about-section-shortcut" className="py-20 px-6 max-w-7xl mx-auto border-t border-forest-800/10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-800 bg-sage-100 px-3.5 py-1.5 rounded-full inline-block">
              Organic Restoration
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-forest-900 tracking-tight leading-tight">
              Slow down. <br />
              Breathe deeply. <br />
              Reconnect.
            </h2>
            <div className="pt-2">
              <a 
                href="#download-section-shortcut" 
                className="px-6 py-3 bg-forest-800 hover:bg-[#1f3614] text-white text-xs font-bold rounded-full shadow-md inline-flex items-center gap-2 transition-all scale-100 hover:scale-[1.02]"
              >
                <span>Interactive Sandbox Preview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-[2rem] border border-forest-800/10 p-8 sm:p-12 shadow-sm space-y-6">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-forest-900 leading-snug">
              Serenity Forest is a complete wellness and mindfulness platform designed to help people reduce stress, improve focus, build healthy habits, and maintain emotional balance.
            </h3>
            
            <p className="text-forest-800/70 text-sm sm:text-md leading-relaxed font-sans">
              We live in a world that never sleeps, with constant notifications, demands, and hyper-stimulation exhausting our nervous system. Serenity Forest acts as your digital counterpart: a sensory ecosystem that respects your rhythm, shields your private data, and supplies elegant pathways to recover.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-forest-800/10">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm text-forest-900">🌿 Student-First Compassion</h4>
                <p className="text-xs text-forest-800/60 leading-normal">
                  Initiated explicitly to relieve acute pressures experienced in academic environments.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm text-forest-900">🔒 Secure Cloud Storage</h4>
                <p className="text-xs text-forest-800/60 leading-normal">
                  Encrypted synchronization with secure data boundaries to protect your personal mental sanctuary.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* --- OUR MISSION & VISION SECTIONS --- */}
      <section className="py-16 bg-gradient-to-br from-sage-100/10 via-[#F8F9F3]/90 to-beige-50 border-t border-b border-forest-800/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="p-8 sm:p-12 rounded-[2rem] bg-white border border-forest-800/10 shadow-sm space-y-4 hover:shadow-md transition duration-350">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 border border-sage-300 flex items-center justify-center text-forest-800">
              <Feather className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-forest-750 font-mono">Strategic Mandate</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight">Our Mission</h3>
            </div>

            <p className="text-forest-800/75 text-sm sm:text-md leading-relaxed font-sans">
              To help people slow down, breathe, focus, and find peace in a fast-moving and stressful world.
            </p>
          </div>

          {/* Vision Card */}
          <div className="p-8 sm:p-12 rounded-[2rem] bg-white border border-forest-800/10 shadow-sm space-y-4 hover:shadow-md transition duration-350">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 border border-sage-300 flex items-center justify-center text-forest-800">
              <Compass className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-forest-750 font-mono">Future Horizon</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight">Our Vision</h3>
            </div>

            <p className="text-forest-800/75 text-sm sm:text-md leading-relaxed font-sans">
              To create a digital sanctuary where anyone can improve their mental well-being, reduce stress, and reconnect with themselves.
            </p>
          </div>

        </div>
      </section>


      {/* --- ALL 16 INTEGRATED FEATURES SECTION --- */}
      <section id="features-section" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-800 bg-sage-100 px-3.5 py-1.5 rounded-full inline-block font-mono">
              Integrated Ecology Toolset
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight leading-none">
              Explore Our Curated Suite of 16 Features
            </h2>
            <p className="text-forest-800/70 text-sm sm:text-md max-w-2xl leading-relaxed">
              Every feature inside the Serenity Forest platform is engineered with extreme consideration to detail, keeping you calm and productive. Change categories below:
            </p>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'all', label: 'All 16 Features' },
              { id: 'focus', label: 'Flow & Focus' },
              { id: 'mind', label: 'Quiet Minds' },
              { id: 'tracking', label: 'Sensory Progress' }
            ].map((bt) => (
              <button
                key={bt.id}
                onClick={() => setActiveFeatureTab(bt.id as any)}
                className={`px-4.5 py-2 rounded-full text-xs font-semibold transition duration-200 cursor-pointer ${
                  activeFeatureTab === bt.id
                    ? 'bg-forest-800 text-white shadow-md'
                    : 'bg-white hover:bg-stone-50 text-forest-850 border border-forest-800/10'
                }`}
              >
                {bt.label}
              </button>
            ))}
          </div>

        </div>

        {/* Dynamic Bento-Grid Features Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFeatures.map((ft, i) => (
            <div 
              key={i} 
              className="p-6 bg-white rounded-[2rem] border border-forest-800/10 shadow-xs hover:shadow-md hover:border-sage-400/80 transition duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-beige-50 border border-forest-800/5 flex items-center justify-center transition group-hover:scale-105">
                  {ft.icon}
                </div>
                
                <h4 className="font-serif text-md sm:text-lg font-bold text-forest-900 group-hover:text-forest-750 transition">
                  {ft.title}
                </h4>
              </div>

              <p className="text-[11px] sm:text-xs text-forest-800/70 leading-relaxed font-sans">
                {ft.desc}
              </p>

              <div className="pt-2 border-t border-forest-800/5 flex items-center justify-between text-[11px] text-forest-800 font-semibold invisible group-hover:visible">
                <span>Access inside app</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-sage-400" />
              </div>
            </div>
          ))}
        </div>

      </section>


      {/* --- RECONSTRUCTED INTERACTIVE EMERGENCY RELIEF SECTION --- */}
      <Suspense fallback={
        <div className="py-12 flex justify-center items-center">
          <div className="animate-pulse flex items-center gap-2 text-xs font-mono text-stone-400">
            <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
            <span>Loading Emergency Relax Module...</span>
          </div>
        </div>
      }>
        <EmergencyRelax />
      </Suspense>


      {/* --- THE MOOD-BASED RECOMMENDATIONS SYSTEM --- */}
      <Suspense fallback={
        <div className="py-16 text-center">
          <div className="animate-pulse inline-flex items-center gap-2 text-xs font-mono text-stone-400">
            <Compass className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Loading Recommendations System...</span>
          </div>
        </div>
      }>
        <MoodWellnessSystem />
      </Suspense>


      {/* --- NATURE ACHIEVEMENT STEPS PROGRESS ROADMAP --- */}
      <Suspense fallback={
        <div className="py-16 text-center">
          <div className="animate-pulse inline-flex items-center gap-2 text-xs font-mono text-stone-400">
            <Award className="w-4 h-4 animate-spin text-[#fabf24]" />
            <span>Loading Achievement Roadmap...</span>
          </div>
        </div>
      }>
        <AchievementJourney />
      </Suspense>


      {/* --- REAL-TIME PHONE PLATFORM PREVIEW SIMULATOR --- */}
      <Suspense fallback={
        <div className="py-16 text-center">
          <div className="animate-pulse inline-flex items-center gap-2 text-xs font-mono text-stone-400">
            <Smartphone className="w-4 h-4 animate-bounce text-blue-500" />
            <span>Loading Simulator Sandbox...</span>
          </div>
        </div>
      }>
        <InteractivePhoneMockup />
      </Suspense>


      {/* --- 8 CORE WELLNESS BENEFITS SECTION --- */}
      <section id="benefits-section" className="py-20 bg-gradient-to-br from-beige-100/50 to-white border-t border-b border-forest-800/10">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-800 bg-sage-100 px-3.5 py-1.5 rounded-full inline-block font-mono">
              Immediate Benefits
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 tracking-tight leading-tight">
              Science-Backed Somatic Benefits
            </h2>
            <p className="text-forest-800/70 text-sm sm:text-md leading-relaxed max-w-xl mx-auto font-sans">
              Through repeated checks and integrated breathing routines, Serenity Forest secures verified biological advantages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefitsData.map((bn, idx) => (
              <div 
                key={idx}
                className={`p-6 bg-white rounded-[2rem] border border-forest-800/10 shadow-xs transition duration-300 space-y-3 flex flex-col justify-between hover:border-sage-300 ${bn.color}`}
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-sage-100 border border-sage-300 text-forest-800 font-extrabold flex items-center justify-center text-xs">
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>
                  <h4 className="font-serif text-md sm:text-lg font-bold text-forest-900">{bn.title}</h4>
                </div>
                <p className="text-xs text-forest-800/70 leading-relaxed font-sans">{bn.desc}</p>
                <span className="text-[10px] font-mono text-[#2D4F1E] font-semibold">Active Restored Layer</span>
              </div>
            ))}
          </div>

        </div>
      </section>



      {/* --- PROFESSIONAL FOUNDER INTRODUCTION SECTION --- */}
      <section id="founder-section" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-[2rem] bg-white border border-forest-800/10 shadow-sm p-8 sm:p-14 md:p-16 relative overflow-hidden">
          
          {/* Subtle decoration lines */}
          <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-64 h-64 border border-forest-850/5 rounded-full select-none" />
          <div className="absolute left-[5%] bottom-1/4 w-12 h-12 text-forest-800/5 select-none font-extrabold text-5xl">🌿</div>

          <div className="relative max-w-4xl mx-auto space-y-8">
            
            <span className="text-[10px] font-bold uppercase tracking-widest text-forest-800 bg-sage-100 px-3.5 py-1.5 rounded-full inline-block font-mono">
              Founders Statement
            </span>

            <blockquote className="font-serif text-lg sm:text-xl md:text-2xl font-medium italic text-forest-900 leading-relaxed relative">
              "Hi, I'm Rigvedya Singh Deora, founder of Serenity Forest.
              <br /><br />
              I created Serenity Forest because I understand how much stress, pressure, anxiety, and mental overload people, especially students, can experience every day.
              <br /><br />
              My goal is to create a peaceful digital space where people can relax, focus, breathe, and take care of their mental well-being through simple and meaningful tools.
              <br /><br />
              Serenity Forest was created with the belief that everyone deserves a place to pause, recharge, and find peace in their daily lives.
              <br /><br />
              Thank you for being part of this journey."
            </blockquote>

            <div className="pt-4 border-t border-forest-800/10 flex items-center gap-4">
              <div className="leading-tight">
                <cite className="font-serif text-md sm:text-lg font-bold text-forest-900 not-italic block uppercase tracking-wide">Rigvedya Singh Deora</cite>
                <span className="text-xs text-forest-800/60 font-mono tracking-wider italic">Founder & Developer, Serenity Forest</span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* --- DOWNLOAD & GET START SECTION --- */}
      <section id="download-section" className="py-20 px-6 max-w-7xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sage-100/15 pointer-events-none" />

        <div className="relative z-10 rounded-[2rem] bg-gradient-to-br from-[#1B3012] to-[#0F1E0A] text-white p-8 sm:p-14 md:p-16 shadow-xl border border-[#2D4F1E]/20 space-y-8">
          
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9DBEBB] bg-[#9DBEBB]/15 px-3.5 py-1.5 rounded-full inline-block font-mono">
              Start Sowing Mindful Seeds Today
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Start Your Journey Toward Peace
            </h2>
            
            <p className="text-[#EFF1EB]/80 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto font-sans">
              Reconnect with your natural baseline, establish focused habits, logs, and charts through Serenity Forest.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Serenity Forest Android APK (.apk) file packaging starting download on device root storage."); }}
              className="w-full sm:w-auto px-8 py-4 bg-[#EFF1EB] hover:bg-white text-forest-900 font-semibold text-xs rounded-xl shadow-md transition-all scale-100 hover:scale-[1.03] flex items-center justify-center gap-2"
              id="android-download-button"
            >
              <Smartphone className="w-4 h-4 text-forest-700" />
              Download Android App
            </a>

            <button
              onClick={handleInstallApp}
              className="w-full sm:w-auto px-8 py-4 bg-peach-accent hover:bg-[#d66a4f] text-white font-semibold text-xs rounded-xl shadow-md transition-all scale-100 hover:scale-[1.03] flex items-center justify-center gap-2"
            >
              <Laptop className="w-4 h-4 text-white" />
              Install Web App (PWA)
            </button>

            <a
              href="#nav-bar"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/10 transition-all scale-100 hover:scale-[1.03] flex items-center justify-center gap-1.5"
            >
              Open Web Version
            </a>

          </div>

          <p className="text-[10px] text-sage-400">
            For secure offline PWA installations, simply click the Install button to add onto your home dashboard directly.
          </p>

        </div>
      </section>


      {/* --- IMMERSIVE SEARCH KEYWORDS MAP (SEO SEED) --- */}
      <section className="py-12 bg-white/40 border-t border-b border-forest-800/10 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-forest-800/50 font-mono">Search Engine Index Categories</span>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'Stress Relief App', 'Focus App', 'Meditation App', 'Nature Wellness App', 
              'Mental Wellness Platform', 'Mindfulness App', 'Calm Mind App', 'Productivity and Wellness App'
            ].map((kw) => (
              <span key={kw} className="px-3.5 py-1.5 rounded-full bg-white hover:bg-sage-100 text-forest-800 transition border border-forest-800/10 text-xs font-mono font-bold cursor-default">
                #{kw}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* --- CONTACT INQUIRY & ALL GENERAL FAQS SECTION --- */}
      <ContactFAQ />


      {/* --- PREMIUM FOOTER FOOTPRINT --- */}
      <footer className="bg-stone-900 text-stone-400 py-16 px-6 border-t border-stone-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src={brandLogoImage} 
                referrerPolicy="no-referrer"
                className="w-8 h-8 object-cover rounded-full border border-amber-500/30 shadow-md" 
                alt="Serenity Forest Seal"
              />
              <span className="font-serif font-extrabold text-md text-white">Serenity Forest</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
              Serenity Forest is a complete wellness and mindfulness platform designed to help people reduce stress, improve focus, build healthy habits, and maintain emotional balance.
            </p>
            <div className="pt-2 text-xs text-stone-500 font-mono">
              © 2026 Serenity Forest Platform. Developed by Rigvedya Singh Deora.
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-widest text-white">Navigation</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#hero-section" className="hover:text-[#a1d494] transition">Home</a></li>
                <li><a href="#about-section-shortcut" className="hover:text-[#a1d494] transition">About Us</a></li>
                <li><a href="#features-section" className="hover:text-[#a1d494] transition">Features Directory</a></li>
                <li><a href="#founder-section" className="hover:text-[#a1d494] transition">Founder Bio</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-widest text-white">Pathways</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#download-section" className="hover:text-[#a1d494] transition">Download Hub</a></li>
                <li><a href="#faq-section-anchor" className="hover:text-[#a1d494] transition">General FAQ</a></li>
                <li><a href="#contact-section" className="hover:text-[#a1d494] transition">Contact Branch</a></li>
              </ul>
            </div>

            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h5 className="text-xs font-bold uppercase tracking-widest text-white">Legal Boundaries</h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button 
                    onClick={() => setIsPrivacyOpen(true)}
                    className="hover:text-[#a1d494] transition text-left cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); alert("Terms of Service: This platform is meant for wellness, habit restoration, and focusing. It is not an alternative to professional clinical aid. Enjoy fully offline."); }}
                    className="hover:text-[#a1d494] transition"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </footer>

      {/* --- FLOATING FULL SCREEN RESET MODE OVERLAY --- */}
      <Suspense fallback={null}>
        <ResetMode isOpen={isResetModeOpen} onClose={() => setIsResetModeOpen(false)} />
      </Suspense>

      {/* --- PRIVACY POLICY COMPREHENSIVE OVERLAY --- */}
      <Suspense fallback={null}>
        <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      </Suspense>

      {/* --- USER ACCOUNT PROFILE MODAL OVERLAY --- */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto relative rounded-[2rem] bg-stone-50 dark:bg-stone-900 border border-stone-200/50 dark:border-white/5 shadow-2xl">
            <Suspense fallback={
              <div className="p-12 text-center text-xs font-mono text-stone-400">
                <User className="w-6 h-6 mx-auto animate-pulse text-emerald-600 mb-2" />
                <span>Opening Profile Sanctuary...</span>
              </div>
            }>
              <UserProfilePage onClose={() => setIsProfileOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}

      {/* --- USER AUTH GATEWAY MODAL OVERLAY --- */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <Suspense fallback={
            <div className="fixed inset-0 bg-stone-950/75 backdrop-blur-md flex items-center justify-center z-50">
              <div className="animate-pulse text-center space-y-2 text-stone-400 font-mono text-xs">
                <ShieldCheck className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                <span>Securing Authentication Portal...</span>
              </div>
            </div>
          }>
            <AuthGateway 
              initialTab={authTab === 'forgot' ? 'forgot' : authTab} 
              onClose={() => setIsAuthOpen(false)} 
            />
          </Suspense>
        </div>
      )}

    </div>
  );
}
