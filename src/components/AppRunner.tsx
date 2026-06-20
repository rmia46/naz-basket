"use client";

import React from "react";
import { ArrowLeft, RefreshCw, ExternalLink, HelpCircle } from "lucide-react";
import { CustomApp, ICON_COMPONENTS } from "@/lib/types";
import { theme } from "@/lib/theme";

interface AppRunnerProps {
  activeRunningApp: CustomApp | null;
  iframeKey: number;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  reloadRunningApp: () => void;
  onClose: () => void;
}

export default function AppRunner({
  activeRunningApp,
  iframeKey,
  iframeRef,
  reloadRunningApp,
  onClose,
}: AppRunnerProps) {
  if (!activeRunningApp) return null;

  const IconComponent = ICON_COMPONENTS[activeRunningApp.icon] || HelpCircle;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Main App Runner Iframe viewport */}
      <div className="flex-1 bg-white relative">
        {activeRunningApp.type === "html" ? (
          <iframe
            key={iframeKey}
            ref={iframeRef}
            title={activeRunningApp.name}
            srcDoc={activeRunningApp.content}
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
            className="w-full h-full border-none"
          />
        ) : (
          <iframe
            key={iframeKey}
            ref={iframeRef}
            title={activeRunningApp.name}
            src={activeRunningApp.content}
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
            className="w-full h-full border-none"
          />
        )}
      </div>

      {/* Flat Bottom Toolbar Menu */}
      <div className="h-16 bg-zinc-950 text-white flex items-center justify-between px-6 border-t border-zinc-900 shrink-0">
        {/* Title & Type */}
        <div className="flex items-center gap-2.5 max-w-[50%]">
          <IconComponent className="w-5 h-5 shrink-0 text-white" strokeWidth={2.2} />
          <span className="font-bold text-sm truncate">{activeRunningApp.name}</span>
        </div>

        {/* Floating Operations controls */}
        <div className="flex items-center gap-4">
          {/* Force Open Tab (highly recommended fallback for URLs that block embedding) */}
          {activeRunningApp.type === "url" && (
            <a
              href={activeRunningApp.content}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-400 hover:text-zinc-200 active:scale-95 transition-all"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}

          {/* Reload / Refresh frame */}
          <button
            onClick={reloadRunningApp}
            className="p-2 text-zinc-400 hover:text-zinc-200 active:scale-95 transition-all cursor-pointer"
            title="Reload App"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Close/Exit Screen */}
          <button
            onClick={onClose}
            className={`flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs font-bold ${theme.radiusSmall} transition-all cursor-pointer`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
