"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BasicButton extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, 0, 0, config.key, 2);
        this._enabled = false;
        this.config = config;
        if (!config.scene)
            throw new Error("config.scene is not set");
        if (!config.key)
            throw new Error("config.key is not set");
        if (!config.enabled)
            config.enabled = 1;
        if (!config.disabled)
            config.disabled = 2;
        if (!config.over)
            config.over = 0;
        if (config.x)
            this.x = config.x;
        if (config.y)
            this.y = config.y;
        config.scene.add.existing(this);
        this.setInteractive();
        this.on("pointerdown", this.onDown, this);
        this.on("pointerover", this.onOver, this);
        this.on("pointerout", this.onOut, this);
        this.setDisabled();
        this.setOrigin(0, 0);
    }
    get enabled() {
        return this._enabled;
    }
    onDown() {
        this.setFrame(this.config.enabled);
    }
    onOver() {
        if (this._enabled)
            this.setFrame(this.config.enabled);
        else
            this.setFrame(this.config.over);
    }
    onOut() {
        if (this._enabled)
            this.setFrame(this.config.enabled);
        else
            this.setFrame(this.config.disabled);
    }
    setEnabled() {
        this._enabled = true;
        this.setFrame(this.config.enabled);
    }
    setDisabled() {
        this._enabled = false;
        this.setFrame(this.config.disabled);
    }
}
class ABCRaceLoadScene extends Phaser.Scene {
    constructor() {
        super({ key: ABCRaceLoadScene.Key });
    }
    create() {
        this.scene.start(ABCRaceMenuScene.Key);
    }
    preload() {
        for (const letter of ABCRace.LowercaseLetters)
            this.load.image(letter, `images/lower/${letter}.svg`);
        for (const letter of ABCRace.UppercaseLetters)
            this.load.image(letter, `images/upper/${letter}.svg`);
        for (const number of ["three", "two", "one"])
            this.load.image(number, `images/numbers/${number}.svg`);
        this.load.image("logo", "images/logo.png");
        this.load.spritesheet("lowercase_buttons", "images/lowercase_buttons.png", { frameHeight: 160, frameWidth: 210 });
        this.load.spritesheet("random_buttons", "images/random_buttons.png", { frameHeight: 160, frameWidth: 210 });
        this.load.spritesheet("uppercase_buttons", "images/uppercase_buttons.png", { frameHeight: 160, frameWidth: 210 });
        this.load.spritesheet("start_buttons", "images/start_buttons.png", { frameHeight: 210, frameWidth: 610 });
        this.load.audio("menu_bgm", "sounds/menu_bgm.ogg");
    }
}
ABCRaceLoadScene.Key = "LOAD";
class ABCRaceMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: ABCRaceMenuScene.Key });
    }
    create() {
        this.add.sprite(0, 0, "logo").setOrigin(0, 0);
        this.sound.play("menu_bgm", { loop: true });
        const lowercaseButton = new BasicButton({
            "key": "lowercase_buttons",
            "scene": this,
            "x": 40,
            "y": 205
        });
        const uppercaseButton = new BasicButton({
            "key": "uppercase_buttons",
            "scene": this,
            "x": 295,
            "y": 205
        });
        const randomButton = new BasicButton({
            "key": "random_buttons",
            "scene": this,
            "x": 550,
            "y": 205
        });
        lowercaseButton.on("pointerdown", () => {
            lowercaseButton.setEnabled();
            uppercaseButton.setDisabled();
            randomButton.setDisabled();
        });
        uppercaseButton.on("pointerdown", () => {
            lowercaseButton.setDisabled();
            uppercaseButton.setEnabled();
            randomButton.setDisabled();
        });
        randomButton.on("pointerdown", () => {
            lowercaseButton.setDisabled();
            uppercaseButton.setDisabled();
            randomButton.setEnabled();
        });
        uppercaseButton.setEnabled();
        const startButton = new BasicButton({
            "key": "start_buttons",
            "scene": this,
            "x": 95,
            "y": 380
        });
        startButton.on("pointerup", () => {
            let args;
            if (lowercaseButton.enabled) {
                args = {
                    mode: "lowercase"
                };
            }
            else if (uppercaseButton.enabled) {
                args = {
                    mode: "uppercase"
                };
            }
            else if (randomButton.enabled) {
                args = {
                    mode: "random"
                };
            }
            else {
                throw new Error("Something went wrong. We don't know what game mode to use.");
            }
            this.sound.stopByKey("menu_bgm");
            this.scene.start(ABCRacePlayScene.Key, args);
        });
    }
}
ABCRaceMenuScene.Key = "MENU";
class ABCRacePlayScene extends Phaser.Scene {
    constructor() {
        super({ key: ABCRacePlayScene.Key });
    }
    create() {
        this.countdown = this.time.delayedCall(3000, this.startGame, [], this);
    }
    init(data) {
        if (data) {
            console.log("We got data!");
            console.log(data);
        }
    }
    update(time, delta) {
        if (this.countdown) {
            const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
            const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
            const countdownImages = ["three", "two", "one"];
            const progress = this.countdown.getProgress();
            const progressI = Math.floor(countdownImages.length * progress);
            const progressToNextI = (countdownImages.length * progress) - progressI;
            if (this.countdownImageI === undefined) {
                this.countdownImageI = progressI;
                this.countdownImage = this.add.sprite(screenCenterX, screenCenterY, countdownImages[this.countdownImageI]);
                this.countdownImage.setScale(1 - progressToNextI);
                this.countdownImage.setAlpha(1 - progressToNextI);
            }
            else if (progressI == countdownImages.length) {
                this.countdownImage.destroy(true);
                delete this.countdown;
            }
            else {
                if (this.countdownImageI !== progressI) {
                    this.countdownImage.destroy(true);
                    this.countdownImageI = progressI;
                    this.countdownImage = this.add.sprite(screenCenterX, screenCenterY, countdownImages[this.countdownImageI]);
                }
                this.countdownImage.setScale(1 - progressToNextI);
                this.countdownImage.setAlpha(1 - progressToNextI);
            }
        }
    }
    startGame() {
        this.countdownImage;
    }
}
ABCRacePlayScene.Key = "PLAY";
class ABCRace {
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
        });
    }
}
ABCRace.items = [];
ABCRace.LowercaseLetters = [..."abcdefghijklmnopqrstuvwxyz"];
ABCRace.UppercaseLetters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
window.onload = () => {
    new ABCRace();
};
