"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import { theme } from "@/lib/theme";

interface CategoryPickerProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function CategoryPicker({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
}: CategoryPickerProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-2 shrink-0">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search bar */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search apps by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 ${theme.radiusMedium} ${theme.inputBorder} ${theme.inputBg} ${theme.textPrimary} placeholder-zinc-400 ${theme.inputFocus} shadow-sm text-sm`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Horizontal Pick */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 shrink-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2.5 ${theme.radiusMedium} text-sm font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer border ${
                activeCategory === category
                  ? `${theme.accentBg} border-transparent text-white shadow-sm`
                  : `bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-900 ${theme.textSecondary} hover:bg-zinc-50 dark:hover:bg-zinc-800`
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
