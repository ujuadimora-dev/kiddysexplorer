/*=========================================
        KIDDYSEXPLORER MAIN QUIZ WIRING
==========================================*/

document.addEventListener("DOMContentLoaded", function () {

    /* Registration Form */
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

            document.getElementById("groups").scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    /* Group Buttons */
    const groupButtons = document.querySelectorAll(".group-btn");

    groupButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const selectedGroup = this.getAttribute("data-group");

            localStorage.setItem("quizGroup", selectedGroup);

            QuizEngine.start(selectedGroup, "section1");
        });
    });

});

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