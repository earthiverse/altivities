"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    if (droppedOn.classList.contains("bingo_cell")) {
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
function generateMenuOptions(wordlist) {
    const menu = document.getElementById("menu");
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
        menu.appendChild(itemOutside);
        textFit(itemInside, { alignHoriz: true });
        num += 1;
    }
}
function ready() {
    if (!checkReady())
        return;
    const words = [];
    for (let i = 0; i < 9; i++) {
        const cell = document.getElementById(`cell${i}`);
        words.push(cell.firstChild.parentNode.textContent);
    }
    const data = {
        wordlist: PARAMETERS.wordlist,
        wordlists: PARAMETERS.wordlists,
        words: words.join("🔥")
    };
    for (const datum in data)
        if (data[datum] === undefined)
            delete data[datum];
    window.location.href = `play.html?${new URLSearchParams(data)}`;
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
            readyButton.style.backgroundColor = "var(--ready-no-color)";
            readyButton.removeEventListener("click", ready);
            return false;
        }
    }
    readyButton.style.cursor = "pointer";
    readyButton.style.backgroundColor = "var(--ready-yes-color)";
    readyButton.addEventListener("click", ready);
    return true;
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
function goToTeach() {
    const data = {
        ignore: PARAMETERS.ignore,
        include: PARAMETERS.include,
        wordlist: PARAMETERS.wordlist,
        wordlists: PARAMETERS.wordlists,
    };
    for (const datum in data)
        if (data[datum] === undefined)
            delete data[datum];
    window.location.href = `teach.html?${new URLSearchParams(data)}`;
}
function chooseRandom() {
    const menu = document.getElementById("menu");
    const cells = document.getElementsByClassName("bingo_cell");
    for (let i = 0; i < cells.length; i++) {
        const cell = cells.item(i);
        if (cell.firstChild)
            menu.appendChild(cell.firstChild);
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
async function prepare() {
    generateMenuOptions(await prepareWordlist());
}
prepare();
function fitTextForAllCards() {
    const cards = document.getElementsByClassName("item_inside");
    for (let i = 0; i < cards.length; i++) {
        const inside = cards.item(i);
        textFit(inside, { alignHoriz: true });
    }
}
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
