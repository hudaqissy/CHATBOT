import React from 'react';
import { TopicId } from '../types';
import { TOPIC_PRESETS } from '../data/foodData';
import { playPop } from '../utils/audio';

interface TopicButtonsProps {
  activeTopic: TopicId | null;
  onSelectTopic: (topicId: TopicId) => void;
  disabled?: boolean;
}

export const TopicButtons: React.FC<TopicButtonsProps> = ({
  activeTopic,
  onSelectTopic,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-['Fredoka',sans-serif]">
          <span>🌟 Choose a Learning Topic:</span>
        </h2>
        <span className="text-xs text-slate-500 font-medium">Click any big button below!</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TOPIC_PRESETS.map((topic) => {
          const isActive = activeTopic === topic.id;
          return (
            <button
              key={topic.id}
              disabled={disabled}
              onClick={() => {
                playPop();
                onSelectTopic(topic.id);
              }}
              className={`group relative text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 shadow-sm active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed ${
                isActive
                  ? 'bg-gradient-to-br from-white to-amber-50/70 border-amber-400 ring-4 ring-amber-200/60 shadow-md scale-[1.02]'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Active check pill */}
              {isActive && (
                <span className="absolute -top-2 -right-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  Active
                </span>
              )}

              <div className="flex items-start gap-3">
                {/* Emoji Avatar */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-xs transition-transform group-hover:scale-110 bg-gradient-to-tr ${topic.color}`}
                >
                  <span className="drop-shadow-xs">{topic.emoji}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-['Fredoka',sans-serif] font-bold text-slate-800 text-base sm:text-lg leading-tight group-hover:text-rose-600 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
