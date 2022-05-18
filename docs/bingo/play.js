"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PLAY_AREA = document.getElementById("play_area");
const AREA_3_BY_3 = document.getElementById("bingo_area_3");
const AREA_4_BY_4 = document.getElementById("bingo_area_4");
const AREA_5_BY_5 = document.getElementById("bingo_area_5");
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
            if (Array.isArray(find.en)) {
                if (!find.en.includes(word))
                    continue;
            }
            else if (find.en !== word)
                continue;
            const itemOutside = document.createElement("div");
            const itemInside = document.createElement("div");
            itemOutside.id = `option${num}`;
            itemOutside.classList.add("item");
            itemInside.classList.add("item_inside");
            if (find.image) {
                itemOutside.style.backgroundImage = `url('${find.image}')`;
                itemOutside.style.backgroundRepeat = "no-repeat";
                itemOutside.style.backgroundPosition = "center";
                itemOutside.style.backgroundSize = "contain";
            }
            itemInside.innerText = word;
            itemOutside.appendChild(itemInside);
            const cell = document.getElementById(`cell${num}`);
            cell.appendChild(itemOutside);
            textFit(itemInside, { alignHoriz: true });
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
    if (PARAMETERS["4x4"]) {
        PLAY_AREA.removeChild(AREA_3_BY_3);
        PLAY_AREA.removeChild(AREA_5_BY_5);
        AREA_4_BY_4.style.display = "flex";
    }
    else if (PARAMETERS["5x5"]) {
        PLAY_AREA.removeChild(AREA_3_BY_3);
        PLAY_AREA.removeChild(AREA_4_BY_4);
        AREA_5_BY_5.style.display = "flex";
    }
    else {
        PLAY_AREA.removeChild(AREA_4_BY_4);
        PLAY_AREA.removeChild(AREA_5_BY_5);
        AREA_3_BY_3.style.display = "flex";
    }
    const combinedWordlist = await prepareWordlist();
    const words = PARAMETERS.words.split("🔥");
    populateBingo(combinedWordlist, words);
    if (PARAMETERS.title) {
        const playArea = document.getElementById("play_area");
        const title = document.createElement("div");
        title.classList.add("break");
        title.style.fontSize = "3vh";
        title.innerText = PARAMETERS.title;
        playArea.prepend(title);
    }
}
prepare();
function fitTextForAllCards() {
    const cards = document.getElementsByClassName("item_inside");
    for (let i = 0; i < cards.length; i++) {
        const inside = cards.item(i);
        textFit(inside, { alignHoriz: true });
    }
}
let RESIZE_FINISHED;
function resize() {
    if (RESIZE_FINISHED)
        clearTimeout(RESIZE_FINISHED);
    RESIZE_FINISHED = setTimeout(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
        fitTextForAllCards();
    }, 250);
}
resize();
window.addEventListener("resize", resize);
