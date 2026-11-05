import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';
import { speakText, stopSpeaking, playPop } from '../utils/audio';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBuddy = message.role === 'model';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(message.text, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleCopy = () => {
    playPop();
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-start gap-2.5 sm:gap-3.5 my-3.5 transition-opacity duration-300 ${
        isBuddy ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Food Buddy Avatar */}
      {isBuddy && (
        <div className="shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-pink-300 via-rose-300 to-amber-200 p-0.5 shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl sm:text-2xl shadow-inner animate-pulse">
              🍎
            </div>
          </div>
          <span className="block text-[10px] text-center font-bold text-slate-500 mt-0.5">
            Buddy
          </span>
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isBuddy ? 'items-start' : 'items-end'}`}>
        {/* Name Header */}
        <div className="flex items-center gap-1.5 mb-1 px-1">
          <span className="text-xs font-bold text-slate-600 font-['Fredoka',sans-serif]">
            {isBuddy ? 'Food Buddy' : 'You (Food Explorer)'}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {message.timestamp}
          </span>
        </div>

        {/* Bubble */}
        <div
          className={`relative px-4 py-3 sm:px-5 sm:py-3.5 rounded-3xl text-sm sm:text-base leading-relaxed shadow-sm transition-all ${
            isBuddy
              ? 'bg-white border-2 border-emerald-100 text-slate-800 rounded-tl-sm'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tr-sm shadow-indigo-100'
          }`}
        >
          {/* Text Content */}
          <p className="whitespace-pre-wrap font-medium">{message.text}</p>

          {/* Action Row for Buddy Messages (Pronunciation listen button & copy) */}
          {isBuddy && (
            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={handleSpeak}
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                  isSpeaking
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
                title="Listen to Food Buddy speak English"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen 🔊</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 text-xs transition-colors"
                title="Copy message"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pupil Avatar */}
      {!isBuddy && (
        <div className="shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-400 to-purple-400 p-0.5 shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl sm:text-2xl shadow-inner">
              🧒
            </div>
          </div>
          <span className="block text-[10px] text-center font-bold text-indigo-600 mt-0.5">
            You
          </span>
        </div>
      )}
    </div>
  );
};
