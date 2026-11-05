import React, { useState } from 'react';
import { X, Check, Sparkles, Utensils, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LunchTrayState } from '../types';
import { playPop, playCelebration } from '../utils/audio';

interface HealthyLunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLunch: (description: string) => void;
}

export const HealthyLunchModal: React.FC<HealthyLunchModalProps> = ({
  isOpen,
  onClose,
  onSubmitLunch,
}) => {
  const [tray, setTray] = useState<LunchTrayState>({
    grains: 'Rice 🍚',
    protein: 'Grilled Fish 🐟',
    veggie: 'Broccoli 🥦',
    fruit: 'Banana 🍌',
    drink: 'Clean Water 💧',
  });

  if (!isOpen) return null;

  const grainsOptions = ['Rice 🍚', 'Bread 🍞', 'Noodles 🍜'];
  const proteinOptions = ['Grilled Fish 🐟', 'Chicken 🍗', 'Boiled Egg 🥚', 'Beans 🫘'];
  const veggieOptions = ['Broccoli 🥦', 'Carrot 🥕', 'Spinach 🥬', 'Cucumber 🥒'];
  const fruitOptions = ['Apple 🍎', 'Banana 🍌', 'Watermelon 🍉', 'Orange 🍊'];
  const drinkOptions = ['Clean Water 💧', 'Fresh Milk 🥛', 'Fruit Juice 🧃'];

  const handleSelect = (category: keyof LunchTrayState, item: string) => {
    playPop();
    setTray((prev) => ({ ...prev, [category]: item }));
  };

  const handleReset = () => {
    playPop();
    setTray({
      grains: null,
      protein: null,
      veggie: null,
      fruit: null,
      drink: null,
    });
  };

  const handleSendToBuddy = () => {
    playCelebration();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const items = [
      tray.grains,
      tray.protein,
      tray.veggie,
      tray.fruit,
      tray.drink,
    ].filter(Boolean);

    const message = `Food Buddy, look at my healthy lunch tray! 🍱 I chose: ${items.join(
      ', '
    )}. Is my lunch healthy for school?`;

    onSubmitLunch(message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-emerald-200 shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl shadow-xs">
              🍱
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 font-['Fredoka',sans-serif]">
                Build My Healthy Lunch Tray!
              </h2>
              <p className="text-xs text-slate-500">
                Quarter Grains • Quarter Protein • Half Fruits & Veggies ("Suku-Suku Separuh")
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

        {/* Scrollable Food Selection Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Visual Tray Preview */}
          <div className="bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 rounded-2xl p-4 border-2 border-emerald-200">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-2 flex items-center justify-between font-['Fredoka',sans-serif]">
              <span>🍱 Your School Lunch Plate:</span>
              <button
                onClick={handleReset}
                className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset Plate
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-xs">
                <span className="text-[10px] font-bold text-amber-700 block uppercase">1/4 Grains</span>
                <span className="text-sm font-bold text-slate-800 block mt-1">
                  {tray.grains || <span className="text-slate-400 italic">None</span>}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-rose-200 shadow-xs">
                <span className="text-[10px] font-bold text-rose-700 block uppercase">1/4 Protein</span>
                <span className="text-sm font-bold text-slate-800 block mt-1">
                  {tray.protein || <span className="text-slate-400 italic">None</span>}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-xs">
                <span className="text-[10px] font-bold text-emerald-700 block uppercase">Vegetable</span>
                <span className="text-sm font-bold text-slate-800 block mt-1">
                  {tray.veggie || <span className="text-slate-400 italic">None</span>}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-pink-200 shadow-xs">
                <span className="text-[10px] font-bold text-pink-700 block uppercase">Fruit</span>
                <span className="text-sm font-bold text-slate-800 block mt-1">
                  {tray.fruit || <span className="text-slate-400 italic">None</span>}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-white p-2.5 rounded-xl border border-sky-200 shadow-xs">
                <span className="text-[10px] font-bold text-sky-700 block uppercase">Drink</span>
                <span className="text-sm font-bold text-slate-800 block mt-1">
                  {tray.drink || <span className="text-slate-400 italic">None</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Option Picker Groups */}
          {/* Grains */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 font-['Fredoka',sans-serif]">
              1. Choose Grains (Energy for studying):
            </label>
            <div className="flex flex-wrap gap-2">
              {grainsOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSelect('grains', item)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all active:scale-95 ${
                    tray.grains === item
                      ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Protein */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 font-['Fredoka',sans-serif]">
              2. Choose Protein (Strong muscles):
            </label>
            <div className="flex flex-wrap gap-2">
              {proteinOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSelect('protein', item)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all active:scale-95 ${
                    tray.protein === item
                      ? 'bg-rose-400 border-rose-500 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Veggies */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 font-['Fredoka',sans-serif]">
              3. Choose Vegetables (Vitamins & good tummy):
            </label>
            <div className="flex flex-wrap gap-2">
              {veggieOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSelect('veggie', item)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all active:scale-95 ${
                    tray.veggie === item
                      ? 'bg-emerald-400 border-emerald-500 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Fruits */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 font-['Fredoka',sans-serif]">
              4. Choose Fruit (Sweet & juicy):
            </label>
            <div className="flex flex-wrap gap-2">
              {fruitOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSelect('fruit', item)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all active:scale-95 ${
                    tray.fruit === item
                      ? 'bg-pink-400 border-pink-500 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Drinks */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 font-['Fredoka',sans-serif]">
              5. Choose a Drink (Hydration):
            </label>
            <div className="flex flex-wrap gap-2">
              {drinkOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSelect('drink', item)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all active:scale-95 ${
                    tray.drink === item
                      ? 'bg-sky-400 border-sky-500 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              playPop();
              onClose();
            }}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSendToBuddy}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-bold rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Show Food Buddy My Lunch! 🍱</span>
          </button>
        </div>
      </div>
    </div>
  );
};
