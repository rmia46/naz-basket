"use client";

import React from "react";
import { theme } from "@/lib/theme";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({ isOpen, onCancel, onConfirm }: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme.modalOverlayBg} px-4 py-8`}>
      <div className={`w-full max-w-sm ${theme.modalBg} ${theme.radiusLarge} overflow-hidden ${theme.modalBorder} shadow-2xl p-6`}>
        <h3 className={`font-extrabold text-lg ${theme.textPrimary} mb-2`}>Sign Out</h3>
        <p className={`text-sm ${theme.textMuted} mb-6`}>
          Are you sure you want to sign out of Naz Basket?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className={`px-4 py-2 ${theme.radiusSmall} text-sm font-bold ${theme.btnSecondary} cursor-pointer`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 ${theme.radiusSmall} text-sm font-bold ${theme.btnDanger} cursor-pointer`}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
