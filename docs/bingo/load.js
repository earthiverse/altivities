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
        const image = await new Promise((resolve) => {
            const preload = new Image();
            preload.addEventListener("load", () => resolve(preload));
            preload.addEventListener("error", () => resolve(undefined));
            preload.src = word.image;
        });
        let text;
        if (Array.isArray(word.en)) {
            text = document.createTextNode(word.en[0]);
        }
        else {
            text = document.createTextNode(word.en);
        }
        if (image) {
            option.appendChild(image);
        }
        option.appendChild(text);
        select.appendChild(option);
        num += 1;
    }
}
if (parameters.category && parameters.list) {
    generateMenuOptions(`../wordlists/${parameters.category}/${parameters.list}.json`);
}
