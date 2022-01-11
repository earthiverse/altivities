declare namespace uiWidgets {
    class Button extends Phaser.GameObjects.Sprite {
        constructor(
            scene: Phaser.Scene,
            x: number,
            y: number,
            texture: string,
            downCallback: () => void,
            callbackContext: any
        )
    }

    class TextButton {
        constructor(
            scene: Phaser.Scene,
            x: number,
            y: number,
            texture: string,
            downCallback: () => void,
        )
    }

    class Wheel3D {
        constructor(
            scene: Phaser.Scene,
            xy: {x: number, y: number},
            sprites: Phaser.GameObjects.Sprite[],
            firstPlace: number,
            zoom: number,
            axis: "x" | "y" | "z",
            rotations: {x: number, y: number, z: number}
        )
        active: Phaser.GameObjects.Sprite
        activate: any
        emitter: any
        moveBack: () => void
        moveForward: () => void
        sprites: Phaser.GameObjects.Sprite[]
    }
}

declare module "phaser-ui-tools" {
    export = uiWidgets
}