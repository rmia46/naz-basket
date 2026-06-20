"use client";

import React, { useState } from "react";
import { Sparkles, X, ExternalLink, Copy, Check } from "lucide-react";
import { theme } from "@/lib/theme";

interface AiCompanionHubProps {
  isOpen: boolean;
  onClose: () => void;
}

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
      className={`fixed top-0 right-0 h-full w-80 sm:w-[480px] ${theme.modalBg} border-l ${theme.inputBorder} shadow-2xl transition-transform duration-300 ease-in-out z-40 flex flex-col ${
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
          Major AI providers (Gemini, DeepSeek, ChatGPT, Claude) block embedding in iframes via <code className={`text-cyan-600 dark:text-cyan-400 font-mono text-[10px]`}>frame-ancestors 'none'</code> headers. Use the links below to launch them safely in a new tab.
        </div>

        {/* Launch Buttons Grid */}
        <div className="grid grid-cols-1 gap-3">
          {/* Gemini Launcher Card */}
          <div className={`p-4 ${theme.radiusMedium} bg-gradient-to-br ${theme.accentGradient} text-white shadow-sm space-y-3`}>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                Google Gemini
              </h4>
              <p className="text-[11px] text-teal-100">
                Ideal for clean coding, structured HTML page design, and layout ideas.
              </p>
            </div>
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 bg-white text-teal-600 font-extrabold text-xs ${theme.radiusSmall} hover:bg-zinc-100 transition-all cursor-pointer text-center shadow-sm`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Launch Gemini AI
            </a>
          </div>

          {/* DeepSeek Launcher Card */}
          <div className={`p-4 ${theme.radiusMedium} bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-sm space-y-3`}>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-200 fill-cyan-200" />
                DeepSeek Chat
              </h4>
              <p className="text-[11px] text-cyan-100">
                Excellent for logic, algorithms, writing script details, and debugging widgets.
              </p>
            </div>
            <a
              href="https://chat.deepseek.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 bg-white text-cyan-700 font-extrabold text-xs ${theme.radiusSmall} hover:bg-zinc-100 transition-all cursor-pointer text-center shadow-sm`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Launch DeepSeek Chat
            </a>
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
                className={`group relative p-4 ${theme.radiusMedium} border ${theme.inputBorder} bg-white dark:bg-zinc-950 ${theme.accentBorderHover} hover:shadow-sm cursor-pointer transition-all duration-200 flex flex-col justify-between`}
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
