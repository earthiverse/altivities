"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parameters = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
        const parameter = searchParams.get(prop);
        if (parameter)
            return parameter;
    }
});
function onMouseDown(event) {
    const target = event.currentTarget;
    if (target.classList.contains("marked")) {
        target.lastChild.remove();
        target.classList.remove("marked");
    }
    else {
        const marked = new Image();
        marked.src = "images/marked.png";
        target.appendChild(marked);
        target.classList.add("marked");
    }
}
function populateBingo(wordlist, words) {
    let num = 0;
    for (const word of words) {
        let found = false;
        for (const find of wordlist) {
            let thisWord;
            if (Array.isArray(find.en)) {
                thisWord = find.en[0];
            }
            else {
                thisWord = find.en;
            }
            if (thisWord !== word)
                continue;
            const itemOutside = document.createElement("div");
            const itemInside = document.createElement("div");
            itemOutside.id = `option${num}`;
            itemOutside.classList.add("item");
            itemInside.classList.add("item_inside");
            if (find.image) {
                itemInside.style.backgroundImage = `url('${find.image}')`;
                itemInside.style.backgroundRepeat = "no-repeat";
                itemInside.style.backgroundPosition = "center";
                itemInside.style.backgroundSize = "contain";
            }
            itemInside.innerText = thisWord;
            itemOutside.appendChild(itemInside);
            const cell = document.getElementById(`cell${num}`);
            cell.appendChild(itemOutside);
            found = true;
            num += 1;
            break;
        }
        if (!found) {
            throw `We didn't find the word ${word}!`;
        }
    }
}
async function prepare() {
    const combinedWordlist = [];
    if (parameters.wordlist && parameters.words) {
        const response = await fetch(parameters.wordlist);
        const wordlist = await response.json();
        combinedWordlist.push(...wordlist);
    }
    if (parameters.wordlists && parameters.words) {
        for (const url of parameters.wordlists.split(",")) {
            const response = await fetch(url);
            const wordlist = await response.json();
            combinedWordlist.push(...wordlist);
        }
    }
    const words = parameters.words.split("🔥");
    populateBingo(combinedWordlist, words);
}
prepare();
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
