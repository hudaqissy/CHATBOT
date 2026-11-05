import React, { useState } from 'react';
import { X, Copy, Check, Globe, ExternalLink, HelpCircle, Laptop } from 'lucide-react';
import { playPop } from '../utils/audio';

interface GoogleSitesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSitesModal: React.FC<GoogleSitesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  if (!isOpen) return null;

  // Compute public HTTPS URL dynamically from window or fallback
  const currentUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://ais-pre-5mo56c6cqqgxrhs6hn2mzx-675572213500.asia-east1.run.app';

  const iframeSnippet = `<iframe
  src="${currentUrl}"
  width="100%"
  height="750px"
  frameborder="0"
  allow="microphone"
  title="Food Buddy - Let's Learn About Food!"
  style="border-radius: 18px; border: 2px solid #e2e8f0; box-shadow: 0 8px 30px rgba(0,0,0,0.08);"
></iframe>`;

  const handleCopyLink = () => {
    playPop();
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyIframe = () => {
    playPop();
    navigator.clipboard.writeText(iframeSnippet);
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-indigo-200 shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl shadow-xs">
              🌐
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 font-['Fredoka',sans-serif]">
                Embed in Google Sites
              </h2>
              <p className="text-xs text-slate-500">
                Add Food Buddy into *The Food Future Lab* digital learning portal
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Public HTTPS Link Box */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block mb-1 font-['Fredoka',sans-serif]">
              🔗 Public HTTPS Applet Link:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 focus:outline-hidden"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 flex items-center gap-1 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Iframe Code Box */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400 font-['Fredoka',sans-serif]">
                📋 Copy-Paste Iframe HTML Embed Code:
              </span>
              <button
                onClick={handleCopyIframe}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
              >
                {copiedIframe ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIframe ? 'Copied Code!' : 'Copy Embed Code'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono overflow-x-auto text-emerald-400 p-2 bg-slate-950 rounded-lg">
              {iframeSnippet}
            </pre>
          </div>

          {/* 4-Step Instructions */}
          <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200">
            <h3 className="text-sm font-bold text-indigo-900 font-['Fredoka',sans-serif] mb-2.5 flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-indigo-600" />
              Easy 4-Step Guide for Teachers:
            </h3>

            <ol className="text-xs text-slate-700 space-y-2 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  1
                </span>
                <span>
                  Open your <strong>Google Sites</strong> project (e.g., <em>The Food Future Lab</em>) in Google Chrome.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  2
                </span>
                <span>
                  On the right panel, click <strong>Insert</strong>, then click <strong>Embed</strong> (<code>&lt;&gt;</code> icon).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  3
                </span>
                <span>
                  Click the <strong>Embed code</strong> tab, paste the iframe code from above, and click <strong>Next</strong> &gt; <strong>Insert</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  4
                </span>
                <span>
                  Drag the corner handles to adjust the width and height, then click <strong>Publish</strong>. Pupils can now chat with Food Buddy directly on your Google Site! 🎉
                </span>
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              playPop();
              onClose();
            }}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
