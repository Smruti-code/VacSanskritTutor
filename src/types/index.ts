export type LearnerLevel = 'beginner' | 'intermediate' | 'advanced';

export type UserLanguage =
  | 'auto'
  | 'English'
  | 'Tamil (தமிழ்)'
  | 'Hindi (हिन्दी)'
  | 'Telugu (తెలుగు)'
  | 'Kannada (ಕನ್ನಡ)'
  | 'Malayalam (മലയാളം)'
  | 'Marathi (मराठी)'
  | 'Bengali (বাংলা)'
  | 'Gujarati (ગુજરાતી)';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sanskritSnippet?: string;
  hasAudio?: boolean;
}

export interface WordAnalysis {
  word: string;
  iast: string;
  meaning: string;
  role: string;
  gender?: string;
  caseOrTense?: string;
}

export interface TranslationResult {
  sanskrit: string;
  iast: string;
  easyPronunciation: string;
  meaning: string;
  detectedLanguage?: string;
  words: WordAnalysis[];
  grammarNotes: string;
  genderNotes: string;
  pronunciationTips: string;
  practiceChallenge: string;
}

export interface GrammarCheckResult {
  original: string;
  status: 'correct' | 'grammatically_wrong' | 'unnatural' | 'meaning_differed';
  verdictBadge: string;
  correctedSanskrit: string;
  correctedIast: string;
  easyPronunciation?: string;
  intendedMeaning: string;
  whatWasWrong: string;
  grammaticalReason: string;
  genderAnalysis: string;
  similarExample?: string;
  followupPractice: string;
}

export interface PlaceOfArticulation {
  sound: string;
  sthanaName: string;
  englishName: string;
  technique: string;
}

export interface TrickySoundWarning {
  pair: string;
  commonMistake: string;
  howToFix: string;
}

export interface PronounceCoachResult {
  devanagari: string;
  iast: string;
  syllables: string;
  meterOrRhythm?: string;
  placesOfArticulation: PlaceOfArticulation[];
  trickySoundWarnings: TrickySoundWarning[];
  coachAdvice: string;
}

export interface SpeechEvaluationResult {
  score: number;
  rating: string;
  feedback: string;
  soundCritiques: Array<{
    sound: string;
    verdict: string;
    issue?: string;
    correction: string;
  }>;
  repeatSuggestion: string;
}
