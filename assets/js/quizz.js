/* ============================================================
   QUESTION BANK – SECTION 1 (Groups A, B, C)
   ============================================================ */

const questionsA = [
  { q: "What color is the sky?", options: ["Blue", "Green", "Red"], answer: 0 },
  { q: "How many legs does a cat have?", options: ["2", "4", "6"], answer: 1 },
];

const questionsB = [
  { q: "What planet do we live on?", options: ["Mars", "Earth", "Venus"], answer: 1 },
  { q: "What is 5 + 3?", options: ["6", "8", "10"], answer: 1 },
];

const questionsC = [
  { q: "What is the capital of France?", options: ["Paris", "London", "Berlin"], answer: 0 },
  { q: "Solve: 12 × 3", options: ["36", "24", "48"], answer: 0 },
];


/* ============================================================
   QUESTION BANK – SECTION 2 (Groups A, B, C)
   ============================================================ */

const questions2A = [
  { q: "Which one is bigger?", options: ["Elephant", "Cat", "Mouse"], answer: 0 },
  { q: "What do plants need to grow?", options: ["Water", "Shoes", "Toys"], answer: 0 },
];

const questions2B = [
  { q: "Which number comes after 7?", options: ["8", "6", "10"], answer: 0 },
  { q: "Which one is used for cooking?", options: ["Pot", "Pillow", "Book"], answer: 0 },
];

const questions2C = [
  { q: "Which shape has 4 equal sides?", options: ["Square", "Triangle", "Rectangle"], answer: 0 },
  { q: "What do we use to eat soup?", options: ["Spoon", "Fork", "Knife"], answer: 0 },
];


/* ============================================================
   HELPERS – GET QUESTIONS
   ============================================================ */

function getSection1QuestionsForGroup(group) {
  if (group === "A") return questionsA;
  if (group === "B") return questionsB;
  return questionsC;
}

function getSection2QuestionsForGroup(group) {
  if (group === "A") return questions2A;
  if (group === "B") return questions2B;
  return questions2C;
}


/* ============================================================
   LOAD QUESTIONS – SECTION 1
   ============================================================ */

function loadSection1Questions() {
  const group = localStorage.getItem("quizGroup") || "A";
  const selectedQuestions = getSection1QuestionsForGroup(group);
  const quizContainer = document.getElementById("section1Questions");
  quizContainer.innerHTML = "";

  selectedQuestions.forEach((item, index) => {
    quizContainer.innerHTML += `
      <div class="question-block">
        <p>${index + 1}. ${item.q}</p>
        ${item.options
          .map(
            (opt, i) =>
              `<label><input type="radio" name="q${index}" value="${i}" required> ${opt}</label><br>`
          )
          .join("")}
      </div>
    `;
  });
}


/* ============================================================
   LOAD QUESTIONS – SECTION 2
   ============================================================ */

function loadSection2Questions() {
  const group = localStorage.getItem("quizGroup") || "A";
  const selectedQuestions = getSection2QuestionsForGroup(group);
  const quizContainer = document.getElementById("section2Questions");
  quizContainer.innerHTML = "";

  selectedQuestions.forEach((item, index) => {
    quizContainer.innerHTML += `
      <div class="question-block">
        <p>${index + 1}. ${item.q}</p>
        ${item.options
          .map(
            (opt, i) =>
              `<label><input type="radio" name="s2q${index}" value="${i}" required> ${opt}</label><br>`
          )
          .join("")}
      </div>
    `;
  });
}


/* ============================================================
   CERTIFICATE – UPDATE CONTENT
   ============================================================ */

function updateCertificate() {
  const name = localStorage.getItem("childName") || "Student";
  const group = localStorage.getItem("quizGroup") || "A";
  const section = localStorage.getItem("quizSection") || "1";
  const score = localStorage.getItem("quizScore") || "0";

  document.getElementById("certChildName").textContent = name;
  document.getElementById("certGroup").textContent = group;
  document.getElementById("certSection").textContent = section;
  document.getElementById("certScore").textContent = score + "%";
  document.getElementById("certDate").textContent = new Date().toLocaleDateString();
}


/* ============================================================
   SAVE CHILD SCORE (Dashboard)
   ============================================================ */

function saveChildScore(data) {
  const children = JSON.parse(localStorage.getItem("childrenScores") || "[]");
  children.push(data);
  localStorage.setItem("childrenScores", JSON.stringify(children));
}


/* ============================================================
   ADMIN DASHBOARD – LOAD CHILDREN (with group filter)
   ============================================================ */

function loadAdminDashboard() {
  const tableBody = document.getElementById("scoreTableBody");
  const groupFilter = document.getElementById("groupFilter");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  const selectedGroup = groupFilter ? groupFilter.value : "All";
  const children = JSON.parse(localStorage.getItem("childrenScores") || "[]");

  const filtered =
    selectedGroup === "All"
      ? children
      : children.filter(c => c.group === selectedGroup);

  filtered.forEach((child, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${child.name}</td>
      <td>${child.email}</td>
      <td>${child.section1Score}%</td>
      <td>${child.section2Score}%</td>
      <td>
        <select class="finalScoreSelect" data-index="${index}">
          <option value="">-- Select --</option>
          <option value="100">100%</option>
          <option value="95">95%</option>
          <option value="90">90%</option>
          <option value="85">85%</option>
          <option value="80">80%</option>
          <option value="75">75%</option>
          <option value="70">70%</option>
          <option value="65">65%</option>
          <option value="60">60%</option>
        </select>
      </td>
      <td>
        <select class="attendanceSelect" data-index="${index}">
          <option value="">-- Select --</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </td>
    `;
    tableBody.appendChild(row);
  });
}


/* ============================================================
   DOMContentLoaded – MAIN WIRING
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* Registration */
  const form = document.getElementById("quizForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("childName").value;
      const email = document.getElementById("parentEmail").value;
      const group = document.getElementById("quizGroup").value;

      localStorage.setItem("childName", name);
      localStorage.setItem("parentEmail", email);
      localStorage.setItem("quizGroup", group);

      window.location.href = "#groups";
    });
  }

  /* Group Buttons */
  const groupButtons = document.querySelectorAll(".group-btn");
  groupButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const selectedGroup = this.getAttribute("data-group");
      localStorage.setItem("quizGroup", selectedGroup);

      document.getElementById("groupDisplay").textContent = selectedGroup;
      document.getElementById("childNameDisplay").textContent =
        localStorage.getItem("childName") || "Student";

      loadSection1Questions();
      const section1 = document.getElementById("section1");
      section1.style.display = "block";
      section1.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* Score Page Buttons */
  const nextSectionBtn = document.getElementById("nextSectionBtn");
  if (nextSectionBtn) {
    nextSectionBtn.addEventListener("click", function (e) {
      e.preventDefault();
      loadSection2Questions();
      document.getElementById("childNameDisplay2").textContent =
        localStorage.getItem("childName") || "Student";
      document.getElementById("groupDisplay2").textContent =
        localStorage.getItem("quizGroup") || "A";
      const section2 = document.getElementById("section2");
      section2.style.display = "block";
      section2.scrollIntoView({ behavior: "smooth" });
    });
  }

  const certificateBtn = document.getElementById("certificateBtn");
  if (certificateBtn) {
    certificateBtn.addEventListener("click", function (e) {
      e.preventDefault();
      updateCertificate();
      document.getElementById("certificatePage").scrollIntoView({ behavior: "smooth" });
    });
  }

  const learnMoreBtn = document.getElementById("learnMoreBtn");
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("videos").scrollIntoView({ behavior: "smooth" });
    });
  }

  /* Certificate Continue */
  const certContinueBtn = document.getElementById("certContinueBtn");
  if (certContinueBtn) {
    certContinueBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const lastSection = localStorage.getItem("quizSection");
      const score = parseInt(localStorage.getItem("quizScore") || "0", 10);

      if (lastSection === "1") {
        if (score >= 80) {
          loadSection2Questions();
          const section2 = document.getElementById("section2");
          section2.style.display = "block";
          section2.scrollIntoView({ behavior: "smooth" });
        } else {
          document.getElementById("videos").scrollIntoView({ behavior: "smooth" });
        }
      }

      if (lastSection === "2") {
        if (score >= 80) {
          const finalStage = document.getElementById("finalStage");
          finalStage.style.display = "block";
          finalStage.scrollIntoView({ behavior: "smooth" });
        } else {
          document.getElementById("videos").scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  /* Certificate Download */
  const downloadCertBtn = document.getElementById("downloadCertBtn");
  if (downloadCertBtn) {
    downloadCertBtn.addEventListener("click", function () {
      const certCard = document.querySelector(".certificate-card");
      const certButtons = certCard.querySelector(".cert-buttons");

      certButtons.style.display = "none";

      html2canvas(certCard).then(canvas => {
        certButtons.style.display = "flex";

        const link = document.createElement("a");
        link.download = "Kiddysexplorer-Certificate.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    });
  }

  /* Dashboard Load */
  loadAdminDashboard();

  /* Dashboard Filter */
  const groupFilter = document.getElementById("groupFilter");
  if (groupFilter) {
    groupFilter.addEventListener("change", loadAdminDashboard);
  }

  /* Save Dropdown Changes */
  document.addEventListener("change", function (e) {
    const children = JSON.parse(localStorage.getItem("childrenScores") || "[]");

    if (e.target.classList.contains("finalScoreSelect")) {
      const index = e.target.getAttribute("data-index");
      children[index].finalScore = parseInt(e.target.value || "0");
      localStorage.setItem("childrenScores", JSON.stringify(children));
    }

    if (e.target.classList.contains("attendanceSelect")) {
      const index = e.target.getAttribute("data-index");
      children[index].attendance = e.target.value;
      localStorage.setItem("childrenScores", JSON.stringify(children));
    }
  });
});


/* ============================================================
   SECTION 1 – SUBMIT & SCORE
   ============================================================ */

const section1Form = document.getElementById("section1QuizForm");

if (section1Form) {
  section1Form.addEventListener("submit", function (e) {
    e.preventDefault();

    const group = localStorage.getItem("quizGroup");
    const selectedQuestions = getSection1QuestionsForGroup(group);

    let score = 0;

    selectedQuestions.forEach((item, index) => {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      if (selected && parseInt(selected.value) === item.answer) {
        score++;
      }
    });

    const percentage = Math.round((score / selectedQuestions.length) * 100);

    localStorage.setItem("quizScore", percentage);
    localStorage.setItem("quizSection", "1");
    localStorage.setItem("section1Score", percentage);

    document.getElementById("childNameResult").textContent =
      localStorage.getItem("childName") || "Student";

    document.getElementById("groupResult").textContent = group;
    document.getElementById("sectionResult").textContent = "1";
    document.getElementById("scoreValue").textContent = percentage + "%";

    if (percentage >= 80) {
      document.getElementById("scoreMessage").textContent =
        "Great job! You passed Section 1.";
      document.getElementById("nextSectionBtn").style.display = "inline-block";
      document.getElementById("learnMoreBtn").style.display = "none";
      document.getElementById("failMessage").style.display = "none";
    } else {
      document.getElementById("scoreMessage").textContent =
        "Keep learning! Watch the videos and try again.";
      document.getElementById("nextSectionBtn").style.display = "none";
      document.getElementById("learnMoreBtn").style.display = "inline-block";
      document.getElementById("failMessage").style.display = "block";
    }

    document.getElementById("section1").style.display = "none";
    document.getElementById("scorePage").scrollIntoView({ behavior: "smooth" });
  });
}


/* ============================================================
   SECTION 2 – SUBMIT & SCORE
   ============================================================ */

const section2Form = document.getElementById("section2QuizForm");

if (section2Form) {
  section2Form.addEventListener("submit", function (e) {
    e.preventDefault();

    const group = localStorage.getItem("quizGroup");
    const selectedQuestions = getSection2QuestionsForGroup(group);

    let score = 0;

    selectedQuestions.forEach((item, index) => {
      const selected = document.querySelector(`input[name="s2q${index}"]:checked`);
      if (selected && parseInt(selected.value) === item.answer) {
        score++;
      }
    });

    const percentage = Math.round((score / selectedQuestions.length) * 100);

    localStorage.setItem("quizScore", percentage);
    localStorage.setItem("quizSection", "2");

    updateCertificate();

    saveChildScore({
      name: localStorage.getItem("childName"),
      email: localStorage.getItem("parentEmail"),
      group: localStorage.getItem("quizGroup"),
      section1Score: parseInt(localStorage.getItem("section1Score") || "0"),
      section2Score: percentage,
      finalScore: null,
      attendance: null
    });

    if (percentage >= 80) {
      const finalStage = document.getElementById("finalStage");
      finalStage.style.display = "block";
      finalStage.scrollIntoView({ behavior: "smooth" });
    } else {
      const videos = document.getElementById("videos");
      videos.scrollIntoView({ behavior: "smooth" });
    }
  });
}


/* ============================================================
   PUBLISH WINNERS FOR GROUP A, B, C
   ============================================================ */

const publishWinnersBtn = document.getElementById("publishWinnersBtn");
if (publishWinnersBtn) {
  publishWinnersBtn.addEventListener("click", function () {

    const children = JSON.parse(localStorage.getItem("childrenScores") || "[]");

    function publishGroupWinners(group) {
      const groupKids = children.filter(
        c => c.group === group && c.attendance === "Present" && typeof c.finalScore === "number"
      );

      groupKids.sort((a, b) => b.finalScore - a.finalScore);

      const first = groupKids[0] || null;
      const second = groupKids[1] || null;
      const third = groupKids[2] || null;

      if (first) {
        document.getElementById(`${group}_firstPlaceName`).textContent = first.name;
        document.getElementById(`${group}_firstPlaceScore`).textContent = `Score: ${first.finalScore}%`;
      }

      if (second) {
        document.getElementById(`${group}_secondPlaceName`).textContent = second.name;
        document.getElementById(`${group}_secondPlaceScore`).textContent = `Score: ${second.finalScore}%`;
      }

      if (third) {
        document.getElementById(`${group}_thirdPlaceName`).textContent = third.name;
        document.getElementById(`${group}_thirdPlaceScore`).textContent = `Score: ${third.finalScore}%`;
      }
    }

    publishGroupWinners("A");
    publishGroupWinners("B");
    publishGroupWinners("C");

    document.getElementById("winnerMessage").style.display = "block";
  });
}

