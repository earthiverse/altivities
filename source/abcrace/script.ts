class ABCRaceLoad extends Phaser.Scene {
    static Key = "LOAD"
    constructor() {
        super({ key: ABCRaceLoad.Key })
    }

    create() {
        this.scene.start(ABCRaceMenu.Key)
    }

    preload() {
        // Load ABC Images
        for (const letter of ABCRaceGame.LowercaseLetters) this.load.image(letter, `images/lower/${letter}.svg`)
        for (const letter of ABCRaceGame.UppercaseLetters) this.load.image(letter, `images/upper/${letter}.svg`)

        // Load Logo
        this.load.image("logo", "images/logo.png")

        // Load Music
        // Of Far Different Nature - Summer House [v2]
        // https://fardifferent.itch.io/loops
        this.load.audio("menu_bgm", "sounds/menu_bgm.ogg")
    }
}

class ABCRaceMenu extends Phaser.Scene {
    static Key = "MENU"
    constructor() {
        super({ key: ABCRaceMenu.Key })
    }

    create() {
        this.add.sprite(0, 0, "logo").setOrigin(0, 0)
        this.sound.play("menu_bgm", { loop: true })


    }
}

class ABCRacePlay extends Phaser.Scene {
    static Key = "PLAY"
    constructor() {
        super({ key: ABCRacePlay.Key })
    }
}

class ABCRaceGame {
    game: Phaser.Game
    static items: Phaser.GameObjects.Sprite[] = []

    static LowercaseLetters = [..."abcdefghijklmnopqrstuvwxyz"]
    static UppercaseLetters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]

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
        })
    }
}

window.onload = () => {
    new ABCRaceGame()
}

export {}