"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus,
  Sparkles,
  Settings,
  Archive,
  Play,
  LayoutGrid,
  AlertCircle,
  HelpCircle
} from "lucide-react";

// Firebase integrations
import {
  auth,
  db,
  googleProvider,
  isFirebaseInitialized,
  hasEnvCredentials
} from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";

// Shared Theme, Types, and Components
import { theme } from "@/lib/theme";
import { CustomApp } from "@/lib/types";
import FirebaseWizard from "@/components/FirebaseWizard";
import AboutModal from "@/components/AboutModal";
import HelpModal from "@/components/HelpModal";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import AppRunner from "@/components/AppRunner";
import AiCompanionHub from "@/components/AiCompanionHub";
import AppCard from "@/components/AppCard";
import DashboardHeader from "@/components/DashboardHeader";
import CategoryPicker from "@/components/CategoryPicker";
import AddEditAppModal from "@/components/AddEditAppModal";
import BottomNav from "@/components/BottomNav";
import AccountModal from "@/components/AccountModal";

export default function NazBasket() {
  // Authentication State
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Firestore Data State
  const [apps, setApps] = useState<CustomApp[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);

  // Filtering / Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // UX & Drawer Panel States
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeRunningApp, setActiveRunningApp] = useState<CustomApp | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Modal Open states
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Modal Form specific state
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAppForEdit, setSelectedAppForEdit] = useState<CustomApp | null>(null);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Check initialization on mount
  useEffect(() => {
    setInitialized(isFirebaseInitialized());

    if (isFirebaseInitialized() && auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
      });
      return () => unsubscribe();
    } else {
      setAuthLoading(false);
    }
  }, []);

  // Sync custom apps from Firestore when signed in
  useEffect(() => {
    if (!user || !db) {
      setApps([]);
      setAppsLoading(false);
      return;
    }

    setAppsLoading(true);
    const q = query(collection(db, "apps"), where("uid", "==", user.uid));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const appsList: CustomApp[] = [];
        snapshot.forEach((doc) => {
          appsList.push({ id: doc.id, ...doc.data() } as CustomApp);
        });
        setApps(appsList);
        setAppsLoading(false);
      },
      (error) => {
        console.error("Firestore sync error:", error);
        setAppsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Filter and sort apps in memory (favorites first, then alphabetically)
  const filteredApps = useMemo(() => {
    let result = [...apps];

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter((app) => app.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.name.toLowerCase().includes(term) ||
          app.category.toLowerCase().includes(term)
      );
    }

    // Sort: Favorites first, then name (A-Z)
    return result.sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [apps, activeCategory, searchTerm]);

  // Handle Google Sign-in
  const handleSignIn = async () => {
    if (!auth || !googleProvider) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to sign in. Please check your Firebase configuration and Auth provider settings.");
    }
  };

  // Handle Sign-out
  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setIsEditMode(false);
      setActiveRunningApp(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Trigger app reload
  const reloadRunningApp = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Open modal in Add mode
  const openAddModal = () => {
    setModalMode("add");
    setSelectedAppForEdit(null);
    setIsAddEditModalOpen(true);
  };

  // Open modal in Edit mode
  const openEditModal = (app: CustomApp) => {
    setModalMode("edit");
    setSelectedAppForEdit(app);
    setIsAddEditModalOpen(true);
  };

  // Create or Update App in Firestore
  const handleSaveApp = async (appData: {
    name: string;
    type: "html" | "url";
    content: string;
    icon: string;
    color: string;
    category: string;
    favorite: boolean;
  }) => {
    if (!user || !db) return;

    const data = {
      uid: user.uid,
      ...appData
    };

    if (modalMode === "add") {
      await addDoc(collection(db, "apps"), {
        ...data,
        createdAt: serverTimestamp()
      });
    } else if (modalMode === "edit" && selectedAppForEdit) {
      await updateDoc(doc(db, "apps", selectedAppForEdit.id), data);
    }
  };

  // Delete App from Firestore
  const handleDeleteApp = async (id: string) => {
    if (!db) return;
    if (confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteDoc(doc(db, "apps", id));
      } catch (err) {
        console.error("Error deleting app:", err);
      }
    }
  };

  // 1. Loading screen during authentication validation
  if (authLoading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${theme.bg} font-sans`}>
        <div className="w-10 h-10 border-3 border-zinc-200 border-t-teal-600 rounded-full animate-spin"></div>
        <span className="mt-4 text-xs font-semibold text-zinc-500 tracking-wider uppercase animate-pulse">
          Starting Engine...
        </span>
      </div>
    );
  }

  // 2. Initial Setup Screen (when Firebase configuration is not set up)
  if (!initialized) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${theme.bg} px-4 py-8 font-sans`}>
        <FirebaseWizard isModal={false} />
      </div>
    );
  }

  // 3. Landing page for unauthenticated visitors
  if (!user) {
    return (
      <div className={`flex flex-col min-h-screen ${theme.bg} font-sans`}>
        {/* Elegant top bar */}
        <header className={`w-full px-6 py-4 flex items-center justify-between ${theme.headerBorder} ${theme.headerBg}`}>
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Naz Basket Logo" className={`w-8 h-8 ${theme.radiusSmall} shadow-sm object-cover shrink-0`} />
            <span className="select-none font-display font-normal text-2xl flex items-center gap-1.5 pt-1">
              <span className={theme.textPrimary}>Naz</span>
              <span className={`bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>Basket</span>
            </span>
          </div>
          {!hasEnvCredentials && (
            <button
              onClick={() => setIsWizardOpen(true)}
              className={`text-xs font-semibold ${theme.textMuted} hover:${theme.textPrimary} flex items-center gap-1.5 px-3 py-1.5 ${theme.radiusSmall} border border-zinc-200 dark:border-zinc-800 cursor-pointer`}
            >
              <Settings className="w-3.5 h-3.5" />
              Configure
            </button>
          )}
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto w-full text-center py-8">
          
          {/* Stunning Brand Hero Header */}
          <div className="mb-6 flex flex-col items-center gap-2">
            <div className={`w-20 h-20 ${theme.radiusLarge} bg-gradient-to-tr ${theme.brandGradient} p-0.5 shadow-xl transition-transform hover:scale-105 duration-300`}>
              <div className={`w-full h-full bg-white dark:bg-zinc-950 ${theme.radiusLarge} flex items-center justify-center overflow-hidden`}>
                <img src="/logo.jpg" alt="Naz Basket Logo" className="w-[85%] h-[85%] object-cover rounded-xl" />
              </div>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 ${theme.radiusFull} ${theme.accentBadge} text-xs font-semibold mt-2`}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Personal HTML App Hub</span>
            </div>
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-black tracking-tight ${theme.textPrimary} max-w-3xl leading-[1.2] mb-6 flex flex-wrap justify-center items-center gap-x-2`}>
            <span>Welcome to</span>
            <span className="font-display font-normal text-5xl md:text-7xl flex items-center gap-2">
              <span className={theme.textPrimary}>Naz</span>
              <span className={`bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>Basket</span>
            </span>
          </h1>
          
          <p className={`text-base md:text-lg ${theme.textMuted} max-w-xl mb-10 leading-relaxed`}>
            Your personal cloud-synced home screen to host, run, and sync custom HTML snippets, web links, and widgets in one gorgeous flat dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full sm:w-auto">
            <button
              onClick={handleSignIn}
              className={`w-full sm:w-auto flex items-center justify-center gap-3 ${theme.btnPrimary} font-bold py-4 px-8 ${theme.radiusLarge} shadow-lg hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer text-base`}
            >
              {/* Google Flat Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign In with Google
            </button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
            <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 p-6 ${theme.radiusMedium}`}>
              <Archive className={`w-6 h-6 ${theme.textSecondary} mb-3`} />
              <h3 className={`font-bold ${theme.textPrimary} mb-1`}>Instant App Storage</h3>
              <p className={`text-sm ${theme.textMuted}`}>Paste raw HTML scripts, CSS, and JS or web links to deploy code directly in the cloud.</p>
            </div>
            <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 p-6 ${theme.radiusMedium}`}>
              <Play className={`w-6 h-6 ${theme.textSecondary} mb-3`} />
              <h3 className={`font-bold ${theme.textPrimary} mb-1`}>Sandboxed Runner</h3>
              <p className={`text-sm ${theme.textMuted}`}>Launch any application in a sandboxed iframe. Secure, isolated, and completely offline-capable.</p>
            </div>
            <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 p-6 ${theme.radiusMedium}`}>
              <LayoutGrid className={`w-6 h-6 ${theme.textSecondary} mb-3`} />
              <h3 className={`font-bold ${theme.textPrimary} mb-1`}>Clean Dashboard Layout</h3>
              <p className={`text-sm ${theme.textMuted}`}>A clean, flat layout with wiggle icons, search, quick favorites, and categories.</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className={`w-full text-center py-6 text-xs ${theme.textMuted} border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 mt-12 shrink-0 space-x-2`}>
          <span>&copy; {new Date().getFullYear()} Naz Basket. Powered by Firebase.</span>
          <span>&bull;</span>
          <button
            onClick={() => setIsAboutOpen(true)}
            className={`text-teal-650 dark:text-teal-400 hover:underline cursor-pointer bg-transparent border-none p-0 inline font-semibold`}
          >
            About
          </button>
          <span>&bull;</span>
          <button
            onClick={() => setIsHelpOpen(true)}
            className={`text-teal-650 dark:text-teal-400 hover:underline cursor-pointer bg-transparent border-none p-0 inline font-semibold`}
          >
            Help Guide
          </button>
        </footer>

        {/* Wizard Dialog Modal */}
        {isWizardOpen && (
          <FirebaseWizard isModal={true} onClose={() => setIsWizardOpen(false)} />
        )}

        {/* About Dialog Modal */}
        <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

        {/* Help Guide Dialog Modal */}
        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </div>
    );
  }

  // 4. Authenticated Dashboard Screen
  return (
    <div className={`min-h-screen ${theme.bg} font-sans flex flex-col relative ${theme.textPrimary} ${theme.selectionBg}`}>
      
      {/* Top Header Widget Section */}
      <DashboardHeader
        user={user}
        isEditMode={isEditMode}
        isGeminiOpen={isGeminiOpen}
        setIsEditMode={setIsEditMode}
        setIsGeminiOpen={setIsGeminiOpen}
        setIsAboutOpen={setIsAboutOpen}
        setIsHelpOpen={setIsHelpOpen}
        setIsLogoutConfirmOpen={setIsLogoutConfirmOpen}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Filter and Search Bar Section */}
      <CategoryPicker
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Main Apps Grid Display */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 pb-20 md:pb-6">
        {appsLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className={`w-8 h-8 border-3 border-zinc-200 ${theme.accentText} border-t-transparent rounded-full animate-spin`}></div>
            <span className={`ml-3 ${theme.textSecondary} font-medium`}>Syncing database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-2.5 gap-y-5 sm:gap-x-4 sm:gap-y-6">
            
            {/* Apps list */}
            {filteredApps.map((app, index) => (
              <AppCard
                key={app.id}
                app={app}
                index={index}
                isEditMode={isEditMode}
                onClick={() => {
                  if (isEditMode) {
                    openEditModal(app);
                  } else {
                    setActiveRunningApp(app);
                  }
                }}
                onDelete={() => handleDeleteApp(app.id)}
                onEdit={() => openEditModal(app)}
              />
            ))}

            {/* Add New App Card */}
            <div
              onClick={openAddModal}
              className="flex flex-col items-center select-none text-center cursor-pointer group"
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 ${theme.radiusMedium} border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex items-center justify-center text-zinc-400 group-hover:${theme.accentText} group-hover:border-teal-500 transition-all group-active:scale-95 shadow-sm`}>
                <Plus className="w-8 h-8" />
              </div>
              <span className={`mt-2 text-xs font-semibold ${theme.textMuted} group-hover:${theme.accentText} transition-colors`}>
                Add App
              </span>
            </div>

          </div>
        )}

        {/* Empty state message when search has zero results */}
        {!appsLoading && filteredApps.length === 0 && (
          <div className={`mt-8 text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 ${theme.radiusLarge} shadow-sm max-w-md mx-auto`}>
            <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className={`font-semibold ${theme.textPrimary}`}>No apps found</p>
            <p className={`text-xs ${theme.textMuted} mt-1`}>
              {searchTerm || activeCategory !== "All"
                ? "Try changing your search terms or category filter settings."
                : "Create custom widgets or add links to begin building your dashboard."}
            </p>
            {(searchTerm || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("All");
                }}
                className={`mt-4 text-xs font-bold ${theme.accentText} ${theme.accentTextHover} hover:underline cursor-pointer`}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Fullscreen Iframe Runner View */}
      <AppRunner
        activeRunningApp={activeRunningApp}
        iframeKey={iframeKey}
        iframeRef={iframeRef}
        reloadRunningApp={reloadRunningApp}
        onClose={() => setActiveRunningApp(null)}
      />

      {/* Add / Edit App Drawer Modal Dialog */}
      <AddEditAppModal
        isOpen={isAddEditModalOpen}
        modalMode={modalMode}
        selectedAppForEdit={selectedAppForEdit}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveApp}
      />

      {/* About Modal Popup overlay */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onLogoutConfirm={() => setIsLogoutConfirmOpen(true)}
      />

      {/* Account Profile Dialog Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        onLogoutConfirm={() => setIsLogoutConfirmOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Help Guide Modal Popup overlay */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Logout Confirmation Dialog Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        onCancel={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleSignOut}
      />

      {/* Collapsible Gemini/DeepSeek AI Companion Sidebar */}
      <AiCompanionHub
        isOpen={isGeminiOpen}
        onClose={() => setIsGeminiOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        user={user}
        isGeminiOpen={isGeminiOpen}
        setIsGeminiOpen={setIsGeminiOpen}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        setIsAccountOpen={setIsAccountOpen}
        setIsHelpOpen={setIsHelpOpen}
        activeRunningApp={activeRunningApp}
        setActiveRunningApp={setActiveRunningApp}
      />

    </div>
  );
}
