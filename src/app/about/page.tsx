import React from "react";
import Link from "next/link";
import { X, User, Shield, Layers, Cpu, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 font-sans flex flex-col text-zinc-900 dark:text-zinc-50 transition-colors duration-200">
      {/* Top Header Navigation */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 shrink-0">
        {/* Brand Logo & Name on the Left */}
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Naz Basket Logo" className="w-7 h-7 rounded-md shadow-sm object-cover" />
          <span className="font-black text-lg tracking-tight select-none">
            Naz<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">Basket</span>
          </span>
        </div>

        {/* Close Button on the Right */}
        <Link
          href="/"
          className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors cursor-pointer"
          title="Close About Page"
        >
          <X className="w-5 h-5" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 p-0.5 shadow-lg">
            <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-2xl flex items-center justify-center overflow-hidden">
              <img src="/logo.jpg" alt="Naz Basket Logo" className="w-[85%] h-[85%] object-cover rounded-xl" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              About <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Naz Basket</span>
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Personal Single-File HTML Application Hub & Runner
            </p>
          </div>
        </section>

        {/* Project Overview Card */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="font-extrabold text-lg text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
            Overview
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Naz Basket is a lightweight, cloud-synced home screen designed to host, run, and organize custom single-file HTML applications, widgets, and external URLs. Inspired by modern dashboard and hub designs, it provides fully responsive app grids, folders, search, categories, and wiggle animation edit controls. All applications run in sandboxed iframes, keeping your custom code isolated and safe.
          </p>
        </section>

        {/* Project Details Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Author Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Author</span>
              <span className="font-extrabold text-base text-zinc-900 dark:text-white block">Roman Mia</span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Project Architect & Developer</p>
            </div>
          </div>

          {/* Source Code Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div className="space-y-1 block min-w-0 flex-1">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Source Code</span>
              <a
                href="https://github.com/rmia46/naz-basket"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-base text-purple-600 dark:text-purple-400 hover:underline block truncate"
              >
                GitHub Repository
              </a>
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 block truncate" title="git@github.com:rmia46/naz-basket.git">
                rmia46/naz-basket
              </span>
            </div>
          </div>
        </section>

        {/* Technical Architecture Section */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="font-extrabold text-lg text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
            Technical Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Sandboxed Runner</h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                App widgets run within secure HTML5 iframes configured with strict sandbox controls, blocking unwanted external storage manipulation or cookie sharing.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Firebase Sync</h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Integrated with client-side Google Firebase Authentication and Cloud Firestore for seamless cross-device synchronization and instant updates.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Dynamic App Desktop</h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Includes categories, favorites, global search, and dynamic wiggling icons to organize your tools on a personal desktop workspace.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">AI Companion Hub</h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Built-in prompt engineering hub linked to Google Gemini and DeepSeek Chat to help write custom, single-file HTML modules with ease.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-zinc-400 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 mt-12 shrink-0">
        &copy; {new Date().getFullYear()} Naz Basket. Author: Roman Mia. All rights reserved.
      </footer>
    </div>
  );
}
