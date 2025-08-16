async function getPhotographer(id) {
    const response = await fetch("data/photographers.json");
    const data = await response.json();

    // et bien retourner le tableau photographers seulement une fois récupéré
    return {
        photographer: data.photographers.find((p) => p.id === parseInt(id)),
    };
}

async function displayData(photographer) {
    console.log(photographer);
}

async function init() {
    const params = new URLSearchParams(window.location.search);
    const photographerId = params.get("id");

    if (!photographerId) {
        console.error("Aucun ID de photographe trouvé dans l'URL");
        return;
    }

    const { photographer } = await getPhotographer(photographerId);
    displayData(photographer);
}

init();
