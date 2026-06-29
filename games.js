// ==========================================
// toldik def - Mini-Games Engine
// ==========================================

// Global Slots Logic
const SlotsGame = {
    symbols: [
        { char: "🌌", name: "Черная Дыра", mult: 2 },
        { char: "🪐", name: "Сатурн", mult: 3 },
        { char: "⭐", name: "Звезда", mult: 5 },
        { char: "☄️", name: "Комета", mult: 8 },
        { char: "💎", name: "Малахит", mult: 15 },
        { char: "🛸", name: "UFO", mult: 30 }
    ],
    isSpinning: false,

    init() {
        this.renderInitialReels();
        this.bindEvents();
    },

    renderInitialReels() {
        for (let i = 1; i <= 3; i++) {
            const inner = document.querySelector(`#reel-${i} .reel-inner`);
            inner.innerHTML = "";
            // Render a few static items
            for (let j = 0; j < 3; j++) {
                const sym = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                inner.appendChild(this.createSymbolDOM(sym));
            }
        }
    },

    createSymbolDOM(sym) {
        const div = document.createElement("div");
        div.className = "slot-icon";
        div.innerHTML = `${sym.char} <span>${sym.name}</span>`;
        return div;
    },

    bindEvents() {
        const spinBtn = document.getElementById("slots-spin-btn");
        const betInput = document.getElementById("slots-bet");

        // Quick Bet Adjustments
        document.getElementById("slots-bet-half").addEventListener("click", () => {
            App.audio.playClick();
            betInput.value = Math.max(10, Math.floor(parseInt(betInput.value, 10) / 2));
        });
        document.getElementById("slots-bet-double").addEventListener("click", () => {
            App.audio.playClick();
            betInput.value = Math.min(App.state.balance, parseInt(betInput.value, 10) * 2);
        });
        document.getElementById("slots-bet-max").addEventListener("click", () => {
            App.audio.playClick();
            betInput.value = App.state.balance;
        });

        spinBtn.addEventListener("click", () => {
            if (this.isSpinning) return;
            
            const bet = parseInt(betInput.value, 10);
            if (isNaN(bet) || bet <= 0) {
                App.showToast("Ошибка", "Введите корректную сумму ставки.", "loss");
                return;
            }
            if (bet > App.state.balance) {
                App.showToast("Ошибка", "Недостаточно средств. Бурмалдите еще!", "loss");
                return;
            }

            this.spin(bet);
        });
    },

    spin(bet) {
        this.isSpinning = true;
        document.getElementById("slots-spin-btn").disabled = true;
        document.querySelector(".win-line-indicator").classList.remove("active");
        
        App.setNavigationEnabled(false);
        document.getElementById("slots-bet").disabled = true;
        document.getElementById("slots-bet-half").disabled = true;
        document.getElementById("slots-bet-double").disabled = true;
        document.getElementById("slots-bet-max").disabled = true;

        App.updateBalance(-bet);
        App.addBetStat(bet, false, 0);

        const reelDests = [];
        const spinDurations = [1500, 2200, 2900]; // Staggered stops

        // Generate full strips for reels
        for (let i = 1; i <= 3; i++) {
            const reel = document.getElementById(`reel-${i}`);
            const inner = reel.querySelector(`.reel-inner`);
            
            // Build a long list of symbols to scroll through
            const stripCount = 25 + i * 5;
            inner.innerHTML = "";
            
            const reelSymbols = [];
            for (let j = 0; j < stripCount; j++) {
                const sym = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                reelSymbols.push(sym);
                inner.appendChild(this.createSymbolDOM(sym));
            }

            // The target symbol is the 3rd from the end (centered in reel window)
            const targetIndex = stripCount - 2;
            const targetSymbol = reelSymbols[targetIndex];
            reelDests.push(targetSymbol);

            // Animate scroll using simple translate
            inner.style.transition = "none";
            inner.style.transform = "translateY(0)";
            
            // Force redraw
            inner.offsetHeight;

            // Height of one icon is 140px. We want to offset so targetIndex is visible
            const offset = -(targetIndex - 1) * 140; 
            inner.style.transition = `transform ${spinDurations[i-1]}ms cubic-bezier(0.1, 0.5, 0.1, 1)`;
            inner.style.transform = `translateY(${offset}px)`;

            // Sound ticks
            let tickCount = 0;
            const tickInterval = setInterval(() => {
                tickCount++;
                if (tickCount * 80 < spinDurations[i-1]) {
                    App.audio.playSpinTick();
                } else {
                    clearInterval(tickInterval);
                }
            }, 80);
        }

        // Wait for final reel to stop
        setTimeout(() => {
            this.evaluateResult(bet, reelDests);
        }, spinDurations[2] + 200);
    },

    evaluateResult(bet, results) {
        this.isSpinning = false;
        document.getElementById("slots-spin-btn").disabled = false;
        
        App.setNavigationEnabled(true);
        document.getElementById("slots-bet").disabled = false;
        document.getElementById("slots-bet-half").disabled = false;
        document.getElementById("slots-bet-double").disabled = false;
        document.getElementById("slots-bet-max").disabled = false;

        const [r1, r2, r3] = results;

        // Check matching
        if (r1.char === r2.char && r2.char === r3.char) {
            // Triple win!
            const winMult = r1.mult;
            const profit = bet * winMult;
            
            App.updateBalance(profit);
            // Fix double stat: we marked it as loss before, now correct stats
            App.state.losses = Math.max(0, App.state.losses - 1);
            App.addBetStat(0, true, profit);

            document.querySelector(".win-line-indicator").classList.add("active");
            App.audio.playWin();
            App.showToast("Победа!", `Линия из ${r1.char}! Вы выиграли ${profit} TC (x${winMult})!`, "win");
            App.addSimulatedFeedItem("Gamer_You", "Слоты", profit, true);
        } else if (r1.char === r2.char || r2.char === r3.char || r1.char === r3.char) {
            // Double match: small refund / win (e.g. 1.2x)
            const matchedChar = r1.char === r2.char ? r1.char : r3.char;
            const matchedSymbol = this.symbols.find(s => s.char === matchedChar);
            const winMult = Math.ceil(matchedSymbol.mult * 0.4);
            const profit = Math.floor(bet * winMult);

            App.updateBalance(profit);
            App.state.losses = Math.max(0, App.state.losses - 1);
            App.addBetStat(0, true, profit);

            App.audio.playTone(600, 'triangle', 0.2);
            App.showToast("Частичное совпадение!", `Пара ${matchedChar}! Возврат ${profit} TC (x${winMult})!`, "win");
            App.addSimulatedFeedItem("Gamer_You", "Слоты", profit, true);
        } else {
            // Loss
            App.audio.playLoss();
            App.showToast("Проигрыш", `Нет совпадений. Попробуйте еще раз!`, "loss");
            App.addSimulatedFeedItem("Gamer_You", "Слоты", bet, false);
        }
    }
};

// Global Mines Logic
const MinesGame = {
    active: false,
    boardSize: 25,
    bombsCount: 3,
    bet: 100,
    revealedCount: 0,
    multiplier: 1.00,
    grid: [], // 'crystal' or 'bomb'
    tilesDOM: [],

    init() {
        this.renderBoard();
        this.bindEvents();
    },

    renderBoard() {
        const gridContainer = document.getElementById("mines-grid");
        gridContainer.innerHTML = "";
        this.tilesDOM = [];

        for (let i = 0; i < this.boardSize; i++) {
            const tile = document.createElement("div");
            tile.className = "mine-tile disabled";
            tile.setAttribute("data-index", i);
            tile.innerHTML = ``;
            
            tile.addEventListener("click", () => this.clickTile(i));
            gridContainer.appendChild(tile);
            this.tilesDOM.push(tile);
        }
    },

    bindEvents() {
        const startBtn = document.getElementById("mines-start-btn");
        const cashoutBtn = document.getElementById("mines-cashout-btn");
        const betInput = document.getElementById("mines-bet");
        const bombsSelect = document.getElementById("mines-bombs-count");

        // Quick Bets
        document.getElementById("mines-bet-half").addEventListener("click", () => {
            if (this.active) return;
            App.audio.playClick();
            betInput.value = Math.max(10, Math.floor(parseInt(betInput.value, 10) / 2));
        });
        document.getElementById("mines-bet-double").addEventListener("click", () => {
            if (this.active) return;
            App.audio.playClick();
            betInput.value = Math.min(App.state.balance, parseInt(betInput.value, 10) * 2);
        });

        startBtn.addEventListener("click", () => {
            if (this.active) return;
            this.startGame();
        });

        cashoutBtn.addEventListener("click", () => {
            if (!this.active) return;
            this.cashout();
        });
    },

    startGame() {
        const betInput = document.getElementById("mines-bet");
        const bombsSelect = document.getElementById("mines-bombs-count");
        
        this.bet = parseInt(betInput.value, 10);
        this.bombsCount = parseInt(bombsSelect.value, 10);

        if (isNaN(this.bet) || this.bet <= 0) {
            App.showToast("Ошибка", "Введите корректную сумму ставки.", "loss");
            return;
        }
        if (this.bet > App.state.balance) {
            App.showToast("Ошибка", "Недостаточно средств. Бурмалдите еще!", "loss");
            return;
        }

        // Deduct bet
        App.updateBalance(-this.bet);
        App.addBetStat(this.bet, false, 0);
        App.audio.playClick();

        // Configure Game State
        this.active = true;
        this.revealedCount = 0;
        this.multiplier = 1.00;
        
        // Update UI Controls
        document.getElementById("mines-start-btn").textContent = "Бурмалдение...";
        document.getElementById("mines-start-btn").disabled = true;
        document.getElementById("mines-cashout-btn").style.display = "inline-flex";
        document.getElementById("mines-cashout-btn").disabled = true; // Wait for first crystal
        betInput.disabled = true;
        bombsSelect.disabled = true;
        document.getElementById("mines-bet-half").disabled = true;
        document.getElementById("mines-bet-double").disabled = true;
        
        App.setNavigationEnabled(false);

        this.generateGrid();
        this.updateMultiplierUI();

        // Enable board tiles
        this.tilesDOM.forEach(tile => {
            tile.className = "mine-tile";
            tile.innerHTML = `<i class="fa-solid fa-circle-question" style="opacity: 0.15; font-size: 1.2rem"></i>`;
        });
    },

    generateGrid() {
        this.grid = Array(this.boardSize).fill("crystal");
        
        // Place Bombs
        let placedBombs = 0;
        while (placedBombs < this.bombsCount) {
            const idx = Math.floor(Math.random() * this.boardSize);
            if (this.grid[idx] !== "bomb") {
                this.grid[idx] = "bomb";
                placedBombs++;
            }
        }
    },

    clickTile(idx) {
        if (!this.active) return;
        const tile = this.tilesDOM[idx];
        if (tile.classList.contains("revealed")) return;

        tile.classList.add("revealed");

        if (this.grid[idx] === "bomb") {
            // Exploded!
            tile.classList.add("bomb");
            tile.innerHTML = `<i class="fa-solid fa-burst"></i>`;
            this.handleLoss();
        } else {
            // Found a Crystal
            tile.classList.add("crystal");
            tile.innerHTML = `<i class="fa-solid fa-gem"></i>`;
            this.revealedCount++;
            
            // Play crystal ding (scale pitch upwards with consecutive crystals)
            const noteFreq = 300 + (this.revealedCount * 50);
            App.audio.playTone(noteFreq, 'sine', 0.15);

            // Calculate new multiplier
            this.multiplier = this.calculateMultiplier(this.revealedCount);
            this.updateMultiplierUI();
            
            // Enable cashout
            document.getElementById("mines-cashout-btn").disabled = false;

            // Check if all crystals found
            const maxCrystals = this.boardSize - this.bombsCount;
            if (this.revealedCount === maxCrystals) {
                this.cashout();
            }
        }
    },

    calculateMultiplier(steps) {
        // Fair formula: 0.97 * (25! / (25-steps)!) / ((25-bombs)! / (25-bombs-steps)!)
        let mult = 1.0;
        for (let i = 0; i < steps; i++) {
            const totalRemaining = this.boardSize - i;
            const safeRemaining = this.boardSize - this.bombsCount - i;
            mult *= (totalRemaining / safeRemaining);
        }
        return Math.floor(mult * 0.97 * 100) / 100;
    },

    updateMultiplierUI() {
        document.getElementById("mines-multiplier").textContent = `${this.multiplier.toFixed(2)}x`;
        const nextProfit = Math.floor(this.bet * this.multiplier);
        document.getElementById("mines-profit").textContent = `${nextProfit.toLocaleString()} TC`;
    },

    handleLoss() {
        this.active = false;
        App.audio.playExplosion();
        App.showToast("Бум!", "Вы попали в черную дыру! Ставка потеряна.", "loss");
        App.addSimulatedFeedItem("Gamer_You", "Шахты", this.bet, false);

        this.revealAll();
        this.resetControls();
    },

    cashout() {
        if (!this.active) return;
        this.active = false;

        const profit = Math.floor(this.bet * this.multiplier);
        App.updateBalance(profit);
        App.state.losses = Math.max(0, App.state.losses - 1);
        App.addBetStat(0, true, profit);

        App.audio.playCashout();
        App.showToast("Успешный съем!", `Вы забрали ${profit} TC (x${this.multiplier.toFixed(2)})!`, "win");
        App.addSimulatedFeedItem("Gamer_You", "Шахты", profit, true);

        this.revealAll();
        this.resetControls();
    },

    revealAll() {
        for (let i = 0; i < this.boardSize; i++) {
            const tile = this.tilesDOM[i];
            if (tile.classList.contains("revealed")) continue;

            tile.classList.add("revealed");
            tile.style.opacity = "0.5";

            if (this.grid[i] === "bomb") {
                tile.classList.add("bomb");
                tile.innerHTML = `<i class="fa-solid fa-burst"></i>`;
            } else {
                tile.classList.add("crystal");
                tile.innerHTML = `<i class="fa-solid fa-gem"></i>`;
            }
        }
    },

    resetControls() {
        document.getElementById("mines-start-btn").textContent = "Бурмалдить";
        document.getElementById("mines-start-btn").disabled = false;
        document.getElementById("mines-cashout-btn").style.display = "none";
        document.getElementById("mines-bet").disabled = false;
        document.getElementById("mines-bombs-count").disabled = false;
        
        document.getElementById("mines-bet-half").disabled = false;
        document.getElementById("mines-bet-double").disabled = false;
        
        App.setNavigationEnabled(true);
    }
};

// Global Crash Game Logic
const CrashGame = {
    states: {
        WAITING: 'WAITING',
        RUNNING: 'RUNNING',
        CRASHED: 'CRASHED'
    },
    currentState: 'WAITING',
    
    // Canvas vars
    canvas: null,
    ctx: null,
    animationFrameId: null,

    // Game variables
    countdown: 5.0,
    startTime: null,
    multiplier: 1.00,
    crashPoint: 1.00,
    
    // Player Bet
    betActive: false,
    betPlacedThisRound: false,
    betAmount: 0,
    cashoutMultiplier: 1.00,

    init() {
        this.canvas = document.getElementById("crash-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.bindEvents();
        this.enterWaitingState();
        
        window.addEventListener("resize", () => {
            if (document.getElementById("game-crash").classList.contains("active")) {
                this.onShow();
            }
        });
    },

    onShow() {
        // Handle canvas sizing on tab switch
        if (this.canvas) {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        }
    },

    bindEvents() {
        const betBtn = document.getElementById("crash-btn-bet");
        const cashoutBtn = document.getElementById("crash-btn-cashout");
        const betInput = document.getElementById("crash-bet");

        // Quick Bets
        document.getElementById("crash-bet-half").addEventListener("click", () => {
            if (this.betPlacedThisRound) return;
            App.audio.playClick();
            betInput.value = Math.max(10, Math.floor(parseInt(betInput.value, 10) / 2));
        });
        document.getElementById("crash-bet-double").addEventListener("click", () => {
            if (this.betPlacedThisRound) return;
            App.audio.playClick();
            betInput.value = Math.min(App.state.balance, parseInt(betInput.value, 10) * 2);
        });

        betBtn.addEventListener("click", () => {
            this.placeBet();
        });

        cashoutBtn.addEventListener("click", () => {
            this.cashout();
        });
    },

    placeBet() {
        if (this.betPlacedThisRound) return;
        const betInput = document.getElementById("crash-bet");
        const amt = parseInt(betInput.value, 10);

        if (isNaN(amt) || amt <= 0) {
            App.showToast("Ошибка", "Введите корректную ставку.", "loss");
            return;
        }
        if (amt > App.state.balance) {
            App.showToast("Ошибка", "Недостаточно средств.", "loss");
            return;
        }

        this.betAmount = amt;
        this.betActive = true;
        this.betPlacedThisRound = true;

        App.updateBalance(-this.betAmount);
        App.addBetStat(this.betAmount, false, 0);
        App.audio.playClick();

        document.getElementById("crash-btn-bet").textContent = "Бурмалда Принята";
        document.getElementById("crash-btn-bet").disabled = true;
        betInput.disabled = true;
        document.getElementById("crash-bet-half").disabled = true;
        document.getElementById("crash-bet-double").disabled = true;
        
        App.setNavigationEnabled(false);
    },

    cashout() {
        if (!this.betActive || this.currentState !== this.states.RUNNING) return;
        
        this.betActive = false;
        this.cashoutMultiplier = this.multiplier;
        const profit = Math.floor(this.betAmount * this.cashoutMultiplier);

        App.updateBalance(profit);
        App.state.losses = Math.max(0, App.state.losses - 1);
        App.addBetStat(0, true, profit);

        App.audio.playCashout();
        App.showToast("Выигрыш!", `Вы вышли на ${this.cashoutMultiplier.toFixed(2)}x и забрали ${profit} TC!`, "win");
        App.addSimulatedFeedItem("Gamer_You", "Краш", profit, true);

        document.getElementById("crash-btn-cashout").style.display = "none";
        document.getElementById("crash-btn-bet").style.display = "block";
        document.getElementById("crash-btn-bet").textContent = "Забрано";
        document.getElementById("crash-btn-bet").disabled = true;
        
        document.getElementById("crash-bet-half").disabled = false;
        document.getElementById("crash-bet-double").disabled = false;
        
        App.setNavigationEnabled(true);
    },

    generateCrashPoint() {
        // Calculate crash point with exponential distribution
        // 3% instant crash
        if (Math.random() < 0.03) return 1.00;
        
        // E.g., average crash point is around 2-3x
        const r = Math.random();
        const crash = 1.01 + Math.pow(r, 4.5) * 40;
        return Math.floor(crash * 100) / 100;
    },

    enterWaitingState() {
        this.currentState = this.states.WAITING;
        this.countdown = 5.0;
        this.multiplier = 1.00;
        this.crashPoint = this.generateCrashPoint();
        this.startTime = null;

        // Reset UI
        document.getElementById("crash-state-desc").textContent = "Ожидание ставок...";
        document.getElementById("crash-mult-display").className = "crash-multiplier-overlay";
        document.getElementById("crash-mult-display").textContent = "1.00x";
        
        if (!this.betActive) {
            document.getElementById("crash-btn-bet").disabled = false;
            document.getElementById("crash-btn-bet").textContent = "Бурмалдить";
            document.getElementById("crash-btn-bet").style.display = "block";
            document.getElementById("crash-btn-cashout").style.display = "none";
            document.getElementById("crash-bet").disabled = false;
            
            document.getElementById("crash-bet-half").disabled = false;
            document.getElementById("crash-bet-double").disabled = false;
            
            this.betPlacedThisRound = false;
            
            App.setNavigationEnabled(true);
        }

        this.startLoop();
    },

    enterRunningState() {
        this.currentState = this.states.RUNNING;
        this.startTime = performance.now();
        document.getElementById("crash-state-desc").textContent = "Полет...";

        if (this.betActive) {
            document.getElementById("crash-btn-bet").style.display = "none";
            document.getElementById("crash-btn-cashout").style.display = "block";
            document.getElementById("crash-btn-cashout").disabled = false;
        }
    },

    enterCrashedState() {
        this.currentState = this.states.CRASHED;
        document.getElementById("crash-state-desc").textContent = "ВЗРЫВ!";
        
        const overlay = document.getElementById("crash-mult-display");
        overlay.classList.add("crashed");
        overlay.textContent = `КРАШ @ ${this.multiplier.toFixed(2)}x`;

        App.audio.playExplosion();

        // If player didn't cash out
        if (this.betActive) {
            this.betActive = false;
            App.showToast("Взрыв!", `Космолет потерпел крушение на ${this.multiplier.toFixed(2)}x. Ставка потеряна.`, "loss");
            App.addSimulatedFeedItem("Gamer_You", "Краш", this.betAmount, false);
        }

        // Reset UI
        document.getElementById("crash-btn-cashout").style.display = "none";
        document.getElementById("crash-btn-bet").style.display = "block";
        document.getElementById("crash-btn-bet").disabled = true;
        document.getElementById("crash-btn-bet").textContent = "КРАШНУЛО";

        document.getElementById("crash-bet-half").disabled = false;
        document.getElementById("crash-bet-double").disabled = false;
        
        this.betPlacedThisRound = false;
        this.betActive = false;
        
        App.setNavigationEnabled(true);

        // Auto restart after 4 seconds
        setTimeout(() => {
            this.enterWaitingState();
        }, 4000);
    },

    startLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            clearTimeout(this.animationFrameId);
        }
        
        // Prevent background loop when tab is hidden
        const isVisible = document.getElementById("game-crash").classList.contains("active");
        if (!isVisible) {
            this.animationFrameId = setTimeout(() => this.startLoop(), 1000);
            return;
        }
        
        const loop = (time) => {
            this.update(time);
            this.draw();
            if (this.currentState !== this.states.CRASHED) {
                this.animationFrameId = requestAnimationFrame(loop);
            }
        };
        this.animationFrameId = requestAnimationFrame(loop);
    },

    update(time) {
        if (this.currentState === this.states.WAITING) {
            if (!this.startTime) this.startTime = time;
            const elapsed = (time - this.startTime) / 1000;
            this.countdown = Math.max(0, 5.0 - elapsed);
            
            document.getElementById("crash-mult-display").textContent = `Взлет через: ${this.countdown.toFixed(1)}s`;

            if (this.countdown <= 0) {
                this.enterRunningState();
            }
        } else if (this.currentState === this.states.RUNNING) {
            const elapsed = time - this.startTime; // ms
            
            // Formula for multiplier progression
            this.multiplier = 1.00 + Math.pow(elapsed / 4500, 2);
            
            document.getElementById("crash-mult-display").textContent = `${this.multiplier.toFixed(2)}x`;

            // Check if crashed
            if (this.multiplier >= this.crashPoint) {
                this.multiplier = this.crashPoint;
                this.enterCrashedState();
            }
        }
    },

    draw() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, w, h);

        // Draw Cosmic Grid Lines
        ctx.strokeStyle = "rgba(0, 230, 118, 0.05)";
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Draw Chart Line
        if (this.currentState === this.states.RUNNING) {
            const timePercent = Math.min((performance.now() - this.startTime) / 12000, 0.9); // max out at 90% of screen width
            
            const startX = 50;
            const startY = h - 50;
            const endX = startX + timePercent * (w - 100);
            
            // Exponential vertical curve
            const curveFactor = Math.pow(timePercent, 2);
            const endY = startY - curveFactor * (h - 100);

            // Draw shadow/glow under trajectory
            const grad = ctx.createLinearGradient(0, h, 0, endY);
            grad.addColorStop(0, "rgba(0, 230, 118, 0)");
            grad.addColorStop(1, "rgba(0, 230, 118, 0.1)");
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                const px = startX + t * (endX - startX);
                const py = startY - Math.pow(t * timePercent, 2) * (h - 100);
                ctx.lineTo(px, py);
            }
            ctx.lineTo(endX, startY);
            ctx.closePath();
            ctx.fill();

            // Draw line itself
            ctx.strokeStyle = "var(--color-malachite)";
            ctx.lineWidth = 4;
            ctx.shadowColor = "var(--color-malachite-glow)";
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                const px = startX + t * (endX - startX);
                const py = startY - Math.pow(t * timePercent, 2) * (h - 100);
                ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.shadowBlur = 0; // reset

            // Draw rocket indicator
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(endX, endY, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw Axes Labels
        ctx.fillStyle = "var(--color-text-muted)";
        ctx.font = "12px Outfit";
        ctx.fillText("Космическая высота", 10, 20);
        ctx.fillText("Время полета", w - 90, h - 15);
    }
};

// Global Wheel of Fortune Logic
const WheelGame = {
    canvas: null,
    ctx: null,
    isSpinning: false,
    
    // Sectors mapping: multiplier and name/color properties
    sectors: [
        { mult: 0.0, label: "0x", color: "#141328" },
        { mult: 2.0, label: "2x", color: "#008f47" },
        { mult: 0.5, label: "0.5x", color: "#2d2a54" },
        { mult: 1.5, label: "1.5x", color: "#9d4edd" },
        { mult: 0.0, label: "0x", color: "#141328" },
        { mult: 3.0, label: "3x", color: "#00b0ff" },
        { mult: 0.2, label: "0.2x", color: "#2d2a54" },
        { mult: 2.5, label: "2.5x", color: "#00e676" },
        { mult: 0.0, label: "0x", color: "#141328" },
        { mult: 5.0, label: "5x", color: "#d500f9" },
        { mult: 1.2, label: "1.2x", color: "#9d4edd" },
        { mult: 1.8, label: "1.8x", color: "#00b0ff" }
    ],

    init() {
        this.canvas = document.getElementById("wheel-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.onShow();
        this.bindEvents();
        
        window.addEventListener("resize", () => {
            if (document.getElementById("game-wheel").classList.contains("active")) {
                this.onShow();
            }
        });
    },

    onShow() {
        if (this.canvas) {
            this.canvas.width = 450;
            this.canvas.height = 450;
            this.renderWheel();
        }
    },

    renderWheel() {
        const ctx = this.ctx;
        const w = 450;
        const h = 450;
        const cx = 225;
        const cy = 225;
        const r = 215;
        
        ctx.clearRect(0, 0, w, h);
        const arc = (Math.PI * 2) / this.sectors.length;

        // Draw Wheel segments
        for (let i = 0; i < this.sectors.length; i++) {
            const angle = i * arc;
            ctx.fillStyle = this.sectors[i].color;
            
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, angle, angle + arc);
            ctx.closePath();
            ctx.fill();

            // Border segment
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Text label
            ctx.save();
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px Outfit";
            ctx.translate(cx, cy);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = "right";
            ctx.fillText(this.sectors[i].label, r - 30, 8);
            ctx.restore();
        }

        // Inner glowing core
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(0.3, "#00e676");
        coreGrad.addColorStop(1, "#07070f");

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.stroke();
    },

    bindEvents() {
        const spinBtn = document.getElementById("wheel-spin-btn");
        const betInput = document.getElementById("wheel-bet");

        // Quick Bets
        document.getElementById("wheel-bet-half").addEventListener("click", () => {
            if (this.isSpinning) return;
            App.audio.playClick();
            betInput.value = Math.max(10, Math.floor(parseInt(betInput.value, 10) / 2));
        });
        document.getElementById("wheel-bet-double").addEventListener("click", () => {
            if (this.isSpinning) return;
            App.audio.playClick();
            betInput.value = Math.min(App.state.balance, parseInt(betInput.value, 10) * 2);
        });

        spinBtn.addEventListener("click", () => {
            if (this.isSpinning) return;
            
            const bet = parseInt(betInput.value, 10);
            if (isNaN(bet) || bet <= 0) {
                App.showToast("Ошибка", "Введите корректную ставку.", "loss");
                return;
            }
            if (bet > App.state.balance) {
                App.showToast("Ошибка", "Недостаточно средств.", "loss");
                return;
            }

            this.spin(bet);
        });
    },

    spin(bet) {
        this.isSpinning = true;
        document.getElementById("wheel-spin-btn").disabled = true;
        
        App.setNavigationEnabled(false);
        document.getElementById("wheel-bet-half").disabled = true;
        document.getElementById("wheel-bet-double").disabled = true;
        document.getElementById("wheel-bet").disabled = true;
        
        App.updateBalance(-bet);
        App.addBetStat(bet, false, 0);
        
        // Random land segment
        const segmentCount = this.sectors.length;
        const targetIdx = Math.floor(Math.random() * segmentCount);
        
        // Arc size
        const arcDegrees = 360 / segmentCount;
        
        // Calculate target rotation angle.
        // We subtract the target segment from 360 to land precisely under the pointer at the top (which is -90 degrees / 270 degrees).
        // Let's compute target degrees:
        // Pointer is at -90 degrees (top).
        // To align segment targetIdx under pointer:
        // The rotation angle must offset the segment angle.
        const segmentCenterAngle = (targetIdx * arcDegrees) + (arcDegrees / 2);
        const rotationToTop = 270 - segmentCenterAngle;
        
        const extraSpins = 5; // 5 full rounds
        const totalDegrees = (extraSpins * 360) + rotationToTop;

        // Apply transition styling
        this.canvas.style.transform = `rotate(${totalDegrees}deg)`;

        // Audio ticks during rotation
        let tickCount = 0;
        const totalDuration = 5000;
        const startTickDelay = 50;
        
        // Exponential ticker slowdown
        const triggerTick = (delay) => {
            if (tickCount * 450 < totalDuration) {
                App.audio.playSpinTick();
                tickCount++;
                setTimeout(() => triggerTick(delay * 1.15), delay);
            }
        };
        triggerTick(startTickDelay);

        // When transition completes
        setTimeout(() => {
            this.evaluateResult(bet, targetIdx);
        }, totalDuration + 200);
    },

    evaluateResult(bet, targetIdx) {
        this.isSpinning = false;
        document.getElementById("wheel-spin-btn").disabled = false;
        
        App.setNavigationEnabled(true);
        document.getElementById("wheel-bet-half").disabled = false;
        document.getElementById("wheel-bet-double").disabled = false;
        document.getElementById("wheel-bet").disabled = false;
        
        // Reset wheel rotation in styling without transition
        const arcDegrees = 360 / this.sectors.length;
        const segmentCenterAngle = (targetIdx * arcDegrees) + (arcDegrees / 2);
        const rotationToTop = 270 - segmentCenterAngle;
        this.canvas.style.transition = "none";
        this.canvas.style.transform = `rotate(${rotationToTop}deg)`;
        this.canvas.offsetHeight; // force repaint
        this.canvas.style.transition = "transform 5s cubic-bezier(0.1, 0.8, 0.1, 1)"; // restore

        const sector = this.sectors[targetIdx];
        const profit = Math.floor(bet * sector.mult);

        if (sector.mult > 1.0) {
            // Profit win!
            App.updateBalance(profit);
            App.state.losses = Math.max(0, App.state.losses - 1);
            App.addBetStat(0, true, profit);

            App.audio.playWin();
            App.showToast("Победа!", `Колесо принесло умножение x${sector.mult}! Вы получили ${profit} TC!`, "win");
            App.addSimulatedFeedItem("Gamer_You", "Колесо", profit, true);
        } else if (sector.mult === 1.0 || (sector.mult > 0 && profit > 0)) {
            // Small return
            App.updateBalance(profit);
            App.state.losses = Math.max(0, App.state.losses - 1);
            App.addBetStat(0, true, profit);

            App.audio.playTone(600, 'triangle', 0.2);
            App.showToast("Возврат!", `Вы вернули ${profit} TC (x${sector.mult})!`, "win");
            App.addSimulatedFeedItem("Gamer_You", "Колесо", profit, true);
        } else {
            // Lost bet
            App.audio.playLoss();
            App.showToast("Проигрыш", `Сектор x${sector.mult}. Попробуйте еще раз!`, "loss");
            App.addSimulatedFeedItem("Gamer_You", "Колесо", bet, false);
        }
    }
};

// Initialize Games
document.addEventListener("DOMContentLoaded", () => {
    SlotsGame.init();
    MinesGame.init();
    CrashGame.init();
    WheelGame.init();
});
