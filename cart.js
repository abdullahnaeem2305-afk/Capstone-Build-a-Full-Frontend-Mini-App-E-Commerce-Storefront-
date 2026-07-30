/**
 * ============================================================
 * Cart Page — Shopping Cart with Quantity Steppers & Summary
 * ============================================================
 */

function renderCartPage(container) {
    const page = document.createElement("div");
    page.className = "page container cart-page";
    container.appendChild(page);

    // Track our subscription so we can clean up
    let unsubscribe = null;

    function render() {
        page.innerHTML = "";
        const items = CartStore.getItems();

        // Header
        const header = document.createElement("div");
        header.className = "cart-header";
        const h1 = document.createElement("h1");
        h1.textContent = "Shopping Cart";
        const itemCount = document.createElement("span");
        itemCount.className = "cart-count-label";
        itemCount.textContent = `${CartStore.getCount()} item${CartStore.getCount() !== 1 ? "s" : ""}`;
        header.append(h1, itemCount);
        page.appendChild(header);

        // Empty state
        if (items.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.innerHTML = `
                <div class="empty-state-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any products yet.</p>
            `;
            const shopBtn = createButton({
                text: "Continue Shopping",
                variant: "primary",
                onClick: () => Router.navigateTo("/")
            });
            shopBtn.style.marginTop = "24px";
            empty.appendChild(shopBtn);
            page.appendChild(empty);
            return;
        }

        // Cart content: items + summary
        const content = document.createElement("div");
        content.className = "cart-content";

        // ── Items list ──
        const itemsList = document.createElement("div");
        itemsList.className = "cart-items";

        items.forEach(({ product, quantity }) => {
            const item = document.createElement("div");
            item.className = "cart-item";

            // Thumbnail
            const imgWrap = document.createElement("div");
            imgWrap.className = "cart-item-image";
            const img = document.createElement("img");
            img.src = product.image;
            img.alt = product.title;
            imgWrap.appendChild(img);
            imgWrap.addEventListener("click", () => Router.navigateTo(`/product/${product.id}`));

            // Details
            const details = document.createElement("div");
            details.className = "cart-item-details";

            const titleLink = document.createElement("a");
            titleLink.href = `#/product/${product.id}`;
            titleLink.className = "cart-item-title";
            titleLink.textContent = product.title;

            const category = document.createElement("span");
            category.className = "cart-item-category";
            category.textContent = capitalizeCategory(product.category);

            const unitPrice = document.createElement("span");
            unitPrice.className = "cart-item-unit-price";
            unitPrice.textContent = `$${product.price.toFixed(2)} each`;

            details.append(titleLink, category, unitPrice);

            // Quantity stepper
            const stepperWrap = document.createElement("div");
            stepperWrap.className = "cart-item-quantity";

            const stepper = document.createElement("div");
            stepper.className = "quantity-stepper";

            const minusBtn = document.createElement("button");
            minusBtn.className = "qty-btn";
            minusBtn.textContent = "−";
            minusBtn.setAttribute("aria-label", `Decrease quantity for ${product.title}`);
            minusBtn.addEventListener("click", () => {
                CartStore.updateQuantity(product.id, quantity - 1);
            });

            const qtyVal = document.createElement("span");
            qtyVal.className = "qty-value";
            qtyVal.textContent = quantity;

            const plusBtn = document.createElement("button");
            plusBtn.className = "qty-btn";
            plusBtn.textContent = "+";
            plusBtn.setAttribute("aria-label", `Increase quantity for ${product.title}`);
            plusBtn.addEventListener("click", () => {
                CartStore.updateQuantity(product.id, quantity + 1);
            });

            stepper.append(minusBtn, qtyVal, plusBtn);
            stepperWrap.appendChild(stepper);

            // Line total
            const lineTotal = document.createElement("div");
            lineTotal.className = "cart-item-total";
            lineTotal.textContent = `$${(product.price * quantity).toFixed(2)}`;

            // Remove button
            const removeBtn = document.createElement("button");
            removeBtn.className = "cart-item-remove";
            removeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;
            removeBtn.setAttribute("aria-label", `Remove ${product.title} from cart`);
            removeBtn.addEventListener("click", () => {
                createModal({
                    title: "Remove Item",
                    message: `Remove "${product.title}" from your cart?`,
                    footerButtons: [
                        { text: "Cancel", variant: "secondary", onClick: (close) => close() },
                        {
                            text: "Remove",
                            variant: "danger",
                            onClick: (close) => {
                                CartStore.removeItem(product.id);
                                showToast({ message: `${product.title} removed from cart`, type: "info" });
                                close();
                            }
                        }
                    ]
                });
            });

            item.append(imgWrap, details, stepperWrap, lineTotal, removeBtn);
            itemsList.appendChild(item);
        });

        // ── Summary sidebar ──
        const summary = document.createElement("div");
        summary.className = "cart-summary";

        const summaryTitle = document.createElement("h2");
        summaryTitle.textContent = "Order Summary";

        const subtotal = CartStore.getTotal();
        const shipping = subtotal >= 50 ? 0 : 5.99;
        const tax = subtotal * 0.08;
        const grandTotal = subtotal + shipping + tax;

        summary.innerHTML = `<h2>Order Summary</h2>`;

        const rows = [
            { label: "Subtotal", value: `$${subtotal.toFixed(2)}` },
            { label: "Shipping", value: shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`, note: shipping === 0 ? "Orders over $50" : null },
            { label: "Est. Tax", value: `$${tax.toFixed(2)}` }
        ];

        rows.forEach(row => {
            const r = document.createElement("div");
            r.className = "summary-row";
            r.innerHTML = `<span>${row.label}</span><span>${row.value}</span>`;
            if (row.note) {
                const note = document.createElement("small");
                note.className = "summary-note";
                note.textContent = row.note;
                r.querySelector("span").appendChild(note);
            }
            summary.appendChild(r);
        });

        const totalRow = document.createElement("div");
        totalRow.className = "summary-row total";
        totalRow.innerHTML = `<span>Total</span><span>$${grandTotal.toFixed(2)}</span>`;
        summary.appendChild(totalRow);

        const checkoutBtn = createButton({
            text: "Proceed to Checkout",
            variant: "primary",
            onClick: () => Router.navigateTo("/checkout")
        });
        checkoutBtn.classList.add("checkout-btn");
        summary.appendChild(checkoutBtn);

        const continueShopping = document.createElement("a");
        continueShopping.href = "#/";
        continueShopping.className = "continue-shopping";
        continueShopping.textContent = "← Continue Shopping";
        summary.appendChild(continueShopping);

        content.append(itemsList, summary);
        page.appendChild(content);
    }

    // Initial render
    render();

    // Re-render on cart changes
    unsubscribe = CartStore.subscribe(() => render());

    // Clean up when navigating away (observer pattern)
    const observer = new MutationObserver(() => {
        if (!document.contains(page)) {
            if (unsubscribe) unsubscribe();
            observer.disconnect();
        }
    });
    observer.observe(container.parentNode || document.body, { childList: true, subtree: true });
}
