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
const BEER_POINTS = 1

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

class Brent extends Entity {
    constructor(x, y) {
        super(x, y, 50)
    }
}

class Beer extends Entity {
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
        this.highScore = localStorage.highScore || 0
        this.flappy = new Flappy(START_X, START_Y)
        this.brents = []
        this.beers = []
        //this.grid = []
        this.started = false
        BRENT_DENSITY = 0
        for (let c = 0; c < GRID_COLUMNS; c++) {
            //this.grid[c] = []
            for (let r = 0; r < GRID_ROWS; r++) {
                //let gitem = ' '
                const x = GRID_LEFT + c * GRID_SIZE
                const y = GRID_TOP + r * GRID_SIZE
                const b = BRENT_DENSITY + (r * .001)
                if (c + 1 == GRID_COLUMNS || c > 10 && Math.random() < b) {
                    this.brents.push(new Brent(x, y))
                    //gitem = 'X'
                }
                else if (Math.random() < GRID_DENSITY) {
                    this.beers.push(new Beer(x, y))
                    //gitem = 'O'
                }
                BRENT_DENSITY += .0001
                //this.grid[c][r] = gitem;
            }
        }

        //console.log(this.grid)
    }
    update(flapping, sounds) {
        if (!this.started) {
            if (!flapping) return
            this.started = true
        }

        this.flappy.update(flapping)

        if (this.flappy.death === 0) {
            this.brents.forEach(s => {
                if (s.hits(this.flappy)) {
                    this.flappy.die()
                    sounds.playEffect('die');
                }
            })
            this.beers.forEach(c => {
                if (c.hits(this.flappy) && !c.collected) {
                    c.collect()
                    sounds.playEffect('drink');
                }
            })
        } else {
            this.isHighScore();
        }

        const finished = this.flappy.death > 0 && performance.now() > this.flappy.death + DEATH_DELAY
        return finished
    }
    score() {
        return this.beers.reduce((sum, c) => {
            return c.collected ? sum + BEER_POINTS : sum
        }, 0)
    }
    isHighScore() {
        const score = this.score()
        if (score > this.highScore) {
            this.highScore = score
            localStorage.highScore = score
        }
        return score >= this.highScore
    }
}