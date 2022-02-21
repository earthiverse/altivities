/* eslint-disable sort-keys */

type GameData = {
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
            repeat: -1,
            yoyo: true
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

    private character: Phaser.GameObjects.Sprite
    private enterKey: Phaser.Input.Keyboard.Key
    private wordlist: Wordlist
    private currentWord: Word
    private currentWordObject: Phaser.GameObjects.DOMElement
    private monsters: Phaser.GameObjects.Sprite[]

    constructor() {
        super({ key: TestLayoutScene.Key })
    }

    create() {
        const x = this.cameras.main.centerX
        const y = this.cameras.main.centerY

        this.character = this.add.sprite(x - 100, y, "character1_1").setScale(5).setFlipX(true)
        this.character.play("character_idle_sword")

        this.spawnMonster("goo", 5)
        this.changeCurrentWordByIndex()

        const answer = this.add.dom(x, VocabRPGGame.HEIGHT - 30).createFromCache("answer_input")
        const checkAnswer = () => {
            const answerField = document.getElementById("answerField") as HTMLInputElement
            const input: string = answerField.value
            if (!input) return

            if (input !== this.currentWord.en) {
                // It wasn't correct
                this.playCharacterAnimation("character_fail")
                return
            }

            const checkButton = document.getElementById("check") as HTMLInputElement
            if (checkButton.disabled) return // Currently attacking
            this.playCharacterAnimation("character_attack_sword")
            this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                answerField.value = ""
                this.changeCurrentWordByIndex()
            })
        }

        answer.addListener("click")
        answer.on("click", (data) => {
            console.log(`clicked ${Date.now()}`)
            if (data.target.id !== "check") return
            checkAnswer()
        })

        this.enterKey.on("down", () => {
            console.log(`enter pressed ${Date.now()}`)
            checkAnswer()
        }, this)
    }

    init(data: GameData) {
        this.wordlist = this.cache.json.get(data.wordlist)
        this.currentWord = undefined
        this.monsters = []

        this.enterKey = this.input.keyboard.addKey("ENTER")
    }

    private playCharacterAnimation(animation: CharacterAnimationKey) {
        const answerField = document.getElementById("answerField") as HTMLInputElement
        const checkButton = document.getElementById("check") as HTMLInputElement

        this.character.play(animation)
        answerField.disabled = true
        checkButton.disabled = true
        this.enterKey.enabled = false
        this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.character.play("character_idle_sword")
            answerField.disabled = false
            checkButton.disabled = false
            answerField.focus()
            this.enterKey.enabled = true
            this.enterKey.reset()
        })
    }

    private changeCurrentWordByIndex(next = Phaser.Math.Between(0, this.wordlist.length - 1)) {
        const x = this.cameras.main.centerX

        this.currentWord = this.wordlist[next]
        if (this.currentWordObject) this.currentWordObject.destroy()

        let display: string
        if (this.currentWord.ja.kanji == this.currentWord.ja.hiragana) {
            display = this.currentWord.ja.kanji
        } else {
            display = `${this.currentWord.ja.kanji}【${this.currentWord.ja.hiragana}】`
        }

        this.currentWordObject = this.add.dom(x, 30, "div", "width: 800px; font-family='UD デジタル 教科書体 NK-B'; font-size: 48px; text-align: center", display)
    }

    private spawnMonster(type = "goo", scale = 5) {
        const x = this.cameras.main.centerX
        const y = this.cameras.main.centerY

        const monster = this.add.sprite(Phaser.Math.FloatBetween(x + 50, x + 150), y, type).setScale(scale)
        monster.play("monster_idle")
        this.monsters.push(monster)
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