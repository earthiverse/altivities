import { Wordlist } from "../wordlists/wordlists"

declare let PARAMETERS: any
declare let prepareWordlist: () => Promise<Wordlist>

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function drawRandom() {
    const toDraw = document.getElementById("to_draw_area") as HTMLDivElement
    const current = document.getElementById("current_area") as HTMLDivElement
    const drawn = document.getElementById("drawn_area") as HTMLDivElement

    // Move the current element to the drawn menu
    while (current.firstChild) drawn.appendChild(current.firstChild)

    // Put the items in an array, shuffle, and fill current area
    const itemsArray = []
    toDraw.childNodes.forEach((child: HTMLDivElement) => {
        if (child.classList?.contains("item")) itemsArray.push(child)
    })
    shuffle(itemsArray)
    current.appendChild(itemsArray[0])

    checkDraw()
}

function checkDraw() {
    const toDraw = document.getElementById("to_draw_area") as HTMLDivElement
    const drawButton = document.getElementById("draw_card") as HTMLDivElement

    let hasItem = false
    toDraw.childNodes.forEach((child: HTMLDivElement) => {
        if (child.classList?.contains("item")) hasItem = true
    })

    if (hasItem) {
        drawButton.style.cursor = "pointer"
        drawButton.style.backgroundColor = "var(--ready-yes-color)"
        drawButton.addEventListener("click", drawRandom)
        return true
    } else {
        drawButton.style.cursor = "not-allowed"
        drawButton.style.backgroundColor = "var(--ready-no-color)"
        drawButton.removeEventListener("click", drawRandom)
        return false
    }
}

async function onMouseDown(event: Event) {
    const target = event.currentTarget as HTMLDivElement
    const parent = target.parentElement as HTMLDivElement

    const toDraw = document.getElementById("to_draw_area") as HTMLDivElement
    const current = document.getElementById("current_area") as HTMLDivElement
    const drawn = document.getElementById("drawn_area") as HTMLDivElement

    if (parent.id == "drawn_area") {
        // Move current item back to toDraw area
        while (current.firstChild) {
            toDraw.appendChild(current.firstChild)
        }

        // TODO: Move clicked item to current area
        current.appendChild(target)
    } else if (parent.id == "current_area") {
        // Move clicked item back to toDraw
        toDraw.appendChild(target)
    } else if (parent.id == "to_draw_area") {
        // Move current to drawn
        while (current.firstChild) drawn.appendChild(current.firstChild)

        // Move clicked to current
        current.appendChild(target)
    }

    fitTextForAllCards()
    checkDraw()
}

async function generateMenuOptions(wordlist: Wordlist) {
    const menu = document.getElementById("to_draw_area") as HTMLDivElement

    // Add all items to the menu
    let num = 0
    for (const word of wordlist) {
        const itemOutside = document.createElement("div")
        const itemInside = document.createElement("div")
        itemOutside.id = `option${num}`
        itemOutside.addEventListener("mousedown", onMouseDown)
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
        menu.appendChild(itemOutside)
        textFit(itemInside, { alignHoriz: true })
        num += 1
    }

    checkDraw()
}

async function prepare() {
    generateMenuOptions(await prepareWordlist())
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
    }, 250)
}
resize()
window.addEventListener("resize", resize)

export {}