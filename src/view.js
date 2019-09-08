const FLAPPY_LEFT = 250

let SCROLL_SPEED = 0.33
const WIDTH = 1920
const SHAKE = 15
const SHAKE_TIME = 100

function Sprite(path, frames = 1) {
    const files = Array(frames).fill(true).map((_, n) => `${path}${n}.png`)
    return files.map(f => {
        const im = new Image()
        im.src = f
        return im
    })
}

export default class View {
    constructor() {
        this.bg = Sprite('assets/background')
        this.flappy = Sprite('assets/EddieFlap', 4)
        this.spike = Sprite('assets/brent')
        this.coin = Sprite('assets/beer', 3)
        this.empty = Sprite('assets/empty')
    }
    render(game, ctx) {
        const flappyFrame = Math.floor(performance.now() / 150) % this.flappy.length
        const flappy = this.flappy[flappyFrame]
        const spike = this.spike[0]
        const empty = this.empty[0]
        const coinFrame = Math.floor(performance.now() / 200) % this.coin.length
        const coin = this.coin[coinFrame]
        const score = game.score()
        const scroll = (game.flappy.x * SCROLL_SPEED) % WIDTH
        const justDied = game.flappy.death > 0 && performance.now() < game.flappy.death + SHAKE_TIME
        ctx.save()
            if (justDied) {
                ctx.translate(Math.random() * SHAKE, Math.random() * SHAKE)
            }
            ctx.drawImage(this.bg[0], -scroll, 0)
            ctx.drawImage(this.bg[0], -scroll + WIDTH, 0)
            ctx.save()
                ctx.translate(FLAPPY_LEFT - game.flappy.x, 0)
                ctx.drawImage(flappy, game.flappy.x - flappy.width * 0.6, game.flappy.y - flappy.height * 0.5)
                game.spikes.forEach(s => {
                    if (s.x < game.flappy.x - 300 || s.x > game.flappy.x + 2000) return
                    ctx.drawImage(spike, s.x - spike.width * 0.5, s.y - spike.height * 0.55)
                })
                game.coins.forEach(c => {
                    if (c.collected) {
                        ctx.drawImage(empty, c.x - coin.width * 0.5, c.y - coin.height * 0.5)
                        return;
                    }
                    if (c.x < game.flappy.x - 300 || c.y > game.flappy.x + 2000) return
                    ctx.drawImage(coin, c.x - coin.width * 0.5, c.y - coin.height * 0.5)
                })
            ctx.restore()
            ctx.fillStyle = '#f99'
            ctx.font = '92px bold verdana'
            ctx.textBaseline = 'top'
            ctx.fillText(`Beers: ${score}`, 10, 10)
        ctx.restore()
    }
}