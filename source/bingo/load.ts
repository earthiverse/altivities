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

    // Add all words to the menu
    let num = 1
    for (const word of wordlist) {

        // <div id="option1" class="option" draggable="true" ondragstart="onDragStart(event);" style="order: 1;">drag me 1</div>
        const option = document.createElement("div")
        option.id = `option${num}`
        option.classList.add("option")
        option.draggable = true
        option.addEventListener("dragstart", onDragStart)
        option.style.order = num.toString()

        const image = await new Promise<HTMLImageElement>((resolve) => {
            const preload = new Image()
            preload.addEventListener("load", () => resolve(preload))
            preload.addEventListener("error", () => resolve(undefined))
            preload.src = word.image
        })

        let text: Text
        if (Array.isArray(word.en)) {
            text = document.createTextNode(word.en[0])
        } else {
            text = document.createTextNode(word.en)
        }

        if (image) {
            option.appendChild(image)
        }
        option.appendChild(text)

        select.appendChild(option)
        num += 1
    }
}

if (parameters.category && parameters.list) {
    generateMenuOptions(`../wordlists/${parameters.category}/${parameters.list}.json`)
}

export {}