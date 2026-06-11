import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X, CheckCircle, Mail, Trash2, Heart, Lock, BookOpen } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        id="privacy-policy-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-3xl bg-amber-50/95 dark:bg-stone-900/95 text-stone-800 dark:text-stone-100 border border-stone-200/50 dark:border-white/10 rounded-[2.5rem] shadow-2xl max-h-[85vh] flex flex-col overflow-hidden relative backdrop-blur-md"
        >
          {/******************* HEADER *******************/}
          <div className="p-6 sm:p-8 border-b border-forest-800/10 dark:border-white/10 flex items-center justify-between bg-white/40 dark:bg-stone-950/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-800/10 dark:bg-[#2d5a27]/20 flex items-center justify-center text-forest-800 dark:text-emerald-400">
                <Shield className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-2xl font-extrabold text-stone-900 dark:text-white leading-snug">
                  Privacy Policy
                </h3>
                <p className="text-[10px] sm:text-xs text-stone-500 font-mono tracking-wide uppercase">
                  Last Updated: June 11, 2026 • Serenity Forest
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-white rounded-full transition cursor-pointer"
              title="Close Privacy Policy"
            >
              <X className="w-4 h-4 sm:w-5 h-5" />
            </button>
          </div>

          {/******************* BODY CONTENT (SCROLLABLE) *******************/}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 leading-relaxed text-sm max-w-full">
            
            {/* Opening Intro */}
            <div className="p-5 rounded-2xl bg-forest-600/5 border border-forest-500/10 dark:border-white/5 space-y-2">
              <p className="font-serif italic text-stone-700 dark:text-stone-300">
                "Your mind is your private sanctuary. We believe your emotional, focus, and wellness logs should remain equally secure and private."
              </p>
              <p className="text-xs text-stone-500">
                At Serenity Forest, we respect your confidentiality. This Privacy Policy details the exact types of informational data we capture, where it is stored, how your legal rights are guarded, and our promise to never commercialize your emotional reflection registers.
              </p>
            </div>

            {/* 1. DATA WE COLLECT */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-forest-800 dark:text-emerald-400">
                <BookOpen className="w-5 h-5" />
                <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white">
                  1. Information We Collect
                </h4>
              </div>
              <p className="text-stone-600 dark:text-stone-400">
                To power key interactive utilities and sync progression parameters across devices securely, Serenity Forest captures the following data categories:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {[
                  {
                    title: "Identify & Security",
                    desc: "Your chosen nickname string and secure email address to personalize experience and verify account registration ownership.",
                    items: ["Alternative Nickname", "Verified Email Address"]
                  },
                  {
                    title: "Emotional Baseline Trackers",
                    desc: "Daily logged mood statuses to construct your emotional baseline charts over standard weekly trends.",
                    items: ["Mood Log Inputs", "Timestamp Signatures"]
                  },
                  {
                    title: "Gratitude Scrolls",
                    desc: "Textual drafts saved in your gratitude scroll journaling diary designed exclusively for self-reflection.",
                    items: ["Diary Free-text Logs", "Scroll Entry Counts"]
                  },
                  {
                    title: "Botanical Achievements",
                    desc: "Your current streak tracking counts, botanical growth levels, and selected achievement indices.",
                    items: ["Day-count Streaks", "Seed-to-Oak Level Index"]
                  },
                  {
                    title: "Focus Metrics",
                    desc: "Accumulated pomodoro timer minutes, completion rate arrays, and productivity tags.",
                    items: ["Total Focus Minutes", "Pomodoro Session Tags"]
                  },
                  {
                    title: "Breathing & Meditation Log",
                    desc: "Respiratory exercises completed, guided audio play sessions, and active session counts.",
                    items: ["Breath Coach Sessions", "Soundscape Preferences"]
                  }
                ].map((category, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/50 dark:border-white/5 shadow-xs space-y-2"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-emerald-400">
                      {category.title}
                    </span>
                    <p className="text-xs text-stone-500 leading-normal">
                      {category.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {category.items.map((it, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-stone-150 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-[10px] font-mono">
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. HOW WE STORE DATA */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-forest-800 dark:text-emerald-400">
                <Lock className="w-5 h-5" />
                <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white">
                  2. Architectural Data Isolation & Storage
                </h4>
              </div>
              <p className="text-stone-600 dark:text-stone-400">
                We handle data storage depending on your usage status to guarantee seamless accessibility alongside absolute ownership:
              </p>
              <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-400 pl-4 list-disc">
                <li>
                  <strong className="text-stone-800 dark:text-stone-200">Guest Sandbox Mode:</strong> If you use the application as a visitor without signing up, all mood logs, gratitude scrolls, and metrics are written purely inside your device's browser <code className="bg-stone-200/60 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-[10px]">localStorage</code>. No files or private indices are sent to server networks.
                </li>
                <li>
                  <strong className="text-stone-800 dark:text-stone-200">Authenticated Cloud Synchronization:</strong> When registering an account, your data is isolated on our cloud database (Firebase Firestore) under deep, authenticated tenant constraints. Only you contain access permission queries to read or modify your files.
                </li>
              </ul>
            </div>

            {/* 3. ZERO COMMERICAL ADVERTISING */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-forest-800 dark:text-emerald-400">
                <Heart className="w-5 h-5" />
                <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white">
                  3. Our Absolute Anti-Ad Promise
                </h4>
              </div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 rounded-xl space-y-1">
                <p className="font-bold text-xs sm:text-sm">We strictly forbid any sale or distribution of your psychological logs.</p>
                <p className="text-xs leading-normal opacity-90">
                  Mindfulness tracks, emotional charts, fatigue ratings, and mental journal scrolls are deeply private assets. We do not sell, license, rent, trade, or distribute your database charts or profile statistics to ad brokers, search tracking services, or external commercial networks.
                </p>
              </div>
            </div>

            {/* 4. SECURITY CONTROLS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-forest-800 dark:text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white">
                  4. Security Measures & Protections
                </h4>
              </div>
              <p className="text-stone-600 dark:text-stone-400">
                We maintain state-of-the-art security checks specifically engineered for mental health applications:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    title: "TLS Encryption",
                    desc: "All network query channels are filtered using robust Transport Layer Security (HTTPS) to block intercept attempts."
                  },
                  {
                    title: "Firestore Rules",
                    desc: "Our cloud storage maintains rigorous tenant security rules ensuring session-isolated data pipelines."
                  },
                  {
                    title: "Privacy Controls",
                    desc: "Granular access blocks and local sandbox fallbacks allowing you complete offline tracking."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-stone-100/50 dark:bg-stone-850 border border-stone-200/50 dark:border-white/5 text-xs space-y-1">
                    <span className="font-bold text-stone-800 dark:text-stone-200 block">{item.title}</span>
                    <p className="text-stone-500 text-[11px] leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. DELETION RIGHTS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-forest-800 dark:text-emerald-400">
                <Trash2 className="w-5 h-5" />
                <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white">
                  5. Account Deletion & Data Purge Rights
                </h4>
              </div>
              <p className="text-stone-600 dark:text-stone-400">
                Under global data compliance standard procedures (including CCPA under California guidelines, and GDPR within the European scope), you retain complete sovereignty over your profile files. 
              </p>
              <p className="text-xs text-stone-500 bg-stone-100 dark:bg-stone-850 p-3 rounded-lg border border-stone-200/50 dark:border-white/5">
                💡 <strong className="text-stone-700 dark:text-stone-300">Self-Purge:</strong> You may instantly trigger a profile delete request to permanently clean all records, custom sound mixtures, gratitude entries, and streaks from the Firebase production clusters. We retain zero legacy trace logs of deleted documents.
              </p>
            </div>

            {/* 6. CONTACT SECTION */}
            <div className="space-y-4 border-t border-forest-800/10 dark:border-white/10 pt-6">
              <div className="flex items-center gap-2 text-forest-800 dark:text-emerald-400">
                <Mail className="w-5 h-5" />
                <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white">
                  6. Contact Sanctuary Custodians
                </h4>
              </div>
              <p className="text-stone-600 dark:text-stone-400">
                For regulatory inquiries, secure physical data exports, compliance notifications, or custom legal compliance support regarding your Serenity Forest profile files, connect with our principal developer:
              </p>
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/50 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs text-stone-500 font-mono">Lead Custodian Developer</p>
                  <p className="font-bold text-sm text-stone-900 dark:text-white">Rigvedya Singh Deora</p>
                </div>
                <a 
                  href="mailto:rinkudeora0097@gmail.com"
                  className="px-4 py-2 bg-forest-800 hover:bg-[#1f3614] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>rinkudeora0097@gmail.com</span>
                </a>
              </div>
            </div>

          </div>

          {/******************* FOOTER NAVIGATION BUTTONS *******************/}
          <div className="p-6 border-t border-forest-800/10 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center bg-white/40 dark:bg-stone-950/20 gap-3">
            <span className="text-[10px] text-stone-550 font-mono">
              Designed with full CCPA / GDPR design alignment guidelines.
            </span>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-forest-800 hover:bg-[#1f3614] dark:bg-stone-800 dark:hover:bg-stone-700 text-white rounded-full text-xs font-bold transition shadow-md cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
