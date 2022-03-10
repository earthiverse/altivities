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
        const option = document.createElement("div");
        option.id = `option${num}`;
        option.classList.add("option");
        option.draggable = true;
        option.addEventListener("dragstart", onDragStart);
        option.style.order = num.toString();
        if (word.image) {
            option.style.backgroundImage = `url('${word.image}')`;
            option.style.backgroundRepeat = "no-repeat";
            option.style.backgroundPosition = "center";
            option.style.backgroundSize = "contain";
        }
        if (Array.isArray(word.en)) {
            option.innerText = word.en[0];
        }
        else {
            option.innerText = word.en;
        }
        select.appendChild(option);
        num += 1;
    }
}
if (parameters.category && parameters.list) {
    generateMenuOptions(`../wordlists/${parameters.category}/${parameters.list}.json`);
}
