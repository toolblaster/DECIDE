const DB_KEY='decide_data_v1', META_KEY='decide_meta_v1', THEME_KEY='decide_theme_v1';
// Feature flag for V3 code, logic now controlled by meta.v3Enabled
const ENABLE_V3 = true; 

const store = {
    data: {}, 
    // V3: Added v3Enabled, events object for tracking eligibility criteria
    meta: { streak: 0, lastOpened: null, isPremium: false, v3Enabled: false, events: { yesterday: false, closure: false, weekly: false }, lastWeeklySummary: null },
    init() {
        // Robust initialization with silent backup restore
        try {
            const rD = localStorage.getItem(DB_KEY);
            const bD = localStorage.getItem(DB_KEY + '_bak');
            
            if (rD) {
                this.data = JSON.parse(rD);
            } else if (bD) {
                console.warn('Main data missing, restoring from silent backup.');
                this.data = JSON.parse(bD);
                this.save(); // Heal the main storage
            } else {
                this.data = {}; // Fresh start
            }
            
            // Metadata check
            const rM = localStorage.getItem(META_KEY);
            if (rM) {
                this.meta = JSON.parse(rM);
                // V3 Data Migration: Ensure new fields exist
                if (this.meta.v3Enabled === undefined) this.meta.v3Enabled = false;
                if (!this.meta.events) this.meta.events = { yesterday: false, closure: false, weekly: false };
            } else {
                // Attempt backup for meta
                const bM = localStorage.getItem(META_KEY + '_bak');
                this.meta = bM ? JSON.parse(bM) : { streak: 0, lastOpened: null, isPremium: false, v3Enabled: false, events: { yesterday: false, closure: false, weekly: false }, lastWeeklySummary: null };
            }
            
        } catch (e) {
            console.error('Critical Data Corruption:', e);
            // Last ditch attempt to load backup if main parse failed
            try {
                const bD = localStorage.getItem(DB_KEY + '_bak');
                if (bD) {
                        this.data = JSON.parse(bD);
                        console.log('Restored corrupted main data from backup');
                } else {
                    this.data = {};
                }
            } catch (e2) {
                    this.data = {}; // Total reset required
            }
        }
    },
    save() {
        try {
            // Save Main
            const sD = JSON.stringify(this.data);
            localStorage.setItem(DB_KEY, sD);
            // Save Silent Backup (Shadow Copy)
            localStorage.setItem(DB_KEY + '_bak', sD);
            
            const sM = JSON.stringify(this.meta);
            localStorage.setItem(META_KEY, sM);
            // Save Silent Meta Backup
            localStorage.setItem(META_KEY + '_bak', sM);
        } catch (e) {
            console.error('Storage Save Failed (Quota?):', e);
        }
    },
    getLocalYMD(d=new Date()){ 
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; 
    },
    getToday() { const t = this.getLocalYMD(); return { date: t, entry: this.data[t] }; },
    getYesterday() { 
        const d = new Date(); d.setDate(d.getDate()-1); 
        const y = this.getLocalYMD(d); return { date: y, entry: this.data[y] }; 
    },
    saveDay(p) {
        const {date} = this.getToday();
        this.data[date] = { priorities: p, decidedAt: Date.now(), closure: null };
        if(this.getYesterday().entry) this.meta.streak++; else this.meta.streak = 1;
        this.meta.lastOpened = date; this.save();
        this.checkV3Eligibility(); // Check on save
    },
    saveClosure(r) { const {date,entry}=this.getToday(); if(entry){ entry.closure=r; this.save(); } },
    upgrade() { this.meta.isPremium = true; this.meta.v3Enabled = true; this.save(); },
    
    // V3: Event Tracking Helper
    trackEvent(eventName) {
        if (this.meta.events[eventName] === true) return;
        this.meta.events[eventName] = true;
        this.save();
        this.checkV3Eligibility();
    },
    
    // V3: Eligibility Logic
    checkV3Eligibility() {
        if (this.meta.v3Enabled) return; // Already active

        // 1. Data Count (7 distinct days)
        const dates = Object.keys(this.data).sort();
        if (dates.length < 7) return;

        // 2. Data Span (7 calendar days)
        const first = new Date(dates[0]);
        const last = new Date(dates[dates.length - 1]);
        const diffTime = Math.abs(last - first);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays < 6) return; // 7 days span means diff is at least 6 (Mon to Sun)

        // 3. Experience Check
        const e = this.meta.events;
        if (e.yesterday && e.closure && e.weekly) {
            // Activate V3
            this.meta.v3Enabled = true;
            this.meta.isPremium = true; // Legacy compat
            this.save();
        }
    }
};

const ui = {
    renderedDate: null,
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.render();
        
        // Visibility Logic (Replaces Background Timers)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                const currentYMD = store.getLocalYMD();
                // If the day changed while the app was hidden, refresh UI
                if (this.renderedDate && this.renderedDate !== currentYMD) {
                    console.log('New day detected, refreshing UI...');
                    this.render();
                }
            }
        });
    },
    cacheDOM() {
        this.dom = {
            dateDisplay: document.getElementById('current-date-display'),
            form: document.getElementById('priority-form'),
            inputs: [document.getElementById('p1'), document.getElementById('p2'), document.getElementById('p3')],
            mainBtn: document.getElementById('main-action-btn'),
            trustBadges: document.getElementById('trust-badges'),
            streakMsg: document.getElementById('streak-msg'),
            readonlyView: document.getElementById('readonly-view'),
            readonlyList: document.getElementById('readonly-list'),
            yesterdaySection: document.getElementById('yesterday-section'),
            yesterdayList: document.getElementById('yesterday-list'),
            closureSection: document.getElementById('closure-section'),
            weeklyGlimpse: document.getElementById('weekly-glimpse'),
            footerStatus: document.getElementById('footer-status'),
            statusText: document.getElementById('status-text-container'),
            controls: document.getElementById('footer-controls'),
            themeBtn: document.getElementById('theme-toggle'),
            editBtn: document.getElementById('edit-btn'),
            editModal: document.getElementById('edit-modal'),
            cancelEdit: document.getElementById('cancel-edit-btn'),
            confirmEdit: document.getElementById('confirm-edit-btn'),
            paywallModal: document.getElementById('paywall-modal'),
            exportModal: document.getElementById('export-options-modal'),
            upgradeBtn: document.getElementById('upgrade-btn'),
            closePaywall: document.getElementById('paywall-close-btn'),
            closeExport: document.getElementById('export-close-btn'),
            introBlock: document.getElementById('intro-block') 
        };
    },
    bindEvents() {
        this.dom.themeBtn.addEventListener('click', () => this.toggleTheme());
        this.dom.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.dom.editBtn.addEventListener('click', () => this.dom.editModal.classList.add('modal-active'));
        this.dom.cancelEdit.addEventListener('click', () => this.dom.editModal.classList.remove('modal-active'));
        this.dom.confirmEdit.addEventListener('click', () => this.enterEditMode());
        
        // Closure buttons
        document.querySelectorAll('.closure-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                store.saveClosure(e.target.getAttribute('data-val'));
                this.render();
            });
        });
        
        // Paywall/Export bindings
        this.dom.closePaywall.addEventListener('click', () => this.dom.paywallModal.classList.remove('modal-active'));
        this.dom.closeExport.addEventListener('click', () => this.dom.exportModal.classList.remove('modal-active'));
        // V3: Upgrade button is mostly dead code now but kept for safety
        this.dom.upgradeBtn.addEventListener('click', () => {
            store.upgrade();
            this.dom.paywallModal.classList.remove('modal-active');
            this.dom.exportModal.classList.add('modal-active');
        });
        
        // Export Actions
        document.getElementById('export-weekly').addEventListener('click', () => { /* Logic */ });
        document.getElementById('export-monthly').addEventListener('click', () => { /* Logic */ });
        document.getElementById('export-csv').addEventListener('click', () => { /* Logic */ });
    },
    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
        this.updateThemeIcon(isDark);
    },
    updateThemeIcon(isDark) {
        const sun = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
        const moon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
        this.dom.themeBtn.innerHTML = isDark ? sun : moon;
    },
    handleSubmit(e) {
        e.preventDefault();
        const p = this.dom.inputs.map(i => i.value.trim()).filter(v => v);
        if (p.length === 3) {
            store.saveDay(p);
            this.render(this.isEditing ? "✓ Priorities updated." : null);
            this.isEditing = false;
        }
    },
    enterEditMode() {
        this.dom.editModal.classList.remove('modal-active');
        this.isEditing = true;
        const { entry } = store.getToday();
        // Populate inputs
        entry.priorities.forEach((val, i) => this.dom.inputs[i].value = val);
        // Switch view
        this.dom.form.classList.remove('hidden-app');
        this.dom.readonlyView.classList.add('hidden-app');
        this.dom.introBlock.classList.remove('hidden-app'); 
        
        // Update button text
        this.dom.mainBtn.innerHTML = "Save changes";
        this.dom.trustBadges.classList.add('hidden-app'); 
    },
    render(customMsg = null) {
        store.init();
        const { date, entry } = store.getToday();
        this.renderedDate = date; // Track date for visibility check

        const yesterday = store.getYesterday();
        const now = new Date();

        // 1. Update Date
        this.dom.dateDisplay.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        this.updateThemeIcon(document.documentElement.classList.contains('dark'));

        // V3: Weekly Glimpse Logic (Check if needed)
        const allDates = Object.keys(store.data).sort();
        if (allDates.length >= 7) {
            const lastSummary = store.meta.lastWeeklySummary;
            const daysSinceSummary = lastSummary ? Math.ceil(Math.abs(new Date(date) - new Date(lastSummary)) / (1000 * 60 * 60 * 24)) : 99;
            
            // Show if new week (simple 7 day check)
            if (daysSinceSummary >= 7) {
                    // Build simplistic summary from keywords
                    const recent = allDates.slice(-7).map(d => store.data[d].priorities).flat();
                    const words = recent.map(s => s.split(' ')[0]).filter(w => w.length > 3).slice(0, 3);
                    const summaryText = words.length ? `Trends: ${words.join(', ')}` : "You've been consistent this week.";
                    
                    this.dom.weeklyGlimpse.innerHTML = `
                    <h3 class="text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 uppercase tracking-wide">Weekly Glimpse</h3>
                    <p class="text-stone-800 dark:text-stone-200 text-lg italic">"${summaryText}"</p>
                    `;
                    this.dom.weeklyGlimpse.classList.remove('hidden-app');
                    store.trackEvent('weekly'); // Track for V3
                    // Don't save lastWeeklySummary here to avoid loop, save only on a specific trigger or just let it float based on tracking
                    // Actually, we must save it to prevent showing every render.
                    // But for V3 criteria, we just need 'trackEvent'.
                    // Let's only track once per day/session logic effectively.
                    if (!store.meta.events.weekly) store.trackEvent('weekly'); 
            } else {
                this.dom.weeklyGlimpse.classList.add('hidden-app');
            }
        }

        // 2. Main View Toggle
        if (!entry || this.isEditing) {
            // Show Input Mode
            this.dom.form.classList.remove('hidden-app');
            this.dom.readonlyView.classList.add('hidden-app');
            this.dom.introBlock.classList.remove('hidden-app'); 
            
            // Yesterday Recall
            if (yesterday.entry && !this.isEditing) {
                this.dom.yesterdaySection.classList.remove('hidden-app');
                this.dom.yesterdayList.innerHTML = yesterday.entry.priorities.map(p => `<li class="text-stone-500 line-through decoration-stone-300 dark:decoration-stone-700">${p}</li>`).join('');
                store.trackEvent('yesterday'); // V3 Track
            } else {
                this.dom.yesterdaySection.classList.add('hidden-app');
            }
            
            // Reset button text if not editing
            if (!this.isEditing) {
                this.dom.mainBtn.innerHTML = 'Decide Today <span>&rarr;</span>';
                this.dom.trustBadges.classList.remove('hidden-app');
                this.dom.inputs.forEach(i => i.value = ''); 
            }

        } else {
            // Show Read-only Mode
            this.dom.form.classList.add('hidden-app');
            this.dom.readonlyView.classList.remove('hidden-app');
            this.dom.yesterdaySection.classList.add('hidden-app');
            this.dom.closureSection.classList.add('hidden-app'); 

            // Populate List
            this.dom.readonlyList.innerHTML = entry.priorities.map((p, i) => `
                <div class="flex items-baseline space-x-4 border-b border-transparent py-2">
                    <span class="text-stone-400 font-mono text-sm">0${i+1}</span>
                    <span class="text-lg text-stone-800 dark:text-stone-100">${p}</span>
                </div>
            `).join('');

            // Logic: Evening Closure vs Footer
            if (now.getHours() >= 18 && !entry.closure) {
                this.dom.closureSection.classList.remove('hidden-app');
                this.dom.footerStatus.classList.add('hidden-app');
                store.trackEvent('closure'); // V3 Track
            } else {
                this.dom.footerStatus.classList.remove('hidden-app');
                const msg = customMsg || (entry.closure ? "Day complete." : "Come back tomorrow.");
                this.dom.statusText.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>${msg}</span>`;
                
                // V3 Export Button Injection (Only if eligible)
                this.dom.controls.innerHTML = '';
                if (store.meta.v3Enabled) { // Check eligibility flag directly
                        const btn = document.createElement('button');
                        btn.className = "hover:text-stone-600 dark:hover:text-stone-300 underline decoration-stone-200";
                        btn.innerText = "Export";
                        // V3: Direct access, no paywall
                        btn.onclick = () => this.dom.exportModal.classList.add('modal-active');
                        this.dom.controls.appendChild(btn);
                }
            }
        }
    },
    scrollToTool() {
        document.getElementById('date-header').scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => this.dom.inputs[0].focus(), 800);
    }
};

// Boot
document.addEventListener('DOMContentLoaded', () => ui.init());