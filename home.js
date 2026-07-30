/**
 * ============================================================
 * Home Page — Product Listing with Search & Category Filters
 * ============================================================
 */

function renderHomePage(container) {
    // ── Hero ──
    const hero = document.createElement("section");
    hero.className = "store-hero";
    hero.innerHTML = `
        <div class="container">
            <span class="eyebrow"><span class="eyebrow-dot"></span> New Collection 2026</span>
            <h1>Discover <span class="accent">Premium</span> Products</h1>
            <p class="lede">Curated products with exceptional quality. Free shipping on orders over $50.</p>
        </div>
    `;

    // ── Toolbar (search + filters) ──
    const toolbar = document.createElement("div");
    toolbar.className = "toolbar container";

    // Search
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";
    searchContainer.innerHTML = `
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
    `;
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "search-input";
    searchInput.placeholder = "Search products...";
    searchInput.id = "search-input";
    searchContainer.appendChild(searchInput);

    // Category filters
    const filtersWrap = document.createElement("div");
    filtersWrap.className = "category-filters";
    filtersWrap.id = "category-filters";

    toolbar.append(searchContainer, filtersWrap);

    // ── Product grid ──
    const gridSection = document.createElement("section");
    gridSection.className = "container";

    const grid = document.createElement("div");
    grid.className = "product-grid";
    grid.id = "product-grid";
    gridSection.appendChild(grid);

    // ── Assemble page ──
    container.append(hero, toolbar, gridSection);

    // ── State ──
    let allProducts = [];
    let activeCategory = "all";
    let searchQuery = "";

    // ── Load data ──
    showSkeletons(grid, 8);

    Promise.all([StoreAPI.fetchProducts(), StoreAPI.fetchCategories()])
        .then(([products, categories]) => {
            allProducts = products;
            buildCategoryFilters(categories);
            renderProducts();
        })
        .catch(() => {
            grid.innerHTML = "";
            showError(grid, "Failed to load products. Please try again later.");
        });

    // ── Category filter pills ──
    function buildCategoryFilters(categories) {
        // "All" pill
        const allPill = document.createElement("button");
        allPill.className = "category-pill active";
        allPill.textContent = "All";
        allPill.addEventListener("click", () => {
            activeCategory = "all";
            updateActivePill();
            renderProducts();
        });
        filtersWrap.appendChild(allPill);

        categories.forEach(cat => {
            const pill = document.createElement("button");
            pill.className = "category-pill";
            pill.textContent = capitalizeCategory(cat);
            pill.addEventListener("click", () => {
                activeCategory = cat;
                updateActivePill();
                renderProducts();
            });
            filtersWrap.appendChild(pill);
        });
    }

    function updateActivePill() {
        filtersWrap.querySelectorAll(".category-pill").forEach((pill, idx) => {
            const isActive =
                (activeCategory === "all" && idx === 0) ||
                pill.textContent === capitalizeCategory(activeCategory);
            pill.classList.toggle("active", isActive);
        });
    }

    // ── Search with debounce ──
    let debounceTimer;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchQuery = e.target.value.trim().toLowerCase();
            renderProducts();
        }, 250);
    });

    // ── Render filtered products ──
    function renderProducts() {
        grid.innerHTML = "";

        let filtered = allProducts;

        // Category filter
        if (activeCategory !== "all") {
            filtered = filtered.filter(p => p.category === activeCategory);
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(searchQuery) ||
                p.description.toLowerCase().includes(searchQuery)
            );
        }

        if (filtered.length === 0) {
            showEmptyState(grid, "No products found", "Try a different search term or category.");
            return;
        }

        filtered.forEach((product, index) => {
            const card = createProductCard({
                product,
                onAddToCart: (p) => {
                    CartStore.addItem(p);
                    showToast({ message: `${p.title} added to cart!`, type: "success", duration: 2500 });
                },
                onViewDetails: (p) => {
                    Router.navigateTo(`/product/${p.id}`);
                }
            });

            // Stagger animation
            card.classList.add("stagger-item");
            card.style.animationDelay = `${index * 60}ms`;

            grid.appendChild(card);
        });
    }
}

/* ── Helpers ─────────────────────────────────────────────── */

function capitalizeCategory(cat) {
    return cat.split(/[\s']+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
              .replace("s ", "'s ");
}

function showSkeletons(container, count) {
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "skeleton-card";
        skeleton.innerHTML = `
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton-body">
                <div class="skeleton skeleton-text" style="width:70%"></div>
                <div class="skeleton skeleton-text" style="width:50%"></div>
                <div class="skeleton skeleton-text" style="width:40%"></div>
            </div>
        `;
        container.appendChild(skeleton);
    }
}

function showEmptyState(container, title, message) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `
        <div class="empty-state-icon">🔍</div>
        <h2>${title}</h2>
        <p>${message}</p>
    `;
    container.appendChild(empty);
}

function showError(container, message) {
    const err = document.createElement("div");
    err.className = "empty-state";
    err.innerHTML = `
        <div class="empty-state-icon">⚠️</div>
        <h2>Oops!</h2>
        <p>${message}</p>
    `;
    container.appendChild(err);
}
