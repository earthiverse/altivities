"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function onClick(event) {
}
function onDragStart(event) {
    const item = event.currentTarget;
    const parent = item.parentElement;
    const data = {
        "item": item.id,
        "parent": parent.id
    };
    event.dataTransfer.setData("application/json", JSON.stringify(data));
    return false;
}
function onDragOver(event) {
    event.preventDefault();
    return false;
}
function onDrop(event) {
    const droppedOn = event.currentTarget;
    const data = JSON.parse(event.dataTransfer.getData("application/json"));
    const item = document.getElementById(data.item);
    const previous = document.getElementById(data.parent);
    console.debug(`Dropped On: ${droppedOn.id}`);
    console.debug(`Item: ${item.id}`);
    console.debug(`Previous: ${previous.id}`);
    if (droppedOn == previous)
        return;
    if (droppedOn.classList.contains("cell")) {
        if (droppedOn.firstChild) {
            previous.appendChild(droppedOn.firstChild);
        }
        droppedOn.appendChild(item);
    }
    else {
        droppedOn.appendChild(item);
    }
    event.dataTransfer.clearData();
    event.preventDefault();
    checkReady();
    return false;
}
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}
function ready() {
}
function checkReady() {
    const readyButton = document.getElementById("ready");
    let isReady = true;
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell${i}`);
        if (!cell.firstChild) {
            isReady = false;
            break;
        }
    }
    if (isReady) {
        readyButton.style.cursor = "pointer";
        readyButton.style.backgroundColor = "greenyellow";
        readyButton.addEventListener("click", ready);
    }
    else {
        readyButton.style.cursor = "not-allowed";
        readyButton.style.backgroundColor = "lightgray";
        readyButton.removeEventListener("click", ready);
    }
}
function chooseRandom() {
    const select = document.getElementById("select");
    const cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        const cell = cells.item(i);
        if (cell.firstChild)
            select.appendChild(cell.firstChild);
    }
    const items = document.getElementsByClassName("item");
    const itemsArray = [];
    for (let i = 0; i < items.length; i++) {
        const item = items.item(i);
        if (item.firstChild)
            itemsArray.push(item);
    }
    shuffle(itemsArray);
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell${i}`);
        const item = itemsArray[i];
        if (!item)
            break;
        cell.appendChild(item);
    }
    checkReady();
}
