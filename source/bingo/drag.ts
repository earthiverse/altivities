type dragData = {
    item: string
    parent: string
}

export function onClick(event) {
    
}

export function onDragStart(event: DragEvent) {
    const item: HTMLDivElement = event.currentTarget as HTMLDivElement
    const parent = item.parentElement as HTMLDivElement

    const data: dragData = {
        "item": item.id,
        "parent": parent.id
    }

    event.dataTransfer.setData("application/json", JSON.stringify(data))
    return false
}

export function onDragOver(event: DragEvent) {
    event.preventDefault()
    return false
}

export function onDrop(event: DragEvent) {
    const droppedOn = event.currentTarget as HTMLDivElement

    const data: dragData = JSON.parse(event.dataTransfer.getData("application/json"))
    const item = document.getElementById(data.item) as HTMLDivElement
    const previous = document.getElementById(data.parent) as HTMLDivElement

    console.debug(`Dropped On: ${droppedOn.id}`)
    console.debug(`Item: ${item.id}`)
    console.debug(`Previous: ${previous.id}`)

    if (droppedOn == previous) return // No change

    if (droppedOn.classList.contains("cell")) {
        if ((droppedOn.firstChild as HTMLDivElement)?.classList?.contains("option")) {
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
    return false
}

// // Prevent Firefox from loading images
// document.addEventListener("dragstart", (e) => {
//     if ((e.target as HTMLElement).nodeName?.toUpperCase() == "IMG") e.preventDefault()
// })