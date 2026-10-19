import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LearnerLevel, UserLanguage } from '../types/index.ts';
import { sendChatMessage } from '../services/api.ts';
import { soundPlayer, voiceRecognizer } from '../services/audio.ts';
import { QUICK_PROMPTS } from '../data/sanskritData.ts';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface TutorChatProps {
  userLanguage: UserLanguage;
  level: LearnerLevel;
  onNavigateToTab?: (tab: string, query?: string) => void;
}

export const TutorChat: React.FC<TutorChatProps> = ({ userLanguage, level, onNavigateToTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `**नमस्ते! (Namaste!)** Welcome to your personal Sanskrit Gurukula.

I am **Vāc Guru (वाग् गुरुः)**, your patient multilingual teacher, translator, grammar doctor, and pronunciation coach.

### How I can help you:
1. **Speak to me in any language** — English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), or any other! I will understand and teach you in your chosen language.
2. **Translate & Learn** — I don't just translate words; I teach you *why* words take specific endings, their genders, and how to construct sentences yourself.
3. **Master Sanskrit Gender** — I will strictly guide you on **पुल्लिङ्गम् (Masculine)**, **स्त्रीलिङ्गम् (Feminine)**, and **नपुंसकलिङ्गम् (Neuter)**, and correct common traps like *सीतः* vs *सीता*.
4. **Pronunciation Coaching** — Click any speaker icon to hear authentic pronunciation with syllable-by-syllable breakdown (e.g. dental *त* vs retroflex *ट*).

What would you like to explore or say today? Try asking me below or choose a prompt!`,
      timestamp: Date.now(),
      sanskritSnippet: 'नमस्ते! विद्या ददाति विनयम्।',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeMode, setActiveMode] = useState<'tutor' | 'translator' | 'pronunciation' | 'grammar'>('tutor');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await sendChatMessage(history, userLanguage, level, activeMode);

      // Extract primary Devanagari snippet if available for quick audio playback
      const devanagariMatch = reply.match(/[\u0900-\u097F]+(?:[\s\u0900-\u097F.,!?।॥]+)*/g);
      const longestSnippet = devanagariMatch
        ? devanagariMatch.reduce((a, b) => (a.length > b.length ? a : b), '')
        : undefined;

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
        sanskritSnippet: longestSnippet && longestSnippet.length > 3 ? longestSnippet.slice(0, 80) : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `क्षम्यताम् (Pardon me). I ran into an issue connecting to the guru: ${err.message}. Please try again!`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      voiceRecognizer.stopListening();
      setIsRecording(false);
    } else {
      if (!voiceRecognizer.isSupported) {
        alert('Speech recognition is not supported in this browser. Please type your message.');
        return;
      }
      setIsRecording(true);
      // Map user language to speech recognition locale code
      let langCode = 'en-IN';
      if (userLanguage.includes('Hindi')) langCode = 'hi-IN';
      else if (userLanguage.includes('Tamil')) langCode = 'ta-IN';
      else if (userLanguage.includes('Telugu')) langCode = 'te-IN';
      else if (userLanguage.includes('Kannada')) langCode = 'kn-IN';
      else if (userLanguage.includes('Malayalam')) langCode = 'ml-IN';
      else if (userLanguage.includes('Bengali')) langCode = 'bn-IN';
      else if (userLanguage.includes('Marathi')) langCode = 'mr-IN';

      voiceRecognizer.startListening(
        langCode,
        (transcript) => {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        },
        (err) => {
          console.warn('Voice recognition error:', err);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );
    }
  };

  const handlePlayAudio = async (text: string, id: string) => {
    setPlayingId(id);
    try {
      await soundPlayer.playSanskrit(text);
    } finally {
      setPlayingId(null);
    }
  };

  const handleClearChat = () => {
    if (confirm('Start a fresh Gurukula session with Vāc Guru?')) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: `**शुभम् अस्तु! (May all be auspicious!)** We have reset our Gurukula board. What sentence or grammar question would you like to explore next?`,
          timestamp: Date.now(),
        },
      ]);
    }
  };

  // Helper to render formatted text with styled Sanskrit and audio triggers
  const renderMessageContent = (msg: ChatMessage) => {
    const lines = msg.content.split('\n');

    return (
      <div className="space-y-2 text-stone-800 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Heading 3
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-base font-bold text-amber-900 border-b border-amber-200/60 pb-1 mt-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {trimmed.replace('### ', '')}
              </h3>
            );
          }

          // Sanskrit item with audio
          const isSanskritLine =
            trimmed.includes('संस्कृतम्') ||
            trimmed.includes('Sanskrit:') ||
            /[\u0900-\u097F]{4,}/.test(trimmed);

          const devanagariMatches = trimmed.match(/[\u0900-\u097F]{3,}(?:[\s\u0900-\u097F.,!?।॥]+)*/g);

          return (
            <div key={idx} className={`group ${isSanskritLine ? 'bg-amber-100/50 p-2 rounded-lg border border-amber-300/40' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  {/* Highlight bullets or bold formatting */}
                  {trimmed.startsWith('- ') || trimmed.startsWith('* ') ? (
                    <div className="flex items-start gap-2 pl-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <div>{formatInline(trimmed.substring(2))}</div>
                    </div>
                  ) : (
                    <div>{formatInline(trimmed)}</div>
                  )}
                </div>

                {/* Audio button for Sanskrit segments */}
                {devanagariMatches && devanagariMatches.length > 0 && msg.role === 'assistant' && (
                  <button
                    onClick={() => handlePlayAudio(devanagariMatches[0], `${msg.id}-${idx}`)}
                    className="flex-shrink-0 p-1.5 rounded-md bg-amber-200/80 hover:bg-amber-300 text-amber-900 transition-colors shadow-xs"
                    title={`Hear pronunciation: ${devanagariMatches[0]}`}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${playingId === `${msg.id}-${idx}` ? 'animate-pulse text-amber-700' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const formatInline = (text: string) => {
    // Basic bold, italic and Devanagari styling
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-stone-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-amber-900">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 bg-amber-100 rounded text-amber-950 font-mono text-xs border border-amber-300/50">
            {part.slice(1, -1)}
          </code>
        );
      }
      // Check if text has Devanagari
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-w-5xl mx-auto p-2 sm:p-4 gap-3">
      {/* Top Banner / Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-100/70 p-2.5 rounded-xl border border-amber-300/50 text-xs">
        <div className="flex items-center gap-1.5 text-amber-900 font-medium">
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span>Guru Mode:</span>
          <div className="inline-flex rounded-lg bg-amber-200/80 p-0.5">
            {[
              { id: 'tutor', label: 'Complete Tutor' },
              { id: 'translator', label: 'Translator & Breakdown' },
              { id: 'grammar', label: 'Grammar & Gender Focus' },
              { id: 'pronunciation', label: 'Pronunciation Coach' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id as any)}
                className={`px-2.5 py-1 rounded-md transition-all text-xs ${
                  activeMode === m.id
                    ? 'bg-amber-800 text-white font-semibold shadow-xs'
                    : 'text-amber-900 hover:text-amber-950'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-200/80 hover:bg-stone-300 text-stone-700 hover:text-stone-900 transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-3 h-3" />
          <span>New Session</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white flex items-center justify-center font-sanskrit text-sm font-bold shadow-sm flex-shrink-0 mt-1">
                  वाक्
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-sm ${
                  isUser
                    ? 'bg-amber-700 text-amber-50 rounded-tr-xs'
                    : 'bg-white/95 border border-amber-200/70 text-stone-900 rounded-tl-xs shadow-amber-900/5'
                }`}
              >
                {isUser ? (
                  <div className="text-sm font-medium whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  renderMessageContent(msg)
                )}

                {/* Footer time and quick audio preview */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200/30 text-[11px] opacity-75">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.sanskritSnippet && !isUser && (
                    <button
                      onClick={() => handlePlayAudio(msg.sanskritSnippet!, msg.id)}
                      className="flex items-center gap-1 text-amber-800 hover:text-amber-950 font-medium"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Play Sanskrit</span>
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-stone-700 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-1">
                  You
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-sanskrit text-sm font-bold animate-pulse">
              वाक्
            </div>
            <div className="bg-white/90 border border-amber-200 p-4 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2 text-amber-900 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-stone-600 font-medium font-sanskrit">गुरुः विचारयति... (Guru is pondering)</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs">
        <span className="text-[11px] font-semibold text-amber-900/70 whitespace-nowrap flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-600" /> Quick Try:
        </span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.query)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-full bg-amber-100/90 hover:bg-amber-200 border border-amber-300/60 text-amber-950 whitespace-nowrap text-xs transition-colors flex-shrink-0"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-white/95 rounded-2xl p-2 sm:p-2.5 border-2 border-amber-300/80 shadow-md flex items-center gap-2"
      >
        {/* Voice Input Button */}
        <button
          type="button"
          onClick={handleVoiceToggle}
          className={`p-2.5 rounded-xl transition-all ${
            isRecording
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-amber-100/80 text-amber-900 hover:bg-amber-200'
          }`}
          title={isRecording ? 'Listening... click to stop' : 'Speak your sentence in any language'}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isRecording
              ? 'Listening to your voice... Speak now'
              : `Ask in any language: English, தமிழ், हिन्दी, తెలుగు, etc...`
          }
          disabled={isLoading}
          className="flex-1 bg-transparent px-2 text-stone-900 placeholder:text-stone-400 focus:outline-none text-sm font-medium"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 text-white font-semibold hover:from-amber-800 hover:to-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
