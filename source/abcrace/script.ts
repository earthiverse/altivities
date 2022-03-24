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

type ResultsData = {
    mode: string
    numMistakes: number
    timeElapsed: number
}

const LOCAL_STORAGE_MODE = "abcrace_mode"

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
    }

    return array
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
        this.setInteractive({ cursor: "pointer" })
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

    private loadingBack: Phaser.GameObjects.Graphics
    private loadingFill: Phaser.GameObjects.Graphics

    constructor() {
        super({ key: ABCRaceLoadScene.Key })
    }

    create() {
        this.scene.start(ABCRaceMenuScene.Key)
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
            this.loadingFill.fillStyle(0xC4DF9B, 1)
            this.loadingFill.fillRect(250, 280, 300 * value, 30)
        })

        // Load Letters and Numbers
        for (const letter of ABCRace.LowercaseLetters) this.load.image(letter, `images/lower/${letter}.svg`)
        for (const letter of ABCRace.UppercaseLetters) this.load.image(letter, `images/upper/${letter}.svg`)
        for (const number of ["three", "two", "one"]) this.load.image(number, `images/numbers/${number}.svg`)

        // Load Logo
        this.load.image("logo", "images/logo.png")

        // Load Images
        this.load.image("timer", "images/timer.svg")

        // Load Buttons
        this.load.spritesheet("lowercase_buttons", "images/lowercase_buttons.png", { frameHeight: 160, frameWidth: 210 })
        this.load.spritesheet("random_buttons", "images/random_buttons.png", { frameHeight: 160, frameWidth: 210 })
        this.load.spritesheet("uppercase_buttons", "images/uppercase_buttons.png", { frameHeight: 160, frameWidth: 210 })
        this.load.spritesheet("start_buttons", "images/start_buttons.png", { frameHeight: 210, frameWidth: 610 })
        this.load.spritesheet("menu_buttons", "images/menu_buttons.png", { frameHeight: 210, frameWidth: 610 })

        // Load Music
        // Of Far Different Nature - Summer House [v2]
        // https://fardifferent.itch.io/loops
        this.load.audio("menu_bgm", "sounds/menu_bgm.mp3")

        // Load Sounds
        for (const letter of ABCRace.LowercaseLetters) this.load.audio(`${letter}_f`, `sounds/${letter}_f.mp3`)
        this.load.audio("countdown", "sounds/countdown.mp3")
        this.load.audio("menu_switch", "sounds/menu_switch.mp3")
        this.load.audio("ng", "sounds/ng.mp3")
        this.load.audio("ok", "sounds/ok.mp3")
        this.load.audio("start", "sounds/start.mp3")
        this.load.audio("finish", "sounds/finish.mp3")

        // Load Google Fonts
        this.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js")
    }
}

class ABCRaceMenuScene extends Phaser.Scene {
    static Key = "MENU"
    constructor() {
        super({ key: ABCRaceMenuScene.Key })
    }

    create() {
        this.add.sprite(0, 0, "logo").setOrigin(0, 0)

        this.sound.play("menu_bgm", {
            loop: true,
            volume: 0.5
        })

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
            this.sound.play("menu_switch")
            lowercaseButton.setEnabled()
            uppercaseButton.setDisabled()
            randomButton.setDisabled()
        })
        uppercaseButton.on("pointerdown", () => {
            this.sound.play("menu_switch")
            lowercaseButton.setDisabled()
            uppercaseButton.setEnabled()
            randomButton.setDisabled()
        })
        randomButton.on("pointerdown", () => {
            this.sound.play("menu_switch")
            lowercaseButton.setDisabled()
            uppercaseButton.setDisabled()
            randomButton.setEnabled()
        })
        switch (localStorage.getItem(LOCAL_STORAGE_MODE)) {
            case "lowercase":
                lowercaseButton.setEnabled()
                break
            case "uppercase":
            default:
                uppercaseButton.setEnabled()
                break
            case "random":
                randomButton.setEnabled()
                break
        }

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
                localStorage.setItem(LOCAL_STORAGE_MODE, "lowercase")
            } else if (uppercaseButton.enabled) {
                args = {
                    mode: "uppercase"
                }
                localStorage.setItem(LOCAL_STORAGE_MODE, "uppercase")
            } else if (randomButton.enabled) {
                args = {
                    mode: "random"
                }
                localStorage.setItem(LOCAL_STORAGE_MODE, "random")
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
    private countdownCover: Phaser.GameObjects.Rectangle
    private countdownImage: Phaser.GameObjects.Sprite
    private countdownImageI: number
    private letters: string[]
    private mode: string
    private currentLetter
    private lastCorrect: Phaser.GameObjects.Sprite
    private sprites: Phaser.GameObjects.Sprite[]
    private timerText: Phaser.GameObjects.Text
    private startTime: number
    private numMistakesConcurrent
    private numMistakes

    constructor() {
        super({ key: ABCRacePlayScene.Key })
    }

    create() {
        this.countdown = this.time.delayedCall(3000, undefined, undefined, this)

        // Split the board until we have enough spaces to fit all letters
        let columns = 1
        let rows = 1
        while (columns * rows < 26) {
            const columnWidth = ABCRace.WIDTH / columns
            const rowHeight = ABCRace.HEIGHT / rows

            if (columnWidth > rowHeight) columns *= 2
            else rows *= 2
        }
        // Put the letters in boxes
        const boxes = [...this.letters]
        // Fill the remaining boxes with nothing
        while (boxes.length < columns * rows) boxes.push(undefined)
        shuffle(boxes)

        const timerHeight = 100
        const timer = this.add.sprite(20, 25, "timer").setOrigin(0, 0)
        timer.setScale(60 / timer.height)
        this.timerText = this.add.text(80, 20, "00:00.00").setOrigin(0, 0)
        this.timerText.setFontFamily("Orbitron")
        this.timerText.setFontSize(60)
        this.timerText.setColor("#000000")

        const columnWidth = ABCRace.WIDTH / columns
        const rowHeight = (ABCRace.HEIGHT - timerHeight) / rows

        let minScale = 1
        for (let i = 0; i < columns * rows; i++) {
            const box = boxes[i]
            if (!box) continue // Box is empty

            const x = (i % columns * columnWidth) + columnWidth / 2
            const y = timerHeight + (Math.floor(i / columns) * rowHeight) + rowHeight / 2

            const letterSprite = this.add.sprite(x, y, box)
            this.sprites.push(letterSprite)
            const scale = Math.min(rowHeight / letterSprite.height, columnWidth / letterSprite.width) * 0.9
            if (minScale > scale) minScale = scale

            const rotation = getRandomNumber(-15, 15) * (Math.PI / 180)
            letterSprite.setRotation(rotation)

            letterSprite.setInteractive({ cursor: "pointer" })

            // Make the hit area larger to make letters like 'i' and 'l' easier to hit.
            const maxLength = Math.max(letterSprite.width, letterSprite.height)
            letterSprite.input.hitArea.setTo(-(maxLength - letterSprite.width) / 2, -(maxLength - letterSprite.height) / 2, maxLength, maxLength)

            letterSprite.on("pointerdown", () => {
                const hit = letterSprite.texture.key
                const target = this.letters[this.currentLetter]

                // Play the letter sound
                this.sound.play(`${hit.toLowerCase()}_f`)

                if (target == hit) {
                    // They hit the correct letter
                    letterSprite.removeInteractive()

                    this.tweens.add({
                        alpha: 0.75,
                        duration: 250,
                        ease: Phaser.Math.Easing.Sine.InOut,
                        targets: [letterSprite]
                    })

                    const black = Phaser.Display.Color.ValueToColor(0x000000)
                    const green = Phaser.Display.Color.ValueToColor(0x00FF00)

                    this.tweens.addCounter({
                        duration: 250,
                        ease: Phaser.Math.Easing.Sine.InOut,
                        from: 0,
                        onUpdate: (tween) => {
                            const value = tween.getValue()
                            const newColor = Phaser.Display.Color.Interpolate.ColorWithColor(black, green, 100, value)
                            const newColorN = Phaser.Display.Color.GetColor(newColor.r, newColor.g, newColor.b)

                            letterSprite.setTintFill(newColorN)
                            letterSprite.setAlpha(1 - 0.2 * value / 100)
                        },
                        to: 100,
                    })
                    this.currentLetter += 1
                    this.sound.play("ok")

                    // Set the last correct one to gray
                    if (this.lastCorrect) {
                        const toFade = this.lastCorrect
                        this.tweens.addCounter({
                            duration: 250,
                            ease: Phaser.Math.Easing.Sine.InOut,
                            from: 0,
                            onUpdate: (tween) => {
                                const value = tween.getValue()
                                // const newColor = Phaser.Display.Color.Interpolate.ColorWithColor(fromColor, toColor, 100, value)

                                // letterSprite.setTint(Phaser.Display.Color.GetColor(newColor.r, newColor.g, newColor.b))
                                toFade.setAlpha(1 - 0.8 * value / 100)
                            },
                            to: 100,
                        })
                    }
                    this.lastCorrect = letterSprite

                    if (this.currentLetter == 26) {
                        this.sound.play("finish", {
                            volume: 0.5
                        })
                        this.scene.start(ABCRaceResultsScene.Key, {
                            mode: this.mode,
                            numMistakes: this.numMistakes,
                            timeElapsed: Date.now() - this.startTime
                        })
                    }
                    this.numMistakesConcurrent = 0
                } else {
                    // They hit the wrong letter
                    this.sound.play("ng")

                    this.numMistakes += 1
                    this.numMistakesConcurrent += 1
                }
            })
            letterSprite.disableInteractive()
        }

        // Scale the letters
        for (const sprite of this.sprites) sprite.setScale(minScale)

        // Create a white rectangle to cover the letters that slowly gets revealed as the countdown progresses
        this.countdownCover = this.add.rectangle(0, 0, ABCRace.WIDTH, ABCRace.HEIGHT, 0xFFFFFF).setOrigin(0, 0)
        this.countdownCover.setDepth(1)
    }

    init(data: PlayData) {
        // Reset Variables
        this.lastCorrect = undefined
        this.sprites = []
        this.currentLetter = 0
        this.numMistakes = 0
        this.numMistakesConcurrent = 0

        // Setup Mode
        this.mode = data.mode
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

            this.countdownCover.setAlpha(1 - countdownProgress)

            if (this.countdownImageI === undefined) {
                // Started countdown
                this.countdownImageI = countdownProgressI
                this.countdownImage = this.add.sprite(screenCenterX, screenCenterY, countdownImages[this.countdownImageI])
                this.sound.play("countdown")
                this.countdownImage.setDepth(2)
                this.countdownImage.setScale(1 - countdownProgressToNextI)
                this.countdownImage.setAlpha(1 - countdownProgressToNextI)
            } else if (countdownProgressI == countdownImages.length) {
                // Finished countdown
                this.countdownImage.destroy(true)
                delete this.countdown
                this.sound.play("start")
                this.startTime = Date.now()

                for (const sprite of this.sprites) sprite.setInteractive({ cursor: "pointer" })
            } else {
                // In countdown
                if (this.countdownImageI !== countdownProgressI) {
                    this.countdownImage.destroy(true)
                    this.countdownImageI = countdownProgressI
                    this.countdownImage = this.add.sprite(screenCenterX, screenCenterY, countdownImages[this.countdownImageI])
                    this.sound.play("countdown")
                    this.countdownImage.setDepth(2)
                }
                this.countdownImage.setScale(1 - countdownProgressToNextI)
                this.countdownImage.setAlpha(1 - countdownProgressToNextI)
            }
            return
        }

        const timeElapsed = Date.now() - this.startTime + (this.numMistakes * 1000)
        const secondsElapsed = ((timeElapsed / 1000) % 60).toFixed(2).padStart(5, "0")
        const minutesElapsed = Math.floor(timeElapsed / 1000 / 60).toString().padStart(2, "0")
        this.timerText.setText(`${minutesElapsed}:${secondsElapsed}`)
    }
}

class ABCRaceResultsScene extends Phaser.Scene {
    static Key = "RESULTS"

    private mode: string
    private numMistakes: number
    private timeElapsed: number

    constructor() {
        super({ key: ABCRaceResultsScene.Key })
    }

    create() {
        // const timerIcon = this.add.sprite(20, 20, "timer").setOrigin(0, 0)

        const logo = this.add.sprite(20, 80, "logo").setOrigin(0, 0)
        logo.setAlpha(0.1)

        const modeText = this.add.text(20, 50, `Mode: ${this.mode}`).setOrigin(0, 0)
        modeText.setFontFamily("Orbitron")
        modeText.setFontSize(60)
        modeText.setColor("#000000")

        const secondsElapsed = ((this.timeElapsed / 1000) % 60).toFixed(2).padStart(5, "0")
        const minutesElapsed = Math.floor(this.timeElapsed / 1000 / 60).toString().padStart(2, "0")
        const timerText = this.add.text(20, 110, `Elapsed: ${minutesElapsed}:${secondsElapsed}`).setOrigin(0, 0)
        timerText.setFontFamily("Orbitron")
        timerText.setFontSize(60)
        timerText.setColor("#333333")

        const mistakesText = this.add.text(20, 170, `Mistakes: ${this.numMistakes}`).setOrigin(0, 0)
        mistakesText.setFontFamily("Orbitron")
        mistakesText.setFontSize(60)
        mistakesText.setColor("#F94C56")

        const mistakesElapsed = this.timeElapsed + (this.numMistakes * 1000)
        const secondsElapsedM = ((mistakesElapsed / 1000) % 60).toFixed(2).padStart(5, "0")
        const minutesElapsedM = Math.floor(mistakesElapsed / 1000 / 60).toString().padStart(2, "0")
        const timerTextM = this.add.text(20, 230, `Total: ${minutesElapsedM}:${secondsElapsedM}`).setOrigin(0, 0)
        timerTextM.setFontFamily("Orbitron")
        timerTextM.setFontSize(80)
        timerTextM.setStyle({
            fontWeight: "bold"
        })
        timerTextM.setColor("#000000")

        const menuButton = new BasicButton({
            "key": "menu_buttons",
            "scene": this,
            "x": 95,
            "y": 380
        })
        menuButton.setAlpha(0)
        menuButton.setInteractive({ cursor: "pointer" })
        menuButton.on("pointerup", () => {
            this.scene.start(ABCRaceMenuScene.Key)
        })
        menuButton.disableInteractive()
        this.tweens.addCounter({
            duration: 500,
            ease: Phaser.Math.Easing.Sine.InOut,
            from: 0,
            onUpdate: (tween) => {
                const value = tween.getValue()
                menuButton.setAlpha(value / 100)
                if (value == 100) menuButton.setInteractive({ cursor: "pointer" })
            },
            to: 100,
        })
    }

    init(data: ResultsData) {
        // Set Variables
        this.mode = data.mode
        this.numMistakes = data.numMistakes
        this.timeElapsed = data.timeElapsed
    }
}

class ABCRace {
    static LowercaseLetters = [..."abcdefghijklmnopqrstuvwxyz"]
    static UppercaseLetters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
    static WIDTH = 800
    static HEIGHT = 600

    game: Phaser.Game

    constructor() {
        this.game = new Phaser.Game({
            backgroundColor: 0xFFFFFF,
            height: ABCRace.HEIGHT,
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.ScaleModes.FIT,
                parent: "game"
            },
            scene: [ABCRaceLoadScene, ABCRaceMenuScene, ABCRacePlayScene, ABCRaceResultsScene],
            type: Phaser.AUTO,
            width: ABCRace.WIDTH
        })
    }
}

window.onload = () => {
    new ABCRace()
}

export {}