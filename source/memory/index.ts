
/*******************************************************************************
*** Types *********************************************************************/
// Wordlist
export type Languages =
    | "en"
    | "ja"

export type Word = {
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

export type Wordlist = Word[]

// QR Code
// TODO: What do I change this to to make it work without the disable-next-line!?
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace QRCode {
    enum CorrectLevel {
        L, M, Q, H
    }
}

interface QRCodeOption {
    text?: string,
    width?: number,
    height?: number,
    colorDark?: string,
    colorLight?: string,
    correctionLevel?: QRCode.CorrectLevel,
}

declare class QRCode {
    constructor(el: HTMLElement | string, vOption?: string | QRCodeOption);
    makeCode(sText: string): void;
    makeImage(): void;
    clear(): void;
}

// State
export type Card = {
    en: string
    /** If set, show them on the play board, otherwise hide */
    show?: true
    /** What player got these right? */
    belongTo?: number
}
export type State = ({
    mode: "lobby"
} | {
    mode: "play" | "reconnect"
    turn: number
} | {
    mode: "results"
}) & {
    players: string[]
    words: Wordlist
    cards: Card[]
}
export type Data =
    | ["CARD_FLIP", number]
    | ["MATCH", [number, number]]
    | ["NEW_NAME", string]
    | ["NO_MATCH", [number, number]]
    | ["STATE", State]

/*******************************************************************************
*** Helpers *******************************************************************/
const parameters: any = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop: string) => {
        const parameter = searchParams.get(prop)
        if (parameter) return parameter
    }
})

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

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

async function sendData(conn: Peer.DataConnection, data: Data) {
    conn.send(data)
}

async function sendDataToAllPeers(data: Data) {
    for (const [, peer] of PEERS) sendData(peer[0], data)
}

async function clearElement(data: HTMLElement) {
    while (data.firstChild) data.removeChild(data.firstChild)
}

async function prepareWordlist(): Promise<Wordlist> {
    const combinedWordlist: Wordlist = []

    if (parameters.wordlist) {
        // Add the one wordlist to the menu
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

    return combinedWordlist
}

/*******************************************************************************
*** Config ********************************************************************/
const COLOR_WHITE = "#F9F9F9"
const COLOR_DARK_BLUE = "#5AA9E6"

const LOCAL_STORAGE_PEERJS_ID = "memory_peerjs"
const LOCAL_STORAGE_NAME = "memory_name"

const MAX_WORDS = 10
const MS_BETWEEN_PLAYERS = 2500

const PEERJS_CONFIG: Peer.PeerJSOption = {
    config: {
        iceServers: [
            {
                urls: "stun:openrelay.metered.ca:80"
            },
            {
                credential: "openrelayproject",
                urls: "turn:openrelay.metered.ca:80",
                username: "openrelayproject"
            },
            {
                credential: "openrelayproject",
                urls: "turn:openrelay.metered.ca:443",
                username: "openrelayproject"
            },
            {
                credential: "openrelayproject",
                urls: "turn:openrelay.metered.ca:443?transport=tcp",
                username: "openrelayproject"
            }
        ]
    },
    debug: 3,
    host: "peerjs.92k.de",
    port: 443,
    secure: true
}

/*******************************************************************************
*** DOM Elements **************************************************************/
const EXTRA = document.getElementById("extra") as HTMLDivElement
const INFORMATION = document.getElementById("information") as HTMLDivElement
const PLAY = document.getElementById("play") as HTMLDivElement
const PLAYERS = document.getElementById("players") as HTMLDivElement
const QR = document.getElementById("qr") as HTMLDivElement
const START = document.getElementById("start") as HTMLDivElement
const USERNAME_INPUT = document.getElementById("username_input") as HTMLInputElement
const USERNAME_OK = document.getElementById("username_ok") as HTMLInputElement


/*******************************************************************************
*** Game Code *****************************************************************/
// Variables
const IS_HOST = parameters.id == undefined
let STATE: State = {
    cards: [],
    mode: "lobby",
    players: [],
    words: []
}
const PEERS = new Map<string, [Peer.DataConnection, string]>()

// Set the username if we have it in localStorage
const initialName = localStorage.getItem(LOCAL_STORAGE_NAME)
if (initialName) USERNAME_INPUT.value = initialName

// Make pressing `enter` on the input click the button.
USERNAME_INPUT.addEventListener("keyup", (event) => {
    if (event.code == "Enter") {
        event.preventDefault()
        USERNAME_OK.click()
    }
})

function updateMatch(num1: number, num2: number) {
    if (STATE.mode !== "play") return // Wrong mode
    const turnPlayer = STATE.players[STATE.turn]
    const word = STATE.cards[num1]

    INFORMATION.innerHTML = `<span><strong>${turnPlayer}</strong> matched ${word.en}!</span>`
}

function updateNoMatch(num1: number, num2: number) {
    if (STATE.mode !== "play") return // Wrong mode
    const turnPlayer = STATE.players[STATE.turn]

    INFORMATION.innerHTML = `<span><strong>${turnPlayer}</strong> didn't match any words...</span>`

    const flipBack = (num) => {
        const card = PLAY.children.item(num) as HTMLDivElement
        const innerCard = card.firstChild as HTMLDivElement
        innerCard.style.transform = "rotateY(360deg)"
    }

    setTimeout(() => { flipBack(num1) }, MS_BETWEEN_PLAYERS - 750)
    setTimeout(() => { flipBack(num2) }, MS_BETWEEN_PLAYERS - 500)
}

function updateFlip(num: number) {
    if (STATE.mode !== "play") return // Wrong mode

    const flipped: Card[] = []
    for (const card of STATE.cards) {
        if (card.belongTo !== undefined) continue
        if (card.show) flipped.push(card)
    }
    if (flipped.length >= 2) return // Don't flip any more

    const flipThis = STATE.cards[num]
    flipThis.show = true
    flipped.push(flipThis)

    // Register the card flip
    sendDataToAllPeers(["CARD_FLIP", num])
    showFlip(num)

    if (flipped.length >= 2) {
        const first = flipped[0]
        const firstNum = STATE.cards.indexOf(first)
        const second = flipped[1]
        const secondNum = STATE.cards.indexOf(second)
        console.debug("first")
        console.debug(first)
        console.debug("second")
        console.debug(second)
        if (first.en == second.en) {
            // Match
            first.belongTo = STATE.turn
            second.belongTo = STATE.turn
            sendDataToAllPeers(["MATCH", [firstNum, secondNum]])
            updateMatch(firstNum, secondNum)
        } else {
            // No match
            delete first.show
            delete second.show
            sendDataToAllPeers(["NO_MATCH", [firstNum, secondNum]])
            updateNoMatch(firstNum, secondNum)
        }
        setTimeout(() => {
            if (STATE.mode !== "play") return

            // TODO: If all cards are flipped, finish the game.

            STATE.turn = (STATE.turn + 1) % STATE.players.length
            sendDataToAllPeers(["STATE", STATE])
            updateGame()
        }, MS_BETWEEN_PLAYERS)
    }
}

function updatePlayers() {
    clearElement(PLAYERS)

    const addPlayer = (name, num) => {
        const span = document.createElement("span")
        if (STATE.mode == "play" && STATE.turn == num) {
            span.classList.add("my-turn")
        }
        span.innerText = name
        PLAYERS.appendChild(span)
    }

    addPlayer(`${STATE.players[0]} (HOST)`, 0)
    for (let i = 1; i < STATE.players.length; i++) {
        addPlayer(STATE.players[i], i)
    }
}

function updateStart() {
    clearElement(INFORMATION)
    if (STATE.players.length <= 1) {
        INFORMATION.innerText = "Waiting for a player to join..."
        START.style.display = "none"
    } else {
        INFORMATION.innerText = "Ready to start!"
        START.style.display = "block"
    }
}

function updateGame() {
    updatePlayers()

    if (STATE.mode == "play") {
        clearElement(PLAY)

        const turnPlayer = STATE.players[STATE.turn]
        const myTurn = turnPlayer == USERNAME_INPUT.value

        // Update information
        if (myTurn) {
            INFORMATION.innerHTML = "<span><strong>It's your turn!</strong></span>"
        } else {
            INFORMATION.innerHTML = `<span>Waiting for <strong>${turnPlayer}</strong>...</span>`
        }

        // Update cards
        for (let i = 0; i < STATE.cards.length; i++) {
            const card = STATE.cards[i]

            const front = document.createElement("div")
            front.innerHTML = "<span class=\"material-icons\">help</span>"
            front.classList.add("card-front")
            if (myTurn && card.belongTo == undefined && !card.show) {
                front.style.cursor = "pointer"
                front.addEventListener("click", () => {
                    if (IS_HOST) {
                        sendDataToAllPeers(["CARD_FLIP", i])
                        updateFlip(i)
                    } else {
                        const [host] = PEERS.get("host")
                        sendData(host, ["CARD_FLIP", i])
                    }
                })
            }

            const back = document.createElement("div")
            back.classList.add("card-back")

            const inside = document.createElement("div")
            inside.classList.add("card-inside")
            inside.appendChild(front)
            inside.appendChild(back)

            const outside = document.createElement("div")
            outside.appendChild(inside)
            outside.classList.add("card")

            for (const word of STATE.words) {
                const en = Array.isArray(word.en) ? word.en[0] : word.en
                if (card.en !== en) continue
                back.style.backgroundImage = `url('${word.image}')`
                break
            }

            if (card.belongTo !== undefined || card.show) {
                front.style.display = "none"
                back.style.transform = "none"
                inside.style.transition = "none"
            } else {
                inside.classList.add("card-inside-draw")
            }

            PLAY.appendChild(outside)
        }
    }
}

function showFlip(toFlip: number) {
    const card = PLAY.children.item(toFlip) as HTMLDivElement
    const innerCard = card.firstChild as HTMLDivElement
    innerCard.style.transform = "rotateY(180deg)"
}

function showError(text: string) {
    clearElement(PLAY)
    PLAY.innerHTML = "<span class=\"big-icon error material-icons\">error</span>"
    INFORMATION.innerHTML = `<span><span class="error">Error:</span> ${text}`
}

function showQR(hostID: string) {
    clearElement(QR)
    const size = Math.min(window.innerWidth, window.innerHeight * 0.8)
    const connectURL = `${window.location.origin}${window.location.pathname}?${new URLSearchParams({ id: hostID })}`
    new QRCode(QR, {
        colorDark: COLOR_DARK_BLUE,
        colorLight: COLOR_WHITE,
        correctionLevel: QRCode.CorrectLevel.H,
        height: size,
        text: connectURL,
        width: size
    })

    // Copy the link if you click on the QR Code
    QR.addEventListener("click", () => {
        navigator.clipboard.writeText(connectURL)
    })
}

function startGame() {
    START.style.display = "none"

    STATE = {
        cards: STATE.cards,
        mode: "play",
        players: STATE.players,
        turn: randomIntFromInterval(0, STATE.players.length - 1),
        words: STATE.words
    }
    sendDataToAllPeers(["STATE", STATE])

    updateGame()
}

function joinGame(peer: Peer, hostID: string) {
    const conn = peer.connect(hostID)
    conn.on("open", () => {
        // Show the QR Code and URL so others can connect by scanning it
        showQR(parameters.id)

        // Set the host
        PEERS.set("host", [conn, "host"])

        // Send our name
        sendData(conn, ["NEW_NAME", USERNAME_INPUT.value])
    })

    // Handle host & data
    conn.on("data", (d: Data) => {
        console.debug("DEBUG: Data Received (JOIN) -----")
        console.debug(d)
        console.debug("---------------------------------")
        switch (d[0]) {
            case "CARD_FLIP": {
                showFlip(d[1])
                break
            }
            case "MATCH": {
                updateMatch(d[1][0], d[1][1])
                break
            }
            case "NO_MATCH": {
                updateNoMatch(d[1][0], d[1][1])
                break
            }
            case "STATE": {
                STATE = d[1]
                switch (STATE.mode) {
                    case "lobby": {
                        INFORMATION.innerHTML = `<span>Waiting for <strong>${STATE.players[0]} (HOST)</strong> to start...</span>`
                        break
                    }
                    case "play": {
                        updateGame()
                        break
                    }
                    default: {
                        break
                    }
                }
                updatePlayers()
                break
            }
            default: {
                console.error("Unknown Data Received")
                console.debug(d)
                break
            }
        }
    })
}

function hostGame(peer: Peer, wordlist: Wordlist, hostID: string) {
    // Add ourselves to the players
    STATE.players.push(USERNAME_INPUT.value)

    // Choose words
    for (let i = 0; i < MAX_WORDS && i < wordlist.length; i++) {
        const word = wordlist[i]
        const card = {
            en: Array.isArray(word.en) ? word.en[0] : word.en,
        }

        // Add the word, and two cards
        STATE.words.push(word)
        STATE.cards.push({ ...card })
        STATE.cards.push({ ...card })
    }

    shuffle(STATE.cards) // Randomize the cards

    showQR(hostID)
    updatePlayers()
    updateStart()

    // Make pressing `start` start the game
    START.addEventListener("click", startGame)

    // Handle players & their data
    peer.on("connection", (conn) => {
        conn.on("open", () => {
            // Send the state of the game when they connect
            sendData(conn, ["STATE", STATE])
        })
        conn.on("error", (err) => {
            console.debug("ERROR")
            console.error(err)
        })
        conn.on("close", () => {
            if (STATE.mode == "lobby") {
                // They disconnected while we were in the lobby, remove them from the game.
                const [, username] = PEERS.get(conn.peer)
                STATE.players.splice(STATE.players.indexOf(username), 1)
                PEERS.delete(conn.peer)
                sendDataToAllPeers(["STATE", STATE])
                updatePlayers()
                updateStart()
            }
        })
        conn.on("data", (d: Data) => {
            console.debug(`peer: ${conn.peer}`)
            console.debug("DEBUG: Data Received (HOST) -----")
            console.debug(d)
            console.debug("---------------------------------")
            switch (d[0]) {
                case "CARD_FLIP": {
                    updateFlip(d[1])
                    break
                }
                case "NEW_NAME": {
                    const username = d[1]
                    STATE.players.push(username)
                    PEERS.set(conn.peer, [conn, username])
                    sendDataToAllPeers(["STATE", STATE])
                    updatePlayers()
                    updateStart()
                }
                    break
                default: {
                    console.error("Unknown Data Received")
                    console.debug(d)
                    break
                }
            }
        })
    })
}

async function prepare() {
    const wordlist = await prepareWordlist()

    if (IS_HOST && wordlist.length == 0) {
        showError("No wordlist detected. Please see documentation.")
        return
    }

    const peer = new Peer(localStorage.getItem(LOCAL_STORAGE_PEERJS_ID), PEERJS_CONFIG)
    peer.on("open", (id) => {
        localStorage.setItem(LOCAL_STORAGE_PEERJS_ID, id)

        USERNAME_OK.disabled = false
        if (IS_HOST) {
            USERNAME_OK.addEventListener("click", () => {
                console.debug("HOSTING!")
                USERNAME_OK.disabled = true
                hostGame(peer, wordlist, id)
            })
        } else {
            USERNAME_OK.addEventListener("click", () => {
                console.debug("JOINING!")
                USERNAME_OK.disabled = true
                joinGame(peer, parameters.id)
            })
        }
    })
}
prepare()

export {}