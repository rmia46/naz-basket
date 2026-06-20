"use client";

import React, { useState, useEffect } from "react";
import { Settings, AlertCircle, X } from "lucide-react";
import { theme } from "@/lib/theme";
import { getFirebaseConfig, saveFirebaseConfig } from "@/lib/firebase";

interface FirebaseWizardProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function FirebaseWizard({ isModal = false, onClose }: FirebaseWizardProps) {
  const [projectId, setProjectId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [authDomain, setAuthDomain] = useState("");
  const [storageBucket, setStorageBucket] = useState("");
  const [senderId, setSenderId] = useState("");
  const [appId, setAppId] = useState("");

  // Load existing configuration on mount
  useEffect(() => {
    const config = getFirebaseConfig();
    setProjectId(config.projectId || "");
    setApiKey(config.apiKey || "");
    setAuthDomain(config.authDomain || "");
    setStorageBucket(config.storageBucket || "");
    setSenderId(config.messagingSenderId || "");
    setAppId(config.appId || "");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !apiKey) {
      alert("Please fill in at least Project ID and API Key.");
      return;
    }

    saveFirebaseConfig({
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim() || `${projectId.trim()}.firebasestorage.app`,
      messagingSenderId: senderId.trim(),
      appId: appId.trim(),
    });

    alert("Configuration saved successfully. Reloading page...");
    window.location.reload();
  };

  const formFields = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-1`}>
          Project ID *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. nazbasket"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className={`w-full px-4 py-3 ${theme.radiusSmall} ${theme.inputBorder} ${theme.inputBg} ${theme.textPrimary} ${theme.inputFocus} text-sm`}
        />
      </div>

      <div>
        <label className={`block text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-1`}>
          API Key *
        </label>
        <input
          type="password"
          required
          placeholder="AIzaSyA..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className={`w-full px-4 py-3 ${theme.radiusSmall} ${theme.inputBorder} ${theme.inputBg} ${theme.textPrimary} ${theme.inputFocus} text-sm`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-1`}>
            Auth Domain (Optional)
          </label>
          <input
            type="text"
            placeholder="nazbasket.firebaseapp.com"
            value={authDomain}
            onChange={(e) => setAuthDomain(e.target.value)}
            className={`w-full px-4 py-3 ${theme.radiusSmall} ${theme.inputBorder} ${theme.inputBg} ${theme.textPrimary} ${theme.inputFocus} text-sm`}
          />
        </div>
        <div>
          <label className={`block text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-1`}>
            Storage Bucket (Optional)
          </label>
          <input
            type="text"
            placeholder="nazbasket.firebasestorage.app"
            value={storageBucket}
            onChange={(e) => setStorageBucket(e.target.value)}
            className={`w-full px-4 py-3 ${theme.radiusSmall} ${theme.inputBorder} ${theme.inputBg} ${theme.textPrimary} ${theme.inputFocus} text-sm`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-1`}>
            Messaging Sender ID
          </label>
          <input
            type="text"
            placeholder="e.g. 58392058295"
            value={senderId}
            onChange={(e) => setSenderId(e.target.value)}
            className={`w-full px-4 py-3 ${theme.radiusSmall} ${theme.inputBorder} ${theme.inputBg} ${theme.textPrimary} ${theme.inputFocus} text-sm`}
          />
        </div>
        <div>
          <label className={`block text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-1`}>
            App ID
          </label>
          <input
            type="text"
            placeholder="1:58392058295:web:8a92..."
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            className={`w-full px-4 py-3 ${theme.radiusSmall} ${theme.inputBorder} ${theme.inputBg} ${theme.textPrimary} ${theme.inputFocus} text-sm`}
          />
        </div>
      </div>

      <button
        type="submit"
        className={`w-full mt-2 ${theme.btnAccent} active:scale-[0.98] font-semibold py-3 px-6 ${theme.radiusSmall} transition-all shadow-md shadow-teal-500/10 cursor-pointer text-sm`}
      >
        Save & Initialize
      </button>
    </form>
  );

  const guideBox = (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4 rounded-lg mb-6">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 dark:text-amber-300">
          <p className="font-semibold mb-1">How to deploy without this setup wizard:</p>
          <p>
            Define the following environment variables in your Hosting Provider or local{" "}
            <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono">.env.local</code> file:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 font-mono text-xs">
            <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
            <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
            <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
          </ul>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme.modalOverlayBg} px-4 py-8`}>
        <div className={`w-full max-w-md ${theme.modalBg} ${theme.radiusLarge} overflow-hidden ${theme.modalBorder} shadow-2xl`}>
          <div className={`px-6 py-4 border-b ${theme.inputBorder} flex items-center justify-between ${theme.modalHeaderBg}`}>
            <h3 className={`font-extrabold text-sm ${theme.textPrimary}`}>Configure Database Sync</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="p-6">
            {formFields}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render as inline configuration setup page
  return (
    <div className={`w-full max-w-lg ${theme.modalBg} ${theme.radiusLarge} border ${theme.inputBorder} shadow-xl overflow-hidden`}>
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 ${theme.radiusSmall} ${theme.accentBg} text-white flex items-center justify-center shadow-md shadow-teal-500/10`}>
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${theme.textPrimary}`}>Firebase Config Required</h1>
            <p className={`text-sm ${theme.textMuted}`}>Naz Basket needs Firestore & Google Auth credentials</p>
          </div>
        </div>

        {guideBox}
        {formFields}
      </div>
      <div className={`${theme.modalHeaderBg} px-6 py-4 border-t ${theme.inputBorder} text-center`}>
        <a
          href="https://console.firebase.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs ${theme.accentText} ${theme.accentTextHover} font-medium`}
        >
          Open Firebase Console &rarr;
        </a>
      </div>
    </div>
  );
}
