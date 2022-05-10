"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function isPositiveInteger(v) {
    let i;
    return v && (i = parseInt(v)) && i > 0 && (i === v || "" + i === v);
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
async function clearElement(data) {
    while (data.firstChild)
        data.removeChild(data.firstChild);
}
const CHECK_BUTTON = document.getElementById("check");
const MENU = document.getElementById("menu");
const ORDER_AREA = document.getElementById("order_area");
const PLAY_AREA = document.getElementById("play_area");
const QR_BUTTON = document.getElementById("generate_qr");
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
    if (droppedOn.classList.contains("order_cell")) {
        if (droppedOn.firstChild) {
            previous.appendChild(droppedOn.firstChild);
        }
        droppedOn.appendChild(item);
    }
    else {
        droppedOn.appendChild(item);
    }
    fitTextForAllCards();
    checkReady();
    return false;
}
function showQR() {
    const qrHolder = document.getElementById("qrcode");
    while (qrHolder.firstChild)
        qrHolder.removeChild(qrHolder.firstChild);
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.75;
    new QRCode(qrHolder, {
        text: window.location.href,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctionLevel: QRCode.CorrectLevel.L
    });
    qrHolder.style.display = "flex";
    qrHolder.addEventListener("click", () => {
        qrHolder.style.display = "none";
    });
}
function check() {
    if (!checkReady())
        return;
}
function checkReady() {
    const orderCells = document.getElementsByClassName("order_cell");
    console.log(orderCells);
    console.log(orderCells.length);
    for (let i = 0; i < orderCells.length; i++) {
        const cell = orderCells.item(i);
        console.log(cell);
        if (!cell.firstChild) {
            CHECK_BUTTON.style.cursor = "not-allowed";
            CHECK_BUTTON.style.backgroundColor = "var(--ready-no-color)";
            CHECK_BUTTON.removeEventListener("click", check);
            return false;
        }
    }
    CHECK_BUTTON.style.cursor = "pointer";
    CHECK_BUTTON.style.backgroundColor = "var(--ready-yes-color)";
    CHECK_BUTTON.addEventListener("click", check);
    return true;
}
function makeOrderBoxes(num) {
    for (let i = 0; i < num; i++) {
        const cell = document.createElement("div");
        cell.id = `cell${i}`;
        cell.classList.add("order_cell");
        cell.style.backgroundImage = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='200' width='200'><text x='50%' y='5' dominant-baseline='hanging' text-anchor='middle' fill='lightgray' font-size='25' font-family='\\"JKHandwriting\\", Schoolbell, \\"Comic Sans MS\\"'>${i}</text></svg>")`;
        cell.style.backgroundRepeat = "no-repeat";
        cell.style.backgroundPosition = "top";
        cell.style.backgroundSize = "contain";
        cell.addEventListener("dragover", onDragOver);
        cell.addEventListener("drop", onDrop);
        ORDER_AREA.appendChild(cell);
    }
}
function makeCards(wordlist) {
    let num = 0;
    for (const word of wordlist) {
        const itemOutside = document.createElement("div");
        const itemInside = document.createElement("div");
        itemOutside.id = `option${num}`;
        itemOutside.draggable = true;
        itemOutside.addEventListener("dragstart", onDragStart);
        itemOutside.style.order = num.toString();
        itemOutside.classList.add("item");
        itemInside.classList.add("item_inside");
        if (word.image) {
            itemOutside.style.backgroundImage = `url('${word.image}')`;
            itemOutside.style.backgroundRepeat = "no-repeat";
            itemOutside.style.backgroundPosition = "center";
            itemOutside.style.backgroundSize = "contain";
        }
        if (Array.isArray(word.en)) {
            itemInside.innerText = word.en[0];
        }
        else {
            itemInside.innerText = word.en;
        }
        itemOutside.appendChild(itemInside);
        MENU.appendChild(itemOutside);
        num += 1;
    }
}
function fitTextForAllCards() {
    const cards = document.getElementsByClassName("item_inside");
    for (let i = 0; i < cards.length; i++) {
        const inside = cards.item(i);
        textFit(inside, { alignVert: true, reProcess: true });
    }
}
async function prepare() {
    const order = PARAMETERS.order;
    while (order?.endsWith(","))
        order.substring(0, order.length - 1);
    if (!order || isPositiveInteger(order)) {
        CHECK_BUTTON.style.display = "none";
    }
    const wordlist = shuffle(await prepareWordlist());
    makeCards(wordlist);
    let numBoxes = wordlist.length;
    if (isPositiveInteger(order)) {
        numBoxes = Number.parseInt(order);
    }
    else {
        numBoxes = (order?.match(/,/g) || []).length + 1;
    }
    makeOrderBoxes(numBoxes);
    fitTextForAllCards();
}
prepare();
let RESIZE_FINISHED;
function resize() {
    if (RESIZE_FINISHED)
        clearTimeout(RESIZE_FINISHED);
    RESIZE_FINISHED = setTimeout(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
        fitTextForAllCards();
        const qrHolder = document.getElementById("qrcode");
        if (qrHolder.style.display && qrHolder.style.display !== "none") {
            console.log(qrHolder.style.display);
            showQR();
        }
    }, 250);
}
resize();
window.addEventListener("resize", resize);
