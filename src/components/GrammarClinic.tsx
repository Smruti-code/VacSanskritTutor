import React, { useState } from 'react';
import { LearnerLevel, UserLanguage, GrammarCheckResult } from '../types/index.ts';
import { checkGrammarAndGender } from '../services/api.ts';
import { soundPlayer } from '../services/audio.ts';
import { GENDER_CLINIC_EXAMPLES } from '../data/sanskritData.ts';
import {
  Stethoscope,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Volume2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Loader2,
  BookOpen,
} from 'lucide-react';

interface GrammarClinicProps {
  userLanguage: UserLanguage;
  level: LearnerLevel;
}

export const GrammarClinic: React.FC<GrammarClinicProps> = ({ userLanguage, level }) => {
  const [sentence, setSentence] = useState('सीतः विद्यालयं गच्छति।');
  const [result, setResult] = useState<GrammarCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceResponse, setPracticeResponse] = useState<string | null>(null);

  const handleDiagnose = async (textToTest?: string) => {
    const text = (textToTest || sentence).trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setPracticeResponse(null);
    setPracticeAnswer('');

    try {
      const data = await checkGrammarAndGender(text, userLanguage, level);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      alert(`Grammar diagnosis failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'correct':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Grammatically Sound & Natural (शुद्धम्)</span>
          </div>
        );
      case 'grammatically_wrong':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-950 border border-rose-300 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Grammar / Gender Mistake (अशुद्धम्)</span>
          </div>
        );
      case 'unnatural':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Possible but Unnatural Construction</span>
          </div>
        );
      case 'meaning_differed':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-950 border border-blue-300 font-bold text-xs">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Valid Sanskrit, but Meaning Differs</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-amber-900 to-stone-900 text-amber-50 p-5 rounded-2xl border border-rose-700/40 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-rose-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-display tracking-wide text-amber-100">
                Sanskrit Grammar & Gender Doctor
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-2xl">
              Submit any Sanskrit sentence to diagnose case endings, verb lakāras, word order, and especially <strong>Sanskrit Gender Traps</strong> (पुल्लिङ्गम्, स्त्रीलिङ्गम्, नपुंसकलिङ्गम्).
            </p>
          </div>

          <div className="text-xs bg-black/40 px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-200">
            Rule Strictness: <strong className="text-white">Paninian & Classical Standard</strong>
          </div>
        </div>

        {/* Famous Gender & Grammar Traps */}
        <div className="mt-4 pt-3 border-t border-rose-800/40">
          <div className="text-xs font-semibold text-rose-300 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Test Classic Learner Traps:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {GENDER_CLINIC_EXAMPLES.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSentence(ex.trap);
                  handleDiagnose(ex.trap);
                }}
                className="text-left p-2.5 rounded-xl bg-black/30 hover:bg-black/50 border border-rose-700/30 hover:border-amber-500 transition-all text-xs"
              >
                <div className="font-semibold text-amber-300 truncate">{ex.title}</div>
                <div className="font-sanskrit text-sm text-stone-200 mt-0.5 line-through decoration-rose-400">
                  {ex.trap}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
        <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider">
          Enter Your Sanskrit Sentence (Devanagari or IAST)
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="e.g. सीतः वनं गच्छति / sundaraḥ bālikā paṭhati / फलं पतति"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-rose-600 focus:outline-none text-stone-900 font-sanskrit text-lg font-medium bg-amber-50/20"
          />
          <button
            onClick={() => handleDiagnose()}
            disabled={isLoading || !sentence.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-800 via-rose-700 to-amber-800 text-white font-semibold text-sm hover:from-rose-900 hover:to-amber-900 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Diagnosing...</span>
              </>
            ) : (
              <>
                <Stethoscope className="w-4 h-4" />
                <span>Diagnose Sentence</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagnosis Results */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Verdict Banner Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
              <div className="flex items-center gap-3">
                {getStatusBadge(result.status)}
                <span className="text-xs text-stone-500 font-medium">{result.verdictBadge}</span>
              </div>
              <div className="text-xs text-stone-600 font-medium">
                Evaluated for: <strong>{userLanguage === 'auto' ? 'Learner Language' : userLanguage}</strong>
              </div>
            </div>

            {/* Original vs Corrected Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">
                  Your Sentence
                </span>
                <div className="text-2xl font-sanskrit text-stone-800 font-medium">
                  {result.original}
                </div>
              </div>

              {/* Corrected */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-400 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-amber-900 tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Correct Sanskrit (शुद्ध-रूपम्)
                  </span>
                  <button
                    onClick={() => soundPlayer.playSanskrit(result.correctedSanskrit)}
                    className="p-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-900"
                    title="Listen to corrected Sanskrit"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-2xl sm:text-3xl font-sanskrit text-amber-950 font-bold">
                  {result.correctedSanskrit}
                </div>
                <div className="text-xs font-mono text-amber-800 font-medium">
                  {result.correctedIast}
                </div>
              </div>
            </div>

            {/* Intended Meaning */}
            <div className="p-3 bg-amber-100/50 rounded-xl text-xs sm:text-sm text-stone-800 font-medium">
              <strong className="text-amber-900">Intended Meaning:</strong> {result.intendedMeaning}
            </div>
          </div>

          {/* Diagnosis Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* What Was Wrong */}
            <div className="bg-rose-50/60 rounded-2xl p-5 border border-rose-200/80 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-rose-950 font-bold text-base">
                <ShieldAlert className="w-5 h-5 text-rose-700" />
                <span>What was wrong (दोष-विवेचनम्)</span>
              </div>
              <p className="text-sm text-stone-800 leading-relaxed font-medium whitespace-pre-line">
                {result.whatWasWrong}
              </p>
            </div>

            {/* Why: Grammatical Reason */}
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-base">
                <BookOpen className="w-5 h-5 text-amber-700" />
                <span>Grammatical Rule & Reason (व्याकरण-नियमः)</span>
              </div>
              <p className="text-sm text-stone-800 leading-relaxed font-medium whitespace-pre-line">
                {result.grammaticalReason}
              </p>
            </div>
          </div>

          {/* Gender Analysis Special Highlight */}
          <div className="bg-gradient-to-r from-purple-50 via-rose-50 to-amber-50 rounded-2xl p-5 border border-purple-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-purple-950 font-bold text-base">
              <Sparkles className="w-5 h-5 text-purple-700" />
              <span>Sanskrit Gender Doctor (लिङ्ग-निरीक्षणम्)</span>
            </div>
            <p className="text-sm text-stone-800 leading-relaxed font-medium">
              {result.genderAnalysis}
            </p>
          </div>

          {/* Similar Correct Example & Interactive Practice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {result.similarExample && (
              <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs space-y-2">
                <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">
                  Similar Correct Example
                </span>
                <p className="text-sm text-stone-800 font-medium">
                  {result.similarExample}
                </p>
              </div>
            )}

            {/* Follow-up Drill */}
            <div className="bg-amber-700 text-white rounded-2xl p-5 shadow-md space-y-3">
              <span className="text-xs uppercase font-bold text-amber-200 tracking-wider">
                Follow-up Practice Drill
              </span>
              <p className="text-sm text-amber-100 font-medium">
                {result.followupPractice}
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={practiceAnswer}
                  onChange={(e) => setPracticeAnswer(e.target.value)}
                  placeholder="Type your correction..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white text-stone-900 text-xs font-medium focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (practiceAnswer.trim()) {
                      setPracticeResponse(
                        `साधु! (Well done!) Your sentence "${practiceAnswer}" has been noted. Observe how applying the gender rule eliminates the error.`
                      );
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-950 text-amber-300 text-xs font-semibold hover:bg-black"
                >
                  Verify
                </button>
              </div>

              {practiceResponse && (
                <div className="text-xs text-amber-200 bg-amber-900/60 p-2 rounded-lg border border-amber-500/40 font-medium">
                  {practiceResponse}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
