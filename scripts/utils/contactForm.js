let previouslyFocused;
let prevBodyOverflow;

function setPhotographerNameInModal() {
    const nameEl = document.querySelector("#photographerName");
    const target = document.querySelector("#contact_modal_name");
    if (nameEl && target) {
        target.textContent = nameEl.textContent || "";
    }
}

function getFocusableElements(container) {
    return container.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
}

function displayModal() {
    const modal = document.getElementById("contact_modal");
    if (!modal) return;
    setPhotographerNameInModal();

    previouslyFocused = document.activeElement;
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");

    // lock background scroll
    prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = modal.querySelector(".modal");
    const focusables = getFocusableElements(dialog);
    if (focusables.length) focusables[0].focus();

    // ESC to close
    document.addEventListener("keydown", onKeyDown);

    // Click outside to close
    modal.addEventListener("click", onOverlayClick);
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    if (!modal) return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");

    // restore focus
    if (previouslyFocused) previouslyFocused.focus();

    // unlock background scroll
    document.body.style.overflow = prevBodyOverflow || "";

    document.removeEventListener("keydown", onKeyDown);
    modal.removeEventListener("click", onOverlayClick);
}

function onOverlayClick(e) {
    if (e.target && e.target.id === "contact_modal") closeModal();
}

function onKeyDown(e) {
    if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
    }
    // trap Tab inside dialog
    const modal = document.getElementById("contact_modal");
    const dialog = modal.querySelector(".modal");
    const focusables = Array.from(getFocusableElements(dialog));
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const payload = Object.fromEntries(data.entries());
        console.log("Contact form submitted:", payload);
        closeModal();
        form.reset();
    });
});
