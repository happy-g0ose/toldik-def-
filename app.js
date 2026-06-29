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
        mouse: { x: null, y: null, active: false }
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
        
        this.updateBalanceUI();
    },

    saveSettings() {
        localStorage.setItem("toldik_def_balance", this.state.balance);
        localStorage.setItem("toldik_def_wins", this.state.wins);
        localStorage.setItem("toldik_def_losses", this.state.losses);
        localStorage.setItem("toldik_def_total_bets", this.state.totalBets);
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
                
                // Random prize toldikcoins
                const baseReward = 500;
                const isLucky = Math.random() < 0.15; // 15% jackpot chance
                const luckyMultiplier = isLucky ? 3 : 1;
                const reward = Math.floor((Math.random() * 500 + baseReward) * luckyMultiplier);

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
