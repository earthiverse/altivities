const FRUITS: {
    name: string
    file: string
}[] = [
    {
        name: "ice cream",
        file: "images/ice cream.png"
    },
    {
        name: "chocolate ice cream",
        file: "images/ice cream chocolate.png"
    },
    {
        name: "apple",
        file: "images/apple.png"
    },
    {
        name: "banana",
        file: "images/banana.png"
    },
    {
        name: "cherry",
        file: "images/cherry.png"
    },
    {
        name: "kiwi fruit",
        file: "images/kiwi fruit.png"
    },
    {
        name: "melon",
        file: "images/melon.png"
    },
    {
        name: "orange",
        file: "images/orange.png"
    },
    {
        name: "peach",
        file: "images/peach.png"
    },
    {
        name: "pineapple",
        file: "images/pineapple.png"
    },
    {
        name: "strawberry",
        file: "images/strawberry.png"
    }
]

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class ParfaitGame {
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
        // Load fruit images
        for(const fruit of FRUITS) {
            this.load.image(fruit.name, fruit.file)
        }

        // Load Glass
        this.load.image("glass_back", "images/glass_back.png")
        this.load.image("glass_front", "images/glass_front.png")

        // Load arrows
        this.load.image("left", "images/left.png")
        this.load.image("right", "images/right.png")
    }

    create(this: Phaser.Scene) {
        // this.add.sprite(200, 200, "logo")

        // Create Glass
        const glassBack = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 50, "glass_back")
        glassBack.setDepth(-100)
        const newRatioGlass = 200 / glassBack.height
        glassBack.setDisplaySize(newRatioGlass * glassBack.width, newRatioGlass * glassBack.height)
        const glassFront = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 50, "glass_front")
        glassFront.setDepth(1000)
        glassFront.setDisplaySize(newRatioGlass * glassFront.width, newRatioGlass * glassFront.height)

        // Create Food Wheel
        const x = this.cameras.main.centerX
        const y = this.cameras.main.centerY + 225
        const spacing = 300
        const fruitSprites: Phaser.GameObjects.Sprite[] = []
        for(let i = 0; i < FRUITS.length; i++) {
            const fruit = FRUITS[i]
            const sprite = this.add.sprite(x, y, fruit.name)
            const newRatio = 100 / sprite.height
            sprite.setDisplaySize(newRatio * sprite.width, newRatio * sprite.height)

            // When you click it, add a new draggable object to the parfait
            sprite.on("pointerdown", () => {
                const offsetY = ParfaitGame.items.length * 5
                const randomX = randomIntFromInterval(-40, 40)
                const randomSize = randomIntFromInterval(8, 12) / 10
                const randomAngle = randomIntFromInterval(-45, 45) * (Math.PI / 180)
                const newSprite = this.add.sprite(this.cameras.main.centerX + randomX, this.cameras.main.centerY - 25 - offsetY, fruit.name)
                newSprite.setDisplaySize(newRatio * randomSize * sprite.width, newRatio * randomSize * sprite.height)
                newSprite.setRotation(randomAngle)
                newSprite.setInteractive()
                newSprite.setActive(true)
                ParfaitGame.items.push(newSprite)
                this.input.setDraggable(newSprite)
            })
            fruitSprites.push(sprite)
        }
        // Setup Draggable Logic
        this.input.on("drag", (pointer, draggingObject: Phaser.GameObjects.Sprite, dragX, dragY) => {
            console.log("dragging!")
            for(const item of ParfaitGame.items) {
                item.setDepth(0)
            }
            draggingObject.setDepth(1)
            draggingObject.x = dragX
            draggingObject.y = dragY
        })
        const wheel = new uiWidgets.Wheel3D(
            this,
            {x: x, y: y - spacing},
            fruitSprites,
            0,
            spacing,
            "y",
            {"x": 0, "y": -90, "z": 0}
        )
        wheel.emitter.on("start", (wheel: uiWidgets.Wheel3D) => {
            for (let i = 0; i < FRUITS.length; i++) {
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
    new ParfaitGame();
}

export {}