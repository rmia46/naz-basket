# LaunchPad 🚀 - Custom HTML App Hub

**LaunchPad** is a personal app collection manager that acts as a "home screen" for your custom HTML mini-apps, widgets, and external web links. It runs on **Next.js 16** with **Tailwind CSS**, styled with a **flat, desktop-and-mobile responsive iOS layout** (without glassmorphism or filter blurs).

All configuration is backed by **Firebase Auth (Google Sign-In)** and **Cloud Firestore** for automated, real-time database sync across your devices.

---

## ✨ Features
1. **Google Auth**: Secure Google Sign-In keeps your collection isolated, private, and personal.
2. **Double App Types**: Run raw **HTML Code** (fully sandboxed inside an iframe) or **Web URLs**.
3. **Flat iOS Design**: Responsive grid matching iOS squircles with custom theme colors, emojis, category horizontal selection, and a Google profile summary widget.
4. **Layout Edit Mode**: A custom wiggle/wobble animation with edit/delete badges that makes configuring your layout easy and fun.
5. **Quick-Search & Favorites**: Pin most-used widgets to the top of your deck and instant search.
6. **Iframe Controller**: Full-screen sandboxed app runner with a flat bottom control tray containing Exit Home, Refresh App, and Open URL in tab (fallback for iframe blockers).
7. **Firebase Config Wizard**: Zero initial configuration! If you run it without environment variables, LaunchPad opens a beautiful credentials wizard that saves settings locally in your browser (`localStorage`).

---

## 🛠️ Getting Started

### 1. Run Locally
First, install the dependencies:
```bash
npm install
```

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Firebase Setup & Configuration

There are **two ways** to initialize Firebase in LaunchPad:

### Method A: Setup Wizard (No Code/Easiest)
1. Run the app locally or open your hosted deployment.
2. You will be greeted by the **Firebase Config Required** setup wizard.
3. Go to the [Firebase Console](https://console.firebase.google.com/), select your project, click **Project Settings** (gear icon) -> **General**, and scroll down to **Your apps** to copy your Web App configuration.
4. Paste the credentials into the wizard and click **Save & Initialize**. The configurations are stored in `localStorage` securely.

### Method B: Environment Variables (Production Ready)
Create a `.env.local` file in the root of the project:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_optional
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_optional
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_optional
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_optional
```

---

## 📦 Building & Deploying to Firebase Hosting

This project is configured for **Static HTML Export** (client-side only).

### 1. Build the Static Files
Run the build script:
```bash
npm run build
```
This compiles the Next.js App Router static assets into the `out/` directory.

### 2. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 3. Log In and Deploy
Initialize the Firebase configuration (select Hosting, choose `out` as your public directory, and use single page rewrite redirects):
```bash
firebase login
firebase init hosting
```

Deploy your static build to Firebase Hosting:
```bash
firebase deploy
```

---

## 🛡️ Database & Rule Configurations
Ensure that **Firestore Database** is enabled in your Firebase console.

Add the security rules below in your console under Firestore Rules (already defined locally in `firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /apps/{appId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

---

## 📐 Architecture
- [src/app/page.tsx](file:///home/roman/links/projects/launchpad/src/app/page.tsx): Main client dashboard, CRUD forms, and iframe sandboxed app executor.
- [src/app/globals.css](file:///home/roman/links/projects/launchpad/src/app/globals.css): Core styles containing wiggle animations (`@keyframes wiggle` / `wiggle-alt`).
- [src/lib/firebase.ts](file:///home/roman/links/projects/launchpad/src/lib/firebase.ts): Auto-fallback Firebase initializations.
- [next.config.ts](file:///home/roman/links/projects/launchpad/next.config.ts): Static export output options.
