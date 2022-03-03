type Languages =
    | "en"
    | "ja"

export type CategoryKey =
    | "js5"
    | "js6"
    | "hep"

export type Word = {
    [T in Exclude<Languages, "ja">]: string | string[]
} & {
    ja: {
        kanji: string
        hiragana: string
    } | {
        kanji: string
        hiragana: string
    }[]
}

export type Wordlist = Word[]

export type WordlistData = {
    description: string
    file: string
}

export type CategoryData = {
    name: string
    art?: string
    wordlists: {[T in string]: WordlistData}
}

// NOTE: We import this file in the index.html, this variable is important.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const categories: { [T in CategoryKey]: CategoryData } = {
    hep: {
        art: "images/categories/hepburn.png",
        name: "Hepburn Romaji",
        wordlists: {
            hep_english: {
                description: "English Words from Japanese",
                file: "../wordlists/Hepburn/english.json"
            },
            hep_prefectures: {
                description: "Prefectures of Japan",
                file: "../wordlists/Hepburn/prefectures.json"
            }
        }
    },
    js5: {
        art: "images/categories/js5.jpg",
        name: "Junior Sunshine 5",
        wordlists: {
            js5_alphabet: {
                description: "Junior Sunshine 5 - Alphabet",
                file: "../wordlists/JuniorSunshine5/alphabet.json"
            },
            js5_l2: {
                description: "Junior Sunshine 5 - Lesson 2",
                file: "../wordlists/JuniorSunshine5/lesson2.json"
            },
            js5_l3: {
                description: "Junior Sunshine 5 - Lesson 3",
                file: "../wordlists/JuniorSunshine5/lesson3.json"
            },
            js5_l4: {
                description: "Junior Sunshine 5 - Lesson 4",
                file: "../wordlists/JuniorSunshine5/lesson4.json"
            },
            js5_l5: {
                description: "Junior Sunshine 5 - Lesson 5",
                file: "../wordlists/JuniorSunshine5/lesson5.json"
            },
            js5_l7: {
                description: "Junior Sunshine 5 - Lesson 7",
                file: "../wordlists/JuniorSunshine5/lesson7.json"
            },
            js5_l8: {
                description: "Junior Sunshine 5 - Lesson 8",
                file: "../wordlists/JuniorSunshine5/lesson8.json"
            },
            js5_l9: {
                description: "Junior Sunshine 5 - Lesson 9",
                file: "../wordlists/JuniorSunshine5/lesson9.json"
            },
            js5_phonics: {
                description: "Junior Sunshine 5 - Phonics",
                file: "../wordlists/JuniorSunshine5/phonics.json"
            }
        }
    },
    js6: {
        art: "images/categories/js6.jpg",
        name: "Junior Sunshine 6",
        wordlists: {}
    }
}