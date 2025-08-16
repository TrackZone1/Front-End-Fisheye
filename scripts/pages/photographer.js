async function getPhotographer(id) {
    const response = await fetch("data/photographers.json");
    const data = await response.json();

    // et bien retourner le tableau photographers seulement une fois récupéré
    return {
        photographer: data.photographers.find((p) => p.id === parseInt(id)),
        media: data.media.filter((m) => m.photographerId === parseInt(id)),
    };
}

async function displayData(photographer) {
    console.log(photographer);
    const photographerSection = document.querySelector(".photographer_section");

    document.querySelector("#photographerName").textContent = photographer.name;
    document.querySelector(
        "#photographerLocation"
    ).textContent = `${photographer.city}, ${photographer.country}`;
    document.querySelector("#photographerTagline").textContent =
        photographer.tagline;
    const photographerAvatar = document.querySelector("#photographerAvatar");
    photographerAvatar.innerHTML = `<img src="assets/photographers/${photographer.portrait}" alt="${photographer.name}" />`;
}

async function init() {
    const params = new URLSearchParams(window.location.search);
    const photographerId = params.get("id");

    console.log(photographerId);

    if (!photographerId) {
        console.error("Aucun ID de photographe trouvé dans l'URL");
        return;
    }

    const { photographer } = await getPhotographer(photographerId);
    displayData(photographer);
}

init();
