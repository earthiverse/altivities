"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
const SUBSTITUTION_CHAR = "•";
const SENTENCE = document.getElementById("sentence");
const NAVIGATION = document.getElementById("navigation");
const WORDLISTS = [];
async function prepare() {
    if (!PARAMETERS.sentence) {
        throw Error("No sentence found.");
    }
    if (!PARAMETERS.sentence.includes(SUBSTITUTION_CHAR)) {
        throw Error("No substitution character found.");
    }
    let i = 1;
    while (PARAMETERS[`${i}_wordlist`] || PARAMETERS[`${i}_wordlists`]) {
        const wordlist = await prepareWordlist({
            ignore: PARAMETERS[`${i}_ignore`],
            include: PARAMETERS[`${i}_include`],
            wordlist: PARAMETERS[`${i}_wordlist`],
            wordlists: PARAMETERS[`${i}_wordlists`]
        });
        WORDLISTS.push(wordlist);
        i += 1;
    }
    if (WORDLISTS.length == 0) {
        const wordlist = await prepareWordlist();
        WORDLISTS.push(wordlist);
    }
    const addPart = (part) => {
        if (part == "")
            return;
        const toAdd = document.createElement("div");
        toAdd.textContent = part;
        SENTENCE.appendChild(toAdd);
    };
    const addCard = (wordlist_num, hide = false, color) => {
        const wordlist = WORDLISTS[wordlist_num - 1];
        if (!wordlist)
            throw `We are missing '${wordlist_num}_wordlist'`;
        const word = wordlist[randomIntFromInterval(0, wordlist.length - 1)];
        const english = Array.isArray(word.en) ? word.en[0] : word.en;
        const card = document.createElement("div");
        card.classList.add("card");
        if (color) {
            card.style.color = color;
            card.style.borderColor = color;
        }
        else if (wordlist_num == 1) {
            card.classList.add("color_one");
        }
        else if (wordlist_num == 2) {
            card.classList.add("color_two");
        }
        else if (wordlist_num == 3) {
            card.classList.add("color_three");
        }
        const card_inside = document.createElement("div");
        card_inside.classList.add("card-inside");
        if (!hide)
            card_inside.textContent = english;
        card.appendChild(card_inside);
        SENTENCE.appendChild(card);
        textFit(card_inside, { alignHoriz: true, maxFontSize: 32 });
    };
    let part = "";
    i = 1;
    for (const char of PARAMETERS.sentence) {
        if (char == SUBSTITUTION_CHAR) {
            addPart(part);
            addCard(i, PARAMETERS.hide, PARAMETERS[`${i}_color`]);
            part = "";
            i += 1;
        }
        else {
            part = part + char;
        }
    }
    addPart(part);
}
prepare();
