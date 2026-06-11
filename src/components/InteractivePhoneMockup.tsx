import React, { useState, useEffect } from 'react';
import { 
  Compass, Heart, Calendar, Play, Pause, RefreshCw, BarChart2, BookOpen, 
  Smartphone, Plus, CheckCircle, Flame, Moon, Sparkles, Smile, Sun, Feather 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'Home Dashboard' | 'Focus Timer' | 'Meditation Center' | 'Nature Sounds' | 'Mood Tracker' | 'Gratitude Journal' | 'Wellness Statistics';

const appTabs: { name: TabType; description: string; tag: string }[] = [
  { name: 'Home Dashboard', description: 'Your organic forest sanctuary home page, outlining daily streaks, and customized guidance.', tag: 'Sanctuary' },
  { name: 'Focus Timer', description: 'Run responsive, task-aligned Pomodoro cycles styled like growing forest seedlings.', tag: 'Focus' },
  { name: 'Meditation Center', description: 'Guided audio portals designed to promote fast delta waves and active release.', tag: 'Mindfulness' },
  { name: 'Nature Sounds', description: 'Layer physical outdoor noise: rainstorms, crackling logs, rivers, and winds.', tag: 'Atmosphere' },
  { name: 'Mood Tracker', description: 'Chronicle emotional baselines with a beautiful botanical calendar logger.', tag: 'Tracking' },
  { name: 'Gratitude Journal', description: 'Transcribe daily positive notes on scrolls and plant them to grow trees.', tag: 'Journal' },
  { name: 'Wellness Statistics', description: 'Dynamic, local telemetry mapping sleep depth, daily stress levels, and focus.', tag: 'Statistics' },
];

export default function InteractivePhoneMockup() {
  const [activeTab, setActiveTab] = useState<TabType>('Home Dashboard');
  const [interactiveAuthPrompt, setInteractiveAuthPrompt] = useState<string | null>(null);

  const triggerAuthModal = (tab: 'login' | 'signup') => {
    const event = new CustomEvent('open-auth-modal', { detail: { tab } });
    window.dispatchEvent(event);
  };
  
  // Real Firestore Context integration
  const { 
    user,
    profile: realProfile, 
    moodLogs: realMoodLogs, 
    journalEntries: realJournalEntries, 
    focusSessions: realFocusSessions, 
    meditations: realMeditations,
    addMoodLog, 
    addJournalEntry, 
    addFocusSession, 
    addMeditationHistory 
  } = useAuth();

  // Guest mock databases so visitors get a fully responsive sandbox before registering
  const [guestProfile, setGuestProfile] = useState({
    displayName: 'Forest Guest',
    streak: 1,
    totalFocusMinutes: 45,
    completedMeditations: 3,
    selectedAchievementIdx: 1,
  });

  const [guestMoodLogs, setGuestMoodLogs] = useState<any[]>([
    { id: '1', moodId: 'Calm 🌿', date: 'Jun 11', timestamp: new Date() },
    { id: '2', moodId: 'Happy ☀️', date: 'Jun 10', timestamp: new Date() },
  ]);

  const [guestJournalEntries, setGuestJournalEntries] = useState<any[]>([
    { id: '1', text: 'I am grateful for the cool wind in the morning.' },
    { id: '2', text: 'Thankful for a quiet space to focus.' }
  ]);

  const activeUser = user;
  const profile = activeUser ? realProfile : guestProfile;
  const moodLogs = activeUser ? realMoodLogs : guestMoodLogs;
  const journalEntries = activeUser ? realJournalEntries : guestJournalEntries;

  // Focus Timer States
  const [timerLeft, setTimerLeft] = useState(1500); // 25:00
  const [timerOn, setTimerOn] = useState(false);
  const [timerTag, setTimerTag] = useState('Deep Writing');

  // Gratitude entry drafts
  const [gratitudeDraft, setGratitudeDraft] = useState('');

  // Mood Tracker State
  const [logMood, setLogMood] = useState('Calm 🌿');

  // Nature Sounds states
  const [activeSounds, setActiveSounds] = useState<{ [key: string]: boolean }>({
    'Summer Rain': true,
    'Valley Creek': false,
    'Campfire Crackle': true
  });

  // Focus timer loop
  useEffect(() => {
    let focusInterval: any;
    if (timerOn && timerLeft > 0) {
      focusInterval = setInterval(() => {
        setTimerLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerLeft === 0) {
      setTimerOn(false);
      if (activeUser) {
        addFocusSession(1500, timerTag).catch(console.error);
      } else {
        setGuestProfile(prev => ({
          ...prev,
          totalFocusMinutes: prev.totalFocusMinutes + 25
        }));
        alert(`🎓 Guest Sandbox: Focus session of 25 mins completed! Create an account to log focus streaks.`);
        setInteractiveAuthPrompt("Sign in to save focus sessions to statistics!");
      }
    }
    return () => clearInterval(focusInterval);
  }, [timerOn, timerLeft]);

  const addGratitude = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gratitudeDraft.trim()) {
      if (activeUser) {
        try {
          await addJournalEntry(gratitudeDraft.trim());
          setGratitudeDraft('');
        } catch (err) {
          console.error("Error setting journal", err);
        }
      } else {
        const newLog = { id: Date.now().toString(), text: gratitudeDraft.trim(), timestamp: new Date() };
        setGuestJournalEntries(prev => [newLog, ...prev]);
        setGratitudeDraft('');
        setInteractiveAuthPrompt("Register an account to sync your gratitude scrolls!");
      }
    }
  };

  const registerMood = async (m: string) => {
    setLogMood(m);
    const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (activeUser) {
      try {
        await addMoodLog(m, dateStr);
      } catch (err) {
        console.error("Error setting mood log", err);
      }
    } else {
      const newLog = { id: Date.now().toString(), moodId: m, date: dateStr, timestamp: new Date() };
      setGuestMoodLogs(prev => [newLog, ...prev]);
      setInteractiveAuthPrompt("Create a personalized account to save your logs permanently!");
    }
  };

  const handleMeditationPlay = async (activity: string, duration: string) => {
    if (activeUser) {
      try {
        await addMeditationHistory(activity, duration);
        alert(`🧘 Guided Breath Complete! You completed: "${activity}" (${duration}). Nice work!`);
      } catch (err) {
        console.error(err);
      }
    } else {
      setGuestProfile(prev => ({
        ...prev,
        completedMeditations: prev.completedMeditations + 1
      }));
      alert(`🧘 Guest Sandbox: You completed "${activity}" (${duration}). Sign up to track your meditation streaks!`);
      setInteractiveAuthPrompt("Sign up to save meditation achievements!");
    }
  };

  // Convert seconds to clean display MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <div className="py-16 px-6 max-w-7xl mx-auto" id="download-section-shortcut">
      <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-forest-600 bg-forest-600/10 px-3.5 py-1.5 rounded-full inline-block">
          Interactive Product Showcase
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 tracking-tight leading-tight">
          Explore Serenity Forest Live
        </h2>
        <p className="text-stone-600 text-md leading-relaxed max-w-xl mx-auto">
          Test-drive the mobile interface right here. Click on different utilities to preview actual interactive screens of the Serenity Forest platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Dynamic Feature Curators */}
        <div className="lg:col-span-5 space-y-3 order-2 lg:order-1">
          {appTabs.map((tab) => {
            const isSelected = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full text-left p-4 rounded-2xl border transition duration-300 flex items-start gap-4 cursor-pointer hover:bg-white ${
                  isSelected 
                    ? 'bg-white border-forest-500 shadow-md translate-x-2' 
                    : 'bg-white/40 border-stone-200/60'
                }`}
              >
                <div className={`p-2.5 rounded-xl transition ${isSelected ? 'bg-forest-600 text-white animate-pulse' : 'bg-stone-100 text-stone-500'}`}>
                  {tab.name === 'Home Dashboard' && <Feather className="w-4 h-4" />}
                  {tab.name === 'Focus Timer' && <Flame className="w-4 h-4" />}
                  {tab.name === 'Meditation Center' && <Compass className="w-4 h-4" />}
                  {tab.name === 'Nature Sounds' && <Sparkles className="w-4 h-4" />}
                  {tab.name === 'Mood Tracker' && <Smile className="w-4 h-4" />}
                  {tab.name === 'Gratitude Journal' && <BookOpen className="w-4 h-4" />}
                  {tab.name === 'Wellness Statistics' && <BarChart2 className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-stone-900">{tab.name}</h4>
                    <span className="text-[9px] font-mono font-semibold bg-stone-100 text-stone-500 px-1.5 rounded-md">
                      {tab.tag}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 leading-normal">
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Smartphone Simulation Body Frame */}
        <div className="lg:col-span-7 flex justify-center order-1 lg:order-2">
          
          {/* Main outer metal edge boundary */}
          <div className="relative w-[310px] sm:w-[330px] h-[640px] rounded-[48px] bg-stone-900 border-[10px] border-stone-800 shadow-2xl flex flex-col overflow-hidden ring-12 ring-stone-900/10">
            
            {/* Camera Speaker Notch Spacer */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-900 rounded-full z-40 flex items-center justify-center gap-1.5 px-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900/80" />
              <div className="w-16 h-1 bg-stone-800 rounded-full" />
            </div>

            {/* Glowing active notch highlight */}
            <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#bcf0ae]/15 to-transparent pointer-events-none z-30" />

            {/* Interactive Internal OS Simulator Screen */}
            <div className="flex-1 bg-gradient-to-b from-[#f9faf2] to-[#edefe7] pt-10 pb-6 px-4 flex flex-col justify-between overflow-y-auto z-10 font-sans text-stone-900 select-none">
              
              {/* Dynamic App Mockup Screen Views */}
              <div className="flex-1 flex flex-col">
                
                {interactiveAuthPrompt && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-col items-start text-left space-y-1.5 animate-fade-in mb-3">
                    <p className="text-[10px] text-blue-900 font-bold leading-tight">✨ {interactiveAuthPrompt}</p>
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => {
                          triggerAuthModal('signup');
                          setInteractiveAuthPrompt(null);
                        }}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[8px] font-bold cursor-pointer transition uppercase tracking-wider"
                      >
                        Sign Up Free
                      </button>
                      <button
                        onClick={() => setInteractiveAuthPrompt(null)}
                        className="px-2 py-1 bg-stone-300 hover:bg-stone-400 text-stone-700 rounded-lg text-[8px] font-bold cursor-pointer transition uppercase"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 1: HOME DASHBOARD */}
                {activeTab === 'Home Dashboard' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div className="max-w-[150px]">
                        <span className="text-[10px] font-semibold text-stone-500 block truncate">
                          {['Seed 🌱', 'Sprout 🌿', 'Sapling 🌲', 'Young Tree 🌳', 'Strong Oak 🪵', 'Forest Guardian 🧙', 'Serenity Master 👑'][profile?.selectedAchievementIdx ?? 0]}
                        </span>
                        <h4 className="font-serif text-base font-bold text-[#154212] truncate mt-0.5">
                          {profile?.displayName || 'Forest Guest'}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold shrink-0">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-transparent" />
                        <span>{profile?.streak ?? 1} Streak</span>
                      </div>
                    </div>

                    {!activeUser && (
                      <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex flex-col items-center text-center space-y-1.5 animate-pulse">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-900 font-mono">🔒 Guest Explorer Sandbox</span>
                        <p className="text-[9px] text-amber-800 leading-tight">
                          Sync achievements, custom sound mixes, and logs by establishing an account.
                        </p>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => triggerAuthModal('login')}
                            className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-[8px] font-bold cursor-pointer transition uppercase"
                          >
                            Sign In
                          </button>
                          <button
                            onClick={() => triggerAuthModal('signup')}
                            className="px-2.5 py-1 bg-[#2d5a27] hover:bg-[#1f3e1a] text-white rounded-lg text-[8px] font-bold cursor-pointer transition uppercase font-semibold"
                          >
                            Sign Up
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Calming banner */}
                    <div className="p-3.5 rounded-2xl bg-forest-600/10 border border-forest-500/20 text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-forest-700 font-mono">Daily Affirmation</span>
                      <p className="font-serif text-[11px] italic text-forest-900 leading-normal">
                        "Like trees rooted deep in wild mountains, I too can withstand the busy winds."
                      </p>
                    </div>

                    {/* Forest growth tree widget */}
                    <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#e2f3e5] border border-[#a1d494] flex items-center justify-center text-xl shrink-0">
                        {['🌱', '🌿', '🌲', '🌳', '🪵', '🧙', '👑'][profile?.selectedAchievementIdx ?? 0]}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-stone-850">
                          <span className="truncate">Active Level: {['Seed', 'Sprout', 'Sapling', 'Young Tree', 'Strong Oak', 'Forest Guardian', 'Serenity Master'][profile?.selectedAchievementIdx ?? 0]}</span>
                          <span>{Math.min(100, Math.round(((profile?.totalFocusMinutes ?? 0) / 1000) * 100))}%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#2d5a27] h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.round(((profile?.totalFocusMinutes ?? 0) / 1000) * 100))}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Quick navigation modules */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Curated Journey</h5>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#a1d494] transition text-center space-y-1">
                          <span className="text-xl">🧘</span>
                          <h6 className="font-bold text-[10px]">Guided Zen</h6>
                          <p className="text-[9px] text-stone-400">10 mins breath</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#a1d494] transition text-center space-y-1">
                          <span className="text-xl">🌧️</span>
                          <h6 className="font-bold text-[10px]">Cloud Rain</h6>
                          <p className="text-[9px] text-stone-400">Sleep wellness</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: FOCUS TIMER */}
                {activeTab === 'Focus Timer' && (
                  <div className="space-y-4 text-center">
                    <div className="flex justify-between items-center text-left">
                      <div>
                        <h4 className="font-serif text-md font-bold text-[#154212]">Seedling Timer</h4>
                        <span className="text-[9px] text-stone-400">Stay grounded for growth</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-[#e2f3e5] text-forest-700 px-2 py-0.5 rounded-full">
                        Tag: {timerTag}
                      </span>
                    </div>

                    {/* Timer Circle */}
                    <div className="relative w-40 h-40 mx-auto flex items-center justify-center my-4">
                      {/* Circle track backdrop */}
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="72" stroke="#e7e9e1" strokeWidth="6" fill="transparent" />
                        <circle 
                          cx="80" 
                          cy="80" 
                          r="72" 
                          stroke="#2d5a27" 
                          strokeWidth="6" 
                          fill="transparent" 
                          strokeDasharray={452}
                          strokeDashoffset={452 - (452 * (timerLeft / 1500))}
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      <div className="space-y-1">
                        <span className="text-3xl font-extrabold tracking-tight font-serif text-stone-900 block">
                          {formatTime(timerLeft)}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#a1d494] block">
                          {timerOn ? 'Flowing' : 'Paused'}
                        </span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setTimerOn(!timerOn)}
                        className="px-6 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-full text-xs font-bold shadow-xs transition"
                      >
                        {timerOn ? 'Pause' : 'Start Cycle'}
                      </button>
                      <button
                        onClick={() => { setTimerLeft(1500); setTimerOn(false); }}
                        className="p-2 bg-stone-200 text-stone-600 rounded-full hover:bg-stone-300 transition"
                        title="Reset"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Active focus tags */}
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1.5">Change Focus Zone:</span>
                      <div className="flex gap-1.5 justify-center">
                        {['Deep Writing', 'Mind Settle', 'Idea Map'].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => { setTimerTag(tag); setTimerLeft(1500); setTimerOn(false); }}
                            className={`px-2 py-1 rounded-lg text-[9px] font-bold transition ${timerTag === tag ? 'bg-forest-800 text-white' : 'bg-white text-stone-600 border border-stone-200'}`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: MEDITATION CENTER */}
                {activeTab === 'Meditation Center' && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-md font-bold text-[#154212] mb-1">Guided Meditations</h4>
                    
                    <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between">
                      <div className="space-y-1">
                        <h5 className="font-bold text-xs text-stone-900">1. Anxiety Clearing Winds</h5>
                        <p className="text-[9px] text-stone-500">Release stress & deep brain speed</p>
                      </div>
                      <button 
                        onClick={() => handleMeditationPlay('Anxiety Clearing Winds', '10m')}
                        className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center text-white cursor-pointer hover:bg-forest-700 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>
                    </div>

                    <div className="p-3 bg-[#e2f3e5] rounded-2xl border border-forest-500/10 flex items-center justify-between">
                      <div className="space-y-1">
                        <h5 className="font-bold text-xs text-forest-900">2. Ancient Cedar Whispers</h5>
                        <p className="text-[9px] text-forest-700">Grounding and spiritual clarity</p>
                      </div>
                      <button 
                        onClick={() => handleMeditationPlay('Ancient Cedar Whispers', '15m')}
                        className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center text-white cursor-pointer hover:bg-forest-700 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between">
                      <div className="space-y-1">
                        <h5 className="font-bold text-xs text-stone-900">3. Floating Stream Drift</h5>
                        <p className="text-[9px] text-stone-500">Perfect to unwind before deep sleep</p>
                      </div>
                      <button 
                        onClick={() => handleMeditationPlay('Floating Stream Drift', '20m')}
                        className="w-8 h-8 rounded-full bg-forest-500 flex items-center justify-center text-white cursor-pointer hover:bg-forest-600 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>
                    </div>

                    <div className="rounded-2xl p-3 bg-gradient-to-r from-[#154212] to-[#2d5a27] text-white text-center space-y-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-[#a1d494] font-bold font-mono">Ambient Active Coaching</span>
                      <p className="text-[10px] text-sage-100">"Slowing down is not self-indulgent. It is vital recovery."</p>
                    </div>
                  </div>
                )}

                {/* TAB 4: NATURE SOUNDS */}
                {activeTab === 'Nature Sounds' && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-md font-bold text-[#154212] mb-1">Synthetically Blending Tracks</h4>
                    
                    <div className="space-y-3">
                      {Object.keys(activeSounds).map((sound) => {
                        const play = activeSounds[sound];
                        return (
                          <div key={sound} className="p-3 bg-white rounded-xl border border-stone-200 flex justify-between items-center transition">
                            <div className="space-y-1 flex-1">
                              <span className="text-[11px] font-bold text-stone-900 block">{sound}</span>
                              <p className="text-[9px] text-[#42a5f5]">{play ? 'Playing loops - Active Volume' : 'Paused'}</p>
                            </div>

                            <button
                              onClick={() => {
                                setActiveSounds({ ...activeSounds, [sound]: !play });
                              }}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition flex items-center gap-1.5 ${
                                play 
                                  ? 'bg-[#a1d494] text-forest-900' 
                                  : 'bg-stone-100 text-stone-500 border'
                              }`}
                            >
                              {play ? 'Active' : 'Unmute'}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Wave visualizer simulator */}
                    <div className="h-12 bg-forest-900/10 rounded-xl p-2 flex items-center justify-center gap-1">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1 bg-[#2d5a27] rounded-full animate-pulse" 
                          style={{ 
                            height: `${Math.random() * 80 + 20}%`,
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: '0.8s'
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5: MOOD TRACKER */}
                {activeTab === 'Mood Tracker' && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-md font-bold text-[#154212] mb-1">How is today's mood?</h4>
                    
                    <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-3">
                      <span className="text-[10px] text-stone-400 block text-center font-mono">Select baseline:</span>
                      
                      <div className="flex justify-around">
                        {['Calm 🌿', 'Tired 💤', 'Stressed 🔥', 'Happy ☀️'].map((m) => (
                          <button
                            key={m}
                            onClick={() => registerMood(m)}
                            className={`p-2 rounded-xl text-center text-xs font-bold transition scale-100 active:scale-95 cursor-pointer ${logMood === m ? 'bg-forest-600/10 border border-[#2d5a27] text-forest-900 font-extrabold' : 'hover:bg-stone-50 text-stone-600'}`}
                          >
                            <span className="text-xl block mb-1">{m.split(' ')[1]}</span>
                            {m.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[9px] font-bold uppercase tracking-wider text-stone-400 font-mono">Ecosystem Chronicled Moods</h5>
                      
                      <div className="space-y-2 max-h-[140px] overflow-y-auto">
                        {moodLogs && moodLogs.length > 0 ? (
                          moodLogs.map((log) => (
                            <div key={log.id} className="flex justify-between p-2 rounded-xl bg-white border border-stone-200 text-xs">
                              <span className="text-stone-500 font-mono text-[10px]">{log.date || 'Today'}</span>
                              <span className="font-bold text-[#154212]">{log.moodId}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-stone-450 italic py-4 text-center">No logged baseline logs today yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: GRATITUDE JOURNAL */}
                {activeTab === 'Gratitude Journal' && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-md font-bold text-[#154212] mb-1">Plant Gratitude Seeds</h4>
                    
                    <form onSubmit={addGratitude} className="space-y-2">
                      <textarea
                        value={gratitudeDraft}
                        onChange={(e) => setGratitudeDraft(e.target.value)}
                        placeholder="Today, I am grateful for..."
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#2d5a27] bg-white resize-none"
                        rows={2}
                      />
                      <button
                        type="submit"
                        className="w-full py-2 bg-[#2D4F1E] text-white rounded-full text-[10px] font-bold tracking-wider cursor-pointer font-mono uppercase"
                      >
                        + Plant This Seed
                      </button>
                    </form>

                    <div className="space-y-2">
                      <h5 className="text-[9px] font-bold uppercase tracking-wider text-stone-400 font-mono">Growing Gratitude (Scrolls)</h5>
                      <div className="space-y-2 max-h-[120px] overflow-y-auto">
                        {journalEntries && journalEntries.length > 0 ? (
                          journalEntries.map((seed) => (
                            <div key={seed.id} className="p-2.5 bg-white border border-stone-200/80 rounded-xl text-[10px] text-stone-600 italic relative leading-relaxed">
                              "{seed.text}"
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-stone-450 italic py-4 text-center">Write scroll above to sow seedlings.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 7: WELLNESS STATISTICS */}
                {activeTab === 'Wellness Statistics' && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-md font-bold text-[#154212] mb-1">Wellness Telemetry</h4>
                    
                    {/* Stress Level Area Mock */}
                    <div className="p-3 bg-white rounded-xl border border-stone-200/80 space-y-1 bg-gradient-to-br from-white to-[#e2f3e5]/20">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-stone-500 font-bold uppercase">Stress Trend</span>
                        <span className="text-forest-700 font-bold">-32% Average Deceleration</span>
                      </div>
                      
                      <div className="h-16 flex items-end justify-between pt-2">
                        {[40, 38, 25, 29, 18, 15, 11].map((val, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-3 bg-red-800/20 rounded-full h-12 relative overflow-hidden">
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#2d5a27] to-[#a1d494] rounded-full" style={{ height: `${val * 2.2}%` }} />
                            </div>
                            <span className="text-[8px] font-mono text-stone-400">M</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Numeric breakdown grids */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
                        <span className="text-[9px] text-stone-400 italic block">Total Focus Time</span>
                        <p className="font-extrabold text-stone-800 text-[11px]">{profile?.totalFocusMinutes ?? 0} mins</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
                        <span className="text-[9px] text-stone-400 italic block">Completed Meditations</span>
                        <p className="font-extrabold text-stone-800 text-[11px]">{profile?.completedMeditations ?? 0} sess</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Simulated Device OS Navigation bar */}
              <div className="border-t border-stone-200 pt-3 flex justify-around items-center text-stone-400">
                <Feather className={`w-4 h-4 cursor-pointer transition ${activeTab === 'Home Dashboard' ? 'text-forest-700 font-extrabold scale-110' : 'hover:text-stone-700'}`} onClick={() => setActiveTab('Home Dashboard')} />
                <Flame className={`w-4 h-4 cursor-pointer transition ${activeTab === 'Focus Timer' ? 'text-forest-700 font-extrabold scale-110' : 'hover:text-stone-700'}`} onClick={() => setActiveTab('Focus Timer')} />
                <Plus className="w-5 h-5 text-stone-300 pointer-events-none" />
                <Smile className={`w-4 h-4 cursor-pointer transition ${activeTab === 'Mood Tracker' ? 'text-forest-700 font-extrabold scale-110' : 'hover:text-stone-700'}`} onClick={() => setActiveTab('Mood Tracker')} />
                <BarChart2 className={`w-4 h-4 cursor-pointer transition ${activeTab === 'Wellness Statistics' ? 'text-forest-700 font-extrabold scale-110' : 'hover:text-stone-700'}`} onClick={() => setActiveTab('Wellness Statistics')} />
              </div>

            </div>

            {/* Simulated home indicator strip */}
            <div className="absolute bottom-1 w-24 h-1 left-1/2 -translate-x-1/2 bg-stone-300 rounded-full z-15" />
          </div>

        </div>

      </div>
    </div>
  );
}
