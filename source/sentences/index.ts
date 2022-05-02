/*******************************************************************************
*** Types *********************************************************************/

import { Wordlist } from "../wordlists/wordlists"

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
        SENTENCE.appendChild(toAdd)
    }

    const addCard = (wordlist_num: number, hide = false, color?: string) => {
        const wordlist = WORDLISTS[wordlist_num - 1]
        if (!wordlist) throw `We are missing '${wordlist_num}_wordlist'`

        // Get a random word from the wordlist
        const word = wordlist[randomIntFromInterval(0, wordlist.length - 1)]
        const english = Array.isArray(word.en) ? word.en[0] : word.en

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
    for (const char of PARAMETERS.sentence) {
        if (char == SUBSTITUTION_CHAR) {
            addPart(part)
            addCard(i, PARAMETERS.hide, PARAMETERS[`${i}_color`])
            part = ""
            i += 1
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
        // TODO: Visually throw an error on the screen
        throw Error("No substitution character found.")
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

// The following handles resizing the window.
// It's a hack to fill in the screen on iPads.
let RESIZE_FINISHED
function resize() {
    if (RESIZE_FINISHED) clearTimeout(RESIZE_FINISHED)
    RESIZE_FINISHED = setTimeout(() => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty("--vh", `${vh}px`)

        const cards = document.getElementsByClassName("card-inside") as HTMLCollectionOf<HTMLDivElement>
        for (let i = 0; i < cards.length; i++) {
            const inside = cards.item(i)
            textFit(inside, TEXT_FIT_OPTIONS)
        }

        if (QRCODE.style.display && QRCODE.style.display !== "none") {
            console.log(QRCODE.style.display)
            showQR()
        }
    }, 250)
}
resize()
window.addEventListener("resize", resize)

export { }