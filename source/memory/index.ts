
/*******************************************************************************
*** Types *********************************************************************/

import { Wordlist } from "../wordlists/wordlists"

declare global {
    interface Window {
        peerjs: { util: Peer.util };
    }
}

// NOTE: These get included because we import wordlist.js
declare let PARAMETERS: any
declare let prepareWordlist: () => Promise<Wordlist>
declare let randomIntFromInterval: (min: number, max: number) => number

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
    | ["MATCH", [number, number, number]]
    | ["NEW_NAME", string]
    | ["NO_MATCH", [number, number, number]]
    | ["STATE", State]

/*******************************************************************************
*** Helpers *******************************************************************/
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

/*******************************************************************************
*** Config ********************************************************************/
const COLOR_WHITE = "#F9F9F9"
const COLOR_DARK_BLUE = "#5AA9E6"
const COLOR_RED = "#FC7B7B"

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
                urls: "stun:stun.l.google.com:19302"
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
            },
            {
                urls: "turn:numb.viagenie.ca:3478",
                username: "hyprkookeez@gmail.com",
                credential: "BE8TdqMYuDp6P!h"
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
const AGAIN = document.getElementById("again") as HTMLDivElement
const EXTRA = document.getElementById("extra") as HTMLDivElement
const INFORMATION = document.getElementById("information") as HTMLDivElement
const PLAY = document.getElementById("play") as HTMLDivElement
const PLAYERS = document.getElementById("players") as HTMLDivElement
const QR = document.getElementById("qr") as HTMLDivElement
const START = document.getElementById("start") as HTMLDivElement
const TEACHER = document.getElementById("teacher") as HTMLDivElement
const USERNAME_INPUT = document.getElementById("username_input") as HTMLInputElement
const USERNAME_OK = document.getElementById("username_ok") as HTMLInputElement


/*******************************************************************************
*** Game Code *****************************************************************/
// Variables
const IS_HOST = PARAMETERS.id == undefined
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

function isMyTurn(): boolean {
    if (STATE.mode !== "play") return false
    const turnPlayer = STATE.players[STATE.turn]
    return turnPlayer == USERNAME_INPUT.value
}

function isFinished(): boolean {
    if (STATE.mode !== "play") return false
    for (const card of STATE.cards) {
        if (card.belongTo == undefined) return false
    }
    return true
}

function changeTurn(last: number) {
    if (STATE.mode !== "play") return
    STATE.turn = (last + 1) % STATE.players.length
}

function updateMatch(player: number, num1: number, num2: number) {
    if (STATE.mode !== "play") return // Wrong mode
    const turnPlayer = STATE.players[player]
    const word = STATE.cards[num1]

    // Ensure cards are shown
    showFlip(num1)
    showFlip(num2)

    INFORMATION.innerHTML = `<span><strong>${turnPlayer}</strong> matched ${word.en}!</span>`
    if (!PARAMETERS.go_again) changeTurn(player)
}

function updateNoMatch(player: number, num1: number, num2: number) {
    if (STATE.mode !== "play") return // Wrong mode
    const turnPlayer = STATE.players[player]

    // Ensure cards are shown
    showFlip(num1)
    showFlip(num2)

    INFORMATION.innerHTML = `<span><strong>${turnPlayer}</strong> didn't match any words...</span>`
    changeTurn(player)

    const flipBack = (num) => {
        const card = PLAY.children.item(num) as HTMLDivElement
        const innerCard = card.firstChild as HTMLDivElement
        innerCard.style.transform = "rotateY(0deg)"
        delete STATE.cards[num].show
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
        if (first.en == second.en) {
            // Match
            first.belongTo = STATE.turn
            second.belongTo = STATE.turn
            sendDataToAllPeers(["MATCH", [STATE.turn, firstNum, secondNum]])
            updateMatch(STATE.turn, firstNum, secondNum)
        } else {
            // No match
            sendDataToAllPeers(["NO_MATCH", [STATE.turn, firstNum, secondNum]])
            updateNoMatch(STATE.turn, firstNum, secondNum)
        }
        setTimeout(() => {
            if (STATE.mode !== "play") return

            if (isFinished()) {
                STATE.cards.sort((a, b) => {
                    // Sort by owner first
                    if (a.belongTo !== b.belongTo) return a.belongTo - b.belongTo

                    // Sort alphabetically second
                    if (a.en < b.en) return -1
                    if (a.en > b.en) return 1
                    return 0
                })

                STATE = {
                    cards: STATE.cards,
                    mode: "results",
                    players: STATE.players,
                    words: STATE.words
                }
            }

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

    const createCard = (i: number): HTMLDivElement => {
        const card = STATE.cards[i]

        const front = document.createElement("div")
        front.innerHTML = "<span class=\"material-icons\">help</span>"
        front.classList.add("card-front")

        const back = document.createElement("div")
        back.classList.add("card-back")

        const inside = document.createElement("div")
        inside.classList.add("card-inside")
        inside.appendChild(front)
        inside.appendChild(back)

        const outside = document.createElement("div")
        outside.appendChild(inside)
        outside.classList.add("card")

        if (isMyTurn() && card.belongTo == undefined && !card.show) {
            inside.classList.add("card-inside-draw")
            const handle = () => {
                if (IS_HOST) {
                    if (!isMyTurn()) return
                    updateFlip(i)
                    front.removeEventListener("click", handle)
                } else {
                    const [host] = PEERS.get("host")
                    sendData(host, ["CARD_FLIP", i])
                }
            }
            front.addEventListener("click", handle)
        }

        for (const word of STATE.words) {
            const en = Array.isArray(word.en) ? word.en[0] : word.en
            if (card.en !== en) continue
            back.style.backgroundImage = `url('${word.image}')`

            const wordSpan = document.createElement("span")
            wordSpan.innerText = en
            back.appendChild(wordSpan)

            break
        }

        if (card.belongTo !== undefined || card.show) {
            front.style.display = "none"
            back.style.transform = "none"
            inside.style.transition = "none"
        }

        return outside
    }

    switch (STATE.mode) {
        case "play": {
            clearElement(PLAY)

            const turnPlayer = STATE.players[STATE.turn]

            // Update information
            if (isMyTurn()) {
                INFORMATION.innerHTML = "<span><strong>It's your turn!</strong></span>"
            } else {
                INFORMATION.innerHTML = `<span>Waiting for <strong>${turnPlayer}</strong>...</span>`
            }

            // Update cards
            for (let i = 0; i < STATE.cards.length; i++) {
                const outside = createCard(i)
                PLAY.appendChild(outside)
            }
            break
        }
        case "results": {
            clearElement(PLAY)

            const results = document.createElement("div")
            results.id = "results"
            PLAY.appendChild(results)

            // Count the totals
            const totals = new Map<number, number>()
            for (const card of STATE.cards) {
                totals.set(card.belongTo, (totals.get(card.belongTo) + 1) || 1)
            }

            let highestCount = Number.MIN_SAFE_INTEGER
            let highestPlayers: string[]
            for (let i = 0; i < STATE.players.length; i++) {
                const name = STATE.players[i]
                const count = totals.get(i) / 2

                if (count > highestCount) {
                    highestCount = count
                    highestPlayers = [name]
                } else if (count == highestCount) {
                    highestPlayers.push(name)
                }

                const playerDiv = document.createElement("div")
                playerDiv.classList.add("results-player")
                playerDiv.style.order = count.toString()
                results.appendChild(playerDiv)

                // Add player name and count
                const nameDiv = document.createElement("div")
                nameDiv.classList.add("results-name")
                playerDiv.appendChild(nameDiv)
                nameDiv.innerText = `${name}: ${count}`

                // Add cards that they own
                const cardsDiv = document.createElement("div")
                cardsDiv.classList.add("results-cards")
                playerDiv.appendChild(cardsDiv)
                for (let j = 0; j < STATE.cards.length; j += 2) {
                    const card = STATE.cards[j]
                    if (card.belongTo == i) {
                        const outside = createCard(j)
                        cardsDiv.appendChild(outside)
                    }
                }
            }

            // Update information for the winner(s)
            if (highestPlayers.length == 1) {
                INFORMATION.innerHTML = `<span>Congratulations, <strong>${highestPlayers[0]}</strong>!</span>`
            } else if (highestPlayers.length == 2) {
                INFORMATION.innerHTML = `<span>Congratulations, <strong>${highestPlayers[0]}</strong> and <strong>${highestPlayers[1]}</strong>!</span>`
            } else {
                let players = ""
                for (let i = 0; i < highestPlayers.length - 1; i++) {
                    players += `<strong>${highestPlayers[i]}</strong>, `
                }
                players += `and <strong>${highestPlayers[highestPlayers.length - 1]}</strong>`
                INFORMATION.innerHTML = `<span>Congratulations ${players}!</span>`
            }

            // Highlight the winner(s)
            for (const name of highestPlayers) {
                const index = STATE.players.indexOf(name)
                const winnerSpan = PLAYERS.childNodes.item(index) as HTMLSpanElement
                winnerSpan.classList.add("winner")
            }

            if (IS_HOST) {
                // Show the play again button in 5 seconds
                setTimeout(() => {
                    AGAIN.style.display = "block"
                }, 5000)
            }

            break
        }
    }
}

function showFlip(toFlip: number) {
    const card = PLAY.children.item(toFlip) as HTMLDivElement
    const innerCard = card.firstChild as HTMLDivElement
    innerCard.style.transform = "rotateY(180deg)"
    STATE.cards[toFlip].show = true
}

function showError(text: string) {
    clearElement(PLAY)
    PLAY.innerHTML = "<span class=\"big-icon error material-icons\">error</span>"
    INFORMATION.innerHTML = `<span><span class="error">Error:</span> ${text}`
    PLAYERS.style.display = "none"
    EXTRA.style.display = "none"
}

function showTeacherQR() {
    clearElement(QR)
    const size = Math.min(window.innerWidth, window.innerHeight * 0.8)
    const connectURL = `${window.location.href}`
    new QRCode(QR, {
        colorDark: COLOR_RED,
        colorLight: COLOR_WHITE,
        correctionLevel: QRCode.CorrectLevel.H,
        height: size,
        text: connectURL,
        width: size
    })
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
    AGAIN.style.display = "none"

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
        showQR(PARAMETERS.id)

        // Set the host
        PEERS.set("host", [conn, "host"])

        // Send our name
        sendData(conn, ["NEW_NAME", USERNAME_INPUT.value])
    })

    // Handle host & data
    conn.on("data", (d: Data) => {
        switch (d[0]) {
            case "CARD_FLIP": {
                showFlip(d[1])
                break
            }
            case "MATCH": {
                updateMatch(d[1][0], d[1][1], d[1][2])
                break
            }
            case "NO_MATCH": {
                updateNoMatch(d[1][0], d[1][1], d[1][2])
                break
            }
            case "STATE": {
                STATE = d[1]
                switch (STATE.mode) {
                    case "lobby": {
                        INFORMATION.innerHTML = `<span>Waiting for <strong>${STATE.players[0]} (HOST)</strong> to start...</span>`
                        updatePlayers()
                        break
                    }
                    case "play":
                    case "results": {
                        updateGame()
                        break
                    }
                }
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

async function resetGame() {
    const wordlist = await prepareWordlist()

    STATE.words = []
    STATE.cards = []

    shuffle(wordlist) // Randomize the words to choose

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
}

function hostGame(peer: Peer, hostID: string) {
    // Add ourselves to the players
    STATE.players.push(USERNAME_INPUT.value)

    resetGame()

    showQR(hostID)
    updatePlayers()
    updateStart()

    // Make pressing `start` start the game
    START.addEventListener("click", startGame)

    // Make pressing `play again` start a new round
    AGAIN.addEventListener("click", async () => {
        STATE.mode = "play"
        await resetGame()
        startGame()
    })

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
            switch (d[0]) {
                case "CARD_FLIP": {
                    if (STATE.mode !== "play") break

                    // Check if it's their turn
                    const [, username] = PEERS.get(conn.peer)
                    const playerNum = STATE.players.indexOf(username)
                    if (STATE.turn !== playerNum) break

                    // Check if it's already been drawn
                    const card = STATE.cards[d[1]]
                    if (card.belongTo !== undefined) break
                    if (card.show) break

                    updateFlip(d[1])
                    break
                }
                case "NEW_NAME": {
                    if (STATE.mode == "lobby") {

                        const username = d[1]
                        STATE.players.push(username)
                        PEERS.set(conn.peer, [conn, username])
                        sendDataToAllPeers(["STATE", STATE])
                        updatePlayers()
                        updateStart()
                    } else {
                        if (!PEERS.has(conn.peer)) {
                            conn.close()
                            return // They weren't here when the game started
                        }

                        // They reconnected
                        const username = d[1]
                        PEERS.set(conn.peer, [conn, username])
                        sendDataToAllPeers(["STATE", STATE])
                    }
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
    try {
        const wordlist = await prepareWordlist()

        if (IS_HOST && wordlist.length == 0) {
            showError("Redirecting to documentation...")
            window.location.replace("https://github.com/earthiverse/altivities/tree/main/source/memory#wordlists=")
            return
        }
    } catch (e) {
        showError("Error loading wordlist. Redirecting to documentation...")
        window.location.replace("https://github.com/earthiverse/altivities/tree/main/source/memory#wordlists=")
        return
    }

    if (IS_HOST) {
        // Show the special teacher QR code
        TEACHER.style.display = "block"
        TEACHER.addEventListener("click", () => {
            showTeacherQR()
        })
    }

    if (window.peerjs.util.browser == "Unsupported") {
        showError("Unsupported Browser.")
        return
    }

    const peer = new Peer(localStorage.getItem(LOCAL_STORAGE_PEERJS_ID), PEERJS_CONFIG)
    peer.on("open", (id) => {
        localStorage.setItem(LOCAL_STORAGE_PEERJS_ID, id)

        USERNAME_OK.disabled = false
        if (IS_HOST) {
            USERNAME_OK.addEventListener("click", () => {
                localStorage.setItem(LOCAL_STORAGE_NAME, USERNAME_INPUT.value)
                TEACHER.style.display = "none"
                USERNAME_OK.disabled = true
                hostGame(peer, id)
            })
        } else {
            USERNAME_OK.addEventListener("click", () => {
                localStorage.setItem(LOCAL_STORAGE_NAME, USERNAME_INPUT.value)
                USERNAME_OK.disabled = true
                joinGame(peer, PARAMETERS.id)
            })
        }
    })
    peer.on("error", () => {
        showError("Could not connect to PeerJS server.")
    })
}
prepare()

export {}