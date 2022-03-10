"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parameters = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
});
async function populateBingo(wordlistURL, words) {
    const response = await fetch(wordlistURL);
    const wordlist = await response.json();
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
            itemInside.classList.add("itemInside");
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
            throw `We didn't find the word ${word} in ${wordlistURL}.`;
        }
    }
}
if (parameters.category && parameters.list && parameters.words) {
    const words = parameters.words.split("🔥");
    populateBingo(`../wordlists/${parameters.category}/${parameters.list}.json`, words);
}
