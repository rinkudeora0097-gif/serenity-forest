import React, { useState } from 'react';
import { Leaf, Award, CheckCircle, Flame, Star, ShieldCheck, Zap } from 'lucide-react';
import { AchievementLevel } from '../types';

const achievementLevels: AchievementLevel[] = [
  {
    level: '1',
    title: 'Seed',
    description: 'The foundation of mindful living. Where patience and quietude begin to settle in the subconscious soil.',
    requirement: 'Log your first daily check-in or complete 1 guided breathing session.',
    badgeColor: 'border-amber-400 bg-amber-50 text-amber-700 shadow-amber-100',
    iconName: '🌱'
  },
  {
    level: '2',
    title: 'Sprout',
    description: 'Breaking surface constraints. Your concentration blooms with the sun as you adopt restorative rhythms.',
    requirement: 'Maintain a 3-day wellness streak and log 30 focus minutes.',
    badgeColor: 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-emerald-100',
    iconName: '🌿'
  },
  {
    level: '3',
    title: 'Sapling',
    description: 'Firming organic stems. Finding durable stability against brief anxious storms and work pressure.',
    requirement: 'Log 5 gratitude journals and maintain a 5-day active streak.',
    badgeColor: 'border-teal-400 bg-teal-50 text-teal-700 shadow-teal-100',
    iconName: '🌲'
  },
  {
    level: '4',
    title: 'Young Tree',
    description: 'Extending branches of awareness. Generous focus lets you maintain a calm baseline for hours.',
    requirement: 'Complete 3 stress relief programs and track weekly mood parameters.',
    badgeColor: 'border-[#42a5f5] bg-blue-50 text-blue-700 shadow-blue-100',
    iconName: '🌳'
  },
  {
    level: '5',
    title: 'Strong Oak',
    description: 'Unshakeable presence. A mature canopy providing comfort and high focus even in noisy spaces.',
    requirement: 'Achieve 20Focus cycles (500 minutes logged) and write 15 gratitude scrolls.',
    badgeColor: 'border-stone-400 bg-stone-100 text-stone-700 shadow-stone-100',
    iconName: '🪵'
  },
  {
    level: '6',
    title: 'Forest Guardian',
    description: 'Living in total ecosystem sync. You can easily switch between deep focus and total mental relaxation.',
    requirement: 'Reach a 21-day wellness streak and unlock all sound combinations.',
    badgeColor: 'border-purple-400 bg-purple-50 text-purple-700 shadow-purple-100',
    iconName: '🧙'
  },
  {
    level: '7',
    title: 'Serenity Master',
    description: 'Complete mental sanctuary alignment. You are fully self-aware, restored, and deeply centered.',
    requirement: 'Log 30 consecutive days of mindfulness, completing 1,000 focus minutes.',
    badgeColor: 'border-yellow-400 bg-yellow-50 text-yellow-700 shadow-yellow-105',
    iconName: '👑'
  }
];

export default function AchievementJourney() {
  const [selectedIdx, setSelectedIdx] = useState(2); // Sapling default selected

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto" id="mission-section">
      <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#2d5a27] bg-[#e2f3e5] px-3.5 py-1.5 rounded-full inline-block">
          Ecosystem Progress
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
          Nature Achievement Journey
        </h2>
        <p className="text-stone-600 text-md leading-relaxed max-w-xl mx-auto">
          As you care for your mental wellness, your digital forest grows from a tiny seeds to an unshakeable deep wood sanctuary.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] border border-forest-900/5 shadow-sm p-6 sm:p-10 space-y-10 relative overflow-hidden">
        
        {/* Decorative background leaf swirls */}
        <div className="absolute top-10 left-10 w-24 h-24 text-forest-700 opacity-[0.03] select-none">
          <Leaf className="w-full h-full rotate-45" />
        </div>

        {/* Stepper Grid Slider path */}
        <div className="relative">
          {/* Horizontal connecting background stem line */}
          <div className="absolute top-1/2 left-[5%] right-[5%] h-1 bg-stone-100 -translate-y-1/2 hidden md:block" />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6 justify-between relative z-10">
            {achievementLevels.map((item, idx) => {
              const isActive = selectedIdx === idx;
              const isPast = idx < selectedIdx;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  className="flex flex-col items-center gap-3 group focus:outline-none cursor-pointer"
                >
                  {/* Circular Node representation */}
                  <div 
                    className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl transition duration-300 relative ${
                      isActive 
                        ? 'border-[#2d5a27] bg-[#2d5a27] text-white scale-110 shadow-lg' 
                        : isPast 
                        ? 'border-[#2d5a27] bg-[#e2f3e5] text-stone-800' 
                        : 'border-stone-200 bg-white text-stone-400 group-hover:border-stone-300'
                    }`}
                  >
                    <span>{item.iconName}</span>

                    {/* Small badge overlay */}
                    {isPast && (
                      <span className="absolute -bottom-1.5 -right-1.5 bg-forest-600 text-white rounded-full p-0.5 border border-white">
                        <CheckCircle className="w-3.5 h-3.5 fill-current text-white text-[#a1d494]" />
                      </span>
                    )}
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">Lv. {item.level}</span>
                    <span className={`text-xs font-bold ${isActive ? 'text-[#2d5a27] underline decoration-2 underline-offset-4' : 'text-stone-700'}`}>
                      {item.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Achievement Detailed Focus Reveal Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#EFF1EB]/80 p-6 sm:p-8 rounded-[1.5rem] border border-forest-900/5">
          
          {/* Graphic Botanical Plant progress display */}
          <div className="lg:col-span-4 flex justify-center py-4">
            <div className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center p-2 shadow-sm ${achievementLevels[selectedIdx].badgeColor}`}>
              <span className="text-6xl animate-wind mb-3 block">{achievementLevels[selectedIdx].iconName}</span>
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest">{achievementLevels[selectedIdx].title} Level</span>
            </div>
          </div>

          {/* Texts info details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#2d5a27]">
                Milestone Phase {selectedIdx + 1} of 7
              </span>
              <h4 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
                The {achievementLevels[selectedIdx].title} Phase
                <Award className="w-5.5 h-5.5 text-amber-500 fill-current" />
              </h4>
            </div>

            <p className="text-stone-700 text-sm sm:text-md leading-relaxed">
              {achievementLevels[selectedIdx].description}
            </p>

            {/* Requirement panel card */}
            <div className="p-4 rounded-xl bg-white border border-stone-200/60 shadow-xs">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-forest-600 mt-0.5 flex-none" />
                <div>
                  <h5 className="font-bold text-xs text-stone-900 uppercase tracking-wider mb-1">Ecosystem Milestone Requirement:</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {achievementLevels[selectedIdx].requirement}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 italic">
              🌳 Achieving milestones unlocks exclusive forest soundtrack combinations and upgrades your interactive background scenery dynamically!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
