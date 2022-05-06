"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        console.debug(`Looking for ${word}...`);
        let found = false;
        for (const find of wordlist) {
            console.debug(`Looking in ${find.en}...`);
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
    const combinedWordlist = await prepareWordlist();
    const words = PARAMETERS.words.split("🔥");
    populateBingo(combinedWordlist, words);
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
