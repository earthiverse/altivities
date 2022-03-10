type Languages =
    | "en"
    | "ja"

type Word = {
    [T in Exclude<Languages, "ja">]: string | string[]
} & {
    image?: string
    ja: {
        kanji: string
        hiragana: string
    } | {
        kanji: string
        hiragana: string
    }[]
}

type Wordlist = Word[]

declare let onDragStart: (data: DragEvent) => void

const parameters: any = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop: string) => searchParams.get(prop)
})

async function generateMenuOptions(wordlistURL: string) {
    const response = await fetch(wordlistURL)
    const wordlist: Wordlist = await response.json()
    console.log(wordlist)

    const select = document.getElementById("select") as HTMLDivElement

    // Add all items to the select
    let num = 1
    for (const word of wordlist) {
        const itemOutside = document.createElement("div")
        const itemInside = document.createElement("div")
        itemOutside.id = `option${num}`
        itemOutside.draggable = true
        itemOutside.addEventListener("dragstart", onDragStart)
        itemOutside.style.order = num.toString()
        itemOutside.classList.add("item")
        itemInside.classList.add("itemInside")
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
        select.appendChild(itemOutside)
        num += 1
    }
}

if (parameters.category && parameters.list) {
    generateMenuOptions(`../wordlists/${parameters.category}/${parameters.list}.json`)
}

export {}