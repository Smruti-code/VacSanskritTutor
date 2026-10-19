/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LearnerLevel, UserLanguage } from './types/index.ts';
import { Header } from './components/Header.tsx';
import { TutorChat } from './components/TutorChat.tsx';
import { TranslatorView } from './components/TranslatorView.tsx';
import { GrammarClinic } from './components/GrammarClinic.tsx';
import { PronunciationLab } from './components/PronunciationLab.tsx';
import { GenderVibhaktiPlayground } from './components/GenderVibhaktiPlayground.tsx';
import { Phrasebook } from './components/Phrasebook.tsx';

export default function App() {
  const [userLanguage, setUserLanguage] = useState<UserLanguage>('auto');
  const [level, setLevel] = useState<LearnerLevel>('beginner');
  const [activeTab, setActiveTab] = useState<string>('chat');

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      {/* Top App Header */}
      <Header
        userLanguage={userLanguage}
        setUserLanguage={setUserLanguage}
        level={level}
        setLevel={setLevel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-10">
        {activeTab === 'chat' && (
          <TutorChat
            userLanguage={userLanguage}
            level={level}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'translator' && (
          <TranslatorView userLanguage={userLanguage} level={level} />
        )}

        {activeTab === 'grammar' && (
          <GrammarClinic userLanguage={userLanguage} level={level} />
        )}

        {activeTab === 'pronunciation' && (
          <PronunciationLab userLanguage={userLanguage} level={level} />
        )}

        {activeTab === 'gender' && (
          <GenderVibhaktiPlayground />
        )}

        {activeTab === 'phrasebook' && (
          <Phrasebook userLanguage={userLanguage} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/70 bg-amber-50/70 py-4 text-center text-xs text-stone-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="font-sanskrit text-amber-900 font-bold text-sm">वाक्</span>
            <span>– AI Sanskrit Tutor, Translator, Grammar Doctor & Pronunciation Coach</span>
          </div>
          <div className="text-[11px] text-stone-500">
            Powered by Gemini AI • Multilingual Pedagogy • Classical Paninian Accuracy
          </div>
        </div>
      </footer>
    </div>
  );
}
