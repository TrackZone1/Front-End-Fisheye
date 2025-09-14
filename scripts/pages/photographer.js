async function getPhotographer(id) {
    const response = await fetch("data/photographers.json");
    const data = await response.json();

    return {
        photographer: data.photographers.find((p) => p.id === parseInt(id)),
        media: data.media.filter((m) => m.photographerId === parseInt(id)),
    };
}

function renderHeader(photographer) {
    document.querySelector("#photographerName").textContent = photographer.name;
    document.querySelector(
        "#photographerLocation"
    ).textContent = `${photographer.city}, ${photographer.country}`;
    document.querySelector("#photographerTagline").textContent =
        photographer.tagline;
    const photographerAvatar = document.querySelector("#photographerAvatar");
    photographerAvatar.innerHTML = `<img src="assets/photographers/${photographer.portrait}" alt="${photographer.name}" />`;
    const dailyPrice = document.getElementById("dailyPrice");
    if (dailyPrice) dailyPrice.textContent = photographer.price;
}

function computeTotalLikes(list) {
    return list.reduce((sum, m) => sum + (m.likes || 0), 0);
}

function renderTotalLikes(list) {
    const total = computeTotalLikes(list);
    const totalLikesEl = document.getElementById("totalLikes");
    if (totalLikesEl) totalLikesEl.textContent = total;
}

function mediaTemplate(item) {
    const figure = document.createElement("figure");
    figure.className = "media_card";

    let mediaEl;
    if (item.image) {
        mediaEl = document.createElement("img");
        mediaEl.src = `assets/photographers/media/${item.photographerId}/${item.image}`;
        mediaEl.alt = item.title;
    } else if (item.video) {
        mediaEl = document.createElement("video");
        mediaEl.src = `assets/photographers/media/${item.photographerId}/${item.video}`;
        mediaEl.setAttribute("aria-label", item.title);
        mediaEl.controls = false;
    }
    mediaEl.className = "media_thumb";
    mediaEl.tabIndex = 0;
    mediaEl.setAttribute("role", "button");
    mediaEl.addEventListener("click", () => openLightbox(item));
    mediaEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox(item);
        }
    });
    figure.appendChild(mediaEl);

    const figcaption = document.createElement("figcaption");
    figcaption.className = "media_meta";
    const title = document.createElement("span");
    title.className = "media_title";
    title.textContent = item.title;
    const likeBtn = document.createElement("button");
    likeBtn.className = "like_btn";
    likeBtn.setAttribute("aria-pressed", "false");
    likeBtn.setAttribute("aria-label", `Aimer « ${item.title} »`);
    likeBtn.innerHTML = `<span class="likes_count">${item.likes}</span> <span aria-hidden="true">❤</span>`;
    likeBtn.addEventListener("click", () => {
        const countEl = likeBtn.querySelector(".likes_count");
        const pressed = likeBtn.getAttribute("aria-pressed") === "true";
        const current = parseInt(countEl.textContent) || 0;
        const next = pressed ? current - 1 : current + 1;
        countEl.textContent = next;
        likeBtn.setAttribute("aria-pressed", (!pressed).toString());
        // update total
        const totalLikesEl = document.getElementById("totalLikes");
        if (totalLikesEl) {
            const total = parseInt(totalLikesEl.textContent) || 0;
            totalLikesEl.textContent = pressed ? total - 1 : total + 1;
        }
    });
    figcaption.appendChild(title);
    figcaption.appendChild(likeBtn);
    figure.appendChild(figcaption);
    return figure;
}

function renderGallery(list) {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;
    gallery.innerHTML = "";
    const frag = document.createDocumentFragment();
    list.forEach((m) => frag.appendChild(mediaTemplate(m)));
    gallery.appendChild(frag);
}

function sortMedia(list, key) {
    const copy = [...list];
    switch (key) {
        case "date":
            copy.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case "title":
            copy.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "popularity":
        default:
            copy.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            break;
    }
    return copy;
}

function bindSort(list) {
    const btn = document.getElementById("sortButton");
    const listbox = document.getElementById("sortList");
    const current = document.getElementById("sortCurrent");
    if (!btn || !listbox || !current) return;

    function open() {
        listbox.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        listbox.focus();
    }
    function close() {
        listbox.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
    }
    btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        expanded ? close() : open();
    });

    listbox.addEventListener("click", (e) => {
        const li = e.target.closest('li[role="option"]');
        if (!li) return;
        const value = li.getAttribute("data-value");
        current.textContent = li.textContent.trim();
        listbox
            .querySelectorAll('li[role="option"]')
            .forEach((n) =>
                n.setAttribute("aria-selected", (n === li).toString())
            );
        const sorted = sortMedia(list, value);
        renderGallery(sorted);
        renderTotalLikes(sorted);
        close();
    });

    // Keyboard support
    const options = Array.from(listbox.querySelectorAll('li[role="option"]'));
    let activeIndex = options.findIndex(
        (o) => o.getAttribute("aria-selected") === "true"
    );
    function setActive(i) {
        activeIndex = (i + options.length) % options.length;
        const opt = options[activeIndex];
        options.forEach((o) => o.classList.toggle("active", o === opt));
        listbox.setAttribute("aria-activedescendant", opt.id);
        opt.scrollIntoView({ block: "nearest" });
    }

    btn.addEventListener("keydown", (e) => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        if (
            (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") &&
            !expanded
        ) {
            e.preventDefault();
            open();
            setActive(activeIndex >= 0 ? activeIndex : 0);
        }
    });

    listbox.addEventListener("keydown", (e) => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        if (!expanded) return;
        if (e.key === "Escape") {
            e.preventDefault();
            close();
            btn.focus();
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive(activeIndex + 1);
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive(activeIndex - 1);
        }
        if (e.key === "Home") {
            e.preventDefault();
            setActive(0);
        }
        if (e.key === "End") {
            e.preventDefault();
            setActive(options.length - 1);
        }
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const li = options[activeIndex];
            if (!li) return;
            const value = li.getAttribute("data-value");
            current.textContent = li.textContent.trim();
            options.forEach((n) =>
                n.setAttribute("aria-selected", (n === li).toString())
            );
            const sorted = sortMedia(list, value);
            renderGallery(sorted);
            renderTotalLikes(sorted);
            close();
            btn.focus();
        }
    });
}

async function displayData(photographer, media) {
    renderHeader(photographer);
    const sorted = sortMedia(media, "popularity");
    renderGallery(sorted);
    renderTotalLikes(sorted);
    bindSort(media);
}

async function init() {
    const params = new URLSearchParams(window.location.search);
    const photographerId = params.get("id");

    if (!photographerId) {
        console.error("Aucun ID de photographe trouvé dans l'URL");
        return;
    }

    const { photographer, media } = await getPhotographer(photographerId);
    displayData(photographer, media);
}

init();
