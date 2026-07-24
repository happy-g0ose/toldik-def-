// ==========================================
// toldik def - Cases & Roulette Engine
// ==========================================

const CasesGame = {
    selectedCaseId: null,
    isSpinning: false,

    init() {
        this.renderCasesList();
        this.bindEvents();
    },

    bindEvents() {
        // Back to cases button
        document.getElementById("btn-back-to-cases").addEventListener("click", () => {
            if (this.isSpinning) return;
            document.getElementById("case-roulette-wrapper").style.display = "none";
            document.getElementById("cases-select-grid").style.display = "grid";
        });

        // Spin case button
        document.getElementById("btn-spin-case").addEventListener("click", () => {
            if (this.isSpinning || !this.selectedCaseId) return;
            const caseData = App.casesConfig[this.selectedCaseId];
            const price = App.getCasePrice(caseData.price);
            if (App.state.balance < price) {
                App.showToast("Недостаточно TC", "Накопите больше бурмалды!", "error");
                App.audio.playLoss();
                return;
            }
            this.spinCase(caseData);
        });

        // Inventory Modal toggle
        const inventoryModal = document.getElementById("inventory-modal");
        document.getElementById("btn-inventory").addEventListener("click", () => {
            App.audio.playClick();
            App.renderInventoryUI();
            inventoryModal.classList.add("active");
        });

        document.getElementById("close-inventory").addEventListener("click", () => {
            App.audio.playClick();
            inventoryModal.classList.remove("active");
        });
    },

    renderCasesList() {
        const grid = document.getElementById("cases-select-grid");
        const wrapper = document.getElementById("case-roulette-wrapper");
        if (!grid || !App.casesConfig) return;

        if (wrapper && !this.isSpinning) {
            wrapper.style.display = "none";
            grid.style.display = "grid";
        }

        grid.innerHTML = "";
        for (const [id, caseData] of Object.entries(App.casesConfig)) {
            const card = document.createElement("div");
            card.className = "case-card glass-card";
            const price = App.getCasePrice(caseData.price);
            card.innerHTML = `
                <div class="case-card-icon">${caseData.icon}</div>
                <h3>${caseData.name}</h3>
                <div class="case-card-desc">${caseData.desc}</div>
                <div class="case-card-price">${price.toLocaleString()} TC</div>
            `;
            card.addEventListener("click", () => {
                App.audio.playClick();
                this.selectCase(id);
            });
            grid.appendChild(card);
        }
    },

    selectCase(caseId) {
        this.selectedCaseId = caseId;
        const caseData = App.casesConfig[caseId];

        document.getElementById("cases-select-grid").style.display = "none";
        document.getElementById("case-roulette-wrapper").style.display = "block";
        document.getElementById("open-case-title").textContent = caseData.name;
        document.getElementById("open-case-price").textContent = App.getCasePrice(caseData.price).toLocaleString();

        this.renderCaseContents(caseData);
        this.buildRouletteTrack(caseData);
    },

    renderCaseContents(caseData) {
        const grid = document.getElementById("case-contents-grid");
        if (!grid) return;
        grid.innerHTML = "";

        caseData.items.forEach(itemId => {
            const item = App.itemsCatalog[itemId];
            if (!item) return;
            const card = document.createElement("div");
            card.className = `roulette-item-card rarity-${item.rarity}`;
            card.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
            `;
            grid.appendChild(card);
        });
    },

    getRandomItemFromCase(caseData) {
        // Fetch luck upgrade level
        const luckLvl = App.state.upgrades.luck || 0;

        // Rarity weights adjust dynamically (better odds with higher luck level)
        const weights = {
            common: Math.max(10, 50 - luckLvl * 6),
            rare: 30 + luckLvl * 2,
            epic: 14 + luckLvl * 2,
            legendary: 5 + Math.floor(luckLvl * 1.5),
            mythic: 1 + Math.floor(luckLvl * 0.5)
        };

        const availableItems = caseData.items.map(id => App.itemsCatalog[id]).filter(Boolean);
        
        // Calculate pool with weights
        const pool = [];
        availableItems.forEach(item => {
            const weight = weights[item.rarity] || 10;
            for (let i = 0; i < weight; i++) {
                pool.push(item);
            }
        });

        return pool[Math.floor(Math.random() * pool.length)];
    },

    buildRouletteTrack(caseData, winningItem = null) {
        const track = document.getElementById("roulette-track");
        if (!track) return;

        track.style.transition = "none";
        track.style.transform = "translateX(0px)";
        track.innerHTML = "";

        // Build 60 items for smooth roulette ribbon
        const availableItems = caseData.items.map(id => App.itemsCatalog[id]).filter(Boolean);
        const totalCards = 60;
        const targetIndex = 45; // Winning card position

        for (let i = 0; i < totalCards; i++) {
            let item;
            if (i === targetIndex && winningItem) {
                item = winningItem;
            } else {
                item = availableItems[Math.floor(Math.random() * availableItems.length)];
            }

            const card = document.createElement("div");
            card.className = `roulette-item-card rarity-${item.rarity}`;
            card.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
            `;
            track.appendChild(card);
        }
    },

    spinCase(caseData) {
        this.isSpinning = true;
        document.getElementById("btn-spin-case").disabled = true;
        document.getElementById("btn-back-to-cases").disabled = true;
        App.setNavigationEnabled(false);

        // Deduct price
        const price = App.getCasePrice(caseData.price);
        App.updateBalance(-price);
        App.addBetStat(price, false, 0);

        // Pick winning item
        const winningItem = this.getRandomItemFromCase(caseData);
        this.buildRouletteTrack(caseData, winningItem);

        const track = document.getElementById("roulette-track");
        const cardWidth = 120; // 110px width + 10px gap
        const containerWidth = document.querySelector(".roulette-container").offsetWidth;
        const targetIndex = 45;

        // Offset to align targetIndex card right at center pointer
        const targetOffset = (targetIndex * cardWidth) - (containerWidth / 2) + (cardWidth / 2) + (Math.random() * 40 - 20);

        // Trigger animation after force layout
        track.offsetHeight;
        track.style.transition = "transform 5s cubic-bezier(0.1, 0.8, 0.1, 1)";
        track.style.transform = `translateX(-${targetOffset}px)`;

        // Sound ticks during spin
        let tickCount = 0;
        const totalDuration = 5000;
        const triggerTick = (delay) => {
            if (tickCount * 400 < totalDuration) {
                App.audio.playSpinTick();
                tickCount++;
                setTimeout(() => triggerTick(delay * 1.12), delay);
            }
        };
        triggerTick(60);

        // Complete spin
        setTimeout(() => {
            this.isSpinning = false;
            document.getElementById("btn-spin-case").disabled = false;
            document.getElementById("btn-back-to-cases").disabled = false;
            App.setNavigationEnabled(true);

            // Add to inventory & stats
            App.addToInventory(winningItem.id);
            App.state.losses = Math.max(0, App.state.losses - 1);
            App.addBetStat(0, true, winningItem.price);

            App.audio.playWin();
            App.showToast("ВЫПАЛ ПРЕДМЕТ!", `Вы выбили: ${winningItem.name} (${winningItem.price.toLocaleString()} TC)!`, "win");
            App.addSimulatedFeedItem("Gamer_You", "Кейс", winningItem.price, true);
        }, totalDuration + 200);
    }
};

// Initialize Cases logic on DOM load
document.addEventListener("DOMContentLoaded", () => {
    CasesGame.init();
});
