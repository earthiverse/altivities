/* eslint-disable sort-keys */

type GameData = {
    background: string
    monster: string
    wordlist: string
}

type Word = {
    en: string,
    ja: {
        kanji: string
        hiragana: string
    }
}
type Wordlist = Word[]

type CharacterAnimationKey =
    | "character_attack_sword"
    | "character_fail"
    | "character_idle_sword"

type MonsterAnimationKey =
    | "monster_idle"

type BackgroundData = {
    file: string
    name: string
}

type SpriteData = {
    /** Filename for the given character sprites */
    file: string
    frameWidth: number
    frameHeight: number
    scale?: number
}

type CharacterSprite = {
    /** Name of the character.
     * NOTE: Keep all character names and monster names unique!
     */
    name: string
    spritesheet: SpriteData
}

type MonsterSprite = {
    /** Name of the monster.
     * NOTE: Keep all character names and monster names unique!
     */
    name: string
    spritesheet: SpriteData
}

const backgrounds: BackgroundData[] = [
    {
        file: "images/backgrounds/dirt.png",
        name: "dirt",
    }
]

const characters: CharacterSprite[] = [
    {
        name: "character1_1",
        spritesheet: {
            file: "images/characters/1_1.png",
            frameHeight: 48,
            frameWidth: 48,
        }
    },
]

const monsters: MonsterSprite[] = [
    {
        name: "goo",
        spritesheet: {
            file: "images/monsters/goo.png",
            frameWidth: 15,
            frameHeight: 19,
        }
    }
]

class LoadGameScene extends Phaser.Scene {
    static Key = "LOAD"
    static LOAD_BAR_COLOR = 0x00AEEF

    private loadingBack: Phaser.GameObjects.Graphics
    private loadingFill: Phaser.GameObjects.Graphics

    constructor() {
        super({ key: LoadGameScene.Key })
    }

    create() {
        // Create animations
        this.anims.create({
            key: "character_idle_sword",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers("character1_1", { start: 9, end: 11 }),
            repeat: -1
        })
        this.anims.create({
            key: "character_attack_sword",
            frameRate: 9,
            frames: this.anims.generateFrameNumbers("character1_1", { start: 3, end: 5 }),
            repeat: 0,
            yoyo: true
        })
        this.anims.create({
            key: "character_fail",
            frameRate: 9,
            frames: this.anims.generateFrameNumbers("character1_1", { start: 36, end: 38 }),
            repeat: 0
        })
        this.anims.create({
            key: "monster_idle",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers("goo", { start: 0, end: 2 }),
            repeat: -1,
            yoyo: true
        })

        // Start the game
        const data: GameData = {
            background: "dirt",
            monster: "goo",
            wordlist: "wordlist_js5l2"
        }
        this.scene.start(TestLayoutScene.Key, data)
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
            this.loadingFill.fillStyle(LoadGameScene.LOAD_BAR_COLOR, 1)
            this.loadingFill.fillRect(250, 280, 300 * value, 30)
        })

        // Load word list
        this.load.json("wordlist_js5l2", "../wordlists/JuniorSunshine5/lesson2.json")

        // Load backgrounds
        for (const background of backgrounds) this.load.image(background.name, background.file)

        // Load characters
        for (const character of characters) this.load.spritesheet(character.name, character.spritesheet.file, character.spritesheet)

        // Load monsters
        for (const monster of monsters) this.load.spritesheet(monster.name, monster.spritesheet.file, monster.spritesheet)

        // Load HTML Templates
        this.load.html("answer_input", "answer_input.html")
    }
}

class TestLayoutScene extends Phaser.Scene {
    static Key = "PLAY"

    private background: string
    private monster: string
    private word: Word

    private characterObject: Phaser.GameObjects.Sprite
    private monsterObject: Phaser.GameObjects.Sprite
    private wordObject: Phaser.GameObjects.DOMElement

    private enterKey: Phaser.Input.Keyboard.Key
    private wordlist: Wordlist

    constructor() {
        super({ key: TestLayoutScene.Key })
    }

    create() {
        const x = this.cameras.main.centerX
        const y = this.cameras.main.centerY

        // Add the background
        this.add.sprite(x, y, this.background).setScale(4.5)

        // Add the monster
        this.monsterObject = this.add.sprite(Phaser.Math.FloatBetween(x + 50, x + 150), y, this.monster).setScale(6)
        this.monsterObject.play("monster_idle")

        // Add the character
        this.characterObject = this.add.sprite(x - 100, y, "character1_1").setScale(6).setFlipX(true).setDepth(1)
        this.characterObject.play("character_idle_sword")

        // Get a new word
        this.changeCurrentWordByIndex()

        // Setup answer input
        const answer = this.add.dom(x, VocabRPGGame.HEIGHT - 30).createFromCache("answer_input")
        const checkAnswer = () => {
            const answerField = document.getElementById("answerField") as HTMLInputElement
            const input: string = answerField.value
            if (!input) return

            if (input !== this.word.en) {
                // It wasn't correct
                this.playCharacterAnimation("character_fail")
                return
            }

            const checkButton = document.getElementById("check") as HTMLInputElement
            if (checkButton.disabled) return // Currently attacking

            // Add attack animations
            this.add.tween({
                duration: 250,
                targets: this.characterObject,
                ease: "Cubic",
                repeat: 0,
                x: "+=100",
                yoyo: true
            })

            // Add damage animation
            const white = new Phaser.Display.Color(255, 255, 255)
            const red = new Phaser.Display.Color(255, 0, 0)
            this.add.tween({
                duration: 250,
                targets: this.monsterObject,
                ease: "Cubic",
                x: "+=0",
                onUpdate: (tween) => {
                    let e = tween.elapsed / 250
                    if (e > 2) e = 0
                    else if (e > 1) e = 2 - e
                    const t = Phaser.Display.Color.Interpolate.ColorWithColor(white, red, 1, e)
                    this.monsterObject.tint = Phaser.Display.Color.GetColor(t.r, t.g, t.b)
                },
                repeat: 0,
                yoyo: true
            })
            this.playCharacterAnimation("character_attack_sword")
            this.characterObject.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                answerField.value = ""
                this.changeCurrentWordByIndex()
            })
        }

        answer.addListener("click")
        answer.on("click", (data) => {
            if (data.target.id !== "check") return
            checkAnswer()
        })

        this.enterKey.on("down", () => {
            checkAnswer()
        }, this)
    }

    init(data: GameData) {
        this.wordlist = this.cache.json.get(data.wordlist)
        this.word = undefined
        this.background = data.background
        this.monster = data.monster

        this.enterKey = this.input.keyboard.addKey("ENTER")
    }

    private playCharacterAnimation(animation: CharacterAnimationKey) {
        const answerField = document.getElementById("answerField") as HTMLInputElement
        const checkButton = document.getElementById("check") as HTMLInputElement

        this.characterObject.play(animation)
        answerField.disabled = true
        checkButton.disabled = true
        this.enterKey.enabled = false
        this.characterObject.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.characterObject.play("character_idle_sword")
            answerField.disabled = false
            checkButton.disabled = false
            answerField.focus()
            this.enterKey.enabled = true
            this.enterKey.reset()
        })
    }

    private changeCurrentWordByIndex(next = Phaser.Math.Between(0, this.wordlist.length - 1)) {
        const x = this.cameras.main.centerX

        this.word = this.wordlist[next]
        if (this.wordObject) this.wordObject.destroy()

        let display: string
        if (this.word.ja.kanji == this.word.ja.hiragana) {
            display = this.word.ja.kanji
        } else {
            display = `${this.word.ja.kanji}【${this.word.ja.hiragana}】`
        }

        this.wordObject = this.add.dom(x, 30, "div", "background-color: rgba(255,255,255,0.7); width: 800px; font-family='UD デジタル 教科書体 NK-B'; font-size: 48px; text-align: center", display)
    }
}

class VocabRPGGame {
    static WIDTH = 800
    static HEIGHT = 600
    game: Phaser.Game

    constructor() {
        this.game = new Phaser.Game({
            backgroundColor: 0xFFFFFF,
            dom: {
                createContainer: true
            },
            height: VocabRPGGame.HEIGHT,
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.ScaleModes.FIT,
                parent: "game"
            },
            pixelArt: true,
            scene: [LoadGameScene, TestLayoutScene],
            type: Phaser.AUTO,
            width: VocabRPGGame.WIDTH
        })
    }
}

window.onload = () => {
    new VocabRPGGame()
}

export {}