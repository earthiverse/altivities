"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ABCRaceLoad extends Phaser.Scene {
    constructor() {
        super({ key: ABCRaceLoad.Key });
    }
    create() {
        this.scene.start(ABCRaceMenu.Key);
    }
    preload() {
        for (const letter of ABCRaceGame.LowercaseLetters)
            this.load.image(letter, `images/lower/${letter}.svg`);
        for (const letter of ABCRaceGame.UppercaseLetters)
            this.load.image(letter, `images/upper/${letter}.svg`);
        this.load.image("logo", "images/logo.png");
        this.load.audio("menu_bgm", "sounds/menu_bgm.ogg");
    }
}
ABCRaceLoad.Key = "LOAD";
class ABCRaceMenu extends Phaser.Scene {
    constructor() {
        super({ key: ABCRaceMenu.Key });
    }
    create() {
        this.add.sprite(0, 0, "logo").setOrigin(0, 0);
        this.sound.play("menu_bgm", { loop: true });
    }
}
ABCRaceMenu.Key = "MENU";
class ABCRacePlay extends Phaser.Scene {
    constructor() {
        super({ key: ABCRacePlay.Key });
    }
}
ABCRacePlay.Key = "PLAY";
class ABCRaceGame {
    constructor() {
        this.game = new Phaser.Game({
            backgroundColor: 0xFFFFFF,
            height: 600,
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.ScaleModes.FIT
            },
            scene: [ABCRaceLoad, ABCRaceMenu, ABCRacePlay],
            type: Phaser.AUTO,
            width: 800
        });
    }
}
ABCRaceGame.items = [];
ABCRaceGame.LowercaseLetters = [..."abcdefghijklmnopqrstuvwxyz"];
ABCRaceGame.UppercaseLetters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
window.onload = () => {
    new ABCRaceGame();
};
