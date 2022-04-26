"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BLACK = Phaser.Display.Color.ValueToColor(0x000000);
const LIGHT_GREEN = Phaser.Display.Color.ValueToColor(0xC4DF9B);
const DARK_GREEN = Phaser.Display.Color.ValueToColor(0x697753);
const RED = Phaser.Display.Color.ValueToColor(0xF94C56);
const LOCAL_STORAGE_MODE = "kanarace_mode";
const LOCAL_STORAGE_TIMES = "kanarace_times";
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
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
class BasicButton extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, 0, 0, config.key, 2);
        this._enabled = false;
        this.config = config;
        if (!config.scene)
            throw new Error("config.scene is not set");
        if (!config.key)
            throw new Error("config.key is not set");
        if (!config.enabled)
            config.enabled = 1;
        if (!config.disabled)
            config.disabled = 2;
        if (!config.over)
            config.over = 0;
        if (config.x)
            this.x = config.x;
        if (config.y)
            this.y = config.y;
        config.scene.add.existing(this);
        this.setInteractive({ cursor: "pointer" });
        this.on("pointerdown", this.onDown, this);
        this.on("pointerover", this.onOver, this);
        this.on("pointerout", this.onOut, this);
        this.setDisabled();
        this.setOrigin(0, 0);
    }
    get enabled() {
        return this._enabled;
    }
    onDown() {
        this.setFrame(this.config.enabled);
    }
    onOver() {
        if (this._enabled)
            this.setFrame(this.config.enabled);
        else
            this.setFrame(this.config.over);
    }
    onOut() {
        if (this._enabled)
            this.setFrame(this.config.enabled);
        else
            this.setFrame(this.config.disabled);
    }
    setEnabled() {
        this._enabled = true;
        this.setFrame(this.config.enabled);
    }
    setDisabled() {
        this._enabled = false;
        this.setFrame(this.config.disabled);
    }
}
class KanaRaceLoadScene extends Phaser.Scene {
    constructor() {
        super({ key: KanaRaceLoadScene.Key });
    }
    create() {
        this.scene.start(KanaRaceMenuScene.Key);
    }
    preload() {
        const loadingText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, "Loading...");
        loadingText.setOrigin(0.5, 0.5);
        loadingText.setColor("#000000");
        loadingText.setFontFamily("Arial");
        loadingText.setFontSize(30);
        this.loadingBack = this.add.graphics();
        this.loadingBack.fillStyle(0x000000, 1);
        this.loadingBack.fillRect(240, 270, 320, 50);
        this.loadingFill = this.add.graphics();
        this.load.on("progress", (value) => {
            this.loadingFill.clear();
            this.loadingFill.fillStyle(0xC4DF9B, 1);
            this.loadingFill.fillRect(250, 280, 300 * value, 30);
        });
        for (const char of KanaRace.HiraganaLetters)
            this.load.image(char, `images/hiragana/${char}.svg`);
        for (const char of KanaRace.KatakanaLetters)
            this.load.image(char, `images/katakana/${char}.svg`);
        for (const number of ["three", "two", "one"])
            this.load.image(number, `images/numbers/${number}.svg`);
        this.load.image("logo", "images/logo.png");
        this.load.image("timer", "images/timer.svg");
        this.load.spritesheet("lowercase_buttons", "images/lowercase_buttons.png", { frameHeight: 160, frameWidth: 210 });
        this.load.spritesheet("random_buttons", "images/random_buttons.png", { frameHeight: 160, frameWidth: 210 });
        this.load.spritesheet("uppercase_buttons", "images/uppercase_buttons.png", { frameHeight: 160, frameWidth: 210 });
        this.load.spritesheet("start_buttons", "images/start_buttons.png", { frameHeight: 210, frameWidth: 610 });
        this.load.spritesheet("menu_buttons", "images/menu_buttons.png", { frameHeight: 210, frameWidth: 610 });
        this.load.audio("menu_bgm", "sounds/menu_bgm.mp3");
        for (const letter of KanaRace.HiraganaLetters)
            this.load.audio(`${letter}_f`, `sounds/${letter}_f.mp3`);
        this.load.audio("countdown", "sounds/countdown.mp3");
        this.load.audio("menu_switch", "sounds/menu_switch.mp3");
        this.load.audio("ng", "sounds/ng.mp3");
        this.load.audio("ok", "sounds/ok.mp3");
        this.load.audio("start", "sounds/start.mp3");
        this.load.audio("finish", "sounds/finish.mp3");
        this.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js");
    }
}
KanaRaceLoadScene.Key = "LOAD";
class KanaRaceMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: KanaRaceMenuScene.Key });
    }
    create() {
        this.add.sprite(0, 0, "logo").setOrigin(0, 0);
        this.sound.play("menu_bgm", {
            loop: true,
            volume: 0.5
        });
        const katakanaButton = new BasicButton({
            "key": "lowercase_buttons",
            "scene": this,
            "x": 40,
            "y": 205
        });
        const hiraganaButton = new BasicButton({
            "key": "uppercase_buttons",
            "scene": this,
            "x": 295,
            "y": 205
        });
        const randomButton = new BasicButton({
            "key": "random_buttons",
            "scene": this,
            "x": 550,
            "y": 205
        });
        katakanaButton.on("pointerdown", () => {
            this.sound.play("menu_switch");
            katakanaButton.setEnabled();
            hiraganaButton.setDisabled();
            randomButton.setDisabled();
        });
        hiraganaButton.on("pointerdown", () => {
            this.sound.play("menu_switch");
            katakanaButton.setDisabled();
            hiraganaButton.setEnabled();
            randomButton.setDisabled();
        });
        randomButton.on("pointerdown", () => {
            this.sound.play("menu_switch");
            katakanaButton.setDisabled();
            hiraganaButton.setDisabled();
            randomButton.setEnabled();
        });
        switch (localStorage.getItem(LOCAL_STORAGE_MODE)) {
            case "lowercase":
                katakanaButton.setEnabled();
                break;
            case "uppercase":
            default:
                hiraganaButton.setEnabled();
                break;
            case "random":
                randomButton.setEnabled();
                break;
        }
        const timesString = localStorage.getItem(LOCAL_STORAGE_TIMES);
        let timesObject = {};
        if (timesString)
            timesObject = JSON.parse(timesString);
        const addBestText = (x, y, time) => {
            const secondsElapsed = ((time / 1000) % 60).toFixed(2).padStart(5, "0");
            const bestText = this.add.text(x, y, `Best: ${secondsElapsed}`);
            bestText.setFontFamily("Orbitron");
            bestText.setFontSize(18);
            bestText.setFontStyle("bold");
            bestText.setColor("#697753");
        };
        if (timesObject.katakana < 60000)
            addBestText(85, 185, timesObject.katakana);
        if (timesObject.hiragana < 60000)
            addBestText(340, 185, timesObject.hiragana);
        if (timesObject.random < 60000)
            addBestText(595, 185, timesObject.random);
        const startButton = new BasicButton({
            "key": "start_buttons",
            "scene": this,
            "x": 95,
            "y": 380
        });
        startButton.on("pointerup", () => {
            let args;
            if (katakanaButton.enabled) {
                args = {
                    mode: "katakana"
                };
                localStorage.setItem(LOCAL_STORAGE_MODE, "katakana");
            }
            else if (hiraganaButton.enabled) {
                args = {
                    mode: "hiragana"
                };
                localStorage.setItem(LOCAL_STORAGE_MODE, "hiragana");
            }
            else if (randomButton.enabled) {
                args = {
                    mode: "random"
                };
                localStorage.setItem(LOCAL_STORAGE_MODE, "random");
            }
            else {
                throw new Error("Something went wrong. We don't know what game mode to use.");
            }
            this.sound.stopByKey("menu_bgm");
            this.scene.start(KanaRacePlayScene.Key, args);
        });
    }
}
KanaRaceMenuScene.Key = "MENU";
class KanaRacePlayScene extends Phaser.Scene {
    constructor() {
        super({ key: KanaRacePlayScene.Key });
    }
    create() {
        this.countdown = this.time.delayedCall(3000, undefined, undefined, this);
        let columns = 1;
        let rows = 1;
        while (columns * rows < 26) {
            const columnWidth = KanaRace.WIDTH / columns;
            const rowHeight = KanaRace.HEIGHT / rows;
            if (columnWidth > rowHeight)
                columns *= 2;
            else
                rows *= 2;
        }
        const boxes = [...this.letters];
        while (boxes.length < columns * rows)
            boxes.push(undefined);
        shuffle(boxes);
        const timerHeight = 100;
        const timer = this.add.sprite(20, 25, "timer").setOrigin(0, 0);
        timer.setScale(60 / timer.height);
        this.timerText = this.add.text(80, 20, "00:00.00").setOrigin(0, 0);
        this.timerText.setFontFamily("Orbitron");
        this.timerText.setFontSize(60);
        this.timerText.setColor("#000000");
        const columnWidth = KanaRace.WIDTH / columns;
        const rowHeight = (KanaRace.HEIGHT - timerHeight) / rows;
        let minScale = 1;
        for (let i = 0; i < columns * rows; i++) {
            const box = boxes[i];
            if (!box)
                continue;
            const x = (i % columns * columnWidth) + columnWidth / 2;
            const y = timerHeight + (Math.floor(i / columns) * rowHeight) + rowHeight / 2;
            const letterSprite = this.add.sprite(x, y, box);
            this.letterSprites.push(letterSprite);
            const scale = Math.min(rowHeight / letterSprite.height, columnWidth / letterSprite.width) * 0.9;
            if (minScale > scale)
                minScale = scale;
            const rotation = getRandomNumber(-15, 15) * (Math.PI / 180);
            letterSprite.setRotation(rotation);
            letterSprite.setInteractive({ cursor: "pointer" });
            const maxLength = Math.max(letterSprite.width, letterSprite.height);
            letterSprite.input.hitArea.setTo(-(maxLength - letterSprite.width) / 2, -(maxLength - letterSprite.height) / 2, maxLength, maxLength);
            letterSprite.on("pointerdown", () => {
                const hit = letterSprite.texture.key;
                const target = this.letters[this.currentLetter];
                this.sound.play(`${hit.toLowerCase()}_f`);
                if (target == hit) {
                    letterSprite.removeInteractive();
                    this.tweens.add({
                        alpha: 0.75,
                        duration: 250,
                        ease: Phaser.Math.Easing.Sine.InOut,
                        targets: [letterSprite]
                    });
                    this.tweens.addCounter({
                        duration: 250,
                        ease: Phaser.Math.Easing.Sine.InOut,
                        from: 0,
                        onUpdate: (tween) => {
                            const value = tween.getValue();
                            const newColor = Phaser.Display.Color.Interpolate.ColorWithColor(BLACK, DARK_GREEN, 100, value);
                            const newColorN = Phaser.Display.Color.GetColor(newColor.r, newColor.g, newColor.b);
                            letterSprite.setTintFill(newColorN);
                            letterSprite.setAlpha(1 - 0.2 * value / 100);
                        },
                        to: 100,
                    });
                    this.currentLetter += 1;
                    this.sound.play("ok");
                    if (this.lastCorrect) {
                        const toFade = this.lastCorrect;
                        this.tweens.addCounter({
                            duration: 250,
                            ease: Phaser.Math.Easing.Sine.InOut,
                            from: 0,
                            onUpdate: (tween) => {
                                const value = tween.getValue();
                                toFade.setAlpha(1 - 0.8 * value / 100);
                            },
                            to: 100,
                        });
                    }
                    this.lastCorrect = letterSprite;
                    if (this.currentLetter == 26) {
                        this.sound.play("finish", {
                            volume: 0.5
                        });
                        this.scene.start(KanaRaceResultsScene.Key, {
                            mode: this.mode,
                            numMistakes: this.numMistakes,
                            timeElapsed: Date.now() - this.startTime
                        });
                    }
                    this.numMistakesConcurrent = 0;
                }
                else {
                    if (this.numMistakesConcurrent >= 5) {
                        let correctLetterSprite;
                        for (const sprite of this.letterSprites) {
                            if (sprite.texture.key == target) {
                                correctLetterSprite = sprite;
                                break;
                            }
                        }
                        this.tweens.add({
                            duration: 250,
                            ease: Phaser.Math.Easing.Sine.InOut,
                            targets: [correctLetterSprite]
                        });
                        this.tweens.addCounter({
                            duration: 250,
                            ease: Phaser.Math.Easing.Sine.InOut,
                            from: 0,
                            onUpdate: (tween) => {
                                const value = tween.getValue();
                                const newColor = Phaser.Display.Color.Interpolate.ColorWithColor(BLACK, RED, 100, value);
                                const newColorN = Phaser.Display.Color.GetColor(newColor.r, newColor.g, newColor.b);
                                correctLetterSprite.setTintFill(newColorN);
                            },
                            to: 100,
                        });
                    }
                    else {
                        this.sound.play("ng");
                        this.numMistakes += 1;
                        this.numMistakesConcurrent += 1;
                    }
                }
            });
            letterSprite.disableInteractive();
        }
        for (const sprite of this.letterSprites)
            sprite.setScale(minScale);
        this.countdownCover = this.add.rectangle(0, 0, KanaRace.WIDTH, KanaRace.HEIGHT, 0xFFFFFF).setOrigin(0, 0);
        this.countdownCover.setDepth(1);
    }
    init(data) {
        this.lastCorrect = undefined;
        this.letterSprites = [];
        this.currentLetter = 0;
        this.numMistakes = 0;
        this.numMistakesConcurrent = 0;
        this.mode = data.mode;
        switch (data.mode) {
            case "hiragana": {
                this.letters = KanaRace.HiraganaLetters;
                break;
            }
            case "katakana": {
                this.letters = KanaRace.KatakanaLetters;
                break;
            }
            case "random": {
                const letters = [];
                for (let i = 0; i < 26; i++) {
                    const random = Math.round(Math.random());
                    if (random < 0.5) {
                        letters.push(KanaRace.HiraganaLetters[i]);
                    }
                    else {
                        letters.push(KanaRace.KatakanaLetters[i]);
                    }
                }
                this.letters = letters;
                break;
            }
        }
    }
    update(time, delta) {
        if (this.countdown) {
            const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
            const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
            const countdownImages = ["three", "two", "one"];
            const countdownProgress = this.countdown.getProgress();
            const countdownProgressI = Math.floor(countdownImages.length * countdownProgress);
            const countdownProgressToNextI = (countdownImages.length * countdownProgress) - countdownProgressI;
            this.countdownCover.setAlpha(1 - countdownProgress);
            if (this.countdownImageI === undefined) {
                this.countdownImageI = countdownProgressI;
                this.countdownImage = this.add.sprite(screenCenterX, screenCenterY, countdownImages[this.countdownImageI]);
                this.sound.play("countdown");
                this.countdownImage.setDepth(2);
                this.countdownImage.setScale(1 - countdownProgressToNextI);
                this.countdownImage.setAlpha(1 - countdownProgressToNextI);
            }
            else if (countdownProgressI == countdownImages.length) {
                this.countdownImage.destroy(true);
                delete this.countdown;
                this.sound.play("start");
                this.startTime = Date.now();
                for (const sprite of this.letterSprites)
                    sprite.setInteractive({ cursor: "pointer" });
            }
            else {
                if (this.countdownImageI !== countdownProgressI) {
                    this.countdownImage.destroy(true);
                    this.countdownImageI = countdownProgressI;
                    this.countdownImage = this.add.sprite(screenCenterX, screenCenterY, countdownImages[this.countdownImageI]);
                    this.sound.play("countdown");
                    this.countdownImage.setDepth(2);
                }
                this.countdownImage.setScale(1 - countdownProgressToNextI);
                this.countdownImage.setAlpha(1 - countdownProgressToNextI);
            }
            return;
        }
        const timeElapsed = Date.now() - this.startTime + (this.numMistakes * 1000);
        const secondsElapsed = ((timeElapsed / 1000) % 60).toFixed(2).padStart(5, "0");
        const minutesElapsed = Math.floor(timeElapsed / 1000 / 60).toString().padStart(2, "0");
        this.timerText.setText(`${minutesElapsed}:${secondsElapsed}`);
    }
}
KanaRacePlayScene.Key = "PLAY";
class KanaRaceResultsScene extends Phaser.Scene {
    constructor() {
        super({ key: KanaRaceResultsScene.Key });
    }
    create() {
        const logo = this.add.sprite(20, 80, "logo").setOrigin(0, 0);
        logo.setAlpha(0.1);
        const modeText = this.add.text(20, 50, `Mode: ${this.mode}`).setOrigin(0, 0);
        modeText.setFontFamily("Orbitron");
        modeText.setFontSize(60);
        modeText.setColor("#000000");
        const secondsElapsed = ((this.timeElapsed / 1000) % 60).toFixed(2).padStart(5, "0");
        const minutesElapsed = Math.floor(this.timeElapsed / 1000 / 60).toString().padStart(2, "0");
        const timerText = this.add.text(20, 110, `Elapsed: ${minutesElapsed}:${secondsElapsed}`).setOrigin(0, 0);
        timerText.setFontFamily("Orbitron");
        timerText.setFontSize(60);
        timerText.setColor("#333333");
        const mistakesText = this.add.text(20, 170, `Mistakes: ${this.numMistakes}`).setOrigin(0, 0);
        mistakesText.setFontFamily("Orbitron");
        mistakesText.setFontSize(60);
        mistakesText.setColor("#F94C56");
        const mistakesElapsed = this.timeElapsed + (this.numMistakes * 1000);
        const secondsElapsedM = ((mistakesElapsed / 1000) % 60).toFixed(2).padStart(5, "0");
        const minutesElapsedM = Math.floor(mistakesElapsed / 1000 / 60).toString().padStart(2, "0");
        const timerTextM = this.add.text(20, 230, `Total: ${minutesElapsedM}:${secondsElapsedM}`).setOrigin(0, 0);
        timerTextM.setFontFamily("Orbitron");
        timerTextM.setFontSize(80);
        timerTextM.setStyle({
            fontWeight: "bold"
        });
        timerTextM.setColor("#000000");
        const timesString = localStorage.getItem(LOCAL_STORAGE_TIMES);
        const timesObject = {};
        if (timesString) {
            const oldTimes = JSON.parse(timesString);
            timesObject.katakana = oldTimes.katakana;
            timesObject.hiragana = oldTimes.hiragana;
            timesObject.random = oldTimes.random;
        }
        if (mistakesElapsed < (timesObject[this.mode] ?? Number.MAX_VALUE)) {
            timesObject[this.mode] = mistakesElapsed;
            localStorage.setItem(LOCAL_STORAGE_TIMES, JSON.stringify(timesObject));
        }
        const menuButton = new BasicButton({
            "key": "menu_buttons",
            "scene": this,
            "x": 95,
            "y": 380
        });
        menuButton.setAlpha(0);
        menuButton.setInteractive({ cursor: "pointer" });
        menuButton.on("pointerup", () => {
            this.scene.start(KanaRaceMenuScene.Key);
        });
        menuButton.disableInteractive();
        this.tweens.addCounter({
            duration: 500,
            ease: Phaser.Math.Easing.Sine.InOut,
            from: 0,
            onUpdate: (tween) => {
                const value = tween.getValue();
                menuButton.setAlpha(value / 100);
                if (value == 100)
                    menuButton.setInteractive({ cursor: "pointer" });
            },
            to: 100,
        });
    }
    init(data) {
        this.mode = data.mode;
        this.numMistakes = data.numMistakes;
        this.timeElapsed = data.timeElapsed;
    }
}
KanaRaceResultsScene.Key = "RESULTS";
class KanaRace {
    constructor() {
        this.game = new Phaser.Game({
            backgroundColor: 0xFFFFFF,
            height: KanaRace.HEIGHT,
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.ScaleModes.FIT,
                parent: "game"
            },
            scene: [KanaRaceLoadScene, KanaRaceMenuScene, KanaRacePlayScene, KanaRaceResultsScene],
            type: Phaser.AUTO,
            width: KanaRace.WIDTH
        });
    }
}
KanaRace.KatakanaLetters = [..."アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン"];
KanaRace.HiraganaLetters = [..."あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわん"];
KanaRace.WIDTH = 800;
KanaRace.HEIGHT = 600;
window.onload = () => {
    new KanaRace();
};
