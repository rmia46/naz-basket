"use client";

import React, { useState } from "react";
import { Sparkles, X, ExternalLink, Copy, Check } from "lucide-react";
import { theme } from "@/lib/theme";

interface AiCompanionHubProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icons for the AI platforms
const GeminiIcon = () => (
  <svg className="w-5 h-5 text-purple-500 dark:text-purple-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a1 1 0 0 1 1 1c0 4.97 4.03 9 9 9a1 1 0 0 1 0 2c-4.97 0-9 4.03-9 9a1 1 0 0 1-2 0c0-4.97-4.03-9-9-9a1 1 0 0 1 0-2c4.97 0 9-4.03 9-9a1 1 0 0 1 1-1Z" />
  </svg>
);

const DeepSeekIcon = () => (
  <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-2-14.5a2.5 2.5 0 1 1 4 2.05v3.45a2.5 2.5 0 1 1-4 0V9.55Z" />
  </svg>
);

const ClaudeIcon = () => (
  <svg className="w-5 h-5 text-amber-600 dark:text-amber-500" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-3 0v-3A1.5 1.5 0 0 1 12 2zm0 14a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-3 0v-3A1.5 1.5 0 0 1 12 16zm-7-4a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 0 3h-3A1.5 1.5 0 0 1 5 12zm11 0a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 1-1.5-1.5zm-8.879-4.879a1.5 1.5 0 0 1 2.122 0l2.121 2.121a1.5 1.5 0 0 1-2.121 2.121L7.121 9.243a1.5 1.5 0 0 1 0-2.122zm7.778 7.778a1.5 1.5 0 0 1 2.122 0l2.121 2.121a1.5 1.5 0 0 1-2.121 2.122l-2.121-2.122a1.5 1.5 0 0 1 0-2.121z" />
  </svg>
);

const GrokIcon = () => (
  <svg className="w-5 h-5 text-zinc-900 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M4 20L20 4M9 20h11M4 4h11" />
  </svg>
);

const THEME_ALIGNMENT_PROMPT = `Please design the HTML widget to match the Naz Basket visual system:
- Font: Use "Plus Jakarta Sans" for primary UI and "JetBrains Mono" for numbers/code. Include them from Google Fonts.
- Styling Framework: Tailwind CSS CDN is supported (<script src="https://cdn.tailwindcss.com"></script>).
- Theme colors: A premium dark mode. Page background should be zinc-950 (#09090b), panels/container cards should be zinc-900 (#18181b), and thin borders should be zinc-800 (#27272a).
- Accent highlights: Electric teal/cyan gradient (from-cyan-500 to-teal-500). Buttons and icons should use teal accent text/badges (text-teal-400, bg-teal-950/40) or solid teal background (bg-teal-600, hover:bg-teal-700).
- Borders & Corners: Cards should use rounded-2xl or rounded-xl corners. Inputs and buttons should use rounded-lg corners.
- Feel: Sleek, flat, minimal layout with glassmorphic dropdowns/nav elements (backdrop-blur-md) and micro-interactions. Return ONLY raw HTML code.`;

const PROMPTS = [
  {
    id: 1,
    title: "Minimalist Pomodoro Timer",
    description: "A beautiful Pomodoro timer with custom controls, clean dark theme, and sound alerts.",
    text: "Write a complete single-file HTML page with CSS and JavaScript containing a minimalist Pomodoro Timer. Use a premium dark mode aesthetic (zinc/slate color palette), circular progress ring, settings to customize Pomodoro/short break/long break lengths, sound alert support using standard Web Audio API (so no external asset links are needed), and clean responsive styles. Do not include markdown blocks, just return clean HTML."
  },
  {
    id: 2,
    title: "Sticky Notes Board",
    description: "An interactive board to create, color-code, and delete sticky note widgets.",
    text: "Create a complete single-file HTML/CSS/JS app that serves as a Sticky Notes Board. Users should be able to create new notes, choose their background colors (pastel shades), edit text in-place, and drag them around or delete them. Save notes to localStorage so they persist. Ensure it has a gorgeous flat layout and looks premium. Just return raw HTML."
  },
  {
    id: 3,
    title: "Rich Markdown Editor",
    description: "A side-by-side markdown editor and renderer using lightweight libraries.",
    text: "Build a single-file HTML app that functions as a Markdown Editor. It should have a split-pane layout: a textarea on the left to write markdown, and a formatted preview on the right. Include standard markdown formatting shortcuts (bold, italic, header, list). Use Tailwind CSS via CDN for styling and a simple parser or pure JS renderer to convert it to HTML. Keep the UI extremely clean, minimal, and responsive. Just raw HTML code."
  },
  {
    id: 4,
    title: "Interactive Calculator",
    description: "A fully functional calculator with a sleek dashboard design.",
    text: "Design a complete single-file HTML calculator app. It should feature a gorgeous, tactile layout resembling premium hardware (modern flat grid, clean fonts), support basic operations, decimal numbers, backspace, and percentage. Animate button presses with subtle micro-scale feedback. Just return the clean HTML file."
  },
  {
    id: 5,
    title: "Habit Tracker Grid",
    description: "A clean calendar layout to log and visualize habits.",
    text: "Create a complete single-file HTML habit tracker. Users can define habits, and check off bubbles for each day of the week. Display a progress bar for completion rates. Persist checking state via localStorage. Style it with a beautiful, clean layout using a vibrant color palette (indigo/emerald gradients). Just output the raw HTML."
  }
];

export default function AiCompanionHub({ isOpen, onClose }: AiCompanionHubProps) {
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);

  const handleCopyPrompt = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 sm:w-[480px] ${theme.modalBg} border-l ${theme.inputBorder} shadow-2xl transition-transform duration-300 ease-in-out z-45 flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Sidebar Header */}
      <div className={`px-5 py-4 border-b ${theme.inputBorder} flex items-center justify-between ${theme.modalHeaderBg} shrink-0`}>
        <div className="flex items-center gap-2">
          <Sparkles className={`w-5 h-5 ${theme.accentText} animate-pulse`} />
          <span className={`font-extrabold text-sm ${theme.textPrimary}`}>AI Companion Hub</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
          title="Close Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-zinc-50/50 dark:bg-zinc-950/20">
        {/* Embedding Notice */}
        <div className={`p-3.5 ${theme.inputBg} border ${theme.inputBorder} ${theme.radiusMedium} text-[11px] ${theme.textMuted} leading-relaxed shrink-0`}>
          <span className={`font-bold ${theme.textSecondary} block mb-0.5`}>🔒 Browser Security Notice</span>
          Major AI providers (Gemini, DeepSeek, ChatGPT, Claude) block embedding in iframes. Launch them in a new tab below.
        </div>

        {/* Launch Buttons Grid (Clean Icons) */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <a
            href="https://gemini.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border ${theme.inputBorder} ${theme.radiusMedium} hover:border-teal-500 transition-all group cursor-pointer`}
          >
            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg group-hover:scale-105 transition-transform shrink-0">
              <GeminiIcon />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-bold ${theme.textPrimary} flex items-center gap-1`}>
                Gemini
                <ExternalLink className="w-2.5 h-2.5 text-zinc-400 group-hover:text-teal-500" />
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">Google AI</p>
            </div>
          </a>

          <a
            href="https://chat.deepseek.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border ${theme.inputBorder} ${theme.radiusMedium} hover:border-teal-500 transition-all group cursor-pointer`}
          >
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg group-hover:scale-105 transition-transform shrink-0">
              <DeepSeekIcon />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-bold ${theme.textPrimary} flex items-center gap-1`}>
                DeepSeek
                <ExternalLink className="w-2.5 h-2.5 text-zinc-400 group-hover:text-teal-500" />
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">DeepSeek R1</p>
            </div>
          </a>

          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border ${theme.inputBorder} ${theme.radiusMedium} hover:border-teal-500 transition-all group cursor-pointer`}
          >
            <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg group-hover:scale-105 transition-transform shrink-0">
              <ClaudeIcon />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-bold ${theme.textPrimary} flex items-center gap-1`}>
                Claude
                <ExternalLink className="w-2.5 h-2.5 text-zinc-400 group-hover:text-teal-500" />
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">Anthropic AI</p>
            </div>
          </a>

          <a
            href="https://grok.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border ${theme.inputBorder} ${theme.radiusMedium} hover:border-teal-500 transition-all group cursor-pointer`}
          >
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg group-hover:scale-105 transition-transform shrink-0">
              <GrokIcon />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-bold ${theme.textPrimary} flex items-center gap-1`}>
                Grok
                <ExternalLink className="w-2.5 h-2.5 text-zinc-400 group-hover:text-teal-500" />
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">xAI Grok</p>
            </div>
          </a>
        </div>

        {/* Theme Prompt Section */}
        <div className={`p-4 bg-white dark:bg-zinc-900 border ${theme.inputBorder} ${theme.radiusMedium} space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-teal-605 dark:text-teal-400 font-extrabold text-xs">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Theme Alignment Prompt
            </div>
            <button
              onClick={() => handleCopyPrompt(999, THEME_ALIGNMENT_PROMPT)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded transition-all cursor-pointer"
            >
              {copiedPromptId === 999 ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Prompt
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
            Copy this design prompt to instruct any AI model to generate custom widgets that match the **Naz Basket** dark mode layout, fonts, rounded corners, and teal accents.
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded border border-zinc-200 dark:border-zinc-800 max-h-24 overflow-y-auto">
            <code className="text-[10px] text-zinc-650 dark:text-zinc-400 font-mono whitespace-pre-wrap block">
              {THEME_ALIGNMENT_PROMPT}
            </code>
          </div>
        </div>

        {/* Quick Prompts Helper */}
        <div className="space-y-3">
          <div className="flex flex-col">
            <h4 className={`font-extrabold text-sm ${theme.textPrimary}`}>Quick App Prompts</h4>
            <p className={`text-xs ${theme.textMuted}`}>
              Click a prompt to copy it, then paste it in your AI chat tab to generate single-file HTML apps!
            </p>
          </div>

          <div className="space-y-3">
            {PROMPTS.map((p) => (
              <div
                key={p.id}
                onClick={() => handleCopyPrompt(p.id, p.text)}
                className={`group relative p-4 ${theme.radiusMedium} border ${theme.inputBorder} bg-white dark:bg-zinc-900 ${theme.accentBorderHover} hover:shadow-sm cursor-pointer transition-all duration-200 flex flex-col justify-between`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-extrabold text-xs ${theme.textPrimary} group-hover:${theme.accentText} transition-colors`}>
                      {p.title}
                    </span>
                    {copiedPromptId === p.id ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-500 opacity-0 group-hover:opacity-100 transition-all" />
                    )}
                  </div>
                  <p className={`text-[11px] ${theme.textMuted} leading-normal`}>
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
