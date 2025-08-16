function photographerTemplate(data) {
    const { id, name, city, country, tagline, price, portrait } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement("article");
        article.setAttribute("data-id", id);
        const img = document.createElement("img");
        img.setAttribute("src", picture);
        img.setAttribute("alt", name);
        const h2 = document.createElement("h2");
        h2.textContent = name;
        article.appendChild(img);
        article.appendChild(h2);
        const p = document.createElement("p");
        p.textContent = `${city}, ${country}`;
        article.appendChild(p);
        const span = document.createElement("span");
        span.textContent = tagline;
        article.appendChild(span);
        const smallPrice = document.createElement("small");
        smallPrice.textContent = `${price}€/jour`;
        article.appendChild(smallPrice);

        return article;
    }
    return { name, picture, getUserCardDOM };
}
