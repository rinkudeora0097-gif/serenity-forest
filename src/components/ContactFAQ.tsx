import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Mail, MapPin, Phone, Send, Info, Check, 
  HelpCircle, Globe, Award, Shield, User, Heart, Sparkles 
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqsData: FaqItem[] = [
  {
    question: "What is Serenity Forest?",
    answer: "Serenity Forest is a complete wellness, focus, and mindfulness platform designed to help you reduce stress, improve mental clarity, build healthy relaxation habits, and maintain emotional balance in a hectic world. Inspired by calming forest ecosystems, the platform packages beautiful acoustic tools, sound blenders, breathing trainers, calendars, and journals in an safe offline-capable digital sanctuary."
  },
  {
    question: "Is Serenity Forest free?",
    answer: "Yes, Serenity Forest is fully proud to be a student-founded initiative that offers free core features, including basic Guided Breathing exercises, our core Nature Sounds Library, and fundamental daily mood logger checks. A premium subscription is available for users looking to unlock specialized, custom curated masterclasses and the full-scale interactive sound synthesis channels."
  },
  {
    question: "Can I use it on mobile?",
    answer: "Absolutely! Serenity Forest is built from the ground up for cross-platform ease. It is fully responsive right in your browser (as a Progressive Web App), and you can download the dedicated Android app directly for native on-the-go offline sensory relief."
  },
  {
    question: "How does Serenity Forest reduce stress?",
    answer: "We focus on somatic triggers. By combining gentle 10-second breath pacing (which lowers your heart rate and stimulates the vagus nerve) with pink-noise nature acoustics (which mask sudden city distractions), we help slow down chaotic neurotransmitters. Our Mood-Based Recommendation Engine then offers customized recovery pathways to prevent chronic fatigue."
  },
  {
    question: "What features are available?",
    answer: "We offer a deep, custom suite of 16 integrated features: professional Focus Timers with seedling animations, Guided Breathing coaches, deep Sleep Wellness guides, customizable Mood Trackers, Positive Affirmations, a highly secure Gratitude Journal, and progress tracking with our unique Botanical Nature Achievement System."
  },
  {
    question: "Is my data private?",
    answer: "Your privacy is our core policy. Unlike typical modern platforms, all diaries, gratitude lists, stress registers, and daily mood entries logged inside Serenity Forest are securely containerized on-device. We do not sell, track, or share your psychological records with external brokers."
  }
];

export default function ContactFAQ() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0); // First open by default
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mood: 'Neutral 🍃',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate planting gratitude seed logic
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', mood: 'Neutral 🍃', message: '' });
    }, 1500);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-24" id="faq-section-anchor">
      
      {/* FAQ SECTION */}
      <div id="faq-section" className="space-y-12">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-800 bg-sage-100 px-3.5 py-1.5 rounded-full inline-block font-mono">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 tracking-tight leading-tight">
            Curious About Serenity Forest?
          </h2>
          <p className="text-forest-800/70 text-sm sm:text-md leading-relaxed max-w-xl mx-auto font-sans">
            Everything you need to know about navigating your mental sanctuary and configuring sound streams.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqsData.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div 
                key={idx} 
                className={`rounded-[2rem] border transition duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-white border-forest-800/20 shadow-md' 
                    : 'bg-white/40 border-forest-800/10 hover:border-forest-800/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-serif text-md sm:text-lg font-bold text-forest-950 flex items-center gap-3">
                    <HelpCircle className={`w-5 h-5 flex-none ${isOpen ? 'text-forest-800' : 'text-forest-600/55'}`} />
                    {faq.question}
                  </span>
                  
                  <span className={`p-1.5 rounded-full bg-beige-50 text-forest-800 transition-all ${isOpen ? 'rotate-180 bg-sage-100 text-forest-900' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-forest-800/75 leading-relaxed border-t border-forest-800/5 bg-beige-50/20">
                    <p className="max-w-3xl font-sans">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>


      {/* CONTACT SECTION */}
      <div id="contact-section" className="space-y-12 pt-8">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-800 bg-sage-100 px-3.5 py-1.5 rounded-full inline-block font-mono">
            Connect With Us
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight leading-tight">
            Send a Botanical Inquiry
          </h2>
          <p className="text-forest-800/70 text-sm leading-relaxed max-w-xl mx-auto font-sans">
            Have questions, feature suggestions, or feedback? Drop our team a line and we will reply as immediately as possible.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Info Panels Column */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-forest-850 to-forest-950 text-white space-y-6 shadow-md relative overflow-hidden">
              {/* Abs leaves */}
              <div className="absolute right-0 bottom-0 pointer-events-none translate-x-6 translate-y-6 opacity-5">
                <Heart className="w-32 h-32 fill-current" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-lg font-bold">Official Headquarters</h4>
                <p className="text-xs text-sage-200 font-sans">The digital sanctuary project initiated by passionate wellness innovators.</p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex gap-3 items-center">
                  <Mail className="w-4.5 h-4.5 text-sage-300 flex-none" />
                  <span>hello.serenityforest@gmail.com</span>
                </div>
                <div className="flex gap-3 items-center">
                  <Globe className="w-4.5 h-4.5 text-sage-300 flex-none" />
                  <span>www.serenityforestapp.com</span>
                </div>
                <div className="flex gap-3 items-center">
                  <MapPin className="w-4.5 h-4.5 text-sage-300 flex-none" />
                  <span>Jodhpur, Rajasthan, India</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#9DBEBB] block font-mono">Future Integrations:</span>
                <p className="text-[10px] text-sage-200 leading-normal font-sans">
                  Our official communications branch will expand to support direct counselor routing in our Q3 update.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-[2rem] bg-white border border-forest-800/10 text-xs text-forest-800/70 space-y-3">
              <h5 className="font-bold text-forest-900 flex items-center gap-2 font-serif">
                <Shield className="w-4 h-4 text-forest-800" />
                No Ad Tracking Policy
              </h5>
              <p className="leading-relaxed font-sans">
                By sending an inquiry, your credentials will only exist for communication routing. We do not store records on third party cloud advertising pools.
              </p>
              
              <div className="flex gap-2.5 pt-1">
                <span className="px-2.5 py-1 rounded-md bg-sage-100 text-[9px] font-mono font-bold text-forest-900">Ad-Free</span>
                <span className="px-2.5 py-1 rounded-md bg-sage-100 text-[9px] font-mono font-bold text-forest-900">GDPR Compliant</span>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="lg:col-span-8 bg-white/60 backdrop-blur-sm p-6 sm:p-8 rounded-[2rem] border border-forest-800/10 shadow-sm">
            {submitSuccess ? (
              <div className="h-full flex flex-col justify-center items-center text-center space-y-4 py-12 animate-fade-in" id="contact-success-card">
                <div className="w-16 h-16 rounded-full bg-sage-100 border border-sage-300 flex items-center justify-center text-forest-800">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-forest-900 animate-pulse">Your Inquiry Seed is Planted!</h3>
                <p className="text-xs sm:text-sm text-forest-800/70 max-w-md font-sans">
                  Thank you for connecting with Serenity Forest. Founder <b>Rigvedya Singh Deora</b> and our wellness development circle will review your message and reach back to you at your leisure.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-2.5 bg-forest-800 hover:bg-[#1f3614] text-white rounded-full text-xs font-bold transition duration-200 cursor-pointer"
                >
                  Message Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-forest-805">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Rigvedya Singh"
                        className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-forest-800/10 bg-beige-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-sage-400 focus:ring-1 focus:ring-sage-400 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-forest-805">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g., name@gmail.com"
                        className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-forest-800/10 bg-beige-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-sage-400 focus:ring-1 focus:ring-sage-400 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-forest-805">Your Vital Vibe Check</label>
                    <select
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-forest-800/10 bg-beige-50/50 focus:outline-none focus:border-sage-400 focus:ring-1 focus:ring-sage-400 transition cursor-pointer"
                    >
                      <option>Neutral 🍃</option>
                      <option>Happy ☀️</option>
                      <option>Tired 💤</option>
                      <option>Stressed 🔥</option>
                      <option>Anxious 🌪️</option>
                      <option>Calm 🌿</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-forest-805">Expected Topic</label>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1.5 rounded-lg bg-beige-50 border border-forest-800/5 hover:bg-sage-100 cursor-pointer text-[10px] sm:text-xs font-medium text-forest-805 transition">Beta App Access</span>
                      <span className="px-2.5 py-1.5 rounded-lg bg-beige-50 border border-forest-800/5 hover:bg-sage-100 cursor-pointer text-[10px] sm:text-xs font-medium text-forest-805 transition">Suggestion</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-forest-805">Inquiry Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe how Serenity Forest can companion your mindfulness efforts..."
                    rows={4}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-forest-800/10 bg-beige-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-sage-400 focus:ring-1 focus:ring-sage-400 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-forest-800 hover:bg-[#1f3614] text-white font-semibold text-xs rounded-xl shadow-md transition duration-200 uppercase tracking-widest flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Planting Seeds...'
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
