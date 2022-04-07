/* eslint-disable @typescript-eslint/no-unused-vars */

// Wordlist
export type Languages =
    | "en"
    | "ja"

export type Word = {
    [T in Exclude<Languages, "ja">]: string | string[]
} & {
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

async function prepareWordlist(): Promise<Wordlist> {
    const combinedWordlist: Wordlist = []

    if (PARAMETERS.wordlist) {
        // Add the one wordlist to the menu
        const response = await fetch(PARAMETERS.wordlist)
        const wordlist: Wordlist = await response.json()
        combinedWordlist.push(...wordlist)
    }

    if (PARAMETERS.wordlists) {
        // Combine all wordlists
        for (const url of PARAMETERS.wordlists.split(",")) {
            const response = await fetch(url)
            const wordlist: Wordlist = await response.json()
            combinedWordlist.push(...wordlist)
        }
    }

    if (PARAMETERS.ignore) {
        const toIgnore: string[] = PARAMETERS.ignore.split(",")
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

    if (PARAMETERS.include) {
        const toInclude: string[] = PARAMETERS.include.split(",")
        for (let i = 0; i < combinedWordlist.length; i++) {
            const word = combinedWordlist[i]
            let remove = true
            for (const includeWord of toInclude) {
                if (word.en == includeWord
                    || (Array.isArray(word.en) && word.en[0] == includeWord)) {
                    // Remove this word from the wordlist
                    remove = false
                    break
                }

                // Check if it's an alternative word
                if (Array.isArray(word.en)) {
                    for (let j = 0; j < word.en.length; j++) {
                        const alternativeWord = word.en[j]
                        if (alternativeWord !== includeWord) continue
                        // We found the word as an alternative, set it as the main word
                        word.en = alternativeWord
                        remove = false
                        break
                    }
                }
            }
            if (remove) {
                combinedWordlist.splice(i, 1)
                i -= 1
            }
        }
    }

    return combinedWordlist
}