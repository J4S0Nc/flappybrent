const TOTAL_TRACKS = 11
const TOTAL_DRINKS = 8
const TOTAL_DEATHS = 14
export default class Sound {
    constructor() {
        this.music = new Audio()
        this.music.loop = false
        this.music.onended = () => this.onMusicEnded()
        this.loadMusic()
        this.deaths = []
        this.drinks = []
        this.loadEffects()
    }
    loadEffects() {
        for (let i = 0; i < TOTAL_DEATHS; i++) {
            this.deaths[i] = new Audio(`assets/sounds/die${i}.mp3`)
            this.deaths[i].loop = false
            this.deaths[i].load()
        }
        for (let i = 0; i < TOTAL_DRINKS; i++) {
            this.drinks[i] = new Audio(`assets/sounds/drink${i}.mp3`)
            this.deaths[i].loop = false
            this.drinks[i].load()
        }
    }
    playEffect(effect) {

        if (effect === 'drink') {
            this.drinks[Math.floor(Math.random() * TOTAL_DRINKS)].play()
        } else {
            this.deaths[Math.floor(Math.random() * TOTAL_DEATHS)].play()
        }
    }
    loadMusic() {
        localStorage.musicTrack = localStorage.musicTrack || 0
        this.music.src = `assets/music/music${localStorage.musicTrack}.mp3`
        this.music.load()
        this.music.currentTime = localStorage.musicTime || 0
    }
    playMusic() {
        this.music.play()
    }
    pauseMusic() {
        this.music.pause()
        localStorage.musicTime = this.music.currentTime
    }
    onMusicEnded() {
        localStorage.musicTrack = (localStorage.musicTrack % TOTAL_TRACKS)
        localStorage.musicTime = 0
        console.log(`Playing track: ${localStorage.musicTrack + 1}`);
        this.loadMusic()
        this.music.play()
    }
}