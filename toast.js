/**
 * ============================================================
 * Reusable Toast Component (Week 5 UI Kit)
 * ------------------------------------------------------------
 * showToast({
 *   message: "Notification text",
 *   type: "info",       // "success" | "danger" | "warning" | "info"
 *   duration: 3000       // ms before auto-dismiss
 * })
 *
 * Features:
 * - Stacks multiple toasts vertically
 * - Auto-dismisses with a visible progress bar
 * - Manual close button
 * - Announced to assistive tech via aria-live
 * ============================================================
 */

const TOAST_ICONS = {
    success: "✓",
    danger: "!",
    warning: "!",
    info: "i"
};

const TOAST_LABELS = {
    success: "Success",
    danger: "Error",
    warning: "Warning",
    info: "Info"
};

// Lazily created so the script can be loaded in <head> or anywhere
let _toastContainer = null;

function _getToastContainer() {
    if (!_toastContainer) {
        _toastContainer = document.createElement("div");
        _toastContainer.className = "toast-container";
        _toastContainer.setAttribute("role", "status");
        _toastContainer.setAttribute("aria-live", "polite");
        document.body.appendChild(_toastContainer);
    }
    return _toastContainer;
}

function showToast({
    message = "Notification",
    type = "info",
    duration = 3500
} = {}) {

    const container = _getToastContainer();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    // Icon badge
    const icon = document.createElement("div");
    icon.className = "toast-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = TOAST_ICONS[type] || TOAST_ICONS.info;

    // Text body: bold label + message
    const body = document.createElement("div");
    body.className = "toast-body";

    const titleEl = document.createElement("div");
    titleEl.className = "toast-title";
    titleEl.textContent = TOAST_LABELS[type] || TOAST_LABELS.info;

    const messageEl = document.createElement("div");
    messageEl.className = "toast-message";
    messageEl.textContent = message;

    body.append(titleEl, messageEl);

    // Manual close
    const closeBtn = document.createElement("button");
    closeBtn.className = "toast-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Dismiss notification");
    closeBtn.addEventListener("click", removeToast);

    // Auto-dismiss progress indicator
    const progress = document.createElement("div");
    progress.className = "toast-progress";
    progress.style.animationDuration = `${duration}ms`;

    toast.append(icon, body, closeBtn, progress);
    container.appendChild(toast);

    const timer = setTimeout(removeToast, duration);

    function removeToast() {
        clearTimeout(timer);
        toast.classList.add("is-leaving");

        toast.addEventListener("animationend", () => {
            toast.remove();
        }, { once: true });
    }
}
