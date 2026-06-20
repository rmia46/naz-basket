"use client";

import React from "react";
import { Star, Trash2, Edit, HelpCircle } from "lucide-react";
import { CustomApp, ICON_COMPONENTS } from "@/lib/types";
import { theme } from "@/lib/theme";

interface AppCardProps {
  app: CustomApp;
  index: number;
  isEditMode: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
}

export default function AppCard({
  app,
  index,
  isEditMode,
  onClick,
  onDelete,
  onEdit,
}: AppCardProps) {
  const IconComponent = ICON_COMPONENTS[app.icon] || HelpCircle;

  return (
    <div
      className="flex flex-col items-center select-none relative group text-center cursor-pointer"
      onClick={onClick}
    >
      {/* Wiggle effects applied in edit mode */}
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 ${theme.radiusMedium} ${app.color} shadow-md flex items-center justify-center text-3xl sm:text-4xl transition-all relative ${
          isEditMode
            ? index % 2 === 0
              ? "animate-wiggle"
              : "animate-wiggle-alt"
            : "hover:scale-[1.03] active:scale-95"
        }`}
      >
        <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />

        {/* Favorite Badge (Star icon) */}
        {app.favorite && (
          <div className={`absolute -bottom-1 -right-1 bg-amber-400 text-white ${theme.radiusFull} p-1 border-2 border-white dark:border-zinc-950 shadow-sm`}>
            <Star className="w-2.5 h-2.5 fill-current" />
          </div>
        )}

        {/* URL Type Icon */}
        {app.type === "url" && (
          <div className={`absolute top-1 right-1 bg-black/40 text-white ${theme.radiusSmall} p-0.5 text-[9px] font-bold scale-[0.8] tracking-wider uppercase`}>
            URL
          </div>
        )}
      </div>

      {/* Edit & Delete Badges in Edit Mode */}
      {isEditMode && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            className={`absolute -top-1.5 -left-1.5 bg-rose-600 hover:bg-rose-700 text-white ${theme.radiusFull} p-1.5 border-2 border-zinc-100 dark:border-zinc-950 shadow-md active:scale-90 transition-all cursor-pointer z-10`}
            title="Delete app"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(e);
            }}
            className={`absolute -top-1.5 -right-1.5 bg-teal-650 hover:bg-teal-700 text-white ${theme.radiusFull} p-1.5 border-2 border-zinc-100 dark:border-zinc-950 shadow-md active:scale-90 transition-all cursor-pointer z-10`}
            title="Edit details"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </>
      )}

      {/* App Text Name */}
      <span className={`mt-2 text-xs font-semibold ${theme.textSecondary} w-full truncate px-1`}>
        {app.name}
      </span>
    </div>
  );
}
