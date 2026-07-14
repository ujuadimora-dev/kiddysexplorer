/*=========================================
        KIDDYSEXPLORER SOUND SYSTEM
==========================================*/

const QuizSounds = {

    enabled: true,
    volume: 0.7,

    sounds: {
        click: new Audio("assets/audio/click.mp3"),
        correct: new Audio("assets/audio/correct.mp3"),
        wrong: new Audio("assets/audio/wrong.mp3"),
        applause: new Audio("assets/audio/applause.mp3"),
        medal: new Audio("assets/audio/medal.mp3"),
        celebration: new Audio("assets/audio/celebration.mp3"),
        countdown: new Audio("assets/audio/countdown.mp3"),
        next: new Audio("assets/audio/next.mp3")
    },

    play(name) {
        if (!this.enabled) return;

        const sound = this.sounds[name];

        if (!sound) {
            console.warn(`Sound not found: ${name}`);
            return;
        }

        sound.pause();
        sound.currentTime = 0;
        sound.volume = this.volume;

        sound.play().catch(function (error) {
            console.warn(`Could not play ${name}:`, error);
        });
    },

    stop(name) {
        const sound = this.sounds[name];

        if (!sound) return;

        sound.pause();
        sound.currentTime = 0;
    },

    click() {
        this.play("click");
    },

    correct() {
        this.play("correct");
    },

    wrong() {
        this.play("wrong");
    },

    applause() {
        this.play("applause");
    },

    medal() {
        this.play("medal");
    },

    celebration() {
        this.play("celebration");
    },

    countdown() {
        this.play("countdown");
    },

    stopCountdown() {
        this.stop("countdown");
    },

    next() {
        this.play("next");
    },

    toggle() {
        this.enabled = !this.enabled;

        if (!this.enabled) {
            Object.values(this.sounds).forEach(function (sound) {
                sound.pause();
                sound.currentTime = 0;
            });
        }

        return this.enabled;
    }

};