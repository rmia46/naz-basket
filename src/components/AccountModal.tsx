"use client";

import React from "react";
import { X, LogOut, BookOpen, User } from "lucide-react";
import { theme } from "@/lib/theme";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogoutConfirm: () => void;
  onOpenAbout: () => void;
}

export default function AccountModal({
  isOpen,
  onClose,
  user,
  onLogoutConfirm,
  onOpenAbout,
}: AccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme.modalOverlayBg} px-4 py-8 animate-fade-in`}>
      <div className={`w-full max-w-sm ${theme.modalBg} ${theme.radiusLarge} overflow-hidden ${theme.modalBorder} shadow-2xl p-6 relative`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Info Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="mb-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className={`w-20 h-20 ${theme.radiusFull} border-2 border-teal-500 shadow-md object-cover`}
              />
            ) : (
              <div className={`w-20 h-20 ${theme.radiusFull} bg-teal-600 text-white flex items-center justify-center font-bold text-3xl uppercase shadow-md`}>
                {user?.displayName?.charAt(0) || "U"}
              </div>
            )}
          </div>

          <h3 className={`font-extrabold text-lg ${theme.textPrimary}`}>{user?.displayName || "User"}</h3>
          <p className={`text-xs ${theme.textMuted} mt-0.5`}>{user?.email || "No email linked"}</p>
        </div>

        {/* Menu Options */}
        <div className="space-y-2">
          {/* About App Option */}
          <button
            onClick={() => {
              onClose();
              onOpenAbout();
            }}
            className={`w-full flex items-center justify-between p-3 ${theme.radiusSmall} ${theme.btnSecondary} text-xs font-semibold cursor-pointer transition-all active:scale-[0.99]`}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>About Naz Basket</span>
            </span>
            <span className="text-zinc-400">&rarr;</span>
          </button>

          {/* Sign Out Option */}
          <button
            onClick={() => {
              onClose();
              onLogoutConfirm();
            }}
            className={`w-full flex items-center justify-between p-3 ${theme.radiusSmall} bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/25 text-xs font-bold border border-rose-100 dark:border-rose-950 cursor-pointer transition-all active:scale-[0.99]`}
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-455" />
              <span>Sign Out</span>
            </span>
            <span className="text-rose-400">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
