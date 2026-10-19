import {
  ChatMessage,
  LearnerLevel,
  UserLanguage,
  TranslationResult,
  GrammarCheckResult,
  PronounceCoachResult,
  SpeechEvaluationResult,
} from '../types/index.ts';

async function safeJsonFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Server returned non-JSON response (${res.status}): ${text.slice(0, 150)}`);
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || `Server responded with status ${res.status}`);
  }
  return data as T;
}

export async function sendChatMessage(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userLanguage: UserLanguage,
  level: LearnerLevel,
  mode: 'tutor' | 'translator' | 'pronunciation' | 'grammar' = 'tutor'
): Promise<string> {
  const data = await safeJsonFetch<{ reply: string }>('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, userLanguage, level, mode }),
  });
  return data.reply;
}

export async function translateAndTeach(
  text: string,
  userLanguage: UserLanguage,
  level: LearnerLevel
): Promise<TranslationResult> {
  return await safeJsonFetch<TranslationResult>('/api/translate-teach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, userLanguage, level }),
  });
}

export async function checkGrammarAndGender(
  sentence: string,
  userLanguage: UserLanguage,
  level: LearnerLevel
): Promise<GrammarCheckResult> {
  return await safeJsonFetch<GrammarCheckResult>('/api/grammar-clinic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentence, userLanguage, level }),
  });
}

export async function getPronunciationGuide(
  text: string,
  userLanguage: UserLanguage
): Promise<PronounceCoachResult> {
  return await safeJsonFetch<PronounceCoachResult>('/api/pronounce-coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, userLanguage }),
  });
}

export async function generateTTSAudio(text: string, voice = 'Kore'): Promise<string> {
  const data = await safeJsonFetch<{ audioBase64: string }>('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
  });
  return data.audioBase64;
}

export async function evaluateSpokenSanskrit(
  targetText: string,
  userTranscript: string,
  userLanguage: UserLanguage
): Promise<SpeechEvaluationResult> {
  return await safeJsonFetch<SpeechEvaluationResult>('/api/evaluate-speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetText, userTranscript, userLanguage }),
  });
}
