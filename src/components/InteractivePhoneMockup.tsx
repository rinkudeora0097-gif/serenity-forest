import React, { useState, useEffect } from 'react';
import { 
  Compass, Heart, Calendar, Play, Pause, RefreshCw, BarChart2, BookOpen, 
  Smartphone, Plus, CheckCircle, Flame, Moon, Sparkles, Smile, Sun, Feather 
} from 'lucide-react';

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

  // Focus Timer States
  const [timerLeft, setTimerLeft] = useState(1500); // 25:00
  const [timerOn, setTimerOn] = useState(false);
  const [timerTag, setTimerTag] = useState('Deep Writing');

  // Gratitude States
  const [gratitudeDraft, setGratitudeDraft] = useState('');
  const [gratitudeSeeds, setGratitudeSeeds] = useState<string[]>([
    "Today's sunrise through the living room layout",
    "A hot cup of green tea on a quiet Tuesday",
    "Feeling restored after the deep rainstorm"
  ]);

  // Mood Tracker States
  const [logMood, setLogMood] = useState('Calm 🌿');
  const [moodLogs, setMoodLogs] = useState<{ date: string; mood: string }[]>([
    { date: 'Jun 8', mood: 'Calm 🌿' },
    { date: 'Jun 9', mood: 'Relaxed 🌊' },
  ]);

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
    }
    return () => clearInterval(focusInterval);
  }, [timerOn, timerLeft]);

  const addGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (gratitudeDraft.trim()) {
      setGratitudeSeeds([gratitudeDraft.trim(), ...gratitudeSeeds]);
      setGratitudeDraft('');
    }
  };

  const registerMood = (m: string) => {
    setLogMood(m);
    // Add only if not already logged today
    const dateStr = 'Jun 10';
    setMoodLogs([{ date: dateStr, mood: m }, ...moodLogs.filter(log => log.date !== dateStr)]);
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

                {/* TAB 1: HOME DASHBOARD */}
                {activeTab === 'Home Dashboard' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-semibold text-stone-500">Welcome to Serenity</span>
                        <h4 className="font-serif text-lg font-bold text-[#154212]">Rigvedya S.</h4>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-transparent" />
                        <span>24 Streak</span>
                      </div>
                    </div>

                    {/* Calming banner */}
                    <div className="p-3.5 rounded-2xl bg-forest-600/10 border border-forest-500/20 text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-forest-700">Daily Affirmation</span>
                      <p className="font-serif text-xs italic text-forest-900 leading-normal">
                        "Like trees rooted deep in wild mountains, I too can withstand the busy winds."
                      </p>
                    </div>

                    {/* Forest growth tree widget */}
                    <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#e2f3e5] border border-[#a1d494] flex items-center justify-center">
                        🌿
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>Active Seed: 'Sapling'</span>
                          <span>64%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#2d5a27] h-full rounded-full" style={{ width: '64%' }} />
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
                      <button className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center text-white cursor-pointer hover:bg-forest-700 transition">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>
                    </div>

                    <div className="p-3 bg-[#e2f3e5] rounded-2xl border border-forest-500/10 flex items-center justify-between">
                      <div className="space-y-1">
                        <h5 className="font-bold text-xs text-forest-900">2. Ancient Cedar Whispers</h5>
                        <p className="text-[9px] text-forest-700">Grounding and spiritual clarity</p>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center text-white cursor-pointer">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between">
                      <div className="space-y-1">
                        <h5 className="font-bold text-xs text-stone-900">3. Floating Stream Drift</h5>
                        <p className="text-[9px] text-stone-500">Perfect to unwind before deep sleep</p>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-forest-500 flex items-center justify-center text-white cursor-pointer">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>
                    </div>

                    <div className="rounded-2xl p-3 bg-gradient-to-r from-[#154212] to-[#2d5a27] text-white text-center space-y-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-[#a1d494] font-bold">Ambient Active Coaching</span>
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
                      <span className="text-[10px] text-stone-400 block text-center">Tap to document baseline:</span>
                      
                      <div className="flex justify-around">
                        {['Calm 🌿', 'Tired 💤', 'Stressed 🔥', 'Happy ☀️'].map((m) => (
                          <button
                            key={m}
                            onClick={() => registerMood(m)}
                            className={`p-2 rounded-xl text-center text-xs font-bold transition scale-100 active:scale-95 cursor-pointer ${logMood === m ? 'bg-forest-600/10 border border-[#2d5a27] text-forest-900 font-extrabold' : 'hover:bg-stone-50'}`}
                          >
                            <span className="text-xl block mb-1">{m.split(' ')[1]}</span>
                            {m.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Weekly History Logs</h5>
                      
                      <div className="space-y-2 max-h-[140px] overflow-y-auto">
                        {moodLogs.map((log, idx) => (
                          <div key={idx} className="flex justify-between p-2 rounded-xl bg-white border border-stone-200 text-xs">
                            <span className="text-stone-500 font-mono text-[10px]">{log.date}</span>
                            <span className="font-bold text-stone-900">{log.mood}</span>
                          </div>
                        ))}
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
                        className="w-full py-2 bg-gradient-to-r from-forest-800 to-forest-600 text-white rounded-full text-[10px] font-bold tracking-wider"
                      >
                        + Plant This Seed
                      </button>
                    </form>

                    <div className="space-y-2">
                      <h5 className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Growing Seeds (Scrolls)</h5>
                      <div className="space-y-2 max-h-[120px] overflow-y-auto">
                        {gratitudeSeeds.map((seed, idx) => (
                          <div key={idx} className="p-2.5 bg-white border border-stone-200/80 rounded-xl text-[10px] text-stone-600 italic relative leading-relaxed">
                            "{seed}"
                          </div>
                        ))}
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
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-forest-600 to-[#a1d494] rounded-full" style={{ height: `${val * 2.2}%` }} />
                            </div>
                            <span className="text-[8px] font-mono text-stone-400">M</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Numeric breakdown grids */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
                        <span className="text-[9px] text-stone-400 italic block">Sleep Sleep</span>
                        <p className="font-extrabold text-stone-800">7h 45m</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200/80">
                        <span className="text-[9px] text-stone-400 italic block">Mind Clarity</span>
                        <p className="font-extrabold text-stone-800">89% Peak</p>
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
