"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parameters = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
});
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
    checkReady();
    return false;
}
async function generateMenuOptions(wordlistURL) {
    const response = await fetch(wordlistURL);
    const wordlist = await response.json();
    const select = document.getElementById("select");
    let num = 0;
    for (const word of wordlist) {
        const itemOutside = document.createElement("div");
        const itemInside = document.createElement("div");
        itemOutside.id = `option${num}`;
        itemOutside.draggable = true;
        itemOutside.addEventListener("dragstart", onDragStart);
        itemOutside.style.order = num.toString();
        itemOutside.classList.add("item");
        itemInside.classList.add("itemInside");
        if (word.image) {
            itemInside.style.backgroundImage = `url('${word.image}')`;
            itemInside.style.backgroundRepeat = "no-repeat";
            itemInside.style.backgroundPosition = "center";
            itemInside.style.backgroundSize = "contain";
        }
        if (Array.isArray(word.en)) {
            itemInside.innerText = word.en[0];
        }
        else {
            itemInside.innerText = word.en;
        }
        itemOutside.appendChild(itemInside);
        select.appendChild(itemOutside);
        num += 1;
    }
}
function ready() {
    if (!checkReady())
        return;
    const words = [];
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell${i}`);
        console.log(cell.firstChild.parentNode.textContent);
        words.push(cell.firstChild.parentNode.textContent);
    }
    const wordsFire = words.join("🔥");
    window.location.href = `play.html?category=${parameters.category}&list=${parameters.list}&words=${wordsFire}`;
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
function checkReady() {
    const readyButton = document.getElementById("ready");
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell${i}`);
        if (!cell.firstChild) {
            readyButton.style.cursor = "not-allowed";
            readyButton.style.backgroundColor = "lightgray";
            readyButton.removeEventListener("click", ready);
            return false;
        }
    }
    readyButton.style.cursor = "pointer";
    readyButton.style.backgroundColor = "greenyellow";
    readyButton.addEventListener("click", ready);
    return true;
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
if (parameters.category && parameters.list) {
    generateMenuOptions(`../wordlists/${parameters.category}/${parameters.list}.json`);
}
