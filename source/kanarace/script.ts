type ButtonConfig = {
    key: string
    scene: Phaser.Scene
    enabled?: number
    disabled?: number
    over?: number
    x?: number
    y?: number
}

type Mode =
    | "katakana"
    | "hiragana"
    | "random"

type PlayData = {
    mode: Mode
}

type ResultsData = {
    mode: Mode
    numMistakes: number
    timeElapsed: number
}

type BestTimesData = {
    [T in Mode]?: number
}

const BLACK = Phaser.Display.Color.ValueToColor(0x000000)
const LIGHT_GREEN = Phaser.Display.Color.ValueToColor(0xC4DF9B)
const DARK_GREEN = Phaser.Display.Color.ValueToColor(0x697753)
const RED = Phaser.Display.Color.ValueToColor(0xF94C56)

const LOCAL_STORAGE_MODE = "kanarace_mode"
const LOCAL_STORAGE_TIMES = "kanarace_times"

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

class KanaRaceLoadScene extends Phaser.Scene {
    static Key = "LOAD"

    private loadingBack: Phaser.GameObjects.Graphics
    private loadingFill: Phaser.GameObjects.Graphics

    constructor() {
        super({ key: KanaRaceLoadScene.Key })
    }

    create() {
        this.scene.start(KanaRaceMenuScene.Key)
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

        // Load Characters and Numbers
        for (const char of KanaRace.HiraganaLetters) this.load.image(char, `images/hiragana/${char}.svg`)
        for (const char of KanaRace.KatakanaLetters) this.load.image(char, `images/katakana/${char}.svg`)
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
        for (const letter of KanaRace.HiraganaLetters) this.load.audio(`${letter}_f`, `sounds/${letter}_f.mp3`)
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

class KanaRaceMenuScene extends Phaser.Scene {
    static Key = "MENU"
    constructor() {
        super({ key: KanaRaceMenuScene.Key })
    }

    create() {
        this.add.sprite(0, 0, "logo").setOrigin(0, 0)

        this.sound.play("menu_bgm", {
            loop: true,
            volume: 0.5
        })

        const katakanaButton = new BasicButton({
            "key": "lowercase_buttons",
            "scene": this,
            "x": 40,
            "y": 205
        })

        const hiraganaButton = new BasicButton({
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

        katakanaButton.on("pointerdown", () => {
            this.sound.play("menu_switch")
            katakanaButton.setEnabled()
            hiraganaButton.setDisabled()
            randomButton.setDisabled()
        })
        hiraganaButton.on("pointerdown", () => {
            this.sound.play("menu_switch")
            katakanaButton.setDisabled()
            hiraganaButton.setEnabled()
            randomButton.setDisabled()
        })
        randomButton.on("pointerdown", () => {
            this.sound.play("menu_switch")
            katakanaButton.setDisabled()
            hiraganaButton.setDisabled()
            randomButton.setEnabled()
        })
        switch (localStorage.getItem(LOCAL_STORAGE_MODE)) {
            case "lowercase":
                katakanaButton.setEnabled()
                break
            case "uppercase":
            default:
                hiraganaButton.setEnabled()
                break
            case "random":
                randomButton.setEnabled()
                break
        }

        // Display best times
        const timesString = localStorage.getItem(LOCAL_STORAGE_TIMES)
        let timesObject: BestTimesData = {}
        if (timesString) timesObject = JSON.parse(timesString) as BestTimesData
        const addBestText = (x: number, y: number, time: number) => {
            const secondsElapsed = ((time / 1000) % 60).toFixed(2).padStart(5, "0")
            const bestText = this.add.text(x, y, `Best: ${secondsElapsed}`)
            bestText.setFontFamily("Orbitron")
            bestText.setFontSize(18)
            bestText.setFontStyle("bold")
            bestText.setColor("#697753")
        }
        if (timesObject.katakana < 60000) addBestText(85, 185, timesObject.katakana)
        if (timesObject.hiragana < 60000) addBestText(340, 185, timesObject.hiragana)
        if (timesObject.random < 60000) addBestText(595, 185, timesObject.random)

        const startButton = new BasicButton({
            "key": "start_buttons",
            "scene": this,
            "x": 95,
            "y": 380
        })
        startButton.on("pointerup", () => {
            let args: PlayData

            if (katakanaButton.enabled) {
                args = {
                    mode: "katakana"
                }
                localStorage.setItem(LOCAL_STORAGE_MODE, "katakana")
            } else if (hiraganaButton.enabled) {
                args = {
                    mode: "hiragana"
                }
                localStorage.setItem(LOCAL_STORAGE_MODE, "hiragana")
            } else if (randomButton.enabled) {
                args = {
                    mode: "random"
                }
                localStorage.setItem(LOCAL_STORAGE_MODE, "random")
            } else {
                throw new Error("Something went wrong. We don't know what game mode to use.")
            }

            this.sound.stopByKey("menu_bgm")
            this.scene.start(KanaRacePlayScene.Key, args)
        })
    }
}

class KanaRacePlayScene extends Phaser.Scene {
    static Key = "PLAY"

    private countdown: Phaser.Time.TimerEvent
    private countdownCover: Phaser.GameObjects.Rectangle
    private countdownImage: Phaser.GameObjects.Sprite
    private countdownImageI: number
    private letters: string[]
    private mode: string
    private currentLetter
    private lastCorrect: Phaser.GameObjects.Sprite
    private letterSprites: Phaser.GameObjects.Sprite[]
    private timerText: Phaser.GameObjects.Text
    private startTime: number
    private numMistakesConcurrent
    private numMistakes

    constructor() {
        super({ key: KanaRacePlayScene.Key })
    }

    create() {
        this.countdown = this.time.delayedCall(3000, undefined, undefined, this)

        // Split the board until we have enough spaces to fit all letters
        let columns = 1
        let rows = 1
        while (columns * rows < 26) {
            const columnWidth = KanaRace.WIDTH / columns
            const rowHeight = KanaRace.HEIGHT / rows

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

        const columnWidth = KanaRace.WIDTH / columns
        const rowHeight = (KanaRace.HEIGHT - timerHeight) / rows

        let minScale = 1
        for (let i = 0; i < columns * rows; i++) {
            const box = boxes[i]
            if (!box) continue // Box is empty

            const x = (i % columns * columnWidth) + columnWidth / 2
            const y = timerHeight + (Math.floor(i / columns) * rowHeight) + rowHeight / 2

            const letterSprite = this.add.sprite(x, y, box)
            this.letterSprites.push(letterSprite)
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

                    this.tweens.addCounter({
                        duration: 250,
                        ease: Phaser.Math.Easing.Sine.InOut,
                        from: 0,
                        onUpdate: (tween) => {
                            const value = tween.getValue()
                            const newColor = Phaser.Display.Color.Interpolate.ColorWithColor(BLACK, DARK_GREEN, 100, value)
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
                        this.scene.start(KanaRaceResultsScene.Key, {
                            mode: this.mode,
                            numMistakes: this.numMistakes,
                            timeElapsed: Date.now() - this.startTime
                        })
                    }
                    this.numMistakesConcurrent = 0
                } else {
                    // They hit the wrong letter
                    if (this.numMistakesConcurrent >= 5) {
                        // They've gotten a lot wrong, they're *probably* just messing around, but show the next one in red anyways
                        let correctLetterSprite: Phaser.GameObjects.Sprite
                        for (const sprite of this.letterSprites) {
                            if (sprite.texture.key == target) {
                                correctLetterSprite = sprite
                                break
                            }
                        }

                        this.tweens.add({
                            duration: 250,
                            ease: Phaser.Math.Easing.Sine.InOut,
                            targets: [correctLetterSprite]
                        })

                        this.tweens.addCounter({
                            duration: 250,
                            ease: Phaser.Math.Easing.Sine.InOut,
                            from: 0,
                            onUpdate: (tween) => {
                                const value = tween.getValue()
                                const newColor = Phaser.Display.Color.Interpolate.ColorWithColor(BLACK, RED, 100, value)
                                const newColorN = Phaser.Display.Color.GetColor(newColor.r, newColor.g, newColor.b)

                                correctLetterSprite.setTintFill(newColorN)
                            },
                            to: 100,
                        })
                    } else {
                        this.sound.play("ng")

                        this.numMistakes += 1
                        this.numMistakesConcurrent += 1
                    }
                }
            })
            letterSprite.disableInteractive()
        }

        // Scale the letters
        for (const sprite of this.letterSprites) sprite.setScale(minScale)

        // Create a white rectangle to cover the letters that slowly gets revealed as the countdown progresses
        this.countdownCover = this.add.rectangle(0, 0, KanaRace.WIDTH, KanaRace.HEIGHT, 0xFFFFFF).setOrigin(0, 0)
        this.countdownCover.setDepth(1)
    }

    init(data: PlayData) {
        // Reset Variables
        this.lastCorrect = undefined
        this.letterSprites = []
        this.currentLetter = 0
        this.numMistakes = 0
        this.numMistakesConcurrent = 0

        // Setup Mode
        this.mode = data.mode
        switch (data.mode) {
            case "hiragana": {
                this.letters = KanaRace.HiraganaLetters
                break
            }
            case "katakana": {
                this.letters = KanaRace.KatakanaLetters
                break
            }
            case "random": {
                const letters = []
                for (let i = 0; i < 26; i++) {
                    const random = Math.round(Math.random())
                    if (random < 0.5) {
                        letters.push(KanaRace.HiraganaLetters[i])
                    } else {
                        letters.push(KanaRace.KatakanaLetters[i])
                    }
                }
                this.letters = letters
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

                for (const sprite of this.letterSprites) sprite.setInteractive({ cursor: "pointer" })
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

class KanaRaceResultsScene extends Phaser.Scene {
    static Key = "RESULTS"

    private mode: Mode
    private numMistakes: number
    private timeElapsed: number

    constructor() {
        super({ key: KanaRaceResultsScene.Key })
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

        // Update best time
        const timesString = localStorage.getItem(LOCAL_STORAGE_TIMES)
        const timesObject: BestTimesData = {}
        if (timesString) {
            const oldTimes = JSON.parse(timesString) as BestTimesData
            timesObject.katakana = oldTimes.katakana
            timesObject.hiragana = oldTimes.hiragana
            timesObject.random = oldTimes.random
        }
        if (mistakesElapsed < (timesObject[this.mode] ?? Number.MAX_VALUE)) {
            // We have a new best time
            timesObject[this.mode] = mistakesElapsed
            localStorage.setItem(LOCAL_STORAGE_TIMES, JSON.stringify(timesObject))
        }

        const menuButton = new BasicButton({
            "key": "menu_buttons",
            "scene": this,
            "x": 95,
            "y": 380
        })
        menuButton.setAlpha(0)
        menuButton.setInteractive({ cursor: "pointer" })
        menuButton.on("pointerup", () => {
            this.scene.start(KanaRaceMenuScene.Key)
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

class KanaRace {
    static KatakanaLetters = [..."アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン"]
    static HiraganaLetters = [..."あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわん"]
    static WIDTH = 800
    static HEIGHT = 600

    game: Phaser.Game

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
        })
    }
}

window.onload = () => {
    new KanaRace()
}

export {}