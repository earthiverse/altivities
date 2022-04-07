"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PARAMETERS = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
        const parameter = searchParams.get(prop);
        if (parameter)
            return parameter;
    }
});
async function prepareWordlist() {
    const combinedWordlist = [];
    if (PARAMETERS.wordlist) {
        const response = await fetch(PARAMETERS.wordlist);
        const wordlist = await response.json();
        combinedWordlist.push(...wordlist);
    }
    if (PARAMETERS.wordlists) {
        for (const url of PARAMETERS.wordlists.split(",")) {
            const response = await fetch(url);
            const wordlist = await response.json();
            combinedWordlist.push(...wordlist);
        }
    }
    if (PARAMETERS.ignore) {
        const toIgnore = PARAMETERS.ignore.split(",");
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
    if (PARAMETERS.include) {
        const toInclude = PARAMETERS.include.split(",");
        for (let i = 0; i < combinedWordlist.length; i++) {
            const word = combinedWordlist[i];
            let remove = true;
            for (const includeWord of toInclude) {
                if (word.en == includeWord
                    || (Array.isArray(word.en) && word.en[0] == includeWord)) {
                    remove = false;
                    break;
                }
                if (Array.isArray(word.en)) {
                    for (let j = 0; j < word.en.length; j++) {
                        const alternativeWord = word.en[j];
                        if (alternativeWord !== includeWord)
                            continue;
                        word.en = alternativeWord;
                        remove = false;
                        break;
                    }
                }
            }
            if (remove) {
                combinedWordlist.splice(i, 1);
                i -= 1;
            }
        }
    }
    return combinedWordlist;
}
