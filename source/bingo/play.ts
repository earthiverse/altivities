import { Wordlist } from "../wordlists/wordlists"

declare let PARAMETERS: any
declare let prepareWordlist: () => Promise<Wordlist>

interface textFitOptions {
    alignVert?: boolean;
    alignHoriz?: boolean;
    multiLine?: boolean;
    detectMultiLine?: boolean;
    minFontSize?: number;
    maxFontSize?: number;
    reProcess?: boolean;
    widthOnly?: boolean;
    alignVertWithFlexbox?: boolean;
}

declare let textFit: (
    els: Element | Element[] | NodeListOf<Element> | HTMLCollection | null,
    options?: textFitOptions
) => void

function onMouseDown(event: Event) {
    const target = event.currentTarget as HTMLDivElement

    // TODO: Add a circle, or remove a circle
    if (target.classList.contains("marked")) {
        // Remove the circle
        target.lastChild.remove()
        target.classList.remove("marked")
    } else {
        // Add the circle
        const marked = new Image()
        marked.src = "images/marked.png"
        target.appendChild(marked)
        target.classList.add("marked")
    }
}

function populateBingo(wordlist: Wordlist, words: string[]) {
    let num = 0
    for (const word of words) {
        let found = false
        for (const find of wordlist) {
            if (Array.isArray(find.en)) {
                if (!find.en.includes(word)) continue
            }
            else if (find.en !== word) continue

            // We found the word, add it to the bingo card
            const itemOutside = document.createElement("div")
            const itemInside = document.createElement("div")
            itemOutside.id = `option${num}`
            itemOutside.classList.add("item")
            itemInside.classList.add("item_inside")
            if (find.image) {
                itemOutside.style.backgroundImage = `url('${find.image}')`
                itemOutside.style.backgroundRepeat = "no-repeat"
                itemOutside.style.backgroundPosition = "center"
                itemOutside.style.backgroundSize = "contain"
            }

            itemInside.innerText = word
            itemOutside.appendChild(itemInside)
            const cell = document.getElementById(`cell${num}`)
            cell.appendChild(itemOutside)
            textFit(itemInside, { alignHoriz: true })
            found = true
            num += 1
            break
        }
        if (!found) {
            // We have an error to deal with
            throw `We didn't find the word ${word}!`
        }
    }
}

async function prepare() {
    const combinedWordlist = await prepareWordlist()
    const words = (PARAMETERS.words as string).split("🔥")
    populateBingo(combinedWordlist, words)

    if (PARAMETERS.title) {
        const playArea = document.getElementById("play_area")
        const title = document.createElement("div")
        title.classList.add("break")
        title.style.fontSize = "3vh"
        title.innerText = PARAMETERS.title
        playArea.prepend(title)
    }
}
prepare()

function fitTextForAllCards() {
    const cards = document.getElementsByClassName("item_inside") as HTMLCollectionOf<HTMLDivElement>
    for (let i = 0; i < cards.length; i++) {
        const inside = cards.item(i)
        textFit(inside, { alignHoriz: true })
    }
}

// The following handles resizing the window.
// It's a hack to fill in the screen on iPads.
let RESIZE_FINISHED
function resize() {
    if (RESIZE_FINISHED) clearTimeout(RESIZE_FINISHED)
    RESIZE_FINISHED = setTimeout(() => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty("--vh", `${vh}px`)

        fitTextForAllCards()
    }, 250)
}
resize()
window.addEventListener("resize", resize)

export {}