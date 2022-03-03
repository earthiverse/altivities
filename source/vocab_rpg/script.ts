/* eslint-disable sort-keys */
import { BackgroundKey, BackgroundData } from "./backgrounds"
import { CharacterAnimationKey, CharacterData, CharacterKey, SpriteData } from "./characters"
import { MonsterKey, MonsterData } from "./monsters"
import { CategoryData, CategoryKey, Word, Wordlist } from "./wordlists"

declare let backgrounds: { [T in BackgroundKey]: BackgroundData }
declare let characters: { [ T in CharacterKey]: CharacterData }
declare let monsters: { [ T in MonsterKey]: MonsterData }
declare let categories: { [T in CategoryKey]: CategoryData }

type GameData = {
    monster: MonsterKey
}

const icons: SpriteData = {
    file: "images/icons/16px.png",
    frameWidth: 16,
    frameHeight: 16
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
    color: number
    color_light: number
    color_dark: number
    face: string
    skin: string

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
    }

    public static load(scene: Phaser.Scene, skin = "boy"): CharacterSprite {
        const data = localStorage.getItem("character")

        let sprite: CharacterSprite
        if (data !== null) {
            const parsedData = JSON.parse(data)

            // Get the skin and create the sprite
            if (parsedData.skin && characters[skin]) skin = parsedData.skin
            sprite = new CharacterSprite(scene, 0, 0, skin)

            // Add attributes
            for (const key in parsedData) {
                sprite[key] = parsedData[key]
            }
        }

        if (!sprite) sprite = new CharacterSprite(scene, 0, 0, skin)

        // Create the character data if we don't have any
        if (sprite.attack == undefined || sprite.attack < 1) sprite.attack = 1
        if (sprite.level == undefined || sprite.level < 1) sprite.level = 1
        if (sprite.hp == undefined || sprite.hp < 5 + sprite.level) sprite.hp = 5 + sprite.level
        if (sprite.xp == undefined || sprite.xp < 1) sprite.xp = 0
        if (sprite.gold == undefined || sprite.gold < 0) sprite.gold = 0

        if (skin && characters[skin]) {
            if (sprite.color == undefined || typeof sprite.color !== "number") sprite.color = characters[skin].color
            if (sprite.color_light == undefined || typeof sprite.color_light !== "number") sprite.color_light = characters[skin].color_light
            if (sprite.color_dark == undefined || typeof sprite.color_dark !== "number") sprite.color_dark = characters[skin].color_dark
        }

        // Save
        sprite.save()
        return sprite
    }

    /**
     * Applies xp, and leveling.
     * @param change if +ve, add xp, if -ve, subtract.
     * @returns true if we leveled up
     */
    public changeXP(change: number): boolean {
        this.xp = Math.max(0, this.xp + change)

        if (this.xp >= Math.pow(this.level, 2)) {
            // Level up!
            this.hp += 1
            this.level += 1
            this.attack += 1
            this.xp = 0
            return true
        }
    }

    public save() {
        localStorage.setItem("character", JSON.stringify({
            attack: this.attack,
            gold: this.gold,
            hp: this.hp,
            level: this.level,
            xp: this.xp
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
            key: "character_idle",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers("boy", { start: 0, end: 2 }),
            repeat: -1
        })
        this.anims.create({
            key: "character_idle_sword",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers("boy", { start: 9, end: 11 }),
            repeat: -1
        })
        this.anims.create({
            key: "character_attack_sword",
            frameRate: 9,
            frames: this.anims.generateFrameNumbers("boy", { start: 3, end: 5 }),
            repeat: 0,
            yoyo: true
        })
        this.anims.create({
            key: "character_fail",
            frameRate: 9,
            frames: this.anims.generateFrameNumbers("boy", { start: 36, end: 38 }),
            repeat: 0
        })
        this.anims.create({
            key: "monster_idle",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers("goo", { start: 0, end: 2 }),
            repeat: -1,
            yoyo: true
        })

        // Confirm local storage variables
        if (!localStorage.getItem("wordlists")) localStorage.setItem("wordlists", "[]")

        // Start the game
        this.scene.start(CharacterScene.Key)
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

        // Load backgrounds
        for (const name in backgrounds) {
            const background = backgrounds[name]
            this.load.image(background.name, background.file)
        }

        // Load characters
        for (const skin in characters) {
            const character = characters[skin]
            this.load.spritesheet(character.name, character.spritesheet.file, character.spritesheet)
            this.load.image(`${character.name}_face`, character.face)
        }

        // Load monsters
        for (const monsterName in monsters) {
            const monster = monsters[monsterName]
            this.load.spritesheet(monsterName, monster.spritesheet.file, monster.spritesheet)
        }

        // Load icons
        this.load.spritesheet("icons", icons.file, icons)

        // Load HTML Templates
        this.load.html("answer_input", "answer_input.html")
        this.load.html("question", "question.html")
        this.load.html("wordlist_select", "wordlist_select.html")
    }
}

class WordlistScene extends Phaser.Scene {
    static Key = "WORDLIST"

    constructor() {
        super({ key: WordlistScene.Key })
    }

    create() {
        const x = this.cameras.main.centerX
        const y = this.cameras.main.centerY

        this.add.dom(x, y).createFromCache("wordlist_select")

        // Populate categories
        const select = document.getElementById("wordlist_category") as HTMLSelectElement
        for (const key in categories) {
            const category = categories[key]
            const option = document.createElement("option")
            option.value = key
            option.innerHTML = category.name
            select.appendChild(option)
        }

        // Populate wordlists
        select.onchange = (event) => {
            this.populateWordlists((event.target as HTMLSelectElement).value as CategoryKey)
        }
        this.populateWordlists(Object.keys(categories)[0] as CategoryKey)

        const reset = document.getElementById("wordlist_reset") as HTMLButtonElement
        reset.onclick = () => {
            // Clear the wordlists
            localStorage.setItem("wordlists", "[]")
            // Regenerate the wordlists
            this.populateWordlists(select.value as CategoryKey)
        }

        const apply = document.getElementById("wordlist_apply") as HTMLButtonElement
        apply.onclick = () => {
            // Go to the character screen on click
            this.scene.start(CharacterScene.Key)
        }
    }

    private populateWordlists(key: CategoryKey) {
        const category = categories[key]

        const div = document.getElementById("category_wordlists")

        // Clear the div
        while (div.firstChild) div.removeChild(div.firstChild)

        const selected: string[] = JSON.parse(localStorage.getItem("wordlists") ?? "[]")

        // Change the image
        const image = document.getElementById("category_art") as HTMLImageElement
        image.src = category.art

        // Populate the div with new values
        for (const key in category.wordlists) {
            const wordlist = category.wordlists[key]
            const label = document.createElement("label")
            const input = document.createElement("input")
            input.name = key
            input.type = "checkbox"
            if (selected.includes(key)) input.checked = true
            input.onchange = () => {
                const old: string[] = JSON.parse(localStorage.getItem("wordlists") ?? "[]")
                const index = old.indexOf(key)
                if (input.checked) {
                    // Add to our wordlists
                    if (index == -1) old.push(key)
                } else {
                    // Remove from our wordlists
                    if (index !== -1) old.splice(index, 1)
                }
                localStorage.setItem("wordlists", JSON.stringify(old))
            }
            label.appendChild(input)
            label.appendChild(document.createTextNode(wordlist.description))
            div.appendChild(label)
        }
    }
}

class CharacterScene extends Phaser.Scene {
    static Key = "CHARACTER"

    private characterObject: CharacterSprite
    private monster: MonsterData

    constructor() {
        super({ key: CharacterScene.Key })
    }

    create() {
        const x = this.cameras.main.centerX
        const y = this.cameras.main.centerY

        // Add the background
        this.add.sprite(x, y, this.monster.background).setScale(4.5)

        // Load character data
        this.characterObject = CharacterSprite.load(this).setX(x - 100).setY(y).setScale(6).setFlipX(true).setDepth(1)
        this.add.existing(this.characterObject)
        this.characterObject.play("character_idle")

        // Create face
        this.add.rectangle(0, 0, 800, 192, this.characterObject.color_light).setOrigin(0, 0)
        this.add.sprite(0, 0, `${this.characterObject.texture.key}_face`).setOrigin(0, 0).setScale(4)

        const addStat = (x: number, y: number, frame: number, text: string) => {
            this.add.sprite(x, y, "icons", frame).setOrigin(0, 0).setScale(3)
            const statText = this.add.text(x + 56, y, text).setOrigin(0, 0)
            statText.setFontFamily("m5x7")
            statText.setFontSize(48)
            statText.setColor("#000000")
        }

        // Stats
        addStat(208, 0, 3, `HP: ${this.characterObject.hp}`)
        addStat(208, 48, 0, `Attack: ${this.characterObject.attack}`)
        addStat(208, 96, 5, `XP: ${this.characterObject.xp} / ${Math.pow(this.characterObject.level, 2)}`)
        addStat(208, 144, 4, `Gold: ${this.characterObject.gold}`)

        // Wordlist menu
        const wordlistMenu = this.add.sprite(744, 0, "icons", 7).setOrigin(0, 0).setScale(3)
            .setInteractive({ cursor: "pointer" })
        wordlistMenu.on("pointerdown", () => {
            this.scene.start(WordlistScene.Key)
        })

        // Black dividing line
        this.add.rectangle(0, 192, 800, 8, this.characterObject.color_dark).setOrigin(0, 0)

        const goFight = this.add.text(x, VocabRPGGame.HEIGHT - 32, "Go fight the goos!")
            .setOrigin(0.5)
            .setFontFamily("m5x7")
            .setFontSize(48)
            .setColor("#000000")
            .setBackgroundColor("#FFFFFF")
            .setInteractive({ cursor: "pointer" })
        goFight.on("pointerdown", () => {
            // Start the game
            const wordlists = []
            for (const category in categories) {
                wordlists.push(...Object.keys(categories[category].wordlists))
            }
            const data: GameData = {
                monster: this.monster.name
            }
            this.scene.start(FightScene.Key, data)
        })
    }

    init() {
        this.monster = monsters["goo"]
    }
}

class FightScene extends Phaser.Scene {
    static Key = "FIGHT"

    private monster: MonsterData
    private word: Word

    private characterHP: number
    private monsterHP: number

    private characterObject: CharacterSprite
    private menuObject: Phaser.GameObjects.DOMElement
    private monsterObject: Phaser.GameObjects.Sprite
    private HPObject: Phaser.GameObjects.Graphics
    private wordObject: Phaser.GameObjects.DOMElement

    private enterKey: Phaser.Input.Keyboard.Key
    private words: Wordlist
    private wordlists: string[]

    constructor() {
        super({ key: FightScene.Key })
    }

    preload() {
        // Load the wordlists if we haven't yet
        this.wordlists = JSON.parse(localStorage.getItem("wordlists") ?? "[]")

        // Use a random wordlist if we don't have one set
        if (this.wordlists.length == 0) {
            for (const key in categories) {
                const category = categories[key as CategoryKey]
                for (const key in category.wordlists) {
                    this.wordlists.push(key)
                }
            }
            this.wordlists = [this.wordlists[Phaser.Math.Between(0, this.wordlists.length - 1)]]
        }

        // Load all the selected wordlists
        for (const wordlistID of this.wordlists) {
            if (!this.cache.json.has(wordlistID)) {
                let file: string
                for (const categoryName in categories) {
                    const category = categories[categoryName]
                    for (const key in category.wordlists) {
                        if (key == wordlistID) {
                            file = category.wordlists[key].file
                            break
                        }
                    }
                    if (file) break
                }
                this.load.json(wordlistID, file)
            }
        }

    }

    async create() {
        const x = this.cameras.main.centerX
        const y = this.cameras.main.centerY

        // Load the words
        this.words = []
        for (const wordlist of this.wordlists) {
            const toAdd = this.cache.json.get(wordlist)
            this.words.push(...toAdd)
        }

        // Add the background
        this.add.sprite(x, y, this.monster.background).setScale(4.5)

        // Add the monster
        this.monsterObject = this.add.sprite(VocabRPGGame.WIDTH + 100, y + 65, this.monster.name).setScale(6)
        this.monsterHP = this.monster.hp
        this.monsterObject.play("monster_idle")

        // Add the character
        this.characterObject = CharacterSprite.load(this).setX(x - 100).setY(y).setScale(6).setFlipX(true).setDepth(1)
        this.add.existing(this.characterObject)
        this.characterHP = this.characterObject.hp
        this.characterObject.play("character_idle_sword")

        this.HPObject = this.add.graphics().setDepth(2)
        this.updateHP()

        // Animate the monster entrance
        this.add.tween({
            duration: 1000,
            targets: this.monsterObject,
            ease: "Cubic",
            repeat: 0,
            x: `-=${this.monsterObject.x - (x + 100)}`,
            onComplete: () => {
                this.updateHP()
            },
        })

        // Add the menu
        this.add.rectangle(x, 16, VocabRPGGame.WIDTH, 32, 0xFFFFFF).setAlpha(0.7)
        const home = this.add.sprite(16, 16, "icons", 2).setScale(2).setInteractive({ cursor: "pointer" })
        home.on("pointerdown", () => {
            this.leave()
        })

        // Get a new word
        this.wordObject = this.add.dom(x, 62).createFromCache("question")
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
                    x: `-=${this.monsterObject.x - this.characterObject.x - this.monsterObject.displayWidth}`,
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
                x: `+=${this.monsterObject.x - this.characterObject.x - this.monsterObject.displayWidth}`,
                yoyo: true
            })
            // Add damage animation
            this.add.tween({
                duration: 250,
                targets: this.monsterObject,
                ease: "Cubic",
                x: "+=0",
                onComplete: () => {
                    this.monsterHP -= this.characterObject.attack
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
        this.monster = monsters[data.monster]

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

    private changeCurrentWordByIndex(next = Phaser.Math.Between(0, this.words.length - 1)) {
        this.word = this.words[next]

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

    private async defeatLogic() {
        if (this.monsterHP <= 0) {
            // We defeated the monster
            console.log("we defeated the monster")
            if (this.characterObject.changeXP(this.monster.xp)) {
                // TODO: level up animation
            }
            this.characterObject.gold += Phaser.Math.Between(this.monster.xp - 1, this.monster.xp * 2)
            this.characterObject.save()
            return
        }

        if (this.characterHP <= 0) {
            // We died to the monster
            console.log("we died to the monster")
            // TODO: monster attack animation
            this.characterObject.changeXP(-1)
            this.characterObject.save()
            return
        }

        if (this.monsterHP < this.monster.hp || this.characterHP < this.characterObject.hp) {
            // We left midway through the battle
            console.log("we left midway")
            // TODO: monster attack animation
            // TODO: death animation
            this.characterObject.gold = Math.max(0, this.characterObject.gold - 1)
            this.characterObject.save()
            return
        }

        // We left without starting the battle
        // TODO: escape animation
        console.log("we left without fighting")
    }

    private leave() {
        this.defeatLogic()
        this.scene.start(CharacterScene.Key)
    }

    private async updateHP() {
        this.HPObject.clear()

        if (this.monsterHP <= 0 || this.characterHP <= 0) {
            // Someone died, start a new game
            await this.defeatLogic()
            this.scene.start(FightScene.Key)
            return
        }

        // Character HP
        this.HPObject.fillStyle(0x000000)
        this.HPObject.fillRect(this.characterObject.x - 50, this.characterObject.y + 130, 100, 20)
        this.HPObject.fillStyle(0xFF0000)
        this.HPObject.fillRect(this.characterObject.x - 48, this.characterObject.y + 132, 96 * (this.characterHP / this.characterObject.hp), 16)

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
            scene: [LoadGameScene, CharacterScene, WordlistScene, FightScene],
            type: Phaser.AUTO,
            width: VocabRPGGame.WIDTH
        })
    }
}

window.onload = () => {
    new VocabRPGGame()
}

export {}