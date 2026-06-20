# Naz Basket Design System & Theme Specifications

This document outlines the design tokens, typography, and styling components that define the **Naz Basket** launcher. Use this specification to style custom HTML widgets or mini-apps so they blend seamlessly with the host interface.

## 1. Typography
- **UI & Controls Font**: `Plus Jakarta Sans`, sans-serif (clean, high-readability sans-serif).
- **Brand Cursive Font**: `Satisfy`, cursive (used for main titles and cursive branding overlays).
- **Technical & Code Font**: `JetBrains Mono`, monospace (used for source editors, logs, and technical readouts).

## 2. Color Palette & Gradients
- **Brand Accent Gradient**: `from-cyan-500 to-teal-500` (Electric Cyan to Teal).
- **Light Theme Backgrounds**:
  - Main viewport: `bg-zinc-100` (`#f4f4f5`)
  - Panels/Cards: `bg-white` (`#ffffff`)
- **Dark Theme Backgrounds**:
  - Main viewport: `bg-zinc-950` (`#09090b`)
  - Panels/Cards: `bg-zinc-900` (`#18181b`)
- **Interactive States**:
  - Accent actions: `bg-teal-600` (`#0d9488`) / hover: `bg-teal-700` (`#0f766e`)
  - Destructive/Logout: `bg-rose-600` (`#e11d48`) / hover: `bg-rose-700` (`#be123c`)
  - Border focus: Focus outline with teal-500 ring (`focus:ring-2 focus:ring-teal-500`).

## 3. UI Styling & Layout Tokens
- **Borders & Outlines**: Clean, thin borders:
  - Light mode: `border-zinc-200`
  - Dark mode: `border-zinc-800`
- **Border Radii**:
  - Cards & Modals: `rounded-2xl` (large) or `rounded-xl` (medium)
  - Inputs & Buttons: `rounded-lg` (small)
- **Glassmorphic Overlays**: Dropdowns, alerts, and bottom navigation bars use glassmorphic effects:
  - Background: `bg-white/75` (light) / `bg-zinc-900/80` (dark)
  - Blur filter: `backdrop-blur-md`
- **Animations**:
  - Accent border transition on hover (e.g. `hover:border-teal-500`).
  - Subtle wiggle or scale transitions on cards to denote interactive states.

## 4. CSS Variable Setup
For custom mini-apps to load the design rules automatically, embed this Tailwind config or styling block:
```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          mono: ['"JetBrains Mono"', 'monospace'],
        },
        colors: {
          brandCyan: '#06b6d4',
          brandTeal: '#14b8a6',
        }
      }
    }
  }
</script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
</style>
```
