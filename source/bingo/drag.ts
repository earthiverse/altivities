type dragData = {
    item: string
    parent: string
}

export function onDragStart(event: DragEvent) {
    const item: HTMLDivElement = event.currentTarget as HTMLDivElement
    const parent = item.parentElement as HTMLDivElement
    item.style.backgroundColor = "yellow"

    const data: dragData = {
        "item": item.id,
        "parent": parent.id
    }

    event.dataTransfer.setData("application/json", JSON.stringify(data))
}

export function onDragOver(event: DragEvent) {
    event.preventDefault()
}

export function onDrop(event: DragEvent) {
    const droppedOn = event.target as HTMLDivElement

    const data: dragData = JSON.parse(event.dataTransfer.getData("application/json"))
    const item = document.getElementById(data.item) as HTMLDivElement
    const previous = document.getElementById(data.parent) as HTMLDivElement

    if (droppedOn.classList.contains("option")) {
        // Don't drop it on other cells, return it to the menu
        console.debug("Returning early")
        previous.appendChild(item)
        return
    }

    if (droppedOn.classList.contains("cell")) {
        // It's a bingo square, so remove all content first
        while (droppedOn.firstChild) {
            if ((droppedOn.firstChild as HTMLDivElement).classList?.contains("option")) {
                // Return previous option to the menu
                console.debug("Returning to previous")
                previous.appendChild(droppedOn.firstChild)
            } else {
                console.log("just removing")
                droppedOn.removeChild(droppedOn.firstChild)
            }
        }
        console.log("appending to cell")
        droppedOn.appendChild(item)
    } else {
        // It's our list
        console.log("returning to list")
        droppedOn.appendChild(item)
    }

    // event.dataTransfer.clearData()
}
