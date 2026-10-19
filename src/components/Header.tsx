import React from 'react';
import { LearnerLevel, UserLanguage } from '../types/index.ts';
import { BookOpen, Sparkles, Volume2, Globe, GraduationCap } from 'lucide-react';
import { soundPlayer } from '../services/audio.ts';

interface HeaderProps {
  userLanguage: UserLanguage;
  setUserLanguage: (lang: UserLanguage) => void;
  level: LearnerLevel;
  setLevel: (level: LearnerLevel) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const LANGUAGES: UserLanguage[] = [
  'auto',
  'English',
  'Tamil (தமிழ்)',
  'Hindi (हिन्दी)',
  'Telugu (తెలుగు)',
  'Kannada (ಕನ್ನಡ)',
  'Malayalam (മലയാളം)',
  'Marathi (मराठी)',
  'Bengali (বাংলা)',
  'Gujarati (ગુજરાતી)',
];

export const Header: React.FC<HeaderProps> = ({
  userLanguage,
  setUserLanguage,
  level,
  setLevel,
  activeTab,
  setActiveTab,
}) => {
  const [isPlayingOm, setIsPlayingOm] = React.useState(false);

  const handlePlayOm = async () => {
    setIsPlayingOm(true);
    await soundPlayer.playSanskrit('ॐ नमः शिवाय। विद्या ददाति विनयम्।');
    setTimeout(() => setIsPlayingOm(false), 2000);
  };

  return (
    <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-amber-50 shadow-lg border-b border-amber-700/40 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-md flex items-center justify-center text-stone-950 font-bold font-sanskrit text-2xl cursor-pointer hover:scale-105 transition-transform"
                 title="वाक् (Vāc) – The sacred power of speech and language">
              वाक्
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display tracking-wide text-amber-100 flex items-center gap-1.5">
                  Vāc <span className="text-amber-400 font-sanskrit text-lg font-normal">वाग् गुरुः</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  AI Sanskrit Tutor
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                Multilingual Guru • Grammar Doctor • Pronunciation Coach • Translator
              </p>
            </div>
          </div>

          {/* Controls: Language & Learner Level */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            {/* Audio sample button */}
            <button
              onClick={handlePlayOm}
              disabled={isPlayingOm}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-600/40 text-amber-200 hover:text-amber-100 transition-colors shadow-sm"
              title="Hear sample Sanskrit recitation with audio coach"
            >
              <Volume2 className={`w-3.5 h-3.5 text-amber-400 ${isPlayingOm ? 'animate-pulse text-amber-300' : ''}`} />
              <span className="hidden sm:inline font-sanskrit text-sm">ॐ ध्वनिः</span>
              <span className="text-[11px]">Audio</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-stone-950/50 px-2.5 py-1 rounded-lg border border-amber-700/30">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300/80 hidden sm:inline">Explain in:</span>
              <select
                value={userLanguage}
                onChange={(e) => setUserLanguage(e.target.value as UserLanguage)}
                className="bg-transparent text-amber-100 font-medium focus:outline-none cursor-pointer pr-1 text-xs"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-stone-900 text-stone-100">
                    {lang === 'auto' ? 'Auto-Detect Input' : lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Learner Level Selector */}
            <div className="flex items-center gap-1.5 bg-stone-950/50 px-2 py-1 rounded-lg border border-amber-700/30">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex rounded overflow-hidden p-0.5 bg-stone-900/60">
                <button
                  type="button"
                  onClick={() => setLevel('beginner')}
                  className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                    level === 'beginner'
                      ? 'bg-amber-600 text-white font-medium shadow-sm'
                      : 'text-amber-200/70 hover:text-amber-100'
                  }`}
                  title="Beginner: Simple transliteration, clear syllables, friendly pacing"
                >
                  🌱 Beginner
                </button>
                <button
                  type="button"
                  onClick={() => setLevel('intermediate')}
                  className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                    level === 'intermediate'
                      ? 'bg-amber-600 text-white font-medium shadow-sm'
                      : 'text-amber-200/70 hover:text-amber-100'
                  }`}
                  title="Intermediate: Vibhakti breakdown, lakāras, sandhi & agreement"
                >
                  🌿 Intermediate
                </button>
                <button
                  type="button"
                  onClick={() => setLevel('advanced')}
                  className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                    level === 'advanced'
                      ? 'bg-amber-600 text-white font-medium shadow-sm'
                      : 'text-amber-200/70 hover:text-amber-100'
                  }`}
                  title="Advanced: Paninian roots, samāsa, classical derivations"
                >
                  🌳 Advanced
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-medium border-t border-amber-800/40 pt-2">
          {[
            { id: 'chat', label: 'Tutor Chat', icon: '💬', badge: 'Guru' },
            { id: 'translator', label: 'Translator & Analyzer', icon: '🔄', badge: 'Detailed' },
            { id: 'grammar', label: 'Grammar & Gender Clinic', icon: '🩺', badge: 'Doctor' },
            { id: 'pronunciation', label: 'Pronunciation Lab', icon: '🎙️', badge: 'Phonetics' },
            { id: 'gender', label: 'Gender & Vibhakti Lab', icon: '🎯', badge: 'Drills' },
            { id: 'phrasebook', label: 'Conversational Phrasebook', icon: '📖', badge: 'Audio' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-md'
                    : 'text-amber-200/80 hover:text-white hover:bg-amber-900/40'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-ping"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
