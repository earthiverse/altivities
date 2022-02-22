/* eslint-disable sort-keys */
type CharacterData = {
    hp: number
    attack: number
    level: number
    gold: number
    xp: number
}

type GameData = {
    background: string
    monster: Monster
    wordlist: string
}
type Languages =
    | "en"
    | "ja"

type Word = {
    [T in Exclude<Languages, "ja">]: string | string[]
} & {
    ja: {
        kanji: string
        hiragana: string
    } | {
        kanji: string
        hiragana: string
    }[]
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

type Character = {
    /** Name of the character.
     * NOTE: Keep all character names and monster names unique!
     */
    name: string
    spritesheet: SpriteData
}

type Monster = {
    /** Name of the monster.
     * NOTE: Keep all character names and monster names unique!
     */
    name: string
    spritesheet: SpriteData

    attack: number
    hp: number
}

const backgrounds: BackgroundData[] = [
    {
        file: "images/backgrounds/dirt.png",
        name: "dirt",
    }
]

const characters: Character[] = [
    {
        name: "character1_1",
        spritesheet: {
            file: "images/characters/1_1.png",
            frameHeight: 48,
            frameWidth: 48,
        }
    },
]

const monsters: {[T in string]: Monster} = {
    "goo": {
        name: "goo",
        spritesheet: {
            file: "images/monsters/goo.png",
            frameWidth: 15,
            frameHeight: 19,
        },
        attack: 1,
        hp: 10
    }
}

const wordlists: {[T in string]: {
    description: string
    file: string
}} = {
    "js5_l2": {
        description: "Junior Sunshine 5 - Lesson 2",
        file: "../wordlists/JuniorSunshine5/lesson2.json"
    },
    "js5_l3": {
        description: "Junior Sunshine 5 - Lesson 3",
        file: "../wordlists/JuniorSunshine5/lesson3.json"
    },
    "js5_l4": {
        description: "Junior Sunshine 5 - Lesson 4",
        file: "../wordlists/JuniorSunshine5/lesson4.json"
    }
}

// Colors
const WHITE = new Phaser.Display.Color(255, 255, 255)
const RED = new Phaser.Display.Color(255, 0, 0)

class CharacterSprite extends Phaser.GameObjects.Sprite implements CharacterData {
    attack: number
    gold: number
    hp: number
    level: number
    xp: number

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)

        this.load()
    }

    public load() {
        const data = localStorage.getItem("character")
        if (data !== null) {
            const parsedData = JSON.parse(data)
            for (const key in parsedData) {
                this[key] = parsedData[key]
            }
        }

        // Create the character data if we don't have any
        if (this.attack == undefined || this.attack < 1) this.attack = 1
        if (this.hp == undefined || this.hp < 5) this.hp = 5
        if (this.level == undefined || this.level < 1) this.level = 1
        if (this.xp == undefined || this.xp < 1) this.xp = 0
        if (this.gold == undefined || this.gold < 0) this.gold = 0

        // Save
        this.save()
    }

    public save() {
        localStorage.setItem("character", JSON.stringify({
            attack: this.attack,
            gold: this.gold,
            hp: this.hp,
            level: this.level,
            xp: this.level
        }))
    }
}

class LoadGameScene extends Phaser.Scene {
    static Key = "LOAD"
    static LOAD_BAR_COLOR = 0x00C050

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
        const keys = Object.keys(wordlists)
        const data: GameData = {
            background: "dirt",
            monster: monsters["goo"],
            wordlist: keys[Phaser.Math.Between(0, keys.length - 1)] // Random wordlist
        }
        this.scene.start(FightScene.Key, data)
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

        // // Load wordlists
        // for (const wordlistID in wordlists) {
        //     const wordlist = wordlists[wordlistID]
        //     this.load.json(wordlistID, wordlist.file)
        // }

        // Load backgrounds
        for (const background of backgrounds) this.load.image(background.name, background.file)

        // Load characters
        for (const character of characters) this.load.spritesheet(character.name, character.spritesheet.file, character.spritesheet)

        // Load monsters
        for (const monsterName in monsters) {
            const monster = monsters[monsterName]
            this.load.spritesheet(monsterName, monster.spritesheet.file, monster.spritesheet)
        }

        // Load HTML Templates
        this.load.html("answer_input", "answer_input.html")
        this.load.html("question", "question.html")
    }
}

class FightScene extends Phaser.Scene {
    static Key = "FIGHT"

    private background: string
    private monster: Monster
    private word: Word

    private characterHP: number
    private monsterHP: number

    private characterObject: CharacterSprite
    private monsterObject: Phaser.GameObjects.Sprite
    private HPObject: Phaser.GameObjects.Graphics
    private wordObject: Phaser.GameObjects.DOMElement

    private enterKey: Phaser.Input.Keyboard.Key
    private wordlistID: string
    private wordlist: Wordlist

    constructor() {
        super({ key: FightScene.Key })
    }

    preload() {
        // Load the wordlist if we don't have it
        if (!this.cache.json.has(this.wordlistID)) this.load.json(this.wordlistID, wordlists[this.wordlistID].file)
    }

    create() {
        const x = this.cameras.main.centerX
        const y = this.cameras.main.centerY

        // Set the wordlist
        this.wordlist = this.cache.json.get(this.wordlistID)

        // Add the background
        this.add.sprite(x, y, this.background).setScale(4.5)

        // Add the monster
        this.monsterObject = this.add.sprite(x + 100, y + 65, this.monster.name).setScale(6)
        this.monsterHP = this.monster.hp
        this.monsterObject.play("monster_idle")

        // Add the character
        this.characterObject = new CharacterSprite(this, x - 100, y, "character1_1").setScale(6).setFlipX(true).setDepth(1)
        this.add.existing(this.characterObject)
        this.characterHP = this.characterObject.hp
        this.characterObject.play("character_idle_sword")

        this.HPObject = this.add.graphics().setDepth(2)
        this.updateHP()

        // Get a new word
        this.wordObject = this.add.dom(x, 30).createFromCache("question")
        this.changeCurrentWordByIndex()

        // Setup answer input
        const answer = this.add.dom(x, VocabRPGGame.HEIGHT - 30).createFromCache("answer_input")
        const answerField = document.getElementById("answerField") as HTMLInputElement
        const checkAnswer = () => {
            const input: string = answerField.value
            if (!input) return

            // Check the answer
            let correct = false
            if (Array.isArray(this.word.en)) {
                // There's multiple correct answers, see if it matches any of them
                if (this.word.en.includes(input)) correct = true
            } else if (this.word.en == input) {
                correct = true
            }

            if (!correct) {
                // Add attack animation
                this.add.tween({
                    duration: 250,
                    targets: this.monsterObject,
                    ease: "Cubic",
                    repeat: 0,
                    x: "-=100",
                    yoyo: true
                })
                // Add damage animation
                this.add.tween({
                    duration: 250,
                    targets: this.characterObject,
                    ease: "Cubic",
                    x: "+=0",
                    onComplete: () => {
                        this.characterHP -= this.monster.attack
                        this.updateHP()
                    },
                    onUpdate: (tween) => {
                        let e = tween.elapsed / (tween.duration / 2)
                        if (e > 2) e = 0
                        else if (e > 1) e = 2 - e
                        const t = Phaser.Display.Color.Interpolate.ColorWithColor(WHITE, RED, 1, e)
                        this.characterObject.tint = Phaser.Display.Color.GetColor(t.r, t.g, t.b)
                    },
                    repeat: 0,
                    yoyo: true
                })
                this.playCharacterAnimation("character_fail")
                return
            }

            const checkButton = document.getElementById("check") as HTMLInputElement
            if (checkButton.disabled) return // Currently attacking

            // Add attack animation
            this.add.tween({
                duration: 250,
                targets: this.characterObject,
                ease: "Cubic",
                repeat: 0,
                x: "+=100",
                yoyo: true
            })
            // Add damage animation
            this.add.tween({
                duration: 250,
                targets: this.monsterObject,
                ease: "Cubic",
                x: "+=0",
                onComplete: () => {
                    this.monsterHP -= this.monster.attack
                    this.updateHP()
                },
                onUpdate: (tween) => {
                    let e = tween.elapsed / (tween.duration / 2)
                    if (e > 2) e = 0
                    else if (e > 1) e = 2 - e
                    const t = Phaser.Display.Color.Interpolate.ColorWithColor(WHITE, RED, 1, e)
                    this.monsterObject.tint = Phaser.Display.Color.GetColor(t.r, t.g, t.b)
                },
                repeat: 0,
                yoyo: true
            })
            this.playCharacterAnimation("character_attack_sword")

            // Get a new word when the attack animation finishes
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

        // Set focus to the answer field
        answerField.focus()
    }

    init(data: GameData) {
        this.word = undefined
        this.wordlistID = data.wordlist
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
        this.word = this.wordlist[next]

        let display: string
        if (Array.isArray(this.word.ja)) {
            // Choose a word at random
            const random = Phaser.Math.Between(0, this.word.ja.length - 1)

            if (this.word.ja[random].kanji == this.word.ja[random].hiragana) {
                display = this.word.ja[random].kanji
            } else {
                display = `${this.word.ja[random].kanji}【${this.word.ja[random].hiragana}】`
            }
        } else if (this.word.ja.kanji == this.word.ja.hiragana) {
            // The kanji and hiragana are the same, just show the kanji
            display = this.word.ja.kanji
        } else {
            // Show the kanji with hiragana
            display = `${this.word.ja.kanji}【${this.word.ja.hiragana}】`
        }

        const question = document.getElementById("questionText")
        question.textContent = display
    }

    private updateHP() {
        this.HPObject.clear()

        if (this.monsterHP <= 0) {
            this.scene.start(FightScene.Key)
            this.characterObject.xp += 1
            this.characterObject.gold += Phaser.Math.Between(0, 2)
            this.characterObject.save()
            return
        }

        if (this.characterHP <= 0) {
            this.scene.start(FightScene.Key)
            this.characterObject.xp = Math.min(0, this.characterObject.xp - 1)
            this.characterObject.save()
            return
        }

        // Character HP
        this.HPObject.fillStyle(0x000000)
        this.HPObject.fillRect(this.characterObject.x - 50, this.characterObject.y + 130, 100, 20)
        this.HPObject.fillStyle(0xFF0000)
        // this.HPObject.fillRect(this.characterObject.x - 48, this.characterObject.y + 132, 96 * (this.characterHP / this.characterObject.hp), 16)
        this.HPObject.fillRect(this.characterObject.x - 48, this.characterObject.y + 132, 96 * (this.characterHP / 5), 16)

        // Monster HP
        this.HPObject.fillStyle(0x000000)
        this.HPObject.fillRect(this.monsterObject.x - 50, this.monsterObject.y + 65, 100, 20)
        this.HPObject.fillStyle(0xFF0000)
        this.HPObject.fillRect(this.monsterObject.x - 48, this.monsterObject.y + 67, 96 * (this.monsterHP / this.monster.hp), 16)
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
            scene: [LoadGameScene, FightScene],
            type: Phaser.AUTO,
            width: VocabRPGGame.WIDTH
        })
    }
}

window.onload = () => {
    new VocabRPGGame()
}

export {}