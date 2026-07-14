/*=========================================
        KIDDYSEXPLORER REWARDS SYSTEM
==========================================*/

const QuizRewards = {

    /*=========================
        BUBU MESSAGES
    =========================*/

    correctMessages: [

        "🎉 Excellent!",

        "⭐ Great Job!",

        "👏 You're Amazing!",

        "🚀 Keep Going!",

        "🌟 Fantastic!",

        "🥳 Super Star!",

        "🎈 Brilliant!",

        "💙 Wonderful!",

        "😊 That's Correct!",

        "🏆 Awesome Work!"

    ],

    wrongMessages: [

        "😊 Oops! Don't worry.",

        "💪 Keep Learning!",

        "📚 Practice Makes Perfect!",

        "🌈 Try Again Next Time!",

        "❤️ You'll Do Better!",

        "😊 Keep Trying!",

        "⭐ Every Mistake Helps You Learn!",

        "🚀 Never Give Up!",

        "👏 You're Improving!",

        "💙 Learning Is Fun!"

    ],



    /*=========================
        RANDOM MESSAGE
    =========================*/

    getCorrectMessage(){

        return this.correctMessages[
            Math.floor(
                Math.random()*this.correctMessages.length
            )
        ];

    },



    getWrongMessage(){

        return this.wrongMessages[
            Math.floor(
                Math.random()*this.wrongMessages.length
            )
        ];

    },



    /*=========================
            MEDALS
    =========================*/
getMedal(score){

    if(score >= 80){

        return{

            icon:"🥈",

            title:"Silver Medal",

            color:"#C0C0C0",

            message:"Excellent! You have qualified for the next stage."

        };

    }

    if(score >= 70){

        return{

            icon:"🥉",

            title:"Bronze Medal",

            color:"#CD7F32",

            message:"Good job! Keep learning and aim even higher."

        };

    }

    return{

        icon:"📚",

        title:"Keep Learning",

        color:"#ff6b00",

        message:"Keep practicing and try again in the next quiz."

    };

},

    /*=========================
            BUBU LEVEL
    =========================*/

   getBubuLevel(score){

    if(score >= 80)

        return "🎉 Bubu says: Fantastic! You qualified for the next stage!";

    if(score >= 70)

        return "👏 Bubu says: Great job! Keep learning and you'll do even better next time!";

    return "💪 Bubu says: Don't give up! Practice makes perfect. I'll see you in the next quiz!";

}

};
function launchConfetti() {
    if (typeof confetti === "undefined") return;

    confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 }
    });

    setTimeout(() => {
        confetti({
            particleCount: 120,
            spread: 120,
            origin: { y: 0.7 }
        });
    }, 500);
}