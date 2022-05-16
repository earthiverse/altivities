/*******************************************************************************
*** Types *********************************************************************/

import { Word, Wordlist } from "../wordlists/wordlists"

// TODO: What do I change this to to make it work without the disable-next-line!?
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace QRCode {
    enum CorrectLevel {
        L, M, Q, H
    }
}

interface QRCodeOption {
    text?: string,
    width?: number,
    height?: number,
    colorDark?: string,
    colorLight?: string,
    correctionLevel?: QRCode.CorrectLevel,
}

declare class QRCode {
    constructor(el: HTMLElement | string, vOption?: string | QRCodeOption);
    makeCode(sText: string): void;
    makeImage(): void;
    clear(): void;
}

declare let PARAMETERS: any
declare let prepareWordlist: (options?: {
    ignore: string,
    include: string,
    wordlist: string,
    wordlists: string
}) => Promise<Wordlist>

interface textFitOptions {
    alignVert?: boolean;
    alignHoriz?: boolean;
    multiLine?: boolean;
    detectMultiLine?: boolean;
    minFontSize?: number;
    maxFontSize?: number;
    reProcess?: boolean;
    widthOnly?: boolean;
    alignVertWithFlexbox?: boolean;
}

declare let textFit: (
    els: Element | Element[] | NodeListOf<Element> | HTMLCollection | null,
    options?: textFitOptions
) => void

/*******************************************************************************
*** Helpers *******************************************************************/
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/*******************************************************************************
*** Config ********************************************************************/
const SUBSTITUTION_CHAR = "•"
const CIRCLE_NUMBERS_1 = ["①", "②", "③", "④", "⑤"]
const CIRCLE_NUMBERS_2 = ["❶", "❷", "❸", "❹", "❺"]
const CIRCLE_NUMBERS_3 = ["⓵", "⓶", "⓷", "⓸", "⓹"]
const TEXT_FIT_OPTIONS: textFitOptions = { alignHoriz: true, maxFontSize: 32 }

/*******************************************************************************
*** DOM Elements **************************************************************/
const SENTENCE = document.getElementById("sentence") as HTMLDivElement
const NAVIGATION = document.getElementById("navigation") as HTMLDivElement
const QRCODE = document.getElementById("qrcode") as HTMLDivElement

/*******************************************************************************
*** Game Code *****************************************************************/
const WORDLISTS: Wordlist[] = []

function clearSentence() {
    while (SENTENCE.firstChild) SENTENCE.removeChild(SENTENCE.firstChild)
}

function generateSentence() {
    clearSentence()

    const addPart = (part: string) => {
        if (part == "") return // Don't add empty part
        const toAdd = document.createElement("div")
        toAdd.textContent = part
        toAdd.style.whiteSpace = "nowrap"
        SENTENCE.appendChild(toAdd)
    }

    const addBreak = () => {
        const toAdd = document.createElement("div")
        toAdd.classList.add("break")
        SENTENCE.appendChild(toAdd)
    }

    const substitutions = new Map<number, Map<number, Word>>()
    /**
     * Renders a card
     * @param wordlist_num The wordlist index (e.g. 1_wordlist, 2_wordlist, ...)
     * @param replace_num The word to replace (e.g. ① = 1, ❶ = 2, ⓵ = 3)
     * @param hide Should we hide the text?
     * @param color What color should we use to render the box?
     * @returns
     */
    const addCard = (wordlist_num: number, replace_num: number, hide = false, color?: string) => {
        const wordlist = WORDLISTS[wordlist_num - 1]
        if (!wordlist) throw `We are missing '${wordlist_num}_wordlist'`

        let previous = substitutions.get(wordlist_num)

        // Get a random word from the wordlist
        let word: Word
        let english: string
        if (previous && previous.has(replace_num)) {
            // Use the previous word
            word = previous.get(replace_num)
            english = Array.isArray(word.en) ? word.en[0] : word.en
        } else {
            // Choose a word and save it
            word = wordlist[randomIntFromInterval(0, wordlist.length - 1)]
            if (!previous) {
                previous = new Map()
                substitutions.set(wordlist_num, previous)
            } else {
                if (previous.size < wordlist.length) {
                    // Make sure it hasn't been chosen before
                    for (const [, other_word] of previous) {
                        if (other_word == word) {
                            // Call this function again, try to get a different word.
                            return addCard(wordlist_num, replace_num, hide, color)
                        }
                    }
                }
            }
            previous.set(replace_num, word)
            english = Array.isArray(word.en) ? word.en[0] : word.en
        }

        // Create the card
        const card = document.createElement("div")
        card.classList.add("card")

        if (color) {
            card.style.color = color
            card.style.borderColor = color
        } else if (wordlist_num == 1) {
            card.classList.add("color_one")
        } else if (wordlist_num == 2) {
            card.classList.add("color_two")
        } else if (wordlist_num == 3) {
            card.classList.add("color_three")
        }

        const card_inside = document.createElement("div")
        card_inside.classList.add("card-inside")
        if (!hide) card_inside.textContent = english

        if (word.image) {
            card.style.backgroundImage = `url('${word.image}')`
            card.style.backgroundRepeat = "no-repeat"
            card.style.backgroundPosition = "center"
            card.style.backgroundSize = "contain"
        }

        card.appendChild(card_inside)
        SENTENCE.appendChild(card)
        textFit(card_inside, TEXT_FIT_OPTIONS)
    }

    let part = ""
    let i = 1
    for (const char of (PARAMETERS.sentence as string)) {
        if (char == SUBSTITUTION_CHAR) {
            // Substitution replacements
            addPart(part)
            addCard(i, 0, PARAMETERS.hide, PARAMETERS[`${i}_color`])
            part = ""
            i += 1
        } else if (CIRCLE_NUMBERS_1.includes(char)) {
            const index = CIRCLE_NUMBERS_1.indexOf(char) + 1
            addPart(part)
            addCard(index, 1, PARAMETERS.hide, PARAMETERS[`${index}_color`])
            part = ""
        } else if (CIRCLE_NUMBERS_2.includes(char)) {
            const index = CIRCLE_NUMBERS_2.indexOf(char) + 1
            addPart(part)
            addCard(index, 2, PARAMETERS.hide, PARAMETERS[`${index}_color`])
            part = ""
        } else if (CIRCLE_NUMBERS_3.includes(char)) {
            const index = CIRCLE_NUMBERS_3.indexOf(char) + 1
            addPart(part)
            addCard(index, 3, PARAMETERS.hide, PARAMETERS[`${index}_color`])
            part = ""
        } else if ([".", "!", "?"].includes(char)) {
            // Break sentences
            addPart(part + char)
            part = ""
        } else if (char == "\n") {
            // New line break
            addBreak()
        } else {
            part = part + char
        }
    }
    addPart(part)
}

async function prepare() {
    if (!PARAMETERS.sentence) {
        // TODO: Visually throw an error on the screen
        throw Error("No sentence found.")
    }
    if (!PARAMETERS.sentence.includes(SUBSTITUTION_CHAR)) {
        // Check if it has a circle number
        let hasNumber = false
        for (const number of CIRCLE_NUMBERS_1) {
            if (PARAMETERS.sentence.includes(number)) {
                hasNumber = true
                break
            }
        }

        if (!hasNumber) {
            // TODO: Visually throw an error on the screen
            throw Error("No substitution character found.")
        }
    }

    let i = 1
    while (PARAMETERS[`${i}_wordlist`] || PARAMETERS[`${i}_wordlists`]) {
        const wordlist = await prepareWordlist({
            ignore: PARAMETERS[`${i}_ignore`],
            include: PARAMETERS[`${i}_include`],
            wordlist: PARAMETERS[`${i}_wordlist`],
            wordlists: PARAMETERS[`${i}_wordlists`]
        })
        WORDLISTS.push(wordlist)
        i += 1
    }
    if (WORDLISTS.length == 0) {
        // If there's only one blank later,
        const wordlist = await prepareWordlist()
        WORDLISTS.push(wordlist)
    }

    generateSentence()
}
prepare()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function showQR() {
    // Remove the old QR code
    while (QRCODE.firstChild) QRCODE.removeChild(QRCODE.firstChild)

    // Generate the QR Code
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.75
    new QRCode(QRCODE, {
        text: window.location.href,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctionLevel: QRCode.CorrectLevel.L
    })

    // Unhide the qrcode
    QRCODE.style.display = "flex"

    QRCODE.addEventListener("click", () => {
        QRCODE.style.display = "none"
    })
}

function fitTextForAllCards() {
    const cards = document.getElementsByClassName("card-inside") as HTMLCollectionOf<HTMLDivElement>
    for (let i = 0; i < cards.length; i++) {
        const inside = cards.item(i)
        textFit(inside, TEXT_FIT_OPTIONS)
    }
}

// The following handles resizing the window.
// It's a hack to fill in the screen on iPads.
let RESIZE_FINISHED
function resize() {
    if (RESIZE_FINISHED) clearTimeout(RESIZE_FINISHED)
    RESIZE_FINISHED = setTimeout(() => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty("--vh", `${vh}px`)

        fitTextForAllCards()

        if (QRCODE.style.display && QRCODE.style.display !== "none") {
            console.log(QRCODE.style.display)
            showQR()
        }
    }, 250)
}
resize()
window.addEventListener("resize", resize)

export { }