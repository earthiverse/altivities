import { uiWidgets } from "./global";

const TOPPINGS: {
    name: string
    file: string
}[] = [
    {
        name: "corn",
        file: "images/corn.png"
    },
    {
        name: "green pepper",
        file: "images/green pepper.png"
    },
    {
        name: "mushroom",
        file: "images/mushroom.png"
    },
    {
        name: "pineapple",
        file: "images/pineapple.png"
    },
    {
        name: "sausage",
        file: "images/sausage.png"
    },
    {
        name: "bacon",
        file: "images/bacon.png"
    },
    {
        name: "tomato",
        file: "images/tomato.png"
    },
    {
        name: "onion",
        file: "images/onion.png"
    }
]

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class SimpleGame {
    game: Phaser.Game
    static items: Phaser.GameObjects.Sprite[] = []

    constructor() {
        this.game = new Phaser.Game({
            backgroundColor: 0xFFFFFF,
            height: 600,
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.ScaleModes.FIT
            },
            scene: {
                create: this.create,
                preload: this.preload
            },
            type: Phaser.AUTO,
            width: 800
        })
    }

    preload(this: Phaser.Scene) {
        // Load topping images
        for(const topping of TOPPINGS) {
            this.load.image(topping.name, topping.file)
        }

        // Load pizza
        this.load.image("pizza", "images/pizza.png")

        // Load arrows
        this.load.image("left", "images/left.png")
        this.load.image("right", "images/right.png")
    }

    create(this: Phaser.Scene) {
        // Create Pizza
        const pizza = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 65, "pizza")
        pizza.setDepth(-100)
        const newRatioPizza = 400 / pizza.height
        pizza.setDisplaySize(newRatioPizza * pizza.width, newRatioPizza * pizza.height)

        // Create Food Wheel
        const x = this.cameras.main.centerX
        const y = this.cameras.main.centerY + 225
        const spacing = 300
        const toppingSprites: Phaser.GameObjects.Sprite[] = []
        for(let i = 0; i < TOPPINGS.length; i++) {
            const topping = TOPPINGS[i]
            const sprite = this.add.sprite(x, y, topping.name)
            const newRatio = 100 / sprite.height
            sprite.setDisplaySize(newRatio * sprite.width, newRatio * sprite.height)

            // When you click it, add a new draggable object to the parfait
            sprite.on("pointerdown", () => {
                const randomY = randomIntFromInterval(-150, 150) - 65
                const randomX = randomIntFromInterval(-150, 150)
                const randomSize = randomIntFromInterval(8, 12) / 10
                const randomAngle = randomIntFromInterval(-180, 180) * (Math.PI / 180)
                const newSprite = this.add.sprite(this.cameras.main.centerX + randomX, this.cameras.main.centerY + randomY, topping.name)
                newSprite.setDisplaySize(newRatio * randomSize * sprite.width, newRatio * randomSize * sprite.height)
                newSprite.setRotation(randomAngle)
                newSprite.setInteractive()
                newSprite.setActive(true)
                SimpleGame.items.push(newSprite)
                this.input.setDraggable(newSprite)
            })
            toppingSprites.push(sprite)
        }
        // Setup Draggable Logic
        this.input.on("drag", (pointer, draggingObject: Phaser.GameObjects.Sprite, dragX, dragY) => {
            console.log("dragging!")
            for(const item of SimpleGame.items) {
                item.setDepth(0)
            }
            draggingObject.setDepth(1)
            draggingObject.x = dragX
            draggingObject.y = dragY
        })
        const wheel = new uiWidgets.Wheel3D(
            this,
            {x: x, y: y - spacing},
            toppingSprites,
            0,
            spacing,
            "y",
            {"x": 0, "y": -90, "z": 0}
        )
        wheel.emitter.on("start", (wheel: uiWidgets.Wheel3D) => {
            for (let i = 0; i < TOPPINGS.length; i++) {
                wheel.sprites[i].alpha = 0.1
                wheel.sprites[i].disableInteractive()
            }
            wheel.active.alpha = 1
            wheel.active.setInteractive()
        })
        wheel.activate()
        const leftButton = new uiWidgets.Button(
            this,
            x - spacing - 60,
            y,
            "left",
            () => { wheel.moveBack() },
            null,
        )
        const newRatioLeft = 100 / leftButton.height
        leftButton.setDisplaySize(newRatioLeft * leftButton.width, newRatioLeft * leftButton.height)
        const rightButton = new uiWidgets.Button(
            this,
            x + spacing + 60,
            y,
            "right",
            () => { wheel.moveForward() },
            null,
        )
        const newRatioRight = 100 / leftButton.height
        rightButton.setDisplaySize(newRatioRight * rightButton.width, newRatioRight * rightButton.height)
    }
}

window.onload = () => {
    new SimpleGame();
}