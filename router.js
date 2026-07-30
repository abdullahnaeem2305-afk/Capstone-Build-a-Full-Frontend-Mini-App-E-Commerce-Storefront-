/**
 * ============================================================
 * Lightweight Hash-Based SPA Router
 * ------------------------------------------------------------
 * Router.init(routes)      — start listening for hash changes
 * Router.navigateTo(hash)  — programmatic navigation
 *
 * Route format: { path: "/product/:id", handler: (container, params) => {} }
 * ============================================================
 */

const Router = {
    routes: [],
    appContainer: null,
    currentPath: null,

    init(routes) {
        this.routes = routes;
        this.appContainer = document.getElementById("app");
        window.addEventListener("hashchange", () => this.resolve());
        this.resolve();
    },

    resolve() {
        const hash = location.hash.slice(1) || "/";

        // Don't re-render the same route
        if (hash === this.currentPath) return;
        this.currentPath = hash;

        const container = this.appContainer;

        // Exit animation
        container.classList.add("page-exit");

        setTimeout(() => {
            container.innerHTML = "";
            container.classList.remove("page-exit");

            // Match a route
            let matched = false;
            for (const route of this.routes) {
                const params = this._match(route.path, hash);
                if (params !== null) {
                    route.handler(container, params);
                    matched = true;
                    break;
                }
            }

            // Fallback to first route (home)
            if (!matched && this.routes.length) {
                this.routes[0].handler(container, {});
            }

            // Enter animation
            container.classList.add("page-enter");
            container.addEventListener("animationend", () => {
                container.classList.remove("page-enter");
            }, { once: true });

            window.scrollTo({ top: 0, behavior: "smooth" });

            // Update active nav link
            this._updateNav(hash);
        }, 180);
    },

    /** Check if a route pattern matches the hash, return params or null */
    _match(pattern, hash) {
        const pParts = pattern.split("/").filter(Boolean);
        const hParts = hash.split("/").filter(Boolean);

        if (pParts.length !== hParts.length) return null;

        const params = {};
        for (let i = 0; i < pParts.length; i++) {
            if (pParts[i].startsWith(":")) {
                params[pParts[i].slice(1)] = decodeURIComponent(hParts[i]);
            } else if (pParts[i] !== hParts[i]) {
                return null;
            }
        }
        return params;
    },

    /** Highlight the active nav link */
    _updateNav(hash) {
        document.querySelectorAll(".nav-link").forEach(link => {
            const href = link.getAttribute("href")?.replace("#", "") || "/";
            link.classList.toggle("active", href === hash || (hash === "/" && href === "/"));
        });
    },

    navigateTo(hash) {
        location.hash = hash;
    }
};
