
/*******************************************************************************
*** Types *********************************************************************/

import { Wordlist } from "../wordlists/wordlists"

declare let PARAMETERS: any
declare let prepareWordlist: () => Promise<Wordlist>

// QR Code
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

type dragData = {
    item: string
    parent: string
}

/*******************************************************************************
*** DOM Elements **************************************************************/
const MENU = document.getElementById("menu") as HTMLDivElement

/*******************************************************************************
*** Game Code *****************************************************************/
/** This is where we will store the answer to the ordering (if one is available) */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onDragStart(event: DragEvent) {
    const item: HTMLDivElement = event.currentTarget as HTMLDivElement
    const parent = item.parentElement as HTMLDivElement

    const data: dragData = {
        "item": item.id,
        "parent": parent.id
    }

    event.dataTransfer.setData("application/json", JSON.stringify(data))
    return false
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onDragOver(event: DragEvent) {
    event.preventDefault()
    return false
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onDrop(event: DragEvent) {
    const droppedOn = event.currentTarget as HTMLDivElement

    const data: dragData = JSON.parse(event.dataTransfer.getData("application/json"))
    const item = document.getElementById(data.item) as HTMLDivElement
    const previous = document.getElementById(data.parent) as HTMLDivElement

    if (droppedOn == previous) return // No change

    if (droppedOn.classList.contains("order_cell")) {
        if (droppedOn.firstChild) {
            // It's being dragged from one cell to another
            previous.appendChild(droppedOn.firstChild)
        }
        // It's being dragged from the list, or another cell
        droppedOn.appendChild(item)
    } else {
        // It's being returned to the list
        droppedOn.appendChild(item)
    }

    fitTextForAllCards()

    return false
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function showQR() {
    const qrHolder = document.getElementById("qrcode") as HTMLDivElement

    // Remove the old QR code
    while (qrHolder.firstChild) qrHolder.removeChild(qrHolder.firstChild)

    // Generate the QR Code
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.75
    new QRCode(qrHolder, {
        text: window.location.href,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctionLevel: QRCode.CorrectLevel.L
    })

    // Unhide the qrcode
    qrHolder.style.display = "flex"

    qrHolder.addEventListener("click", () => {
        qrHolder.style.display = "none"
    })
}

function makeCards(wordlist: Wordlist) {
    // Add all items to the menu
    let num = 0
    for (const word of wordlist) {
        const itemOutside = document.createElement("div")
        const itemInside = document.createElement("div")
        itemOutside.id = `option${num}`
        itemOutside.draggable = true
        itemOutside.addEventListener("dragstart", onDragStart)
        itemOutside.style.order = num.toString()
        itemOutside.classList.add("item")
        itemInside.classList.add("item_inside")
        if (word.image) {
            itemOutside.style.backgroundImage = `url('${word.image}')`
            itemOutside.style.backgroundRepeat = "no-repeat"
            itemOutside.style.backgroundPosition = "center"
            itemOutside.style.backgroundSize = "contain"
        }

        if (Array.isArray(word.en)) {
            itemInside.innerText = word.en[0]
        } else {
            itemInside.innerText = word.en
        }

        itemOutside.appendChild(itemInside)
        MENU.appendChild(itemOutside)
        num += 1
    }
}

function fitTextForAllCards() {
    const cards = document.getElementsByClassName("item_inside") as HTMLCollectionOf<HTMLDivElement>
    for (let i = 0; i < cards.length; i++) {
        const inside = cards.item(i)
        textFit(inside, { alignVert: true, reProcess: true })
    }
}

async function prepare() {
    makeCards(await prepareWordlist())
    fitTextForAllCards()
}
prepare()

// The following handles resizing the window.
// It's a hack to fill in the screen on iPads.
let RESIZE_FINISHED
function resize() {
    if (RESIZE_FINISHED) clearTimeout(RESIZE_FINISHED)
    RESIZE_FINISHED = setTimeout(() => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty("--vh", `${vh}px`)

        fitTextForAllCards()

        const qrHolder = document.getElementById("qrcode") as HTMLDivElement
        if (qrHolder.style.display && qrHolder.style.display !== "none") {
            showQR()
        }
    }, 250)
}
resize()
window.addEventListener("resize", resize)

export {}