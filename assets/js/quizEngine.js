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
    timeLeft: QuizSettings.questionTime,
    answerLocked: false,

    /*=====================================
            START THE QUIZ
    ======================================*/

    start(group, section) {
        this.stopTimer();

        this.group = group;
        this.section = section;
        this.currentIndex = 0;
        this.scoreCount = 0;
        this.selectedAnswers = [];
        this.answerLocked = false;

        this.totalQuestions =
            QuizSettings.questionsPerQuiz || 10;

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
                "The quiz questions could not be loaded."
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
    ======================================*/

    getQuestionBank(group, section) {
        if (
            group === "A" &&
            window.QuestionBankA &&
            Array.isArray(window.QuestionBankA[section])
        ) {
            return window.QuestionBankA[section];
        }

        if (
            group === "B" &&
            window.QuestionBankB &&
            Array.isArray(window.QuestionBankB[section])
        ) {
            return window.QuestionBankB[section];
        }

        if (
            group === "C" &&
            window.QuestionBankC &&
            Array.isArray(window.QuestionBankC[section])
        ) {
            return window.QuestionBankC[section];
        }

        return [];
    },

    /*=====================================
        SELECT QUIZ QUESTIONS
    ======================================*/

    getRandomQuestions(group, section) {
        const bank =
            this.getQuestionBank(group, section);

        if (!Array.isArray(bank)) {
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
    ======================================*/

    shuffle(array) {
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
    ======================================*/

    loadQuestion() {
        this.answerLocked = false;

        const question =
            this.questions[this.currentIndex];

        if (!question) {
            console.error(
                "Question not found at index:",
                this.currentIndex
            );

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
    ======================================*/

    startTimer() {
        const timerBox =
            document.getElementById("quizTimer");

        const timerValue =
            document.getElementById("timerValue");

        this.stopTimer();

        if (!QuizSettings.timerEnabled) {
            if (timerBox) {
                timerBox.style.display = "none";
            }

            return;
        }

        if (timerBox) {
            timerBox.style.display = "block";
            timerBox.classList.remove(
                "timer-warning"
            );
        }

        this.timeLeft =
            QuizSettings.questionTime || 30;

        if (timerValue) {
            timerValue.textContent =
                this.timeLeft;
        }

        this.timer = setInterval(() => {
            this.timeLeft--;

            if (timerValue) {
                timerValue.textContent =
                    this.timeLeft;
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
                    typeof QuizSounds.countdown === "function"
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
    ======================================*/

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        if (
            typeof QuizSounds !== "undefined" &&
            typeof QuizSounds.stopCountdown === "function"
        ) {
            QuizSounds.stopCountdown();
        }
    },

    /*=====================================
            TIME EXPIRED
    ======================================*/

    handleTimeUp() {
        if (this.answerLocked) return;

        this.answerLocked = true;

        const question =
            this.questions[this.currentIndex];

        if (!question) return;

        QuizUI.lockAnswers();

        QuizUI.markAnswer(
            null,
            question.answer
        );

        this.selectedAnswers.push({
            question: question.q,
            options: question.options,
            selected: null,
            correct: question.answer,
            isCorrect: false
        });

        QuizUI.showBubuMessage(
            "⏰ Time's up! Don't worry—keep learning!"
        );

        if (
            QuizSettings.soundsEnabled &&
            typeof QuizSounds !== "undefined" &&
            typeof QuizSounds.wrong === "function"
        ) {
            QuizSounds.wrong();
        }

        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    },

    /*=====================================
            SELECT AN ANSWER
    ======================================*/

    selectAnswer(selectedIndex) {
        if (this.answerLocked) return;

        this.answerLocked = true;

        this.stopTimer();

        if (
            QuizSettings.soundsEnabled &&
            typeof QuizSounds !== "undefined" &&
            typeof QuizSounds.click === "function"
        ) {
            QuizSounds.click();
        }

        const question =
            this.questions[this.currentIndex];

        if (!question) return;

        const correctIndex =
            question.answer;

        const isCorrect =
            selectedIndex === correctIndex;

        QuizUI.lockAnswers();

        QuizUI.markAnswer(
            selectedIndex,
            correctIndex
        );

        this.selectedAnswers.push({
            question: question.q,
            options: question.options,
            selected: selectedIndex,
            correct: correctIndex,
            isCorrect: isCorrect
        });

        if (isCorrect) {
            this.scoreCount++;

            QuizUI.showBubuMessage(
                QuizRewards.getCorrectMessage()
            );

            if (
                QuizSettings.soundsEnabled &&
                typeof QuizSounds.correct === "function"
            ) {
                QuizSounds.correct();
            }
        } else {
            QuizUI.showBubuMessage(
                QuizRewards.getWrongMessage()
            );

            if (
                QuizSettings.soundsEnabled &&
                typeof QuizSounds.wrong === "function"
            ) {
                QuizSounds.wrong();
            }
        }

        QuizUI.showNextButton();
    },

    /*=====================================
            NEXT QUESTION
    ======================================*/

    nextQuestion() {
        this.stopTimer();

        this.currentIndex++;

        if (
            this.currentIndex <
            this.questions.length
        ) {
            this.loadQuestion();
        } else {
            this.finishQuiz();
        }
    },

    /*=====================================
            FINISH QUIZ
    ======================================*/

    finishQuiz() {
        this.stopTimer();

        const total = this.questions.length;

        const percentage = Math.round(
            (this.scoreCount / total) * 100
        );

        localStorage.setItem(
            "quizScore",
            percentage
        );

        if (this.section === "section1") {
            localStorage.setItem(
                "section1Score",
                percentage
            );

            if (
                typeof ParticipantStore !== "undefined"
            ) {
                ParticipantStore.saveSection1Score(
                    percentage
                );
            }
        }

        if (this.section === "section2") {
            localStorage.setItem(
                "section2Score",
                percentage
            );

            if (
                typeof ParticipantStore !== "undefined"
            ) {
                ParticipantStore.saveSection2Score(
                    percentage
                );
            }

            this.saveChildScore({
                name:
                    localStorage.getItem(
                        "childName"
                    ) || "Student",

                email:
                    localStorage.getItem(
                        "parentEmail"
                    ) || "",

                group:
                    localStorage.getItem(
                        "quizGroup"
                    ) || this.group,

                section1Score: parseInt(
                    localStorage.getItem(
                        "section1Score"
                    ) || "0",
                    10
                ),

                section2Score:
                    percentage,

                finalScore: null,
                attendance: null
            });
        }

        if (percentage >= 80) {
            if (
                QuizSettings.confettiEnabled &&
                typeof launchConfetti === "function"
            ) {
                launchConfetti();
            }

            if (
                QuizSettings.soundsEnabled &&
                typeof QuizSounds !== "undefined"
            ) {
                if (
                    typeof QuizSounds.applause === "function"
                ) {
                    QuizSounds.applause();
                }

                if (
                    typeof QuizSounds.medal === "function"
                ) {
                    QuizSounds.medal();
                }

                if (
                    typeof QuizSounds.celebration === "function"
                ) {
                    QuizSounds.celebration();
                }
            }
        } else {
            if (
                QuizSettings.soundsEnabled &&
                typeof QuizSounds !== "undefined" &&
                typeof QuizSounds.wrong === "function"
            ) {
                QuizSounds.wrong();
            }
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
    },

    /*=====================================
            CONTINUE QUIZ FLOW
    ======================================*/

    continueFlow() {
        this.stopTimer();

        const score = parseInt(
            localStorage.getItem(
                "quizScore"
            ) || "0",
            10
        );

        const section =
            localStorage.getItem(
                "quizSection"
            );

        if (section === "1") {
            if (score >= 80) {
                this.start(
                    this.group,
                    "section2"
                );
            } else {
                this.goToKeepLearning();
            }

            return;
        }

        if (section === "2") {
            if (score >= 80) {
                const finalStage =
                    document.getElementById(
                        "finalStage"
                    );

                if (finalStage) {
                    finalStage.style.display =
                        "block";

                    const liveChildName =
                        document.getElementById(
                            "liveChildName"
                        );

                    if (liveChildName) {
                        liveChildName.textContent =
                            localStorage.getItem(
                                "childName"
                            ) || "Student";
                    }

                    finalStage.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            } else {
                this.goToKeepLearning();
            }
        }
    },

    /*=====================================
            KEEP LEARNING SECTION
    ======================================*/

    goToKeepLearning() {
        const childName =
            localStorage.getItem(
                "childName"
            ) || "Student";

        const waitingName =
            document.getElementById(
                "waitChildName"
            );

        if (waitingName) {
            waitingName.textContent =
                childName;
        }

        const videos =
            document.getElementById(
                "videos"
            );

        if (videos) {
            videos.scrollIntoView({
                behavior: "smooth"
            });
        }
    },

    /*=====================================
            VIEW CERTIFICATE
    ======================================*/

    viewCertificate() {
        const name =
            localStorage.getItem(
                "childName"
            ) || "Student";

        const group =
            localStorage.getItem(
                "quizGroup"
            ) || "A";

        const section =
            localStorage.getItem(
                "quizSection"
            ) || "1";

        const score =
            localStorage.getItem(
                "quizScore"
            ) || "0";

        const numericScore =
            parseInt(score, 10);

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
                score + "%";
        }

        if (certDate) {
            certDate.textContent =
                new Date().toLocaleDateString();
        }

        const medalImage =
            document.getElementById(
                "certMedalImage"
            );

        const medalText =
            document.getElementById(
                "certMedalText"
            );

        if (medalImage && medalText) {
            if (numericScore >= 80) {
                medalImage.src =
                    "assets/images/silver-medal.png";

                medalText.textContent =
                    "Silver Medal";
            } else if (
                numericScore >= 70
            ) {
                medalImage.src =
                    "assets/images/bronze-medal.png";

                medalText.textContent =
                    "Bronze Medal";
            } else {
                medalImage.src =
                    "assets/images/learning-badge.png";

                medalText.textContent =
                    "Keep Learning";
            }
        }

        const certificatePage =
            document.getElementById(
                "certificatePage"
            );

        if (certificatePage) {
            certificatePage.scrollIntoView({
                behavior: "smooth"
            });
        }
    },

    /*=====================================
            SHOW ANSWER REVIEW
    ======================================*/

    showReview() {
        if (!QuizSettings.showReview) {
            return;
        }

        QuizUI.showReview(
            this.selectedAnswers
        );
    },

    /*=====================================
            RETURN TO RESULT
    ======================================*/

    backToResult() {
        const player =
            document.getElementById(
                "quizPlayer"
            );

        if (!player) return;

        player.innerHTML =
            this.lastResultHTML;

        player.scrollIntoView({
            behavior: "smooth"
        });
    },

    /*=====================================
        SAVE RESULT FOR ADMIN DASHBOARD
    ======================================*/

    saveChildScore(data) {
        const children = JSON.parse(
            localStorage.getItem(
                "childrenScores"
            ) || "[]"
        );

        children.push(data);

        localStorage.setItem(
            "childrenScores",
            JSON.stringify(children)
        );
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

        if (!nextButton) return;

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