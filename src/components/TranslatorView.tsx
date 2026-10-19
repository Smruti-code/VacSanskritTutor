import React, { useState } from 'react';
import { LearnerLevel, UserLanguage, TranslationResult } from '../types/index.ts';
import { translateAndTeach } from '../services/api.ts';
import { soundPlayer } from '../services/audio.ts';
import {
  Volume2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Send,
  Loader2,
  Lightbulb,
} from 'lucide-react';

interface TranslatorViewProps {
  userLanguage: UserLanguage;
  level: LearnerLevel;
}

const SAMPLE_SENTENCES = [
  { text: "I am going to school.", lang: "English" },
  { text: "நான் தினசரி புத்தகங்களைப் படிக்கிறேன்.", lang: "Tamil" },
  { text: "सूर्य पूर्व दिशा में उगता है।", lang: "Hindi" },
  { text: "నేను ప్రతిరోజూ వ్యాయామం చేస్తాను.", lang: "Telugu" },
  { text: "Knowledge gives humility.", lang: "English" },
  { text: "The river flows through the quiet forest.", lang: "English" },
  { text: "தாய் குழந்தையை அன்புடன் பார்க்கிறாள்.", lang: "Tamil" },
];

export const TranslatorView: React.FC<TranslatorViewProps> = ({ userLanguage, level }) => {
  const [inputText, setInputText] = useState('I am going to school');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPracticeAnswer, setUserPracticeAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);

  const handleTranslate = async (textToUse?: string) => {
    const text = (textToUse || inputText).trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setPracticeFeedback(null);
    setUserPracticeAnswer('');

    try {
      const data = await translateAndTeach(text, userLanguage, level);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      alert(`Translation failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = async (text: string) => {
    setIsPlaying(true);
    try {
      await soundPlayer.playSanskrit(text);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleCheckPractice = () => {
    if (!userPracticeAnswer.trim()) return;
    const clean = userPracticeAnswer.trim();
    setPracticeFeedback(
      `उत्तमः प्रयासः! (Great attempt!) You wrote: "${clean}". Look at the word endings and vibhakti to see how it compares to our rules above.`
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50 p-4 sm:p-5 rounded-2xl border border-amber-300/60 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-amber-950 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Sanskrit Translator & Sentence Anatomizer
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Translate any sentence from English, Tamil, Hindi, Telugu, etc. into classical Sanskrit, with deep grammatical, gender, and pronunciation breakdowns.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-amber-200/60 px-3 py-1.5 rounded-xl border border-amber-300 text-amber-900 font-medium">
            <span>Explanation Language:</span>
            <span className="font-bold underline">{userLanguage === 'auto' ? 'Auto-Detect' : userLanguage}</span>
          </div>
        </div>

        {/* Quick Samples */}
        <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-amber-800 font-semibold whitespace-nowrap">Try Sample:</span>
          {SAMPLE_SENTENCES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sample.text);
                handleTranslate(sample.text);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-stone-700 hover:text-amber-900 border border-amber-200 text-xs whitespace-nowrap transition-all shadow-2xs"
            >
              <span className="text-[10px] uppercase font-bold text-amber-600 mr-1">[{sample.lang}]</span>
              {sample.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm space-y-3">
        <label className="block text-xs font-semibold text-amber-950 uppercase tracking-wider">
          Sentence to Translate & Teach (Any language)
        </label>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder="Enter a sentence in English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), etc..."
            className="w-full p-3.5 rounded-xl border-2 border-amber-200 focus:border-amber-600 focus:outline-none text-stone-900 text-base font-medium placeholder:text-stone-400 bg-amber-50/20"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => handleTranslate()}
            disabled={isLoading || !inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white font-semibold text-sm hover:from-amber-800 hover:to-amber-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Anatomizing Sanskrit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Translate & Teach Me</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Sanskrit Hero Card */}
          <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900 rounded-3xl p-6 text-amber-50 shadow-xl border border-amber-700/50 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-700/60 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                  संस्कृत-अनुवादः (Sanskrit Translation)
                </span>
                <div className="text-3xl sm:text-4xl font-sanskrit text-amber-100 mt-1 tracking-wide">
                  {result.sanskrit}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handlePlayAudio(result.sanskrit)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                    isPlaying
                      ? 'bg-amber-400 text-stone-950 animate-pulse'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                  title="Hear authentic classical Sanskrit pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlaying ? 'Speaking...' : 'Listen Audio'}</span>
                </button>

                <button
                  onClick={() => handleCopy(result.sanskrit)}
                  className="p-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-950 text-amber-200 border border-amber-700/60 transition-colors"
                  title="Copy Devanagari Sanskrit"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* IAST, Phonetics & Meaning */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-sm">
              <div className="bg-stone-950/40 p-3.5 rounded-xl border border-amber-700/30">
                <span className="text-[11px] text-amber-400 uppercase font-semibold">IAST Transliteration</span>
                <p className="text-base font-semibold text-amber-100 font-mono mt-0.5">{result.iast}</p>
              </div>

              <div className="bg-stone-950/40 p-3.5 rounded-xl border border-amber-700/30">
                <span className="text-[11px] text-amber-400 uppercase font-semibold">Syllable Pronunciation</span>
                <p className="text-base font-semibold text-amber-200 mt-0.5">{result.easyPronunciation}</p>
              </div>

              <div className="bg-stone-950/40 p-3.5 rounded-xl border border-amber-700/30">
                <span className="text-[11px] text-amber-400 uppercase font-semibold">Meaning in Your Language</span>
                <p className="text-base text-stone-200 mt-0.5 font-medium">{result.meaning}</p>
              </div>
            </div>
          </div>

          {/* Word-by-Word Anatomical Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-950 font-bold font-display text-lg">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <span>पद-विभागः (Word-by-Word Anatomical Analysis)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-amber-100/70 text-amber-950 border-b border-amber-300/60 font-semibold">
                    <th className="py-2.5 px-3 rounded-l-lg">Word (पदम्)</th>
                    <th className="py-2.5 px-3">IAST</th>
                    <th className="py-2.5 px-3">Meaning</th>
                    <th className="py-2.5 px-3">Syntactic Role</th>
                    <th className="py-2.5 px-3">Gender (लिङ्गम्)</th>
                    <th className="py-2.5 px-3 rounded-r-lg">Case / Verb Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {result.words.map((w, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                      <td className="py-2.5 px-3 font-sanskrit text-base font-bold text-amber-900 flex items-center gap-1.5">
                        {w.word}
                        <button
                          onClick={() => soundPlayer.playSanskrit(w.word)}
                          className="text-amber-600 hover:text-amber-800"
                          title="Listen to this word"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-stone-600 font-medium">{w.iast}</td>
                      <td className="py-2.5 px-3 font-medium text-stone-900">{w.meaning}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium text-xs border border-stone-200">
                          {w.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium">
                        {w.gender ? (
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                              w.gender.includes('पुल्लिङ्ग')
                                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                : w.gender.includes('स्त्रीलिङ्ग')
                                ? 'bg-rose-100 text-rose-900 border border-rose-200'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            }`}
                          >
                            {w.gender}
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-stone-600 font-medium">{w.caseOrTense || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grammar & Gender Insights Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Grammar Deep Dive */}
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <span>व्याकरण-रहस्यम् (Grammar Explanation)</span>
              </div>
              <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-line font-medium">
                {result.grammarNotes}
              </p>
            </div>

            {/* Gender & Agreement Rules */}
            <div className="bg-rose-50/50 rounded-2xl p-5 border border-rose-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-rose-950 font-bold text-base">
                <Sparkles className="w-5 h-5 text-rose-700" />
                <span>लिङ्ग-व्यवस्था (Gender Rules & Agreement)</span>
              </div>
              <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-line font-medium">
                {result.genderNotes}
              </p>
            </div>
          </div>

          {/* Pronunciation & Phonetic Advice */}
          {result.pronunciationTips && (
            <div className="bg-sky-50/60 rounded-2xl p-5 border border-sky-200/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-sky-950 font-bold text-base">
                <Volume2 className="w-5 h-5 text-sky-700" />
                <span>उच्चारण-परामर्शः (Pronunciation Coach Guidance)</span>
              </div>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                {result.pronunciationTips}
              </p>
            </div>
          )}

          {/* Interactive Practice Challenge */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 rounded-2xl p-5 text-white shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-300" />
              <h4 className="font-bold text-base tracking-wide font-display">
                इदानीं भवतः वारः! (Now It's Your Turn to Practice!)
              </h4>
            </div>
            <p className="text-sm text-amber-100 font-medium">
              {result.practiceChallenge}
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={userPracticeAnswer}
                onChange={(e) => setUserPracticeAnswer(e.target.value)}
                placeholder="Try writing your Sanskrit translation here..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/95 text-stone-900 placeholder:text-stone-400 focus:outline-none text-sm font-medium"
              />
              <button
                onClick={handleCheckPractice}
                className="px-4 py-2 rounded-xl bg-amber-950 hover:bg-stone-950 text-amber-200 font-semibold text-xs tracking-wider uppercase transition-colors"
              >
                Check Answer
              </button>
            </div>

            {practiceFeedback && (
              <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-400/40 text-amber-100 text-xs font-medium">
                {practiceFeedback}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
