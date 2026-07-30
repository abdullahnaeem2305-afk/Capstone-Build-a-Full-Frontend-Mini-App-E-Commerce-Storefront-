/**
 * ============================================================
 * App Entry Point — Initializes Store, Routes & Navigation
 * ============================================================
 */

(function initApp() {

    // ── Initialize cart from localStorage ──
    CartStore.init();

    // ── Routes ──
    Router.init([
        { path: "/",              handler: renderHomePage },
        { path: "/product/:id",   handler: renderProductPage },
        { path: "/cart",          handler: renderCartPage },
        { path: "/checkout",      handler: renderCheckoutPage }
    ]);

    // ── Cart badge reactive update ──
    const badge = document.getElementById("cart-badge");
    function updateBadge() {
        const count = CartStore.getCount();
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? "flex" : "none";

            // Bounce animation
            badge.classList.remove("bounce");
            // Force reflow to restart animation
            void badge.offsetWidth;
            badge.classList.add("bounce");
        }
    }
    CartStore.subscribe(updateBadge);
    updateBadge(); // initial state

    // ── Mobile menu toggle ──
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileNav = document.getElementById("mobile-nav");

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener("click", () => {
            const isOpen = mobileNav.classList.toggle("active");
            menuBtn.classList.toggle("active", isOpen);
            menuBtn.setAttribute("aria-expanded", isOpen);
        });

        // Close mobile menu on navigation
        window.addEventListener("hashchange", () => {
            mobileNav.classList.remove("active");
            menuBtn.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");
        });
    }

})();
