"use client";

import React from "react";
import { X, HelpCircle } from "lucide-react";
import { theme } from "@/lib/theme";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme.modalOverlayBg} px-4 py-8 animate-fade-in`}>
      <div className={`w-full max-w-2xl ${theme.modalBg} ${theme.radiusLarge} overflow-hidden ${theme.modalBorder} shadow-2xl flex flex-col max-h-[85vh]`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b ${theme.inputBorder} flex items-center justify-between ${theme.modalHeaderBg} shrink-0`}>
          <div className="flex items-center gap-2">
            <span className="font-display font-normal text-xl select-none flex items-center gap-1.5 pt-0.5">
              <span className={theme.textPrimary}>Naz</span>
              <span className={`bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>Basket</span>
            </span>
            <span className={`text-xs ${theme.accentBadge} font-bold px-2 py-0.5 ${theme.radiusFull} uppercase tracking-wider font-sans ml-1`}>
              Help Guide
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 ${theme.radiusFull} text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-100 transition-colors cursor-pointer`}
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-sm text-zinc-650 dark:text-zinc-300">
          <h3 className={`text-lg font-extrabold ${theme.textPrimary} border-b ${theme.inputBorder} pb-2`}>
            How to Use Naz Basket
          </h3>
          
          <div className="space-y-6">
            
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className={`w-8 h-8 ${theme.radiusFull} ${theme.accentBadge} font-extrabold flex items-center justify-center shrink-0`}>
                1
              </div>
              <div className="space-y-1">
                <h4 className={`font-bold ${theme.textPrimary}`}>Create or Import Apps</h4>
                <p className={`text-xs ${theme.textMuted} leading-relaxed`}>
                  Click the <span className={`font-bold ${theme.textSecondary}`}>Add App</span> card (with the plus sign) on your dashboard. You can select either <span className={`font-semibold ${theme.textPrimary}`}>HTML File</span> (imports HTML widgets and extracts titles), <span className={`font-semibold ${theme.textPrimary}`}>Raw HTML Code</span> (paste single-file widgets directly), or <span className={`font-semibold ${theme.textPrimary}`}>Web Link URL</span>.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className={`w-8 h-8 ${theme.radiusFull} ${theme.accentBadge} font-extrabold flex items-center justify-center shrink-0`}>
                2
              </div>
              <div className="space-y-1">
                <h4 className={`font-bold ${theme.textPrimary}`}>Manage & Organize Your Workspace</h4>
                <p className={`text-xs ${theme.textMuted} leading-relaxed`}>
                  Use categories like Utilities, Games, Dev Tools, or Media to organize your home screen. Pin items to your <span className={`font-semibold ${theme.textPrimary}`}>Favorites</span> panel, or search them instantly using the top global search bar.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className={`w-8 h-8 ${theme.radiusFull} ${theme.accentBadge} font-extrabold flex items-center justify-center shrink-0`}>
                3
              </div>
              <div className="space-y-1">
                <h4 className={`font-bold ${theme.textPrimary}`}>Edit & Delete Apps</h4>
                <p className={`text-xs ${theme.textMuted} leading-relaxed`}>
                  Click the <span className={`font-bold ${theme.textSecondary}`}>Settings Gear</span> icon in the top header to enter Edit Mode. Icons will start wiggling. You can delete widgets by clicking the delete marker on the icon. Click the gear again to exit.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className={`w-8 h-8 ${theme.radiusFull} ${theme.accentBadge} font-extrabold flex items-center justify-center shrink-0`}>
                4
              </div>
              <div className="space-y-1">
                <h4 className={`font-bold ${theme.textPrimary}`}>Construct Coding with AI Hub</h4>
                <p className={`text-xs ${theme.textMuted} leading-relaxed`}>
                  Need custom widget scripts? Click the <span className={`font-bold ${theme.textSecondary}`}>Sparkles</span> icon to open the AI Companion panel. Copy pre-built HTML prompts, launch Gemini or DeepSeek in a new tab, and generate clean single-file HTML scripts to paste inside Naz Basket.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className={`w-8 h-8 ${theme.radiusFull} ${theme.accentBadge} font-extrabold flex items-center justify-center shrink-0`}>
                5
              </div>
              <div className="space-y-1">
                <h4 className={`font-bold ${theme.textPrimary}`}>Automatic Device Sync</h4>
                <p className={`text-xs ${theme.textMuted} leading-relaxed`}>
                  Sign in with Google to sync your settings, directories, and custom widgets to the cloud. They sync in real-time across desktop and mobile devices.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${theme.inputBorder} ${theme.modalFooterBg} flex justify-end shrink-0`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 ${theme.radiusSmall} text-xs font-bold ${theme.btnPrimary} cursor-pointer animate-none`}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
