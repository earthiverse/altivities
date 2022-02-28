"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FRUITS = [
    {
        file: "images/ice cream.png",
        name: "ice cream"
    },
    {
        file: "images/ice cream chocolate.png",
        name: "chocolate ice cream"
    },
    {
        file: "images/apple.png",
        name: "apple"
    },
    {
        file: "images/banana.png",
        name: "banana"
    },
    {
        file: "images/cherry.png",
        name: "cherry"
    },
    {
        file: "images/kiwi fruit.png",
        name: "kiwi fruit"
    },
    {
        file: "images/melon.png",
        name: "melon"
    },
    {
        file: "images/orange.png",
        name: "orange"
    },
    {
        file: "images/peach.png",
        name: "peach"
    },
    {
        file: "images/pineapple.png",
        name: "pineapple"
    },
    {
        file: "images/strawberry.png",
        name: "strawberry"
    }
];
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
class ParfaitGameLoadScene extends Phaser.Scene {
    constructor() {
        super({ key: ParfaitGameLoadScene.Key });
    }
    create() {
        this.scene.start(ParfaitGamePlayScene.Key);
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
            this.loadingFill.fillStyle(ParfaitGameLoadScene.LOAD_BAR_COLOR, 1);
            this.loadingFill.fillRect(250, 280, 300 * value, 30);
        });
        for (const fruit of FRUITS)
            this.load.image(fruit.name, fruit.file);
        this.load.image("glass_back", "images/glass_back.png");
        this.load.image("glass_front", "images/glass_front.png");
        this.load.image("left", "images/left.png");
        this.load.image("right", "images/right.png");
    }
}
ParfaitGameLoadScene.Key = "LOAD";
ParfaitGameLoadScene.LOAD_BAR_COLOR = 0x00AEEF;
class ParfaitGamePlayScene extends Phaser.Scene {
    constructor() {
        super({ key: ParfaitGamePlayScene.Key });
        this.items = [];
    }
    create() {
        const glassBack = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 50, "glass_back");
        glassBack.setDepth(-100);
        const newRatioGlass = 200 / glassBack.height;
        glassBack.setDisplaySize(newRatioGlass * glassBack.width, newRatioGlass * glassBack.height);
        const glassFront = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 50, "glass_front");
        glassFront.setDepth(1000);
        glassFront.setDisplaySize(newRatioGlass * glassFront.width, newRatioGlass * glassFront.height);
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY + 225;
        const spacing = 300;
        const fruitSprites = [];
        for (let i = 0; i < FRUITS.length; i++) {
            const fruit = FRUITS[i];
            const sprite = this.add.sprite(x, y, fruit.name);
            const newRatio = 100 / sprite.height;
            sprite.setDisplaySize(newRatio * sprite.width, newRatio * sprite.height);
            sprite.on("pointerdown", () => {
                const offsetY = this.items.length * 5;
                const randomX = randomIntFromInterval(-40, 40);
                const randomSize = randomIntFromInterval(8, 12) / 10;
                const randomAngle = randomIntFromInterval(-45, 45) * (Math.PI / 180);
                const newSprite = this.add.sprite(this.cameras.main.centerX + randomX, this.cameras.main.centerY - 25 - offsetY, fruit.name);
                newSprite.setDisplaySize(newRatio * randomSize * sprite.width, newRatio * randomSize * sprite.height);
                newSprite.setRotation(randomAngle);
                newSprite.setInteractive({ cursor: "pointer" });
                newSprite.setActive(true);
                this.items.push(newSprite);
                this.input.setDraggable(newSprite);
            });
            fruitSprites.push(sprite);
        }
        const wheel = new uiWidgets.Wheel3D(this, { x: x, y: y - spacing }, fruitSprites, 0, spacing, "y", { "x": 0, "y": -90, "z": 0 });
        wheel.emitter.on("start", (wheel) => {
            for (let i = 0; i < FRUITS.length; i++) {
                wheel.sprites[i].alpha = 0.1;
                wheel.sprites[i].disableInteractive();
            }
            wheel.active.alpha = 1;
            wheel.active.setInteractive();
        });
        wheel.activate();
        const leftButton = new uiWidgets.Button(this, x - spacing - 60, y, "left", () => { wheel.moveBack(); }, null);
        const newRatioLeft = 100 / leftButton.height;
        leftButton.setDisplaySize(newRatioLeft * leftButton.width, newRatioLeft * leftButton.height);
        const rightButton = new uiWidgets.Button(this, x + spacing + 60, y, "right", () => { wheel.moveForward(); }, null);
        const newRatioRight = 100 / leftButton.height;
        rightButton.setDisplaySize(newRatioRight * rightButton.width, newRatioRight * rightButton.height);
        this.input.on("drag", (_pointer, draggingObject, dragX, dragY) => {
            console.log("dragging!");
            for (const item of this.items) {
                item.setDepth(0);
            }
            draggingObject.setDepth(1);
            draggingObject.x = dragX;
            draggingObject.y = dragY;
        });
    }
    init() {
        this.items = [];
    }
}
ParfaitGamePlayScene.Key = "PLAY";
class ParfaitGame {
    constructor() {
        this.game = new Phaser.Game({
            backgroundColor: 0xFFFFFF,
            height: ParfaitGame.HEIGHT,
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.ScaleModes.FIT,
                parent: "game"
            },
            scene: [ParfaitGameLoadScene, ParfaitGamePlayScene],
            type: Phaser.AUTO,
            width: ParfaitGame.WIDTH
        });
    }
}
ParfaitGame.WIDTH = 800;
ParfaitGame.HEIGHT = 600;
window.onload = () => {
    new ParfaitGame();
};
