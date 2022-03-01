export type SpriteData = {
    /** Filename for the given character sprites */
    file: string
    frameWidth: number
    frameHeight: number
    scale?: number
}

export type CharacterData = {
    hp: number
    attack: number
    level: number
    gold: number
    xp: number
    color: number
    color_light: number
    color_dark: number
    face: string
    skin: string
}

export type Character = {
    /** Name of the character.
     * NOTE: Keep all character names and monster names unique!
     */
    color: number
    color_light: number
    color_dark: number
    name: string
    face: string
    spritesheet: SpriteData
}

export type CharacterKey =
    | "boy"

export type CharacterAnimationKey =
    | "character_attack_sword"
    | "character_fail"
    | "character_idle"
    | "character_idle_sword"

// NOTE: We import this file in the index.html, this variable is important.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const characters: { [T in CharacterKey]: Character} = {
    "boy": {
        color: 0xA56F36,
        color_dark: 0x745843,
        color_light: 0xB6935D,
        face: "images/faces/boy.png",
        name: "boy",
        spritesheet: {
            file: "images/characters/boy.png",
            frameHeight: 48,
            frameWidth: 48,
        }
    }
}