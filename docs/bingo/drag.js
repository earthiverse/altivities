"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDrop = exports.onDragOver = exports.onDragStart = exports.onClick = void 0;
function onClick(event) {
}
exports.onClick = onClick;
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
exports.onDragStart = onDragStart;
function onDragOver(event) {
    event.preventDefault();
    return false;
}
exports.onDragOver = onDragOver;
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
        if (droppedOn.firstChild?.classList?.contains("option")) {
            previous.appendChild(droppedOn.firstChild);
        }
        droppedOn.appendChild(item);
    }
    else {
        droppedOn.appendChild(item);
    }
    event.dataTransfer.clearData();
    event.preventDefault();
    return false;
}
exports.onDrop = onDrop;
