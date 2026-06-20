/**
 * Naz Basket Theme Configuration
 * centralize styles, colors, border-radii, and accent configurations.
 * Modify these tokens to globally recolor or restyle the application.
 */
export const theme = {
  // Global backgrounds & boundaries
  bg: "bg-zinc-100 dark:bg-zinc-950",
  headerBg: "bg-white dark:bg-zinc-900",
  headerBorder: "border-b border-zinc-200 dark:border-zinc-900",
  
  // Modals & Dialog overlays
  modalOverlayBg: "bg-black/60",
  modalBg: "bg-white dark:bg-zinc-900",
  modalBorder: "border border-zinc-200 dark:border-zinc-800",
  modalHeaderBg: "bg-zinc-50 dark:bg-zinc-900/50",
  modalFooterBg: "bg-zinc-50 dark:bg-zinc-900/30",
  
  // Accent color themes (Vibrant Electric Teal & Cyan)
  accentGradient: "from-cyan-500 to-teal-500",
  accentText: "text-teal-650 dark:text-teal-400",
  accentTextHover: "hover:text-teal-700 dark:hover:text-teal-300",
  accentBg: "bg-teal-600",
  accentBgHover: "hover:bg-teal-700",
  accentBorder: "border-teal-200/50 dark:border-teal-900/30",
  accentBadgeBg: "bg-teal-50 dark:bg-teal-950/40",
  accentBadge: "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400",
  accentRing: "focus:ring-2 focus:ring-teal-500",
  accentBorderHover: "hover:border-teal-500 dark:hover:border-teal-500",
  
  // Secondary brand accent (for logo border / highlight boxes)
  brandGradient: "from-cyan-400 to-teal-500",
  brandTextMuted: "text-cyan-700 dark:text-cyan-400",
  
  // Border radius tokens
  radiusLarge: "rounded-2xl",
  radiusMedium: "rounded-xl",
  radiusSmall: "rounded-lg",
  radiusFull: "rounded-full",
  
  // Typography classes
  textPrimary: "text-zinc-900 dark:text-white",
  textSecondary: "text-zinc-700 dark:text-zinc-300",
  textMuted: "text-zinc-500 dark:text-zinc-400",
  textMutedLight: "text-zinc-400 dark:text-zinc-500",
  
  // Button style groups
  btnPrimary: "bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950",
  btnSecondary: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700",
  btnDanger: "bg-rose-600 hover:bg-rose-700 text-white",
  btnAccent: "bg-teal-600 hover:bg-teal-700 text-white",
  
  // Selection and hover
  selectionBg: "selection:bg-teal-500 selection:text-white",
  headerBtnHover: "hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 hover:shadow-sm",
  headerBtnDangerHover: "hover:border-rose-600 hover:text-rose-600 dark:hover:text-rose-400 hover:shadow-sm",
  
  // Input fields
  inputBg: "bg-zinc-50 dark:bg-zinc-950",
  inputBorder: "border border-zinc-200 dark:border-zinc-800",
  inputFocus: "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-zinc-900",
};
