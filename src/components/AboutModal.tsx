"use client";

import React from "react";
import { X, BookOpen } from "lucide-react";
import { theme } from "@/lib/theme";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutConfirm?: () => void;
}

export default function AboutModal({ isOpen, onClose, onLogoutConfirm }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme.modalOverlayBg} px-4 py-8 animate-fade-in`}>
      <div className={`w-full max-w-lg ${theme.modalBg} ${theme.radiusLarge} overflow-hidden ${theme.modalBorder} shadow-2xl flex flex-col`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b ${theme.inputBorder} flex items-center justify-between ${theme.modalHeaderBg}`}>
          <div className="flex items-center gap-2">
            <BookOpen className={`w-5 h-5 ${theme.accentText}`} />
            <span className={`text-xs ${theme.accentBadge} font-bold px-2 py-0.5 ${theme.radiusFull} uppercase tracking-wider font-sans`}>
              About Naz Basket
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
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${theme.brandGradient} p-0.5 shadow-md shrink-0`}>
              <div className={`w-full h-full bg-white dark:bg-zinc-950 rounded-2xl flex items-center justify-center overflow-hidden`}>
                <img src="/logo.jpg" alt="Naz Basket Logo" className="w-[85%] h-[85%] object-cover rounded-xl" />
              </div>
            </div>
            <div className="space-y-0.5">
              <h3 className={`text-2xl font-black tracking-tight ${theme.textPrimary} flex justify-start items-center gap-x-2`}>
                <span>About</span>
                <span className="font-display font-normal text-3xl flex items-center gap-2">
                  <span className={theme.textPrimary}>Naz</span>
                  <span className={`bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>Basket</span>
                </span>
              </h3>
              <p className={`text-xs ${theme.textMuted} font-medium`}>
                Personal Single-File HTML Application Hub & Runner
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className={`font-extrabold text-sm ${theme.textPrimary} border-b ${theme.inputBorder} pb-1.5`}>
              Overview
            </h4>
            <p className={`text-xs md:text-sm ${theme.textSecondary} leading-relaxed`}>
              Naz Basket is a lightweight, cloud-synced home screen designed to host, run, and organize custom single-file HTML applications, widgets, and external URLs. Inspired by modern dashboard and hub designs, it provides fully responsive app grids, folders, search, categories, and wiggle animation edit controls. All applications run in sandboxed iframes, keeping your custom code isolated and safe.
            </p>
          </div>

          {/* Grid: Author & Repo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Author Card */}
            <div className={`bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl p-4 flex items-start gap-3`}>
              <div className={`p-2.5 ${theme.accentBadgeBg} ${theme.accentText} rounded-lg`}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <span className={`text-[10px] font-bold ${theme.textMutedLight} uppercase tracking-wider block`}>Author</span>
                <span className={`font-extrabold text-sm ${theme.textPrimary} block`}>Roman Mia</span>
                <p className={`text-[11px] ${theme.textMuted} font-medium`}>Project Architect & Developer</p>
              </div>
            </div>

            {/* Source Code Card */}
            <div className={`bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl p-4 flex items-start gap-3`}>
              <div className={`p-2.5 bg-cyan-50 dark:bg-cyan-950/40 ${theme.brandTextMuted} rounded-lg`}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div className="space-y-0.5 block min-w-0 flex-1">
                <span className={`text-[10px] font-bold ${theme.textMutedLight} uppercase tracking-wider block`}>Source Code</span>
                <a
                  href="https://github.com/rmia46/naz-basket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-extrabold text-sm ${theme.accentText} ${theme.accentTextHover} block truncate`}
                >
                  GitHub Repository
                </a>
                <span className={`text-[10px] font-mono ${theme.textMuted} block truncate`} title="git@github.com:rmia46/naz-basket.git">
                  rmia46/naz-basket
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${theme.inputBorder} ${theme.modalFooterBg} flex justify-between items-center`}>
          {onLogoutConfirm ? (
            <button
              onClick={() => {
                onClose();
                onLogoutConfirm();
              }}
              className={`px-4 py-2 ${theme.radiusSmall} text-xs font-bold ${theme.btnDanger} cursor-pointer`}
            >
              Sign Out
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className={`px-4 py-2 ${theme.radiusSmall} text-xs font-bold ${theme.btnPrimary} cursor-pointer`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
