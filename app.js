// ==========================================
// toldik def - Main Application Controller
// ==========================================

const App = {
    state: {
        balance: 1000,
        wins: 0,
        losses: 0,
        totalBets: 0,
        soundEnabled: true,
        reactorCharging: false,
        audioCtx: null,
        mouse: { x: null, y: null, active: false },
        upgrades: {
            burmalda: 0,
            slots: 0,
            mines: 0,
            crash: 0,
            wheel: 0
        },
        inventory: []
    },

    upgradesConfig: {
        burmalda: { name: "Бурмалдовый Генератор", desc: "Увеличивает добычу от Бурмалды", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
        slots: { name: "Слот-Машинный Чип", desc: "Множитель выигрыша в Слотах", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/><circle cx="8.5" cy="15.5" r="1.5"/></svg>' },
        mines: { name: "Саперный Радар", desc: "Множитель выигрыша в Шахтах", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93"/></svg>' },
        crash: { name: "Квантовый Двигатель", desc: "Множитель выигрыша в Краше", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l4 4-2.5-1v17h-3V5L9 6l4-4z"/></svg>' },
        wheel: { name: "Гравитационное Колесо", desc: "Множитель выигрыша в Колесе", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2v7M12 15v7M2 12h7M15 12h7"/></svg>' }
    },

    itemsCatalog: {
        hedgehog: { id: "hedgehog", name: "Колючий Ежик", rarity: "common", price: 200, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12A10 10 0 0 1 12 2z"/><path d="M7 8l2 2M15 8l2 2M9 15s1.5 2 3 2 3-2 3-2M5 12h.01M19 12h.01M12 4v2M12 18v2M4 7l2 1M18 7l-2 1"/></svg>' },
        underwear: { id: "underwear", name: "Счастливые Трусы", rarity: "common", price: 350, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v6c0 6-4 10-8 10S4 16 4 10V4z"/><path d="M4 10h16M12 10v10"/></svg>' },
        glasses: { id: "glasses", name: "Очки Бурмалды", rarity: "common", price: 500, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><path d="M10 12h4M2 12h0M22 12h0"/></svg>' },
        windows: { id: "windows", name: "Наши Окна", rarity: "rare", price: 1500, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18M3 12h18"/></svg>' },
        poster: { id: "poster", name: "Плакат Толдика", rarity: "rare", price: 3000, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 18c0-2.5 2.5-4 5-4s5 1.5 5 4"/></svg>' },
        reactor_item: { id: "reactor_item", name: "Мини-Реактор", rarity: "epic", price: 8000, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>' },
        crystal_item: { id: "crystal_item", name: "Малахитовый Артефакт", rarity: "epic", price: 15000, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l4 6-10 12L2 9z"/></svg>' },
        golden_toldik: { id: "golden_toldik", name: "Золотой Толдик", rarity: "legendary", price: 50000, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M5 20h14"/></svg>' },
        singular_goose: { id: "singular_goose", name: "Сингулярная Бурмалда", rarity: "mythic", price: 200000, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' }
    },

    casesConfig: {
        hobo: {
            id: "hobo",
            name: "Бомж Кейс",
            price: 500,
            desc: "Дешевый кейс с базовой бурмалдой",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
            items: ["hedgehog", "underwear", "glasses", "windows"]
        },
        burmalda_case: {
            id: "burmalda_case",
            name: "Кейс Бурмалды",
            price: 2500,
            desc: "Народный выбор с высоким шансом редких вещей",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
            items: ["underwear", "glasses", "windows", "poster", "reactor_item"]
        },
        malachite_case: {
            id: "malachite_case",
            name: "Малахитовый Кейс",
            price: 10000,
            desc: "Премиальный кейс для настоящих паханов",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="12"/><line x1="22" y1="8.5" x2="12" y2="12"/><line x1="2" y1="8.5" x2="12" y2="12"/></svg>',
            items: ["windows", "poster", "reactor_item", "crystal_item", "golden_toldik", "singular_goose"]
        }
    },

    upgradeLevels: [
        { cost: 0, multiplier: 1.0 },
        { cost: 20000, multiplier: 1.2 },
        { cost: 75000, multiplier: 1.5 },
        { cost: 200000, multiplier: 2.0 },
        { cost: 500000, multiplier: 3.0 },
        { cost: 1000000, multiplier: 5.0 }
    ],

    getUpgradeMultiplier(id) {
        const level = this.state.upgrades[id] || 0;
        return this.upgradeLevels[level].multiplier;
    },

    buyUpgrade(id) {
        const currentLevel = this.state.upgrades[id] || 0;
        if (currentLevel >= this.upgradeLevels.length - 1) return false;
        
        const nextLevel = currentLevel + 1;
        const cost = this.upgradeLevels[nextLevel].cost;
        
        if (this.state.balance >= cost) {
            this.updateBalance(-cost);
            this.state.upgrades[id] = nextLevel;
            this.saveSettings();
            this.renderUpgradesUI();
            this.showToast("Улучшение куплено!", `Ваш множитель увеличен до ${this.upgradeLevels[nextLevel].multiplier}x`, "success");
            this.audio.playWin();
            return true;
        } else {
            this.showToast("Недостаточно TC", "Накопите больше бурмалды", "error");
            this.audio.playLoss();
            return false;
        }
    },

    renderUpgradesUI() {
        const container = document.getElementById("upgrades-grid");
        if (!container) return;
        
        container.innerHTML = "";
        
        for (const [id, config] of Object.entries(this.upgradesConfig)) {
            const currentLevel = this.state.upgrades[id] || 0;
            const currentMult = this.upgradeLevels[currentLevel].multiplier;
            const isMax = currentLevel >= this.upgradeLevels.length - 1;
            
            let nextMultText = isMax ? "MAX" : (this.upgradeLevels[currentLevel + 1].multiplier + "x");
            let costText = isMax ? "МАКСИМУМ" : (this.upgradeLevels[currentLevel + 1].cost.toLocaleString() + " TC");
            
            const card = document.createElement("div");
            card.className = "upgrade-card glass-card";
            card.innerHTML = `
                <div class="upgrade-icon">${config.icon}</div>
                <div class="upgrade-info">
                    <h3>${config.name} <span class="upgrade-level">Lvl ${currentLevel}</span></h3>
                    <p class="upgrade-desc">${config.desc}</p>
                    <div class="upgrade-stats">
                        <span>Множитель: <strong>${currentMult}x</strong></span>
                        ${!isMax ? `<span>След: <strong>${nextMultText}</strong></span>` : ''}
                    </div>
                </div>
                <button class="btn btn-action ${isMax ? 'disabled' : ''}" onclick="App.buyUpgrade('${id}')" ${isMax ? 'disabled' : ''}>
                    ${costText}
                </button>
            `;
            container.appendChild(card);
        }
    },

    addToInventory(itemId) {
        const item = this.itemsCatalog[itemId];
        if (!item) return;
        this.state.inventory.push({ ...item, uid: Date.now() + Math.random() });
        this.saveSettings();
        this.updateInventoryCountUI();
    },

    sellInventoryItem(index) {
        if (index < 0 || index >= this.state.inventory.length) return;
        const item = this.state.inventory[index];
        this.state.inventory.splice(index, 1);
        this.updateBalance(item.price);
        this.saveSettings();
        this.updateInventoryCountUI();
        this.renderInventoryUI();
        this.showToast("Продано!", `Вы получили +${item.price.toLocaleString()} TC за ${item.name}`, "win");
        this.audio.playWin();
    },

    updateInventoryCountUI() {
        const badge = document.getElementById("inventory-count");
        if (badge) {
            badge.textContent = this.state.inventory.length;
        }
    },

    renderInventoryUI() {
        const container = document.getElementById("inventory-grid");
        if (!container) return;

        if (this.state.inventory.length === 0) {
            container.innerHTML = `<div class="inventory-empty">Инвентарь пуст. Открывайте кейсы!</div>`;
            return;
        }

        container.innerHTML = "";
        this.state.inventory.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = `inventory-item-card rarity-${item.rarity}`;
            card.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-price">+${item.price.toLocaleString()} TC</div>
                <button class="btn btn-sm btn-ghost" onclick="App.sellInventoryItem(${index})">Продать</button>
            `;
            container.appendChild(card);
        });
    },

    // Audio Synthesizer via Web Audio API
    audio: {
        init() {
            if (!App.state.audioCtx) {
                App.state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        },

        playTone(freq, type, duration, slideToFreq = null) {
            if (!App.state.soundEnabled) return;
            this.init();
            
            // Resume if suspended (browser security)
            if (App.state.audioCtx.state === 'suspended') {
                App.state.audioCtx.resume();
            }

            const osc = App.state.audioCtx.createOscillator();
            const gain = App.state.audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, App.state.audioCtx.currentTime);

            if (slideToFreq) {
                osc.frequency.exponentialRampToValueAtTime(slideToFreq, App.state.audioCtx.currentTime + duration);
            }

            gain.gain.setValueAtTime(0.15, App.state.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, App.state.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(App.state.audioCtx.destination);

            osc.start();
            osc.stop(App.state.audioCtx.currentTime + duration);
        },

        playClick() {
            this.playTone(600, 'sine', 0.08, 300);
        },

        playWin() {
            const now = App.state.audioCtx ? App.state.audioCtx.currentTime : 0;
            this.playTone(330, 'triangle', 0.1);
            setTimeout(() => this.playTone(440, 'triangle', 0.1), 100);
            setTimeout(() => this.playTone(550, 'triangle', 0.15), 200);
            setTimeout(() => this.playTone(660, 'sine', 0.3, 880), 300);
        },

        playLoss() {
            this.playTone(220, 'sawtooth', 0.4, 80);
        },

        playCashout() {
            this.playTone(400, 'sine', 0.15, 800);
        },

        playExplosion() {
            if (!App.state.soundEnabled) return;
            this.init();
            if (App.state.audioCtx.state === 'suspended') {
                App.state.audioCtx.resume();
            }
            
            // White noise generation for crash explosion
            const bufferSize = App.state.audioCtx.sampleRate * 0.4;
            const buffer = App.state.audioCtx.createBuffer(1, bufferSize, App.state.audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = App.state.audioCtx.createBufferSource();
            noise.buffer = buffer;

            const filter = App.state.audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, App.state.audioCtx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(50, App.state.audioCtx.currentTime + 0.4);

            const gain = App.state.audioCtx.createGain();
            gain.gain.setValueAtTime(0.3, App.state.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, App.state.audioCtx.currentTime + 0.4);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(App.state.audioCtx.destination);

            noise.start();
            noise.stop(App.state.audioCtx.currentTime + 0.4);
        },

        playSpinTick() {
            this.playTone(500, 'triangle', 0.03);
        },

        playCharge(duration) {
            if (!App.state.soundEnabled) return;
            this.init();
            if (App.state.audioCtx.state === 'suspended') {
                App.state.audioCtx.resume();
            }
            
            const osc = App.state.audioCtx.createOscillator();
            const gain = App.state.audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(80, App.state.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, App.state.audioCtx.currentTime + duration);

            gain.gain.setValueAtTime(0.01, App.state.audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.12, App.state.audioCtx.currentTime + duration * 0.8);
            gain.gain.exponentialRampToValueAtTime(0.001, App.state.audioCtx.currentTime + duration);

            // Add filter sweeping
            const filter = App.state.audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(150, App.state.audioCtx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(2000, App.state.audioCtx.currentTime + duration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(App.state.audioCtx.destination);

            osc.start();
            osc.stop(App.state.audioCtx.currentTime + duration);
        }
    },

    // Initialization logic
    init() {
        this.loadSettings();
        this.initCanvasBackground();
        this.initInteractiveHover();
        this.initEventListeners();
        this.startLiveFeedSimulation();
        this.updateStatsUI();
        this.renderUpgradesUI();
        
        // Initial toast welcoming the user
        setTimeout(() => {
            this.showToast("С возвращением в toldik def!", "Заряжайте реактор Бурмалды для получения TC.", "info");
        }, 1000);
    },

    // LocalStorage settings
    loadSettings() {
        const savedBalance = localStorage.getItem("toldik_def_balance");
        if (savedBalance !== null) {
            this.state.balance = parseInt(savedBalance, 10);
        } else {
            localStorage.setItem("toldik_def_balance", this.state.balance);
        }
        
        const savedSound = localStorage.getItem("toldik_def_sound");
        if (savedSound !== null) {
            this.state.soundEnabled = savedSound === "true";
        }
        this.updateSoundIcon();

        const savedWins = localStorage.getItem("toldik_def_wins");
        if (savedWins !== null) this.state.wins = parseInt(savedWins, 10);
        const savedLosses = localStorage.getItem("toldik_def_losses");
        if (savedLosses !== null) this.state.losses = parseInt(savedLosses, 10);
        const savedTotalBets = localStorage.getItem("toldik_def_total_bets");
        if (savedTotalBets !== null) this.state.totalBets = parseInt(savedTotalBets, 10);
        
        const savedUpgrades = localStorage.getItem("toldik_def_upgrades");
        if (savedUpgrades !== null) {
            try {
                this.state.upgrades = JSON.parse(savedUpgrades);
            } catch (e) {
                console.error("Failed to parse upgrades", e);
            }
        }

        const savedInventory = localStorage.getItem("toldik_def_inventory");
        if (savedInventory !== null) {
            try {
                this.state.inventory = JSON.parse(savedInventory);
            } catch (e) {
                console.error("Failed to parse inventory", e);
            }
        }
        
        this.updateBalanceUI();
        this.updateInventoryCountUI();
    },

    saveSettings() {
        localStorage.setItem("toldik_def_balance", this.state.balance);
        localStorage.setItem("toldik_def_wins", this.state.wins);
        localStorage.setItem("toldik_def_losses", this.state.losses);
        localStorage.setItem("toldik_def_total_bets", this.state.totalBets);
        localStorage.setItem("toldik_def_upgrades", JSON.stringify(this.state.upgrades));
        localStorage.setItem("toldik_def_inventory", JSON.stringify(this.state.inventory));
    },

    updateBalance(change) {
        this.state.balance += change;
        if (this.state.balance < 0) this.state.balance = 0;
        this.saveSettings();
        this.updateBalanceUI();
    },

    updateBalanceUI() {
        const el = document.getElementById("balance-val");
        if (el) {
            // Animating number change
            const startVal = parseInt(el.textContent.replace(/,/g, ''), 10) || 0;
            const endVal = this.state.balance;
            this.animateNumber(el, startVal, endVal, 500);
        }
    },

    animateNumber(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = Math.floor(progress * (end - start) + start);
            element.textContent = currentVal.toLocaleString('en-US');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end.toLocaleString('en-US');
            }
        };
        window.requestAnimationFrame(step);
    },

    addBetStat(betAmount, isWin, winProfit = 0) {
        this.state.totalBets += betAmount;
        if (isWin) {
            this.state.wins += 1;
        } else {
            this.state.losses += 1;
        }
        this.saveSettings();
        this.updateStatsUI();
    },

    updateStatsUI() {
        document.getElementById("stat-wins").textContent = this.state.wins;
        document.getElementById("stat-losses").textContent = this.state.losses;
        document.getElementById("stat-total-bets").textContent = this.state.totalBets.toLocaleString() + " TC";
    },

    updateSoundIcon() {
        const icon = document.getElementById("sound-icon");
        if (icon) {
            if (this.state.soundEnabled) {
                icon.className = "fa-solid fa-volume-high";
            } else {
                icon.className = "fa-solid fa-volume-xmark";
            }
        }
    },

    // Particle Stars Background
    initCanvasBackground() {
        const canvas = document.getElementById("stars-canvas");
        const ctx = canvas.getContext("2d");
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        const stars = [];
        const starCount = 80; // slightly fewer to keep performance smooth

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.6 + 0.2,
                speed: Math.random() * 0.05 + 0.01,
                direction: Math.random() * Math.PI * 2
            });
        }

        window.addEventListener("resize", () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        });

        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            
            for (let i = 0; i < starCount; i++) {
                const s = stars[i];
                // Move stars slightly
                s.x += Math.cos(s.direction) * s.speed;
                s.y += Math.sin(s.direction) * s.speed;

                // Loop edges
                if (s.x < 0) s.x = w;
                if (s.x > w) s.x = 0;
                if (s.y < 0) s.y = h;
                if (s.y > h) s.y = 0;

                // Pulsate alpha
                s.alpha += (Math.random() - 0.5) * 0.02;
                if (s.alpha < 0.1) s.alpha = 0.1;
                if (s.alpha > 0.9) s.alpha = 0.9;

                let tx = s.x;
                let ty = s.y;

                if (App.state.mouse.active) {
                    const dx = App.state.mouse.x - s.x;
                    const dy = App.state.mouse.y - s.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 180) {
                        const force = (180 - dist) / 180;
                        tx += (dx / dist) * force * 15;
                        ty += (dy / dist) * force * 15;
                    }
                }

                ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
                ctx.beginPath();
                ctx.arc(tx, ty, s.size, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(animate);
        }

        animate();
    },

    // Interactive hover highlights (Claude style)
    initInteractiveHover() {
        // Prevent layout lag and touch bugs on mobile devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        // Track mouse globally
        window.addEventListener('mousemove', (e) => {
            App.state.mouse.x = e.clientX;
            App.state.mouse.y = e.clientY;
            App.state.mouse.active = true;
            
            // Parallax aurora background waves
            const px = (e.clientX - window.innerWidth / 2) / 35;
            const py = (e.clientY - window.innerHeight / 2) / 35;
            document.querySelectorAll('.aurora-glow').forEach((glow, idx) => {
                const speed = (idx + 1) * 0.4;
                glow.style.transform = `translate(${px * speed}px, ${py * speed}px)`;
            });
        });

        window.addEventListener('mouseleave', () => {
            App.state.mouse.active = false;
        });

        // 3D Card Tilt + Spotlight tracking
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // 3D rotation angle
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                const dx = x - xc;
                const dy = y - yc;
                const rx = -(dy / yc) * 4; // limit rotation to 4deg
                const ry = (dx / xc) * 4;

                // Apply transition transforms
                card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
                card.style.boxShadow = `0 20px 45px rgba(0, 0, 0, 0.25)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                card.style.boxShadow = '';
            });
        });

        // Magnetic pill buttons (slight drifting towards mouse pointer)
        document.querySelectorAll('.btn, .nav-tab, .bet-adjust-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.02)`;
                btn.style.boxShadow = `0 8px 20px rgba(0, 0, 0, 0.3)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.boxShadow = '';
            });
        });
    },

    setNavigationEnabled(enabled) {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.disabled = !enabled;
            if (!enabled) tab.classList.add('nav-disabled');
            else tab.classList.remove('nav-disabled');
        });
        const burBtn = document.getElementById('btn-burmaldit');
        if (burBtn) burBtn.disabled = !enabled;
    },

    // UI Listeners
    initEventListeners() {
        // Tab switching
        const tabs = document.querySelectorAll(".nav-tab");
        const views = document.querySelectorAll(".game-view");

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                this.audio.playClick();
                tabs.forEach(t => t.classList.remove("active"));
                views.forEach(v => v.classList.remove("active"));

                tab.classList.add("active");
                const gameName = tab.getAttribute("data-game");
                document.getElementById(`game-${gameName}`).classList.add("active");
                
                // If switching to crash, resize/redraw if needed
                if (gameName === "crash") {
                    window.CrashGame.onShow();
                }
                if (gameName === "wheel" && window.WheelGame) {
                    window.WheelGame.onShow();
                }
                if (gameName === "cases" && window.CasesGame) {
                    window.CasesGame.renderCasesList();
                }
                if (gameName === "upgrades") {
                    this.renderUpgradesUI();
                }
            });
        });

        // Sound toggler
        document.getElementById("toggle-sound").addEventListener("click", () => {
            this.state.soundEnabled = !this.state.soundEnabled;
            localStorage.setItem("toldik_def_sound", this.state.soundEnabled);
            this.updateSoundIcon();
            this.audio.playClick();
        });

        // "Бурмалдить" button opens modal
        const burmalditBtn = document.getElementById("btn-burmaldit");
        const modal = document.getElementById("burmaldit-modal");
        const closeModal = document.getElementById("close-burmaldit");

        burmalditBtn.addEventListener("click", () => {
            this.audio.playClick();
            modal.classList.add("active");
        });

        closeModal.addEventListener("click", () => {
            if (this.state.reactorCharging) return; // Prevent closing while charging
            this.audio.playClick();
            modal.classList.remove("active");
        });

        // Trigger burmalda reactor claim
        document.getElementById("btn-trigger-burmalda").addEventListener("click", () => {
            this.triggerReactorCharge();
        });
    },

    // Quantum Reactor charging logic
    triggerReactorCharge() {
        if (this.state.reactorCharging) return;
        this.state.reactorCharging = true;

        const triggerBtn = document.getElementById("btn-trigger-burmalda");
        const reactorCore = document.getElementById("reactor-core");
        const chargeBar = document.getElementById("reactor-charge-bar");
        const statusText = document.getElementById("reactor-status-text");

        triggerBtn.disabled = true;
        reactorCore.classList.add("charging");
        statusText.textContent = "Установка соединения с космическим ядром...";
        
        const duration = 3000; // 3 seconds charge
        this.audio.playCharge(duration / 1000);

        let start = null;
        const updateProgress = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            chargeBar.style.width = `${progress * 100}%`;
            
            if (progress < 0.3) {
                statusText.textContent = "Инициация потока квантовых частиц...";
            } else if (progress < 0.6) {
                statusText.textContent = "Концентрация космической энергии...";
            } else if (progress < 0.9) {
                statusText.textContent = "Генерация толдиккоинов... Почти готово!";
            }

            if (progress < 1) {
                requestAnimationFrame(updateProgress);
            } else {
                // Charge finished!
                reactorCore.classList.remove("charging");
                triggerBtn.disabled = false;
                chargeBar.style.width = "0%";
                
                const baseReward = 500;
                const isLucky = Math.random() < 0.15; // 15% jackpot chance
                const luckyMultiplier = isLucky ? 3 : 1;
                let reward = Math.floor((Math.random() * 500 + baseReward) * luckyMultiplier);
                
                // Apply Burmalda Generator Upgrade
                reward = Math.floor(reward * this.getUpgradeMultiplier('burmalda'));

                this.updateBalance(reward);
                
                if (isLucky) {
                    statusText.innerHTML = `<span class="win-color">СВЕРХ-БУРМАЛДА! Реактор взорвался джекпотом! +${reward} TC</span>`;
                    this.audio.playWin();
                    this.showToast("КРИТИЧЕСКИЙ ВЫБРОС!", `Вы получили супер-бурмалду на +${reward} TC!`, "win");
                } else {
                    statusText.innerHTML = `<span class="win-color">Успешное бурмалдение! +${reward} TC сгенерировано!</span>`;
                    this.audio.playTone(800, 'sine', 0.2, 1200);
                    this.showToast("Успех!", `Реактор выделил +${reward} TC.`, "info");
                }

                // Add to simulated recent feed as user victory
                this.addSimulatedFeedItem("Gamer_You", "Реактор", reward, true);

                setTimeout(() => {
                    if (!this.state.reactorCharging) {
                        statusText.textContent = "Реактор готов к следующей инициации.";
                    }
                }, 2500);

                this.state.reactorCharging = false;
            }
        };

        requestAnimationFrame(updateProgress);
    },

    // Simulated Casino Feed
    startLiveFeedSimulation() {
        const feed = document.getElementById("live-bets-feed");
        const players = [
            "Vasyan_Burmalda", "CosmoZaba", "Kesha_1337", "Toldik_Bro", "Zxc_Ghoul_Space", 
            "Giga_Burmaldeen", "Malahet_Gamer", "Nebula_Rider", "Mars_Voyager", "Sanya_Pluton", 
            "Aleksey_Rigel", "Andromeda_Fan", "Pudge_Astral", "Bebra_Cosmic", "ToldikCoin_Holder"
        ];
        const games = ["Слоты", "Шахты", "Краш", "Колесо"];

        // Fill initial feed
        for (let i = 0; i < 6; i++) {
            const player = players[Math.floor(Math.random() * players.length)];
            const game = games[Math.floor(Math.random() * games.length)];
            const isWin = Math.random() < 0.45;
            const betAmount = Math.floor(Math.random() * 450 + 50);
            const payout = isWin ? Math.floor(betAmount * (Math.random() * 2 + 1.2)) : 0;
            
            this.addSimulatedFeedItem(player, game, isWin ? payout : betAmount, isWin, true);
        }

        // Loop interval for incoming new bets
        const loop = () => {
            const delay = Math.random() * 4000 + 2000; // every 2-6s
            setTimeout(() => {
                const player = players[Math.floor(Math.random() * players.length)];
                const game = games[Math.floor(Math.random() * games.length)];
                const isWin = Math.random() < 0.42;
                const betAmount = Math.floor(Math.random() * 800 + 50);
                const payout = isWin ? Math.floor(betAmount * (Math.random() * 3 + 1.1)) : 0;
                
                this.addSimulatedFeedItem(player, game, isWin ? payout : betAmount, isWin);
                loop();
            }, delay);
        };
        loop();
    },

    addSimulatedFeedItem(player, game, amount, isWin, prependOnly = false) {
        const feed = document.getElementById("live-bets-feed");
        if (!feed) return;

        const item = document.createElement("div");
        item.className = `feed-item ${isWin ? 'win' : 'loss'}`;
        
        item.innerHTML = `
            <div>
                <span class="feed-player">${player}</span>
                <span class="feed-game">в ${game}</span>
            </div>
            <span class="feed-amount">${isWin ? '+' : '-'}${amount.toLocaleString()} TC</span>
        `;

        if (feed.children.length >= 20) {
            feed.removeChild(feed.lastChild);
        }

        feed.insertBefore(item, feed.firstChild);
    },

    // Custom Toast Notification System
    showToast(title, message, type = "info") {
        const container = document.getElementById("toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;

        let icon = "fa-info-circle";
        if (type === "win") icon = "fa-circle-check";
        if (type === "loss") icon = "fa-triangle-exclamation";

        toast.innerHTML = `
            <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        container.appendChild(toast);

        // Remove from DOM after animation completes
        setTimeout(() => {
            if (toast.parentNode === container) {
                container.removeChild(toast);
            }
        }, 4000);
    }
};

// Initialize App when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    App.init();
});
