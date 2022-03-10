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

    event.dataTransfer.clearData()
    event.preventDefault()

    checkReady()

    return false
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

function ready() {
    // TODO: Remove the menu, lock
}

function checkReady() {
    const readyButton = document.getElementById("ready") as HTMLDivElement

    let isReady = true
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell${i}`)
        if (!cell.firstChild) {
            isReady = false
            break
        }
    }

    if (isReady) {
        readyButton.style.cursor = "pointer"
        readyButton.style.backgroundColor = "greenyellow"
        readyButton.addEventListener("click", ready)
    } else {
        readyButton.style.cursor = "not-allowed"
        readyButton.style.backgroundColor = "lightgray"
        readyButton.removeEventListener("click", ready)
    }
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

export {}