"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BasicButton extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, 0, 0, config.key, 2);
        this.enabled = false;
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
    onDown() {
        this.setFrame(this.config.enabled);
    }
    onOver() {
        if (this.enabled)
            this.setFrame(this.config.enabled);
        else
            this.setFrame(this.config.over);
    }
    onOut() {
        if (this.enabled)
            this.setFrame(this.config.enabled);
        else
            this.setFrame(this.config.disabled);
    }
    setEnabled() {
        this.enabled = true;
        this.setFrame(this.config.enabled);
    }
    setDisabled() {
        this.enabled = false;
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
        this.load.image("logo", "images/logo.png");
        this.load.spritesheet("lowercase_buttons", "images/lowercase_buttons.png", { frameHeight: 160, frameWidth: 210 });
        this.load.spritesheet("random_buttons", "images/random_buttons.png", { frameHeight: 160, frameWidth: 210 });
        this.load.spritesheet("uppercase_buttons", "images/uppercase_buttons.png", { frameHeight: 160, frameWidth: 210 });
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
            "scene": this,
            "key": "lowercase_buttons",
            "x": 40,
            "y": 210
        });
        const uppercaseButton = new BasicButton({
            "scene": this,
            "key": "uppercase_buttons",
            "x": 295,
            "y": 210
        });
        const randomButton = new BasicButton({
            "scene": this,
            "key": "random_buttons",
            "x": 550,
            "y": 210
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
    }
}
ABCRaceMenuScene.Key = "MENU";
class ABCRacePlayScene extends Phaser.Scene {
    constructor() {
        super({ key: ABCRacePlayScene.Key });
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
