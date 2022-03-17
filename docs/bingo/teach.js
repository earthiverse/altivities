"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parameters = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
});
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}
function drawRandom() {
    const toDraw = document.getElementById("to_draw_area");
    const current = document.getElementById("current_area");
    const drawn = document.getElementById("drawn_area");
    while (current.firstChild)
        drawn.appendChild(current.firstChild);
    const itemsArray = [];
    toDraw.childNodes.forEach((child) => {
        if (child.classList?.contains("item"))
            itemsArray.push(child);
    });
    shuffle(itemsArray);
    current.appendChild(itemsArray[0]);
    checkDraw();
}
function checkDraw() {
    const toDraw = document.getElementById("to_draw_area");
    const drawButton = document.getElementById("draw_card");
    let hasItem = false;
    toDraw.childNodes.forEach((child) => {
        if (child.classList?.contains("item"))
            hasItem = true;
    });
    if (hasItem) {
        drawButton.style.cursor = "pointer";
        drawButton.style.backgroundColor = "var(--ready-yes-color)";
        drawButton.addEventListener("click", drawRandom);
        return true;
    }
    else {
        drawButton.style.cursor = "not-allowed";
        drawButton.style.backgroundColor = "var(--ready-no-color)";
        drawButton.removeEventListener("click", drawRandom);
        return false;
    }
}
async function generateMenuOptions(wordlistURL) {
    const response = await fetch(wordlistURL);
    const wordlist = await response.json();
    const menu = document.getElementById("to_draw_area");
    let num = 0;
    for (const word of wordlist) {
        const itemOutside = document.createElement("div");
        const itemInside = document.createElement("div");
        itemOutside.id = `option${num}`;
        itemOutside.style.order = num.toString();
        itemOutside.classList.add("item");
        itemInside.classList.add("item_inside");
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
        menu.appendChild(itemOutside);
        num += 1;
    }
    checkDraw();
}
if (parameters.wordlist) {
    generateMenuOptions(parameters.wordlist);
}
let RESIZE_FINISHED;
function resize() {
    if (RESIZE_FINISHED)
        clearTimeout(RESIZE_FINISHED);
    RESIZE_FINISHED = setTimeout(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    }, 250);
}
resize();
window.addEventListener("resize", resize);
