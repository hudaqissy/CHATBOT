import React, { useState } from 'react';
import { X, Volume2, MessageSquare, Sparkles, BookOpen } from 'lucide-react';
import { FoodItem } from '../types';
import { FOOD_ITEMS, SENTENCE_STARTERS } from '../data/foodData';
import { speakText, playPop } from '../utils/audio';

interface WordBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutFood: (question: string) => void;
}

export const WordBankModal: React.FC<WordBankModalProps> = ({
  isOpen,
  onClose,
  onAskAboutFood,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Foods 🌈' },
    { id: 'fruits', label: 'Fruits 🍎' },
    { id: 'vegetables', label: 'Vegetables 🥦' },
    { id: 'grains', label: 'Grains 🍚' },
    { id: 'protein', label: 'Protein 🍗' },
    { id: 'drinks', label: 'Drinks 🥛' },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? FOOD_ITEMS
      : FOOD_ITEMS.filter((item) => item.category === selectedCategory);

  const handlePronounce = (id: string, text: string) => {
    playPop();
    setActiveSpeechId(id);
    speakText(text, () => setActiveSpeechId(null));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border-4 border-amber-200 shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shadow-xs">
              📚
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 font-['Fredoka',sans-serif]">
                Food Picture Word Bank
              </h2>
              <p className="text-xs text-slate-500">
                Click on the speaker 🔊 to hear the word, or ask Food Buddy!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playPop();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="py-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playPop();
                setSelectedCategory(cat.id);
              }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-all active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Food Items Cards Grid */}
        <div className="flex-1 overflow-y-auto py-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-b from-white to-amber-50/30 rounded-2xl border-2 border-slate-200 p-3.5 hover:border-amber-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{item.emoji}</span>
                    <button
                      onClick={() => handlePronounce(item.id, item.name)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                        activeSpeechId === item.id
                          ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200'
                      }`}
                      title="Listen to pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Hear</span>
                    </button>
                  </div>

                  <h3 className="font-['Fredoka',sans-serif] font-bold text-base text-slate-800 mt-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    {item.simpleMeaning}
                  </p>
                  <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 rounded-lg p-1.5 font-medium border border-emerald-100">
                    💡 {item.healthyBenefit}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                  <span className="text-[11px] italic text-slate-500 truncate">
                    "{item.exampleSentence}"
                  </span>
                  <button
                    onClick={() => {
                      playPop();
                      onAskAboutFood(`What can you tell me about ${item.name}? ${item.emoji}`);
                      onClose();
                    }}
                    className="shrink-0 p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1 border border-indigo-200 transition-colors"
                    title="Ask Food Buddy about this"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Ask</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sentence Starters Practice Area */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 border-2 border-purple-200">
            <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-2 font-['Fredoka',sans-serif] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Practice Year 4 Sentence Patterns:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SENTENCE_STARTERS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    playPop();
                    onAskAboutFood(s.example);
                    onClose();
                  }}
                  className="cursor-pointer bg-white p-2.5 rounded-xl border border-purple-100 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-xs shadow-2xs group"
                >
                  <p className="font-bold text-purple-700 group-hover:text-purple-900">
                    {s.pattern}
                  </p>
                  <p className="text-slate-500 italic mt-0.5">{s.example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              playPop();
              onClose();
            }}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Close Word Bank
          </button>
        </div>
      </div>
    </div>
  );
};
