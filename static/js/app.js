// SoleMate Shoe Shop POS & Inventory Management System (Client-Ready & Frictionless Counter)

let state = {
    products: [],
    categories: ['All', 'Running', 'Sports', 'Casual', 'Formal', 'Boots', 'Sandals'],
    selectedCategory: 'All',
    cart: [],
    settings: {
        store_name: "SoleMate Shoe Store",
        store_address: "123 Commercial Plaza, Main Boulevard",
        store_phone: "+1 (555) 789-2436",
        currency_symbol: "PKR",
        tax_rate: "0.0",
        receipt_footer: "Thank you for shopping with us! Shoes can be exchanged within 7 days in unworn condition with box & receipt."
    },
    activeTab: 'pos',
    paymentMethod: 'Cash',
    paymentMode: 'instant',
    orderFilter: 'all',
    lowStockFilter: false,
    generatedVariants: [],
    
    // Auth & Security: Default to Counter / Cashier Mode (No PIN required to sell)
    currentUser: { role: 'cashier', full_name: 'Counter Staff', username: 'cashier' },
    authToken: localStorage.getItem('solemate_admin_token') || null,
    enteredAdminPin: '',
    adminSuccessCallback: null
};

// SVG Placeholder when offline
const OFFLINE_SHOE_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 120' fill='%2394a3b8'%3E%3Cpath d='M180 80c-5-2-30-15-55-25-10-4-25-4-35 0L60 70H20c-10 0-15 8-15 15v10c0 5 4 10 10 10h165c10 0 15-8 15-15s-5-10-15-10zm-140 5c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5zm30 0c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5z'/%3E%3C/svg%3E";

// Embedded Shoe Catalog for 100% Offline Standalone Mobile / Desktop Use
const DEFAULT_SHOE_CATALOG = [{"id": 8, "name": "XARASOFT Joggers", "brand": "XARA SOFT", "category": "Running", "gender": "Men", "base_price": 1200.0, "cost_price": 0.0, "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", "description": "", "created_at": "2026-10-16 16:17:36", "variant_count": 8, "total_stock": 35, "variants": [{"id": 34, "product_id": 8, "sku": "XAR-XAR-BL-US8", "barcode": "1526608", "size": "US 8", "color": "Black", "stock_quantity": 2, "price": 1200.0, "created_at": "2026-10-16 16:17:36"}, {"id": 35, "product_id": 8, "sku": "XAR-XAR-BL-US9", "barcode": "5293774", "size": "US 9", "color": "Black", "stock_quantity": 5, "price": 1200.0, "created_at": "2026-10-16 16:17:36"}, {"id": 36, "product_id": 8, "sku": "XAR-XAR-BL-US10", "barcode": "3807666", "size": "US 10", "color": "Black", "stock_quantity": 5, "price": 1200.0, "created_at": "2026-10-16 16:17:36"}, {"id": 37, "product_id": 8, "sku": "XAR-XAR-BL-US11", "barcode": "9918133", "size": "US 11", "color": "Black", "stock_quantity": 4, "price": 1200.0, "created_at": "2026-10-16 16:17:36"}, {"id": 38, "product_id": 8, "sku": "XAR-XAR-WH-US8", "barcode": "6996370", "size": "US 8", "color": "White", "stock_quantity": 5, "price": 1200.0, "created_at": "2026-10-16 16:17:36"}, {"id": 39, "product_id": 8, "sku": "XAR-XAR-WH-US9", "barcode": "8266974", "size": "US 9", "color": "White", "stock_quantity": 4, "price": 1200.0, "created_at": "2026-10-16 16:17:36"}, {"id": 40, "product_id": 8, "sku": "XAR-XAR-WH-US10", "barcode": "7916370", "size": "US 10", "color": "White", "stock_quantity": 5, "price": 1200.0, "created_at": "2026-10-16 16:17:36"}, {"id": 41, "product_id": 8, "sku": "XAR-XAR-WH-US11", "barcode": "4950090", "size": "US 11", "color": "White", "stock_quantity": 5, "price": 1200.0, "created_at": "2026-10-16 16:17:36"}]}, {"id": 6, "name": "Arizona Birko-Flor Sandal", "brand": "Birkenstock", "category": "Sandals", "gender": "Unisex", "base_price": 110.0, "cost_price": 0.0, "image_url": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80", "description": "Two-strap slide with anatomical cork-latex footbed and soft suede lining.", "created_at": "2026-10-16 15:13:11", "variant_count": 5, "total_stock": 35, "variants": [{"id": 27, "product_id": 6, "sku": "BRK-ARZ-MC-40", "barcode": "7896001", "size": "US 7 / EU 40", "color": "Mocha Brown", "stock_quantity": 8, "price": 110.0, "created_at": "2026-10-16 15:13:11"}, {"id": 28, "product_id": 6, "sku": "BRK-ARZ-MC-41", "barcode": "7896002", "size": "US 8 / EU 41", "color": "Mocha Brown", "stock_quantity": 7, "price": 110.0, "created_at": "2026-10-16 15:13:11"}, {"id": 29, "product_id": 6, "sku": "BRK-ARZ-MC-42", "barcode": "7896003", "size": "US 9 / EU 42.5", "color": "Mocha Brown", "stock_quantity": 9, "price": 110.0, "created_at": "2026-10-16 15:13:11"}, {"id": 30, "product_id": 6, "sku": "BRK-ARZ-BK-41", "barcode": "7896004", "size": "US 8 / EU 41", "color": "Black Matte", "stock_quantity": 6, "price": 110.0, "created_at": "2026-10-16 15:13:11"}, {"id": 31, "product_id": 6, "sku": "BRK-ARZ-BK-42", "barcode": "7896005", "size": "US 9 / EU 42.5", "color": "Black Matte", "stock_quantity": 5, "price": 110.0, "created_at": "2026-10-16 15:13:11"}]}, {"id": 5, "name": "6-Inch Premium Waterproof Boot", "brand": "Timberland", "category": "Boots", "gender": "Unisex", "base_price": 198.0, "cost_price": 0.0, "image_url": "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80", "description": "The original yellow work boot with seam-sealed waterproof construction and PrimaLoft insulation.", "created_at": "2026-10-16 15:13:11", "variant_count": 4, "total_stock": 14, "variants": [{"id": 23, "product_id": 5, "sku": "TMB-6IN-WH-41", "barcode": "7895001", "size": "US 8 / EU 41", "color": "Wheat Nubuck", "stock_quantity": 4, "price": 198.0, "created_at": "2026-10-16 15:13:11"}, {"id": 24, "product_id": 5, "sku": "TMB-6IN-WH-42", "barcode": "7895002", "size": "US 9 / EU 42.5", "color": "Wheat Nubuck", "stock_quantity": 5, "price": 198.0, "created_at": "2026-10-16 15:13:11"}, {"id": 25, "product_id": 5, "sku": "TMB-6IN-WH-44", "barcode": "7895003", "size": "US 10 / EU 44", "color": "Wheat Nubuck", "stock_quantity": 2, "price": 198.0, "created_at": "2026-10-16 15:13:11"}, {"id": 26, "product_id": 5, "sku": "TMB-6IN-BK-42", "barcode": "7895004", "size": "US 9 / EU 42.5", "color": "Black Nubuck", "stock_quantity": 3, "price": 198.0, "created_at": "2026-10-16 15:13:11"}]}, {"id": 4, "name": "Smash V2 Leather Sneaker", "brand": "Puma", "category": "Casual", "gender": "Unisex", "base_price": 65.0, "cost_price": 0.0, "image_url": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80", "description": "Tennis-inspired silhouette with clean leather exterior and durable rubber outsole.", "created_at": "2026-10-16 15:13:11", "variant_count": 5, "total_stock": 32, "variants": [{"id": 18, "product_id": 4, "sku": "PUM-SM-WB-40", "barcode": "7894001", "size": "US 7 / EU 40", "color": "Puma White / Black", "stock_quantity": 5, "price": 65.0, "created_at": "2026-10-16 15:13:11"}, {"id": 19, "product_id": 4, "sku": "PUM-SM-WB-41", "barcode": "7894002", "size": "US 8 / EU 41", "color": "Puma White / Black", "stock_quantity": 10, "price": 65.0, "created_at": "2026-10-16 15:13:11"}, {"id": 20, "product_id": 4, "sku": "PUM-SM-WB-42", "barcode": "7894003", "size": "US 9 / EU 42.5", "color": "Puma White / Black", "stock_quantity": 8, "price": 65.0, "created_at": "2026-10-16 15:13:11"}, {"id": 21, "product_id": 4, "sku": "PUM-SM-BK-41", "barcode": "7894004", "size": "US 8 / EU 41", "color": "All Black", "stock_quantity": 4, "price": 65.0, "created_at": "2026-10-16 15:13:11"}, {"id": 22, "product_id": 4, "sku": "PUM-SM-BK-42", "barcode": "7894005", "size": "US 9 / EU 42.5", "color": "All Black", "stock_quantity": 5, "price": 65.0, "created_at": "2026-10-16 15:13:11"}]}, {"id": 3, "name": "Tilden Cap Leather Oxford", "brand": "Clarks", "category": "Formal", "gender": "Men", "base_price": 95.0, "cost_price": 0.0, "image_url": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80", "description": "Classic dress shoe made from rich full-grain leather with cushioned OrthoLite insole.", "created_at": "2026-10-16 15:13:11", "variant_count": 6, "total_stock": 31, "variants": [{"id": 12, "product_id": 3, "sku": "CLK-TIL-TN-41", "barcode": "7893001", "size": "US 8 / EU 41", "color": "Dark Tan Brown", "stock_quantity": 3, "price": 95.0, "created_at": "2026-10-16 15:13:11"}, {"id": 13, "product_id": 3, "sku": "CLK-TIL-TN-42", "barcode": "7893002", "size": "US 9 / EU 42.5", "color": "Dark Tan Brown", "stock_quantity": 6, "price": 95.0, "created_at": "2026-10-16 15:13:11"}, {"id": 14, "product_id": 3, "sku": "CLK-TIL-TN-44", "barcode": "7893003", "size": "US 10 / EU 44", "color": "Dark Tan Brown", "stock_quantity": 3, "price": 95.0, "created_at": "2026-10-16 15:13:11"}, {"id": 15, "product_id": 3, "sku": "CLK-TIL-BK-41", "barcode": "7893004", "size": "US 8 / EU 41", "color": "Glossy Black", "stock_quantity": 8, "price": 95.0, "created_at": "2026-10-16 15:13:11"}, {"id": 16, "product_id": 3, "sku": "CLK-TIL-BK-42", "barcode": "7893005", "size": "US 9 / EU 42.5", "color": "Glossy Black", "stock_quantity": 7, "price": 95.0, "created_at": "2026-10-16 15:13:11"}, {"id": 17, "product_id": 3, "sku": "CLK-TIL-BK-44", "barcode": "7893006", "size": "US 10 / EU 44", "color": "Glossy Black", "stock_quantity": 4, "price": 95.0, "created_at": "2026-10-16 15:13:11"}]}, {"id": 2, "name": "Ultraboost Light", "brand": "Adidas", "category": "Sports", "gender": "Unisex", "base_price": 160.0, "cost_price": 0.0, "image_url": "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&auto=format&fit=crop&q=80", "description": "Epic energy return with 30% lighter Boost material and Primeknit+ upper.", "created_at": "2026-10-16 15:13:11", "variant_count": 5, "total_stock": 30, "variants": [{"id": 7, "product_id": 2, "sku": "ADI-UB-WH-41", "barcode": "7892001", "size": "US 8 / EU 41", "color": "Cloud White", "stock_quantity": 7, "price": 160.0, "created_at": "2026-10-16 15:13:11"}, {"id": 8, "product_id": 2, "sku": "ADI-UB-WH-42", "barcode": "7892002", "size": "US 9 / EU 42.5", "color": "Cloud White", "stock_quantity": 9, "price": 160.0, "created_at": "2026-10-16 15:13:11"}, {"id": 9, "product_id": 2, "sku": "ADI-UB-WH-44", "barcode": "7892003", "size": "US 10 / EU 44", "color": "Cloud White", "stock_quantity": 1, "price": 160.0, "created_at": "2026-10-16 15:13:11"}, {"id": 10, "product_id": 2, "sku": "ADI-UB-BK-42", "barcode": "7892004", "size": "US 9 / EU 42.5", "color": "Core Black", "stock_quantity": 5, "price": 160.0, "created_at": "2026-10-16 15:13:11"}, {"id": 11, "product_id": 2, "sku": "ADI-UB-BK-44", "barcode": "7892005", "size": "US 10 / EU 44", "color": "Core Black", "stock_quantity": 8, "price": 160.0, "created_at": "2026-10-16 15:13:11"}]}, {"id": 1, "name": "Air Zoom Pegasus 40", "brand": "Nike", "category": "Running", "gender": "Men", "base_price": 130.0, "cost_price": 0.0, "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80", "description": "Responsive everyday running shoe with dual Zoom Air units and engineered mesh.", "created_at": "2026-10-16 15:13:11", "variant_count": 6, "total_stock": 41, "variants": [{"id": 1, "product_id": 1, "sku": "NIKE-PEG40-RD-41", "barcode": "7891001", "size": "US 8 / EU 41", "color": "Crimson Red", "stock_quantity": 6, "price": 130.0, "created_at": "2026-10-16 15:13:11"}, {"id": 2, "product_id": 1, "sku": "NIKE-PEG40-RD-42", "barcode": "7891002", "size": "US 9 / EU 42.5", "color": "Crimson Red", "stock_quantity": 7, "price": 130.0, "created_at": "2026-10-16 15:13:11"}, {"id": 3, "product_id": 1, "sku": "NIKE-PEG40-RD-44", "barcode": "7891003", "size": "US 10 / EU 44", "color": "Crimson Red", "stock_quantity": 4, "price": 130.0, "created_at": "2026-10-16 15:13:11"}, {"id": 4, "product_id": 1, "sku": "NIKE-PEG40-BK-41", "barcode": "7891004", "size": "US 8 / EU 41", "color": "Midnight Black", "stock_quantity": 10, "price": 130.0, "created_at": "2026-10-16 15:13:11"}, {"id": 5, "product_id": 1, "sku": "NIKE-PEG40-BK-42", "barcode": "7891005", "size": "US 9 / EU 42.5", "color": "Midnight Black", "stock_quantity": 12, "price": 130.0, "created_at": "2026-10-16 15:13:11"}, {"id": 6, "product_id": 1, "sku": "NIKE-PEG40-BK-44", "barcode": "7891006", "size": "US 10 / EU 44", "color": "Midnight Black", "stock_quantity": 2, "price": 130.0, "created_at": "2026-10-16 15:13:11"}]}];

// --- Initialization (Bulletproof DOM ready) ---
async function startApp() {
    registerServiceWorker();
    startClock();
    tryLoadCachedProducts();
    await initializeSession();
    await loadSettings();
    await loadProducts();
    setupEventListeners();
    startServerHeartbeat();
    lucide.createIcons();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}

function tryLoadCachedProducts() {
    try {
        let cached = localStorage.getItem('solemate_cached_products');
        if (!cached || cached === '[]' || cached === 'null') {
            localStorage.setItem('solemate_cached_products', JSON.stringify(DEFAULT_SHOE_CATALOG));
            cached = JSON.stringify(DEFAULT_SHOE_CATALOG);
        }
        if (cached) {
            const list = JSON.parse(cached);
            if (Array.isArray(list) && list.length > 0) {
                state.products = list;
                renderProductGrid();
                checkLowStockBadge();
            }
        }
    } catch (e) {
        console.warn("Could not read cached products:", e);
    }
}

function updateServerStatus(isOnline) {
    const banner = document.getElementById('serverOfflineBanner');
    const dot = document.getElementById('serverLiveDot');
    const text = document.getElementById('serverLiveText');
    const pill = document.getElementById('serverPill');

    if (isOnline) {
        if (banner) banner.classList.add('hidden');
        if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse";
        if (text) {
            text.textContent = "Server Online";
            text.className = "text-emerald-300 font-semibold";
        }
        if (pill) pill.className = "hidden sm:flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 text-[10px]";
    } else {
        if (banner) banner.classList.remove('hidden');
        if (dot) dot.className = "w-2 h-2 rounded-full bg-rose-500";
        if (text) {
            text.textContent = "Server Offline";
            text.className = "text-rose-400 font-semibold";
        }
        if (pill) pill.className = "hidden sm:flex items-center gap-1.5 bg-rose-950/80 px-2 py-1 rounded-lg border border-rose-700/80 text-[10px]";
    }
}

function startServerHeartbeat() {
    setInterval(async () => {
        try {
            const res = await fetch('/api/settings', { cache: 'no-store' });
            if (res.ok) {
                const banner = document.getElementById('serverOfflineBanner');
                const wasOffline = banner && !banner.classList.contains('hidden');
                updateServerStatus(true);
                if (wasOffline) {
                    await loadProducts();
                    if (state.activeTab === 'inventory') renderInventoryTable();
                    if (state.activeTab === 'orders') loadOrders();
                }
            } else {
                updateServerStatus(false);
            }
        } catch (e) {
            updateServerStatus(false);
        }
    }, 5000);
}

function handleStartServerClick(event) {
    const btn = document.getElementById('startServerBrowserBtn');
    if (btn) {
        btn.innerHTML = `<span class="inline-block animate-spin">⏳</span> <span>سرور آن ہو رہا ہے...</span>`;
        btn.classList.add('opacity-75');
    }

    // Trigger Windows custom protocol to launch Python server silently
    try {
        const ifr = document.createElement('iframe');
        ifr.style.display = 'none';
        ifr.src = 'solemate://start';
        document.body.appendChild(ifr);
        setTimeout(() => ifr.remove(), 5000);
    } catch (e) {
        try { window.location.href = 'solemate://start'; } catch (e2) {}
    }

    // Fast polling (every 800ms) until server is up and returns 200 OK
    let attempts = 0;
    const pollInterval = setInterval(async () => {
        attempts++;
        try {
            const res = await fetch('/api/settings', { cache: 'no-store' });
            if (res.ok) {
                clearInterval(pollInterval);
                updateServerStatus(true);
                await loadProducts();
                if (state.activeTab === 'inventory') renderInventoryTable();
                if (state.activeTab === 'orders') loadOrders();
                if (btn) {
                    btn.innerHTML = `<span>✓ سرور آن ہو گیا!</span>`;
                    btn.className = "px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-extrabold shadow";
                }
                return;
            }
        } catch (e) {}

        if (attempts >= 30) {
            clearInterval(pollInterval);
            if (btn) {
                btn.innerHTML = `<span>⚡ دوبارہ کلک کریں</span>`;
                btn.classList.remove('opacity-75');
            }
        }
    }, 800);
}

function retryServerConnection() {
    loadProducts();
    if (state.activeTab === 'orders') loadOrders();
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log("Service Worker info:", err);
        });
    }
}

function startClock() {
    function update() {
        const now = new Date();
        const timeEl = document.getElementById('liveTime');
        const dateEl = document.getElementById('liveDate');
        if (timeEl) timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (dateEl) dateEl.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
    update();
    setInterval(update, 1000);
}

function getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (state.authToken) {
        headers['Authorization'] = `Bearer ${state.authToken}`;
    }
    return headers;
}

// --- Initialize Session (Frictionless Counter Mode) ---
async function initializeSession() {
    if (state.authToken) {
        try {
            const res = await fetch('/api/auth/me', { headers: getAuthHeaders() });
            if (res.ok) {
                const u = await res.json();
                if (u.role === 'admin') {
                    state.currentUser = u;
                }
            } else {
                state.authToken = null;
                localStorage.removeItem('solemate_admin_token');
            }
        } catch (e) {
            // Keep existing state if offline
        }
    }
    updateRoleBadgeUI();
}

function updateRoleBadgeUI() {
    const dot = document.getElementById('userStatusDot');
    const text = document.getElementById('roleBadgeText');
    const btn = document.getElementById('roleActionBtn');
    const lockIcons = document.querySelectorAll('.admin-lock-icon');

    const isAdmin = state.currentUser.role === 'admin';

    if (isAdmin) {
        if (dot) dot.className = "w-2 h-2 rounded-full bg-amber-400";
        if (text) {
            text.textContent = "Manager (Admin)";
            text.className = "font-bold text-[11px] text-amber-300";
        }
        if (btn) {
            btn.textContent = "Exit to Counter 🚪";
            btn.className = "ml-1 text-[10px] font-bold text-slate-400 hover:text-white hover:underline";
        }
        lockIcons.forEach(i => i.style.display = 'none');
        document.querySelectorAll('.cost-price-col').forEach(el => el.style.display = '');
        document.querySelectorAll('.admin-action-col').forEach(el => el.style.display = '');
    } else {
        if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-400";
        if (text) {
            text.textContent = "Counter Mode";
            text.className = "font-bold text-[11px] text-emerald-300";
        }
        if (btn) {
            btn.textContent = "Unlock Admin 🔒";
            btn.className = "ml-1 text-[10px] font-bold text-amber-400 hover:underline";
        }
        lockIcons.forEach(i => i.style.display = '');
        document.querySelectorAll('.cost-price-col').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.admin-action-col').forEach(el => el.style.display = 'none');
    }
}

function toggleAdminMode() {
    if (state.currentUser.role === 'admin') {
        // Exit admin back to cashier mode
        state.currentUser = { role: 'cashier', full_name: 'Counter Staff', username: 'cashier' };
        state.authToken = null;
        localStorage.removeItem('solemate_admin_token');
        updateRoleBadgeUI();
        if (state.activeTab === 'analytics' || state.activeTab === 'settings') {
            switchTab('pos');
        }
        renderInventoryTable();
    } else {
        openAdminPinModal(() => {
            updateRoleBadgeUI();
            renderInventoryTable();
        });
    }
}

function attemptAdminTab(tabName) {
    if (state.currentUser.role === 'admin') {
        switchTab(tabName);
    } else {
        openAdminPinModal(() => {
            updateRoleBadgeUI();
            switchTab(tabName);
        }, `Enter Admin PIN to open ${tabName.toUpperCase()}`);
    }
}

function requireAdminAction(callback, promptText = "Admin authorization required for this action") {
    if (state.currentUser.role === 'admin') {
        callback();
    } else {
        openAdminPinModal(() => {
            updateRoleBadgeUI();
            callback();
        }, promptText);
    }
}

// --- Admin PIN Pad Modal ---
function openAdminPinModal(onSuccess, promptText = "Enter Admin PIN to access manager mode") {
    state.adminSuccessCallback = onSuccess;
    state.enteredAdminPin = '';
    updateAdminPinDots();
    document.getElementById('adminPinPromptText').textContent = promptText;
    document.getElementById('adminPinErrorMsg').textContent = '';
    document.getElementById('adminPinModal').classList.remove('hidden');
    lucide.createIcons();
}

function closeAdminPinModal() {
    document.getElementById('adminPinModal').classList.add('hidden');
    state.enteredAdminPin = '';
    state.adminSuccessCallback = null;
}

function pressAdminPin(digit) {
    if (state.enteredAdminPin.length >= 4) return;
    state.enteredAdminPin += digit;
    updateAdminPinDots();
    document.getElementById('adminPinErrorMsg').textContent = '';

    if (state.enteredAdminPin.length === 4) {
        setTimeout(verifyAdminPinInput, 150);
    }
}

function deleteAdminPinDigit() {
    state.enteredAdminPin = state.enteredAdminPin.slice(0, -1);
    updateAdminPinDots();
    document.getElementById('adminPinErrorMsg').textContent = '';
}

function clearAdminPin() {
    state.enteredAdminPin = '';
    updateAdminPinDots();
    document.getElementById('adminPinErrorMsg').textContent = '';
}

function updateAdminPinDots() {
    const dots = document.querySelectorAll('#adminPinModal .pin-dot');
    dots.forEach((dot, idx) => {
        if (idx < state.enteredAdminPin.length) {
            dot.className = "pin-dot w-3 h-3 rounded-full border-2 border-amber-500 bg-amber-500 shadow-xs shadow-amber-500/50 scale-110 transition";
        } else {
            dot.className = "pin-dot w-3 h-3 rounded-full border-2 border-slate-600 bg-slate-800 transition";
        }
    });
}

async function verifyAdminPinInput() {
    try {
        const res = await fetch('/api/auth/admin-pin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: state.enteredAdminPin })
        });

        if (!res.ok) {
            throw new Error("Incorrect Admin PIN");
        }

        const data = await res.json();
        state.authToken = data.token;
        state.currentUser = data.user;
        localStorage.setItem('solemate_admin_token', data.token);

        const cb = state.adminSuccessCallback;
        closeAdminPinModal();

        if (cb) cb();
    } catch (err) {
        document.getElementById('adminPinErrorMsg').textContent = "Incorrect PIN! (Default: 1234)";
        clearAdminPin();
    }
}

// --- Tab Switching ---
function switchTab(tab) {
    state.activeTab = tab;
    const views = ['pos', 'inventory', 'orders', 'analytics', 'settings'];
    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        const btn = document.getElementById(`tab-${v}`);
        if (el) el.classList.toggle('hidden', v !== tab);
        if (btn) {
            if (v === tab) {
                btn.className = "tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-blue-600 text-white shadow shrink-0";
            } else {
                btn.className = "tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-700/50 shrink-0";
            }
        }
    });

    if (tab === 'pos') {
        if (!state.products || state.products.length === 0) {
            loadProducts();
        }
    }
    if (tab === 'inventory') {
        if (!state.products || state.products.length === 0) {
            loadProducts().then(() => renderInventoryTable());
        } else {
            renderInventoryTable();
        }
    }
    if (tab === 'orders') loadOrders();
    if (tab === 'analytics') loadStats();
    if (tab === 'settings') populateSettingsForm();
    lucide.createIcons();
}

// --- Android Modal & LAN ---
async function openAndroidModal() {
    try {
        const res = await fetch('/api/network-ip');
        if (res.ok) {
            const data = await res.json();
            const linkEl = document.getElementById('androidIpLink');
            const copyEl = document.getElementById('androidCopyUrl');
            if (linkEl) {
                linkEl.textContent = data.android_url;
                linkEl.href = data.android_url;
            }
            if (copyEl) {
                copyEl.textContent = data.android_url;
            }
        }
    } catch (e) {
        console.error(e);
    }
    document.getElementById('androidModal').classList.remove('hidden');
    lucide.createIcons();
}

function closeAndroidModal() {
    document.getElementById('androidModal').classList.add('hidden');
}

// --- Settings ---
async function loadSettings() {
    try {
        const cachedSettings = localStorage.getItem('solemate_cached_settings');
        if (cachedSettings) {
            try {
                state.settings = Object.assign(state.settings, JSON.parse(cachedSettings));
                applySettingsToUI();
            } catch (e) {}
        }

        const res = await fetch('/api/settings');
        if (res.ok) {
            state.settings = await res.json();
            try {
                localStorage.setItem('solemate_cached_settings', JSON.stringify(state.settings));
            } catch (e) {}
            applySettingsToUI();
        }
    } catch (err) {
        console.error("Error loading settings:", err);
    }
}

function applySettingsToUI() {
    const headerName = document.getElementById('headerStoreName');
    if (headerName && state.settings.store_name) {
        headerName.textContent = state.settings.store_name;
    }
    const cashCurrencyPrefix = document.getElementById('cashCurrencyPrefix');
    if (cashCurrencyPrefix) cashCurrencyPrefix.textContent = state.settings.currency_symbol || 'PKR';
    const taxDisplay = document.getElementById('cartTaxRateDisplay');
    if (taxDisplay) taxDisplay.textContent = '0%';
}

function populateSettingsForm() {
    document.getElementById('settingStoreName').value = state.settings.store_name || '';
    document.getElementById('settingStorePhone').value = state.settings.store_phone || '';
    document.getElementById('settingCurrency').value = state.settings.currency_symbol || 'PKR';
    document.getElementById('settingTaxRate').value = '0.0';
    document.getElementById('settingStoreAddress').value = state.settings.store_address || '';
    document.getElementById('settingReceiptFooter').value = state.settings.receipt_footer || '';
}

async function saveStoreSettings() {
    const payload = {
        store_name: document.getElementById('settingStoreName').value,
        store_phone: document.getElementById('settingStorePhone').value,
        currency_symbol: document.getElementById('settingCurrency').value || 'PKR',
        tax_rate: '0.0',
        store_address: document.getElementById('settingStoreAddress').value,
        receipt_footer: document.getElementById('settingReceiptFooter').value
    };

    try {
        const res = await fetch('/api/settings', {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            await loadSettings();
            alert("Settings saved successfully!");
            calculateCartTotals();
        } else {
            const err = await res.json();
            alert("Failed: " + (err.detail || "Permission denied"));
        }
    } catch (err) {
        alert("Failed to save settings: " + err.message);
    }
}

// --- Product Catalog & POS View ---
async function loadProducts(query = '', category = state.selectedCategory, lowStock = false) {
    try {
        let url = `/api/products?`;
        if (query) url += `q=${encodeURIComponent(query)}&`;
        if (category && category !== 'All') url += `category=${encodeURIComponent(category)}&`;
        if (lowStock) url += `low_stock_only=true&`;

        const res = await fetch(url, { headers: getAuthHeaders() });
        if (res.ok) {
            state.products = await res.json();
            updateServerStatus(true);
            if (!query && (!category || category === 'All') && !lowStock) {
                try {
                    localStorage.setItem('solemate_cached_products', JSON.stringify(state.products));
                } catch (e) {}
            }
            renderProductGrid();
            checkLowStockBadge();
        } else {
            updateServerStatus(false);
            if (!state.products || state.products.length === 0) {
                tryLoadCachedProducts();
            }
        }
    } catch (err) {
        console.error("Error loading products:", err);
        updateServerStatus(false);
        if (!state.products || state.products.length === 0) {
            tryLoadCachedProducts();
        }
    }
}

function filterCategory(cat) {
    state.selectedCategory = cat;
    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(p => {
        if (p.textContent.trim().toLowerCase() === cat.toLowerCase() || (cat === 'All' && p.textContent.includes('All'))) {
            p.className = "cat-pill active px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-xs transition";
        } else {
            p.className = "cat-pill px-3 py-1 rounded-full text-xs font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition";
        }
    });
    const searchVal = document.getElementById('posSearchInput')?.value || '';
    loadProducts(searchVal, cat);
}

function renderProductGrid() {
    const grid = document.getElementById('productGrid');
    const noFound = document.getElementById('noProductsFound');
    if (!grid) return;

    if (!state.products || state.products.length === 0) {
        grid.innerHTML = '';
        noFound.classList.remove('hidden');
        noFound.classList.add('flex');
        return;
    }

    noFound.classList.add('hidden');
    noFound.classList.remove('flex');

    const curr = state.settings.currency_symbol || '$';

    grid.innerHTML = state.products.map(p => {
        const colors = [...new Set(p.variants.map(v => v.color))];
        const defaultColor = colors[0] || '';
        const variantsForColor = p.variants.filter(v => v.color === defaultColor);
        const defaultVariant = variantsForColor.find(v => v.stock_quantity > 0) || variantsForColor[0] || p.variants[0];
        const totalStock = p.variants.reduce((sum, v) => sum + v.stock_quantity, 0);

        return `
            <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col product-card" 
                 data-product-id="${p.id}" data-selected-color="${defaultColor}">
                <div class="relative h-32 sm:h-36 bg-slate-100 overflow-hidden group">
                    <img src="${p.image_url || OFFLINE_SHOE_SVG}" 
                         alt="${p.name}" 
                         class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                         onerror="this.src='${OFFLINE_SHOE_SVG}'">
                    
                    <span class="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900/80 text-white">
                        ${p.category}
                    </span>

                    <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold ${totalStock <= 3 ? 'bg-rose-500 text-white' : 'bg-emerald-500/90 text-white'} shadow-xs">
                        ${totalStock} pairs left
                    </span>
                </div>

                <div class="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                    <div>
                        <span class="text-[9px] font-bold uppercase tracking-wider text-blue-600 block">${p.brand}</span>
                        <h3 class="font-bold text-slate-800 text-xs leading-snug truncate" title="${p.name}">${p.name}</h3>
                        <div class="flex items-center justify-between mt-0.5">
                            <span class="text-xs sm:text-sm font-black text-slate-900">${curr}${p.base_price.toFixed(2)}</span>
                            <span class="text-[9px] text-slate-400 font-medium">${p.gender}</span>
                        </div>
                    </div>

                    <div class="mt-2">
                        <span class="text-[9px] text-slate-400 block mb-0.5">Color:</span>
                        <div class="flex flex-wrap gap-1 color-selector-container">
                            ${colors.map(c => `
                                <button type="button" 
                                        onclick="selectShoeCardColor(${p.id}, '${c}')"
                                        class="color-pill px-1.5 py-0.5 text-[9px] rounded font-semibold border transition ${c === defaultColor ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}">
                                    ${c}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="mt-2">
                        <span class="text-[9px] text-slate-400 block mb-0.5">Select Size:</span>
                        <div class="flex flex-wrap gap-1 size-selector-container" id="sizes-container-${p.id}">
                            ${renderSizesForProductAndColor(p, defaultColor, defaultVariant ? defaultVariant.id : null)}
                        </div>
                    </div>

                    <div class="mt-2.5 pt-2 border-t border-slate-100">
                        <button type="button" 
                                id="addCartBtn-${p.id}"
                                onclick="addSelectedVariantToCart(${p.id})"
                                ${!defaultVariant || defaultVariant.stock_quantity === 0 ? 'disabled' : ''}
                                class="w-full py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${!defaultVariant || defaultVariant.stock_quantity === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20'}">
                            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

function renderSizesForProductAndColor(product, color, selectedVariantId) {
    const variants = product.variants.filter(v => v.color === color);
    if (variants.length === 0) return `<span class="text-[9px] text-slate-400">No sizes for this color</span>`;

    return variants.map(v => {
        const isOutOfStock = v.stock_quantity <= 0;
        const isSelected = v.id === selectedVariantId;

        let cls = "size-pill px-1.5 py-0.5 rounded text-[9px] font-bold border transition ";
        if (isOutOfStock) {
            cls += "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed line-through";
        } else if (isSelected) {
            cls += "bg-blue-600 text-white border-blue-600 shadow-2xs";
        } else {
            cls += "bg-white text-slate-700 border-slate-300 hover:border-blue-500 hover:text-blue-600";
        }

        return `
            <button type="button"
                    ${isOutOfStock ? 'disabled' : ''}
                    onclick="selectShoeCardSize(${product.id}, ${v.id})"
                    id="var-btn-${v.id}"
                    data-variant-id="${v.id}"
                    data-stock="${v.stock_quantity}"
                    title="${isOutOfStock ? 'Out of stock' : v.stock_quantity + ' pairs in stock'} - SKU: ${v.sku}"
                    class="${cls}">
                ${v.size}
            </button>
        `;
    }).join('');
}

function selectShoeCardColor(productId, color) {
    const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    if (!card) return;
    card.setAttribute('data-selected-color', color);

    const colorBtns = card.querySelectorAll('.color-pill');
    colorBtns.forEach(btn => {
        if (btn.textContent.trim() === color) {
            btn.className = "color-pill px-1.5 py-0.5 text-[9px] rounded font-semibold border transition bg-slate-900 text-white border-slate-900";
        } else {
            btn.className = "color-pill px-1.5 py-0.5 text-[9px] rounded font-semibold border transition bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200";
        }
    });

    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const variants = product.variants.filter(v => v.color === color);
    const firstInStock = variants.find(v => v.stock_quantity > 0) || variants[0];
    const selectedVariantId = firstInStock ? firstInStock.id : null;

    const sizesContainer = document.getElementById(`sizes-container-${productId}`);
    if (sizesContainer) {
        sizesContainer.innerHTML = renderSizesForProductAndColor(product, color, selectedVariantId);
    }

    const addBtn = document.getElementById(`addCartBtn-${productId}`);
    if (addBtn) {
        if (!firstInStock || firstInStock.stock_quantity === 0) {
            addBtn.disabled = true;
            addBtn.className = "w-full py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition bg-slate-200 text-slate-400 cursor-not-allowed";
        } else {
            addBtn.disabled = false;
            addBtn.className = "w-full py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20";
        }
    }
}

function selectShoeCardSize(productId, variantId) {
    const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    if (!card) return;

    const sizeBtns = card.querySelectorAll('.size-pill');
    sizeBtns.forEach(btn => {
        const vId = parseInt(btn.getAttribute('data-variant-id'));
        const stock = parseInt(btn.getAttribute('data-stock'));
        if (stock <= 0) return;

        if (vId === variantId) {
            btn.className = "size-pill px-1.5 py-0.5 rounded text-[9px] font-bold border transition bg-blue-600 text-white border-blue-600 shadow-2xs";
        } else {
            btn.className = "size-pill px-1.5 py-0.5 rounded text-[9px] font-bold border transition bg-white text-slate-700 border-slate-300 hover:border-blue-500 hover:text-blue-600";
        }
    });

    const addBtn = document.getElementById(`addCartBtn-${productId}`);
    if (addBtn) {
        addBtn.disabled = false;
        addBtn.className = "w-full py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20";
    }
}

function addSelectedVariantToCart(productId) {
    const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    if (!card) return;

    const activeSizeBtn = card.querySelector('.size-pill.bg-blue-600');
    if (!activeSizeBtn) {
        alert("Please select an available shoe size.");
        return;
    }

    const variantId = parseInt(activeSizeBtn.getAttribute('data-variant-id'));
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const variant = product.variants.find(v => v.id === variantId);
    if (!variant) return;

    addToCart(variant, product);
}

// --- Cart Operations ---
function addToCart(variant, product) {
    if (variant.stock_quantity <= 0) {
        alert(`Sorry, ${product.name} (Size: ${variant.size}) is out of stock.`);
        return;
    }

    const existingIndex = state.cart.findIndex(i => i.variant_id === variant.id);

    if (existingIndex > -1) {
        const currentQty = state.cart[existingIndex].quantity;
        if (currentQty + 1 > variant.stock_quantity) {
            alert(`Cannot add more. Only ${variant.stock_quantity} pairs in stock.`);
            return;
        }
        state.cart[existingIndex].quantity += 1;
    } else {
        state.cart.push({
            variant_id: variant.id,
            product_id: product.id,
            product_name: product.name,
            brand: product.brand,
            size: variant.size,
            color: variant.color,
            sku: variant.sku,
            barcode: variant.barcode,
            unit_price: variant.price || product.base_price,
            max_stock: variant.stock_quantity,
            quantity: 1,
            image_url: product.image_url
        });
    }

    renderCart();
}

function updateCartItemQty(variantId, delta) {
    const item = state.cart.find(i => i.variant_id === variantId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
        removeCartItem(variantId);
        return;
    }

    if (newQty > item.max_stock) {
        alert(`Only ${item.max_stock} pairs available in stock for size ${item.size}.`);
        return;
    }

    item.quantity = newQty;
    renderCart();
}

function removeCartItem(variantId) {
    state.cart = state.cart.filter(i => i.variant_id !== variantId);
    renderCart();
}

function clearCart() {
    if (state.cart.length === 0) return;
    if (confirm("Clear all items in cart?")) {
        state.cart = [];
        renderCart();
    }
}

function renderCart() {
    const list = document.getElementById('cartItemsList');
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!list) return;

    if (state.cart.length === 0) {
        list.innerHTML = `
            <div id="emptyCartNotice" class="h-full flex flex-col items-center justify-center text-slate-400 py-8">
                <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-2">
                    <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                </div>
                <p class="text-xs font-semibold text-slate-500">Cart is empty</p>
                <p class="text-[10px] text-slate-400 text-center max-w-[180px]">Select a shoe model & size or scan barcode</p>
            </div>
        `;
        if (checkoutBtn) checkoutBtn.disabled = true;
        calculateCartTotals();
        lucide.createIcons();
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;
    const curr = state.settings.currency_symbol || 'PKR';

    list.innerHTML = state.cart.map(item => `
        <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 animate-fade-in hover:bg-slate-100/60 transition" id="cartRow-${item.variant_id}">
            <img src="${item.image_url || OFFLINE_SHOE_SVG}" 
                 onerror="this.src='${OFFLINE_SHOE_SVG}'"
                 class="w-11 h-11 object-cover rounded-lg border border-slate-200 shrink-0">
            
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                    <div class="truncate pr-1">
                        <span class="text-[8px] font-bold text-blue-600 uppercase tracking-wider">${item.brand}</span>
                        <h4 class="font-bold text-slate-800 text-[11px] truncate leading-tight">${item.product_name}</h4>
                        <div class="flex items-center gap-1 mt-0.5">
                            <span class="text-[9px] bg-slate-200 px-1 rounded font-semibold text-slate-700">${item.size}</span>
                            <span class="text-[9px] text-slate-500 font-medium">${item.color}</span>
                        </div>
                    </div>
                    <button onclick="removeCartItem(${item.variant_id})" class="text-slate-400 hover:text-rose-600 p-0.5" title="Remove item">
                        <i data-lucide="x" class="w-3.5 h-3.5"></i>
                    </button>
                </div>

                <div class="flex items-center justify-between gap-1.5 mt-2 pt-1.5 border-t border-slate-200/80">
                    <!-- Qty Selector -->
                    <div class="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button onclick="updateCartItemQty(${item.variant_id}, -1)" class="px-1.5 py-0.5 hover:bg-slate-100 text-slate-600 font-bold text-xs transition">-</button>
                        <span class="px-1.5 py-0.5 text-[11px] font-bold text-slate-800 min-w-4 text-center">${item.quantity}</span>
                        <button onclick="updateCartItemQty(${item.variant_id}, 1)" class="px-1.5 py-0.5 hover:bg-slate-100 text-slate-600 font-bold text-xs transition">+</button>
                    </div>

                    <!-- Manual Sale Price Input -->
                    <div class="flex items-center gap-1 bg-white px-1.5 py-0.5 border border-slate-300 rounded-lg shadow-2xs hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-400 transition" title="Manual Sale Price (Rate)">
                        <span class="text-[9px] text-slate-400 font-semibold">Rate:</span>
                        <span class="text-[9px] text-slate-500 font-bold">${curr}</span>
                        <input type="number" step="any" min="0" value="${item.unit_price}" 
                               id="cartItemPriceInput-${item.variant_id}"
                               oninput="updateCartItemPrice(${item.variant_id}, this.value)"
                               class="w-16 text-[11px] font-black text-slate-800 bg-transparent focus:outline-none text-right">
                    </div>

                    <!-- Line Total -->
                    <div class="text-right min-w-[50px]">
                        <span class="text-[11px] font-black text-slate-900" id="cartLineTotal-${item.variant_id}">${curr}${(item.unit_price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    calculateCartTotals();
    lucide.createIcons();
}

function updateCartItemPrice(variantId, newPrice) {
    const item = state.cart.find(i => i.variant_id === variantId);
    if (!item) return;
    const val = parseFloat(newPrice);
    item.unit_price = isNaN(val) ? 0 : Math.max(0, val);

    const curr = state.settings.currency_symbol || 'PKR';
    const lineTotalEl = document.getElementById(`cartLineTotal-${variantId}`);
    if (lineTotalEl) {
        lineTotalEl.textContent = `${curr}${(item.unit_price * item.quantity).toFixed(2)}`;
    }
    calculateCartTotals();
}

function calculateCartTotals() {
    const totalPairs = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

    const discountType = document.getElementById('cartDiscountType')?.value || 'none';
    const discountVal = parseFloat(document.getElementById('cartDiscountVal')?.value || 0);

    let discountAmount = 0.0;
    if (discountType === 'percent' && discountVal > 0) {
        discountAmount = Math.round(subtotal * (discountVal / 100.0) * 100) / 100;
    } else if (discountType === 'fixed' && discountVal > 0) {
        discountAmount = Math.min(subtotal, discountVal);
    }

    const afterDiscount = Math.max(0, subtotal - discountAmount);

    // Tax permanently 0% (Tax completely eliminated)
    const taxRate = 0.0;
    const taxAmount = 0.0;
    const grandTotal = Math.round(afterDiscount * 100) / 100;

    const curr = state.settings.currency_symbol || 'PKR';

    document.getElementById('cartTotalItemsCount').textContent = totalPairs;
    document.getElementById('cartSubtotal').textContent = `${curr}${subtotal.toFixed(2)}`;
    document.getElementById('cartDiscountAmount').textContent = `-${curr}${discountAmount.toFixed(2)}`;
    
    const taxEl = document.getElementById('cartTaxAmount');
    if (taxEl) taxEl.textContent = `${curr}0.00`;
    const taxRow = document.getElementById('cartTaxRow');
    if (taxRow) taxRow.classList.add('hidden');

    document.getElementById('cartGrandTotal').textContent = `${curr}${grandTotal.toFixed(2)}`;
    document.getElementById('cartPairSummary').textContent = `${totalPairs} Pair${totalPairs === 1 ? '' : 's'}`;

    return { totalPairs, subtotal, discountType, discountVal, discountAmount, taxRate, taxAmount, grandTotal };
}

// --- Barcode Scanner & Search Handler ---
function setupEventListeners() {
    const posSearch = document.getElementById('posSearchInput');
    if (posSearch) {
        posSearch.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            loadProducts(query, state.selectedCategory);
        });

        posSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const code = posSearch.value.trim().toLowerCase();
                if (!code) return;

                let matchedVariant = null;
                let matchedProduct = null;

                for (const p of state.products) {
                    for (const v of p.variants) {
                        if (v.barcode.toLowerCase() === code || v.sku.toLowerCase() === code) {
                            matchedVariant = v;
                            matchedProduct = p;
                            break;
                        }
                    }
                    if (matchedVariant) break;
                }

                if (matchedVariant && matchedProduct) {
                    addToCart(matchedVariant, matchedProduct);
                    posSearch.value = '';
                    loadProducts('', state.selectedCategory);
                } else {
                    alert(`No shoe variant matching barcode / SKU: "${code}"`);
                }
            }
        });
    }
}

// --- Checkout Modal & Flow ---
function openCheckoutModal() {
    if (state.cart.length === 0) return;
    const totals = calculateCartTotals();
    const curr = state.settings.currency_symbol || '$';

    document.getElementById('checkoutDueAmount').textContent = `${curr}${totals.grandTotal.toFixed(2)}`;
    document.getElementById('checkoutModal').classList.remove('hidden');

    switchPaymentMode('instant');
    selectPaymentMethod('Cash');
    setupQuickCashButtons(totals.grandTotal);

    // Set currency prefixes
    const cashPrefix = document.getElementById('cashCurrencyPrefix');
    if (cashPrefix) cashPrefix.textContent = curr;
    const udhaarPrefix = document.getElementById('udhaarCurrencyPrefix');
    if (udhaarPrefix) udhaarPrefix.textContent = curr;

    // Pre-populate or clear Udhaar fields
    const custSearch = document.getElementById('customerSearchInput')?.value.trim();
    const udhaarName = document.getElementById('udhaarCustNameInput');
    if (udhaarName) udhaarName.value = (custSearch && custSearch !== 'Walk-in Customer') ? custSearch : '';
    const udhaarPhone = document.getElementById('udhaarCustPhoneInput');
    if (udhaarPhone) udhaarPhone.value = '';
    const udhaarAdv = document.getElementById('udhaarAdvancePaidInput');
    if (udhaarAdv) udhaarAdv.value = '';
    calculateUdhaarRemaining();

    calculateChange();
    lucide.createIcons();
}

function switchPaymentMode(mode) {
    state.paymentMode = mode;
    const btnInstant = document.getElementById('payModeBtn-instant');
    const btnUdhaar = document.getElementById('payModeBtn-udhaar');
    const instantSec = document.getElementById('instantPaySection');
    const udhaarSec = document.getElementById('udhaarSection');
    const confirmBtn = document.getElementById('confirmPayBtn');

    if (mode === 'instant') {
        if (btnInstant) btnInstant.className = "py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-blue-600 text-white shadow-xs transition";
        if (btnUdhaar) btnUdhaar.className = "py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 transition";
        if (instantSec) instantSec.classList.remove('hidden');
        if (udhaarSec) udhaarSec.classList.add('hidden');
        if (confirmBtn) {
            confirmBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> <span>Confirm Sale & Print Receipt</span>`;
        }
        calculateChange();
    } else {
        if (btnInstant) btnInstant.className = "py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 transition";
        if (btnUdhaar) btnUdhaar.className = "py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-amber-600 text-white shadow-xs transition";
        if (instantSec) instantSec.classList.add('hidden');
        if (udhaarSec) udhaarSec.classList.remove('hidden');
        if (confirmBtn) {
            confirmBtn.innerHTML = `<i data-lucide="book-marked" class="w-4 h-4"></i> <span>Record Udhaar (کھاتہ درج کریں)</span>`;
            confirmBtn.disabled = false;
            confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        calculateUdhaarRemaining();
        setTimeout(() => {
            const inp = document.getElementById('udhaarCustNameInput');
            if (inp) inp.focus();
        }, 100);
    }
    lucide.createIcons();
}

function calculateUdhaarRemaining() {
    const totals = calculateCartTotals();
    const curr = state.settings.currency_symbol || '$';
    const input = document.getElementById('udhaarAdvancePaidInput');
    if (input) {
        // Sanitize: allow numbers and dot only
        let cleaned = input.value.replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            cleaned = parts[0] + '.' + parts.slice(1).join('');
        }
        if (input.value !== cleaned) {
            input.value = cleaned;
        }
    }
    const advance = parseFloat(input?.value || 0) || 0;
    const remaining = Math.max(0, totals.grandTotal - advance);
    const display = document.getElementById('udhaarRemainingDisplay');
    if (display) {
        display.textContent = `${curr}${remaining.toFixed(2)}`;
    }
}

function setUdhaarAdvance(amount) {
    const input = document.getElementById('udhaarAdvancePaidInput');
    if (input) {
        input.value = amount > 0 ? amount.toString() : '';
        calculateUdhaarRemaining();
    }
}


function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.add('hidden');
}

function selectPaymentMethod(method) {
    state.paymentMethod = method;
    const methods = ['Cash', 'Card', 'Digital Wallet'];
    methods.forEach(m => {
        const btn = document.getElementById(`payBtn-${m}`);
        if (!btn) return;
        if (m === method) {
            btn.className = "pay-method-btn active py-2 px-2.5 rounded-xl border border-blue-600 bg-blue-50 text-blue-700 text-xs font-bold flex flex-col items-center gap-1 transition";
        } else {
            btn.className = "pay-method-btn py-2 px-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold flex flex-col items-center gap-1 transition";
        }
    });

    const cashBox = document.getElementById('cashDetailsBox');
    if (cashBox) {
        cashBox.classList.toggle('hidden', method !== 'Cash');
    }

    if (method === 'Cash') {
        calculateChange();
    }
}

function setupQuickCashButtons(total) {
    const container = document.getElementById('quickCashButtons');
    if (!container) return;

    const curr = state.settings.currency_symbol || '$';
    const cashInput = document.getElementById('cashTenderedInput');
    cashInput.value = total.toFixed(2);

    const round20 = Math.ceil(total / 20) * 20;
    const round50 = Math.ceil(total / 50) * 50;
    const round100 = Math.ceil(total / 100) * 100;

    const quickValues = [...new Set([total, round20, round50, round100])].filter(v => v >= total).slice(0, 4);

    container.innerHTML = quickValues.map(v => `
        <button type="button" onclick="setCashTendered(${v})" class="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-bold text-slate-700">
            ${curr}${v.toFixed(0)}
        </button>
    `).join('');
}

function setCashTendered(val) {
    const input = document.getElementById('cashTenderedInput');
    if (input) {
        input.value = val.toFixed(2);
        calculateChange();
    }
}

function calculateChange() {
    const totals = calculateCartTotals();
    const curr = state.settings.currency_symbol || '$';
    const cashInput = document.getElementById('cashTenderedInput');
    if (cashInput) {
        let cleaned = cashInput.value.replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            cleaned = parts[0] + '.' + parts.slice(1).join('');
        }
        if (cashInput.value !== cleaned) {
            cashInput.value = cleaned;
        }
    }
    const tendered = parseFloat(cashInput?.value || 0) || 0;
    const change = tendered - totals.grandTotal;

    const display = document.getElementById('cashChangeDisplay');
    const confirmBtn = document.getElementById('confirmPayBtn');

    if (state.paymentMethod === 'Cash') {
        if (change < 0) {
            display.textContent = `Needs ${curr}${Math.abs(change).toFixed(2)} more`;
            display.className = "text-xs font-bold text-rose-500 font-mono";
            confirmBtn.disabled = true;
            confirmBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            display.textContent = `${curr}${change.toFixed(2)}`;
            display.className = "text-base font-black text-emerald-600 font-mono";
            confirmBtn.disabled = false;
            confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    } else {
        confirmBtn.disabled = false;
        confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

async function submitOrderCheckout() {
    const totals = calculateCartTotals();
    const isUdhaar = state.paymentMode === 'udhaar';
    const notes = document.getElementById('checkoutOrderNotes')?.value.trim() || '';

    let customerName = 'Walk-in Customer';
    let customerPhone = '';
    let paymentMethod = state.paymentMethod;
    let tendered = 0.0;
    let udhaarAmount = 0.0;

    if (isUdhaar) {
        const udhaarNameInput = document.getElementById('udhaarCustNameInput')?.value.trim();
        if (!udhaarNameInput) {
            alert("⚠️ Customer Name Zaroori Hai!\nUdhaar par maal dene ke liye customer ka naam likhein taka yaad rahe.");
            document.getElementById('udhaarCustNameInput')?.focus();
            return;
        }
        customerName = udhaarNameInput;
        customerPhone = document.getElementById('udhaarCustPhoneInput')?.value.trim() || '';
        const advance = parseFloat(document.getElementById('udhaarAdvancePaidInput')?.value || 0);
        tendered = advance;
        udhaarAmount = Math.max(0, totals.grandTotal - advance);
        paymentMethod = 'Udhaar';
    } else {
        const custInput = document.getElementById('customerSearchInput')?.value.trim();
        if (custInput) customerName = custInput;
        tendered = state.paymentMethod === 'Cash' ? parseFloat(document.getElementById('cashTenderedInput')?.value || totals.grandTotal) : totals.grandTotal;
    }

    const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        cashier_name: state.currentUser.full_name || 'Counter Staff',
        items: state.cart.map(i => ({
            variant_id: i.variant_id,
            quantity: i.quantity,
            unit_price: i.unit_price
        })),
        discount_type: totals.discountType,
        discount_val: totals.discountVal,
        tax_percent: totals.taxRate,
        payment_method: paymentMethod,
        amount_tendered: tendered,
        notes: notes,
        is_udhaar: isUdhaar,
        udhaar_amount: udhaarAmount
    };

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const orderData = await res.json();
            closeCheckoutModal();
            state.cart = [];
            renderCart();
            await loadProducts();
            showReceiptModal(orderData);
            return;
        }
        const err = await res.json().catch(() => ({}));
        if (err.detail && res.status === 400) {
            alert("Error: " + err.detail);
            return;
        }
        throw new Error("Server offline");
    } catch (err) {
        // AUTONOMOUS OFFLINE MODE: Complete checkout locally on device!
        const localOrder = processLocalOfflineCheckout(payload, totals, tendered, isUdhaar, udhaarAmount);
        closeCheckoutModal();
        state.cart = [];
        renderCart();
        renderProductGrid();
        checkLowStockBadge();
        showReceiptModal(localOrder);
    }
}

function processLocalOfflineCheckout(payload, totals, tendered, isUdhaar = false, udhaarAmount = 0.0) {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNo = `INV-${dateStr}-${randSuffix}`;

    const orderItems = [];
    payload.items.forEach(item => {
        state.products.forEach(p => {
            p.variants.forEach(v => {
                if (v.id === item.variant_id) {
                    v.stock_quantity = Math.max(0, v.stock_quantity - item.quantity);
                    orderItems.push({
                        product_name: p.name,
                        brand: p.brand,
                        size: v.size,
                        color: v.color,
                        sku: v.sku,
                        unit_price: item.unit_price,
                        quantity: item.quantity,
                        line_total: item.unit_price * item.quantity
                    });
                }
            });
        });
    });

    localStorage.setItem('solemate_cached_products', JSON.stringify(state.products));

    const status = isUdhaar && udhaarAmount > 0 ? 'pending_udhaar' : 'completed';
    const change = isUdhaar ? 0.0 : Math.max(0, tendered - totals.grandTotal);

    const orderData = {
        id: Date.now(),
        invoice_no: invoiceNo,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone || '',
        cashier_name: payload.cashier_name,
        subtotal: totals.subtotal,
        discount_type: totals.discountType,
        discount_val: totals.discountVal,
        discount_amount: totals.discountAmount,
        tax_percent: totals.taxRate,
        tax_amount: totals.taxAmount,
        total_amount: totals.grandTotal,
        payment_method: payload.payment_method,
        amount_tendered: tendered,
        change_amount: change,
        notes: payload.notes,
        status: status,
        udhaar_amount: udhaarAmount,
        udhaar_paid: 0.0,
        created_at: now.toISOString(),
        items: orderItems
    };

    let localOrders = [];
    try {
        localOrders = JSON.parse(localStorage.getItem('solemate_local_orders') || '[]');
    } catch (e) {}
    localOrders.unshift(orderData);
    localStorage.setItem('solemate_local_orders', JSON.stringify(localOrders));

    return orderData;
}

// --- Printable Thermal POS Receipt ---
function showReceiptModal(order) {
    const curr = state.settings.currency_symbol || '$';

    document.getElementById('receiptStoreName').textContent = state.settings.store_name || 'SoleMate Shoe Store';
    document.getElementById('receiptStoreAddress').textContent = state.settings.store_address || '';
    document.getElementById('receiptStorePhone').textContent = state.settings.store_phone ? `Tel: ${state.settings.store_phone}` : '';
    document.getElementById('receiptFooterNote').textContent = state.settings.receipt_footer || '';

    document.getElementById('receiptInvoiceNo').textContent = order.invoice_no;
    document.getElementById('receiptDateTime').textContent = new Date(order.created_at || Date.now()).toLocaleString();
    document.getElementById('receiptCashierName').textContent = order.cashier_name || 'Staff';
    document.getElementById('receiptCustomerName').textContent = order.customer_name || 'Walk-in';

    const itemsBody = document.getElementById('receiptItemsBody');
    itemsBody.innerHTML = (order.items || []).map(item => `
        <tr class="py-1">
            <td class="py-1">
                <div class="font-bold">${item.product_name}</div>
                <div class="text-[9px] text-slate-500">${item.brand} | Size: ${item.size} (${item.color})</div>
            </td>
            <td class="py-1 text-center font-bold">${item.quantity}</td>
            <td class="py-1 text-right">${curr}${item.unit_price.toFixed(2)}</td>
            <td class="py-1 text-right font-bold">${curr}${item.line_total.toFixed(2)}</td>
        </tr>
    `).join('');

    document.getElementById('receiptSubtotal').textContent = `${curr}${order.subtotal.toFixed(2)}`;

    const discountRow = document.getElementById('receiptDiscountRow');
    if (order.discount_amount > 0) {
        discountRow.classList.remove('hidden');
        document.getElementById('receiptDiscount').textContent = `-${curr}${order.discount_amount.toFixed(2)}`;
    } else {
        discountRow.classList.add('hidden');
    }

    const taxRow = document.getElementById('receiptTaxRow');
    if (order.tax_amount > 0) {
        taxRow.classList.remove('hidden');
        document.getElementById('receiptTax').textContent = `${curr}${order.tax_amount.toFixed(2)}`;
    } else {
        taxRow.classList.add('hidden');
    }

    document.getElementById('receiptTotal').textContent = `${curr}${order.total_amount.toFixed(2)}`;
    document.getElementById('receiptPaymentMethod').textContent = order.payment_method;

    const tenderedRow = document.getElementById('receiptTenderedRow');
    const changeRow = document.getElementById('receiptChangeRow');
    const advRow = document.getElementById('receiptAdvanceRow');
    const udhaarRow = document.getElementById('receiptUdhaarRow');
    const udhaarStatusRow = document.getElementById('receiptUdhaarStatusRow');

    const isUdhaar = order.payment_method === 'Udhaar' || order.status === 'pending_udhaar' || (order.udhaar_amount && order.udhaar_amount > 0);

    if (isUdhaar) {
        tenderedRow.classList.add('hidden');
        changeRow.classList.add('hidden');
        if (advRow) {
            advRow.classList.remove('hidden');
            document.getElementById('receiptAdvance').textContent = `${curr}${(order.amount_tendered || 0).toFixed(2)}`;
        }
        if (udhaarRow) {
            udhaarRow.classList.remove('hidden');
            const remaining = Math.max(0, (order.udhaar_amount || order.total_amount) - (order.udhaar_paid || 0));
            document.getElementById('receiptUdhaarAmount').textContent = `${curr}${remaining.toFixed(2)}`;
        }
        if (udhaarStatusRow) {
            udhaarStatusRow.classList.remove('hidden');
            const isCleared = order.status === 'completed' && (!order.udhaar_amount || (order.udhaar_paid >= order.udhaar_amount));
            const statusEl = document.getElementById('receiptUdhaarStatus');
            if (statusEl) {
                statusEl.textContent = isCleared ? "PAID / CLEARED (وصول شدہ)" : "UNPAID / KHATA (بقایا ادھار)";
                statusEl.className = isCleared ? "text-emerald-700 font-extrabold" : "text-rose-600 font-extrabold";
            }
        }
    } else {
        if (advRow) advRow.classList.add('hidden');
        if (udhaarRow) udhaarRow.classList.add('hidden');
        if (udhaarStatusRow) udhaarStatusRow.classList.add('hidden');

        if (order.payment_method === 'Cash') {
            tenderedRow.classList.remove('hidden');
            changeRow.classList.remove('hidden');
            document.getElementById('receiptTendered').textContent = `${curr}${(order.amount_tendered || 0).toFixed(2)}`;
            document.getElementById('receiptChange').textContent = `${curr}${(order.change_amount || 0).toFixed(2)}`;
        } else {
            tenderedRow.classList.add('hidden');
            changeRow.classList.add('hidden');
        }
    }

    document.getElementById('receiptBarcodeText').textContent = order.invoice_no;
    document.getElementById('receiptModal').classList.remove('hidden');
    lucide.createIcons();
}

function closeReceiptModal() {
    document.getElementById('receiptModal').classList.add('hidden');
}

// --- Shoe Inventory Management View ---
function toggleLowStockFilter(force = null) {
    if (force !== null) {
        state.lowStockFilter = force;
    } else {
        state.lowStockFilter = !state.lowStockFilter;
    }

    const btn = document.getElementById('lowStockToggleBtn');
    if (btn) {
        if (state.lowStockFilter) {
            btn.className = "px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs";
        } else {
            btn.className = "px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-amber-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition";
        }
    }
    renderInventoryTable();
}

function renderInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    const search = document.getElementById('inventorySearchInput')?.value.trim().toLowerCase() || '';
    const curr = state.settings.currency_symbol || '$';
    const isAdmin = state.currentUser && state.currentUser.role === 'admin';

    let filtered = state.products;

    if (search) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search) ||
            p.brand.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search) ||
            p.variants.some(v => v.sku.toLowerCase().includes(search) || v.barcode.includes(search) || v.size.toLowerCase().includes(search))
        );
    }

    if (state.lowStockFilter) {
        filtered = filtered.filter(p => p.variants.some(v => v.stock_quantity <= 3));
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="py-8 text-center text-slate-400">
                    <p class="font-medium text-xs">No shoes matching inventory search</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(p => {
        const totalStock = p.variants.reduce((sum, v) => sum + v.stock_quantity, 0);

        return `
            <tr class="hover:bg-slate-50/80 transition">
                <td class="py-2.5 px-3">
                    <div class="flex items-center gap-2.5">
                        <img src="${p.image_url || OFFLINE_SHOE_SVG}" 
                             onerror="this.src='${OFFLINE_SHOE_SVG}'"
                             class="w-9 h-9 object-cover rounded-lg border border-slate-200 shrink-0">
                        <div>
                            <span class="font-bold text-slate-900 block leading-tight text-xs">${p.name}</span>
                            <span class="text-[9px] text-slate-400">${p.gender} • ${p.variants.length} variant sizes</span>
                        </div>
                    </div>
                </td>

                <td class="py-2.5 px-3">
                    <span class="font-bold text-slate-700 block">${p.brand}</span>
                    <span class="text-[9px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded">${p.category}</span>
                </td>

                <td class="py-2.5 px-3">
                    <div class="flex flex-wrap gap-1 max-w-sm">
                        ${p.variants.map(v => `
                            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono border ${v.stock_quantity <= 3 ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold' : 'bg-slate-100 text-slate-700 border-slate-200'}">
                                <span>${v.size}</span>
                                <span class="text-slate-400">|</span>
                                <span class="font-sans">${v.color}</span>
                                <span class="text-slate-400">|</span>
                                <span onclick="promptSetStock(${v.id}, '${p.name.replace(/'/g, "\\'")}', '${v.size}', ${v.stock_quantity})" title="کلک کر کے جوڑوں کی تعداد تبدیل کریں (Click to edit stock)" class="cursor-pointer underline decoration-dotted hover:text-blue-600 ${v.stock_quantity <= 3 ? 'text-rose-600' : 'text-slate-900 font-bold'}">${v.stock_quantity} left</span>
                                <button onclick="quickAdjustVariantStock(${v.id}, 1)" title="Add 1 pair" class="ml-0.5 hover:text-emerald-600 font-bold">+</button>
                                <button onclick="quickAdjustVariantStock(${v.id}, -1)" title="Remove 1 pair" class="hover:text-rose-600 font-bold">-</button>
                            </span>
                        `).join('')}
                    </div>
                </td>

                <td class="py-2.5 px-3 text-right font-bold text-slate-900">
                    ${curr}${p.base_price.toFixed(2)}
                </td>

                <td class="py-2.5 px-3 text-right text-slate-500 font-medium cost-price-col" style="${isAdmin ? '' : 'display:none;'}">
                    ${curr}${(p.cost_price || 0).toFixed(2)}
                </td>

                <td class="py-2.5 px-3 text-center">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${totalStock <= 3 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
                        ${totalStock} pairs
                    </span>
                </td>

                <td class="py-2.5 px-3 text-center admin-action-col" style="${isAdmin ? '' : 'display:none;'}">
                    <button onclick="requireAdminAction(() => deleteProduct(${p.id}, '${p.name}'))" title="Delete Shoe" class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    lucide.createIcons();
}

async function quickAdjustVariantStock(variantId, adjustment) {
    try {
        const res = await fetch(`/api/variants/${variantId}/stock`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ variant_id: variantId, adjustment: adjustment })
        });
        if (res.ok) {
            await loadProducts();
            renderInventoryTable();
            return;
        }
    } catch (err) {}

    // Offline stock adjustment
    for (const p of state.products) {
        for (const v of p.variants) {
            if (v.id === variantId) {
                v.stock_quantity = Math.max(0, v.stock_quantity + adjustment);
                localStorage.setItem('solemate_cached_products', JSON.stringify(state.products));
                renderInventoryTable();
                checkLowStockBadge();
                return;
            }
        }
    }
}

async function deleteProduct(productId, name) {
    if (!confirm(`Are you sure you want to delete "${name}" from inventory?`)) return;
    try {
        const res = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            await loadProducts();
            renderInventoryTable();
            return;
        }
    } catch (err) {}

    // Offline product deletion
    state.products = state.products.filter(p => p.id !== productId);
    localStorage.setItem('solemate_cached_products', JSON.stringify(state.products));
    renderInventoryTable();
    renderProductGrid();
    checkLowStockBadge();
    alert(`"${name}" deleted from local inventory.`);
}

// --- Direct Stock Update from Inventory Table ---
async function promptSetStock(variantId, shoeName, size, currentQty) {
    const ans = prompt(`جوتا: ${shoeName}\nسائز: ${size}\nفی الحال دستیاب جوڑے: ${currentQty}\n\nنئے جوڑوں کی تعداد درج کریں (Enter new pairs count):`, currentQty);
    if (ans === null) return;
    const newQty = parseInt(ans);
    if (isNaN(newQty) || newQty < 0) {
        alert("براہ کرم درست تعداد درج کریں۔ (Please enter a valid number).");
        return;
    }
    const adjustment = newQty - currentQty;
    if (adjustment === 0) return;
    await quickAdjustVariantStock(variantId, adjustment);
}

// --- Add New Shoe Modal & Dynamic Manual Sizes & Stock ---
const SIZE_GROUP_CONFIG = {
    'Gents': {
        gender: 'Gents',
        tabId: 'tab-Gents',
        label: 'Gents (مردانہ: 6 تا 12)',
        sizes: ['6', '7', '8', '9', '10', '11', '12'],
        defaultPairs: 3
    },
    'Ladies': {
        gender: 'Ladies',
        tabId: 'tab-Ladies',
        label: 'Ladies (زنانیہ: 6 تا 12)',
        sizes: ['6', '7', '8', '9', '10', '11', '12'],
        defaultPairs: 3
    },
    'Kids': {
        gender: 'Kids',
        tabId: 'tab-Kids',
        label: 'Kids (بچے: 1 تا 5)',
        sizes: ['1', '2', '3', '4', '5'],
        defaultPairs: 3
    },
    'Small Kids': {
        gender: 'Small Kids',
        tabId: 'tab-SmallKids',
        label: 'Small Kids (چھوٹے بچے: 4 تا 13)',
        sizes: ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
        defaultPairs: 2
    }
};

let currentSelectedSizeGroup = 'Gents';

function switchSizeGroup(groupName, forceRepopulate = true) {
    if (!groupName || groupName === 'Unisex') {
        groupName = 'Gents';
    }
    if (!SIZE_GROUP_CONFIG[groupName]) {
        groupName = 'Gents';
    }
    currentSelectedSizeGroup = groupName;

    // Sync dropdown
    const genderSelect = document.getElementById('newShoeGender');
    if (genderSelect && genderSelect.value !== groupName && SIZE_GROUP_CONFIG[groupName]) {
        genderSelect.value = groupName;
    }

    // Update active tab styles
    Object.keys(SIZE_GROUP_CONFIG).forEach(key => {
        const cfg = SIZE_GROUP_CONFIG[key];
        const tab = document.getElementById(cfg.tabId);
        if (tab) {
            if (key === groupName) {
                tab.className = "size-group-tab py-1.5 px-2 rounded-lg text-xs font-black flex items-center justify-center gap-1 border transition bg-blue-600 text-white border-blue-600 shadow-xs";
            } else {
                tab.className = "size-group-tab py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition";
            }
        }
    });

    // Update quick add buttons for this group
    renderQuickButtonsForGroup(groupName);

    // Populate rows if requested
    if (forceRepopulate) {
        populateSizeRowsForGroup(groupName);
    }
    if (window.lucide) lucide.createIcons();
}

function renderQuickButtonsForGroup(groupName) {
    const container = document.getElementById('quickSizeButtonsList');
    if (!container) return;
    const config = SIZE_GROUP_CONFIG[groupName] || SIZE_GROUP_CONFIG['Gents'];
    container.innerHTML = '';

    config.sizes.forEach(sz => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = "px-2 py-0.5 bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 hover:border-blue-400 rounded-md text-xs font-extrabold shadow-2xs transition active:scale-95";
        btn.textContent = `+${sz}`;
        btn.title = `سائز ${sz} شامل کریں`;
        btn.onclick = () => quickAddSizeRow(sz, 2);
        container.appendChild(btn);
    });

    const lbl = document.getElementById('quickButtonsLabel');
    if (lbl) {
        lbl.textContent = `فوری سائز بٹن (${config.label}):`;
    }
}

function populateSizeRowsForGroup(groupName, pairsPerSize = null) {
    const list = document.getElementById('dynamicSizeRowsList');
    if (!list) return;
    list.innerHTML = '';

    const config = SIZE_GROUP_CONFIG[groupName] || SIZE_GROUP_CONFIG['Gents'];
    const bulkInput = document.getElementById('bulkPairsInput');
    const bulkVal = bulkInput ? parseInt(bulkInput.value) : null;
    const defaultQty = (pairsPerSize !== null && pairsPerSize !== undefined) 
        ? pairsPerSize 
        : (!isNaN(bulkVal) && bulkVal >= 0 ? bulkVal : config.defaultPairs);

    config.sizes.forEach(sz => {
        addCustomSizeRow(sz, 'Black', defaultQty);
    });
    recalculateTotalStockBadge();
}

function resetCurrentGroupSizes() {
    populateSizeRowsForGroup(currentSelectedSizeGroup);
}

function resetDefaultSizeRows() {
    resetCurrentGroupSizes();
}

function applyBulkPairs() {
    const input = document.getElementById('bulkPairsInput');
    const val = input ? parseInt(input.value) : 3;
    const targetVal = isNaN(val) ? 0 : Math.max(0, val);

    const rows = document.querySelectorAll('.size-stock-row .stock-input');
    rows.forEach(inp => {
        inp.value = targetVal;
    });
    recalculateTotalStockBadge();
}

function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const list = document.getElementById('dynamicSizeRowsList');
    if (!list || list.children.length === 0) {
        const currentGender = document.getElementById('newShoeGender')?.value || 'Gents';
        switchSizeGroup(currentGender, true);
    } else {
        recalculateTotalStockBadge();
    }
    if (window.lucide) lucide.createIcons();
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) modal.classList.add('hidden');
}

function addCustomSizeRow(size = '', color = 'Black', qty = 1) {
    const list = document.getElementById('dynamicSizeRowsList');
    if (!list) return;

    const row = document.createElement('div');
    row.className = "grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 size-stock-row hover:border-blue-300 transition animate-fade-in";
    row.innerHTML = `
        <div class="col-span-4">
            <input type="text" value="${size}" placeholder="سائز (مثلاً: 8)" 
                   class="size-input w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none">
        </div>
        <div class="col-span-4">
            <input type="text" value="${color}" placeholder="رنگ (Color)" 
                   class="color-input w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:bg-white focus:border-blue-500 focus:outline-none">
        </div>
        <div class="col-span-3">
            <div class="flex items-center border border-blue-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                <button type="button" onclick="adjustRowStock(this, -1)" class="px-2 py-1 hover:bg-slate-100 text-slate-600 font-bold text-xs transition">-</button>
                <input type="number" min="0" value="${qty}" oninput="recalculateTotalStockBadge()" 
                       class="stock-input w-full p-1 text-xs font-black text-blue-900 text-center focus:outline-none">
                <button type="button" onclick="adjustRowStock(this, 1)" class="px-2 py-1 hover:bg-slate-100 text-slate-600 font-bold text-xs transition">+</button>
            </div>
        </div>
        <div class="col-span-1 text-center">
            <button type="button" onclick="this.closest('.size-stock-row').remove(); recalculateTotalStockBadge();" 
                    class="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition" title="حذف کریں (Delete)">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
        </div>
    `;
    list.appendChild(row);
    recalculateTotalStockBadge();
    if (window.lucide) lucide.createIcons();
}

function adjustRowStock(btn, delta) {
    const row = btn.closest('.size-stock-row');
    if (!row) return;
    const input = row.querySelector('.stock-input');
    if (input) {
        let val = parseInt(input.value) || 0;
        input.value = Math.max(0, val + delta);
        recalculateTotalStockBadge();
    }
}

function quickAddSizeRow(size, defaultQty = 2) {
    const list = document.getElementById('dynamicSizeRowsList');
    if (!list) return;

    // Check if this size already exists
    const existing = Array.from(list.querySelectorAll('.size-stock-row')).find(row => {
        const sz = row.querySelector('.size-input')?.value.trim();
        return sz === String(size);
    });

    if (existing) {
        const input = existing.querySelector('.stock-input');
        if (input) {
            input.value = (parseInt(input.value) || 0) + 1;
            existing.classList.add('ring-2', 'ring-blue-400');
            setTimeout(() => existing.classList.remove('ring-2', 'ring-blue-400'), 400);
            recalculateTotalStockBadge();
            return;
        }
    }

    addCustomSizeRow(size, 'Black', defaultQty);
}

function recalculateTotalStockBadge() {
    const inputs = document.querySelectorAll('.size-stock-row .stock-input');
    let total = 0;
    inputs.forEach(inp => {
        total += parseInt(inp.value) || 0;
    });
    const badge = document.getElementById('newShoeTotalPairsBadge');
    if (badge) {
        badge.textContent = `ٹوٹل: ${total} جوڑے`;
    }
}


async function submitNewShoeProduct() {
    const name = document.getElementById('newShoeName').value.trim();
    const brand = document.getElementById('newShoeBrand').value.trim();
    const category = document.getElementById('newShoeCategory').value;
    const gender = document.getElementById('newShoeGender').value;
    const basePrice = parseFloat(document.getElementById('newShoePrice').value);
    const costPrice = parseFloat(document.getElementById('newShoeCostPrice').value || 0);
    const imageUrl = document.getElementById('newShoeImage').value.trim();

    if (!name || !brand || isNaN(basePrice) || basePrice <= 0) {
        alert("براہ کرم جوتے کا نام، برانڈ اور قیمت درج کریں۔ (Please enter shoe model name, brand, and base price).");
        return;
    }

    const rows = document.querySelectorAll('.size-stock-row');
    const variants = [];
    rows.forEach(row => {
        const size = row.querySelector('.size-input')?.value.trim();
        const color = row.querySelector('.color-input')?.value.trim() || 'Black';
        const qty = parseInt(row.querySelector('.stock-input')?.value) || 0;
        if (size) {
            variants.push({
                size: size,
                color: color,
                stock_quantity: Math.max(0, qty),
                price: basePrice
            });
        }
    });

    if (variants.length === 0) {
        alert("براہ کرم کم از کم ایک سائز اور اس کے جوڑوں کی تعداد درج کریں۔ (Please add at least one shoe size).");
        return;
    }

    const payload = {
        name,
        brand,
        category,
        gender,
        base_price: basePrice,
        cost_price: costPrice,
        image_url: imageUrl,
        description: '',
        variants: variants
    };

    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            closeAddProductModal();
            await loadProducts();
            if (state.activeTab === 'inventory') renderInventoryTable();
            const totalPairs = variants.reduce((s, v) => s + v.stock_quantity, 0);
            alert(`جوتا "${name}" کل ${totalPairs} جوڑوں کے ساتھ کامیابی سے محفوظ ہو گیا!`);
            return;
        }
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Server error");
    } catch (err) {}

    // Offline product addition
    const newProd = {
        id: Date.now(),
        name,
        brand,
        category,
        gender,
        base_price: basePrice,
        cost_price: costPrice,
        image_url: imageUrl,
        description: '',
        variants: payload.variants.map((v, i) => ({
            id: Date.now() + i,
            product_id: Date.now(),
            sku: `${brand.slice(0,3).toUpperCase()}-${name.slice(0,3).toUpperCase()}-${v.color.slice(0,2).toUpperCase()}-${v.size.replace(/[^a-zA-Z0-9]/g,'')}-${i+1}`,
            barcode: String(Math.floor(1000000 + Math.random() * 9000000)),
            size: v.size,
            color: v.color,
            stock_quantity: v.stock_quantity,
            price: basePrice
        }))
    };
    state.products.unshift(newProd);
    localStorage.setItem('solemate_cached_products', JSON.stringify(state.products));
    closeAddProductModal();
    renderProductGrid();
    if (state.activeTab === 'inventory') renderInventoryTable();
    checkLowStockBadge();
    const totalPairs = variants.reduce((s, v) => s + v.stock_quantity, 0);
    alert(`جوتا "${name}" کل ${totalPairs} جوڑوں کے ساتھ شامل ہو گیا (Offline Mode)!`);
}

// --- Quick Customer Modal ---
function openQuickCustomerModal() {
    document.getElementById('customerModal').classList.remove('hidden');
    lucide.createIcons();
}

function closeCustomerModal() {
    document.getElementById('customerModal').classList.add('hidden');
}

async function submitNewCustomer() {
    const name = document.getElementById('custNameInput').value.trim();
    const phone = document.getElementById('custPhoneInput').value.trim();

    if (!name || !phone) {
        alert("Customer Name and Phone number are required.");
        return;
    }

    try {
        const res = await fetch('/api/customers', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name, phone })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to add customer");
        }

        const input = document.getElementById('customerSearchInput');
        if (input) input.value = `${name} (${phone})`;
        closeCustomerModal();
    } catch (err) {
        alert("Customer Error: " + err.message);
    }
}

function filterOrdersTab(filter) {
    state.orderFilter = filter;
    ['all', 'udhaar', 'completed'].forEach(f => {
        const btn = document.getElementById(`orderFilterBtn-${f}`);
        if (btn) {
            if (f === filter) {
                btn.className = "px-2.5 py-1 rounded-lg font-bold bg-blue-600 text-white shadow-xs transition";
            } else {
                btn.className = "px-2.5 py-1 rounded-lg font-bold text-slate-600 hover:text-slate-900 transition";
            }
        }
    });
    loadOrders();
}

// --- Orders History, Udhaar Khata & Returns ---
async function loadOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    const search = document.getElementById('ordersSearchInput')?.value.trim().toLowerCase() || '';
    const curr = state.settings.currency_symbol || '$';

    let orders = [];
    try {
        const res = await fetch(`/api/orders?q=${encodeURIComponent(search)}`, { headers: getAuthHeaders() });
        if (res.ok) {
            orders = await res.json();
        }
    } catch (err) {}

    // Merge with local offline orders
    let localOrders = [];
    try {
        localOrders = JSON.parse(localStorage.getItem('solemate_local_orders') || '[]');
    } catch (e) {}

    const seen = new Set(orders.map(o => o.invoice_no));
    for (const lo of localOrders) {
        if (!seen.has(lo.invoice_no)) {
            if (!search || lo.invoice_no.toLowerCase().includes(search) || (lo.customer_name && lo.customer_name.toLowerCase().includes(search))) {
                orders.push(lo);
            }
        }
    }

    // Filter by tab
    if (state.orderFilter === 'udhaar') {
        orders = orders.filter(o => o.payment_method === 'Udhaar' || o.status === 'pending_udhaar' || (o.udhaar_amount && (o.udhaar_amount > (o.udhaar_paid || 0))));
    } else if (state.orderFilter === 'completed') {
        orders = orders.filter(o => o.status === 'completed' && (!o.udhaar_amount || (o.udhaar_paid >= o.udhaar_amount)));
    }

    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Update pending Udhaar badge
    const allPendingUdhaars = orders.filter(o => o.status === 'pending_udhaar' || (o.payment_method === 'Udhaar' && (!o.udhaar_paid || o.udhaar_paid < o.udhaar_amount)));
    const badge = document.getElementById('udhaarCountBadge');
    if (badge) {
        if (allPendingUdhaars.length > 0) {
            badge.textContent = allPendingUdhaars.length;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="py-8 text-center text-slate-400">
                    <p class="font-medium text-xs">No transactions recorded under this filter</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = orders.map(o => {
        const isUdhaar = o.payment_method === 'Udhaar' || o.status === 'pending_udhaar' || (o.udhaar_amount && o.udhaar_amount > 0);
        const isPending = isUdhaar && (o.status === 'pending_udhaar' || (!o.udhaar_paid || o.udhaar_paid < o.udhaar_amount));
        const remUdhaar = Math.max(0, (o.udhaar_amount || o.total_amount) - (o.udhaar_paid || 0));

        let statusBadge = '';
        if (isPending) {
            statusBadge = `<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">📒 UDHAAR: ${curr}${remUdhaar.toFixed(2)}</span>`;
        } else if (isUdhaar) {
            statusBadge = `<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700">✓ KHATA PAID</span>`;
        } else {
            statusBadge = `<span class="px-2 py-0.5 rounded-full text-[9px] font-bold ${(o.status || 'completed') === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">${(o.status || 'completed').toUpperCase()}</span>`;
        }

        return `
            <tr class="hover:bg-slate-50/80 transition">
                <td class="py-2.5 px-3 font-bold font-mono text-blue-600 text-[11px]">${o.invoice_no}</td>
                <td class="py-2.5 px-3 text-slate-500">${new Date(o.created_at).toLocaleDateString()} ${new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td class="py-2.5 px-3 font-medium text-slate-800">
                    <span class="font-bold block text-slate-900">${o.customer_name || 'Walk-in'}</span>
                    ${o.customer_phone ? `<span class="text-[9px] text-slate-400">${o.customer_phone}</span>` : ''}
                </td>
                <td class="py-2.5 px-3 text-slate-600">${o.cashier_name || 'Staff'}</td>
                <td class="py-2.5 px-3">
                    <span class="inline-flex items-center gap-1 font-semibold text-slate-700">
                        <span class="w-1.5 h-1.5 rounded-full ${o.payment_method === 'Cash' ? 'bg-emerald-500' : o.payment_method === 'Udhaar' ? 'bg-amber-500' : 'bg-blue-500'}"></span>
                        ${o.payment_method}
                    </span>
                </td>
                <td class="py-2.5 px-3 text-right font-black text-slate-900">${curr}${o.total_amount.toFixed(2)}</td>
                <td class="py-2.5 px-3 text-center">
                    ${statusBadge}
                </td>
                <td class="py-2.5 px-3 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                        <button onclick="reprintReceipt('${o.id}', '${o.invoice_no}')" class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1">
                            <i data-lucide="printer" class="w-3 h-3"></i> Receipt
                        </button>
                        ${isPending ? `
                            <button onclick="settleUdhaarOrder('${o.id}', '${o.invoice_no}', ${remUdhaar}, '${encodeURIComponent(o.customer_name)}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs">
                                وصول کریں
                            </button>
                        ` : ''}
                        ${!isPending && (o.status || 'completed') === 'completed' ? `
                            <button onclick="requireAdminAction(() => refundTransaction('${o.id}', '${o.invoice_no}'), 'Admin PIN required to authorize return/refund')" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold">
                                Refund
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    lucide.createIcons();
}

async function settleUdhaarOrder(orderId, invoiceNo, amount, encodedName) {
    const custName = decodeURIComponent(encodedName);
    const curr = state.settings.currency_symbol || '$';
    if (!confirm(`Kia ${custName} se ${curr}${amount.toFixed(2)} Baqaya Udhaar wusool ho gaya hai?`)) {
        return;
    }

    try {
        const res = await fetch(`/api/orders/${orderId}/settle-udhaar`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            alert(`✓ ${custName} ka ${curr}${amount.toFixed(2)} Udhaar wusool darj ho gaya!`);
            await loadOrders();
            return;
        }
    } catch (e) {}

    // Offline settlement
    try {
        let localOrders = JSON.parse(localStorage.getItem('solemate_local_orders') || '[]');
        const matched = localOrders.find(o => String(o.id) === String(orderId) || o.invoice_no === invoiceNo);
        if (matched) {
            matched.status = 'completed';
            matched.udhaar_paid = matched.udhaar_amount || matched.total_amount;
            matched.notes = (matched.notes ? matched.notes + ' ' : '') + '[Udhaar Cleared / Wusool]';
            localStorage.setItem('solemate_local_orders', JSON.stringify(localOrders));
            alert(`✓ ${custName} ka ${curr}${amount.toFixed(2)} Udhaar wusool darj ho gaya (Offline Mode)!`);
            await loadOrders();
            return;
        }
    } catch (e) {}

    alert("Could not settle Udhaar. Please try again.");
}

async function reprintReceipt(orderId, invoiceNo = '') {
    try {
        const res = await fetch(`/api/orders/${orderId}`, { headers: getAuthHeaders() });
        if (res.ok) {
            const orderData = await res.json();
            showReceiptModal(orderData);
            return;
        }
    } catch (err) {}

    // Fallback to local storage order
    try {
        const localOrders = JSON.parse(localStorage.getItem('solemate_local_orders') || '[]');
        const matched = localOrders.find(o => String(o.id) === String(orderId) || o.invoice_no === invoiceNo);
        if (matched) {
            showReceiptModal(matched);
            return;
        }
    } catch (e) {}

    alert("Receipt not found for this transaction");
}

async function refundTransaction(orderId, invoiceNo) {
    if (!confirm(`Refund order ${invoiceNo}? This will restore shoes back to inventory.`)) return;

    try {
        const res = await fetch(`/api/orders/${orderId}/refund`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            alert("Order refunded and shoes returned to stock.");
            await loadOrders();
            await loadProducts();
            return;
        }
    } catch (err) {}

    // Offline Refund Handling
    try {
        const localOrders = JSON.parse(localStorage.getItem('solemate_local_orders') || '[]');
        const matched = localOrders.find(o => String(o.id) === String(orderId) || o.invoice_no === invoiceNo);
        if (matched) {
            matched.status = 'refunded';
            localStorage.setItem('solemate_local_orders', JSON.stringify(localOrders));
            alert("Order marked refunded (Offline Mode).");
            loadOrders();
            return;
        }
    } catch (e) {}

    alert("Refund failed");
}

// --- Analytics & Statistics (Admin Protected) ---
async function loadStats() {
    if (state.currentUser.role !== 'admin') return;

    try {
        const res = await fetch('/api/stats', { headers: getAuthHeaders() });
        if (!res.ok) return;

        const data = await res.json();
        const curr = state.settings.currency_symbol || '$';

        document.getElementById('statTodaySales').textContent = `${curr}${data.today_sales.toFixed(2)}`;
        document.getElementById('statTodayOrders').textContent = data.today_orders;
        document.getElementById('statPairsToday').textContent = data.pairs_sold_today;
        document.getElementById('statTotalStock').textContent = data.total_pairs_in_stock;
        document.getElementById('statRetailValue').textContent = `${curr}${data.total_retail_value.toFixed(2)}`;
        document.getElementById('statCostValue').textContent = `${curr}${data.total_cost_value.toFixed(2)}`;

        const topList = document.getElementById('topSellingList');
        if (topList) {
            if (!data.top_selling || data.top_selling.length === 0) {
                topList.innerHTML = `<p class="text-xs text-slate-400">Complete sales at POS to view best sellers</p>`;
            } else {
                topList.innerHTML = data.top_selling.map((item, idx) => `
                    <div class="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <div class="flex items-center gap-2">
                            <span class="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-black text-[10px] flex items-center justify-center">${idx + 1}</span>
                            <div>
                                <span class="font-bold text-slate-900 block leading-tight">${item.product_name}</span>
                                <span class="text-[9px] text-slate-400">${item.brand}</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="font-black text-slate-900 block text-xs">${item.total_sold} pairs</span>
                            <span class="text-[9px] text-emerald-600 font-semibold">${curr}${item.revenue.toFixed(2)}</span>
                        </div>
                    </div>
                `).join('');
            }
        }

        const lowList = document.getElementById('lowStockSummaryList');
        if (lowList) {
            const lowVariants = [];
            state.products.forEach(p => {
                p.variants.forEach(v => {
                    if (v.stock_quantity <= 3) {
                        lowVariants.push({ product_name: p.name, brand: p.brand, size: v.size, color: v.color, stock: v.stock_quantity });
                    }
                });
            });

            if (lowVariants.length === 0) {
                lowList.innerHTML = `<p class="text-xs text-emerald-600 font-semibold">✓ All shoe sizes are well stocked!</p>`;
            } else {
                lowList.innerHTML = lowVariants.slice(0, 5).map(v => `
                    <div class="flex items-center justify-between p-1.5 bg-rose-50/70 border border-rose-100 rounded-lg text-xs">
                        <div>
                            <span class="font-bold text-slate-900 block">${v.product_name}</span>
                            <span class="text-[9px] text-slate-500">${v.brand} • Size: ${v.size} (${v.color})</span>
                        </div>
                        <span class="px-1.5 py-0.2 bg-rose-500 text-white font-bold text-[9px] rounded">
                            ${v.stock} left
                        </span>
                    </div>
                `).join('');
            }
        }

    } catch (err) {
        computeOfflineStats();
    }
}

function computeOfflineStats() {
    const curr = state.settings.currency_symbol || '$';
    let localOrders = [];
    try {
        localOrders = JSON.parse(localStorage.getItem('solemate_local_orders') || '[]');
    } catch (e) {}

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayOrders = localOrders.filter(o => o.created_at && o.created_at.startsWith(todayStr));
    const todaySales = todayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const pairsToday = todayOrders.reduce((sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + i.quantity, 0) : 0), 0);

    let totalStock = 0;
    let totalRetail = 0;
    let totalCost = 0;
    state.products.forEach(p => {
        p.variants.forEach(v => {
            totalStock += v.stock_quantity;
            totalRetail += v.stock_quantity * v.price;
            totalCost += v.stock_quantity * (p.cost_price || 0);
        });
    });

    const elSales = document.getElementById('statTodaySales');
    if (elSales) elSales.textContent = `${curr}${todaySales.toFixed(2)}`;
    const elOrders = document.getElementById('statTodayOrders');
    if (elOrders) elOrders.textContent = todayOrders.length;
    const elPairs = document.getElementById('statPairsToday');
    if (elPairs) elPairs.textContent = pairsToday;
    const elStock = document.getElementById('statTotalStock');
    if (elStock) elStock.textContent = totalStock;
    const elRetail = document.getElementById('statRetailValue');
    if (elRetail) elRetail.textContent = `${curr}${totalRetail.toFixed(2)}`;
    const elCost = document.getElementById('statCostValue');
    if (elCost) elCost.textContent = `${curr}${totalCost.toFixed(2)}`;
}

function checkLowStockBadge() {
    let count = 0;
    state.products.forEach(p => {
        p.variants.forEach(v => {
            if (v.stock_quantity <= 3) count++;
        });
    });
    const badge = document.getElementById('lowStockBadge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}
