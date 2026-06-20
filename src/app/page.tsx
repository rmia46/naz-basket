"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus,
  Search,
  LogOut,
  Settings,
  Edit,
  Trash2,
  Star,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  X,
  AlertCircle,
  Check,
  Lock,
  Globe,
  Code
} from "lucide-react";
import {
  auth,
  db,
  googleProvider,
  isFirebaseInitialized,
  hasEnvCredentials,
  getFirebaseConfig,
  saveFirebaseConfig,
  clearFirebaseConfig
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

// Interface for custom apps stored in Firestore
interface CustomApp {
  id: string;
  uid: string;
  name: string;
  type: "html" | "url";
  content: string;
  icon: string;
  color: string;
  category: string;
  favorite: boolean;
  createdAt?: any;
}

// Flat iOS-like background colors for squircle icons
const ICON_COLORS = [
  { name: "Blue", bgClass: "bg-blue-500 text-white" },
  { name: "Green", bgClass: "bg-emerald-500 text-white" },
  { name: "Orange", bgClass: "bg-orange-500 text-white" },
  { name: "Red", bgClass: "bg-rose-500 text-white" },
  { name: "Purple", bgClass: "bg-purple-500 text-white" },
  { name: "Yellow", bgClass: "bg-amber-500 text-zinc-950" },
  { name: "Indigo", bgClass: "bg-indigo-500 text-white" },
  { name: "Slate", bgClass: "bg-zinc-600 text-white" },
];

const PRESET_EMOJIS = [
  "🚀", "🏋️", "📝", "🎮", "⏱️", "🎨", "🎵", "🍔", "📅", "💬",
  "⚙️", "📈", "🌦️", "🔋", "💡", "💰", "🗺️", "🍿", "📚", "🎯"
];

const CATEGORIES = ["All", "Utilities", "Productivity", "Games", "Fitness", "Entertainment", "Other"];

export default function NazBasket() {
  // Authentication State
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // App Data State
  const [apps, setApps] = useState<CustomApp[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);

  // Search & Categories Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Edit / Wobble Mode State
  const [isEditMode, setIsEditMode] = useState(false);

  // Fullscreen Running App State
  const [activeRunningApp, setActiveRunningApp] = useState<CustomApp | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Modals & Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAppForEdit, setSelectedAppForEdit] = useState<CustomApp | null>(null);

  // Wizard Configuration State
  const [wizardApiKey, setWizardApiKey] = useState("");
  const [wizardAuthDomain, setWizardAuthDomain] = useState("");
  const [wizardProjectId, setWizardProjectId] = useState("");
  const [wizardStorageBucket, setWizardStorageBucket] = useState("");
  const [wizardSenderId, setWizardSenderId] = useState("");
  const [wizardAppId, setWizardAppId] = useState("");

  // Add/Edit App Form State
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<"html" | "url">("html");
  const [formContent, setFormContent] = useState("");
  const [formIcon, setFormIcon] = useState("🚀");
  const [formColor, setFormColor] = useState("bg-blue-500 text-white");
  const [formCategory, setFormCategory] = useState("Utilities");
  const [formFavorite, setFormFavorite] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSavingApp, setIsSavingApp] = useState(false);

  // Current Date display for iOS dashboard style
  const [currentDateString, setCurrentDateString] = useState("");

  // Initialize Auth and check config
  useEffect(() => {
    setInitialized(isFirebaseInitialized());

    // Format current date in a clean iOS style (e.g. "SATURDAY, JUNE 20")
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    setCurrentDateString(new Date().toLocaleDateString('en-US', options).toUpperCase());

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

  // Fetch custom apps from Firestore when signed in
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

  // Load wizard inputs with current configuration if wizard is opened
  useEffect(() => {
    if (isWizardOpen) {
      const current = getFirebaseConfig();
      setWizardApiKey(current.apiKey || "");
      setWizardAuthDomain(current.authDomain || "");
      setWizardProjectId(current.projectId || "");
      setWizardStorageBucket(current.storageBucket || "");
      setWizardSenderId(current.messagingSenderId || "");
      setWizardAppId(current.appId || "");
    }
  }, [isWizardOpen]);

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

  // Save manual configuration wizard
  const handleSaveWizard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardApiKey || !wizardProjectId) {
      alert("API Key and Project ID are required fields.");
      return;
    }

    saveFirebaseConfig({
      apiKey: wizardApiKey.trim(),
      authDomain: wizardAuthDomain.trim(),
      projectId: wizardProjectId.trim(),
      storageBucket: wizardStorageBucket.trim(),
      messagingSenderId: wizardSenderId.trim(),
      appId: wizardAppId.trim(),
    });
  };

  // Open modal in Add mode
  const openAddModal = () => {
    setModalMode("add");
    setSelectedAppForEdit(null);
    setFormName("");
    setFormType("html");
    setFormContent(`<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #f4f4f5;
    }
    button {
      padding: 12px 24px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      background: #2563eb;
      color: white;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>My Custom App</h1>
  <button onclick="alert('Hello from Naz Basket!')">Click Me</button>
</body>
</html>`);
    setFormIcon("🚀");
    setFormColor("bg-blue-500 text-white");
    setFormCategory("Utilities");
    setFormFavorite(false);
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  // Open modal in Edit mode
  const openEditModal = (app: CustomApp) => {
    setModalMode("edit");
    setSelectedAppForEdit(app);
    setFormName(app.name);
    setFormType(app.type);
    setFormContent(app.content);
    setFormIcon(app.icon);
    setFormColor(app.color);
    setFormCategory(app.category);
    setFormFavorite(app.favorite);
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  // Handle saving an app (Create or Update)
  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;

    if (!formName.trim()) {
      setFormError("App Name is required");
      return;
    }

    if (!formContent.trim()) {
      setFormError(formType === "html" ? "HTML Content is required" : "URL is required");
      return;
    }

    // Basic URL validation
    if (formType === "url") {
      let cleanedUrl = formContent.trim();
      if (!/^https?:\/\//i.test(cleanedUrl)) {
        cleanedUrl = "https://" + cleanedUrl;
      }
      setFormContent(cleanedUrl);
    }

    setIsSavingApp(true);
    setFormError("");

    try {
      const appData = {
        uid: user.uid,
        name: formName.trim(),
        type: formType,
        content: formContent.trim(),
        icon: formIcon,
        color: formColor,
        category: formCategory,
        favorite: formFavorite,
      };

      if (modalMode === "add") {
        await addDoc(collection(db, "apps"), {
          ...appData,
          createdAt: serverTimestamp(),
        });
      } else if (modalMode === "edit" && selectedAppForEdit) {
        await updateDoc(doc(db, "apps", selectedAppForEdit.id), appData);
      }

      setIsAddEditModalOpen(false);
    } catch (err: any) {
      console.error("Error saving app:", err);
      setFormError("Failed to save. " + err.message);
    } finally {
      setIsSavingApp(false);
    }
  };

  // Handle HTML File Import
  const handleHtmlFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setFormContent(text);
        
        // Auto-fill app name from <title> if it exists
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "text/html");
          const title = doc.querySelector("title")?.textContent;
          if (title && title.trim()) {
            setFormName(title.trim());
          } else {
            const nameWithoutExt = file.name.replace(/\.html$/i, "");
            setFormName(nameWithoutExt);
          }
        } catch (err) {
          const nameWithoutExt = file.name.replace(/\.html$/i, "");
          setFormName(nameWithoutExt);
        }
      }
    };
    reader.readAsText(file);
  };

  // Handle deleting an app
  const handleDeleteApp = async (appId: string) => {
    if (!db) return;
    if (confirm("Are you sure you want to delete this app? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "apps", appId));
      } catch (err) {
        console.error("Failed to delete app:", err);
        alert("Failed to delete app. Please try again.");
      }
    }
  };

  // Safe launcher: Reload app frame
  const reloadRunningApp = () => {
    setIframeKey((prev) => prev + 1);
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-100 dark:bg-zinc-950 font-sans">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium">Launching dashboard...</p>
      </div>
    );
  }

  // 1. Firebase Setup Wizard Screen (If not initialized)
  if (!initialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-100 dark:bg-zinc-950 px-4 py-8 font-sans">
        <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/10">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Firebase Config Required</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Naz Basket needs Firestore & Google Auth credentials</p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4 rounded-lg mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-300">
                  <p className="font-semibold mb-1">How to deploy without this setup wizard:</p>
                  <p>Define the following environment variables in your Hosting Provider or local <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono">.env.local</code> file:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 font-mono text-xs">
                    <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
                    <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
                    <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveWizard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Project ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. nazbasket"
                  value={wizardProjectId}
                  onChange={(e) => setWizardProjectId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">API Key *</label>
                <input
                  type="password"
                  required
                  placeholder="AIzaSyA..."
                  value={wizardApiKey}
                  onChange={(e) => setWizardApiKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Auth Domain (Optional)</label>
                  <input
                    type="text"
                    placeholder="nazbasket.firebaseapp.com"
                    value={wizardAuthDomain}
                    onChange={(e) => setWizardAuthDomain(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Storage Bucket (Optional)</label>
                  <input
                    type="text"
                    placeholder="nazbasket.firebasestorage.app"
                    value={wizardStorageBucket}
                    onChange={(e) => setWizardStorageBucket(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Messaging Sender ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 58392058295"
                    value={wizardSenderId}
                    onChange={(e) => setWizardSenderId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">App ID</label>
                  <input
                    type="text"
                    placeholder="1:58392058295:web:8a92..."
                    value={wizardAppId}
                    onChange={(e) => setWizardAppId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md shadow-blue-500/10 cursor-pointer text-sm"
              >
                Save & Initialize
              </button>
            </form>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Open Firebase Console →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Login Screen
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-100 dark:bg-zinc-950 font-sans">
        {/* Elegant top bar */}
        <header className="w-full px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Naz Basket Logo" className="w-8 h-8 rounded-md shadow-sm object-cover shrink-0" />
            <span className="font-bold text-zinc-900 dark:text-white tracking-tight">Naz Basket</span>
          </div>
          {!hasEnvCredentials && (
            <button
              onClick={() => setIsWizardOpen(true)}
              className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Configure
            </button>
          )}
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto w-full text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 px-3.5 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Now Available</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-3xl leading-[1.1] mb-6">
            Your personal cloud-synced home screen for <span className="text-blue-600">custom HTML apps</span>
          </h1>
          
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mb-10 leading-relaxed">
            Create, store, and run all your custom mini HTML widgets, websites, and single-file tools in one place. Synced automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full sm:w-auto">
            <button
              onClick={handleSignIn}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer text-base"
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
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 p-6 rounded-xl">
              <div className="text-xl mb-2">📦</div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Instant App Storage</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Paste raw HTML scripts, CSS, and JS or web links to deploy code directly in the cloud.</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 p-6 rounded-xl">
              <div className="text-xl mb-2">▶️</div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Sandboxed Runner</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Launch any application in a sandboxed iframe. Secure, isolated, and completely offline-capable.</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 p-6 rounded-xl">
              <div className="text-xl mb-2">📱</div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-1">iOS Home Screen Style</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">A clean, flat layout with wiggle icons, search, quick favorites, and categories.</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full text-center py-6 text-xs text-zinc-400 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 mt-12">
          &copy; {new Date().getFullYear()} Naz Basket. Powered by Firebase.
        </footer>

        {/* Wizard Dialog (if user explicitly chooses manual settings config on login) */}
        {isWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Firebase Client Setup</h3>
                  <button
                    onClick={() => setIsWizardOpen(false)}
                    className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSaveWizard} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Project ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. nazbasket"
                      value={wizardProjectId}
                      onChange={(e) => setWizardProjectId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">API Key</label>
                    <input
                      type="password"
                      required
                      placeholder="AIzaSyA..."
                      value={wizardApiKey}
                      onChange={(e) => setWizardApiKey(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 focus:outline-none text-sm"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => clearFirebaseConfig()}
                      className="px-4 py-2 text-xs font-semibold text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      Clear Saved Config
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Authenticated Dashboard Screen
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 font-sans flex flex-col relative text-zinc-900 dark:text-zinc-50 selection:bg-blue-500 selection:text-white">
      
      {/* iOS Top Bar Widget Section */}
      <header className="w-full max-w-6xl mx-auto px-4 pt-8 pb-4 shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-widest">{currentDateString}</span>
            <div className="flex items-center gap-2.5 mt-0.5">
              <img src="/logo.jpg" alt="Naz Basket Logo" className="w-9 h-9 rounded-md shadow-sm object-cover shrink-0" />
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Naz Basket</h1>
              {isEditMode && (
                <span className="text-xs bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  Edit Mode
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile */}
            <div className="flex items-center gap-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 pl-2.5 pr-4 py-1.5 rounded-full shadow-sm text-sm">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-7 h-7 rounded-full shadow-inner" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user.displayName?.charAt(0) || "U"}
                </div>
              )}
              <span className="font-semibold max-w-[100px] truncate text-zinc-700 dark:text-zinc-300">
                {user.displayName || "User"}
              </span>
            </div>

            {/* Edit Mode Button */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`p-2.5 rounded-full transition-all active:scale-95 shadow-sm border border-zinc-200 dark:border-zinc-900 cursor-pointer ${
                isEditMode
                  ? "bg-rose-600 text-white border-transparent"
                  : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
              title={isEditMode ? "Done editing" : "Edit screen layout"}
            >
              <Settings className={`w-5 h-5 ${isEditMode ? "animate-spin" : ""}`} style={{ animationDuration: '3s' }} />
            </button>

            {/* Logout */}
            <button
              onClick={handleSignOut}
              className="p-2.5 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-900 rounded-full transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Filter and Search Bar */}
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
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
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
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer border ${
                  activeCategory === category
                    ? "bg-blue-600 border-transparent text-white shadow-sm"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Apps Grid Display */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        {appsLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-zinc-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-zinc-500 dark:text-zinc-400 font-medium">Syncing database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-6">
            
            {/* 1. Normal Apps list */}
            {filteredApps.map((app, index) => (
              <div
                key={app.id}
                className={`flex flex-col items-center select-none relative group text-center cursor-pointer`}
                onClick={() => {
                  if (isEditMode) {
                    openEditModal(app);
                  } else {
                    setActiveRunningApp(app);
                  }
                }}
              >
                {/* Wiggle effects applied in edit mode */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl ${app.color} shadow-md flex items-center justify-center text-3xl sm:text-4xl transition-all relative ${
                    isEditMode
                      ? index % 2 === 0
                        ? "animate-wiggle"
                        : "animate-wiggle-alt"
                      : "hover:scale-[1.03] active:scale-95"
                  }`}
                >
                  <span>{app.icon}</span>

                  {/* Favorite Badge (Star icon) */}
                  {app.favorite && (
                    <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white rounded-full p-1 border-2 border-white dark:border-zinc-950 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </div>
                  )}

                  {/* URL Type Icon */}
                  {app.type === "url" && (
                    <div className="absolute top-1 right-1 bg-black/40 text-white rounded-md p-0.5 text-[9px] font-bold scale-[0.8] tracking-wider uppercase">
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
                        handleDeleteApp(app.id);
                      }}
                      className="absolute -top-1.5 -left-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1.5 border-2 border-zinc-100 dark:border-zinc-950 shadow-md active:scale-90 transition-all cursor-pointer z-10"
                      title="Delete app"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(app);
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 border-2 border-zinc-100 dark:border-zinc-950 shadow-md active:scale-90 transition-all cursor-pointer z-10"
                      title="Edit details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {/* App Text Name */}
                <span className="mt-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-full truncate px-1">
                  {app.name}
                </span>
              </div>
            ))}

            {/* 2. Add New App Card (Only visible when not editing layout or as a placeholder) */}
            <div
              onClick={openAddModal}
              className="flex flex-col items-center select-none text-center cursor-pointer group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 group-hover:border-blue-500 transition-all group-active:scale-95 shadow-sm">
                <Plus className="w-8 h-8" />
              </div>
              <span className="mt-2 text-xs font-semibold text-zinc-500 group-hover:text-blue-500 transition-colors">
                Add App
              </span>
            </div>

          </div>
        )}

        {/* Empty state message when search has zero results */}
        {!appsLoading && filteredApps.length === 0 && (
          <div className="mt-8 text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-2xl shadow-sm max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">No apps found</p>
            <p className="text-xs text-zinc-400 mt-1">
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
                className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* 4. Fullscreen Iframe Runner (Slide-in overlay) */}
      {activeRunningApp && (
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
            <div className="flex items-center gap-2 max-w-[50%]">
              <span className="text-xl shrink-0">{activeRunningApp.icon}</span>
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
                onClick={() => setActiveRunningApp(null)}
                className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit Home</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Add / Edit App Drawer Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col my-auto max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">{formIcon}</span>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">
                  {modalMode === "add" ? "Create New App" : `Edit App: ${formName}`}
                </h3>
              </div>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveApp} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* App Type Switch Tabs */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">App Type</label>
                <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFormType("html")}
                    className={`py-2 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      formType === "html"
                        ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    Custom HTML Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType("url")}
                    className={`py-2 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      formType === "url"
                        ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
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
                  <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">App Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Workout Tracker"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Icon (Emoji) *</label>
                <div className="flex gap-2 flex-wrap max-h-24 overflow-y-auto p-2 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-100 dark:border-zinc-900">
                  {PRESET_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormIcon(emoji)}
                      className={`w-9 h-9 rounded-md flex items-center justify-center text-xl transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer ${
                        formIcon === emoji ? "bg-zinc-300 dark:bg-zinc-800 ring-2 ring-blue-500" : ""
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-400">Custom emoji input:</span>
                  <input
                    type="text"
                    maxLength={2}
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-12 text-center py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm font-bold"
                  />
                </div>
              </div>

              {/* Theme Color selectors */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Theme Color</label>
                <div className="flex gap-2.5 flex-wrap">
                  {ICON_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setFormColor(color.bgClass)}
                      className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2 ${color.bgClass} ${
                        formColor === color.bgClass
                          ? "border-blue-500 dark:border-white ring-2 ring-blue-500/25"
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
                    <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                      {formType === "html" ? "HTML Code Content *" : "Web URL Link *"}
                    </label>
                    {formType === "html" ? (
                      <label className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1">
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
                  <textarea
                    rows={10}
                    required
                    placeholder="<!DOCTYPE html>..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-zinc-900"
                  />
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="https://example.com"
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="formFavorite" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 select-none cursor-pointer flex items-center gap-1.5">
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
              <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingApp}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {isSavingApp && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  <span>Save App</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
