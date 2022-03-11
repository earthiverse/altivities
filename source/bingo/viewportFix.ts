// eslint-disable-next-line @typescript-eslint/no-unused-vars
const vh = window.innerHeight * 0.01
document.documentElement.style.setProperty("--vh", `${vh}px`)

// We listen to the resize event
window.addEventListener("resize", () => {
    // We execute the same script as before
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
})

export {}