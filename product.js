/**
 * ============================================================
 * Product Detail Page
 * ============================================================
 */

function renderProductPage(container, { id }) {
    const page = document.createElement("div");
    page.className = "page container";
    container.appendChild(page);

    // Show skeleton while loading
    page.innerHTML = `
        <div class="breadcrumb">
            <a href="#/" class="breadcrumb-link">← Back to Products</a>
        </div>
        <div class="product-detail">
            <div class="product-detail-image">
                <div class="skeleton skeleton-image-lg"></div>
            </div>
            <div class="product-detail-info">
                <div class="skeleton skeleton-text" style="width:40%;height:16px"></div>
                <div class="skeleton skeleton-text" style="width:90%;height:28px;margin-top:12px"></div>
                <div class="skeleton skeleton-text" style="width:30%;height:20px;margin-top:12px"></div>
                <div class="skeleton skeleton-text" style="width:20%;height:32px;margin-top:16px"></div>
                <div class="skeleton skeleton-text" style="width:100%;height:80px;margin-top:20px"></div>
            </div>
        </div>
    `;

    StoreAPI.fetchProduct(id)
        .then(product => renderDetail(page, product))
        .catch(() => {
            page.innerHTML = `
                <div class="breadcrumb">
                    <a href="#/" class="breadcrumb-link">← Back to Products</a>
                </div>
                <div class="empty-state">
                    <div class="empty-state-icon">😕</div>
                    <h2>Product Not Found</h2>
                    <p>We couldn't find the product you're looking for.</p>
                </div>
            `;
        });
}

function renderDetail(page, product) {
    let quantity = 1;

    page.innerHTML = "";

    // Breadcrumb
    const breadcrumb = document.createElement("div");
    breadcrumb.className = "breadcrumb";
    const backLink = document.createElement("a");
    backLink.href = "#/";
    backLink.className = "breadcrumb-link";
    backLink.textContent = "← Back to Products";
    breadcrumb.appendChild(backLink);

    // Detail layout
    const detail = document.createElement("div");
    detail.className = "product-detail";

    // ── Left: Image ──
    const imageSection = document.createElement("div");
    imageSection.className = "product-detail-image";

    const imgWrap = document.createElement("div");
    imgWrap.className = "detail-image-wrap";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;
    imgWrap.appendChild(img);

    // Zoom-on-hover effect
    imgWrap.addEventListener("mousemove", (e) => {
        const rect = imgWrap.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
        img.style.transform = "scale(1.8)";
    });
    imgWrap.addEventListener("mouseleave", () => {
        img.style.transform = "scale(1)";
    });

    imageSection.appendChild(imgWrap);

    // ── Right: Info ──
    const info = document.createElement("div");
    info.className = "product-detail-info";

    // Category
    const category = document.createElement("span");
    category.className = "detail-category";
    category.textContent = capitalizeCategory(product.category);

    // Title
    const title = document.createElement("h1");
    title.className = "detail-title";
    title.textContent = product.title;

    // Rating
    const ratingRow = document.createElement("div");
    ratingRow.className = "detail-rating";
    ratingRow.appendChild(renderStars(product.rating.rate));
    const ratingText = document.createElement("span");
    ratingText.className = "rating-count";
    ratingText.textContent = `${product.rating.rate} (${product.rating.count} reviews)`;
    ratingRow.appendChild(ratingText);

    // Price
    const price = document.createElement("div");
    price.className = "detail-price";
    price.textContent = `$${product.price.toFixed(2)}`;

    // Description
    const descHeading = document.createElement("h3");
    descHeading.textContent = "Description";
    descHeading.className = "detail-desc-heading";

    const desc = document.createElement("p");
    desc.className = "detail-description";
    desc.textContent = product.description;

    // Quantity + Add to cart
    const actions = document.createElement("div");
    actions.className = "detail-actions";

    // Quantity stepper
    const stepper = document.createElement("div");
    stepper.className = "quantity-stepper";

    const minusBtn = document.createElement("button");
    minusBtn.className = "qty-btn";
    minusBtn.textContent = "−";
    minusBtn.setAttribute("aria-label", "Decrease quantity");

    const qtyDisplay = document.createElement("span");
    qtyDisplay.className = "qty-value";
    qtyDisplay.textContent = quantity;

    const plusBtn = document.createElement("button");
    plusBtn.className = "qty-btn";
    plusBtn.textContent = "+";
    plusBtn.setAttribute("aria-label", "Increase quantity");

    minusBtn.addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            qtyDisplay.textContent = quantity;
        }
    });

    plusBtn.addEventListener("click", () => {
        if (quantity < 99) {
            quantity++;
            qtyDisplay.textContent = quantity;
        }
    });

    stepper.append(minusBtn, qtyDisplay, plusBtn);

    const addBtn = createButton({
        text: "Add to Cart",
        variant: "primary",
        onClick: () => {
            for (let i = 0; i < quantity; i++) {
                CartStore.addItem(product);
            }
            showToast({
                message: `${quantity}× ${product.title} added to cart!`,
                type: "success",
                duration: 3000
            });
        }
    });
    addBtn.classList.add("detail-add-btn");

    actions.append(stepper, addBtn);

    // Free shipping note
    const shippingNote = document.createElement("div");
    shippingNote.className = "detail-shipping";
    shippingNote.innerHTML = `<span class="shipping-icon">🚚</span> Free shipping on orders over $50`;

    info.append(category, title, ratingRow, price, descHeading, desc, actions, shippingNote);
    detail.append(imageSection, info);
    page.append(breadcrumb, detail);
}
