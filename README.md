DECIDE. | Daily Priority Tool (Stable Artifact)

Decide your day in 60 seconds.

DECIDE is a minimalist, local-first web application designed to help users focus on what truly matters. Instead of managing endless to-do lists, DECIDE forces clarity by limiting users to exactly three priorities per day.

This version (V1.1) is engineered as a "Build-and-Forget" artifact. It is designed to run correctly for years without developer maintenance, server updates, or dependency management.

🔗 Live Demo: decide.toolblaster.com

🛡️ The Stability Engine (New in V1.1)

This codebase has been hardened to function indefinitely on static hosting.

The Midnight Switch (Visibility API):

The app listens for when the user unlocks their phone or switches tabs.

If the date has changed while the app was in the background, it automatically refreshes the UI to a fresh day. No manual reload required.

Silent Data Backup (Self-Healing):

Every save operation writes to both a Main key and a Backup key in LocalStorage.

If the browser corrupts the main data (common during crashes or aggressive cache clearing), the app silently restores from the backup on the next launch. The user never sees a crash.

Pinned Dependencies:

Tailwind CSS is locked to version 3.4.1.

The layout is guaranteed not to break regardless of future library updates.

🧠 Philosophy

Simplicity > Features: No folders, tags, or sub-tasks.

Calm > Motivation: No aggressive gamification or bright colors.

Habit > Engagement: Designed for a 60-second daily session, not infinite scrolling.

Local-First: Data lives on the user's device. No login required.

HTML-First: Content is visible immediately, ensuring speed and SEO even before JavaScript runs.

✨ Key Features

V1: Core Functionality (Active)

Daily Input: Exactly three priority slots.

Auto-Reset: The interface clears automatically at local midnight.

Read-Only Mode: Once saved, the day is locked to prevent tinkering.

Local Storage: All data is persisted in browser localStorage.

V2: Habit & Retention (Active - Invisible Logic)

Yesterday Recall: If priorities were set yesterday, they are shown gently in the morning view to provide context.

Evening Closure: Opening the app after 6 PM triggers a reflection question: "Did you do what mattered?"

Hidden Streaks: Tracks consistency internally to unlock features.

V3: Advanced & Monetization (Gated)

Intentional Edit: "Edit priorities" button with a confirmation modal ("gentle friction").

Dark Mode: Manual toggle (Sun/Moon) with persistence.

Export & Paywall (Disabled by Default): Code for PDF/CSV export exists but is disabled via the ENABLE_V3 flag.

💾 Data Model (LocalStorage)

All data is stored locally. The app manages two sets of keys for redundancy.

Primary Data: decide_data_v1
Silent Backup: decide_data_v1_bak

{
  "YYYY-MM-DD": {
    "priorities": ["Priority 1", "Priority 2", "Priority 3"],
    "decidedAt": 1707436800000,
    "closure": "yes" // Options: "yes", "partial", "no", null
  }
}


Metadata: decide_meta_v1
Silent Backup: decide_meta_v1_bak

{
  "streak": 5,
  "lastOpened": "YYYY-MM-DD",
  "isPremium": false
}


Theme Preference: decide_theme_v1 ("light" | "dark")

🛠 Tech Stack

Architecture: Single-File HTML (HTML-First + JS Hydration).

Styling: Tailwind CSS (CDN pinned to 3.4.1).

Storage: Browser LocalStorage (Dual-Write Architecture).

PDF Generation: jsPDF + jspdf-autotable (via CDN).

Icons: Inline SVG.

Note: The application logic is embedded directly within index.html to ensure zero build steps and instant deployment.

🚀 How to Deploy

Since DECIDE is a self-contained single file, deployment is instant.

Download: Save the index.html file.

Upload: Upload it to any static hosting provider:

GitHub Pages

Netlify (Drag & Drop)

Vercel

Shared Hosting (cPanel/FTP)

Amazon S3 bucket

It requires no database and no server maintenance.

🧪 Developer Cheatsheets

Use these snippets in the browser console (F12) to test hidden features.

1. Force "Evening Closure" Mode (Reflection)

// Simulates 7 PM
const originalDate = Date;
window.Date = class extends originalDate {
  getHours() { return 19; }
};
ui.render();


2. Unlock Export Button (Test V3)

// Force enable V3 logic temporarily
const ENABLE_V3 = true;

// Create fake 7-day history to unlock the button
store.data = {}; 
for(let i=0; i<7; i++) {
    let d = new Date(); d.setDate(d.getDate()-i);
    store.data[d.toISOString().split('T')[0]] = { priorities: ["Test", "Data", "Here"] };
}
store.save(); // This triggers backup creation too
ui.render();


3. Reset App (Clear Data)

localStorage.clear();
location.reload();


📄 License

This project is created for ToolBlaster.
Feel free to use, modify, and deploy for personal or commercial use.
