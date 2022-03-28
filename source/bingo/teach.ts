import { Wordlist } from "."

const parameters: any = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop: string) => {
        const parameter = searchParams.get(prop)
        if (parameter) return parameter
    }
})

function shuffle(array) {
    let currentIndex = array.length, randomIndex

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
    }

    return array
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function drawRandom() {
    const toDraw = document.getElementById("to_draw_area") as HTMLDivElement
    const current = document.getElementById("current_area") as HTMLDivElement
    const drawn = document.getElementById("drawn_area") as HTMLDivElement

    // Move the current element to the drawn menu
    while (current.firstChild) drawn.appendChild(current.firstChild)

    // Put the items in an array, shuffle, and fill current area
    const itemsArray = []
    toDraw.childNodes.forEach((child: HTMLDivElement) => {
        if (child.classList?.contains("item")) itemsArray.push(child)
    })
    shuffle(itemsArray)
    current.appendChild(itemsArray[0])

    checkDraw()
}

function checkDraw() {
    const toDraw = document.getElementById("to_draw_area") as HTMLDivElement
    const drawButton = document.getElementById("draw_card") as HTMLDivElement

    let hasItem = false
    toDraw.childNodes.forEach((child: HTMLDivElement) => {
        if (child.classList?.contains("item")) hasItem = true
    })

    if (hasItem) {
        drawButton.style.cursor = "pointer"
        drawButton.style.backgroundColor = "var(--ready-yes-color)"
        drawButton.addEventListener("click", drawRandom)
        return true
    } else {
        drawButton.style.cursor = "not-allowed"
        drawButton.style.backgroundColor = "var(--ready-no-color)"
        drawButton.removeEventListener("click", drawRandom)
        return false
    }
}

async function onMouseDown(event: Event) {
    const target = event.currentTarget as HTMLDivElement
    const parent = target.parentElement as HTMLDivElement

    const toDraw = document.getElementById("to_draw_area") as HTMLDivElement
    const current = document.getElementById("current_area") as HTMLDivElement
    const drawn = document.getElementById("drawn_area") as HTMLDivElement

    if (parent.id == "drawn_area") {
        // Move current item back to toDraw area
        while (current.firstChild) toDraw.appendChild(current.firstChild)

        // TODO: Move clicked item to current area
        current.appendChild(target)
    } else if (parent.id == "current_area") {
        // Move clicked item back to toDraw
        toDraw.appendChild(target)
    } else if (parent.id == "to_draw_area") {
        // Move current to drawn
        while (current.firstChild) drawn.appendChild(current.firstChild)

        // Move clicked to current
        current.appendChild(target)
    }

    checkDraw()
}

async function generateMenuOptions(wordlist: Wordlist) {
    const menu = document.getElementById("to_draw_area") as HTMLDivElement

    // Add all items to the menu
    let num = 0
    for (const word of wordlist) {
        const itemOutside = document.createElement("div")
        const itemInside = document.createElement("div")
        itemOutside.id = `option${num}`
        itemOutside.addEventListener("mousedown", onMouseDown)
        itemOutside.style.order = num.toString()
        itemOutside.classList.add("item")
        itemInside.classList.add("item_inside")
        if (word.image) {
            itemInside.style.backgroundImage = `url('${word.image}')`
            itemInside.style.backgroundRepeat = "no-repeat"
            itemInside.style.backgroundPosition = "center"
            itemInside.style.backgroundSize = "contain"
        }

        if (Array.isArray(word.en)) {
            itemInside.innerText = word.en[0]
        } else {
            itemInside.innerText = word.en
        }

        itemOutside.appendChild(itemInside)
        menu.appendChild(itemOutside)
        num += 1
    }

    checkDraw()
}

async function prepare() {
    const combinedWordlist: Wordlist = []

    if (parameters.wordlist) {
        const response = await fetch(parameters.wordlist)
        const wordlist: Wordlist = await response.json()
        combinedWordlist.push(...wordlist)
    }

    if (parameters.wordlists) {
        // Combine all wordlists
        for (const url of parameters.wordlists.split(",")) {
            const response = await fetch(url)
            const wordlist: Wordlist = await response.json()
            combinedWordlist.push(...wordlist)
        }
    }

    if (parameters.ignore) {
        const toIgnore: string[] = parameters.ignore.split(",")
        for (let i = 0; i < combinedWordlist.length; i++) {
            const word = combinedWordlist[i]
            for (const ignoreWord of toIgnore) {
                if (word.en == ignoreWord
                    || (Array.isArray(word.en) && word.en[0] == ignoreWord)) {
                    // Remove this word from the wordlist
                    combinedWordlist.splice(i, 1)
                    i -= 1
                    break
                }
            }
        }
    }

    if (parameters.include) {
        const toInclude: string[] = parameters.include.split(",")
        for (let i = 0; i < combinedWordlist.length; i++) {
            const word = combinedWordlist[i]
            let remove = true
            for (const includeWord of toInclude) {
                if (word.en == includeWord
                    || (Array.isArray(word.en) && word.en[0] == includeWord)) {
                    // Remove this word from the wordlist
                    remove = false
                    break
                }

                // Check if it's an alternative word
                if (Array.isArray(word.en)) {
                    for (let j = 0; j < word.en.length; j++) {
                        const alternativeWord = word.en[j]
                        if (alternativeWord !== includeWord) continue
                        // We found the word as an alternative, set it as the main word
                        word.en = alternativeWord
                        remove = false
                        break
                    }
                }
            }
            if (remove) {
                combinedWordlist.splice(i, 1)
                i -= 1
            }
        }
    }

    generateMenuOptions(combinedWordlist)

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