DECIDE. | Daily Priority Tool

Decide your day in 60 seconds.

DECIDE is a minimalist, local-first web application designed to help users focus on what truly matters. Instead of managing endless to-do lists, DECIDE forces clarity by limiting users to exactly three priorities per day.

🔗 Live Demo: decide.toolblaster.com

🧠 Philosophy

Simplicity > Features: No folders, tags, or sub-tasks.

Calm > Motivation: No aggressive gamification or bright colors.

Habit > Engagement: Designed for a 60-second daily session, not infinite scrolling.

Local-First: Data lives on the user's device. No login required.

✨ Key Features

V1: Core Functionality

Daily Input: Exactly three priority slots.

Auto-Reset: The interface clears automatically at local midnight.

Read-Only Mode: Once saved, the day is locked to prevent tinkering.

Local Storage: All data is persisted in browser localStorage.

V2: Habit & Retention (Invisible Features)

Yesterday Recall: If priorities were set yesterday, they are shown gently in the morning view to provide context.

Evening Closure: Opening the app after 6 PM triggers a reflection question: "Did you do what mattered?"

Hidden Streaks: Tracks consistency internally to unlock features (see V3).

Weekly Glimpse: Every 7 days, a text-based summary of keywords appears.

V3: Advanced Features

Intentional Edit: Users can edit today's priorities, but only after a confirmation modal ("gentle friction") to discourage indecision.

Dark Mode: Manual toggle (Sun/Moon) with persistence.

PWA Support: Installable on mobile home screens (iOS/Android) with offline support.

Data Export (Gated):

Constraint: Export button only appears after 7 days of usage.

Monetization Layer: Includes a "Calm Paywall" simulation before unlocking exports.

Formats: Weekly PDF, Monthly PDF, and CSV.

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


🤖 Project Context for AI Agents

If you are an AI modifying this codebase, adhere to these directives:

Architecture: This is a Single-File Application (SPA) architecture contained within index.html. Logic is inline (or closely coupled). Do not split into a complex React/Vue build unless explicitly asked.

No Libraries: Use Vanilla JS and Tailwind CSS via CDN. No npm install.

Logic Gating: Features in V2/V3 (like Export or Reflection) depend on Time or State (e.g., hour >= 18 or streak >= 7). Do not remove these gates; they are essential to the product design.

Tone: UX copy must remain calm, minimal, and non-judgmental.

🛠 Tech Stack

Architecture: HTML5 + Vanilla JS (ES6+).

Styling: Tailwind CSS (via CDN).

Storage: Browser LocalStorage (No Backend).

PDF Generation: jsPDF + jspdf-autotable (via CDN).

Icons: Inline SVG.

🚀 How to Deploy

Since DECIDE is a self-contained static site, deployment is instant.

Download: Save the index.html file.

Upload: Upload it to any static hosting provider:

GitHub Pages

Netlify (Drag & Drop)

Vercel

Shared Hosting (cPanel/FTP)

Monetization (AdSense):

Search index.html for <!-- PASTE YOUR AD CODE HERE -->.

Paste your Google AdSense script code inside the container.

🧪 Developer Cheatsheets

Use these snippets in the browser console (F12) to test hidden V2/V3 features instantly.

1. Force "Evening Closure" Mode (Reflection)

// Simulates 7 PM
const originalDate = Date;
window.Date = class extends originalDate {
  getHours() { return 19; }
};
ui.render();


2. Unlock Export Button (Force 7-day streak)

// Fakes a 7-day history count
// Note: This just shows the button; generating the PDF requires actual data in store.data
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
