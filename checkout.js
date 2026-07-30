/**
 * ============================================================
 * Checkout Page — Summary + Form (no real payment)
 * ============================================================
 */

function renderCheckoutPage(container) {
    const items = CartStore.getItems();

    // Redirect if cart is empty
    if (items.length === 0) {
        Router.navigateTo("/cart");
        return;
    }

    const page = document.createElement("div");
    page.className = "page container checkout-page";
    container.appendChild(page);

    const heading = document.createElement("h1");
    heading.textContent = "Checkout";

    const grid = document.createElement("div");
    grid.className = "checkout-grid";

    // ═══════════════════════════════════════════════════════════
    // LEFT: Form
    // ═══════════════════════════════════════════════════════════
    const formCol = document.createElement("div");
    formCol.className = "checkout-form-col";

    const form = document.createElement("form");
    form.className = "checkout-form";
    form.noValidate = true;

    // Contact section
    form.innerHTML = `
        <div class="form-section">
            <h2>Contact Information</h2>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label" for="checkout-fname">First Name</label>
                    <input class="form-input" type="text" id="checkout-fname" name="fname" required autocomplete="given-name" />
                    <span class="form-error" id="error-fname"></span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="checkout-lname">Last Name</label>
                    <input class="form-input" type="text" id="checkout-lname" name="lname" required autocomplete="family-name" />
                    <span class="form-error" id="error-lname"></span>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" for="checkout-email">Email Address</label>
                <input class="form-input" type="email" id="checkout-email" name="email" required autocomplete="email" placeholder="you@example.com" />
                <span class="form-error" id="error-email"></span>
            </div>
        </div>

        <div class="form-section">
            <h2>Shipping Address</h2>
            <div class="form-group">
                <label class="form-label" for="checkout-address">Street Address</label>
                <input class="form-input" type="text" id="checkout-address" name="address" required autocomplete="street-address" />
                <span class="form-error" id="error-address"></span>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label" for="checkout-city">City</label>
                    <input class="form-input" type="text" id="checkout-city" name="city" required autocomplete="address-level2" />
                    <span class="form-error" id="error-city"></span>
                </div>
                <div class="form-group">
                    <label class="form-label" for="checkout-zip">ZIP / Postal Code</label>
                    <input class="form-input" type="text" id="checkout-zip" name="zip" required autocomplete="postal-code" />
                    <span class="form-error" id="error-zip"></span>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h2>Payment</h2>
            <div class="payment-placeholder">
                <div class="payment-icon">🔒</div>
                <p>This is a demo storefront. No real payment will be processed.</p>
            </div>
        </div>
    `;

    const submitBtn = createButton({
        text: `Place Order · $${(CartStore.getTotal() + (CartStore.getTotal() >= 50 ? 0 : 5.99) + CartStore.getTotal() * 0.08).toFixed(2)}`,
        variant: "success",
        onClick: () => {} // overridden by form submit
    });
    submitBtn.type = "submit";
    submitBtn.classList.add("place-order-btn");
    form.appendChild(submitBtn);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateForm(form)) {
            // Show success modal
            const successContent = document.createElement("div");
            successContent.className = "order-success";
            successContent.innerHTML = `
                <div class="success-icon">🎉</div>
                <p class="success-msg">Your order has been placed successfully!</p>
                <p class="success-detail">A confirmation email will be sent to <strong>${form.email.value}</strong></p>
            `;

            createModal({
                title: "Order Confirmed!",
                content: successContent,
                footerButtons: [
                    {
                        text: "Continue Shopping",
                        variant: "primary",
                        onClick: (close) => {
                            CartStore.clear();
                            close();
                            Router.navigateTo("/");
                            showToast({ message: "Thank you for your order!", type: "success", duration: 4000 });
                        }
                    }
                ]
            });
        }
    });

    formCol.appendChild(form);

    // ═══════════════════════════════════════════════════════════
    // RIGHT: Order Summary
    // ═══════════════════════════════════════════════════════════
    const summaryCol = document.createElement("div");
    summaryCol.className = "checkout-summary-col";

    const summaryCard = document.createElement("div");
    summaryCard.className = "order-summary";

    const summaryTitle = document.createElement("h2");
    summaryTitle.textContent = `Order Summary (${CartStore.getCount()} items)`;
    summaryCard.appendChild(summaryTitle);

    // Item list
    const orderItems = document.createElement("div");
    orderItems.className = "order-items";

    items.forEach(({ product, quantity }) => {
        const item = document.createElement("div");
        item.className = "order-item";

        const thumb = document.createElement("img");
        thumb.className = "order-item-thumb";
        thumb.src = product.image;
        thumb.alt = product.title;

        const info = document.createElement("div");
        info.className = "order-item-info";

        const name = document.createElement("span");
        name.className = "order-item-name";
        name.textContent = product.title;

        const qty = document.createElement("span");
        qty.className = "order-item-qty";
        qty.textContent = `Qty: ${quantity}`;

        info.append(name, qty);

        const linePrice = document.createElement("span");
        linePrice.className = "order-item-price";
        linePrice.textContent = `$${(product.price * quantity).toFixed(2)}`;

        item.append(thumb, info, linePrice);
        orderItems.appendChild(item);
    });

    summaryCard.appendChild(orderItems);

    // Price breakdown
    const subtotal = CartStore.getTotal();
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + shipping + tax;

    const breakdown = document.createElement("div");
    breakdown.className = "price-breakdown";
    breakdown.innerHTML = `
        <div class="price-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="price-row"><span>Shipping</span><span>${shipping === 0 ? "Free ✓" : "$" + shipping.toFixed(2)}</span></div>
        <div class="price-row"><span>Est. Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
        <div class="price-row total"><span>Total</span><span>$${grandTotal.toFixed(2)}</span></div>
    `;
    summaryCard.appendChild(breakdown);

    const backLink = document.createElement("a");
    backLink.href = "#/cart";
    backLink.className = "continue-shopping";
    backLink.textContent = "← Edit Cart";
    summaryCard.appendChild(backLink);

    summaryCol.appendChild(summaryCard);

    grid.append(formCol, summaryCol);
    page.append(heading, grid);
}

/* ── Form Validation ─────────────────────────────────────── */

function validateForm(form) {
    let valid = true;

    const rules = [
        { name: "fname",   label: "First name",     test: v => v.trim().length >= 2 },
        { name: "lname",   label: "Last name",      test: v => v.trim().length >= 2 },
        { name: "email",   label: "Email",           test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        { name: "address", label: "Street address",  test: v => v.trim().length >= 5 },
        { name: "city",    label: "City",             test: v => v.trim().length >= 2 },
        { name: "zip",     label: "ZIP code",         test: v => v.trim().length >= 3 }
    ];

    // Clear previous errors
    form.querySelectorAll(".form-input").forEach(input => input.classList.remove("error"));
    form.querySelectorAll(".form-error").forEach(el => el.textContent = "");

    rules.forEach(({ name, label, test }) => {
        const input = form.querySelector(`[name="${name}"]`);
        const errorEl = form.querySelector(`#error-${name}`);
        if (input && !test(input.value)) {
            input.classList.add("error");
            if (errorEl) errorEl.textContent = `Please enter a valid ${label.toLowerCase()}`;
            valid = false;
        }
    });

    return valid;
}
