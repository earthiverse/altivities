"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PARAMETERS = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
        const parameter = searchParams.get(prop);
        if (parameter)
            return parameter;
    }
});
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
async function prepareWordlist(options = {
    ignore: PARAMETERS.ignore,
    include: PARAMETERS.include,
    wordlist: PARAMETERS.wordlist,
    wordlists: PARAMETERS.wordlists
}) {
    let combinedWordlist = [];
    if (options.wordlist) {
        const response = await fetch(options.wordlist);
        const wordlist = await response.json();
        combinedWordlist.push(...wordlist);
    }
    if (options.wordlists) {
        for (const url of options.wordlists.split(",")) {
            const response = await fetch(url);
            const wordlist = await response.json();
            combinedWordlist.push(...wordlist);
        }
    }
    if (options.ignore) {
        const toIgnore = options.ignore.split(",");
        for (let i = 0; i < combinedWordlist.length; i++) {
            const word = combinedWordlist[i];
            for (const ignoreWord of toIgnore) {
                if (word.en == ignoreWord
                    || (Array.isArray(word.en) && word.en[0] == ignoreWord)) {
                    combinedWordlist.splice(i, 1);
                    i -= 1;
                    break;
                }
            }
        }
    }
    if (options.include) {
        const toInclude = options.include.split(",");
        const newCombined = [];
        while (toInclude.length > 0) {
            const includeWord = toInclude.shift();
            for (const word of combinedWordlist) {
                if (word.en == includeWord
                    || (Array.isArray(word.en) && word.en[0] == includeWord)) {
                    newCombined.push(word);
                    break;
                }
                if (Array.isArray(word.en)) {
                    for (let j = 0; j < word.en.length; j++) {
                        const alternativeWord = word.en[j];
                        if (alternativeWord !== includeWord)
                            continue;
                        word.en = alternativeWord;
                        newCombined.push(word);
                        break;
                    }
                }
            }
        }
        combinedWordlist = newCombined;
    }
    return combinedWordlist;
}
const TO_CHOOSE = new Map();
function chooseNewRandomWord(from) {
    let toChoose = TO_CHOOSE.get(from);
    if (!toChoose || toChoose.length == 0) {
        toChoose = [];
        for (let i = 0; i < from.length; i++)
            toChoose.push(i);
        TO_CHOOSE.set(from, toChoose);
    }
    const randomIndex = randomIntFromInterval(0, toChoose.length - 1);
    return from[toChoose.splice(randomIndex, 1)[0]];
}
