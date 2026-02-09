DECIDE. | Daily Priority Tool (Stable Artifact)

Decide your day in 60 seconds.

DECIDE is a minimalist, local-first web application designed to help users focus on what truly matters. Instead of managing endless to-do lists, DECIDE forces clarity by limiting users to exactly three priorities per day.

This version (V1.1) is engineered as a "Build-and-Forget" artifact. It is designed to run correctly for years without developer maintenance, server updates, or dependency management.

🔗 Live Demo: decide.toolblaster.com

📂 Project Structure

Ensure you upload all these files to your host:

/ (Root)
├── index.html                # Main Application
├── robots.txt                # Crawler directives
├── sitemap.xml               # SEO Index
├── README.md                 # Documentation
├── js/
│   └── app.js                # Core Application Logic
├── pages/
│   ├── about.html            # Brand Story
│   ├── why-three.html        # Philosophy & FAQ
│   └── privacy-policy-terms.html  # Legal
└── favicon/                  # Icons & Manifests
    └── ...


🛡️ The Stability Engine (V1.1)

This codebase has been hardened to function indefinitely on static hosting.

The Midnight Switch (Visibility API):

The app listens for when the user unlocks their phone or switches tabs.

If the date has changed while the app was in the background, it automatically refreshes the UI to a fresh day.

Silent Data Backup (Self-Healing):

Every save operation writes to both a Main key and a Backup key in LocalStorage.

If the browser corrupts the main data, the app silently restores from the backup on the next launch.

Pinned Dependencies:

Tailwind CSS is locked to version 3.4.1.

The layout is guaranteed not to break regardless of future library updates.

✨ Key Features

HTML-First Architecture: Content loads instantly before JavaScript runs.

V3 Activation Logic: Features like "Export" unlock silently after 7 days of consistent usage.

SEO Optimized: Full meta tags, JSON-LD structured data, and sitemaps included.

Zero-Maintenance: No database, no backend, no API keys to manage.

🚀 How to Deploy

Prepare: Ensure you have the full folder structure listed above.

Upload: Drag and drop the entire folder to any static hosting provider:

Netlify / Vercel: Connect to your Git repo or drag the folder to their dashboard.

GitHub Pages: Push the files to a repository and enable Pages from settings.

AWS S3 / Shared Hosting: Upload all files via FTP/Console ensuring the directory structure (/js, /pages) is preserved.

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
store.save(); 
ui.render();


3. Reset App (Clear Data)

localStorage.clear();
location.reload();


📄 License

This project is created for ToolBlaster.
Feel free to use, modify, and deploy for personal or commercial use.
