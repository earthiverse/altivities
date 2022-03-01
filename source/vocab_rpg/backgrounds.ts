export type BackgroundKey =
    | "dirt"

export type BackgroundData = {
    file: string
    name: string
}

// NOTE: We import this file in the index.html, this variable is important.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const backgrounds: { [T in BackgroundKey]: BackgroundData } = {
    "dirt": {
        file: "images/backgrounds/dirt.png",
        name: "dirt",
    }
}