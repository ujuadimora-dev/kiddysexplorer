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

    start(group, section) {
        this.group = group;
        this.section = section;
        this.currentIndex = 0;
        this.scoreCount = 0;
        this.selectedAnswers = [];

        localStorage.setItem("quizGroup", group);
        localStorage.setItem("quizSection", section === "section1" ? "1" : "2");

        this.questions = this.getRandomQuestions(group, section);

        QuizUI.renderPlayerShell();
        QuizUI.init();
        QuizUI.showPlayer();
        QuizUI.setTitle(group, section);

        this.loadQuestion();
    },

    getQuestionBank(group, section) {
        if (group === "A") return window.QuestionBankA[section];
        if (group === "B") return window.QuestionBankB[section];
        if (group === "C") return window.QuestionBankC[section];
        return window.QuestionBankA[section];
    },

    getRandomQuestions(group, section) {
        const bank = this.getQuestionBank(group, section);
        return this.shuffle(bank).slice(0, this.totalQuestions);
    },

    shuffle(array) {
        const copy = [...array];

        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }

        return copy;
    },

    loadQuestion() {
        const question = this.questions[this.currentIndex];

        QuizUI.updateProgress(this.currentIndex + 1, this.totalQuestions);
        QuizUI.showBubuMessage("😊 Choose the correct answer.");
        QuizUI.hideNextButton();
        QuizUI.showQuestion(question);
    },

    selectAnswer(selectedIndex) {
        const question = this.questions[this.currentIndex];
        const correctIndex = question.answer;

        QuizUI.lockAnswers();
        QuizUI.markAnswer(selectedIndex, correctIndex);

        const isCorrect = selectedIndex === correctIndex;

        this.selectedAnswers.push({
            question: question.q,
            options: question.options,
            selected: selectedIndex,
            correct: correctIndex,
            isCorrect: isCorrect
        });

        if (isCorrect) {
            this.scoreCount++;
            QuizUI.showBubuMessage(QuizRewards.getCorrectMessage());
            QuizSounds.correct();
        } else {
            QuizUI.showBubuMessage(QuizRewards.getWrongMessage());
            QuizSounds.wrong();
        }

        QuizUI.showNextButton();
    },

    nextQuestion() {
        this.currentIndex++;

        if (this.currentIndex < this.totalQuestions) {
            this.loadQuestion();
        } else {
            this.finishQuiz();
        }
    },

    finishQuiz() {
        const percentage = Math.round((this.scoreCount / this.totalQuestions) * 100);

        localStorage.setItem("quizScore", percentage);

        if (this.section === "section1") {
            localStorage.setItem("section1Score", percentage);
        }

        if (this.section === "section2") {
            localStorage.setItem("section2Score", percentage);

            this.saveChildScore({
                name: localStorage.getItem("childName") || "Student",
                email: localStorage.getItem("parentEmail") || "",
                group: localStorage.getItem("quizGroup") || this.group,
                section1Score: parseInt(localStorage.getItem("section1Score") || "0", 10),
                section2Score: percentage,
                finalScore: null,
                attendance: null
            });
        }

        QuizSounds.applause();
        QuizSounds.medal();

        QuizUI.showResult(percentage, this.totalQuestions, this.group, this.section);

        this.lastResultHTML = document.getElementById("quizPlayer").innerHTML;
    },

    continueFlow() {
        const score = parseInt(localStorage.getItem("quizScore") || "0", 10);
        const section = localStorage.getItem("quizSection");

        if (section === "1") {
            if (score >= 80) {
                this.start(this.group, "section2");
            } else {
                document.getElementById("videos").scrollIntoView({ behavior: "smooth" });
            }
            return;
        }

        if (section === "2") {
            if (score >= 80) {
                const finalStage = document.getElementById("finalStage");

                if (finalStage) {
                    finalStage.style.display = "block";

                    const liveChildName = document.getElementById("liveChildName");
                    if (liveChildName) {
                        liveChildName.textContent = localStorage.getItem("childName") || "Student";
                    }

                    finalStage.scrollIntoView({ behavior: "smooth" });
                }
            } else {
                document.getElementById("videos").scrollIntoView({ behavior: "smooth" });
            }
        }
    },

    viewCertificate() {
        const name = localStorage.getItem("childName") || "Student";
        const group = localStorage.getItem("quizGroup") || "A";
        const section = localStorage.getItem("quizSection") || "1";
        const score = localStorage.getItem("quizScore") || "0";

        document.getElementById("certChildName").textContent = name;
        document.getElementById("certGroup").textContent = group;
        document.getElementById("certSection").textContent = section;
        document.getElementById("certScore").textContent = score + "%";
        document.getElementById("certDate").textContent = new Date().toLocaleDateString();

        document.getElementById("certificatePage").scrollIntoView({ behavior: "smooth" });
    },

    showReview() {
        QuizUI.showReview(this.selectedAnswers);
    },

    backToResult() {
        const player = document.getElementById("quizPlayer");
        player.innerHTML = this.lastResultHTML;
        player.scrollIntoView({ behavior: "smooth" });
    },

    saveChildScore(data) {
        const children = JSON.parse(localStorage.getItem("childrenScores") || "[]");
        children.push(data);
        localStorage.setItem("childrenScores", JSON.stringify(children));
    }

};


/* Next button */
document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "nextQuestionBtn") {
        QuizEngine.nextQuestion();
    }
});