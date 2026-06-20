"use client";

import React from "react";
import { Home, Sparkles, Settings, HelpCircle, User } from "lucide-react";
import { theme } from "@/lib/theme";

interface BottomNavProps {
  user: any;
  isGeminiOpen: boolean;
  setIsGeminiOpen: (open: boolean) => void;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  setIsAccountOpen: (open: boolean) => void;
  setIsHelpOpen: (open: boolean) => void;
  activeRunningApp: any;
  setActiveRunningApp: (app: any) => void;
}

export default function BottomNav({
  user,
  isGeminiOpen,
  setIsGeminiOpen,
  isEditMode,
  setIsEditMode,
  setIsAccountOpen,
  setIsHelpOpen,
  activeRunningApp,
  setActiveRunningApp,
}: BottomNavProps) {
  // Determine if Home is active (not running app, not editing, not gemini sidebar open)
  const isHomeActive = !activeRunningApp && !isEditMode && !isGeminiOpen;

  const handleHomeClick = () => {
    setActiveRunningApp(null);
    setIsEditMode(false);
    setIsGeminiOpen(false);
  };

  const handleAiClick = () => {
    setIsGeminiOpen(!isGeminiOpen);
    setIsEditMode(false);
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
    setIsGeminiOpen(false);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-200/80 dark:border-zinc-800/80 px-4 py-2 flex justify-around items-center md:hidden pb-safe shadow-lg">
      {/* Home Tab */}
      <button
        onClick={handleHomeClick}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 ${theme.radiusSmall} transition-colors cursor-pointer ${
          isHomeActive
            ? `${theme.accentText} font-bold`
            : `${theme.textMuted} hover:${theme.textSecondary}`
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] tracking-wide">Home</span>
      </button>

      {/* AI Hub Tab */}
      <button
        onClick={handleAiClick}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 ${theme.radiusSmall} transition-colors cursor-pointer ${
          isGeminiOpen
            ? `${theme.accentText} font-bold`
            : `${theme.textMuted} hover:${theme.textSecondary}`
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px] tracking-wide">AI Hub</span>
      </button>

      {/* Edit Mode Tab */}
      <button
        onClick={handleEditClick}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 ${theme.radiusSmall} transition-colors cursor-pointer ${
          isEditMode
            ? `${theme.accentText} font-bold`
            : `${theme.textMuted} hover:${theme.textSecondary}`
        }`}
      >
        <Settings className={`w-5 h-5 ${isEditMode ? "animate-spin text-rose-500" : ""}`} style={{ animationDuration: '4s' }} />
        <span className="text-[10px] tracking-wide">Edit</span>
      </button>

      {/* Help Guide Tab */}
      <button
        onClick={() => setIsHelpOpen(true)}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 ${theme.radiusSmall} ${theme.textMuted} hover:${theme.textSecondary} cursor-pointer`}
      >
        <HelpCircle className="w-5 h-5" />
        <span className="text-[10px] tracking-wide">Help</span>
      </button>

      {/* Profile/About Tab */}
      <button
        onClick={() => setIsAccountOpen(true)}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 ${theme.radiusSmall} ${theme.textMuted} hover:${theme.textSecondary} cursor-pointer`}
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Profile" className={`w-5 h-5 ${theme.radiusFull} border border-zinc-200 dark:border-zinc-800 object-cover`} />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="text-[10px] tracking-wide">Profile</span>
      </button>
    </nav>
  );
}
