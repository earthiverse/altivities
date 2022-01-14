type ButtonConfig = {
    key: string
    scene: Phaser.Scene
    enabled?: number
    disabled?: number
    over?: number
    x?: number
    y?: number
}

// Based on https://phasergames.com/how-to-make-buttons-in-phaser-3/
class BasicButton extends Phaser.GameObjects.Sprite {
    private config: ButtonConfig
    private enabled = false

    constructor(config: ButtonConfig) {
        //call the constructor of the parent
        //set at 0,0 in case there is no x and y
        //in the config
        super(config.scene, 0, 0, config.key, 2)

        this.config = config

        //check if config contains a scene
        if (!config.scene) throw new Error("config.scene is not set")

        //check if config contains a key
        if (!config.key) throw new Error("config.key is not set")

        //if there is no up property assume 0
        if (!config.enabled) config.enabled = 1

        //if there is no down in config use up
        if (!config.disabled) config.disabled = 2

        //if there is no over in config use up
        if (!config.over) config.over = 0

        // set x and y
        if (config.x) this.x = config.x
        if (config.y) this.y = config.y

        // add to the scene
        config.scene.add.existing(this)

        //make interactive and set listeners
        this.setInteractive()
        this.on("pointerdown", this.onDown, this)
        this.on("pointerover", this.onOver, this)
        this.on("pointerout", this.onOut, this)
        this.setDisabled()

        this.setOrigin(0, 0)
    }

    onDown() {
        this.setFrame(this.config.enabled)
    }
    onOver() {
        if (this.enabled) this.setFrame(this.config.enabled)
        else this.setFrame(this.config.over)
    }
    onOut() {
        if (this.enabled) this.setFrame(this.config.enabled)
        else this.setFrame(this.config.disabled)
    }

    public setEnabled() {
        this.enabled = true
        this.setFrame(this.config.enabled)
    }

    public setDisabled() {
        this.enabled = false
        this.setFrame(this.config.disabled)
    }
}

class ABCRaceLoadScene extends Phaser.Scene {
    static Key = "LOAD"
    constructor() {
        super({ key: ABCRaceLoadScene.Key })
    }

    create() {
        this.scene.start(ABCRaceMenuScene.Key)
    }

    preload() {
        // Load ABC Images
        for (const letter of ABCRace.LowercaseLetters) this.load.image(letter, `images/lower/${letter}.svg`)
        for (const letter of ABCRace.UppercaseLetters) this.load.image(letter, `images/upper/${letter}.svg`)

        // Load Logo
        this.load.image("logo", "images/logo.png")

        // Load Buttons
        this.load.spritesheet("lowercase_buttons", "images/lowercase_buttons.png", { frameHeight: 160, frameWidth: 210 })
        this.load.spritesheet("random_buttons", "images/random_buttons.png", { frameHeight: 160, frameWidth: 210 })
        this.load.spritesheet("uppercase_buttons", "images/uppercase_buttons.png", { frameHeight: 160, frameWidth: 210 })

        // Load Music
        // Of Far Different Nature - Summer House [v2]
        // https://fardifferent.itch.io/loops
        this.load.audio("menu_bgm", "sounds/menu_bgm.ogg")
    }
}

class ABCRaceMenuScene extends Phaser.Scene {
    static Key = "MENU"
    constructor() {
        super({ key: ABCRaceMenuScene.Key })
    }

    create() {
        this.add.sprite(0, 0, "logo").setOrigin(0, 0)
        this.sound.play("menu_bgm", { loop: true })

        const lowercaseButton = new BasicButton({
            "scene": this,
            "key": "lowercase_buttons",
            "x": 40,
            "y": 210
        })

        const uppercaseButton = new BasicButton({
            "scene": this,
            "key": "uppercase_buttons",
            "x": 295,
            "y": 210
        })

        const randomButton = new BasicButton({
            "scene": this,
            "key": "random_buttons",
            "x": 550,
            "y": 210
        })

        lowercaseButton.on("pointerdown", () => {
            lowercaseButton.setEnabled()
            uppercaseButton.setDisabled()
            randomButton.setDisabled()
        })
        uppercaseButton.on("pointerdown", () => {
            lowercaseButton.setDisabled()
            uppercaseButton.setEnabled()
            randomButton.setDisabled()
        })
        randomButton.on("pointerdown", () => {
            lowercaseButton.setDisabled()
            uppercaseButton.setDisabled()
            randomButton.setEnabled()
        })
        uppercaseButton.setEnabled()
    }
}

class ABCRacePlayScene extends Phaser.Scene {
    static Key = "PLAY"
    constructor() {
        super({ key: ABCRacePlayScene.Key })
    }
}

class ABCRace {
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
            scene: [ABCRaceLoadScene, ABCRaceMenuScene, ABCRacePlayScene],
            type: Phaser.AUTO,
            width: 800
        })
    }
}

window.onload = () => {
    new ABCRace()
}

export {}