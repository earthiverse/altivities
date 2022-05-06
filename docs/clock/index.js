"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CLOCK_MINUTE = document.getElementById("clock_minute");
const CLOCK_HOUR = document.getElementById("clock_hour");
const INPUT_HOUR = document.getElementById("input_hour");
const INPUT_MINUTE = document.getElementById("input_minute");
const INPUT_CHECK = document.getElementById("input_check");
const INPUT_SET_RESOLUTION = document.getElementById("input_set_resolution");
const RESPONSES = document.getElementById("responses");
const SETTINGS = document.getElementById("settings");
const SETTINGS_TOGGLE = document.getElementById("settings_toggle");
SETTINGS_TOGGLE.addEventListener("click", () => {
    SETTINGS.style.visibility = "visible";
    SETTINGS.style.opacity = "1";
});
INPUT_SET_RESOLUTION.addEventListener("click", () => {
    SETTINGS.style.visibility = "hidden";
    SETTINGS.style.opacity = "0";
    getNewTime();
});
const COLOR_GREEN = "#00A236";
const COLOR_ORANGE = "#ED7800";
const CORRECT_IMAGES = [
    "images/correct/bear.png",
    "images/correct/cat.png",
    "images/correct/dog.png",
    "images/correct/man.png",
    "images/correct/rabbit.png",
    "images/correct/woman.png"
];
const INCORRECT_IMAGES = [
    "images/incorrect/bear.png",
    "images/incorrect/cat.png",
    "images/incorrect/dog.png",
    "images/incorrect/man.png",
    "images/incorrect/rabbit.png",
    "images/incorrect/woman.png"
];
let time_hours = 12;
let time_minutes = 0;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function resizeToFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { height: srcHeight * ratio, width: srcWidth * ratio };
}
function limitClock(element) {
    element.value = element.value.substring(0, 2);
}
window.onload = () => {
    getNewTime();
    for (const src of [...CORRECT_IMAGES, ...INCORRECT_IMAGES]) {
        const preload = new Image();
        preload.src = src;
    }
};
function clearInputs() {
    INPUT_HOUR.value = "";
    INPUT_MINUTE.value = "";
    INPUT_HOUR.style.backgroundColor = "";
    INPUT_MINUTE.style.backgroundColor = "";
}
function disableInputs() {
    INPUT_HOUR.disabled = true;
    INPUT_MINUTE.disabled = true;
    INPUT_CHECK.disabled = true;
    INPUT_CHECK.style.cursor = "default";
}
function enableInputs() {
    INPUT_HOUR.disabled = false;
    INPUT_MINUTE.disabled = false;
    INPUT_CHECK.disabled = false;
    INPUT_CHECK.style.cursor = "pointer";
    INPUT_HOUR.focus();
    INPUT_HOUR.select();
}
function getNewTime() {
    const selectedResolution = document.querySelector("input[name=\"res\"]:checked").value;
    const minuteResolution = Number.parseInt(selectedResolution);
    const old_hours = time_hours;
    const old_minutes = time_minutes;
    while (old_hours == time_hours && old_minutes == time_minutes) {
        time_hours = getRandomInt(1, 12);
        time_minutes = getRandomInt(0, (60 - minuteResolution) / minuteResolution) * minuteResolution;
    }
    clearInputs();
    disableInputs();
    const hours_deg = 360 * (time_hours / 12) + ((360 / 12) * (time_minutes / 60));
    const minutes_deg = (time_hours * 360) + 360 * (time_minutes / 60);
    CLOCK_HOUR.style.transform = `rotate(${hours_deg}deg)`;
    CLOCK_MINUTE.style.transform = `rotate(${minutes_deg}deg)`;
    setTimeout(() => {
        enableInputs();
    }, 2500);
}
function checkTime() {
    const check_hour = INPUT_HOUR.valueAsNumber;
    const check_minute = INPUT_MINUTE.valueAsNumber;
    if (isNaN(check_hour)) {
        INPUT_HOUR.style.backgroundColor = COLOR_GREEN;
        return;
    }
    else {
        INPUT_HOUR.style.backgroundColor = "";
    }
    if (isNaN(check_minute) || INPUT_MINUTE.value.length !== 2) {
        INPUT_MINUTE.style.backgroundColor = COLOR_ORANGE;
        INPUT_MINUTE.focus();
        INPUT_MINUTE.select();
        return;
    }
    else {
        INPUT_MINUTE.style.backgroundColor = "";
    }
    if (check_hour !== time_hours) {
        INPUT_HOUR.style.backgroundColor = COLOR_GREEN;
        incorrect();
        return;
    }
    INPUT_HOUR.style.backgroundColor = "";
    if (check_minute !== time_minutes) {
        INPUT_MINUTE.style.backgroundColor = COLOR_ORANGE;
        incorrect();
        return;
    }
    INPUT_MINUTE.style.backgroundColor = "";
    correct();
}
function showResponseImage(src, pos) {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const response = new Image();
    response.classList.add("response");
    response.onload = () => {
        response.classList.add("fadeIn");
        const newSize = resizeToFit(response.width, response.height, vw / 2, vh - 100);
        response.style.width = `${newSize.width}px`;
        response.style.height = `${newSize.height}px`;
        response.style[pos] = `${getRandomInt(vw / 2, vw - response.width)}px`;
        response.style.bottom = "-25px";
        setTimeout(() => {
            response.classList.remove("fadeIn");
            response.classList.add("fadeOut");
            setTimeout(() => {
                RESPONSES.removeChild(response);
            }, 2000);
        }, 1250);
    };
    response.src = src;
    RESPONSES.appendChild(response);
}
function correct() {
    const randomImage = CORRECT_IMAGES[getRandomInt(0, CORRECT_IMAGES.length - 1)];
    disableInputs();
    showResponseImage(randomImage, "left");
    setTimeout(getNewTime, 2500);
}
function incorrect() {
    const randomImage = INCORRECT_IMAGES[getRandomInt(0, CORRECT_IMAGES.length - 1)];
    disableInputs();
    showResponseImage(randomImage, "right");
    setTimeout(enableInputs, 2500);
}
