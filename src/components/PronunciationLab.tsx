import React, { useState } from 'react';
import { LearnerLevel, UserLanguage, PronounceCoachResult, SpeechEvaluationResult } from '../types/index.ts';
import { getPronunciationGuide, evaluateSpokenSanskrit } from '../services/api.ts';
import { soundPlayer, voiceRecognizer } from '../services/audio.ts';
import { TRICKY_SOUNDS, TrickySoundGroup } from '../data/sanskritData.ts';
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Award,
  Loader2,
  Ear,
  Info,
} from 'lucide-react';

interface PronunciationLabProps {
  userLanguage: UserLanguage;
  level: LearnerLevel;
}

export const PronunciationLab: React.FC<PronunciationLabProps> = ({ userLanguage, level }) => {
  const [selectedSoundGroup, setSelectedSoundGroup] = useState<TrickySoundGroup>(TRICKY_SOUNDS[0]);
  const [customWord, setCustomWord] = useState('धर्मक्षेत्रे कुरुक्षेत्रे');
  const [coachResult, setCoachResult] = useState<PronounceCoachResult | null>(null);
  const [isLoadingCoach, setIsLoadingCoach] = useState(false);

  // Speech evaluation state
  const [isRecording, setIsRecording] = useState(false);
  const [userSpokenText, setUserSpokenText] = useState('');
  const [evalResult, setEvalResult] = useState<SpeechEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleAnalyzeWord = async (wordToAnalyze?: string) => {
    const word = (wordToAnalyze || customWord).trim();
    if (!word || isLoadingCoach) return;

    setIsLoadingCoach(true);
    setEvalResult(null);

    try {
      const data = await getPronunciationGuide(word, userLanguage);
      setCoachResult(data);
    } catch (err: any) {
      console.error(err);
      alert(`Pronunciation analysis failed: ${err.message}`);
    } finally {
      setIsLoadingCoach(false);
    }
  };

  const handleRecordUserSpeech = (targetText: string) => {
    if (isRecording) {
      voiceRecognizer.stopListening();
      setIsRecording(false);
    } else {
      if (!voiceRecognizer.isSupported) {
        alert('Speech recognition is not supported in this browser. You can type your phonetic attempt.');
        return;
      }
      setIsRecording(true);
      setUserSpokenText('');
      setEvalResult(null);

      voiceRecognizer.startListening(
        'hi-IN', // Use Hindi/Indian acoustic model for best Sanskrit phoneme capture
        async (transcript) => {
          setUserSpokenText(transcript);
          setIsRecording(false);
          // Auto evaluate
          await runEvaluation(targetText, transcript);
        },
        (err) => {
          console.warn(err);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );
    }
  };

  const runEvaluation = async (target: string, transcript: string) => {
    setIsEvaluating(true);
    try {
      const evaluation = await evaluateSpokenSanskrit(target, transcript, userLanguage);
      setEvalResult(evaluation);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-amber-50 p-5 rounded-2xl border border-amber-700/50 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Ear className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-display tracking-wide text-amber-100">
                Sanskrit Pronunciation Coach & Phonetics Lab
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-2xl">
              Master the sacred phonetics (शिक्षा - Śikṣā) of Sanskrit: Places of Articulation (स्थानम्), Dental vs Retroflex, Sibilants, and Vowel duration (मात्रा).
            </p>
          </div>
          <div className="text-xs bg-amber-950/70 px-3 py-1.5 rounded-xl border border-amber-600/40 text-amber-300">
            Powered by <strong>Vāc Audio Engine & Phonetics Guide</strong>
          </div>
        </div>
      </div>

      {/* Tricky Minimal Pairs Tab Selector */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Crucial Sound Distinctions (त vs ट, श vs ष vs स, Short vs Long)
          </h3>
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">Click pair to drill</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {TRICKY_SOUNDS.map((group) => {
            const isSelected = selectedSoundGroup.id === group.id;
            return (
              <button
                key={group.id}
                onClick={() => setSelectedSoundGroup(group)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-700 shadow-md font-semibold'
                    : 'bg-amber-50/50 hover:bg-amber-100/60 text-stone-800 border-amber-200'
                }`}
              >
                <div className="font-sanskrit text-lg font-bold">{group.sanskritLetters}</div>
                <div className="text-xs opacity-90 truncate mt-0.5">{group.iastComparison}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Sound Detail Card */}
        <div className="bg-gradient-to-br from-amber-50 via-amber-100/40 to-stone-50 p-5 rounded-2xl border border-amber-300/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
            <div>
              <h4 className="text-base font-bold text-amber-950 flex items-center gap-2">
                <span>{selectedSoundGroup.title}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  {selectedSoundGroup.iastComparison}
                </span>
              </h4>
              <p className="text-xs text-amber-800 font-medium mt-1">
                Tip: {selectedSoundGroup.tip}
              </p>
            </div>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed font-medium">
            {selectedSoundGroup.differenceExplained}
          </p>

          {/* Drill Words with Audio */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-950 block mb-2">
              Practice Words (Click Speaker to Listen):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {selectedSoundGroup.drillWords.map((drill, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between gap-2 hover:border-amber-400 transition-all"
                >
                  <div>
                    <div className="font-sanskrit text-lg font-bold text-amber-900">{drill.word}</div>
                    <div className="font-mono text-xs text-stone-600">{drill.iast}</div>
                    <div className="text-[11px] text-stone-500 font-medium mt-0.5">{drill.meaning}</div>
                  </div>
                  <button
                    onClick={() => soundPlayer.playSanskrit(drill.word)}
                    className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
                    title={`Hear ${drill.word}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Any Word / Shloka Phonetics Analyzer */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
        <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider">
          Analyze & Coach Any Sanskrit Word or Shloka
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value)}
            placeholder="e.g. धर्मक्षेत्रे कुरुक्षेत्रे / vidyā dadāti vinayam / नमस्कृत्य"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-600 focus:outline-none text-stone-900 font-sanskrit text-lg font-medium bg-amber-50/20"
          />
          <button
            onClick={() => handleAnalyzeWord()}
            disabled={isLoadingCoach || !customWord.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 text-white font-semibold text-sm hover:from-amber-800 hover:to-amber-900 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoadingCoach ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Coaching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Coach Pronunciation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Coach Results */}
      {coachResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Hero Pronunciation Card */}
          <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900 text-amber-50 rounded-3xl p-6 shadow-xl border border-amber-700/60 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-700/60 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                  उच्चारण-मार्गदर्शकः (Phonetic Breakdown)
                </span>
                <div className="text-3xl sm:text-4xl font-sanskrit text-amber-100 mt-1 font-bold">
                  {coachResult.devanagari}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => soundPlayer.playSanskrit(coachResult.devanagari)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Master Audio</span>
                </button>

                {/* Mic Practice */}
                <button
                  onClick={() => handleRecordUserSpeech(coachResult.devanagari)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-amber-950 hover:bg-stone-950 text-amber-200 border border-amber-700/50'
                  }`}
                  title="Record your voice to test pronunciation"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isRecording ? 'Listening...' : 'Practice Voice'}</span>
                </button>
              </div>
            </div>

            {/* Syllables & Meter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-stone-950/40 p-3.5 rounded-xl border border-amber-700/40">
                <span className="text-[11px] text-amber-400 uppercase font-semibold">Syllable Partition</span>
                <p className="text-lg font-bold text-amber-200 mt-0.5 tracking-wider font-mono">
                  {coachResult.syllables}
                </p>
              </div>

              <div className="bg-stone-950/40 p-3.5 rounded-xl border border-amber-700/40">
                <span className="text-[11px] text-amber-400 uppercase font-semibold">IAST Scholarly Transliteration</span>
                <p className="text-lg font-semibold text-amber-100 mt-0.5 font-mono">
                  {coachResult.iast}
                </p>
              </div>
            </div>

            {/* Coach Summary Advice */}
            <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-600/40 text-xs sm:text-sm text-amber-100 font-medium">
              <strong>Guru's Advice:</strong> {coachResult.coachAdvice}
            </div>
          </div>

          {/* Places of Articulation (स्थानम्) */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-amber-950 font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              Places of Articulation (उच्चारण-स्थानानि)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {coachResult.placesOfArticulation.map((place, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-sanskrit text-xl font-bold text-amber-900">{place.sound}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-semibold">
                      {place.sthanaName}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-stone-700">{place.englishName}</div>
                  <p className="text-xs text-stone-600 leading-relaxed font-medium">{place.technique}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings on Tricky Sounds */}
          {coachResult.trickySoundWarnings && coachResult.trickySoundWarnings.length > 0 && (
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200 shadow-xs space-y-3">
              <h4 className="text-base font-bold text-amber-950 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Pitfalls to Avoid in This Phrase
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {coachResult.trickySoundWarnings.map((warn, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-2xs space-y-1">
                    <div className="font-semibold text-amber-900 text-sm">{warn.pair}</div>
                    <div className="text-xs text-rose-700 font-medium">Common error: {warn.commonMistake}</div>
                    <div className="text-xs text-stone-700 font-medium">Correction: {warn.howToFix}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Spoken Speech Evaluation Card */}
          {isEvaluating && (
            <div className="p-4 rounded-2xl bg-amber-100 border border-amber-300 flex items-center gap-3 text-amber-900 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-amber-700" />
              <span>Evaluating your pronunciation audio...</span>
            </div>
          )}

          {evalResult && (
            <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-emerald-50 rounded-2xl p-6 shadow-lg border border-emerald-700/50 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-700/50 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <h4 className="text-lg font-bold font-display text-emerald-100">
                    Your Pronunciation Evaluation
                  </h4>
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-xl border border-emerald-500/40">
                  <span className="text-xs text-emerald-300">Accuracy Score:</span>
                  <span className="text-lg font-bold text-yellow-400">{evalResult.score}%</span>
                </div>
              </div>

              {userSpokenText && (
                <div className="text-xs text-emerald-200 bg-black/30 p-2.5 rounded-lg border border-emerald-800">
                  Transcribed voice input: <span className="text-white font-medium">"{userSpokenText}"</span>
                </div>
              )}

              <p className="text-sm text-emerald-100 font-medium leading-relaxed">
                {evalResult.feedback}
              </p>

              {evalResult.soundCritiques && evalResult.soundCritiques.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {evalResult.soundCritiques.map((critique, idx) => (
                    <div key={idx} className="bg-black/30 p-3 rounded-xl border border-emerald-700/40 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="font-sanskrit text-base text-yellow-300">{critique.sound}</span>
                        <span className="text-[11px] text-emerald-300">{critique.verdict}</span>
                      </div>
                      {critique.issue && <div className="text-rose-300">{critique.issue}</div>}
                      <div className="text-emerald-100">{critique.correction}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-xs text-yellow-200/90 font-medium pt-1">
                Next repetition suggestion: {evalResult.repeatSuggestion}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
