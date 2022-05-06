"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
const SUBSTITUTION_CHAR = "•";
const TEXT_FIT_OPTIONS = { alignHoriz: true, maxFontSize: 32 };
const SENTENCE = document.getElementById("sentence");
const NAVIGATION = document.getElementById("navigation");
const QRCODE = document.getElementById("qrcode");
const WORDLISTS = [];
function clearSentence() {
    while (SENTENCE.firstChild)
        SENTENCE.removeChild(SENTENCE.firstChild);
}
function generateSentence() {
    clearSentence();
    const addPart = (part) => {
        if (part == "")
            return;
        const toAdd = document.createElement("div");
        toAdd.textContent = part;
        toAdd.style.whiteSpace = "nowrap";
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
        if (word.image) {
            card.style.backgroundImage = `url('${word.image}')`;
            card.style.backgroundRepeat = "no-repeat";
            card.style.backgroundPosition = "center";
            card.style.backgroundSize = "contain";
        }
        card.appendChild(card_inside);
        SENTENCE.appendChild(card);
        textFit(card_inside, TEXT_FIT_OPTIONS);
    };
    let part = "";
    let i = 1;
    for (const char of PARAMETERS.sentence) {
        if (char == SUBSTITUTION_CHAR) {
            addPart(part);
            addCard(i, PARAMETERS.hide, PARAMETERS[`${i}_color`]);
            part = "";
            i += 1;
        }
        else if ([".", "!", "?"].includes(char)) {
            addPart(part + char);
            part = "";
        }
        else {
            part = part + char;
        }
    }
    addPart(part);
}
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
    generateSentence();
}
prepare();
function showQR() {
    while (QRCODE.firstChild)
        QRCODE.removeChild(QRCODE.firstChild);
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.75;
    new QRCode(QRCODE, {
        text: window.location.href,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctionLevel: QRCode.CorrectLevel.L
    });
    QRCODE.style.display = "flex";
    QRCODE.addEventListener("click", () => {
        QRCODE.style.display = "none";
    });
}
function fitTextForAllCards() {
    const cards = document.getElementsByClassName("card-inside");
    for (let i = 0; i < cards.length; i++) {
        const inside = cards.item(i);
        textFit(inside, TEXT_FIT_OPTIONS);
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
        if (QRCODE.style.display && QRCODE.style.display !== "none") {
            console.log(QRCODE.style.display);
            showQR();
        }
    }, 250);
}
resize();
window.addEventListener("resize", resize);
