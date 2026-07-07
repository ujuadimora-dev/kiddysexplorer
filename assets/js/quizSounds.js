/*=========================================
        KIDDYSEXPLORER SOUND SYSTEM
==========================================*/

const QuizSounds = {

    sounds: {
        click: "assets/audio/click.mp3",
        correct: "assets/audio/correct.mp3",
        wrong: "assets/audio/wrong.mp3",
        applause: "assets/audio/applause.mp3",
        medal: "assets/audio/medal.mp3"
    },

    play(soundName) {
        const soundPath = this.sounds[soundName];

        if (!soundPath) return;

        const audio = new Audio(soundPath);
        audio.volume = 0.7;

        audio.play().catch(function () {
            console.log("Sound could not play.");
        });
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
    }

};