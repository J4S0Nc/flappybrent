export default class Stats {
    constructor() {
        this.highScore = parseInt(localStorage.highScore || 0)
        this.playTime = 0
        this.brentDeaths = 0
        this.fallingDeaths = 0
        this.drinks = 0
        this.songs = localStorage.musicTracksPlayed || 0
        this.flaps = 0
        this.games = []
        this.loadLocalStats()
    }

    recordGameOver(deathBy, score, flaps, time) {
        if (score > this.highScore) this.highScore = score                
        this.playTime += time
        if (deathBy === 'Falling') this.fallingDeaths++
        else this.brentDeaths++
        this.drinks += score
        this.songs = localStorage.musicTracksPlayed || 0
        this.flaps += flaps       

        this.games.unshift({
            played: new Date(),
            deathBy,
            score,
            flaps,
            time
        })
        this.games = this.games.splice(0,100)
        this.saveLocalStats()
    }
    recordSongPlayed() {
        this.songs++
        this.saveLocalStats()
    }

    loadLocalStats() {
        const data = atob(localStorage.stats || '')
        if (data) {
            const dataObj = JSON.parse(data)
            this.highScore = dataObj.highScore || 0
            this.playTime = dataObj.playTime || 0
            this.fallingDeaths = dataObj.fallingDeaths || 0
            this.brentDeaths = dataObj.brentDeaths || 0
            this.drinks = dataObj.drinks || 0
            this.songs = dataObj.songs || 0
            this.flaps = dataObj.flaps || 0
            this.games = dataObj.games || []
        }
    }
    saveLocalStats() {
        const json = JSON.stringify(this)
        const data = btoa(json)
        console.log(json)
        localStorage.stats = data
    }
}