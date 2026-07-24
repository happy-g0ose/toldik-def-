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
        pahanMode: false,
        upgrades: {
            burmalda: 0,
            slots: 0,
            mines: 0,
            crash: 0,
            wheel: 0,
            luck: 0,
            miner: 0,
            discount: 0,
            cashback: 0
        },
        inventory: [],
        luxury: {}
    },

    upgradesConfig: {
        burmalda: { name: "Бурмалдовый Генератор", desc: "Увеличивает добычу от Бурмалды", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
        slots: { name: "Слот-Машинный Чип", desc: "Множитель выигрыша в Слотах", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/><circle cx="8.5" cy="15.5" r="1.5"/></svg>' },
        mines: { name: "Саперный Радар", desc: "Множитель выигрыша в Шахтах", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93"/></svg>' },
        crash: { name: "Квантовый Двигатель", desc: "Множитель выигрыша в Краше", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l4 4-2.5-1v17h-3V5L9 6l4-4z"/></svg>' },
        wheel: { name: "Гравитационное Колесо", desc: "Множитель выигрыша в Колесе", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2v7M12 15v7M2 12h7M15 12h7"/></svg>' },
        luck: { name: "Космическое Везение", desc: "Повышает шанс редкого лута в кейсах", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0 4-4zm0 20a4 4 0 0 0 4-4 4 4 0 0 0-4 4zm-10-10a4 4 0 0 0 4 4 4 4 0 0 0-4-4zm20 0a4 4 0 0 0-4-4 4 4 0 0 0 4 4z"/><path d="M12 12c0 2 0 6-2 8"/></svg>' },
        miner: { name: "Квантовый Майнер", desc: "Генерирует TC пассивно каждую секунду", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>' },
        discount: { name: "Кейсовая Скидка", desc: "Уменьшает стоимость открытия кейсов", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>' },
        cashback: { name: "Звездный Кэшбэк", desc: "Возвращает часть проигранных ставок", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>' }
    },

    luxuryConfig: {
        yacht: { name: "Яхта Толдика", price: 1000000000, desc: "Роскошная супер-яхта с бассейном из ToldikCoins", icon: "🚢" },
        villa: { name: "Вилла на Плутоне", price: 100000000000, desc: "Огромное поместье с видом на метановые ледники", icon: "🏰" },
        planet: { name: "Малахитовая Планета", price: 10000000000000, desc: "Целая космическая сфера из малахитового камня", icon: "🪐" },
        blackhole: { name: "Своя Чёрная Дыра", price: 100000000000000000, desc: "Личный космический портал для утилизации лишней массы", icon: "🌀" },
        empire: { name: "Галактическая Империя", price: 10000000000000000000000, desc: "Абсолютная власть над миллионом цивилизаций", icon: "👑" },
        matrix: { name: "Симуляция Вселенной", price: 1000000000000000000000000, desc: "Вы покупаете этот виртуальный мир. Всё сущее теперь ваше.", icon: "🌌" }
    },

    itemsCatalog: {
        hedgehog: { id: "hedgehog", name: "Колючий Ежик", rarity: "common", price: 200, icon: '<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="hedgBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffb74d"/><stop offset="100%" stop-color="#ffa726"/></linearGradient><linearGradient id="hedgSpikes" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8d6e63"/><stop offset="100%" stop-color="#5d4037"/></linearGradient></defs><path d="M15 65 Q 40 10, 80 40 Q 90 55, 85 70 Q 75 80, 50 80 Q 25 80, 15 65 Z" fill="url(#hedgSpikes)"/><path d="M15 65 Q 10 70, 8 72 Q 15 78, 25 78 Q 30 70, 32 65 Z" fill="url(#hedgBody)"/><circle cx="20" cy="71" r="2" fill="#000"/><path d="M40 75 Q 40 85, 43 85" stroke="#5d4037" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M60 75 Q 60 85, 63 85" stroke="#5d4037" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M30 45 L25 35 M45 35 L45 20 M60 38 L65 25 M72 50 L85 45 M35 30 L25 25 M55 25 L58 12 M70 32 L80 20" stroke="#3e2723" stroke-width="3" stroke-linecap="round"/></svg>' },
        underwear: { id: "underwear", name: "Счастливые Трусы", rarity: "common", price: 350, icon: '<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="boxerGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff4081"/><stop offset="100%" stop-color="#f50057"/></linearGradient></defs><path d="M20 25 H 80 V 60 Q 65 65, 55 58 L 50 68 L 45 58 Q 35 65, 20 60 Z" fill="url(#boxerGrad)"/><rect x="20" y="25" width="60" height="8" rx="2" fill="#fff" opacity="0.9"/><path d="M35 40 Q 35 37, 38 37 Q 41 37, 41 40 Q 41 43, 38 46 L 38 46 L 35 43 Z" fill="#fff" opacity="0.8"/><path d="M65 40 Q 65 37, 68 37 Q 71 37, 71 40 Q 71 43, 68 46 L 68 46 L 65 43 Z" fill="#fff" opacity="0.8"/><path d="M50 42 Q 53 42, 54 44 L 54 49 L 46 49 L 46 44 Z" fill="#fff"/><polygon points="54,45 57,46 54,47" fill="#ff9100"/></svg>' },
        glasses: { id: "glasses", name: "Очки Бурмалды", rarity: "common", price: 500, icon: '<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="glassGold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ffd700"/><stop offset="100%" stop-color="#ffab00"/></linearGradient><linearGradient id="lensGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#212121"/><stop offset="100%" stop-color="#000000"/></linearGradient></defs><path d="M15 42 H 85 V 47 H 15 Z" fill="url(#glassGold)"/><path d="M20 45 H 44 V 58 C 44 65, 20 65, 20 58 Z" fill="url(#lensGrad)" stroke="url(#glassGold)" stroke-width="2"/><path d="M56 45 H 80 V 58 C 80 65, 56 65, 56 58 Z" fill="url(#lensGrad)" stroke="url(#glassGold)" stroke-width="2"/><polygon points="23,48 35,48 28,58 23,58" fill="#fff" opacity="0.3"/><polygon points="59,48 71,48 64,58 59,58" fill="#fff" opacity="0.3"/><rect x="44" y="44" width="12" height="4" fill="url(#glassGold)"/></svg>' },
        windows: { id: "windows", name: "Наши Окна", rarity: "rare", price: 1500, icon: '<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="winGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#80deea"/><stop offset="100%" stop-color="#00acc1"/></linearGradient><linearGradient id="winFrame" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#cfd8dc"/><stop offset="100%" stop-color="#78909c"/></linearGradient></defs><rect x="15" y="15" width="70" height="70" rx="4" fill="url(#winFrame)"/><rect x="20" y="20" width="27" height="27" fill="url(#winGlass)"/><rect x="53" y="20" width="27" height="27" fill="url(#winGlass)"/><rect x="20" y="53" width="27" height="27" fill="url(#winGlass)"/><rect x="53" y="53" width="27" height="27" fill="url(#winGlass)"/><polygon points="20,25 25,20 35,20 20,35" fill="#fff" opacity="0.4"/><polygon points="53,25 58,20 68,20 53,35" fill="#fff" opacity="0.4"/><polygon points="20,58 25,53 35,53 20,68" fill="#fff" opacity="0.4"/><polygon points="53,58 58,53 68,53 53,68" fill="#fff" opacity="0.4"/></svg>' },
        poster: { id: "poster", name: "Плакат Толдика", rarity: "rare", price: 3000, icon: '<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="posterGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffe082"/><stop offset="100%" stop-color="#ffb300"/></linearGradient><linearGradient id="posterBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b39ddb"/><stop offset="100%" stop-color="#5e35b1"/></linearGradient></defs><rect x="15" y="10" width="70" height="80" rx="6" fill="url(#posterGold)" stroke="#ff8f00" stroke-width="2"/><rect x="20" y="15" width="60" height="70" rx="3" fill="url(#posterBg)"/><path d="M40 38 l 5-8 l 5 8 l 5-8 l 5 8 Z" fill="#ffd54f"/><circle cx="40" cy="38" r="1" fill="#e91e63"/><circle cx="50" cy="38" r="1" fill="#e91e63"/><circle cx="45" cy="30" r="1.5" fill="#e91e63"/><path d="M42 58 Q 45 42, 50 42 Q 55 42, 58 50 Q 62 55, 62 65 H 38 Z" fill="#fff"/><polygon points="50,44 54,45 50,46" fill="#ff9100"/><circle cx="48" cy="43" r="1" fill="#000"/><text x="50" y="77" font-size="7" font-weight="900" fill="#ffd54f" text-anchor="middle" font-family="\'Unbounded\', sans-serif">TOLDIK</text></svg>' },
        reactor_item: { id: "reactor_item", name: "Мини-Реактор", rarity: "epic", price: 8000, icon: '<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><radialGradient id="reactorCore" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#64ffda"/><stop offset="50%" stop-color="#1de9b6"/><stop offset="100%" stop-color="#004d40"/></radialGradient></defs><circle cx="50" cy="50" r="42" fill="none" stroke="#00bfa5" stroke-width="3" stroke-dasharray="8 4"/><circle cx="50" cy="50" r="35" fill="none" stroke="#64ffda" stroke-width="1.5"/><circle cx="50" cy="50" r="22" fill="url(#reactorCore)"/><circle cx="50" cy="15" r="4" fill="#a7ffeb"/><circle cx="20" cy="65" r="4" fill="#a7ffeb"/><circle cx="80" cy="65" r="4" fill="#a7ffeb"/><path d="M50 28 L50 72 M28 50 L72 50" stroke="#64ffda" stroke-width="2" opacity="0.6"/></svg>' },
        crystal_item: { id: "crystal_item", name: "Малахитовый Артефакт", rarity: "epic", price: 15000, icon: '<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="malachiteGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#69f0ae"/><stop offset="50%" stop-color="#00e676"/><stop offset="100%" stop-color="#00c853"/></linearGradient></defs><polygon points="50,15 80,35 80,65 50,85 20,65 20,35" fill="url(#malachiteGrad)"/><polygon points="50,15 50,45 80,35" fill="#fff" opacity="0.25"/><polygon points="80,35 50,45 80,65" fill="#000" opacity="0.15"/><polygon points="80,65 50,45 50,85" fill="#000" opacity="0.3"/><polygon points="50,85 50,45 20,65" fill="#000" opacity="0.2"/><polygon points="20,65 50,45 20,35" fill="#fff" opacity="0.1"/><polygon points="20,35 50,45 50,15" fill="#fff" opacity="0.35"/><polygon points="45,22 55,22 50,15" fill="#fff" opacity="0.8"/><polygon points="73,38 78,43 80,35" fill="#fff" opacity="0.8"/></svg>' },
        golden_toldik: { id: "golden_toldik", name: "Золотой Толдик", rarity: "legendary", price: 50000, icon: '<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="goldCrown" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff9c4"/><stop offset="30%" stop-color="#ffd54f"/><stop offset="100%" stop-color="#ff8f00"/></linearGradient><radialGradient id="rubyGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ff5252"/><stop offset="100%" stop-color="#c62828"/></radialGradient></defs><path d="M15 70 L 22 35 L 38 52 L 50 25 L 62 52 L 78 35 L 85 70 Z" fill="url(#goldCrown)" stroke="#ff6f00" stroke-width="2"/><rect x="15" y="70" width="70" height="8" rx="2" fill="url(#goldCrown)" stroke="#ff6f00" stroke-width="2"/><circle cx="22" cy="35" r="3.5" fill="url(#rubyGlow)"/><circle cx="50" cy="25" r="3.5" fill="url(#rubyGlow)"/><circle cx="78" cy="35" r="3.5" fill="url(#rubyGlow)"/><circle cx="30" cy="74" r="2.5" fill="#29b6f6"/><circle cx="50" cy="74" r="2.5" fill="url(#rubyGlow)"/><circle cx="70" cy="74" r="2.5" fill="#29b6f6"/><path d="M30 20 l 2 4 l 4 2 l-4 2 l-2 4 l-2-4 l-4-2 l 4-2 Z" fill="#fff" opacity="0.9"/><path d="M72 20 l 1.5 3 l 3 1.5 l-3 1.5 l-1.5 3 l-1.5-3 l-3-1.5 l 3-1.5 Z" fill="#fff" opacity="0.9"/></svg>' },
        singular_goose: { id: "singular_goose", name: "Сингулярная Бурмалда", rarity: "mythic", price: 200000, icon: '<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><radialGradient id="vortexBg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#000000"/><stop offset="40%" stop-color="#4a148c"/><stop offset="80%" stop-color="#0d47a1"/><stop offset="100%" stop-color="#000000"/></radialGradient><linearGradient id="spiralGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e040fb"/><stop offset="50%" stop-color="#00e5ff"/><stop offset="100%" stop-color="#ea80fc"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="url(#vortexBg)"/><circle cx="50" cy="50" r="12" fill="#000" stroke="#00e5ff" stroke-width="2" filter="drop-shadow(0 0 8px #00e5ff)"/><path d="M50 50 Q 65 30, 80 50 Q 60 70, 50 50 Z" fill="url(#spiralGrad)" opacity="0.4" transform="rotate(30 50 50)"/><path d="M50 50 Q 35 70, 20 50 Q 40 30, 50 50 Z" fill="url(#spiralGrad)" opacity="0.4" transform="rotate(30 50 50)"/><path d="M50 50 Q 70 65, 50 80 Q 30 60, 50 50 Z" fill="url(#spiralGrad)" opacity="0.4" transform="rotate(120 50 50)"/><path d="M50 50 Q 30 35, 50 20 Q 70 40, 50 50 Z" fill="url(#spiralGrad)" opacity="0.4" transform="rotate(120 50 50)"/></svg>' }
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
        let mult = this.upgradeLevels[level].multiplier;
        if (this.state.pahanMode) {
            mult *= 100;
        }
        return mult;
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
            
            // Custom toast message based on upgrade type
            let message = `Ваш множитель увеличен до ${this.upgradeLevels[nextLevel].multiplier}x`;
            if (id === 'miner') {
                const minerRates = [0, 5, 20, 75, 250, 1000];
                message = `Ваш пассивный доход увеличен до +${minerRates[nextLevel]} TC/сек`;
            } else if (id === 'discount') {
                const discountRates = [0, 5, 10, 18, 28, 45];
                message = `Скидка на кейсы увеличена до ${discountRates[nextLevel]}%`;
            } else if (id === 'cashback') {
                const cashbackRates = [0, 3, 7, 12, 20, 35];
                message = `Ваш кэшбэк увеличен до ${cashbackRates[nextLevel]}%`;
            } else if (id === 'luck') {
                message = `Ваша Космическая Удача прокачана до уровня ${nextLevel}`;
            }

            this.showToast("Улучшение куплено!", message, "success");
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
            
            // Custom stats display text based on type
            let currentStatText = `Множитель: <strong>${currentMult}x</strong>`;
            if (id === 'miner') {
                const minerRates = [0, 5, 20, 75, 250, 1000];
                currentStatText = `Доход: <strong>+${minerRates[currentLevel]} TC/сек</strong>`;
                nextMultText = isMax ? "MAX" : `+${minerRates[currentLevel + 1]} TC/сек`;
            } else if (id === 'discount') {
                const discountRates = [0, 5, 10, 18, 28, 45];
                currentStatText = `Скидка: <strong>${discountRates[currentLevel]}%</strong>`;
                nextMultText = isMax ? "MAX" : `${discountRates[currentLevel + 1]}%`;
            } else if (id === 'cashback') {
                const cashbackRates = [0, 3, 7, 12, 20, 35];
                currentStatText = `Кэшбэк: <strong>${cashbackRates[currentLevel]}%</strong>`;
                nextMultText = isMax ? "MAX" : `${cashbackRates[currentLevel + 1]}%`;
            } else if (id === 'luck') {
                currentStatText = `Везение: <strong>Lvl ${currentLevel}</strong>`;
                nextMultText = isMax ? "MAX" : `Lvl ${currentLevel + 1}`;
            }

            const card = document.createElement("div");
            card.className = "upgrade-card glass-card";
            card.innerHTML = `
                <div class="upgrade-icon">${config.icon}</div>
                <div class="upgrade-info">
                    <h3>${config.name} <span class="upgrade-level">Lvl ${currentLevel}</span></h3>
                    <p class="upgrade-desc">${config.desc}</p>
                    <div class="upgrade-stats">
                        <span>${currentStatText}</span>
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
        this.renderLuxuryUI();
        
        // Passive income miner loop (generates TC every second)
        setInterval(() => {
            const minerLvl = this.state.upgrades.miner || 0;
            const rates = [0, 5, 20, 75, 250, 1000];
            let income = rates[minerLvl];
            if (this.state.pahanMode) income = 50000; // 50k passive in Pahan Mode
            if (income > 0) {
                this.updateBalance(income);
            }
        }, 1000);

        // Initial toast welcoming the user
        setTimeout(() => {
            if (this.state.pahanMode) {
                this.showToast("👑 Режим Пахана активен!", "Выигрыш x100 и абсолютная удача включены.", "success");
            } else {
                this.showToast("С возвращением в toldik def!", "Заряжайте реактор Бурмалды для получения TC.", "info");
            }
        }, 1000);
    },

    // LocalStorage settings
    loadSettings() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('pahan') === 'true' || localStorage.getItem('toldik_def_pahan') === 'true') {
            this.state.pahanMode = true;
            localStorage.setItem('toldik_def_pahan', 'true');
        } else {
            this.state.pahanMode = false;
        }

        if (urlParams.get('pahan') === 'false') {
            this.state.pahanMode = false;
            localStorage.removeItem('toldik_def_pahan');
        }

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

        const savedLuxury = localStorage.getItem("toldik_def_luxury");
        if (savedLuxury !== null) {
            try {
                this.state.luxury = JSON.parse(savedLuxury);
            } catch (e) {
                console.error("Failed to parse luxury", e);
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
        localStorage.setItem("toldik_def_luxury", JSON.stringify(this.state.luxury));
    },

    updateBalance(change) {
        this.state.balance += change;
        if (this.state.balance < 0) this.state.balance = 0;
        this.saveSettings();
        this.updateBalanceUI();
    },

    getCasePrice(basePrice) {
        const discountRates = [0, 0.05, 0.10, 0.18, 0.28, 0.45];
        const discountLvl = this.state.upgrades.discount || 0;
        const discountPercent = discountRates[discountLvl];
        return Math.floor(basePrice * (1 - discountPercent));
    },

    applyBetCashback(betAmount) {
        if (betAmount <= 0) return;
        const cashbackRates = [0, 0.03, 0.07, 0.12, 0.20, 0.35];
        const cashbackLvl = this.state.upgrades.cashback || 0;
        const cashbackPercent = cashbackRates[cashbackLvl];
        if (cashbackPercent > 0) {
            const cashbackAmount = Math.floor(betAmount * cashbackPercent);
            if (cashbackAmount > 0) {
                setTimeout(() => {
                    this.updateBalance(cashbackAmount);
                    this.showToast("Кэшбэк!", `Космический кэшбэк вернул вам +${cashbackAmount.toLocaleString()} TC`, "info");
                }, 800);
            }
        }
    },

    updateBalanceUI() {
        const el = document.getElementById("balance-val");
        if (el) {
            const startVal = parseFloat(el.textContent.replace(/,/g, '')) || 0;
            const endVal = this.state.balance;
            if (endVal > 1e12) {
                el.textContent = this.formatBigNumber(endVal);
            } else {
                this.animateNumber(el, startVal, endVal, 500);
            }
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
        // Logo secret clicks for Pahan Mode
        let logoClicks = 0;
        const logo = document.querySelector(".logo-area");
        if (logo) {
            logo.addEventListener("click", () => {
                logoClicks++;
                if (logoClicks >= 5) {
                    logoClicks = 0;
                    this.state.pahanMode = !this.state.pahanMode;
                    if (this.state.pahanMode) {
                        localStorage.setItem('toldik_def_pahan', 'true');
                        this.showToast("👑 Режим Пахана активирован!", "Удача x100 и выигрыши x100 включены.", "success");
                    } else {
                        localStorage.removeItem('toldik_def_pahan');
                        this.showToast("Режим Пахана отключен", "Настройки сброшены.", "info");
                    }
                    this.updateBalanceUI();
                }
            });
        }

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
                    this.renderLuxuryUI();
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
    },

    formatBigNumber(num) {
        if (num >= 1e24) return (num / 1e24).toFixed(2) + " септиллионов";
        if (num >= 1e21) return (num / 1e21).toFixed(2) + " секстиллионов";
        if (num >= 1e18) return (num / 1e18).toFixed(2) + " квинтиллионов";
        if (num >= 1e15) return (num / 1e15).toFixed(2) + " квадриллионов";
        if (num >= 1e12) return (num / 1e12).toFixed(2) + " триллионов";
        if (num >= 1e9) return (num / 1e9).toFixed(2) + " млрд";
        if (num >= 1e6) return (num / 1e6).toFixed(2) + " млн";
        return num.toLocaleString();
    },

    renderLuxuryUI() {
        const storeSection = document.getElementById("luxury-store-section");
        const sidebarSection = document.getElementById("sidebar-luxury-section");
        if (!storeSection || !sidebarSection) return;

        const showLuxury = this.state.pahanMode || this.state.balance > 500000000 || Object.keys(this.state.luxury).length > 0;
        if (showLuxury) {
            storeSection.style.display = "block";
            sidebarSection.style.display = "block";
        } else {
            storeSection.style.display = "none";
            sidebarSection.style.display = "none";
            return;
        }

        // Render Upgrades Grid
        const grid = document.getElementById("luxury-grid");
        if (grid) {
            grid.innerHTML = "";
            for (const [id, item] of Object.entries(this.luxuryConfig)) {
                const isBought = this.state.luxury[id] === true;
                const card = document.createElement("div");
                card.className = `upgrade-card glass-card ${isBought ? 'bought' : ''}`;
                
                let displayPrice = this.formatBigNumber(item.price);
                
                card.innerHTML = `
                    <div class="upgrade-icon" style="font-size: 2.2rem; display: flex; align-items: center; justify-content: center; background: rgba(255,215,0,0.1); border-radius: 12px; width: 60px; height: 60px;">${item.icon}</div>
                    <div class="upgrade-info" style="flex-grow: 1;">
                        <h3>${item.name}</h3>
                        <p class="upgrade-desc" style="font-size: 0.85rem; opacity: 0.7; margin-top: 4px;">${item.desc}</p>
                    </div>
                    <button class="btn btn-action ${isBought ? 'disabled' : ''}" onclick="App.buyLuxuryItem('${id}')" ${isBought ? 'disabled' : ''} style="margin-left: auto; min-width: 140px; font-size: 0.85rem;">
                        ${isBought ? 'ВЛАДЕЛЕЦ 👑' : displayPrice}
                    </button>
                `;
                grid.appendChild(card);
            }
        }

        // Render Sidebar Badges
        const badgesContainer = document.getElementById("sidebar-luxury-badges");
        if (badgesContainer) {
            badgesContainer.innerHTML = "";
            let boughtAny = false;
            for (const [id, item] of Object.entries(this.luxuryConfig)) {
                if (this.state.luxury[id]) {
                    boughtAny = true;
                    const badge = document.createElement("span");
                    badge.className = "badge";
                    badge.style.background = "linear-gradient(135deg, #ffd700, #ff8f00)";
                    badge.style.color = "#000";
                    badge.style.padding = "6px 10px";
                    badge.style.borderRadius = "8px";
                    badge.style.fontSize = "0.75rem";
                    badge.style.fontWeight = "750";
                    badge.style.border = "1px solid #ffab00";
                    badge.style.display = "inline-flex";
                    badge.style.alignItems = "center";
                    badge.style.gap = "4px";
                    badge.style.boxShadow = "0 4px 10px rgba(255, 215, 0, 0.2)";
                    badge.innerHTML = `<span>${item.icon}</span> <span>${item.name}</span>`;
                    badgesContainer.appendChild(badge);
                }
            }
            if (!boughtAny) {
                badgesContainer.innerHTML = `<span style="font-size: 0.75rem; color: var(--color-text-muted);">Имущества пока нет. Приобретите в Улучшениях!</span>`;
            }
        }
    },

    buyLuxuryItem(id) {
        const item = this.luxuryConfig[id];
        if (!item || this.state.luxury[id]) return;

        if (this.state.balance >= item.price) {
            this.updateBalance(-item.price);
            this.state.luxury[id] = true;
            this.saveSettings();
            this.renderLuxuryUI();
            this.showToast("Элитная покупка!", `Вы приобрели: ${item.name}!`, "win");
            this.audio.playWin();
        } else {
            this.showToast("Недостаточно TC", "Вам не хватает толдиккоинов на эту роскошь!", "loss");
            this.audio.playLoss();
        }
    }
};

// Initialize App when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    App.init();
});
