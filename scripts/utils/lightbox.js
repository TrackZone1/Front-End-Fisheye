let lbState = {
    items: [],
    index: 0,
    open: false,
    prevFocus: null,
};

function buildItemsFromGallery() {
    const cards = Array.from(document.querySelectorAll("#gallery .media_card"));
    lbState.items = cards.map((card) => {
        const media = card.querySelector(".media_thumb");
        const title = card.querySelector(".media_title")?.textContent || "";
        if (media.tagName.toLowerCase() === "img") {
            return { type: "image", src: media.src, title };
        }
        return { type: "video", src: media.src, title };
    });
}

function renderLightboxContent() {
    const container = document.querySelector("#lightbox .lightbox_content");
    if (!container) return;
    container.innerHTML = "";
    const current = lbState.items[lbState.index];
    if (!current) return;
    let el;
    if (current.type === "image") {
        el = document.createElement("img");
        el.src = current.src;
        el.alt = current.title;
    } else {
        el = document.createElement("video");
        el.src = current.src;
        el.setAttribute("aria-label", current.title);
        el.controls = true;
    }
    const caption = document.createElement("p");
    caption.textContent = current.title;
    caption.className = "lightbox_caption";
    container.appendChild(el);
    container.appendChild(caption);
}

function openLightboxFromIndex(i) {
    lbState.index = i;
    lbState.prevFocus = document.activeElement;
    const overlay = document.getElementById("lightbox");
    if (!overlay) return;
    overlay.style.display = "block";
    overlay.setAttribute("aria-hidden", "false");
    lbState.open = true;
    renderLightboxContent();
    const dialog = overlay.querySelector(".lightbox");
    dialog.focus();
}

function openLightbox(item) {
    buildItemsFromGallery();
    const idx = lbState.items.findIndex((it) =>
        it.src.endsWith(item.image || item.video)
    );
    openLightboxFromIndex(Math.max(0, idx));
}

function closeLightbox() {
    const overlay = document.getElementById("lightbox");
    if (!overlay) return;
    overlay.style.display = "none";
    overlay.setAttribute("aria-hidden", "true");
    lbState.open = false;
    if (lbState.prevFocus) lbState.prevFocus.focus();
}

function nextLightbox() {
    if (!lbState.items.length) return;
    lbState.index = (lbState.index + 1) % lbState.items.length;
    renderLightboxContent();
}

function prevLightbox() {
    if (!lbState.items.length) return;
    lbState.index =
        (lbState.index - 1 + lbState.items.length) % lbState.items.length;
    renderLightboxContent();
}

// Wire controls once DOM ready
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("lightbox");
    if (!overlay) return;
    overlay.addEventListener("click", (e) => {
        if (e.target.id === "lightbox") closeLightbox();
    });
    overlay
        .querySelector(".lightbox_close")
        ?.addEventListener("click", closeLightbox);
    overlay
        .querySelector(".lightbox_next")
        ?.addEventListener("click", nextLightbox);
    overlay
        .querySelector(".lightbox_prev")
        ?.addEventListener("click", prevLightbox);

    document.addEventListener("keydown", (e) => {
        if (!lbState.open) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextLightbox();
        if (e.key === "ArrowLeft") prevLightbox();

        // Trap focus within dialog
        if (e.key === "Tab") {
            const overlay = document.getElementById("lightbox");
            const dialog = overlay.querySelector(".lightbox");
            const focusables = dialog.querySelectorAll(
                "button, [href], [tabindex]:not([tabindex='-1'])"
            );
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
});
