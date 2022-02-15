"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TOPPINGS = [
    {
        file: "images/corn.png",
        name: "corn"
    },
    {
        file: "images/green pepper.png",
        name: "green pepper"
    },
    {
        file: "images/mushroom.png",
        name: "mushroom"
    },
    {
        file: "images/pineapple.png",
        name: "pineapple"
    },
    {
        file: "images/tomato.png",
        name: "tomato"
    },
    {
        file: "images/onion.png",
        name: "onion"
    },
    {
        file: "images/broccoli.png",
        name: "broccoli"
    },
    {
        file: "images/potato.png",
        name: "potato"
    },
    {
        file: "images/sausage.png",
        name: "sausage"
    },
    {
        file: "images/bacon.png",
        name: "bacon"
    },
    {
        file: "images/shrimp.png",
        name: "shrimp"
    }
];
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
class PizzaGameLoadScene extends Phaser.Scene {
    constructor() {
        super({ key: PizzaGameLoadScene.Key });
    }
    create() {
        this.scene.start(PizzaGamePlayScene.Key);
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
            this.loadingFill.fillStyle(PizzaGameLoadScene.LOAD_BAR_COLOR, 1);
            this.loadingFill.fillRect(250, 280, 300 * value, 30);
        });
        for (const topping of TOPPINGS)
            this.load.image(topping.name, topping.file);
        this.load.image("pizza", "images/pizza.png");
        this.load.image("left", "images/left.png");
        this.load.image("right", "images/right.png");
    }
}
PizzaGameLoadScene.Key = "LOAD";
PizzaGameLoadScene.LOAD_BAR_COLOR = 0xAC7849;
class PizzaGamePlayScene extends Phaser.Scene {
    constructor() {
        super({ key: PizzaGamePlayScene.Key });
        this.items = [];
    }
    create() {
        const pizza = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 65, "pizza");
        pizza.setDepth(-100);
        const newRatioPizza = 400 / pizza.height;
        pizza.setDisplaySize(newRatioPizza * pizza.width, newRatioPizza * pizza.height);
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY + 225;
        const spacing = 300;
        const toppingSprites = [];
        for (let i = 0; i < TOPPINGS.length; i++) {
            const topping = TOPPINGS[i];
            const sprite = this.add.sprite(x, y, topping.name);
            const newRatio = 100 / sprite.height;
            sprite.setDisplaySize(newRatio * sprite.width, newRatio * sprite.height);
            sprite.on("pointerdown", () => {
                const randomY = randomIntFromInterval(-150, 150) - 65;
                const randomX = randomIntFromInterval(-150, 150);
                const randomSize = randomIntFromInterval(8, 12) / 10;
                const randomAngle = randomIntFromInterval(-180, 180) * (Math.PI / 180);
                const newSprite = this.add.sprite(this.cameras.main.centerX + randomX, this.cameras.main.centerY + randomY, topping.name);
                newSprite.setDisplaySize(newRatio * randomSize * sprite.width, newRatio * randomSize * sprite.height);
                newSprite.setRotation(randomAngle);
                newSprite.setInteractive();
                newSprite.setActive(true);
                this.items.push(newSprite);
                this.input.setDraggable(newSprite);
            });
            toppingSprites.push(sprite);
        }
        const wheel = new uiWidgets.Wheel3D(this, { x: x, y: y - spacing }, toppingSprites, 0, spacing, "y", { "x": 0, "y": -90, "z": 0 });
        wheel.emitter.on("start", (wheel) => {
            for (let i = 0; i < TOPPINGS.length; i++) {
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
PizzaGamePlayScene.Key = "PLAY";
class PizzaGame {
    constructor() {
        this.game = new Phaser.Game({
            backgroundColor: 0xFFFFFF,
            height: PizzaGame.HEIGHT,
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.ScaleModes.FIT,
                parent: "game"
            },
            scene: [PizzaGameLoadScene, PizzaGamePlayScene],
            type: Phaser.AUTO,
            width: PizzaGame.WIDTH
        });
    }
}
PizzaGame.WIDTH = 800;
PizzaGame.HEIGHT = 600;
window.onload = () => {
    new PizzaGame();
};
