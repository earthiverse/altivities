type ButtonConfig = {
    key: string
    scene: Phaser.Scene
    enabled?: number
    disabled?: number
    over?: number
    x?: number
    y?: number
}

type PlayData = {
    mode: "lowercase" | "uppercase" | "random"
}

// Based on https://phasergames.com/how-to-make-buttons-in-phaser-3/
class BasicButton extends Phaser.GameObjects.Sprite {
    private config: ButtonConfig
    private _enabled = false

    constructor(config: ButtonConfig) {
        //call the constructor of the parent
        //set at 0,0 in case there is no x and y
        //in the config
        super(config.scene, 0, 0, config.key, 2)

        this.config = config

        //check if config contains a scene
        if (!config.scene) throw new Error("config.scene is not set")

        //check if config contains a key
        if (!config.key) throw new Error("config.key is not set")

        //if there is no up property assume 0
        if (!config.enabled) config.enabled = 1

        //if there is no down in config use up
        if (!config.disabled) config.disabled = 2

        //if there is no over in config use up
        if (!config.over) config.over = 0

        // set x and y
        if (config.x) this.x = config.x
        if (config.y) this.y = config.y

        // add to the scene
        config.scene.add.existing(this)

        //make interactive and set listeners
        this.setInteractive()
        this.on("pointerdown", this.onDown, this)
        this.on("pointerover", this.onOver, this)
        this.on("pointerout", this.onOut, this)
        this.setDisabled()

        this.setOrigin(0, 0)
    }

    get enabled() {
        return this._enabled
    }

    onDown() {
        this.setFrame(this.config.enabled)
    }
    onOver() {
        if (this._enabled) this.setFrame(this.config.enabled)
        else this.setFrame(this.config.over)
    }
    onOut() {
        if (this._enabled) this.setFrame(this.config.enabled)
        else this.setFrame(this.config.disabled)
    }

    public setEnabled() {
        this._enabled = true
        this.setFrame(this.config.enabled)
    }

    public setDisabled() {
        this._enabled = false
        this.setFrame(this.config.disabled)
    }
}

class ABCRaceLoadScene extends Phaser.Scene {
    static Key = "LOAD"
    constructor() {
        super({ key: ABCRaceLoadScene.Key })
    }

    create() {
        this.scene.start(ABCRaceMenuScene.Key)
    }

    preload() {
        // Load Letters and Numbers
        for (const letter of ABCRace.LowercaseLetters) this.load.image(letter, `images/lower/${letter}.svg`)
        for (const letter of ABCRace.UppercaseLetters) this.load.image(letter, `images/upper/${letter}.svg`)
        for (const number of ["three", "two", "one"]) this.load.image(number, `images/numbers/${number}.svg`)

        // Load Logo
        this.load.image("logo", "images/logo.png")

        // Load Buttons
        this.load.spritesheet("lowercase_buttons", "images/lowercase_buttons.png", { frameHeight: 160, frameWidth: 210 })
        this.load.spritesheet("random_buttons", "images/random_buttons.png", { frameHeight: 160, frameWidth: 210 })
        this.load.spritesheet("uppercase_buttons", "images/uppercase_buttons.png", { frameHeight: 160, frameWidth: 210 })
        this.load.spritesheet("start_buttons", "images/start_buttons.png", { frameHeight: 210, frameWidth: 610 })

        // Load Music
        // Of Far Different Nature - Summer House [v2]
        // https://fardifferent.itch.io/loops
        this.load.audio("menu_bgm", "sounds/menu_bgm.ogg")
    }
}

class ABCRaceMenuScene extends Phaser.Scene {
    static Key = "MENU"
    constructor() {
        super({ key: ABCRaceMenuScene.Key })
    }

    create() {
        this.add.sprite(0, 0, "logo").setOrigin(0, 0)
        this.sound.play("menu_bgm", { loop: true })

        const lowercaseButton = new BasicButton({
            "key": "lowercase_buttons",
            "scene": this,
            "x": 40,
            "y": 205
        })

        const uppercaseButton = new BasicButton({
            "key": "uppercase_buttons",
            "scene": this,
            "x": 295,
            "y": 205
        })

        const randomButton = new BasicButton({
            "key": "random_buttons",
            "scene": this,
            "x": 550,
            "y": 205
        })

        lowercaseButton.on("pointerdown", () => {
            lowercaseButton.setEnabled()
            uppercaseButton.setDisabled()
            randomButton.setDisabled()
        })
        uppercaseButton.on("pointerdown", () => {
            lowercaseButton.setDisabled()
            uppercaseButton.setEnabled()
            randomButton.setDisabled()
        })
        randomButton.on("pointerdown", () => {
            lowercaseButton.setDisabled()
            uppercaseButton.setDisabled()
            randomButton.setEnabled()
        })
        uppercaseButton.setEnabled()

        const startButton = new BasicButton({
            "key": "start_buttons",
            "scene": this,
            "x": 95,
            "y": 380
        })
        startButton.on("pointerup", () => {
            let args: PlayData

            if (lowercaseButton.enabled) {
                args = {
                    mode: "lowercase"
                }
            } else if (uppercaseButton.enabled) {
                args = {
                    mode: "uppercase"
                }
            } else if (randomButton.enabled) {
                args = {
                    mode: "random"
                }
            } else {
                throw new Error("Something went wrong. We don't know what game mode to use.")
            }

            this.sound.stopByKey("menu_bgm")
            this.scene.start(ABCRacePlayScene.Key, args)
        })
    }
}

class ABCRacePlayScene extends Phaser.Scene {

    static Key = "PLAY"

    private countdown: Phaser.Time.TimerEvent
    private countdownImage: Phaser.GameObjects.Sprite
    private countdownImageI: number
    private letters: string[]

    constructor() {
        super({ key: ABCRacePlayScene.Key })
    }

    create() {
        this.countdown = this.time.delayedCall(3000, this.startGame, [], this)
    }

    init(data: PlayData) {
        switch (data.mode) {
            case "lowercase": {
                this.letters = ABCRace.LowercaseLetters
                break
            }
            case "random": {
                const letters = []
                for (let i = 0; i < 26; i++) {
                    const random = Math.round(Math.random())
                    if (random < 0.5) {
                        letters.push(ABCRace.LowercaseLetters[i])
                    } else {
                        letters.push(ABCRace.UppercaseLetters[i])
                    }
                }
                this.letters = letters
                break
            }
            case "uppercase": {
                this.letters = ABCRace.UppercaseLetters
                break
            }
        }
    }

    update(time: number, delta: number): void {
        if (this.countdown) {
            const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
            const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2
            const countdownImages = ["three", "two", "one"]
            const countdownProgress = this.countdown.getProgress()
            const countdownProgressI = Math.floor(countdownImages.length * countdownProgress)
            const countdownProgressToNextI = (countdownImages.length * countdownProgress) - countdownProgressI

            if (this.countdownImageI === undefined) {
                // Started countdown
                this.countdownImageI = countdownProgressI
                this.countdownImage = this.add.sprite(screenCenterX, screenCenterY, countdownImages[this.countdownImageI])
                this.countdownImage.setScale(1 - countdownProgressToNextI)
                this.countdownImage.setAlpha(1 - countdownProgressToNextI)
            } else if (countdownProgressI == countdownImages.length) {
                // Finished countdown
                this.countdownImage.destroy(true)
                delete this.countdown
            } else {
                // In countdown
                if (this.countdownImageI !== countdownProgressI) {
                    this.countdownImage.destroy(true)
                    this.countdownImageI = countdownProgressI
                    this.countdownImage = this.add.sprite(screenCenterX, screenCenterY, countdownImages[this.countdownImageI])
                }
                this.countdownImage.setScale(1 - countdownProgressToNextI)
                this.countdownImage.setAlpha(1 - countdownProgressToNextI)
            }
        }
    }

    startGame() {
        this.countdownImage
    }
}

class ABCRace {
    static LowercaseLetters = [..."abcdefghijklmnopqrstuvwxyz"]
    static UppercaseLetters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]

    game: Phaser.Game

    constructor() {
        this.game = new Phaser.Game({
            backgroundColor: 0xFFFFFF,
            height: 600,
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.ScaleModes.FIT
            },
            scene: [ABCRaceLoadScene, ABCRaceMenuScene, ABCRacePlayScene],
            type: Phaser.AUTO,
            width: 800
        })
    }
}

window.onload = () => {
    new ABCRace()
}

export {}