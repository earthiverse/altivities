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

const parameters: any = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop: string) => searchParams.get(prop)
})

type dragData = {
    item: string
    parent: string
}

function onClick(event) {
    // https://4.bp.blogspot.com/-CUR5NlGuXkU/UsZuCrI78dI/AAAAAAAAc20/mMqQPb9bBI0/s8192/mark_maru.png
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

    if (droppedOn.classList.contains("cell")) {
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

    const select = document.getElementById("select") as HTMLDivElement

    // Add all items to the select
    let num = 0
    for (const word of wordlist) {
        const itemOutside = document.createElement("div")
        const itemInside = document.createElement("div")
        itemOutside.id = `option${num}`
        itemOutside.draggable = true
        itemOutside.addEventListener("dragstart", onDragStart)
        itemOutside.style.order = num.toString()
        itemOutside.classList.add("item")
        itemInside.classList.add("itemInside")
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
        select.appendChild(itemOutside)
        num += 1
    }
}

function ready() {
    if (!checkReady()) return // We're not actually ready

    // TODO: Remove the menu, lock
    const words: string[] = []
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell${i}`)
        console.log(cell.firstChild.parentNode.textContent)
        words.push(cell.firstChild.parentNode.textContent)
    }

    const wordsFire = words.join("🔥")
    window.location.href = `play.html?category=${parameters.category}&list=${parameters.list}&words=${wordsFire}`
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
            readyButton.style.backgroundColor = "lightgray"
            readyButton.removeEventListener("click", ready)
            return false
        }
    }

    readyButton.style.cursor = "pointer"
    readyButton.style.backgroundColor = "greenyellow"
    readyButton.addEventListener("click", ready)
    return true
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function chooseRandom() {
    const select = document.getElementById("select") as HTMLDivElement

    // Return all elements to the select
    const cells = document.getElementsByClassName("cell")
    for (let i = 0; i < cells.length; i++) {
        const cell = cells.item(i)
        if (cell.firstChild) select.appendChild(cell.firstChild)
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

if (parameters.category && parameters.list) {
    generateMenuOptions(`../wordlists/${parameters.category}/${parameters.list}.json`)
}

export {}