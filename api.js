/**
 * ============================================================
 * Fake Store API Client
 * ------------------------------------------------------------
 * StoreAPI.fetchProducts()       → Promise<Product[]>
 * StoreAPI.fetchProduct(id)      → Promise<Product>
 * StoreAPI.fetchCategories()     → Promise<string[]>
 *
 * Product shape:
 * { id, title, price, description, category, image,
 *   rating: { rate, count } }
 *
 * All responses are cached in memory after first fetch.
 * ============================================================
 */

const StoreAPI = {
    _cache: {},
    BASE_URL: "https://fakestoreapi.com",

    async fetchProducts() {
        if (this._cache.products) return this._cache.products;

        try {
            const res = await fetch(`${this.BASE_URL}/products`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            this._cache.products = data;
            return data;
        } catch (err) {
            console.error("Failed to fetch products:", err);
            throw err;
        }
    },

    async fetchProduct(id) {
        const key = `product_${id}`;
        if (this._cache[key]) return this._cache[key];

        // Try from the full product cache first
        if (this._cache.products) {
            const found = this._cache.products.find(p => p.id === Number(id));
            if (found) {
                this._cache[key] = found;
                return found;
            }
        }

        try {
            const res = await fetch(`${this.BASE_URL}/products/${id}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            this._cache[key] = data;
            return data;
        } catch (err) {
            console.error(`Failed to fetch product ${id}:`, err);
            throw err;
        }
    },

    async fetchCategories() {
        if (this._cache.categories) return this._cache.categories;

        try {
            const res = await fetch(`${this.BASE_URL}/products/categories`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            this._cache.categories = data;
            return data;
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            throw err;
        }
    }
};
