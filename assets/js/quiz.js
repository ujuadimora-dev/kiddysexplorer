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


    /* Download Certificate */
    const downloadCertBtn = document.getElementById("downloadCertBtn");

    if (downloadCertBtn) {
        downloadCertBtn.addEventListener("click", function () {
            const certCard = document.querySelector(".certificate-card");
            const certButtons = certCard.querySelector(".cert-buttons");

            certButtons.style.display = "none";

            html2canvas(certCard, {
                scale: 3,
                backgroundColor: "#ffffff",
                useCORS: true,

                onclone: function (clonedDoc) {
                    const clonedText = clonedDoc.getElementById("certMedalText");

                    if (clonedText) {
                        clonedText.style.display = "block";
                        clonedText.style.visibility = "visible";
                        clonedText.style.opacity = "1";
                        clonedText.style.color = "#003b73";
                        clonedText.style.background = "#ffffff";
                        clonedText.style.fontSize = "26px";
                        clonedText.style.fontWeight = "900";
                        clonedText.style.textAlign = "center";
                        clonedText.style.marginTop = "15px";
                        clonedText.style.padding = "8px 18px";
                        clonedText.style.borderRadius = "30px";
                        clonedText.style.position = "relative";
                        clonedText.style.zIndex = "999";
                    }
                }
            }).then(canvas => {
                certButtons.style.display = "flex";

                const link = document.createElement("a");
                link.download = "Kiddysexplorer-Certificate.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
            });
        });
    }

});

//js for medatl txt

