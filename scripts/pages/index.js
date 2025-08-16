async function getPhotographers() {
    // Ceci est un exemple de données pour avoir un affichage de photographes de test dès le démarrage du projet,
    // mais il sera à remplacer avec une requête sur le fichier JSON en utilisant "fetch".

    const response = await fetch("data/photographers.json");
    const data = await response.json();
    photographers = data.photographers;

    // et bien retourner le tableau photographers seulement une fois récupéré
    return {
        photographers: data.photographers,
    };
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(
        ".photographer_section"
    );

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    displayData(photographers);
}

init();
