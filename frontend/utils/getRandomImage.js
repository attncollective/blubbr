let nextImages = [
    '/images/candyland.png',
    '/images/mojito.png',
    '/images/rainbow.png',
    '/images/santorini.png',
    '/images/summer.png',
]

export default function getRandomImage() {
    let randomNum = Math.floor(Math.random() * nextImages.length)
    return nextImages[randomNum]
}
