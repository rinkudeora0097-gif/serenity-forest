import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Leaf, LogIn, Mail, Lock, User, Sparkles, AlertCircle, RefreshCw, X } from 'lucide-react';
import brandLogoImage from '../assets/images/serenity_forest_elegant_logo_1781092348423.png';

interface AuthGatewayProps {
  initialTab?: 'login' | 'signup' | 'forgot';
  onClose?: () => void;
}

export default function AuthGateway({ initialTab = 'login', onClose }: AuthGatewayProps) {
  const { user, signUpWithEmail, logInWithEmail, logInWithGoogle, resetPassword } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (user && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, onClose]);
  
  // Field values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // States
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cleanStatuses = () => {
    setErrorStatus(null);
    setSuccessStatus(null);
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    cleanStatuses();
    
    if (!email) {
      setErrorStatus("Please enter your email Address.");
      return;
    }
    
    setLoading(true);
    try {
      if (activeTab === 'login') {
        if (!password) {
          setErrorStatus("Please enter your password.");
          setLoading(false);
          return;
        }
        await logInWithEmail(email.trim(), password);
        setSuccessStatus("Welcome back! Rooting your session...");
      } else if (activeTab === 'signup') {
        if (!name.trim()) {
          setErrorStatus("Please enter your name to name your sanctuary.");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorStatus("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }
        await signUpWithEmail(email.trim(), password, name.trim());
        setSuccessStatus("Ecosystem established successfully! Preparing your forest...");
      } else if (activeTab === 'forgot') {
        await resetPassword(email.trim());
        setSuccessStatus("A password reset seed has been sent to your inbox. Check your email!");
      }
    } catch (err: any) {
      console.error(err);
      let friendlyMessage = "Ecosystem interaction failed. Please check your details and try again.";
      if (err.code === 'auth/user-not-found') {
        friendlyMessage = "No active forest account exists with this email.";
      } else if (err.code === 'auth/wrong-password') {
        friendlyMessage = "Incorrect password credentials. Please retry.";
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = "This email is already linked to another forest sanctuary.";
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = "Security warning: password is too weak.";
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = "Please format your email Address correctly.";
      }
      setErrorStatus(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSso = async () => {
    cleanStatuses();
    setLoading(true);
    try {
      await logInWithGoogle();
      setSuccessStatus("Authenticated via Google. Accessing your forest...");
    } catch (err: any) {
      console.error("Google authentication error:", err);
      let errMsg = "Google verification declined or interrupted.";
      if (err.code) {
        if (err.code === 'auth/unauthorized-domain') {
          errMsg = `Domain unauthorized: Please add this Vercel domain to your Firebase Console under Authentication -> Settings -> Authorized domains. (Error code: ${err.code})`;
        } else if (err.code === 'auth/operation-not-allowed') {
          errMsg = `Google Sign-In is disabled. Please enable it under Authentication -> Sign-in method in your Firebase Console. (Error code: ${err.code})`;
        } else if (err.code === 'auth/popup-closed-by-user') {
          errMsg = `The sign-in popup was closed before completing auth. Please ensure popups are allowed in your browser, complete the flow within the popup window, or try opening the app in a new tab if you are in the workspace iframe (Error code: ${err.code}).`;
        } else if (err.code === 'auth/popup-blocked') {
          errMsg = `The sign-in popup was blocked by your browser's popup blocker. Please allow popups for this site and try again (Error code: ${err.code}).`;
        } else if (err.code === 'auth/cancelled-popup-request') {
          errMsg = `The sign-in request was cancelled. This can happen if the popup is focused away, closed, or a concurrent login attempt is made (Error code: ${err.code}).`;
        } else {
          errMsg = `Authentication failed: ${err.message || err.code}`;
        }
      } else if (err.message) {
        errMsg = `Error: ${err.message}`;
      } else {
        errMsg = `Google verification declined or interrupted. Details: ${typeof err === 'object' ? JSON.stringify(err) : String(err)}`;
      }
      setErrorStatus(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-stone-950 text-forest-800 dark:text-stone-100 flex items-center justify-center p-6 relative transition-colors duration-300">
      
      {/* Dynamic Ambient Blur Background elements */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-sage-400 dark:bg-sage-200/5 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-10 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-forest-800/20 dark:bg-[#2d5a27]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 pointer-events-none" />

      <div className="w-full max-w-md bg-white/70 dark:bg-stone-900/80 backdrop-blur-md rounded-[2.5rem] border border-forest-800/10 dark:border-white/10 shadow-xl p-8 space-y-8 relative z-10 transition-all duration-300">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <img 
              src={brandLogoImage} 
              className="w-14 h-14 object-cover rounded-full border border-forest-800/20 shadow-md mx-auto hover:rotate-12 transition duration-300"
              alt="Serenity Forest Logo" 
            />
            <span className="absolute -top-1 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-forest-900 dark:text-white tracking-tight uppercase">
              Serenity Forest
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest font-mono">
              Mindfulness & Focus Sanctuary
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        {activeTab !== 'forgot' && (
          <div className="grid grid-cols-2 bg-stone-100/80 dark:bg-stone-800/50 p-1.5 rounded-2xl border border-stone-200/40 dark:border-white/5">
            <button
              onClick={() => { setActiveTab('login'); cleanStatuses(); }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-stone-800 text-forest-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); cleanStatuses(); }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white dark:bg-stone-800 text-forest-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
            >
              Sprout Profile
            </button>
          </div>
        )}

        {activeTab === 'forgot' && (
          <div className="text-center space-y-1">
            <h3 className="font-serif text-lg font-bold text-stone-950 dark:text-white">Recover Your Forest Key</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              We will send you a secure link to reset your sanctuary credentials.
            </p>
          </div>
        )}

        {/* Status Alerts */}
        {errorStatus && (
          <div className="flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 rounded-2xl border border-rose-200/40 dark:border-rose-900/20 text-xs leading-relaxed animate-fade-in animate-pulse">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorStatus}</span>
          </div>
        )}

        {successStatus && (
          <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 rounded-2xl border border-emerald-200/40 dark:border-emerald-900/20 text-xs leading-relaxed animate-fade-in">
            <Sparkles className="w-5 h-5 shrink-0 text-emerald-500 animate-bounce" />
            <span>{successStatus}</span>
          </div>
        )}

        {/* Interactive email form */}
        <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
          
          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label htmlFor="name-input" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Your Human Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center justify-center text-stone-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="name-input"
                  type="text"
                  required
                  placeholder="e.g. Rigvedya S."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-stone-50/50 dark:bg-stone-800/40 text-xs border border-stone-200 dark:border-white/10 focus:outline-none focus:border-forest-500 transition duration-150"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email-input" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center justify-center text-stone-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email-input"
                type="email"
                required
                placeholder="natural@serenityforest.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-stone-50/50 dark:bg-stone-800/40 text-xs border border-stone-200 dark:border-white/10 focus:outline-none focus:border-forest-500 transition duration-150"
              />
            </div>
          </div>

          {activeTab !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password-input" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Password
                </label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setActiveTab('forgot'); cleanStatuses(); }}
                    className="text-[10px] uppercase font-bold text-forest-600 dark:text-forest-400 hover:underline cursor-pointer"
                  >
                    Forgot Key?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center justify-center text-stone-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password-input"
                  type="password"
                  required
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-stone-50/50 dark:bg-stone-800/40 text-xs border border-stone-200 dark:border-white/10 focus:outline-none focus:border-forest-500 transition duration-150"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#2D4F1E] dark:bg-[#3b6934] hover:bg-[#1D3512] dark:hover:bg-[#2c5326] text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-md transition duration-200 scale-100 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : activeTab === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Enter Sanctuary</span>
              </>
            ) : activeTab === 'signup' ? (
              <>
                <Leaf className="w-4 h-4" />
                <span>Sprout Account</span>
              </>
            ) : (
              <span>Reset Sanctuary Key</span>
            )}
          </button>
        </form>

        {activeTab === 'forgot' && (
          <button
            type="button"
            onClick={() => { setActiveTab('login'); cleanStatuses(); }}
            className="w-full text-center text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 underline cursor-pointer"
          >
            Back to Sign In
          </button>
        )}

        {/* SSO Separator and Button */}
        {activeTab !== 'forgot' && (
          <div className="space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-stone-200 dark:bg-stone-800" />
              <span className="relative z-10 bg-white dark:bg-stone-900 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Or Sync With
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSso}
              disabled={loading}
              className="w-full py-3.5 border border-stone-200 dark:border-white/10 bg-white/50 dark:bg-stone-800/20 hover:bg-white dark:hover:bg-stone-800 text-[#2D4F1E] dark:text-stone-100 font-bold text-[11px] uppercase tracking-wider rounded-2xl transition duration-150 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sync with Google Workspace</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
