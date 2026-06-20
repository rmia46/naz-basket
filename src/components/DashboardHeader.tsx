"use client";

import React from "react";
import { Settings, Sparkles, BookOpen, HelpCircle, LogOut } from "lucide-react";
import { theme } from "@/lib/theme";

interface DashboardHeaderProps {
  user: any;
  isEditMode: boolean;
  isGeminiOpen: boolean;
  setIsEditMode: (mode: boolean) => void;
  setIsGeminiOpen: (open: boolean) => void;
  setIsAboutOpen: (open: boolean) => void;
  setIsHelpOpen: (open: boolean) => void;
  setIsLogoutConfirmOpen: (open: boolean) => void;
}

export default function DashboardHeader({
  user,
  isEditMode,
  isGeminiOpen,
  setIsEditMode,
  setIsGeminiOpen,
  setIsAboutOpen,
  setIsHelpOpen,
  setIsLogoutConfirmOpen,
}: DashboardHeaderProps) {
  return (
    <header className="w-full max-w-6xl mx-auto px-4 pt-8 pb-4 shrink-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="Naz Basket Logo" className={`w-9 h-9 ${theme.radiusSmall} shadow-sm object-cover shrink-0`} />
            <h1 className="font-display font-normal text-3xl md:text-4xl flex items-center gap-2 pt-1.5">
              <span className={theme.textPrimary}>Naz</span>
              <span className={`bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>Basket</span>
            </h1>
            {isEditMode && (
              <span className={`text-xs bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 font-bold px-2 py-0.5 ${theme.radiusFull} uppercase tracking-wider animate-pulse font-sans`}>
                Edit Mode
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User Profile */}
          <div className={`flex items-center gap-2.5 bg-white dark:bg-zinc-900 border ${theme.radiusFull} border-zinc-200 dark:border-zinc-900 pl-2.5 pr-4 py-1.5 shadow-sm text-sm`}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className={`w-7 h-7 ${theme.radiusFull} shadow-inner`} />
            ) : (
              <div className={`w-7 h-7 ${theme.radiusFull} bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase`}>
                {user?.displayName?.charAt(0) || "U"}
              </div>
            )}
            <span className={`font-semibold max-w-[100px] truncate ${theme.textSecondary}`}>
              {user?.displayName || "User"}
            </span>
          </div>

          {/* Desktop-only Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Gemini Toggle */}
            <button
              onClick={() => setIsGeminiOpen(!isGeminiOpen)}
              className={`p-2.5 ${theme.radiusFull} transition-all active:scale-95 shadow-sm border border-zinc-200 dark:border-zinc-900 cursor-pointer ${
                isGeminiOpen
                  ? `${theme.accentBg} text-white border-transparent`
                  : `bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${theme.textMuted} ${theme.headerBtnHover}`
              }`}
              title="AI Companion"
            >
              <Sparkles className="w-5 h-5" />
            </button>

            {/* About Page Link */}
            <button
              onClick={() => setIsAboutOpen(true)}
              className={`p-2.5 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${theme.textMuted} border border-zinc-200 dark:border-zinc-900 ${theme.radiusFull} transition-all active:scale-95 shadow-sm cursor-pointer ${theme.headerBtnHover}`}
              title="About Naz Basket"
            >
              <BookOpen className="w-5 h-5" />
            </button>

            {/* Help Guide Popup Link */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className={`p-2.5 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${theme.textMuted} border border-zinc-200 dark:border-zinc-900 ${theme.radiusFull} transition-all active:scale-95 shadow-sm cursor-pointer ${theme.headerBtnHover}`}
              title="Help Guide"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Edit Mode Button */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`p-2.5 ${theme.radiusFull} transition-all active:scale-95 shadow-sm border border-zinc-200 dark:border-zinc-900 cursor-pointer ${
                isEditMode
                  ? "bg-rose-600 text-white border-transparent"
                  : `bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${theme.textMuted} ${theme.headerBtnHover}`
              }`}
              title={isEditMode ? "Done editing" : "Edit screen layout"}
            >
              <Settings className={`w-5 h-5 ${isEditMode ? "animate-spin" : ""}`} style={{ animationDuration: '3s' }} />
            </button>

            {/* Logout */}
            <button
              onClick={() => setIsLogoutConfirmOpen(true)}
              className={`p-2.5 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${theme.textMuted} border border-zinc-200 dark:border-zinc-900 ${theme.radiusFull} transition-all active:scale-95 shadow-sm cursor-pointer ${theme.headerBtnDangerHover}`}
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
