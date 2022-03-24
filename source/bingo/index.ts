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
    get: (searchParams, prop: string) => {
        const parameter = searchParams.get(prop)
        if (parameter) return parameter
    }
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

function generateMenuOptions(wordlist: Wordlist) {
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
        words.push(cell.firstChild.parentNode.textContent)
    }

    const data = {
        wordlist: parameters.wordlist,
        wordlists: parameters.wordlists,
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
        ignore: parameters.ignore,
        include: parameters.include,
        wordlist: parameters.wordlist,
        wordlists: parameters.wordlists,
    }
    for (const datum in data) if (data[datum] === undefined) delete data[datum]
    window.location.href = `teach.html?${new URLSearchParams(data)}`
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

async function prepare() {
    const combinedWordlist: Wordlist = []

    if (parameters.wordlist) {
        // Add the one wordlist to the menu
        const response = await fetch(parameters.wordlist)
        const wordlist: Wordlist = await response.json()
        combinedWordlist.push(...wordlist)
    }

    if (parameters.wordlists) {
        // Combine all wordlists
        for (const url of parameters.wordlists.split(",")) {
            const response = await fetch(url)
            const wordlist: Wordlist = await response.json()
            combinedWordlist.push(...wordlist)
        }
    }

    if (parameters.ignore) {
        const toIgnore: string[] = parameters.ignore.split(",")
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

    if (parameters.include) {
        const toInclude: string[] = parameters.include.split(",")
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
            }
            if (remove) {
                combinedWordlist.splice(i, 1)
                i -= 1
            }
        }
    }

    generateMenuOptions(combinedWordlist)
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
    }, 250)
}
resize()
window.addEventListener("resize", resize)

export {}