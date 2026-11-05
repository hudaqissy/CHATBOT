import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TopicButtons } from './components/TopicButtons';
import { ChatBox } from './components/ChatBox';
import { WordBankModal } from './components/WordBankModal';
import { HealthyLunchModal } from './components/HealthyLunchModal';
import { GoogleSitesModal } from './components/GoogleSitesModal';
import { ChatMessage as ChatMessageType, TopicId } from './types';
import { TOPIC_PRESETS } from './data/foodData';
import {
  isSoundEnabled,
  setSoundEnabled,
  playChime,
  playPop,
} from './utils/audio';
import { Sparkles, Heart, Apple, BookOpen, Utensils } from 'lucide-react';

const INITIAL_WELCOME_MESSAGE: ChatMessageType = {
  id: 'welcome-1',
  role: 'model',
  text: "Hello, Food Explorer! 🍎 Welcome to Food Buddy! I am part of The Food Future Lab. Let's learn fun food words and practice speaking English together! What would you like to explore today? 😊",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([INITIAL_WELCOME_MESSAGE]);
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Modals state
  const [isWordBankOpen, setIsWordBankOpen] = useState(false);
  const [isLunchTrayOpen, setIsLunchTrayOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  const handleToggleSound = () => {
    setSoundOn((prev) => !prev);
  };

  const handleSendMessage = async (text: string, overrideTopic?: TopicId) => {
    const currentTopic = overrideTopic ?? activeTopic;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: timeStr,
      topic: currentTopic || undefined,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Build conversation history from prior messages (excluding current user message being sent)
      const historyPayload = messages
        .slice(-8)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          topic: currentTopic,
        }),
      });

      const data = await res.json().catch(() => null);
      const botReply =
        data?.reply ||
        "Good try, Food Explorer! 🌟 Let's learn more about healthy food! What is your favourite fruit? 🍎";

      playChime();

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          topic: currentTopic || undefined,
        },
      ]);
    } catch (err) {
      console.error('Failed to get chat response:', err);
      // Friendly in-character fallback message for elementary school pupils
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'model',
          text: "Oops! Food Buddy took a quick sip of water 💧. Can you try saying that again, Food Explorer? 😊",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTopic = (topicId: TopicId) => {
    setActiveTopic(topicId);
    const preset = TOPIC_PRESETS.find((t) => t.id === topicId);
    if (!preset) return;

    // Immediately trigger a friendly, encouraging starter conversation for this topic
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: `topic-prompt-${Date.now()}`,
        role: 'model',
        text: preset.buddyGreeting,
        timestamp: timeStr,
        topic: topicId,
      },
    ]);
    playChime();
  };

  const handleClearChat = () => {
    setActiveTopic(null);
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/70 via-pink-50/40 to-purple-50/50 flex flex-col selection:bg-pink-200">
      {/* Navigation Header */}
      <Header
        soundEnabled={soundOn}
        onToggleSound={handleToggleSound}
        onOpenWordBank={() => setIsWordBankOpen(true)}
        onOpenLunchTray={() => setIsLunchTrayOpen(true)}
        onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
      />

      {/* Main Educational Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 sm:py-6 flex flex-col gap-5">
        {/* Topic Buttons Section (Requirement 7: Four large, colourful buttons) */}
        <section className="bg-white/80 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border-2 border-slate-200/80 shadow-xs">
          <TopicButtons
            activeTopic={activeTopic}
            onSelectTopic={handleSelectTopic}
            disabled={isLoading}
          />
        </section>

        {/* Chatbot Interface (Requirement 7 & 8) */}
        <section className="flex-1">
          <ChatBox
            messages={messages}
            isLoading={isLoading}
            activeTopic={activeTopic}
            onSendMessage={(text) => handleSendMessage(text)}
            onClearChat={handleClearChat}
            onSelectTopic={handleSelectTopic}
          />
        </section>

        {/* Interactive Helper Cards for Year 4 ESL */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => {
              playPop();
              setIsWordBankOpen(true);
            }}
            className="cursor-pointer bg-amber-50 hover:bg-amber-100/90 border-2 border-amber-200 rounded-2xl p-3.5 transition-all shadow-xs flex items-center gap-3 group active:scale-98"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              🍎
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 font-['Fredoka',sans-serif]">
                Food Picture Bank
              </h4>
              <p className="text-xs text-amber-700">See 20+ food words & hear English pronunciation!</p>
            </div>
          </div>

          <div
            onClick={() => {
              playPop();
              setIsLunchTrayOpen(true);
            }}
            className="cursor-pointer bg-emerald-50 hover:bg-emerald-100/90 border-2 border-emerald-200 rounded-2xl p-3.5 transition-all shadow-xs flex items-center gap-3 group active:scale-98"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              🍱
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900 font-['Fredoka',sans-serif]">
                My Lunch Tray Builder
              </h4>
              <p className="text-xs text-emerald-700">Pack "Suku-Suku Separuh" & show Food Buddy!</p>
            </div>
          </div>

          <div
            onClick={() => {
              playPop();
              setIsEmbedModalOpen(true);
            }}
            className="cursor-pointer bg-indigo-50 hover:bg-indigo-100/90 border-2 border-indigo-200 rounded-2xl p-3.5 transition-all shadow-xs flex items-center gap-3 group active:scale-98"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-200 text-indigo-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              🌐
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-900 font-['Fredoka',sans-serif]">
                Google Sites Ready
              </h4>
              <p className="text-xs text-indigo-700">Get HTTPS embed code for The Food Future Lab</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white/70 border-t border-slate-200 py-4 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <span>🥗 Part of <strong>The Food Future Lab</strong> Digital Learning Object (DLO)</span>
          </p>
          <p className="text-slate-400">
            Malaysian Year 4 Primary School ESL • Powered by Gemini AI
          </p>
        </div>
      </footer>

      {/* Modals */}
      <WordBankModal
        isOpen={isWordBankOpen}
        onClose={() => setIsWordBankOpen(false)}
        onAskAboutFood={(q) => handleSendMessage(q, 'words')}
      />

      <HealthyLunchModal
        isOpen={isLunchTrayOpen}
        onClose={() => setIsLunchTrayOpen(false)}
        onSubmitLunch={(msg) => handleSendMessage(msg, 'lunch')}
      />

      <GoogleSitesModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
      />
    </div>
  );
}
