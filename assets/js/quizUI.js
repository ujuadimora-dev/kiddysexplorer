/*=========================================
        KIDDYSEXPLORER QUIZ UI
==========================================*/

const QuizUI = {

    renderPlayerShell() {
        const player = document.getElementById("quizPlayer");

        player.innerHTML = `
            <div class="container">
                <div class="quiz-player-card">

                    <div class="quiz-top">

    <h2 id="quizTitle">Kiddysexplorer Learning Challenge</h2>

    <p id="quizProgressText">Question 1 of 10</p>

    <div class="quiz-timer" id="quizTimer">

        ⏰ <span id="timerValue">30</span> sec

    </div>

    <div class="progress-bar">

        <div id="quizProgressFill"></div>

    </div>

</div>

                    <div class="bubu-message" id="bubuMessage">
                        😊 Bubu is ready. Let’s begin!
                    </div>

                    <h3 id="quizQuestion">Question appears here</h3>

                    <div id="quizOptions" class="quiz-options"></div>

                    <button id="nextQuestionBtn" class="btn btn-primary" style="display:none;">
                        Next Question
                    </button>

                </div>
            </div>
        `;
    },

    init() {
        this.quizPlayer = document.getElementById("quizPlayer");
        this.quizTitle = document.getElementById("quizTitle");
        this.progressText = document.getElementById("quizProgressText");
        this.progressFill = document.getElementById("quizProgressFill");
        this.bubuMessage = document.getElementById("bubuMessage");
        this.questionBox = document.getElementById("quizQuestion");
        this.optionsBox = document.getElementById("quizOptions");
        this.nextButton = document.getElementById("nextQuestionBtn");
    },

    showPlayer() {
        this.quizPlayer.style.display = "block";
        this.quizPlayer.scrollIntoView({ behavior: "smooth" });
    },

    setTitle(group, section) {
        const sectionName = section === "section1" ? "Section 1" : "Section 2";
        this.quizTitle.innerHTML = `Group ${group} - ${sectionName}`;
    },

    updateProgress(current, total) {
        this.progressText.innerHTML = `Question ${current} of ${total}`;
        this.progressFill.style.width = `${(current / total) * 100}%`;
    },

    showBubuMessage(message) {
        this.bubuMessage.innerHTML = message;
    },

    showQuestion(question) {
        this.questionBox.innerHTML = question.q;
        this.optionsBox.innerHTML = "";

        question.options.forEach((option, index) => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "answer-card";
            card.dataset.index = index;

            card.innerHTML = `
                <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                <span class="answer-text">${option}</span>
            `;

            card.addEventListener("click", function () {
                QuizEngine.selectAnswer(index);
            });

            this.optionsBox.appendChild(card);
        });
    },

    lockAnswers() {
        document.querySelectorAll(".answer-card").forEach(card => {
            card.disabled = true;
        });
    },

    markAnswer(selectedIndex, correctIndex) {
        const cards = document.querySelectorAll(".answer-card");

        cards.forEach((card, index) => {
            if (index === correctIndex) {
                card.classList.add("correct");
            }

            if (index === selectedIndex && selectedIndex !== correctIndex) {
                card.classList.add("wrong");
            }
        });
    },

    showNextButton() {
        this.nextButton.style.display = "inline-block";
    },

    hideNextButton() {
        this.nextButton.style.display = "none";
    },

    showResult(score, total, group, section) {
        const medal = QuizRewards.getMedal(score);
        const bubuLevel = QuizRewards.getBubuLevel(score);

        const correct = Math.round((score / 100) * total);
        const wrong = total - correct;
        const dashOffset = 471 - (471 * (score / 100));

        this.quizPlayer.innerHTML = `
        <div class="container">
            <div class="premium-result">

                <div class="celebration-title">🎉 CONGRATULATIONS!</div>

                <div class="medal-big">${medal.icon}</div>

                <h1 class="medal-title">${medal.title}</h1>

                <div class="score-circle">
                    <svg>
                        <circle cx="90" cy="90" r="75"></circle>
                        <circle class="progress"
                            cx="90"
                            cy="90"
                            r="75"
                            style="stroke-dashoffset:${dashOffset};">
                        </circle>
                    </svg>

                    <div class="score-number">
                        ${score}<span>%</span>
                    </div>
                </div>

                <div class="score-summary">
                    <div class="summary-card">
                        <div>✅</div>
                        <h2>${correct}</h2>
                        <p>Correct</p>
                    </div>

                    <div class="summary-card">
                        <div>❌</div>
                        <h2>${wrong}</h2>
                        <p>Wrong</p>
                    </div>
                </div>

                <div class="bubu-box">
                    🐻 ${bubuLevel}
                </div>

                <div class="result-buttons">
                    <button class="btn btn-secondary" onclick="QuizEngine.showReview()">
                        📖 Review Answers
                    </button>

                    <button class="btn btn-secondary" onclick="QuizEngine.viewCertificate()">
                        📜 Certificate
                    </button>

                    <button class="btn btn-primary" onclick="QuizEngine.continueFlow()">
                        ➜ Continue
                    </button>
                </div>

            </div>
        </div>
    `;
    },

    showReview(answers) {
        let html = `
            <div class="container">
                <div class="review-wrapper">
                    <h2>Answer Review</h2>
                    <p class="review-subtitle">See your answers and the correct answers below.</p>
        `;

        answers.forEach((item, index) => {
            const isCorrect = item.selected === item.correct;

            html += `
                <div class="review-card ${isCorrect ? "review-correct" : "review-wrong"}">
                    <h3>${index + 1}. ${item.question}</h3>

                    <p>
                        Your Answer:
                        <strong>${item.options[item.selected]}</strong>
                        ${isCorrect ? "✅" : "❌"}
                    </p>

                    <p>
                        Correct Answer:
                        <strong>
    ${item.selected === null
                    ? "No answer — time expired"
                    : item.options[item.selected]}
</strong> ✅
                    </p>
                </div>
            `;
        });

        html += `
                    <button class="btn btn-primary" onclick="QuizEngine.backToResult()">
                        Back to Result
                    </button>
                </div>
            </div>
        `;

        this.quizPlayer.innerHTML = html;
        this.quizPlayer.scrollIntoView({ behavior: "smooth" });
    }

};