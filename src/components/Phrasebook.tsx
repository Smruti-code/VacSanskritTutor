import React, { useState } from 'react';
import { COMMON_PHRASES, SanskritPhrase } from '../data/sanskritData.ts';
import { soundPlayer } from '../services/audio.ts';
import { Volume2, Sparkles, BookOpen, Search, Filter } from 'lucide-react';
import { UserLanguage } from '../types/index.ts';

interface PhrasebookProps {
  userLanguage: UserLanguage;
}

export const Phrasebook: React.FC<PhrasebookProps> = ({ userLanguage }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingPhrase, setPlayingPhrase] = useState<string | null>(null);

  const filtered = COMMON_PHRASES.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.devanagari.includes(searchQuery) ||
      p.iast.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tamil.includes(searchQuery) ||
      p.hindi.includes(searchQuery) ||
      p.telugu.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handlePlay = async (text: string) => {
    setPlayingPhrase(text);
    try {
      await soundPlayer.playSanskrit(text);
    } finally {
      setPlayingPhrase(null);
    }
  };

  const getLanguageTranslation = (p: SanskritPhrase) => {
    if (userLanguage.includes('Tamil')) return { label: 'தமிழ்', text: p.tamil };
    if (userLanguage.includes('Hindi')) return { label: 'हिन्दी', text: p.hindi };
    if (userLanguage.includes('Telugu')) return { label: 'తెలుగు', text: p.telugu };
    return { label: 'English', text: p.english };
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-amber-50 p-5 rounded-2xl border border-amber-700/50 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-display tracking-wide text-amber-100">
                Conversational Sanskrit Phrasebook (संभाषण-सूक्तिमाला)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-2xl">
              Authentic daily Sanskrit greetings, polite expressions, gender distinctions (भवान् vs भवती), and timeless wisdom with high-clarity audio.
            </p>
          </div>
          <div className="text-xs bg-amber-950/70 px-3 py-1.5 rounded-xl border border-amber-600/40 text-amber-300">
            Audio Powered by <strong>Vāc Audio Engine</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Expressions' },
            { id: 'greeting', label: 'Greetings (अभिवादनम्)' },
            { id: 'daily', label: 'Daily Life & Gender' },
            { id: 'polite', label: 'Polite Phrases' },
            { id: 'wisdom', label: 'Wisdom & Subhashitas' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold ${
                selectedCategory === cat.id
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-amber-200 focus:border-amber-600 focus:outline-none text-xs text-stone-900"
          />
        </div>
      </div>

      {/* Phrases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((phrase, idx) => {
          const trans = getLanguageTranslation(phrase);
          const isPlaying = playingPhrase === phrase.devanagari;

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-sanskrit text-2xl font-bold text-amber-950">
                    {phrase.devanagari}
                  </div>
                  <div className="font-mono text-xs text-amber-800 font-semibold mt-0.5">
                    {phrase.iast}
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium">
                    Syllables: <span className="font-mono text-stone-700">{phrase.syllables}</span>
                  </div>
                </div>

                <button
                  onClick={() => handlePlay(phrase.devanagari)}
                  className={`p-2.5 rounded-xl transition-all shadow-xs flex-shrink-0 ${
                    isPlaying
                      ? 'bg-amber-500 text-stone-950 animate-pulse'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                  }`}
                  title="Listen to Sanskrit pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Multilingual Translation */}
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-stone-800 space-y-1">
                <div>
                  <span className="font-bold text-amber-900">{trans.label}:</span>{' '}
                  <span className="font-medium text-stone-900">{trans.text}</span>
                </div>
                {trans.label !== 'English' && (
                  <div className="text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-600">English:</span> {phrase.english}
                  </div>
                )}
              </div>

              {/* Grammar Note */}
              <div className="text-xs text-stone-600 font-medium border-t border-amber-100 pt-2 flex items-start gap-1.5">
                <span className="font-bold text-amber-800 flex-shrink-0 font-sanskrit">व्याकरणम्:</span>
                <span>{phrase.grammarNote}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
