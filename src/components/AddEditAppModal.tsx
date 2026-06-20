"use client";

import React, { useState, useEffect } from "react";
import { X, Code, Globe, HelpCircle, Check, AlertCircle, Star } from "lucide-react";
import { CustomApp, ICON_COMPONENTS, ICON_COLORS, PRESET_ICONS, CATEGORIES } from "@/lib/types";
import { theme } from "@/lib/theme";
import { validateHTML, HtmlValidationResult } from "@/lib/htmlValidator";

interface AddEditAppModalProps {
  isOpen: boolean;
  modalMode: "add" | "edit";
  selectedAppForEdit: CustomApp | null;
  onClose: () => void;
  onSave: (appData: {
    name: string;
    type: "html" | "url";
    content: string;
    icon: string;
    color: string;
    category: string;
    favorite: boolean;
  }) => Promise<void>;
}

export default function AddEditAppModal({
  isOpen,
  modalMode,
  selectedAppForEdit,
  onClose,
  onSave,
}: AddEditAppModalProps) {
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<"html" | "url">("html");
  const [formContent, setFormContent] = useState("");
  const [formIcon, setFormIcon] = useState("Terminal");
  const [formColor, setFormColor] = useState("bg-blue-500 text-white");
  const [formCategory, setFormCategory] = useState("Utilities");
  const [formFavorite, setFormFavorite] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSavingApp, setIsSavingApp] = useState(false);
  const [htmlValidation, setHtmlValidation] = useState<HtmlValidationResult | null>(null);
  const [showValidationWarnings, setShowValidationWarnings] = useState(false);

  // Validate HTML code changes
  useEffect(() => {
    if (formType === "html" && formContent.trim() !== "") {
      const result = validateHTML(formContent);
      setHtmlValidation(result);
    } else {
      setHtmlValidation(null);
    }
  }, [formContent, formType]);

  // Sync state with selected app when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (modalMode === "edit" && selectedAppForEdit) {
      setFormName(selectedAppForEdit.name);
      setFormType(selectedAppForEdit.type);
      setFormContent(selectedAppForEdit.content);
      setFormIcon(selectedAppForEdit.icon);
      setFormColor(selectedAppForEdit.color);
      setFormCategory(selectedAppForEdit.category);
      setFormFavorite(selectedAppForEdit.favorite);
      setFormError("");
    } else {
      // Clear forms for new apps
      setFormName("");
      setFormType("html");
      setFormContent("");
      setFormIcon("Terminal");
      setFormColor("bg-blue-500 text-white");
      setFormCategory("Utilities");
      setFormFavorite(false);
      setFormError("");
    }
  }, [isOpen, modalMode, selectedAppForEdit]);

  if (!isOpen) return null;

  // Handle HTML File Import
  const handleHtmlFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFormContent(text);

      // Auto-fill app name from <title> if it exists
      const match = text.match(/<title>([^<]+)<\/title>/i);
      if (match && match[1] && !formName) {
        setFormName(match[1].trim());
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      setFormError("App Name is required");
      return;
    }
    if (!formContent.trim()) {
      setFormError(formType === "html" ? "HTML content cannot be empty" : "Web URL Link is required");
      return;
    }

    // Basic URL validation
    let finalContent = formContent.trim();
    if (formType === "url") {
      if (!/^https?:\/\//i.test(finalContent)) {
        finalContent = "https://" + finalContent;
      }
    }

    setIsSavingApp(true);
    setFormError("");

    try {
      await onSave({
        name: formName.trim(),
        type: formType,
        content: finalContent,
        icon: formIcon,
        color: formColor,
        category: formCategory,
        favorite: formFavorite,
      });
      onClose();
    } catch (err: any) {
      console.error("Error inside modal save:", err);
      setFormError("Failed to save. " + (err.message || err));
    } finally {
      setIsSavingApp(false);
    }
  };

  const ActiveIconComponent = ICON_COMPONENTS[formIcon] || HelpCircle;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme.modalOverlayBg} px-4 py-8 overflow-y-auto`}>
      <div className={`w-full max-w-2xl ${theme.modalBg} ${theme.radiusLarge} overflow-hidden ${theme.modalBorder} shadow-2xl flex flex-col my-auto max-h-[90vh]`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b ${theme.inputBorder} flex items-center justify-between ${theme.modalHeaderBg} shrink-0`}>
          <div className="flex items-center gap-2">
            <ActiveIconComponent className={`w-5 h-5 ${theme.textSecondary}`} strokeWidth={2.2} />
            <h3 className={`font-extrabold text-lg ${theme.textPrimary}`}>
              {modalMode === "add" ? "Create New App" : `Edit App: ${formName}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* App Type Switch Tabs */}
          <div>
            <label className={`block text-xs font-bold ${theme.textMuted} uppercase tracking-widest mb-2`}>App Type</label>
            <div className={`grid grid-cols-2 p-1 ${theme.inputBg} ${theme.radiusSmall}`}>
              <button
                type="button"
                onClick={() => setFormType("html")}
                className={`py-2 ${theme.radiusSmall} text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  formType === "html"
                    ? `${theme.modalBg} ${theme.textPrimary} shadow-sm`
                    : `${theme.textMuted} hover:${theme.textSecondary}`
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                Custom HTML Code
              </button>
              <button
                type="button"
                onClick={() => setFormType("url")}
                className={`py-2 ${theme.radiusSmall} text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  formType === "url"
                    ? `${theme.modalBg} ${theme.textPrimary} shadow-sm`
                    : `${theme.textMuted} hover:${theme.textSecondary}`
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Web URL Link
              </button>
            </div>
          </div>

          {/* Name & Category grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold ${theme.textMuted} uppercase tracking-widest mb-1.5`}>App Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. My Workout Tracker"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={`w-full px-4 py-2.5 ${theme.radiusSmall} ${theme.inputBorder} ${theme.inputBg} ${theme.textPrimary} placeholder-zinc-400 ${theme.inputFocus} text-sm`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold ${theme.textMuted} uppercase tracking-widest mb-1.5`}>Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className={`w-full px-4 py-2.5 ${theme.radiusSmall} ${theme.inputBorder} ${theme.inputBg} ${theme.textPrimary} ${theme.inputFocus} text-sm`}
              >
                {CATEGORIES.slice(1).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Icon selector & custom input */}
          <div className="space-y-3">
            <label className={`block text-xs font-bold ${theme.textMuted} uppercase tracking-widest mb-0.5`}>Icon *</label>
            <div className={`flex gap-2 flex-wrap max-h-24 overflow-y-auto p-2 ${theme.inputBg} ${theme.radiusSmall} ${theme.inputBorder}`}>
              {PRESET_ICONS.map((iconName) => {
                const IconComponent = ICON_COMPONENTS[iconName] || HelpCircle;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setFormIcon(iconName)}
                    className={`w-9 h-9 ${theme.radiusSmall} flex items-center justify-center transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer ${
                      formIcon === iconName ? `bg-zinc-300 dark:bg-zinc-800 ring-2 ring-teal-500 ${theme.accentText}` : `${theme.textMuted}`
                    }`}
                    title={iconName}
                  >
                    <IconComponent className="w-5 h-5" strokeWidth={2} />
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${theme.textMuted}`}>Custom Lucide icon name:</span>
              <input
                type="text"
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                className={`px-3 py-1 ${theme.radiusSmall} ${theme.inputBorder} ${theme.inputBg} text-sm font-semibold w-36 ${theme.inputFocus}`}
                placeholder="e.g. Heart, Play, Star"
              />
            </div>
          </div>

          {/* Theme Color selectors */}
          <div>
            <label className={`block text-xs font-bold ${theme.textMuted} uppercase tracking-widest mb-2`}>Theme Color</label>
            <div className="flex gap-2.5 flex-wrap">
              {ICON_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setFormColor(color.bgClass)}
                  className={`w-8 h-8 ${theme.radiusFull} cursor-pointer flex items-center justify-center border-2 ${color.bgClass} ${
                    formColor === color.bgClass
                      ? "border-teal-500 dark:border-white ring-2 ring-teal-500/25"
                      : "border-transparent"
                  }`}
                  title={color.name}
                >
                  {formColor === color.bgClass && <Check className="w-4 h-4 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Content Code Textarea or URL Target */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center justify-between w-full">
                <label className={`block text-xs font-bold ${theme.textMuted} uppercase tracking-widest`}>
                  {formType === "html" ? "HTML Code Content *" : "Web URL Link *"}
                </label>
                {formType === "html" ? (
                  <label className={`text-xs font-bold ${theme.accentText} ${theme.accentTextHover} cursor-pointer flex items-center gap-1`}>
                    <span>Import HTML File</span>
                    <input
                      type="file"
                      accept=".html"
                      onChange={handleHtmlFileImport}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Some external URLs may require opening in new tab.
                  </span>
                )}
              </div>
            </div>
            
            {formType === "html" ? (
              <>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2 leading-relaxed">
                  💡 <strong>Tip:</strong> Want your custom app to match the dark style and teal accents of Naz Basket? Copy the design prompt from the <strong>AI Companion Hub</strong> sidebar on the main screen.
                </p>
                <textarea
                  rows={10}
                  required
                  placeholder="<!DOCTYPE html>..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className={`w-full px-4 py-3 ${theme.radiusSmall} ${theme.inputBorder} ${theme.inputBg} ${theme.textPrimary} font-mono text-xs ${theme.inputFocus}`}
                />
                
                {htmlValidation && (htmlValidation.errors.length > 0 || htmlValidation.warnings.length > 0) && (
                  <div className={`mt-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 ${theme.radiusSmall} text-xs`}>
                    <button
                      type="button"
                      onClick={() => setShowValidationWarnings(!showValidationWarnings)}
                      className="w-full flex items-center justify-between font-bold text-amber-800 dark:text-amber-300 text-left cursor-pointer focus:outline-none"
                    >
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span>HTML code might be incorrect and may not render properly</span>
                      </span>
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded">
                        {htmlValidation.errors.length + htmlValidation.warnings.length} issue(s) {showValidationWarnings ? "▲" : "▼"}
                      </span>
                    </button>

                    {showValidationWarnings && (
                      <div className="mt-2.5 pt-2 border-t border-amber-200/50 dark:border-amber-900/30 space-y-2 max-h-40 overflow-y-auto pr-1">
                        {[...htmlValidation.errors, ...htmlValidation.warnings].map((issue, idx) => (
                          <div key={idx} className="flex gap-2 text-[11px] leading-relaxed">
                            <span className="font-extrabold text-amber-600 dark:text-amber-400 select-none">•</span>
                            <div className="space-y-0.5">
                              <p className="font-bold text-zinc-800 dark:text-zinc-200">{issue.message}</p>
                              <p className="text-zinc-500 dark:text-zinc-400">{issue.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <input
                type="text"
                required
                placeholder="https://example.com"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className={`w-full px-4 py-2.5 ${theme.radiusSmall} ${theme.inputBorder} ${theme.inputBg} ${theme.textPrimary} placeholder-zinc-400 ${theme.inputFocus} text-sm`}
              />
            )}
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="formFavorite"
              checked={formFavorite}
              onChange={(e) => setFormFavorite(e.target.checked)}
              className={`w-4 h-4 ${theme.accentText} border-zinc-300 rounded ${theme.accentRing}`}
            />
            <label htmlFor="formFavorite" className={`text-sm font-semibold ${theme.textSecondary} select-none cursor-pointer flex items-center gap-1.5`}>
              <Star className={`w-4 h-4 ${formFavorite ? "fill-amber-400 text-amber-400" : "text-zinc-400"}`} />
              Add to favorites (pins it to the top of your list)
            </label>
          </div>

          {/* Form Error Display */}
          {formError && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form Buttons */}
          <div className={`flex gap-3 justify-end pt-4 border-t ${theme.inputBorder} shrink-0`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 ${theme.radiusSmall} text-sm font-bold ${theme.btnSecondary} transition-colors cursor-pointer`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingApp}
              className={`px-6 py-2.5 ${theme.radiusSmall} text-sm font-bold ${theme.btnAccent} disabled:bg-teal-400 flex items-center gap-2 transition-colors cursor-pointer`}
            >
              {isSavingApp && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>Save App</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
