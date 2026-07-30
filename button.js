/**
 * ============================================================
 * Reusable Button Component (Week 5 UI Kit)
 * ------------------------------------------------------------
 * createButton({
 *   text: "Click Me",       // label rendered inside the button
 *   variant: "primary",     // "primary" | "secondary" | "success" | "danger" | "outline"
 *   size: "md",             // "md" | "sm"
 *   onClick: () => {},      // click handler
 *   disabled: false,        // disables interaction + styling
 *   ariaLabel: null         // optional override for screen readers
 * })
 *
 * Returns a <button> HTMLElement ready to be appended anywhere.
 * ============================================================
 */

function createButton({
    text = "Button",
    variant = "primary",
    size = "md",
    onClick = () => {},
    disabled = false,
    ariaLabel = null
} = {}) {

    const button = document.createElement("button");

    // Base + variant + optional size classes
    button.classList.add("btn", `btn-${variant}`);
    if (size === "sm") button.classList.add("btn-sm");

    button.type = "button";
    button.textContent = text;
    button.disabled = disabled;

    // Accessibility: explicit label when the visible text alone
    // wouldn't be descriptive enough (e.g. icon-only buttons)
    if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
    if (disabled) button.setAttribute("aria-disabled", "true");

    button.addEventListener("click", onClick);

    return button;
}
