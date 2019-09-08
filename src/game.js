const START_X = 0
const START_Y = 540
const GRID_LEFT = 900
const GRID_TOP = 200
const GRID_SIZE = 200
const GRID_COLUMNS = 800
const GRID_ROWS = 5
const GRID_DENSITY = 0.06

let BRENT_DENSITY = 0.0

let FLY_SPEED = 3
let MOMENTUM = 0.99
let GRAVITY = 0.1
let FLAP_POWER = 10
const CEILING = 55
const FLOOR = 1500

const DEATH_DELAY = 2000
const COIN_POINTS = 1

class Entity {
    constructor(x, y, size) {
        Object.assign(this, { x, y, size })
    }
    hits(other) {
        const dx = this.x - other.x
        const dy = this.y - other.y
        const range = this.size + other.size
        return Math.sqrt(dx * dx + dy * dy) < range
    }
}

class Flappy extends Entity {
    constructor(x, y) {
        super(x, y, 55)
        FLY_SPEED = 3
        MOMENTUM = 0.99
        GRAVITY = 0.1
        FLAP_POWER = 10
        this.death = 0
        this.prevY = this.y
    }
    update(flapping) {
        const yVel = this.y - this.prevY
        this.prevY = this.y
        this.y += yVel * MOMENTUM + GRAVITY
        if (this.death > 0) return

        this.x += FLY_SPEED

        if (flapping) this.y -= FLAP_POWER
        if (this.y < CEILING) this.y = CEILING
        if (this.y > FLOOR) this.die()
    }
    die() {
        this.death = performance.now()
    }
}

class Spike extends Entity {
    constructor(x, y) {
        super(x, y, 50)
    }
}

class Coin extends Entity {
    constructor(x, y) {
        super(x, y, 75)
        this.collected = false
    }
    collect() {
        this.collected = true
        FLY_SPEED += .001
    }
}

export default class Game {
    constructor() {
        this.flappy = new Flappy(START_X, START_Y)
        this.spikes = []
        this.coins = []
        this.started = false
        BRENT_DENSITY = 0
        for (let c = 0; c < GRID_COLUMNS; c++) {
            for (let r = 0; r < GRID_ROWS; r++) {
                const x = GRID_LEFT + c * GRID_SIZE
                const y = GRID_TOP + r * GRID_SIZE
                if (c > 20 && Math.random() < BRENT_DENSITY) {
                    this.spikes.push(new Spike(x, y))
                }
                else if (Math.random() < GRID_DENSITY) {
                    this.coins.push(new Coin(x, y))
                }
            }
            if (c > 20)
                BRENT_DENSITY += .002
        }
    }
    update(flapping) {
        if (!this.started) {
            if (!flapping) return
            this.started = true
        }

        this.flappy.update(flapping)

        if (this.flappy.death === 0) {
            this.spikes.forEach(s => {
                if (s.hits(this.flappy)) this.flappy.die()
            })
            this.coins.forEach(c => {
                if (c.hits(this.flappy)) c.collect()
            })
        }

        const finished = this.flappy.death > 0 && performance.now() > this.flappy.death + DEATH_DELAY
        return finished
    }
    score() {
        return this.coins.reduce((sum, c) => {
            return c.collected ? sum + COIN_POINTS : sum
        }, 0)
    }
}