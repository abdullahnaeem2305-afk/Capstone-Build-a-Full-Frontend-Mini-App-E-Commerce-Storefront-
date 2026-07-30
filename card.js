/**
 * ============================================================
 * Reusable Card Component (Week 5 UI Kit — Extended)
 * ------------------------------------------------------------
 * Original createCard() preserved for generic cards.
 * New createProductCard() builds an e-commerce product card.
 *
 * createProductCard({
 *   product,                  // Fake Store API product object
 *   onAddToCart: (product) => {},
 *   onViewDetails: (product) => {}
 * })
 * ============================================================
 */

/* ── Original Week 5 generic card ───────────────────────── */
function createCard({
    icon = "✨",
    title = "Card Title",
    description = "Card description goes here.",
    buttonText = "Learn More",
    onButtonClick = () => {}
} = {}) {

    const card = document.createElement("article");
    card.className = "card";

    const iconEl = document.createElement("div");
    iconEl.className = "card-icon";
    iconEl.setAttribute("aria-hidden", "true");
    iconEl.textContent = icon;

    const titleEl = document.createElement("h3");
    titleEl.textContent = title;

    const descEl = document.createElement("p");
    descEl.textContent = description;

    const content = document.createElement("div");
    content.className = "card-content";
    content.append(iconEl, titleEl, descEl);

    const button = createButton({
        text: buttonText,
        variant: "primary",
        onClick: onButtonClick
    });
    button.classList.add("card-btn");

    card.append(content, button);
    return card;
}

/* ── E-commerce Product Card ────────────────────────────── */
function createProductCard({
    product,
    onAddToCart = () => {},
    onViewDetails = () => {}
} = {}) {

    const card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("data-product-id", product.id);

    // ── Image area ──
    const imageWrap = document.createElement("div");
    imageWrap.className = "product-card-image";
    imageWrap.addEventListener("click", () => onViewDetails(product));

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;
    img.loading = "lazy";
    imageWrap.appendChild(img);

    // Category badge overlaid on image
    const categoryBadge = document.createElement("span");
    categoryBadge.className = "product-card-category";
    categoryBadge.textContent = product.category;
    imageWrap.appendChild(categoryBadge);

    // ── Body ──
    const body = document.createElement("div");
    body.className = "product-card-body";

    const title = document.createElement("h3");
    title.className = "product-card-title";
    title.textContent = product.title;
    title.addEventListener("click", () => onViewDetails(product));

    // Star rating
    const rating = document.createElement("div");
    rating.className = "product-card-rating";
    rating.appendChild(renderStars(product.rating.rate));
    const ratingCount = document.createElement("span");
    ratingCount.className = "rating-count";
    ratingCount.textContent = `(${product.rating.count})`;
    rating.appendChild(ratingCount);

    // Footer: price + add-to-cart
    const footer = document.createElement("div");
    footer.className = "product-card-footer";

    const price = document.createElement("span");
    price.className = "product-card-price";
    price.textContent = `$${product.price.toFixed(2)}`;

    const addBtn = createButton({
        text: "Add to Cart",
        variant: "primary",
        size: "sm",
        onClick: (e) => {
            e.stopPropagation();
            onAddToCart(product);

            // Micro-animation: button feedback
            addBtn.classList.add("btn-added");
            addBtn.textContent = "✓ Added";
            setTimeout(() => {
                addBtn.classList.remove("btn-added");
                addBtn.textContent = "Add to Cart";
            }, 1200);
        },
        ariaLabel: `Add ${product.title} to cart`
    });

    footer.append(price, addBtn);
    body.append(title, rating, footer);
    card.append(imageWrap, body);

    return card;
}

/* ── Star rating helper ─────────────────────────────────── */
function renderStars(rate) {
    const container = document.createElement("div");
    container.className = "stars";
    container.setAttribute("aria-label", `${rate} out of 5 stars`);

    const fullStars = Math.floor(rate);
    const hasHalf = rate - fullStars >= 0.25 && rate - fullStars < 0.75;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
        const s = document.createElement("span");
        s.className = "star filled";
        s.textContent = "★";
        container.appendChild(s);
    }
    if (hasHalf) {
        const s = document.createElement("span");
        s.className = "star half";
        s.textContent = "★";
        container.appendChild(s);
    }
    for (let i = 0; i < emptyStars; i++) {
        const s = document.createElement("span");
        s.className = "star empty";
        s.textContent = "☆";
        container.appendChild(s);
    }

    return container;
}
