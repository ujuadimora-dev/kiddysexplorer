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

        if(score>=90){

            return{

                icon:"🥇",

                title:"Gold Medal",

                color:"#FFD700",

                message:"Outstanding Performance!"

            };

        }



        if(score>=80){

            return{

                icon:"🥈",

                title:"Silver Medal",

                color:"#C0C0C0",

                message:"Excellent Work!"

            };

        }



        if(score>=70){

            return{

                icon:"🥉",

                title:"Bronze Medal",

                color:"#CD7F32",

                message:"Good Job!"

            };

        }



        return{

            icon:"📚",

            title:"Keep Learning",

            color:"#ff6b00",

            message:"Practice and Try Again!"

        };

    },



    /*=========================
            BUBU LEVEL
    =========================*/

    getBubuLevel(score){

        if(score==100)

            return "🌟 Bubu says: PERFECT SCORE!";



        if(score>=90)

            return "🎉 Bubu says: You're a Superstar!";



        if(score>=80)

            return "😊 Bubu says: Fantastic!";



        if(score>=70)

            return "👏 Bubu says: Good Job!";



        return "💪 Bubu says: Keep Learning!";

    }

};