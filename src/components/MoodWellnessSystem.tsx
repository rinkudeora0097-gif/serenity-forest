import React, { useState } from 'react';
import { Sparkles, Calendar, Wind, Play, Compass, Flame, Smile, Anchor, Leaf } from 'lucide-react';
import { MoodItem } from '../types';

const moodsData: MoodItem[] = [
  {
    id: 'happy',
    name: 'Happy',
    emoji: '☀️',
    color: '#fabf24',
    bgClass: 'from-amber-50 to-amber-100/40 border-amber-200 text-amber-900',
    textClass: 'text-amber-800',
    recommendations: [
      {
        activity: 'Gratitude Reflection Walk',
        duration: '15 mins',
        description: 'Amplify your joy. Walk outside, listing 5 organic elements you see that bring positive feelings.',
        soundSuggested: 'Sunny Forest Canopy'
      },
      {
        activity: 'Mindfulness Journaling',
        duration: '10 mins',
        description: 'Lock in this beautiful state. Describe your current energy source and what you want to nurture next.',
        soundSuggested: 'Meadow Birdsong Chorus'
      }
    ]
  },
  {
    id: 'calm',
    name: 'Calm',
    emoji: '🌿',
    color: '#2d5a27',
    bgClass: 'from-emerald-50 to-emerald-100/30 border-emerald-200 text-emerald-900',
    textClass: 'text-emerald-800',
    recommendations: [
      {
        activity: 'Deep Forest Meditation',
        duration: '20 mins',
        description: 'Immerse fully in your tranquility. Practice unattached floating thoughts beneath simulated ancient oaks.',
        soundSuggested: 'Ancient Cedar Whispers'
      },
      {
        activity: 'Nature Focus Alignment',
        duration: '25 mins',
        description: 'Ideal state for creative work. Lock onto your high-focus task with ambient river sounds.',
        soundSuggested: 'Stream in the Valley'
      }
    ]
  },
  {
    id: 'relaxed',
    name: 'Relaxed',
    emoji: '🌊',
    color: '#42a5f5',
    bgClass: 'from-sky-50 to-blue-100/30 border-blue-200 text-blue-900',
    textClass: 'text-blue-800',
    recommendations: [
      {
        activity: 'Restorative Breathing',
        duration: '8 mins',
        description: 'Sustain your ease. Gently matching slow visual waves of 4 seconds breathing inhale and 4 seconds exhale.',
        soundSuggested: 'Gentle Shoreline Waves'
      },
      {
        activity: 'Sunset Floating Visualization',
        duration: '12 mins',
        description: 'Close your eyes. Visualize your body floating gently down an alpine stream as the sun sinks below the cliffs.',
        soundSuggested: 'Warm Twilight Sunset'
      }
    ]
  },
  {
    id: 'neutral',
    name: 'Neutral',
    emoji: '🍃',
    color: '#72796e',
    bgClass: 'from-[#f3f4ed] to-stone-200/30 border-stone-300 text-stone-900',
    textClass: 'text-stone-800',
    recommendations: [
      {
        activity: 'Vibe Reset Check-in',
        duration: '5 mins',
        description: 'A quick baseline reset. Scan your spine alignment and stretch gently to promote fluid physical release.',
        soundSuggested: 'Soft Rainfall on Leaves'
      },
      {
        activity: 'Mind Detox Scanning',
        duration: '10 mins',
        description: 'Clear away any background mental latency. Standard mindfulness scanning of the 5 key physical senses.',
        soundSuggested: 'Gentle Warm Wind'
      }
    ]
  },
  {
    id: 'tired',
    name: 'Tired',
    emoji: '💤',
    color: '#5c6bc0',
    bgClass: 'from-indigo-50 to-indigo-100/30 border-indigo-200 text-indigo-900',
    textClass: 'text-indigo-800',
    recommendations: [
      {
        activity: 'Forest Canopy Sleep Settle',
        duration: '30 mins',
        description: 'Let your body enter deep repair. A structured slow-wave audio journey that guides your pulse downwards.',
        soundSuggested: 'Distant Midnight Rainstorm'
      },
      {
        activity: 'Sliver Focus Restorative',
        duration: '10 mins',
        description: 'Take a restorative lay-down. No expectations, simply focus on the sound of crackling logs.',
        soundSuggested: 'Alpine Cabin Fireplace'
      }
    ]
  },
  {
    id: 'stressed',
    name: 'Stressed',
    emoji: '🔥',
    color: '#d32f2f',
    bgClass: 'from-red-50 to-red-100/20 border-red-200 text-red-900',
    textClass: 'text-red-800',
    recommendations: [
      {
        activity: 'Anxiety Release Valve',
        duration: '7 mins',
        description: 'High-speed emotional recovery. Focus strictly on rapid double inhaled chest expansions, then slow release.',
        soundSuggested: 'Rapid Waterfalls Stream'
      },
      {
        activity: 'Oak Tree Grounding',
        duration: '10 mins',
        description: 'Mentally cast strong massive roots deep into the earth. Visualize external pressures sliding off like spring rain.',
        soundSuggested: 'Rumble of Distant Thunder'
      }
    ]
  },
  {
    id: 'anxious',
    name: 'Anxious',
    emoji: '🌪️',
    color: '#9c27b0',
    bgClass: 'from-purple-50 to-purple-100/20 border-purple-200 text-purple-900',
    textClass: 'text-purple-800',
    recommendations: [
      {
        activity: 'Box Breathing Anchor',
        duration: '8 mins',
        description: 'Regain precise regulatory balance. 4-4-4-4 rhythm to slow down racing panic states and reassure your system.',
        soundSuggested: 'Rhythmic Ocean Tides'
      },
      {
        activity: 'Sensory Rooting Trail',
        duration: '12 mins',
        description: 'A physical mindfulness navigation: identify 5 things you can see, 4 you can touch, 3 hear, 2 smell, 1 taste.',
        soundSuggested: 'Warm Summer Cicadas'
      }
    ]
  },
  {
    id: 'overwhelmed',
    name: 'Overwhelmed',
    emoji: '⛰️',
    color: '#00695c',
    bgClass: 'from-teal-50 to-teal-100/30 border-teal-200 text-teal-900',
    textClass: 'text-teal-800',
    recommendations: [
      {
        activity: 'Full Mind Detox Zone',
        duration: '15 mins',
        description: 'Block out all secondary priorities. Focus on a single sound and a single point of light to re-establish spatial ease.',
        soundSuggested: 'Deep Cave Echo Droplets'
      },
      {
        activity: 'Quick Recovery Sanctuary',
        duration: '10 mins',
        description: 'Enter our virtual emergency relief. Let us take care of everything else while you just listen.',
        soundSuggested: 'Gentle Creek Whispers'
      }
    ]
  }
];

export default function MoodWellnessSystem() {
  const [selectedMood, setSelectedMood] = useState<MoodItem>(moodsData[1]); // Default Calm

  return (
    <div className="py-16 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-forest-800/10 px-6 sm:px-10 max-w-7xl mx-auto my-12" id="mood-section">
      <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-forest-600 bg-forest-600/10 px-3.5 py-1.5 rounded-full inline-block">
          Personalized Well-Being
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 tracking-tight leading-tight">
          Mood-Based Recommendation System
        </h2>
        <p className="text-stone-600 text-md sm:text-lg leading-relaxed max-w-xl mx-auto">
          We understand that mental wellness is never static. Serenity Forest dynamically analyzes your current emotional state to build your perfect wellness journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Mood Selector Grid */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-forest-800">
              How are you feeling right now?
            </h3>
            <p className="text-xs text-stone-500">
              Select an emotional layer below to preview recommended nature actions instantly:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
            {moodsData.map((mood) => {
              const represents = selectedMood.id === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood)}
                  className={`group relative p-4 rounded-2xl border text-left transition duration-300 flex items-center gap-3.5 cursor-pointer overflow-hidden ${
                    represents
                      ? `bg-white shadow-md border-forest-500 scale-102`
                      : 'bg-white/40 hover:bg-white border-stone-200/80 hover:border-stone-300'
                  }`}
                  style={{
                    boxShadow: represents ? `0 10px 20px -5px rgba(45, 90, 39, 0.12)` : ''
                  }}
                >
                  {/* Small highlight background strip */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 w-1.5 transition-all"
                    style={{ backgroundColor: represents ? mood.color : 'transparent' }}
                  />

                  <span className="text-2xl transition group-hover:scale-115">{mood.emoji}</span>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">{mood.name}</h4>
                    <span className="text-[10px] text-stone-400 capitalize">
                      {represents ? 'Active Plan' : 'Explore remedies'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-white/70 rounded-2xl border border-stone-200 text-[11px] text-stone-500 italic leading-relaxed">
            🌿 <b>Tip:</b> Keeping tabs on seasonal fluctuations? Serenity Forest records these daily entries in your persistent, secure <b>Wellness Dashboard</b> to map your biological cycles.
          </div>
        </div>

        {/* Dynamic Recommendation Panel */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-gradient-to-br p-6 sm:p-8 border shadow-sm transition-all duration-500 relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(135deg, ${selectedMood.bgClass.split(' ')[1]}, #ffffff)`
          }}
        >
          {/* Background Watermark Leaf */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none text-forest-900">
            <Leaf className="w-64 h-64" />
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between border-b pb-4 border-stone-200/60">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedMood.emoji}</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700">Recommended for</span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">{selectedMood.name} State</h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-stone-200 shadow-xs">
                2 Curated Pathways
              </span>
            </div>

            <div className="space-y-4">
              {selectedMood.recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="p-5 rounded-xl bg-white/80 border border-stone-200/60 shadow-xs space-y-3 hover:translate-x-1 transition duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#2d5a27] bg-[#e2f3e5] px-2 py-0.5 rounded-md">
                        Step {index + 1}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-stone-900">{rec.activity}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#2d5a27] bg-[#e2f3e5] px-2.5 py-1 rounded-full">
                      {rec.duration}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {rec.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1 border-t border-stone-100 mt-2 text-[11px] text-stone-500">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#42a5f5] animate-pulse" />
                    <span>Focus Sound Profile: <b>{rec.soundSuggested}</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-200/50 pt-5 relative z-10">
            <p className="text-[11px] text-stone-500 max-w-sm">
              These exercises are designed by wellness researchers and integrated with real responsive haptics on our physical forest app.
            </p>
            <a
              href="#download-section"
              className="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-full text-xs font-bold text-center shadow-xs transition duration-200 self-start sm:self-center"
            >
              Begin This Session
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
