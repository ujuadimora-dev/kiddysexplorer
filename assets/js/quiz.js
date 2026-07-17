/*=========================================
        KIDDYSEXPLORER MAIN QUIZ WIRING
==========================================*/

document.addEventListener("DOMContentLoaded", function () {

    /*=====================================
            REGISTRATION FORM
    ======================================*/

    /* Registration Form */
const form = document.getElementById("quizForm");

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameInput =
            document.getElementById("childName");

        const ageInput =
            document.getElementById("childAge");

        const emailInput =
            document.getElementById("parentEmail");

        const groupInput =
            document.getElementById("quizGroup");

        const name = nameInput
            ? nameInput.value.trim()
            : "";

        const age = ageInput
            ? parseInt(ageInput.value, 10)
            : null;

        const email = emailInput
            ? emailInput.value.trim()
            : "";

        const group = groupInput
            ? groupInput.value
            : "";

        if (!name || !age || !email || !group) {
            alert(
                "Please complete all registration fields."
            );
            return;
        }

        /* Save the current child for the quiz */
        localStorage.setItem("childName", name);
        localStorage.setItem("childAge", age);
        localStorage.setItem("parentEmail", email);
        localStorage.setItem("quizGroup", group);

        /*
         * Create the participant record used by
         * the Admin Dashboard.
         */
        if (
            typeof ParticipantStore !== "undefined" &&
            typeof ParticipantStore.register === "function"
        ) {
            ParticipantStore.register({
                childName: name,
                age: age,
                parentEmail: email,
                group: group
            });
        } else {
            console.error(
                "ParticipantStore is not loaded."
            );

            alert(
                "The registration could not be saved to the Admin Dashboard."
            );

            return;
        }

        const groupsSection =
            document.getElementById("groups");

        if (groupsSection) {
            groupsSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
}
    /*=====================================
            GROUP BUTTONS
    ======================================*/

    const groupButtons =
        document.querySelectorAll(".group-btn");

    groupButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const selectedGroup =
                    this.getAttribute("data-group");


                if (!selectedGroup) {
                    console.error(
                        "This button has no data-group value."
                    );

                    return;
                }


                if (
                    typeof QuizEngine === "undefined" ||
                    typeof QuizEngine.start !== "function"
                ) {
                    console.error(
                        "QuizEngine is not loaded correctly."
                    );

                    alert(
                        "The quiz could not start. Please check the JavaScript files."
                    );

                    return;
                }


                localStorage.setItem(
                    "quizGroup",
                    selectedGroup
                );


                /* Start Section 1 */

                QuizEngine.start(
                    selectedGroup,
                    "section1"
                );
            }
        );
    });


    /*=====================================
            SOUND ON/OFF BUTTON
    ======================================*/

    const soundToggleBtn =
        document.getElementById(
            "soundToggleBtn"
        );

    if (
        soundToggleBtn &&
        typeof QuizSounds !== "undefined"
    ) {
        soundToggleBtn.addEventListener(
            "click",
            function () {

                const enabled =
                    QuizSounds.toggle();

                this.innerHTML = enabled
                    ? "🔊 Sound On"
                    : "🔇 Sound Off";
            }
        );
    }


    /*=====================================
        DOWNLOAD CERTIFICATE AS PDF
    ======================================*/

    const downloadCertBtn =
        document.getElementById(
            "downloadCertBtn"
        );

    if (downloadCertBtn) {
        downloadCertBtn.addEventListener(
            "click",
            async function () {

                const certCard =
                    document.querySelector(
                        ".certificate-card"
                    );

                if (!certCard) {
                    console.error(
                        "Certificate card was not found."
                    );

                    return;
                }


                if (
                    typeof html2canvas === "undefined"
                ) {
                    alert(
                        "Certificate download could not start because html2canvas is not loaded."
                    );

                    return;
                }


                if (
                    !window.jspdf ||
                    !window.jspdf.jsPDF
                ) {
                    alert(
                        "Certificate download could not start because jsPDF is not loaded."
                    );

                    return;
                }


                const certButtons =
                    certCard.querySelector(
                        ".cert-buttons"
                    );


                if (certButtons) {
                    certButtons.style.display =
                        "none";
                }


                try {
                    const canvas =
                        await html2canvas(
                            certCard,
                            {
                                scale: 3,
                                backgroundColor:
                                    "#ffffff",

                                useCORS: true,

                                allowTaint: false,

                                onclone:
                                    function (
                                        clonedDocument
                                    ) {
                                        const clonedText =
                                            clonedDocument
                                                .getElementById(
                                                    "certMedalText"
                                                );

                                        if (
                                            clonedText
                                        ) {
                                            clonedText.style.display =
                                                "block";

                                            clonedText.style.visibility =
                                                "visible";

                                            clonedText.style.opacity =
                                                "1";

                                            clonedText.style.color =
                                                "#003b73";

                                            clonedText.style.background =
                                                "#ffffff";

                                            clonedText.style.fontSize =
                                                "26px";

                                            clonedText.style.fontWeight =
                                                "900";

                                            clonedText.style.textAlign =
                                                "center";

                                            clonedText.style.marginTop =
                                                "15px";

                                            clonedText.style.padding =
                                                "8px 18px";

                                            clonedText.style.borderRadius =
                                                "30px";

                                            clonedText.style.position =
                                                "relative";

                                            clonedText.style.zIndex =
                                                "999";
                                        }
                                    }
                            }
                        );


                    const imageData =
                        canvas.toDataURL(
                            "image/png"
                        );


                    const { jsPDF } =
                        window.jspdf;


                    const pdf =
                        new jsPDF({
                            orientation:
                                "landscape",

                            unit: "mm",

                            format: "a4"
                        });


                    const pageWidth =
                        pdf.internal.pageSize
                            .getWidth();

                    const pageHeight =
                        pdf.internal.pageSize
                            .getHeight();


                    const margin = 10;

                    const availableWidth =
                        pageWidth -
                        margin * 2;

                    const availableHeight =
                        pageHeight -
                        margin * 2;


                    /*
                     * Keep the certificate's correct
                     * proportions inside the PDF.
                     */

                    const imageRatio =
                        canvas.width /
                        canvas.height;

                    const pageRatio =
                        availableWidth /
                        availableHeight;


                    let imageWidth;
                    let imageHeight;
                    let imageX;
                    let imageY;


                    if (imageRatio > pageRatio) {
                        imageWidth =
                            availableWidth;

                        imageHeight =
                            imageWidth /
                            imageRatio;

                        imageX = margin;

                        imageY =
                            (pageHeight -
                                imageHeight) /
                            2;
                    } else {
                        imageHeight =
                            availableHeight;

                        imageWidth =
                            imageHeight *
                            imageRatio;

                        imageY = margin;

                        imageX =
                            (pageWidth -
                                imageWidth) /
                            2;
                    }


                    pdf.addImage(
                        imageData,
                        "PNG",
                        imageX,
                        imageY,
                        imageWidth,
                        imageHeight
                    );


                    const childName =
                        localStorage.getItem(
                            "childName"
                        ) || "Student";


                    const safeChildName =
                        childName.replace(
                            /[^a-z0-9]/gi,
                            "-"
                        );


                    pdf.save(
                        `Kiddysexplorer-Certificate-${safeChildName}.pdf`
                    );

                } catch (error) {
                    console.error(
                        "Certificate download failed:",
                        error
                    );

                    alert(
                        "The certificate could not be downloaded. Please try again."
                    );

                } finally {
                    if (certButtons) {
                        certButtons.style.display =
                            "flex";
                    }
                }
            }
        );
    }

});