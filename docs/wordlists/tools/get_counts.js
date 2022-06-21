"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wordlists_js_1 = require("../wordlists.js");
const WORDLIST_WITH_COUNTS = {};
async function run() {
    for (const categoryName in wordlists_js_1.WORDLISTS) {
        const category = wordlists_js_1.WORDLISTS[categoryName];
        WORDLIST_WITH_COUNTS[categoryName] = {};
        for (const subcategoryName in category) {
            WORDLIST_WITH_COUNTS[categoryName][subcategoryName] = [];
            const subcategory = category[subcategoryName];
            for (const wordlist of subcategory) {
                console.log(`Fetching ${categoryName} - ${subcategoryName} - ${wordlist.name}...`);
                try {
                    const prepared = await (0, wordlists_js_1.prepareWordlist)({
                        ignore: wordlist.ignore?.join(","),
                        include: wordlist.include?.join(","),
                        wordlist: undefined,
                        wordlists: wordlist.wordlists?.join(",")
                    });
                    console.log(`  Fetched! ${prepared.length} words!`);
                    if (wordlist.include && wordlist.include.length !== prepared.length)
                        throw "The number of words in `include` does not equal the length of the wordlist!";
                    WORDLIST_WITH_COUNTS[categoryName][subcategoryName].push({
                        ignore: wordlist.ignore,
                        include: wordlist.include,
                        name: wordlist.name,
                        notes: wordlist.notes,
                        num_cards: prepared.length,
                        wordlists: wordlist.wordlists
                    });
                }
                catch (e) {
                    console.error(`  Error! ${e}`);
                    console.debug(JSON.stringify(wordlist, null, 4));
                    return;
                }
            }
        }
    }
    console.log(JSON.stringify(WORDLIST_WITH_COUNTS, null, 4));
}
run();
