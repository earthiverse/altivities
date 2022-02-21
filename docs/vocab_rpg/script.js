"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const monsters = [
    {
        name: "goo",
        spritesheet: {
            file: "images/monsters/goo.png",
            frameWidth: 15,
            frameHeight: 19,
        }
    }
];
class LoadGameScene extends Phaser.Scene {
    constructor() {
        super({ key: LoadGameScene.Key });
    }
    create() {
        this.anims.create({
            key: "character_idle_sword",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers("character1_1", { start: 9, end: 11 }),
            repeat: -1,
            yoyo: true
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
        const data = {
            wordlist: "wordlist_js5l2"
        };
        this.scene.start(TestLayoutScene.Key, data);
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
        this.load.json("wordlist_js5l2", "../wordlists/JuniorSunshine5/lesson2.json");
        for (const character of characters)
            this.load.spritesheet(character.name, character.spritesheet.file, character.spritesheet);
        for (const monster of monsters)
            this.load.spritesheet(monster.name, monster.spritesheet.file, monster.spritesheet);
        this.load.html("answer_input", "answer_input.html");
    }
}
LoadGameScene.Key = "LOAD";
LoadGameScene.LOAD_BAR_COLOR = 0x00AEEF;
class TestLayoutScene extends Phaser.Scene {
    constructor() {
        super({ key: TestLayoutScene.Key });
    }
    create() {
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;
        this.character = this.add.sprite(x - 100, y, "character1_1").setScale(5).setFlipX(true);
        this.character.play("character_idle_sword");
        this.spawnMonster("goo", 5);
        this.changeCurrentWordByIndex();
        const answer = this.add.dom(x, VocabRPGGame.HEIGHT - 30).createFromCache("answer_input");
        const checkAnswer = () => {
            const answerField = document.getElementById("answerField");
            const input = answerField.value;
            if (!input)
                return;
            if (input !== this.currentWord.en) {
                this.playCharacterAnimation("character_fail");
                return;
            }
            const checkButton = document.getElementById("check");
            if (checkButton.disabled)
                return;
            this.playCharacterAnimation("character_attack_sword");
            this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                answerField.value = "";
                this.changeCurrentWordByIndex();
            });
        };
        answer.addListener("click");
        answer.on("click", (data) => {
            console.log(`clicked ${Date.now()}`);
            if (data.target.id !== "check")
                return;
            checkAnswer();
        });
        this.enterKey.on("down", () => {
            console.log(`enter pressed ${Date.now()}`);
            checkAnswer();
        }, this);
    }
    init(data) {
        this.wordlist = this.cache.json.get(data.wordlist);
        this.currentWord = undefined;
        this.monsters = [];
        this.enterKey = this.input.keyboard.addKey("ENTER");
    }
    playCharacterAnimation(animation) {
        const answerField = document.getElementById("answerField");
        const checkButton = document.getElementById("check");
        this.character.play(animation);
        answerField.disabled = true;
        checkButton.disabled = true;
        this.enterKey.enabled = false;
        this.character.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.character.play("character_idle_sword");
            answerField.disabled = false;
            checkButton.disabled = false;
            answerField.focus();
            this.enterKey.enabled = true;
            this.enterKey.reset();
        });
    }
    changeCurrentWordByIndex(next = Phaser.Math.Between(0, this.wordlist.length - 1)) {
        const x = this.cameras.main.centerX;
        this.currentWord = this.wordlist[next];
        if (this.currentWordObject)
            this.currentWordObject.destroy();
        let display;
        if (this.currentWord.ja.kanji == this.currentWord.ja.hiragana) {
            display = this.currentWord.ja.kanji;
        }
        else {
            display = `${this.currentWord.ja.kanji}【${this.currentWord.ja.hiragana}】`;
        }
        this.currentWordObject = this.add.dom(x, 30, "div", "width: 800px; font-family='UD デジタル 教科書体 NK-B'; font-size: 48px; text-align: center", display);
    }
    spawnMonster(type = "goo", scale = 5) {
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;
        const monster = this.add.sprite(Phaser.Math.FloatBetween(x + 50, x + 150), y, type).setScale(scale);
        monster.play("monster_idle");
        this.monsters.push(monster);
    }
}
TestLayoutScene.Key = "PLAY";
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
            scene: [LoadGameScene, TestLayoutScene],
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
