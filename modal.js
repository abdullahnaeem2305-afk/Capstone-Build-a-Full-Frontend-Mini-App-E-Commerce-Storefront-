/**
 * ============================================================
 * Reusable Modal Component (Week 5 UI Kit — Extended)
 * ------------------------------------------------------------
 * createModal({
 *   title: "Modal Title",
 *   message: "Modal message body.",       // plain text (optional)
 *   content: HTMLElement,                 // OR custom DOM content
 *   footerButtons: [
 *     { text: "Cancel", variant: "secondary", onClick: (close) => close() },
 *     { text: "Confirm", variant: "primary", onClick: (close) => { ...; close(); } }
 *   ]
 * })
 *
 * Features:
 * - Closes on ESC, outside click, and the close (×) button
 * - Only one modal instance may be open at a time
 * - Fade + scale enter/exit animation
 * - Returns focus to the element that opened it
 * - Supports either a text message or custom HTMLElement content
 * ============================================================
 */

// Tracks whether a modal is currently open so a second call can't stack another one
let activeModalOverlay = null;

function createModal({
    title = "Modal Title",
    message = "Modal message.",
    content = null,
    footerButtons = null
} = {}) {

    // Prevent duplicate modals from piling up on repeated triggers
    if (activeModalOverlay) return;

    const triggerElement = document.activeElement;

    // ---- Structure ----------------------------------------------------

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const header = document.createElement("div");
    header.className = "modal-header";

    const heading = document.createElement("h2");
    heading.id = "modal-title-" + Date.now();
    heading.textContent = title;
    modal.setAttribute("aria-labelledby", heading.id);

    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Close modal");
    closeBtn.addEventListener("click", closeModal);

    header.append(heading, closeBtn);

    // Body: either custom DOM content or a simple paragraph
    let body;
    if (content instanceof HTMLElement) {
        body = content;
    } else {
        body = document.createElement("p");
        body.textContent = message;
    }

    const footer = document.createElement("div");
    footer.className = "modal-footer";

    // Custom footer buttons, or a sensible single "Close" default
    const buttonConfigs = footerButtons || [
        { text: "Close", variant: "secondary", onClick: (close) => close() }
    ];

    buttonConfigs.forEach(({ text: label, variant = "secondary", onClick }) => {
        const btn = createButton({
            text: label,
            variant,
            onClick: () => onClick(closeModal)
        });
        footer.appendChild(btn);
    });

    modal.append(header, body, footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    activeModalOverlay = overlay;

    // Move focus into the dialog for keyboard/screen-reader users
    closeBtn.focus();

    // ---- Interaction ----------------------------------------------------

    // Close when clicking the dimmed backdrop (not the modal itself)
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });

    // Close on ESC
    function escHandler(e) {
        if (e.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", escHandler);

    function closeModal() {
        // Play the reverse animation, then remove from the DOM
        overlay.classList.add("is-closing");
        document.removeEventListener("keydown", escHandler);

        overlay.addEventListener("animationend", () => {
            overlay.remove();
            activeModalOverlay = null;
            // Return focus to whatever opened the modal
            if (triggerElement && typeof triggerElement.focus === "function") {
                triggerElement.focus();
            }
        }, { once: true });
    }
}
