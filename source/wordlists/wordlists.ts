/* eslint-disable @typescript-eslint/no-unused-vars */

// Wordlist
export type Languages =
    | "en"
    | "ja"

export type Word = {
    [T in Exclude<Languages, "ja">]: string | string[]
} & {
    audio?: string
    image?: string
    ja: {
        kanji: string
        hiragana: string
    } | {
        kanji: string
        hiragana: string
    }[]
}

export type Wordlist = Word[]

const PARAMETERS: any = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop: string) => {
        const parameter = searchParams.get(prop)
        if (parameter) return parameter
    }
})


/*******************************************************************************
*** Helpers *******************************************************************/
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/*******************************************************************************
*** Wordlist Functionality ****************************************************/
async function prepareWordlist(options = {
    ignore: PARAMETERS.ignore as string,
    include: PARAMETERS.include as string,
    wordlist: PARAMETERS.wordlist as string,
    wordlists: PARAMETERS.wordlists as string
}): Promise<Wordlist> {
    let combinedWordlist: Wordlist = []

    if (options.wordlist) {
        // Add the one wordlist to the menu
        const response = await fetch(options.wordlist)
        const wordlist: Wordlist = await response.json()
        combinedWordlist.push(...wordlist)
    }

    if (options.wordlists) {
        // Combine all wordlists
        for (const url of options.wordlists.split(",")) {
            const response = await fetch(url)
            const wordlist: Wordlist = await response.json()
            combinedWordlist.push(...wordlist)
        }
    }

    if (options.ignore) {
        const toIgnore: string[] = options.ignore.split(",")
        for (let i = 0; i < combinedWordlist.length; i++) {
            const word = combinedWordlist[i]
            for (const ignoreWord of toIgnore) {
                if (word.en == ignoreWord
                    || (Array.isArray(word.en) && word.en[0] == ignoreWord)) {
                    // Remove this word from the wordlist
                    combinedWordlist.splice(i, 1)
                    i -= 1
                    break
                }
            }
        }
    }

    if (options.include) {
        const toInclude: string[] = options.include.split(",")
        const newCombined: Wordlist = []
        while (toInclude.length > 0) {
            // Get the word to include
            const includeWord = toInclude.shift()

            // Look for it in our wordlists
            let found = false
            for (const word of combinedWordlist) {
                if (word.en == includeWord
                    || (Array.isArray(word.en) && word.en[0] == includeWord)) {
                    // Add this word
                    newCombined.push(word)
                    found = true
                    break
                }

                // Check if it's an alternative word
                if (Array.isArray(word.en)) {
                    for (let j = 0; j < word.en.length; j++) {
                        const alternativeWord = word.en[j]
                        if (alternativeWord !== includeWord) continue
                        // We found the word as an alternative, set it as the main word
                        word.en = alternativeWord
                        newCombined.push(word)
                        found = true
                        break
                    }
                }
            }

            if (!found) {
                newCombined.push({
                    en: includeWord,
                    ja: {
                        hiragana: "???",
                        kanji: "???"
                    }
                })
            }
        }

        // Use the include words only
        combinedWordlist = newCombined
    }

    return combinedWordlist
}

const TO_CHOOSE = new Map<Wordlist, number[]>()
function chooseNewRandomWord(from: Wordlist): Word {
    let toChoose = TO_CHOOSE.get(from)
    if (!toChoose || toChoose.length == 0) {
        // Repopulate the choices for this wordlist
        toChoose = []
        for (let i = 0; i < from.length; i++) toChoose.push(i)
        TO_CHOOSE.set(from, toChoose)
    }

    // Choose an index that we haven't chose before, then remove it from future choices
    // and return the word it corresponds with
    const randomIndex = randomIntFromInterval(0, toChoose.length - 1)
    return from[toChoose.splice(randomIndex, 1)[0]]
}