import { BackgroundKey } from "./backgrounds"
import { SpriteData } from "./characters"

export type MonsterKey =
    | "goo"

// type MonsterAnimationKey =
//     | "monster_idle"

export type MonsterData = {
    /** Name of the monster.
     * NOTE: Keep all character names and monster names unique!
     */
    name: MonsterKey
    spritesheet: SpriteData
    background: BackgroundKey

    attack: number
    hp: number
    xp: number
}

// NOTE: We import this file in the index.html, this variable is important.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const monsters: {[T in MonsterKey]: MonsterData} = {
    "goo": {
        attack: 1,
        background: "dirt",
        hp: 10,
        name: "goo",
        spritesheet: {
            file: "images/monsters/goo.png",
            frameHeight: 19,
            frameWidth: 15,
        },
        xp: 1
    }
}