import React, { useState } from 'react';
import { soundPlayer } from '../services/audio.ts';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  HelpCircle,
  Volume2,
  RotateCcw,
  BookOpen,
  Award,
} from 'lucide-react';

interface NounChallenge {
  devanagari: string;
  iast: string;
  meaning: string;
  gender: 'masculine' | 'feminine' | 'neuter';
  pattern: string;
  ruleExplanation: string;
}

const NOUN_CHALLENGES: NounChallenge[] = [
  {
    devanagari: 'रामः',
    iast: 'rāmaḥ',
    meaning: 'Rama / charming one',
    gender: 'masculine',
    pattern: 'अकारान्त पुल्लिङ्ग',
    ruleExplanation: 'Ends in short "a" and takes visarga (ः) in nominative singular. Masculine पुल्लिङ्गम्.',
  },
  {
    devanagari: 'सीता',
    iast: 'sītā',
    meaning: 'Sita / furrow',
    gender: 'feminine',
    pattern: 'आकारान्त स्त्रीलिङ्ग',
    ruleExplanation: 'Ends in long "ā" and DOES NOT take visarga in nominative singular. Feminine स्त्रीलिङ्गम्.',
  },
  {
    devanagari: 'फलम्',
    iast: 'phalam',
    meaning: 'fruit / result',
    gender: 'neuter',
    pattern: 'अकारान्त नपुंसकलिङ्ग',
    ruleExplanation: 'Neuter noun ending in "a", takes "m" (म्) in nominative singular. Neuter नपुंसकलिङ्गम्.',
  },
  {
    devanagari: 'नदी',
    iast: 'nadī',
    meaning: 'river',
    gender: 'feminine',
    pattern: 'ईकारान्त स्त्रीलिङ्ग',
    ruleExplanation: 'Ends in long "ī". In nominative singular, it is simply नदी (no visarga). Feminine स्त्रीलिङ्गम्.',
  },
  {
    devanagari: 'मित्रम्',
    iast: 'mitram',
    meaning: 'friend',
    gender: 'neuter',
    pattern: 'अकारान्त नपुंसकलिङ्ग',
    ruleExplanation: 'Classic trap! In Sanskrit, "friend" is grammatically NEUTER (मित्रम्), not masculine! (मित्रः with visarga means the Sun God).',
  },
  {
    devanagari: 'सूर्यः',
    iast: 'sūryaḥ',
    meaning: 'sun',
    gender: 'masculine',
    pattern: 'अकारान्त पुल्लिङ्ग',
    ruleExplanation: 'The Sun is masculine पुल्लिङ्गम्, taking visarga (सूर्यः).',
  },
  {
    devanagari: 'वनम्',
    iast: 'vanam',
    meaning: 'forest',
    gender: 'neuter',
    pattern: 'अकारान्त नपुंसकलिङ्ग',
    ruleExplanation: 'Forest is neuter in Sanskrit, takes ending "म्" in nominative (वनम्).',
  },
  {
    devanagari: 'लता',
    iast: 'latā',
    meaning: 'creeper / vine',
    gender: 'feminine',
    pattern: 'आकारान्त स्त्रीलिङ्ग',
    ruleExplanation: 'Feminine noun ending in "ā". No visarga in nominative singular.',
  },
  {
    devanagari: 'वारि',
    iast: 'vāri',
    meaning: 'water',
    gender: 'neuter',
    pattern: 'इकारान्त नपुंसकलिङ्ग',
    ruleExplanation: 'Water (वारि) is an ikārānta neuter noun (नपुंसकलिङ्गम्).',
  },
];

const VIBHAKTI_TABLE = [
  { no: '1st', sanskrit: 'प्रथमा (Prathamā)', function: 'Subject (कर्त्ता)', question: 'Who? What?', example: 'रामः (Rama goes)' },
  { no: '2nd', sanskrit: 'द्वितीया (Dvitīyā)', function: 'Direct Object (कर्म)', question: 'Whom? To what?', example: 'रामम् (sees Rama)' },
  { no: '3rd', sanskrit: 'तृतीया (Tṛtīyā)', function: 'Instrument / Agent (करण)', question: 'By/with whom?', example: 'रामेण (by Rama)' },
  { no: '4th', sanskrit: 'चतुर्थी (Caturthī)', function: 'Recipient / Purpose (सम्प्रदान)', question: 'For whom?', example: 'रामाय (for Rama)' },
  { no: '5th', sanskrit: 'पञ्चमी (Pañcamī)', function: 'Separation / Source (अपादान)', question: 'From where/whom?', example: 'रामात् (from Rama)' },
  { no: '6th', sanskrit: 'षष्ठी (Ṣaṣṭhī)', function: 'Possession / Relation (सम्बन्ध)', question: 'Whose?', example: 'रामस्य (of Rama)' },
  { no: '7th', sanskrit: 'सप्तमी (Saptamī)', function: 'Location / Time (अधिकरण)', question: 'In/on what/where?', example: 'रामे (in Rama)' },
  { no: '8th', sanskrit: 'सम्बोधन (Sambodhana)', function: 'Vocative Address', question: 'O...!', example: 'हे राम! (O Rama!)' },
];

export const GenderVibhaktiPlayground: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const currentNoun = NOUN_CHALLENGES[currentIdx];

  const handleSelect = (choice: 'masculine' | 'feminine' | 'neuter') => {
    if (selectedGender) return;
    setSelectedGender(choice);
    setAnsweredCount((c) => c + 1);
    if (choice === currentNoun.gender) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedGender(null);
    setCurrentIdx((prev) => (prev + 1) % NOUN_CHALLENGES.length);
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedGender(null);
    setScore(0);
    setAnsweredCount(0);
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-rose-900 to-stone-900 text-amber-50 p-5 rounded-2xl border border-amber-700/50 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-display tracking-wide text-amber-100">
                Sanskrit Gender & Vibhakti Laboratory
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-2xl">
              In Sanskrit, grammatical gender is not arbitrary; it dictates endings and agreement! Test your noun classification skills and master the 8 Vibhaktis (Cases).
            </p>
          </div>
          <div className="text-xs bg-black/40 px-3.5 py-1.5 rounded-xl border border-amber-600/40 flex items-center gap-2">
            <span>Score:</span>
            <span className="font-bold text-amber-300 text-sm">
              {score} / {answeredCount}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Gender Challenge Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Interactive Gender Drill ({currentIdx + 1} of {NOUN_CHALLENGES.length})</span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Quiz</span>
          </button>
        </div>

        {/* Noun Display */}
        <div className="text-center py-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 relative">
          <button
            onClick={() => soundPlayer.playSanskrit(currentNoun.devanagari)}
            className="absolute top-3 right-3 p-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 transition-colors"
            title="Hear noun audio"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <div className="text-4xl sm:text-5xl font-sanskrit text-amber-950 font-bold tracking-wide">
            {currentNoun.devanagari}
          </div>
          <div className="text-sm font-mono text-stone-600 font-semibold mt-1">
            {currentNoun.iast}
          </div>
          <div className="text-xs text-amber-800 font-medium mt-1">
            Meaning: "{currentNoun.meaning}"
          </div>
        </div>

        {/* 3 Gender Choice Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'masculine', label: 'पुल्लिङ्गम् (Masculine)', color: 'blue' },
            { id: 'feminine', label: 'स्त्रीलिङ्गम् (Feminine)', color: 'rose' },
            { id: 'neuter', label: 'नपुंसकलिङ्गम् (Neuter)', color: 'emerald' },
          ].map((btn) => {
            const isChosen = selectedGender === btn.id;
            const isCorrect = currentNoun.gender === btn.id;
            let btnClass = 'bg-stone-50 hover:bg-amber-50 border-stone-200 text-stone-800';

            if (selectedGender) {
              if (isCorrect) {
                btnClass = 'bg-emerald-600 text-white border-emerald-700 shadow-md font-bold';
              } else if (isChosen) {
                btnClass = 'bg-rose-600 text-white border-rose-700 shadow-md font-bold';
              } else {
                btnClass = 'opacity-50 border-stone-200 text-stone-400';
              }
            }

            return (
              <button
                key={btn.id}
                onClick={() => handleSelect(btn.id as any)}
                disabled={Boolean(selectedGender)}
                className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 ${btnClass}`}
              >
                <span className="text-sm font-semibold">{btn.label}</span>
                {selectedGender && isCorrect && (
                  <span className="text-xs flex items-center gap-1 text-emerald-100">
                    <CheckCircle className="w-3.5 h-3.5" /> Correct!
                  </span>
                )}
                {selectedGender && isChosen && !isCorrect && (
                  <span className="text-xs flex items-center gap-1 text-rose-100">
                    <XCircle className="w-3.5 h-3.5" /> Incorrect
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation After Answering */}
        {selectedGender && (
          <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-amber-900 tracking-wider">
                Grammar Pattern: {currentNoun.pattern}
              </span>
              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs transition-colors"
              >
                Next Word →
              </button>
            </div>
            <p className="text-sm text-stone-800 font-medium leading-relaxed">
              {currentNoun.ruleExplanation}
            </p>
          </div>
        )}
      </div>

      {/* Adjective-Noun Gender Agreement Matrix */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-amber-950 font-display flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-700" />
          The Law of Gender Agreement (विशेषण-विशेष्य-भावः)
        </h3>
        <p className="text-xs sm:text-sm text-stone-600">
          In Sanskrit, an adjective must mirror the gender of the noun it describes. Notice how <em>सुन्दर</em> (beautiful) transforms:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Masculine */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
            <div className="text-xs font-bold text-blue-900 uppercase">Masculine (पुल्लिङ्गम्)</div>
            <div className="text-xl font-sanskrit text-blue-950 font-bold flex items-center justify-between">
              <span>सुन्दरः बालकः</span>
              <button onClick={() => soundPlayer.playSanskrit('सुन्दरः बालकः')} className="text-blue-700 hover:text-blue-900">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs font-mono text-blue-800">sundaraḥ bālakaḥ</div>
            <p className="text-xs text-stone-600 font-medium">Because बालकः is masculine, adjective becomes सुन्दरः with visarga.</p>
          </div>

          {/* Feminine */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
            <div className="text-xs font-bold text-rose-900 uppercase">Feminine (स्त्रीलिङ्गम्)</div>
            <div className="text-xl font-sanskrit text-rose-950 font-bold flex items-center justify-between">
              <span>सुन्दरी बालिका</span>
              <button onClick={() => soundPlayer.playSanskrit('सुन्दरी बालिका')} className="text-rose-700 hover:text-rose-900">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs font-mono text-rose-800">sundarī bālikā</div>
            <p className="text-xs text-stone-600 font-medium">Because बालिका is feminine, adjective becomes सुन्दरी (long ī), NEVER सुन्दरः!</p>
          </div>

          {/* Neuter */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <div className="text-xs font-bold text-emerald-900 uppercase">Neuter (नपुंसकलिङ्गम्)</div>
            <div className="text-xl font-sanskrit text-emerald-950 font-bold flex items-center justify-between">
              <span>सुन्दरं फलम्</span>
              <button onClick={() => soundPlayer.playSanskrit('सुन्दरं फलम्')} className="text-emerald-700 hover:text-emerald-900">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs font-mono text-emerald-800">sundaraṃ phalam</div>
            <p className="text-xs text-stone-600 font-medium">Because फलम् is neuter, adjective takes anusvāra/m (सुन्दरम्).</p>
          </div>
        </div>
      </div>

      {/* Vibhakti (Case Endings) Master Reference Table */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-amber-950 font-display flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-700" />
          The 8 Sanskrit Vibhaktis (विभक्ति-सारिणी)
        </h3>
        <p className="text-xs sm:text-sm text-stone-600">
          Cases tell you what role each noun plays in the sentence without needing word order.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-100/70 text-amber-950 font-semibold border-b border-amber-300">
                <th className="py-2.5 px-3 rounded-l-lg">Case</th>
                <th className="py-2.5 px-3">Sanskrit Name</th>
                <th className="py-2.5 px-3">Syntactic Role</th>
                <th className="py-2.5 px-3">Core Question</th>
                <th className="py-2.5 px-3 rounded-r-lg">Example (राम)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {VIBHAKTI_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                  <td className="py-2 px-3 font-bold text-amber-900">{row.no}</td>
                  <td className="py-2 px-3 font-semibold text-stone-900">{row.sanskrit}</td>
                  <td className="py-2 px-3 font-medium text-stone-700">{row.function}</td>
                  <td className="py-2 px-3 font-mono text-stone-500">{row.question}</td>
                  <td className="py-2 px-3 font-sanskrit text-amber-950 font-semibold flex items-center gap-1.5">
                    {row.example}
                    <button
                      onClick={() => soundPlayer.playSanskrit(row.example)}
                      className="text-amber-600 hover:text-amber-800"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
