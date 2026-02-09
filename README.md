DECIDE. | Daily Priority Tool

Decide your day in 60 seconds.

DECIDE is a minimalist, local-first web application designed to help users focus on what truly matters. Instead of managing endless to-do lists, DECIDE forces clarity by limiting users to exactly three priorities per day.

🔗 Live Demo: decide.toolblaster.com

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

Hidden Streaks: Tracks consistency internally to unlock features (see V3).

Weekly Glimpse: Every 7 days, a text-based summary of keywords appears.

V3: Advanced & Monetization (Gated)

Intentional Edit: "Edit priorities" button with a confirmation modal ("gentle friction").

Dark Mode: Manual toggle (Sun/Moon) with persistence.

PWA Support: Installable on mobile home screens (iOS/Android).

Data Export & Paywall (Disabled by Default):

Code for PDF/CSV export and the "Calm Paywall" is included but disabled via the ENABLE_V3 flag in the source code.

Use the cheatsheet below to test or enable it for launch.

💾 Data Model (LocalStorage)

Crucial for understanding app state logic.

Key: decide_data_v1 (Stores daily entries)

{
  "YYYY-MM-DD": {
    "priorities": ["Priority 1", "Priority 2", "Priority 3"],
    "decidedAt": 1707436800000, // Unix Timestamp
    "closure": "yes" // Options: "yes", "partial", "no", null
  }
}


Key: decide_meta_v1 (Stores app metadata & habits)

{
  "streak": 5, // Consecutive days count
  "lastOpened": "YYYY-MM-DD",
  "lastWeeklySummary": "YYYY-MM-DD", // Date summary was last shown
  "isPremium": false // Boolean flag for V3 export features
}


Key: decide_theme_v1 (UI Preference)

"light" | "dark"


🛠 Tech Stack

Architecture: Single-File HTML (HTML-First + JS Hydration).

Styling: Tailwind CSS (via CDN).

Storage: Browser LocalStorage (No Backend).

PDF Generation: jsPDF + jspdf-autotable (via CDN).

Icons: Inline SVG.

Note on Architecture: The application logic is embedded directly within index.html to ensure zero build steps and instant deployment.

🚀 How to Deploy

Since DECIDE is a self-contained single file, deployment is instant.

Download: Save the index.html file.

Upload: Upload it to any static hosting provider:

GitHub Pages

Netlify (Drag & Drop)

Vercel

Shared Hosting (cPanel/FTP)

Monetization (Optional):

Search index.html for ENABLE_V3 and set it to true to enable the Paywall/Export logic.

Search for the .ad-container class logic if you wish to re-enable Adsense slots (currently removed for clean launch).

🧪 Developer Cheatsheets

Use these snippets in the browser console (F12) to test hidden V2/V3 features instantly.

1. Force "Evening Closure" Mode (Reflection)

// Simulates 7 PM
const originalDate = Date;
window.Date = class extends originalDate {
  getHours() { return 19; }
};
ui.render();


2. Unlock Export Button (Test V3)
First, ensure const ENABLE_V3 = true; is set in the source code, or paste this:

// Force enable V3 logic temporarily
const ENABLE_V3 = true;

// Create fake 7-day history to unlock the button
store.data = {}; 
for(let i=0; i<7; i++) {
    let d = new Date(); d.setDate(d.getDate()-i);
    store.data[d.toISOString().split('T')[0]] = { priorities: ["Test", "Data", "Here"] };
}
store.save();
ui.render();


3. Reset App (Clear Data)

localStorage.clear();
location.reload();


📄 License

This project is created for ToolBlaster.
Feel free to use, modify, and deploy for personal or commercial use.
