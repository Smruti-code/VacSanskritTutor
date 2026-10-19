import { generateTTSAudio } from './api.ts';

class SoundController {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCache = new Map<string, string>();

  async playSanskrit(text: string): Promise<void> {
    this.stop();

    const cleanText = text.trim();
    if (!cleanText) return;

    // Check cache
    let base64 = this.audioCache.get(cleanText);

    try {
      if (!base64) {
        base64 = await generateTTSAudio(cleanText);
        this.audioCache.set(cleanText, base64);
      }

      if (base64) {
        const audio = new Audio(`data:audio/wav;base64,${base64}`);
        this.currentAudio = audio;
        await audio.play();
        return;
      }
    } catch (err) {
      console.warn('Backend TTS failed, falling back to Web Speech API:', err);
    }

    // Fallback to Web Speech API
    this.speakWithWebSpeech(cleanText);
  }

  speakWithWebSpeech(text: string): void {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.82; // Slightly deliberate for Sanskrit learners
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prefer Sanskrit or Hindi voice for phonetic accuracy with Devanagari
    const indianVoice = voices.find(
      (v) => v.lang.startsWith('sa') || v.lang.startsWith('hi') || v.lang.includes('IN')
    );
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundPlayer = new SoundController();

// Voice Recognition helper for browser speech input
export class VoiceRecognizer {
  private recognition: any = null;
  public isSupported: boolean = false;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.isSupported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  startListening(
    lang: string = 'en-IN',
    onResult: (text: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser.');
      return;
    }

    this.recognition.lang = lang;
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error);
    };

    this.recognition.onend = () => {
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      onError(e);
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
  }
}

export const voiceRecognizer = new VoiceRecognizer();
