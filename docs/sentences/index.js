"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SUBSTITUTION_CHAR = "•";
const SUBSTITUTION_NUMBERS_1 = ["①", "②", "③", "④", "⑤"];
const SUBSTITUTION_NUMBERS_2 = ["❶", "❷", "❸", "❹", "❺"];
const SUBSTITUTION_NUMBERS_3 = ["⓵", "⓶", "⓷", "⓸", "⓹"];
const SUBSTITUTION_NUMBERS_4 = ["⑴", "⑵", "⑶", "⑷", "⑸"];
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
    const addBreak = () => {
        const toAdd = document.createElement("div");
        toAdd.classList.add("break");
        SENTENCE.appendChild(toAdd);
    };
    const substitutions = new Map();
    const addCard = (wordlist_num, replace_num, hide = false, color) => {
        const wordlist = WORDLISTS[wordlist_num - 1];
        if (!wordlist)
            throw `We are missing '${wordlist_num}_wordlist'`;
        let previous = substitutions.get(wordlist_num);
        let word;
        let english;
        if (previous && previous.has(replace_num)) {
            word = previous.get(replace_num);
            english = Array.isArray(word.en) ? word.en[0] : word.en;
        }
        else {
            word = chooseNewRandomWord(wordlist);
            if (!previous) {
                previous = new Map();
                substitutions.set(wordlist_num, previous);
            }
            else {
                if (previous.size < wordlist.length) {
                    for (const [, other_word] of previous) {
                        if (other_word == word) {
                            return addCard(wordlist_num, replace_num, hide, color);
                        }
                    }
                }
            }
            previous.set(replace_num, word);
            english = Array.isArray(word.en) ? word.en[0] : word.en;
        }
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
        else if (wordlist_num == 4) {
            card.classList.add("color_four");
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
            addCard(i, 0, PARAMETERS.hide, PARAMETERS[`${i}_color`]);
            part = "";
            i += 1;
        }
        else if (SUBSTITUTION_NUMBERS_1.includes(char)) {
            const index = SUBSTITUTION_NUMBERS_1.indexOf(char) + 1;
            addPart(part);
            addCard(index, 1, PARAMETERS.hide, PARAMETERS[`${index}_color`]);
            part = "";
        }
        else if (SUBSTITUTION_NUMBERS_2.includes(char)) {
            const index = SUBSTITUTION_NUMBERS_2.indexOf(char) + 1;
            addPart(part);
            addCard(index, 2, PARAMETERS.hide, PARAMETERS[`${index}_color`]);
            part = "";
        }
        else if (SUBSTITUTION_NUMBERS_3.includes(char)) {
            const index = SUBSTITUTION_NUMBERS_3.indexOf(char) + 1;
            addPart(part);
            addCard(index, 3, PARAMETERS.hide, PARAMETERS[`${index}_color`]);
            part = "";
        }
        else if (SUBSTITUTION_NUMBERS_4.includes(char)) {
            const index = SUBSTITUTION_NUMBERS_4.indexOf(char) + 1;
            addPart(part);
            addCard(index, 4, PARAMETERS.hide, PARAMETERS[`${index}_color`]);
            part = "";
        }
        else if ([".", "!", "?"].includes(char)) {
            addPart(part + char);
            part = "";
        }
        else if (char == "\n") {
            addPart(part);
            addBreak();
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
        window.location.replace("https://github.com/earthiverse/altivities/tree/main/source/sentences/#Examples=");
        return;
    }
    if (!PARAMETERS.sentence.includes(SUBSTITUTION_CHAR)) {
        let hasNumber = false;
        for (const substitutions of [SUBSTITUTION_NUMBERS_1, SUBSTITUTION_NUMBERS_2, SUBSTITUTION_NUMBERS_3, SUBSTITUTION_NUMBERS_4]) {
            for (const number of substitutions) {
                if (PARAMETERS.sentence.includes(number)) {
                    hasNumber = true;
                    break;
                }
            }
            if (hasNumber)
                break;
        }
        if (!hasNumber) {
            throw Error("No substitution character found.");
        }
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
        if (wordlist.length > 0)
            WORDLISTS.push(wordlist);
    }
    if (WORDLISTS.length == 0) {
        window.location.replace("https://github.com/earthiverse/altivities/tree/main/source/sentences#examples=");
        return;
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
