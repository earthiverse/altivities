
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
*** Helpers *******************************************************************/
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function isPositiveInteger(v) {
    let i
    return v && (i = parseInt(v)) && i > 0 && (i === v || "" + i === v)
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
    }

    return array
}

async function clearElement(data: HTMLElement) {
    while (data.firstChild) data.removeChild(data.firstChild)
}

/*******************************************************************************
*** Config ********************************************************************/


/*******************************************************************************
*** DOM Elements **************************************************************/
const CHECK_BUTTON = document.getElementById("check") as HTMLDivElement
const MENU = document.getElementById("menu") as HTMLDivElement
const ORDER_AREA = document.getElementById("order_area") as HTMLDivElement
// const PLAY_AREA = document.getElementById("play_area") as HTMLDivElement
// const QR_BUTTON = document.getElementById("generate_qr") as HTMLDivElement

/*******************************************************************************
*** Game Code *****************************************************************/
/** This is where we will store the answer to the ordering (if one is available) */
const ORDER_ANSWERS: string[] = []

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
    checkReady()

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

function check() {
    if (!checkReady()) return // We're not actually ready

    const orderCells = document.getElementsByClassName("order_cell")
    for (let i = 0; i < orderCells.length; i++) {
        const cell = orderCells.item(i) as HTMLDivElement
        const text = (cell.firstChild as HTMLDivElement).innerText
        console.log(text)
        if (ORDER_ANSWERS[i] !== text) {
            // This answer was incorrect
            ORDER_AREA.style.backgroundColor = "var(--color-red)"
            alert("Sorry, that's not correct...")
            return false
        }
    }

    // Everything is correct!
    ORDER_AREA.style.backgroundColor = "var(--color-green)"
    alert("You are correct!")
    return true
}

function checkReady() {
    const orderCells = document.getElementsByClassName("order_cell")
    for (let i = 0; i < orderCells.length; i++) {
        const cell = orderCells.item(i)
        if (!cell.firstChild) {
            CHECK_BUTTON.style.cursor = "not-allowed"
            CHECK_BUTTON.style.backgroundColor = "var(--ready-no-color)"
            CHECK_BUTTON.removeEventListener("click", check)
            return false
        }
    }

    CHECK_BUTTON.style.cursor = "pointer"
    CHECK_BUTTON.style.backgroundColor = "var(--ready-yes-color)"
    CHECK_BUTTON.addEventListener("click", check)
    return true
}

/**
 * Puts order boxes in the order area
 * @param num The number of boxes to make
 */
function makeOrderBoxes(num: number) {
    for (let i = 0; i < num; i++) {
        // Setup & style the cell
        const cell = document.createElement("div")
        cell.id = `cell${i}`
        cell.classList.add("order_cell")
        cell.style.backgroundImage = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='200' width='200'><text x='50%' y='5' dominant-baseline='hanging' text-anchor='middle' fill='lightgray' font-size='25' font-family='\\"JKHandwriting\\", Schoolbell, \\"Comic Sans MS\\"'>${i}</text></svg>")`
        cell.style.backgroundRepeat = "no-repeat"
        cell.style.backgroundPosition = "top"
        cell.style.backgroundSize = "contain"

        // Setup drag & drop listeners
        cell.addEventListener("dragover", onDragOver)
        cell.addEventListener("drop", onDrop)

        // Add the cell to the order area
        ORDER_AREA.appendChild(cell)
    }
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
    // Prepare the order string if we have one
    const order = PARAMETERS.order as string
    while (order?.endsWith(",")) order.substring(0, order.length - 1) // Remove the trailing commas
    if (!order || isPositiveInteger(order)) {
        // Hide the check button if there's no order
        CHECK_BUTTON.style.display = "none"
    }

    const wordlist = shuffle(await prepareWordlist())
    makeCards(wordlist)

    // You can specify the number of boxes with ?order=<number>
    let numBoxes = wordlist.length
    if (isPositiveInteger(order)) {
        numBoxes = Number.parseInt(order)
    } else if (order) {
        // Make a box for each item in our order
        numBoxes = 0
        const fixedItems = []
        for (const item of order.split(",")) {
            if (item == undefined) continue // Empty element
            let fixedItem = item.trim()
            if (fixedItem.startsWith("🔑")) {
                // Convert from base64 to text
                const noKey = fixedItem.substring(2, fixedItem.length)
                const decode = window.atob(noKey)
                ORDER_ANSWERS.push(decode)
            } else {
                ORDER_ANSWERS.push(fixedItem)
                fixedItem = `🔑${window.btoa(fixedItem)}`
            }
            fixedItems.push(fixedItem)
            numBoxes++
        }

        // Update the URL with key'd words
        const url = new URL(window.location.toString())
        url.searchParams.set("order", fixedItems.join(","))
        history.pushState({}, null, url)
    }
    makeOrderBoxes(numBoxes)

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