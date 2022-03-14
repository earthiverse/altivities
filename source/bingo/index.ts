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

const parameters: any = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop: string) => searchParams.get(prop)
})

type dragData = {
    item: string
    parent: string
}

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

    checkReady()

    return false
}

async function generateMenuOptions(wordlistURL: string) {
    const response = await fetch(wordlistURL)
    const wordlist: Wordlist = await response.json()

    const menu = document.getElementById("menu") as HTMLDivElement

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
            itemInside.style.backgroundImage = `url('${word.image}')`
            itemInside.style.backgroundRepeat = "no-repeat"
            itemInside.style.backgroundPosition = "center"
            itemInside.style.backgroundSize = "contain"
        }

        if (Array.isArray(word.en)) {
            itemInside.innerText = word.en[0]
        } else {
            itemInside.innerText = word.en
        }

        itemOutside.appendChild(itemInside)
        menu.appendChild(itemOutside)
        num += 1
    }
}

function ready() {
    if (!checkReady()) return // We're not actually ready

    const words: string[] = []
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell${i}`)
        console.log(cell.firstChild.parentNode.textContent)
        words.push(cell.firstChild.parentNode.textContent)
    }

    const wordsFire = words.join("🔥")
    window.location.href = `play.html?wordlist=${parameters.wordlist}&words=${wordsFire}`
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

    for (let i = 0; i < 9; i++) {
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
    const qrcode = new QRCode(qrHolder, {
        text: window.location.href,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctionLevel: QRCode.CorrectLevel.H
    })

    // Unhide the qrcode
    qrHolder.style.display = "flex"

    qrHolder.addEventListener("click", () => {
        qrHolder.style.display = "none"
    })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function chooseRandom() {
    const menu = document.getElementById("menu") as HTMLDivElement

    // Return all elements to the menu
    const cells = document.getElementsByClassName("bingo_cell")
    for (let i = 0; i < cells.length; i++) {
        const cell = cells.item(i)
        if (cell.firstChild) menu.appendChild(cell.firstChild)
    }

    // Put the items in an array, shuffle, and fill 9 cells
    const items = document.getElementsByClassName("item")
    const itemsArray = []
    for (let i = 0; i < items.length; i++) {
        const item = items.item(i)
        if (item.firstChild) itemsArray.push(item)
    }
    shuffle(itemsArray)
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell${i}`)
        const item = itemsArray[i]
        if (!item) break // We ran out of items!?
        cell.appendChild(item)
    }

    checkReady()
}

if (parameters.wordlist) {
    generateMenuOptions(parameters.wordlist)
}

// The following handles resizing the window.
// It's a hack to fill in the screen on iPads.
let RESIZE_FINISHED
function resize() {
    if (RESIZE_FINISHED) clearTimeout(RESIZE_FINISHED)
    RESIZE_FINISHED = setTimeout(() => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty("--vh", `${vh}px`)
    }, 250)
}
resize()
window.addEventListener("resize", resize)

export {}