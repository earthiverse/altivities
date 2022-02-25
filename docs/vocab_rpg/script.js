"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backgrounds = [
    {
        file: "images/backgrounds/dirt.png",
        name: "dirt",
    }
];
const characters = [
    {
        name: "character1_1",
        spritesheet: {
            file: "images/characters/1_1.png",
            frameHeight: 48,
            frameWidth: 48,
        }
    },
];
const icons = {
    file: "images/icons/16px.png",
    frameWidth: 16,
    frameHeight: 16
};
const monsters = {
    "goo": {
        name: "goo",
        spritesheet: {
            file: "images/monsters/goo.png",
            frameWidth: 15,
            frameHeight: 19,
        },
        attack: 1,
        hp: 10,
        xp: 1
    }
};
const wordlists = {
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
    },
    "js5_l5": {
        description: "Junior Sunshine 5 - Lesson 5",
        file: "../wordlists/JuniorSunshine5/lesson5.json"
    },
    "js5_l7": {
        description: "Junior Sunshine 5 - Lesson 7",
        file: "../wordlists/JuniorSunshine5/lesson7.json"
    },
    "js5_l8": {
        description: "Junior Sunshine 5 - Lesson 8",
        file: "../wordlists/JuniorSunshine5/lesson8.json"
    },
    "js5_l9": {
        description: "Junior Sunshine 5 - Lesson 9",
        file: "../wordlists/JuniorSunshine5/lesson9.json"
    },
    "js5_alphabet": {
        description: "Junior Sunshine 5 - Alphabet",
        file: "../wordlists/JuniorSunshine5/alphabet.json"
    },
    "js5_phonics": {
        description: "Junior Sunshine 5 - Phonics",
        file: "../wordlists/JuniorSunshine5/phonics.json"
    }
};
const WHITE = new Phaser.Display.Color(255, 255, 255);
const RED = new Phaser.Display.Color(255, 0, 0);
class CharacterSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.load();
    }
    load() {
        const data = localStorage.getItem("character");
        if (data !== null) {
            const parsedData = JSON.parse(data);
            for (const key in parsedData) {
                console.log(`parsed ${key} as ${parsedData[key]}`);
                this[key] = parsedData[key];
            }
        }
        if (this.attack == undefined || this.attack < 1)
            this.attack = 1;
        if (this.hp == undefined || this.hp < 5)
            this.hp = 5;
        if (this.level == undefined || this.level < 1)
            this.level = 1;
        if (this.xp == undefined || this.xp < 1)
            this.xp = 0;
        if (this.gold == undefined || this.gold < 0)
            this.gold = 0;
        this.save();
    }
    changeXP(change) {
        this.xp = Math.max(0, this.xp + change);
        if (this.xp >= Math.pow(this.level, 2)) {
            this.level += 1;
            this.attack += 1;
            this.xp = 0;
            return true;
        }
    }
    save() {
        localStorage.setItem("character", JSON.stringify({
            attack: this.attack,
            gold: this.gold,
            hp: this.hp,
            level: this.level,
            xp: this.xp
        }));
    }
}
class LoadGameScene extends Phaser.Scene {
    constructor() {
        super({ key: LoadGameScene.Key });
    }
    create() {
        this.anims.create({
            key: "character_idle_sword",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers("character1_1", { start: 9, end: 11 }),
            repeat: -1
        });
        this.anims.create({
            key: "character_attack_sword",
            frameRate: 9,
            frames: this.anims.generateFrameNumbers("character1_1", { start: 3, end: 5 }),
            repeat: 0,
            yoyo: true
        });
        this.anims.create({
            key: "character_fail",
            frameRate: 9,
            frames: this.anims.generateFrameNumbers("character1_1", { start: 36, end: 38 }),
            repeat: 0
        });
        this.anims.create({
            key: "monster_idle",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers("goo", { start: 0, end: 2 }),
            repeat: -1,
            yoyo: true
        });
        const keys = Object.keys(wordlists);
        const data = {
            background: "dirt",
            monster: monsters["goo"],
            wordlist: keys[Phaser.Math.Between(0, keys.length - 1)]
        };
        this.scene.start(FightScene.Key, data);
    }
    preload() {
        const loadingText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, "Loading...");
        loadingText.setOrigin(0.5, 0.5);
        loadingText.setColor("#000000");
        loadingText.setFontFamily("Arial");
        loadingText.setFontSize(30);
        this.loadingBack = this.add.graphics();
        this.loadingBack.fillStyle(0x000000, 1);
        this.loadingBack.fillRect(240, 270, 320, 50);
        this.loadingFill = this.add.graphics();
        this.load.on("progress", (value) => {
            this.loadingFill.clear();
            this.loadingFill.fillStyle(LoadGameScene.LOAD_BAR_COLOR, 1);
            this.loadingFill.fillRect(250, 280, 300 * value, 30);
        });
        for (const background of backgrounds)
            this.load.image(background.name, background.file);
        for (const character of characters)
            this.load.spritesheet(character.name, character.spritesheet.file, character.spritesheet);
        for (const monsterName in monsters) {
            const monster = monsters[monsterName];
            this.load.spritesheet(monsterName, monster.spritesheet.file, monster.spritesheet);
        }
        this.load.spritesheet("icons", icons.file, icons);
        this.load.html("answer_input", "answer_input.html");
        this.load.html("question", "question.html");
    }
}
LoadGameScene.Key = "LOAD";
LoadGameScene.LOAD_BAR_COLOR = 0x00C050;
class FightScene extends Phaser.Scene {
    constructor() {
        super({ key: FightScene.Key });
    }
    preload() {
        if (!this.cache.json.has(this.wordlistID))
            this.load.json(this.wordlistID, wordlists[this.wordlistID].file);
    }
    create() {
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;
        this.wordlist = this.cache.json.get(this.wordlistID);
        this.add.sprite(x, y, this.background).setScale(4.5);
        this.monsterObject = this.add.sprite(x + 100, y + 65, this.monster.name).setScale(6);
        this.monsterHP = this.monster.hp;
        this.monsterObject.play("monster_idle");
        this.characterObject = new CharacterSprite(this, x - 100, y, "character1_1").setScale(6).setFlipX(true).setDepth(1);
        this.add.existing(this.characterObject);
        this.characterHP = this.characterObject.hp;
        this.characterObject.play("character_idle_sword");
        this.HPObject = this.add.graphics().setDepth(2);
        this.updateHP();
        this.add.rectangle(x, 16, VocabRPGGame.WIDTH, 32, 0xFFFFFF).setAlpha(0.7);
        const home = this.add.sprite(16, 16, "icons", 2).setScale(2).setInteractive();
        home.on("pointerdown", () => {
            console.log("clicked on home");
            this.leave();
        });
        this.wordObject = this.add.dom(x, 62).createFromCache("question");
        this.changeCurrentWordByIndex();
        const answer = this.add.dom(x, VocabRPGGame.HEIGHT - 30).createFromCache("answer_input");
        const answerField = document.getElementById("answerField");
        const checkAnswer = () => {
            const input = answerField.value;
            if (!input)
                return;
            let correct = false;
            if (Array.isArray(this.word.en)) {
                if (this.word.en.includes(input))
                    correct = true;
            }
            else if (this.word.en == input) {
                correct = true;
            }
            if (!correct) {
                this.add.tween({
                    duration: 250,
                    targets: this.monsterObject,
                    ease: "Cubic",
                    repeat: 0,
                    x: "-=100",
                    yoyo: true
                });
                this.add.tween({
                    duration: 250,
                    targets: this.characterObject,
                    ease: "Cubic",
                    x: "+=0",
                    onComplete: () => {
                        this.characterHP -= this.monster.attack;
                        this.updateHP();
                    },
                    onUpdate: (tween) => {
                        let e = tween.elapsed / (tween.duration / 2);
                        if (e > 2)
                            e = 0;
                        else if (e > 1)
                            e = 2 - e;
                        const t = Phaser.Display.Color.Interpolate.ColorWithColor(WHITE, RED, 1, e);
                        this.characterObject.tint = Phaser.Display.Color.GetColor(t.r, t.g, t.b);
                    },
                    repeat: 0,
                    yoyo: true
                });
                this.playCharacterAnimation("character_fail");
                return;
            }
            const checkButton = document.getElementById("check");
            if (checkButton.disabled)
                return;
            this.add.tween({
                duration: 250,
                targets: this.characterObject,
                ease: "Cubic",
                repeat: 0,
                x: "+=100",
                yoyo: true
            });
            this.add.tween({
                duration: 250,
                targets: this.monsterObject,
                ease: "Cubic",
                x: "+=0",
                onComplete: () => {
                    this.monsterHP -= this.characterObject.attack;
                    this.updateHP();
                },
                onUpdate: (tween) => {
                    let e = tween.elapsed / (tween.duration / 2);
                    if (e > 2)
                        e = 0;
                    else if (e > 1)
                        e = 2 - e;
                    const t = Phaser.Display.Color.Interpolate.ColorWithColor(WHITE, RED, 1, e);
                    this.monsterObject.tint = Phaser.Display.Color.GetColor(t.r, t.g, t.b);
                },
                repeat: 0,
                yoyo: true
            });
            this.playCharacterAnimation("character_attack_sword");
            this.characterObject.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                answerField.value = "";
                this.changeCurrentWordByIndex();
            });
        };
        answer.addListener("click");
        answer.on("click", (data) => {
            if (data.target.id !== "check")
                return;
            checkAnswer();
        });
        this.enterKey.on("down", () => {
            checkAnswer();
        }, this);
        answerField.focus();
    }
    init(data) {
        this.word = undefined;
        this.wordlistID = data.wordlist;
        this.background = data.background;
        this.monster = data.monster;
        this.enterKey = this.input.keyboard.addKey("ENTER");
    }
    playCharacterAnimation(animation) {
        const answerField = document.getElementById("answerField");
        const checkButton = document.getElementById("check");
        this.characterObject.play(animation);
        answerField.disabled = true;
        checkButton.disabled = true;
        this.enterKey.enabled = false;
        this.characterObject.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.characterObject.play("character_idle_sword");
            answerField.disabled = false;
            checkButton.disabled = false;
            answerField.focus();
            this.enterKey.enabled = true;
            this.enterKey.reset();
        });
    }
    changeCurrentWordByIndex(next = Phaser.Math.Between(0, this.wordlist.length - 1)) {
        this.word = this.wordlist[next];
        let display;
        if (Array.isArray(this.word.ja)) {
            const random = Phaser.Math.Between(0, this.word.ja.length - 1);
            if (this.word.ja[random].kanji == this.word.ja[random].hiragana) {
                display = this.word.ja[random].kanji;
            }
            else {
                display = `${this.word.ja[random].kanji}【${this.word.ja[random].hiragana}】`;
            }
        }
        else if (this.word.ja.kanji == this.word.ja.hiragana) {
            display = this.word.ja.kanji;
        }
        else {
            display = `${this.word.ja.kanji}【${this.word.ja.hiragana}】`;
        }
        const question = document.getElementById("questionText");
        question.textContent = display;
    }
    leave() {
        if (this.monsterHP <= 0) {
            console.log("we defeated the monster");
            if (this.characterObject.changeXP(this.monster.xp)) {
            }
            this.characterObject.gold += Phaser.Math.Between(this.monster.xp - 1, this.monster.xp * 2);
            this.characterObject.save();
            this.scene.start(FightScene.Key);
            return;
        }
        if (this.characterHP <= 0) {
            console.log("we died to the monster");
            this.characterObject.changeXP(-1);
            this.characterObject.save();
            this.scene.start(FightScene.Key);
            return;
        }
        if (this.monsterHP < this.monster.hp || this.characterHP < this.characterObject.hp) {
            console.log("we left midway");
            this.characterObject.gold = Math.max(0, this.characterObject.gold - 1);
            this.characterObject.save();
            this.scene.start(FightScene.Key);
            return;
        }
        console.log("we left without fighting");
        this.scene.start(FightScene.Key);
    }
    updateHP() {
        this.HPObject.clear();
        if (this.monsterHP <= 0 || this.characterHP <= 0) {
            this.leave();
            return;
        }
        this.HPObject.fillStyle(0x000000);
        this.HPObject.fillRect(this.characterObject.x - 50, this.characterObject.y + 130, 100, 20);
        this.HPObject.fillStyle(0xFF0000);
        this.HPObject.fillRect(this.characterObject.x - 48, this.characterObject.y + 132, 96 * (this.characterHP / 5), 16);
        this.HPObject.fillStyle(0x000000);
        this.HPObject.fillRect(this.monsterObject.x - 50, this.monsterObject.y + 65, 100, 20);
        this.HPObject.fillStyle(0xFF0000);
        this.HPObject.fillRect(this.monsterObject.x - 48, this.monsterObject.y + 67, 96 * (this.monsterHP / this.monster.hp), 16);
    }
}
FightScene.Key = "FIGHT";
class VocabRPGGame {
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
        });
    }
}
VocabRPGGame.WIDTH = 800;
VocabRPGGame.HEIGHT = 600;
window.onload = () => {
    new VocabRPGGame();
};
