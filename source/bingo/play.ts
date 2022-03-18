import { Wordlist } from "."

const parameters: any = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop: string) => {
        const parameter = searchParams.get(prop)
        if (parameter) return parameter
    }
})

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
            let thisWord: string
            if (Array.isArray(find.en)) {
                thisWord = find.en[0]
            } else {
                thisWord = find.en
            }
            if (thisWord !== word) continue

            // We found the word, add it to the bingo card
            const itemOutside = document.createElement("div")
            const itemInside = document.createElement("div")
            itemOutside.id = `option${num}`
            itemOutside.classList.add("item")
            itemInside.classList.add("item_inside")
            if (find.image) {
                itemInside.style.backgroundImage = `url('${find.image}')`
                itemInside.style.backgroundRepeat = "no-repeat"
                itemInside.style.backgroundPosition = "center"
                itemInside.style.backgroundSize = "contain"
            }

            itemInside.innerText = thisWord
            itemOutside.appendChild(itemInside)
            const cell = document.getElementById(`cell${num}`)
            cell.appendChild(itemOutside)
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
    if (parameters.wordlist && parameters.words) {
        const response = await fetch(parameters.wordlist)
        const wordlist: Wordlist = await response.json()

        const words = (parameters.words as string).split("🔥")
        populateBingo(wordlist, words)
    }

    if (parameters.wordlists && parameters.words) {
        // Combine all wordlists
        const combinedWordlist: Wordlist = []
        for (const url of parameters.wordlists.split(",")) {
            const response = await fetch(url)
            const wordlist: Wordlist = await response.json()
            combinedWordlist.push(...wordlist)
        }
        const words = (parameters.words as string).split("🔥")
        populateBingo(combinedWordlist, words)
    }
}
prepare()

// The following handles resizing the window.
// It's a hack to fill in the screen on iPads.
let RESIZE_FINISHED
function resize() {
    if (RESIZE_FINISHED) clearTimeout(RESIZE_FINISHED)
    RESIZE_FINISHED = setTimeout(() => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty("--vh", `${vh}px`)
    }, 250)
}
resize()
window.addEventListener("resize", resize)

export {}