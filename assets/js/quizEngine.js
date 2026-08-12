/*=========================================
    KIDDYSEXPLORER QUIZ ENGINE
==========================================*/

const QuizEngine = {
    group: "A",
    section: "section1",
    questions: [],
    currentIndex: 0,
    scoreCount: 0,
    totalQuestions: 10,
    selectedAnswers: [],
    lastResultHTML: "",

    timer: null,
    timeLeft: 0,
    answerLocked: false,
    participant: null,

    /*=====================================
        START THE QUIZ
    =====================================*/

    start(group, section) {
        this.stopTimer();

        const validGroups = ["A", "B", "C"];
        const validSections = ["section1", "section2"];

        if (!validGroups.includes(group)) {
            console.error("Invalid quiz group:", group);
            alert("The selected quiz group is invalid.");
            return;
        }

        if (!validSections.includes(section)) {
            console.error("Invalid quiz section:", section);
            alert("The selected quiz section is invalid.");
            return;
        }

        this.group = group;
        this.section = section;
        this.currentIndex = 0;
        this.scoreCount = 0;
        this.selectedAnswers = [];
        this.answerLocked = false;

        this.totalQuestions =
            Number(QuizSettings.questionsPerQuiz) || 10;

        if (
            typeof ParticipantStore !== "undefined" &&
            typeof ParticipantStore.getCurrentParticipant === "function"
        ) {
            this.participant =
                ParticipantStore.getCurrentParticipant();
        }

        /*
         * These values are kept for compatibility with quiz.js,
         * QuizUI and the current certificate display.
         */
        localStorage.setItem("quizGroup", group);

        localStorage.setItem(
            "quizSection",
            section === "section1" ? "1" : "2"
        );

        this.questions =
            this.getRandomQuestions(group, section);

        if (
            !Array.isArray(this.questions) ||
            this.questions.length === 0
        ) {
            console.error(
                "No questions were found for:",
                group,
                section
            );

            alert(
                "The quiz questions could not be loaded. Please check the question bank."
            );

            return;
        }

        if (
            typeof QuizUI === "undefined"
        ) {
            console.error("QuizUI is not available.");

            alert(
                "The quiz interface could not be loaded."
            );

            return;
        }

        QuizUI.renderPlayerShell();
        QuizUI.init();
        QuizUI.showPlayer();
        QuizUI.setTitle(group, section);

        this.loadQuestion();
    },

    /*=====================================
        GET THE CORRECT QUESTION BANK
    =====================================*/

    getQuestionBank(group, section) {
        switch (group) {
            case "A":
                if (
                    window.QuestionBankA &&
                    Array.isArray(
                        window.QuestionBankA[section]
                    )
                ) {
                    return window.QuestionBankA[section];
                }

                break;

            case "B":
                if (
                    window.QuestionBankB &&
                    Array.isArray(
                        window.QuestionBankB[section]
                    )
                ) {
                    return window.QuestionBankB[section];
                }

                break;

            case "C":
                if (
                    window.QuestionBankC &&
                    Array.isArray(
                        window.QuestionBankC[section]
                    )
                ) {
                    return window.QuestionBankC[section];
                }

                break;

            default:
                console.error(
                    "Unknown question-bank group:",
                    group
                );
        }

        return [];
    },

    /*=====================================
        SELECT QUIZ QUESTIONS
    =====================================*/

    getRandomQuestions(group, section) {
        const bank =
            this.getQuestionBank(group, section);

        if (
            !Array.isArray(bank) ||
            bank.length === 0
        ) {
            return [];
        }

        const questionCount = Math.min(
            this.totalQuestions,
            bank.length
        );

        if (QuizSettings.randomQuestions) {
            return this.shuffle(bank).slice(
                0,
                questionCount
            );
        }

        return bank.slice(0, questionCount);
    },

    /*=====================================
        SHUFFLE QUESTIONS
    =====================================*/

    shuffle(array) {
        if (!Array.isArray(array)) {
            return [];
        }

        const copy = [...array];

        for (
            let i = copy.length - 1;
            i > 0;
            i--
        ) {
            const randomIndex = Math.floor(
                Math.random() * (i + 1)
            );

            [copy[i], copy[randomIndex]] = [
                copy[randomIndex],
                copy[i]
            ];
        }

        return copy;
    },

    /*=====================================
        LOAD CURRENT QUESTION
    =====================================*/

    loadQuestion() {
        this.answerLocked = false;

        const question =
            this.questions[this.currentIndex];

        if (!question) {
            console.error(
                "Question not found at index:",
                this.currentIndex
            );

            if (
                this.currentIndex >=
                this.questions.length
            ) {
                this.finishQuiz();
            }

            return;
        }

        QuizUI.updateProgress(
            this.currentIndex + 1,
            this.questions.length
        );

        QuizUI.showBubuMessage(
            "😊 Choose the correct answer."
        );

        QuizUI.hideNextButton();
        QuizUI.showQuestion(question);

        this.startTimer();
    },

    /*=====================================
        START TIMER
    =====================================*/

    startTimer() {
        this.stopTimer();

        const timerBox =
            document.getElementById("quizTimer");

        const timerValue =
            document.getElementById("timerValue");

        if (!QuizSettings.timerEnabled) {
            if (timerBox) {
                timerBox.style.display = "none";
            }

            return;
        }

        this.timeLeft =
            Number(QuizSettings.questionTime) || 30;

        if (timerBox) {
            timerBox.style.display = "block";
            timerBox.classList.remove(
                "timer-warning"
            );
        }

        if (timerValue) {
            timerValue.textContent =
                String(this.timeLeft);
        }

        this.timer = window.setInterval(() => {
            this.timeLeft -= 1;

            if (timerValue) {
                timerValue.textContent =
                    String(
                        Math.max(this.timeLeft, 0)
                    );
            }

            if (this.timeLeft === 5) {
                if (timerBox) {
                    timerBox.classList.add(
                        "timer-warning"
                    );
                }

                if (
                    QuizSettings.soundsEnabled &&
                    typeof QuizSounds !== "undefined" &&
                    typeof QuizSounds.countdown ===
                        "function"
                ) {
                    QuizSounds.countdown();
                }
            }

            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.handleTimeUp();
            }
        }, 1000);
    },

    /*=====================================
        STOP TIMER
    =====================================*/

    stopTimer() {
        if (this.timer !== null) {
            window.clearInterval(this.timer);
            this.timer = null;
        }

        if (
            typeof QuizSounds !== "undefined" &&
            typeof QuizSounds.stopCountdown ===
                "function"
        ) {
            QuizSounds.stopCountdown();
        }
    },

    /*=====================================
        TIME EXPIRED
    =====================================*/

    handleTimeUp() {
        if (this.answerLocked) {
            return;
        }

        this.answerLocked = true;

        const question =
            this.questions[this.currentIndex];

        if (!question) {
            console.error(
                "The timed-out question could not be found."
            );

            this.nextQuestion();
            return;
        }

        QuizUI.lockAnswers();

        QuizUI.markAnswer(
            null,
            question.answer
        );

        this.selectedAnswers.push({
            question:
                question.q ||
                question.question ||
                "",

            options:
                Array.isArray(question.options)
                    ? [...question.options]
                    : [],

            selected: null,
            correct: question.answer,
            isCorrect: false,
            timedOut: true
        });

        QuizUI.showBubuMessage(
            "⏰ Time is up! Don’t worry—keep learning!"
        );

        if (
            QuizSettings.soundsEnabled &&
            typeof QuizSounds !== "undefined" &&
            typeof QuizSounds.wrong === "function"
        ) {
            QuizSounds.wrong();
        }

        window.setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    },

    /*=====================================
        SELECT AN ANSWER
    =====================================*/

    selectAnswer(selectedIndex) {
        if (this.answerLocked) {
            return;
        }

        const question =
            this.questions[this.currentIndex];

        if (!question) {
            console.error(
                "Question not found while selecting an answer."
            );

            return;
        }

        const numericSelectedIndex =
            Number(selectedIndex);

        if (
            !Number.isInteger(
                numericSelectedIndex
            )
        ) {
            console.error(
                "Invalid answer index:",
                selectedIndex
            );

            return;
        }

        this.answerLocked = true;
        this.stopTimer();

        if (
            QuizSettings.soundsEnabled &&
            typeof QuizSounds !== "undefined" &&
            typeof QuizSounds.click === "function"
        ) {
            QuizSounds.click();
        }

        const correctIndex =
            Number(question.answer);

        const isCorrect =
            numericSelectedIndex === correctIndex;

        QuizUI.lockAnswers();

        QuizUI.markAnswer(
            numericSelectedIndex,
            correctIndex
        );

        this.selectedAnswers.push({
            question:
                question.q ||
                question.question ||
                "",

            options:
                Array.isArray(question.options)
                    ? [...question.options]
                    : [],

            selected:
                numericSelectedIndex,

            correct:
                correctIndex,

            isCorrect,
            timedOut: false
        });

        if (isCorrect) {
            this.scoreCount += 1;

            const correctMessage =
                typeof QuizRewards !==
                    "undefined" &&
                typeof QuizRewards.getCorrectMessage ===
                    "function"
                    ? QuizRewards.getCorrectMessage()
                    : "🎉 Correct! Well done!";

            QuizUI.showBubuMessage(
                correctMessage
            );

            if (
                QuizSettings.soundsEnabled &&
                typeof QuizSounds !== "undefined" &&
                typeof QuizSounds.correct ===
                    "function"
            ) {
                QuizSounds.correct();
            }
        } else {
            const wrongMessage =
                typeof QuizRewards !==
                    "undefined" &&
                typeof QuizRewards.getWrongMessage ===
                    "function"
                    ? QuizRewards.getWrongMessage()
                    : "Keep trying—you are learning!";

            QuizUI.showBubuMessage(
                wrongMessage
            );

            if (
                QuizSettings.soundsEnabled &&
                typeof QuizSounds !== "undefined" &&
                typeof QuizSounds.wrong ===
                    "function"
            ) {
                QuizSounds.wrong();
            }
        }

        QuizUI.showNextButton();
    },

    /*=====================================
        NEXT QUESTION
    =====================================*/

    nextQuestion() {
        if (!this.answerLocked) {
            return;
        }

        this.stopTimer();

        this.currentIndex += 1;

        if (
            this.currentIndex <
            this.questions.length
        ) {
            this.loadQuestion();
            return;
        }

        this.finishQuiz();
    },

    /*=====================================
        FINISH QUIZ
    =====================================*/

    finishQuiz() {
        this.stopTimer();

        const total =
            this.questions.length;

        if (total <= 0) {
            console.error(
                "The quiz cannot be completed because no questions were loaded."
            );

            return;
        }

        const percentage = Math.round(
            (this.scoreCount / total) * 100
        );

        localStorage.setItem(
            "quizScore",
            String(percentage)
        );

        localStorage.setItem(
            "quizGroup",
            this.group
        );

        localStorage.setItem(
            "quizSection",
            this.section === "section1"
                ? "1"
                : "2"
        );

        if (this.section === "section1") {
            localStorage.setItem(
                "section1Score",
                String(percentage)
            );

            this.saveScoreToParticipant(
                "section1",
                percentage
            );
        }

        if (this.section === "section2") {
            localStorage.setItem(
                "section2Score",
                String(percentage)
            );

            this.saveScoreToParticipant(
                "section2",
                percentage
            );
        }

        if (percentage >= 80) {
            this.playSuccessCelebration();
        } else {
            this.playFailureSound();
        }

        QuizUI.showResult(
            percentage,
            total,
            this.group,
            this.section
        );

        const player =
            document.getElementById(
                "quizPlayer"
            );

        if (player) {
            this.lastResultHTML =
                player.innerHTML;
        }

        this.refreshCurrentParticipant();
    },

    /*=====================================
        SAVE SCORE TO PARTICIPANT STORE
    =====================================*/

    saveScoreToParticipant(
        section,
        percentage
    ) {
        if (
            typeof ParticipantStore ===
            "undefined"
        ) {
            console.warn(
                "ParticipantStore is unavailable. The score was saved only for the current browser session."
            );

            return;
        }

        try {
            if (
                section === "section1" &&
                typeof ParticipantStore
                    .saveSection1Score ===
                    "function"
            ) {
                ParticipantStore.saveSection1Score(
                    percentage
                );

                return;
            }

            if (
                section === "section2" &&
                typeof ParticipantStore
                    .saveSection2Score ===
                    "function"
            ) {
                ParticipantStore.saveSection2Score(
                    percentage
                );

                return;
            }

            console.error(
                "The required ParticipantStore score method is missing."
            );
        } catch (error) {
            console.error(
                "The participant score could not be saved:",
                error
            );

            alert(
                "Your result was calculated, but it could not be saved. Please do not close this page."
            );
        }
    },

    /*=====================================
        REFRESH CURRENT PARTICIPANT
    =====================================*/

    refreshCurrentParticipant() {
        if (
            typeof ParticipantStore !==
                "undefined" &&
            typeof ParticipantStore
                .getCurrentParticipant ===
                "function"
        ) {
            this.participant =
                ParticipantStore.getCurrentParticipant();
        }
    },

    /*=====================================
        SUCCESS CELEBRATION
    =====================================*/

    playSuccessCelebration() {
        if (
            QuizSettings.confettiEnabled &&
            typeof launchConfetti ===
                "function"
        ) {
            launchConfetti();
        }

        if (
            !QuizSettings.soundsEnabled ||
            typeof QuizSounds === "undefined"
        ) {
            return;
        }

        if (
            typeof QuizSounds.applause ===
                "function"
        ) {
            QuizSounds.applause();
        }

        if (
            typeof QuizSounds.medal ===
                "function"
        ) {
            QuizSounds.medal();
        }

        if (
            typeof QuizSounds.celebration ===
                "function"
        ) {
            QuizSounds.celebration();
        }
    },

    /*=====================================
        FAILURE SOUND
    =====================================*/

    playFailureSound() {
        if (
            QuizSettings.soundsEnabled &&
            typeof QuizSounds !== "undefined" &&
            typeof QuizSounds.wrong === "function"
        ) {
            QuizSounds.wrong();
        }
    },

    /*=====================================
        CONTINUE QUIZ FLOW
    =====================================*/

    continueFlow() {
        this.stopTimer();

        const score = Number.parseInt(
            localStorage.getItem(
                "quizScore"
            ) || "0",
            10
        );

        const section =
            localStorage.getItem(
                "quizSection"
            );

        const group =
            localStorage.getItem(
                "quizGroup"
            ) || this.group;

        if (section === "1") {
            if (score >= 80) {
                this.start(
                    group,
                    "section2"
                );
            } else {
                this.goToKeepLearning();
            }

            return;
        }

        if (section === "2") {
            if (score >= 80) {
                this.showFinalStage();
            } else {
                this.goToKeepLearning();
            }

            return;
        }

        console.error(
            "The current quiz section is missing."
        );
    },

    /*=====================================
        SHOW FINAL STAGE
    =====================================*/

    showFinalStage() {
        this.refreshCurrentParticipant();

        const finalStage =
            document.getElementById(
                "finalStage"
            );

        if (!finalStage) {
            console.error(
                "The finalStage section was not found."
            );

            return;
        }

        const liveChildName =
            document.getElementById(
                "liveChildName"
            );

        if (liveChildName) {
            liveChildName.textContent =
                this.getParticipantName();
        }

        finalStage.style.display =
            "block";

        finalStage.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    },

    /*=====================================
        KEEP LEARNING SECTION
    =====================================*/

    goToKeepLearning() {
        const waitingName =
            document.getElementById(
                "waitChildName"
            );

        if (waitingName) {
            waitingName.textContent =
                this.getParticipantName();
        }

        const videos =
            document.getElementById(
                "videos"
            );

        if (!videos) {
            console.error(
                "The Keep Learning section was not found."
            );

            return;
        }

        videos.style.display = "block";

        videos.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    },

    /*=====================================
        GET PARTICIPANT NAME
    =====================================*/

    getParticipantName() {
        this.refreshCurrentParticipant();

        if (
            this.participant &&
            this.participant.childName
        ) {
            return this.participant.childName;
        }

        return (
            localStorage.getItem(
                "childName"
            ) || "Student"
        );
    },

    /*=====================================
        GET PARTICIPANT GROUP
    =====================================*/

    getParticipantGroup() {
        this.refreshCurrentParticipant();

        if (
            this.participant &&
            this.participant.group
        ) {
            return this.participant.group;
        }

        return (
            localStorage.getItem(
                "quizGroup"
            ) ||
            this.group ||
            "A"
        );
    },

    /*=====================================
        VIEW CERTIFICATE
    =====================================*/

    viewCertificate() {
        this.refreshCurrentParticipant();

        const name =
            this.getParticipantName();

        const group =
            this.getParticipantGroup();

        const section =
            localStorage.getItem(
                "quizSection"
            ) || "1";

        const score = Number.parseInt(
            localStorage.getItem(
                "quizScore"
            ) || "0",
            10
        );

        const certChildName =
            document.getElementById(
                "certChildName"
            );

        const certGroup =
            document.getElementById(
                "certGroup"
            );

        const certSection =
            document.getElementById(
                "certSection"
            );

        const certScore =
            document.getElementById(
                "certScore"
            );

        const certDate =
            document.getElementById(
                "certDate"
            );

        if (certChildName) {
            certChildName.textContent =
                name;
        }

        if (certGroup) {
            certGroup.textContent =
                group;
        }

        if (certSection) {
            certSection.textContent =
                section;
        }

        if (certScore) {
            certScore.textContent =
                `${score}%`;
        }

        if (certDate) {
            certDate.textContent =
                new Date().toLocaleDateString();
        }

        this.updateCertificateMedal(
            score
        );

        const certificatePage =
            document.getElementById(
                "certificatePage"
            );

        if (!certificatePage) {
            console.error(
                "The certificate section was not found."
            );

            return;
        }

        certificatePage.style.display =
            "block";

        certificatePage.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    },

    /*=====================================
        UPDATE CERTIFICATE MEDAL
    =====================================*/

    updateCertificateMedal(score) {
        const medalImage =
            document.getElementById(
                "certMedalImage"
            );

        const medalText =
            document.getElementById(
                "certMedalText"
            );

        if (!medalImage || !medalText) {
            return;
        }

        if (score >= 80) {
            medalImage.src =
                "assets/images/silver-medal.png";

            medalImage.alt =
                "Achievement medal";

            medalText.textContent =
                "Achievement Medal";

            return;
        }

        if (score >= 70) {
            medalImage.src =
                "assets/images/bronze-medal.png";

            medalImage.alt =
                "Bronze medal";

            medalText.textContent =
                "Bronze Medal";

            return;
        }

        medalImage.src =
            "assets/images/learning-badge.png";

        medalImage.alt =
            "Keep learning badge";

        medalText.textContent =
            "Keep Learning";
    },

    /*=====================================
        SHOW ANSWER REVIEW
    =====================================*/

    showReview() {
        if (!QuizSettings.showReview) {
            return;
        }

        if (
            typeof QuizUI.showReview !==
            "function"
        ) {
            console.error(
                "QuizUI.showReview is not available."
            );

            return;
        }

        QuizUI.showReview(
            this.selectedAnswers
        );
    },

    /*=====================================
        RETURN TO RESULT
    =====================================*/

    backToResult() {
        const player =
            document.getElementById(
                "quizPlayer"
            );

        if (!player) {
            console.error(
                "The quiz player was not found."
            );

            return;
        }

        if (!this.lastResultHTML) {
            console.error(
                "No previous result is available."
            );

            return;
        }

        player.innerHTML =
            this.lastResultHTML;

        /*
         * Reconnects the quiz UI elements after restoring
         * the saved result HTML.
         */
        if (
            typeof QuizUI !== "undefined" &&
            typeof QuizUI.init === "function"
        ) {
            QuizUI.init();
        }

        player.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
};


/*=========================================
    NEXT QUESTION BUTTON
==========================================*/

document.addEventListener(
    "click",
    function (event) {
        const nextButton =
            event.target.closest(
                "#nextQuestionBtn"
            );

        if (!nextButton) {
            return;
        }

        if (
            QuizSettings.soundsEnabled &&
            typeof QuizSounds !== "undefined" &&
            typeof QuizSounds.next === "function"
        ) {
            QuizSounds.next();
        }

        QuizEngine.nextQuestion();
    }
);