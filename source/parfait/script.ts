const FRUITS: {
    name: string
    file: string
}[] = [
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
]

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

class ParfaitGameLoadScene extends Phaser.Scene {
    static Key = "LOAD"
    static LOAD_BAR_COLOR = 0x00AEEF

    private loadingBack: Phaser.GameObjects.Graphics
    private loadingFill: Phaser.GameObjects.Graphics

    constructor() {
        super({ key: ParfaitGameLoadScene.Key })
    }

    create() {
        this.scene.start(ParfaitGamePlayScene.Key)
    }

    preload() {
        const loadingText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, "Loading...")
        loadingText.setOrigin(0.5, 0.5)
        loadingText.setColor("#000000")
        loadingText.setFontFamily("Arial")
        loadingText.setFontSize(30)

        this.loadingBack = this.add.graphics()
        this.loadingBack.fillStyle(0x000000, 1)
        this.loadingBack.fillRect(240, 270, 320, 50)

        this.loadingFill = this.add.graphics()
        this.load.on("progress", (value) => {
            this.loadingFill.clear()
            this.loadingFill.fillStyle(ParfaitGameLoadScene.LOAD_BAR_COLOR, 1)
            this.loadingFill.fillRect(250, 280, 300 * value, 30)
        })

        // Load fruit images
        for (const fruit of FRUITS) this.load.image(fruit.name, fruit.file)

        // Load Glass
        this.load.image("glass_back", "images/glass_back.png")
        this.load.image("glass_front", "images/glass_front.png")

        // Load arrows
        this.load.image("left", "images/left.png")
        this.load.image("right", "images/right.png")
    }
}

class ParfaitGamePlayScene extends Phaser.Scene {
    static Key = "PLAY"

    private items: Phaser.GameObjects.Sprite[] = []

    constructor() {
        super({ key: ParfaitGamePlayScene.Key })
    }

    create() {
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
        for (let i = 0; i < FRUITS.length; i++) {
            const fruit = FRUITS[i]
            const sprite = this.add.sprite(x, y, fruit.name)
            const newRatio = 100 / sprite.height
            sprite.setDisplaySize(newRatio * sprite.width, newRatio * sprite.height)

            // When you click it, add a new draggable object to the parfait
            sprite.on("pointerdown", () => {
                const offsetY = this.items.length * 5
                const randomX = randomIntFromInterval(-40, 40)
                const randomSize = randomIntFromInterval(8, 12) / 10
                const randomAngle = randomIntFromInterval(-45, 45) * (Math.PI / 180)
                const newSprite = this.add.sprite(this.cameras.main.centerX + randomX, this.cameras.main.centerY - 25 - offsetY, fruit.name)
                newSprite.setDisplaySize(newRatio * randomSize * sprite.width, newRatio * randomSize * sprite.height)
                newSprite.setRotation(randomAngle)
                newSprite.setInteractive({ cursor: "pointer" })
                newSprite.setActive(true)
                this.items.push(newSprite)
                this.input.setDraggable(newSprite)
            })
            fruitSprites.push(sprite)
        }
        const wheel = new uiWidgets.Wheel3D(
            this,
            { x: x, y: y - spacing },
            fruitSprites,
            0,
            spacing,
            "y",
            { "x": 0, "y": -90, "z": 0 }
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

        // Setup Draggable Logic
        this.input.on("drag", (_pointer, draggingObject: Phaser.GameObjects.Sprite, dragX, dragY) => {
            console.log("dragging!")
            for (const item of this.items) {
                item.setDepth(0)
            }
            draggingObject.setDepth(1)
            draggingObject.x = dragX
            draggingObject.y = dragY
        })
    }

    init() {
        // Reset Variables
        this.items = []
    }
}

class ParfaitGame {
    static WIDTH = 800
    static HEIGHT = 600

    game: Phaser.Game

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
        })
    }
}

window.onload = () => {
    new ParfaitGame()
}

export {}