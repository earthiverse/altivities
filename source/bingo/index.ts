import { Wordlist } from "../wordlists/wordlists"

declare let PARAMETERS: any
declare let prepareWordlist: () => Promise<Wordlist>

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

let NUM_CELLS = 9
const MENU = document.getElementById("menu") as HTMLDivElement
const PLAY_AREA = document.getElementById("play_area")
const AREA_3_BY_3 = document.getElementById("bingo_area_3")
const AREA_4_BY_4 = document.getElementById("bingo_area_4")
const AREA_5_BY_5 = document.getElementById("bingo_area_5")

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

    console.debug(`Dropped On: ${droppedOn.id}`)
    console.debug(`Item: ${item.id}`)
    console.debug(`Previous: ${previous.id}`)

    if (droppedOn == previous) return // No change

    if (droppedOn.classList.contains("bingo_cell")) {
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

function generateMenuOptions(wordlist: Wordlist) {
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
        textFit(itemInside, { alignHoriz: true })
        num += 1
    }
}

function ready() {
    if (!checkReady()) return // We're not actually ready

    const words: string[] = []
    for (let i = 0; i < NUM_CELLS; i++) {
        const cell = document.getElementById(`cell${i}`)
        words.push(cell.firstChild.parentNode.textContent)
    }

    const data = {
        "4x4": PARAMETERS["4x4"],
        "5x5": PARAMETERS["5x5"],
        wordlist: PARAMETERS.wordlist,
        wordlists: PARAMETERS.wordlists,
        words: words.join("🔥")
    }
    for (const datum in data) if (data[datum] === undefined) delete data[datum]
    window.location.href = `play.html?${new URLSearchParams(data)}`
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

function checkReady() {
    const readyButton = document.getElementById("ready") as HTMLDivElement

    for (let i = 0; i < NUM_CELLS; i++) {
        const cell = document.getElementById(`cell${i}`)
        if (!cell.firstChild) {
            readyButton.style.cursor = "not-allowed"
            readyButton.style.backgroundColor = "var(--ready-no-color)"
            readyButton.removeEventListener("click", ready)
            return false
        }
    }

    readyButton.style.cursor = "pointer"
    readyButton.style.backgroundColor = "var(--ready-yes-color)"
    readyButton.addEventListener("click", ready)
    return true
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function goToTeach() {
    const data = {
        ignore: PARAMETERS.ignore,
        include: PARAMETERS.include,
        wordlist: PARAMETERS.wordlist,
        wordlists: PARAMETERS.wordlists,
    }
    for (const datum in data) if (data[datum] === undefined) delete data[datum]
    window.location.href = `teach.html?${new URLSearchParams(data)}`
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function chooseRandom() {
    // Return all elements to the menu
    const cells = document.getElementsByClassName("bingo_cell")
    for (let i = 0; i < cells.length; i++) {
        const cell = cells.item(i)
        if (cell.firstChild) MENU.appendChild(cell.firstChild)
    }

    // Put the items in an array, shuffle, and fill the cells cells
    const items = document.getElementsByClassName("item")
    const itemsArray = []
    for (let i = 0; i < items.length; i++) {
        const item = items.item(i)
        if (item.firstChild) itemsArray.push(item)
    }
    shuffle(itemsArray)
    for (let i = 0; i < NUM_CELLS; i++) {
        const cell = document.getElementById(`cell${i}`)
        const item = itemsArray[i]
        if (!item) break // We ran out of items!?
        cell.appendChild(item)
    }

    fitTextForAllCards()
    checkReady()
}

async function prepare() {
    // Set the correct area
    if (PARAMETERS["4x4"]) {
        NUM_CELLS = 16
        PLAY_AREA.removeChild(AREA_3_BY_3)
        PLAY_AREA.removeChild(AREA_5_BY_5)
        AREA_4_BY_4.style.display = "flex"
    } else if (PARAMETERS["5x5"]) {
        NUM_CELLS = 25
        PLAY_AREA.removeChild(AREA_3_BY_3)
        PLAY_AREA.removeChild(AREA_4_BY_4)
        AREA_5_BY_5.style.display = "flex"
    } else {
        NUM_CELLS = 9
        PLAY_AREA.removeChild(AREA_4_BY_4)
        PLAY_AREA.removeChild(AREA_5_BY_5)
        AREA_3_BY_3.style.display = "flex"
    }

    const wordlist = await prepareWordlist()
    if (wordlist.length == 0) {
        // Redirect to documentation
        window.location.replace("https://github.com/earthiverse/altivities/tree/main/source/bingo#wordlists")
        return
    }
    generateMenuOptions(wordlist)
}
prepare()

function fitTextForAllCards() {
    const cards = document.getElementsByClassName("item_inside") as HTMLCollectionOf<HTMLDivElement>
    for (let i = 0; i < cards.length; i++) {
        const inside = cards.item(i)
        textFit(inside, { alignHoriz: true })
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

        const qrHolder = document.getElementById("qrcode") as HTMLDivElement
        if (qrHolder.style.display && qrHolder.style.display !== "none") {
            console.log(qrHolder.style.display)
            showQR()
        }
    }, 250)
}
resize()
window.addEventListener("resize", resize)

export {}