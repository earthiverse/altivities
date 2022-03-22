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

const parameters: any = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop: string) => {
        const parameter = searchParams.get(prop)
        if (parameter) return parameter
    }
})

async function prepare() {
    const peer = new Peer()
    if (parameters.id) {
        // Join
        peer.on("open", (id) => {
            console.debug(`My peer ID is: ${id}`)
            const conn = peer.connect(id)
            conn.on("open", function() {
                // Receive messages
                conn.on("data", (data) => {
                    console.debug("Received Data!")
                    console.debug(data)
                })

                let i = 0
                setInterval(() => {
                    conn.send(i++)
                }, 1000)
            })
        })
    } else {
        // Host
        peer.on("open", (id) => {
            console.debug(`My peer ID is: ${id}`)

            const qrHolder = document.getElementById("qrcode") as HTMLDivElement
            const size = Math.min(window.innerWidth, window.innerHeight) * 0.75

            new QRCode(qrHolder, {
                text: `${window.location.href}?${new URLSearchParams({ id: id })}`,
                width: size,
                height: size,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctionLevel: QRCode.CorrectLevel.H
            })
        })
        peer.on("connection", (conn) => {
            console.debug("Connection received!?")
            console.debug(conn)
            conn.on("data", (data) => {
                console.debug("Received data!")
                console.debug(data)
            })
        })
    }
}
prepare()

export {}