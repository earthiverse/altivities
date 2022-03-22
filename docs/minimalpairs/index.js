"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parameters = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
        const parameter = searchParams.get(prop);
        if (parameter)
            return parameter;
    }
});
async function prepare() {
    const options = {
        debug: 3,
        config: {
            iceServers: [
                {
                    urls: "stun:openrelay.metered.ca:80"
                },
                {
                    urls: "turn:openrelay.metered.ca:80",
                    username: "openrelayproject",
                    credential: "openrelayproject"
                },
                {
                    urls: "turn:openrelay.metered.ca:443",
                    username: "openrelayproject",
                    credential: "openrelayproject"
                },
                {
                    urls: "turn:openrelay.metered.ca:443?transport=tcp",
                    username: "openrelayproject",
                    credential: "openrelayproject"
                }
            ]
        }
    };
    const peer = new Peer(options);
    if (parameters.id) {
        peer.on("open", (id) => {
            console.debug(`My peer ID is: ${id}`);
            console.debug(`Attempting to connect to Connecting to ${parameters.id}...`);
            const conn = peer.connect(parameters.id);
            conn.on("open", function () {
                conn.on("data", (data) => {
                    console.debug("Received Data!");
                    console.debug(data);
                });
                let i = 0;
                setInterval(() => {
                    conn.send(i++);
                }, 1000);
            });
        });
    }
    else {
        peer.on("open", (id) => {
            console.debug(`My peer ID is: ${id}`);
            const qrHolder = document.getElementById("qrcode");
            const size = Math.min(window.innerWidth, window.innerHeight) * 0.75;
            new QRCode(qrHolder, {
                text: `${window.location.href}?${new URLSearchParams({ id: id })}`,
                width: size,
                height: size,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctionLevel: QRCode.CorrectLevel.H
            });
        });
        peer.on("connection", (conn) => {
            console.debug("Connection received!?");
            console.debug(conn);
            conn.on("data", (data) => {
                console.debug("Received data!");
                console.debug(data);
            });
        });
    }
}
prepare();
