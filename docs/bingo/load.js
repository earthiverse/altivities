"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parameters = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
});
async function generateMenuOptions(wordlistURL) {
    const response = await fetch(wordlistURL);
    const wordlist = await response.json();
    console.log(wordlist);
    const select = document.getElementById("select");
    let num = 1;
    for (const word of wordlist) {
        const itemOutside = document.createElement("div");
        const itemInside = document.createElement("div");
        itemOutside.id = `option${num}`;
        itemOutside.draggable = true;
        itemOutside.addEventListener("dragstart", onDragStart);
        itemOutside.style.order = num.toString();
        itemOutside.classList.add("item");
        itemInside.classList.add("itemInside");
        if (word.image) {
            itemInside.style.backgroundImage = `url('${word.image}')`;
            itemInside.style.backgroundRepeat = "no-repeat";
            itemInside.style.backgroundPosition = "center";
            itemInside.style.backgroundSize = "contain";
        }
        if (Array.isArray(word.en)) {
            itemInside.innerText = word.en[0];
        }
        else {
            itemInside.innerText = word.en;
        }
        itemOutside.appendChild(itemInside);
        select.appendChild(itemOutside);
        num += 1;
    }
}
if (parameters.category && parameters.list) {
    generateMenuOptions(`../wordlists/${parameters.category}/${parameters.list}.json`);
}
