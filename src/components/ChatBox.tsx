import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, Mic, MicOff, Sparkles, HelpCircle, AlertCircle } from 'lucide-react';
import { ChatMessage as ChatMessageType, TopicId } from '../types';
import { ChatMessage } from './ChatMessage';
import { QUICK_QUESTIONS, TOPIC_PRESETS } from '../data/foodData';
import { playPop, playSend, playChime } from '../utils/audio';

interface ChatBoxProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  activeTopic: TopicId | null;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onSelectTopic: (topicId: TopicId) => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  isLoading,
  activeTopic,
  onSendMessage,
  onClearChat,
  onSelectTopic,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    playSend();
    onSendMessage(trimmed);
    setInputText('');
  };

  // Speech Recognition support (Web Speech API)
  const toggleSpeechRecognition = () => {
    playPop();
    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert("Speech recognition isn't supported in this browser. You can type your answer in the box! 😊");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (SpeechRecognitionClass as any)();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] sm:h-[700px] bg-white rounded-3xl border-2 border-slate-200/90 shadow-md overflow-hidden">
      {/* Top Banner / Topic Indicator */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-sky-50 via-pink-50 to-purple-50 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-slate-700 font-['Fredoka',sans-serif]">
            {activeTopic
              ? `Learning: ${TOPIC_PRESETS.find((t) => t.id === activeTopic)?.title}`
              : 'Chatting with Food Buddy 🍎'}
          </span>
        </div>

        <button
          onClick={() => {
            playPop();
            onClearChat();
          }}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 px-2.5 py-1 rounded-xl border border-slate-200 transition-colors shadow-2xs"
          title="Start a new chat"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 space-y-2 bg-gradient-to-b from-sky-50/30 to-purple-50/20">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 my-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-300 to-amber-200 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl shadow-inner animate-bounce">
                🍎
              </div>
            </div>
            <div className="bg-white border-2 border-emerald-100 rounded-3xl rounded-tl-sm px-4 py-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 font-['Fredoka',sans-serif]">
                  Food Buddy is thinking...
                </span>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Chips */}
      <div className="px-3 sm:px-4 py-2 bg-slate-50/90 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 font-['Fredoka',sans-serif] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Try asking:
          </span>
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                playPop();
                onSendMessage(q.query);
              }}
              disabled={isLoading}
              className="shrink-0 text-xs font-semibold px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 border border-indigo-200 rounded-full transition-all shadow-2xs hover:scale-102 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        {/* Speech Recognition Button */}
        <button
          type="button"
          onClick={toggleSpeechRecognition}
          className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all shadow-xs ${
            isListening
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
          }`}
          title={isListening ? 'Listening to your voice...' : 'Speak into microphone (English)'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Type your message here, Food Explorer... (e.g. 'I like apples!')"
            className="w-full bg-slate-50 border-2 border-slate-200 hover:border-indigo-300 focus:border-indigo-500 focus:bg-white rounded-2xl py-2.5 sm:py-3 pl-4 pr-10 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-hidden transition-all shadow-inner"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 sm:p-3 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-1.5"
          title="Send message to Food Buddy"
        >
          <Send className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-['Fredoka',sans-serif]">Send</span>
        </button>
      </form>
    </div>
  );
};
