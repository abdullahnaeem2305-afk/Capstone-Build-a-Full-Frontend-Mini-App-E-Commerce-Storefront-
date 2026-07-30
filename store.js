/**
 * ============================================================
 * Cart Store — State Management + localStorage Persistence
 * ------------------------------------------------------------
 * CartStore.init()                    — load saved cart
 * CartStore.addItem(product)          — add or increment
 * CartStore.removeItem(productId)     — remove entirely
 * CartStore.updateQuantity(id, qty)   — set specific quantity
 * CartStore.getItems()                — [{ product, quantity }]
 * CartStore.getTotal()                — running total price
 * CartStore.getCount()                — total item count
 * CartStore.clear()                   — empty cart
 * CartStore.subscribe(callback)       — listen for changes
 * ============================================================
 */

const CartStore = {
    items: [],
    _listeners: [],
    STORAGE_KEY: "luxemart_cart",

    /** Load cart from localStorage on startup */
    init() {
        this._load();
        this._notify();
    },

    /** Add a product (increment if already in cart) */
    addItem(product) {
        const existing = this.items.find(i => i.product.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            this.items.push({ product: { ...product }, quantity: 1 });
        }
        this._save();
        this._notify();
    },

    /** Remove a product entirely from cart */
    removeItem(productId) {
        this.items = this.items.filter(i => i.product.id !== productId);
        this._save();
        this._notify();
    },

    /** Set a specific quantity; removes if qty <= 0 */
    updateQuantity(productId, qty) {
        if (qty <= 0) {
            this.removeItem(productId);
            return;
        }
        const item = this.items.find(i => i.product.id === productId);
        if (item) {
            item.quantity = qty;
            this._save();
            this._notify();
        }
    },

    /** Get all cart items */
    getItems() {
        return this.items;
    },

    /** Compute the running total price */
    getTotal() {
        return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    },

    /** Get total item count (sum of quantities) */
    getCount() {
        return this.items.reduce((sum, i) => sum + i.quantity, 0);
    },

    /** Clear all items */
    clear() {
        this.items = [];
        this._save();
        this._notify();
    },

    /**
     * Subscribe to cart changes.
     * Returns an unsubscribe function.
     */
    subscribe(callback) {
        this._listeners.push(callback);
        return () => {
            this._listeners = this._listeners.filter(l => l !== callback);
        };
    },

    // ── Private helpers ──────────────────────────────────────

    _save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
        } catch (e) {
            console.warn("CartStore: localStorage write failed", e);
        }
    },

    _load() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) this.items = JSON.parse(raw);
        } catch (e) {
            console.warn("CartStore: localStorage read failed, starting fresh", e);
            this.items = [];
        }
    },

    _notify() {
        const snapshot = [...this.items];
        this._listeners.forEach(cb => {
            try { cb(snapshot); } catch (e) { console.error("CartStore listener error", e); }
        });
    }
};
