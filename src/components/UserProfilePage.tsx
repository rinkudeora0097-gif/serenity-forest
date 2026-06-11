import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, Mail, Calendar, Shield, Award, Play, LogOut, Check, Edit, Save, 
  Trash2, RefreshCw, Flame, BarChart4, Heart, Compass, X
} from 'lucide-react';

const achievementBadges = [
  { name: 'Seed 🌱', desc: 'Log your first check-in.' },
  { name: 'Sprout 🌿', desc: 'Maintain a 3-day active streak.' },
  { name: 'Sapling 🌲', desc: 'Log 5 gratitude journals.' },
  { name: 'Young Tree 🌳', desc: 'Complete 3 stress relief programs.' },
  { name: 'Strong Oak 🪵', desc: 'Log 500 focus minutes.' },
  { name: 'Forest Guardian 🧙', desc: 'Reach a 21-day streak.' },
  { name: 'Serenity Master 👑', desc: 'Reach 1,000 focus minutes.' }
];

interface UserProfilePageProps {
  onClose?: () => void;
}

export default function UserProfilePage({ onClose }: UserProfilePageProps) {
  const { user, profile, logOut, updateUserProfile, resetAllUserData } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!user || !profile) return null;

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await updateUserProfile({ displayName: editName.trim() });
      setEditing(false);
      setSuccessMsg("Ecosystem nickname updated!");
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAchievement = async (idx: number) => {
    try {
      await updateUserProfile({ selectedAchievementIdx: idx });
      setSuccessMsg(`Active title set to: ${achievementBadges[idx].name}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetData = async () => {
    setResetting(true);
    try {
      await resetAllUserData();
      setResetConfirm(false);
      setSuccessMsg("All wellness records have been cleared.");
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'June 11, 2026';
    try {
      const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return 'June 11, 2026';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-stone-900 rounded-[2rem] border border-forest-800/10 dark:border-white/10 shadow-lg space-y-8 my-10 animate-fade-in relative overflow-hidden transition-colors duration-300">
      
      {/* Upper Color Wave */}
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-600 to-indigo-500" />
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-stone-100 dark:border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#e2f3e5] dark:bg-emerald-950/40 border border-[#a1d494]/30 flex items-center justify-center text-3xl shadow-sm text-forest-800">
            {achievementBadges[profile.selectedAchievementIdx]?.name.split(' ')[1] || '🌱'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              {editing ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-2.5 py-1 text-sm font-serif font-bold text-stone-900 dark:text-white bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-white/5 rounded-md focus:outline-none focus:border-forest-500"
                    placeholder="Enter nickname"
                  />
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="p-1 px-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  {profile.displayName}
                  <button
                    onClick={() => { setEditName(profile.displayName); setEditing(true); }}
                    className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition cursor-pointer"
                    title="Change nickname"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </h2>
              )}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2d5a27] bg-[#e2f3e5] dark:bg-[#123110] dark:text-[#b4deb1] px-2.5 py-0.5 rounded-full inline-block mt-1 font-mono">
              Title: {achievementBadges[profile.selectedAchievementIdx]?.name || 'Seed 🌱'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close Cabinet</span>
            </button>
          )}

          <button
            onClick={() => logOut()}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Forest</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 rounded-2xl border border-emerald-200/40 dark:border-emerald-900/10 text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-stone-50/50 dark:bg-stone-850/40 rounded-2xl border border-stone-200/40 dark:border-white/5 space-y-2">
          <div className="flex justify-between items-center text-amber-500">
            <Flame className="w-5 h-5 fill-amber-500 text-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Current Streak</span>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
            {profile.streak} <span className="text-xs font-sans text-stone-400 font-normal">days</span>
          </div>
        </div>

        <div className="p-5 bg-stone-50/50 dark:bg-stone-850/40 rounded-2xl border border-stone-200/40 dark:border-white/5 space-y-2">
          <div className="flex justify-between items-center text-emerald-500">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">Focus Timber</span>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
            {profile.totalFocusMinutes} <span className="text-xs font-sans text-stone-400 font-normal">minutes</span>
          </div>
        </div>

        <div className="p-5 bg-stone-50/50 dark:bg-stone-850/40 rounded-2xl border border-stone-200/40 dark:border-white/5 space-y-2">
          <div className="flex justify-between items-center text-sky-500">
            <Heart className="w-5 h-5 fill-sky-200 text-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Meditations</span>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
            {profile.completedMeditations} <span className="text-xs font-sans text-stone-400 font-normal">sessions</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left section: Select Display Title Badge */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-serif text-md font-bold text-stone-950 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-[#2d5a27]" />
            <span>Unlockable Forest Identity Badge</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Select which active title badge you wish to show at the top of your interface. You develop more titles as you log Focus and Meditators:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {achievementBadges.map((badge, idx) => {
              const isActive = profile.selectedAchievementIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAchievement(idx)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs'
                      : 'bg-stone-50/50 hover:bg-stone-100/50 border-stone-200/50 dark:border-white/5 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-xs">{badge.name}</h5>
                    <p className="text-[9px] text-stone-400 leading-none">{badge.desc}</p>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: Core Account Credentials info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 bg-stone-50/20 dark:bg-stone-850/10 rounded-2xl border border-stone-250/20 dark:border-white/5 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#2d5a27] font-mono">Sanctuary Credentials</h4>
            
            <div className="space-y-3.5 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Ecosystem Planted: {formatDate(profile.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-500 px-2 py-0.5 rounded-full font-mono">
                  Encryption Key: Active
                </span>
              </div>
            </div>
          </div>

          {/* Purge System button */}
          <div className="border border-rose-500/10 dark:border-rose-900/10 rounded-2xl p-4 bg-rose-50/30 dark:bg-rose-950/5 space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-rose-700 font-mono">Emergency Purge</h5>
            <p className="text-[11px] text-stone-400 leading-normal">
              Want to restart your journey? Resetting clears your streak, focus histories, journal scrolls, and logs entirely.
            </p>
            
            {!resetConfirm ? (
              <button
                type="button"
                onClick={() => setResetConfirm(true)}
                className="px-3.5 py-1.5 bg-rose-100/30 hover:bg-rose-100/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-[10px] font-bold uppercase rounded-md tracking-wider transition cursor-pointer flex items-center gap-1.5 border border-rose-300/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Database</span>
              </button>
            ) : (
              <div className="space-y-2 animate-pulse">
                <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">⚠️ Are you absolutely sure?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleResetData}
                    disabled={resetting}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1"
                  >
                    {resetting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Yes, Purge'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetConfirm(false)}
                    className="px-3 py-1 bg-stone-250 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-md text-[10px] font-bold uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
