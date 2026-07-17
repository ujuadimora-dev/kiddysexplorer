/*=========================================
    KIDDYSEXPLORER ADMIN PARTICIPANTS
==========================================*/

const AdminParticipants = {

    activeParticipantId: null,


    /*=====================================
        INITIALIZE PARTICIPANT MANAGEMENT
    ======================================*/

    init() {
        this.bindEvents();
    },


    /*=====================================
        CONNECT ALL MODAL EVENTS
    ======================================*/

    bindEvents() {

        this.onClick(
            "closeParticipantModalBtn",
            () => this.closeViewModal()
        );


        this.onClick(
            "closeParticipantFooterBtn",
            () => this.closeViewModal()
        );


        this.onClick(
            "editParticipantBtn",
            () => this.openEditModal()
        );


        this.onClick(
            "printParticipantBtn",
            () => this.printParticipant()
        );


        this.onClick(
            "deleteParticipantModalBtn",
            () => this.requestDelete()
        );


        this.onClick(
            "closeEditParticipantBtn",
            () => this.closeEditModal()
        );


        this.onClick(
            "cancelEditParticipantBtn",
            () => this.closeEditModal()
        );


        this.onClick(
            "saveParticipantChangesBtn",
            () => this.saveChanges()
        );


        this.onClick(
            "cancelDeleteParticipantBtn",
            () => this.closeDeleteModal()
        );


        this.onClick(
            "confirmDeleteParticipantBtn",
            () => this.confirmDelete()
        );


        document
            .querySelectorAll(
                "[data-close-participant-modal]"
            )
            .forEach(element => {

                element.addEventListener(
                    "click",
                    () => this.closeViewModal()
                );

            });


        document
            .querySelectorAll(
                "[data-close-edit-modal]"
            )
            .forEach(element => {

                element.addEventListener(
                    "click",
                    () => this.closeEditModal()
                );

            });


        document
            .querySelectorAll(
                "[data-close-delete-modal]"
            )
            .forEach(element => {

                element.addEventListener(
                    "click",
                    () => this.closeDeleteModal()
                );

            });


        const editForm =
            document.getElementById(
                "editParticipantForm"
            );


        if (editForm) {

            editForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    this.saveChanges();

                }
            );

        }


        document.addEventListener(
            "keydown",
            event => {

                if (event.key !== "Escape") {
                    return;
                }


                if (
                    this.isVisible(
                        "deleteParticipantModal"
                    )
                ) {

                    this.closeDeleteModal();

                    return;
                }


                if (
                    this.isVisible(
                        "editParticipantModal"
                    )
                ) {

                    this.closeEditModal();

                    return;
                }


                if (
                    this.isVisible(
                        "participantModal"
                    )
                ) {

                    this.closeViewModal();

                }

            }
        );
    },


    /*=====================================
        OPEN PARTICIPANT PROFILE
    ======================================*/

    openParticipant(participantId) {

        if (
            typeof ParticipantStore ===
            "undefined"
        ) {

            console.error(
                "ParticipantStore is not loaded."
            );

            return;
        }


        const participant =
            ParticipantStore.getById(
                participantId
            );


        if (!participant) {

            this.showToast(
                "Participant record was not found.",
                "error"
            );

            return;
        }


        this.activeParticipantId =
            participant.id;


        this.populateViewModal(
            participant
        );


        this.showModal(
            "participantModal"
        );
    },


    /*=====================================
        FILL PARTICIPANT PROFILE MODAL
    ======================================*/

    populateViewModal(participant) {

        const status =
            this.getStatus(
                participant
            );


        this.setText(
            "modalParticipantName",
            participant.childName ||
            "Unknown Participant"
        );


        this.setText(
            "modalParticipantEmail",
            participant.parentEmail ||
            "No parent email"
        );


        this.setText(
            "modalParticipantAge",
            participant.age ?? "—"
        );


        this.setText(
            "modalParticipantGroup",
            participant.group
                ? `Group ${participant.group}`
                : "—"
        );


        this.setText(
            "modalSection1Score",
            this.formatScore(
                participant.section1Score
            )
        );


        this.setText(
            "modalSection2Score",
            this.formatScore(
                participant.section2Score
            )
        );


        this.setText(
            "modalAttendance",
            participant.liveAttendance ||
            "Not Marked"
        );


        this.setText(
            "modalLiveScore",
            this.formatValue(
                participant.liveScore
            )
        );


        this.setText(
            "modalPosition",
            this.formatValue(
                participant.finalPosition
            )
        );


        this.setText(
            "modalPrize",
            this.formatValue(
                participant.prize
            )
        );


        this.setText(
            "modalRegistrationDate",
            this.formatDate(
                participant.registrationDate
            )
        );


        const statusElement =
            document.getElementById(
                "modalParticipantStatus"
            );


        if (statusElement) {

            statusElement.textContent =
                status;


            statusElement.className =
                `status-badge ${this.statusClass(
                    status
                )}`;
        }
    },


    /*=====================================
        OPEN EDIT PARTICIPANT MODAL
    ======================================*/

    openEditModal() {

        if (
            !this.activeParticipantId
        ) {

            this.showToast(
                "No participant is currently selected.",
                "error"
            );

            return;
        }


        const participant =
            ParticipantStore.getById(
                this.activeParticipantId
            );


        if (!participant) {

            this.showToast(
                "Participant record was not found.",
                "error"
            );

            return;
        }


        this.setValue(
            "editParticipantId",
            participant.id
        );


        this.setValue(
            "editChildName",
            participant.childName || ""
        );


        this.setValue(
            "editAge",
            participant.age ?? ""
        );


        this.setValue(
            "editGroup",
            participant.group || ""
        );


        this.setValue(
            "editParentEmail",
            participant.parentEmail || ""
        );


        this.clearFormError();


        this.hideModal(
            "participantModal"
        );


        this.showModal(
            "editParticipantModal"
        );


        setTimeout(() => {

            const childNameInput =
                document.getElementById(
                    "editChildName"
                );


            if (childNameInput) {

                childNameInput.focus();

                childNameInput.select();

            }

        }, 100);
    },


    /*=====================================
        SAVE PARTICIPANT CHANGES
    ======================================*/

    saveChanges() {

        const participantId =
            document.getElementById(
                "editParticipantId"
            )?.value;


        const childName =
            document.getElementById(
                "editChildName"
            )?.value
                .trim();


        const ageInput =
            document.getElementById(
                "editAge"
            )?.value;


        const age =
            Number(ageInput);


        const group =
            document.getElementById(
                "editGroup"
            )?.value
                .trim()
                .toUpperCase();


        const parentEmail =
            document.getElementById(
                "editParentEmail"
            )?.value
                .trim()
                .toLowerCase();


        this.clearFormError();


        if (!participantId) {

            this.showFormError(
                "Participant ID is missing."
            );

            return;
        }


        if (!childName) {

            this.showFormError(
                "Please enter the child's name."
            );

            return;
        }


        if (
            !Number.isInteger(age) ||
            age < 3 ||
            age > 12
        ) {

            this.showFormError(
                "Age must be a whole number between 3 and 12."
            );

            return;
        }


        if (
            !["A", "B", "C"].includes(
                group
            )
        ) {

            this.showFormError(
                "Please select Group A, Group B or Group C."
            );

            return;
        }


        if (
            typeof ParticipantStore.isValidEmail !==
            "function"
        ) {

            console.error(
                "ParticipantStore.isValidEmail() is not available."
            );

            return;
        }


        if (
            !ParticipantStore.isValidEmail(
                parentEmail
            )
        ) {

            this.showFormError(
                "Please enter a valid parent email address."
            );

            return;
        }


        const saveButton =
            document.getElementById(
                "saveParticipantChangesBtn"
            );


        const originalButtonContent =
            saveButton
                ? saveButton.innerHTML
                : "";


        if (saveButton) {

            saveButton.disabled = true;

            saveButton.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                Saving...
            `;
        }


        const updatedParticipant =
            ParticipantStore.update(
                participantId,
                {
                    childName:
                        childName,

                    age:
                        age,

                    group:
                        group,

                    parentEmail:
                        parentEmail
                }
            );


        if (saveButton) {

            saveButton.disabled = false;

            saveButton.innerHTML =
                originalButtonContent;
        }


        if (!updatedParticipant) {

            this.showFormError(
                "The participant could not be updated. Another participant may already use the same child name and parent email."
            );

            return;
        }


        this.activeParticipantId =
            updatedParticipant.id;


        this.hideModal(
            "editParticipantModal"
        );


        this.populateViewModal(
            updatedParticipant
        );


        this.showModal(
            "participantModal"
        );


        if (
            typeof AdminDashboard !==
            "undefined" &&
            typeof AdminDashboard.refreshDashboard ===
            "function"
        ) {

            AdminDashboard.refreshDashboard();

        }


        this.showToast(
            "Participant updated successfully.",
            "success"
        );
    },


    /*=====================================
        PREPARE PARTICIPANT DELETION
    ======================================*/

    requestDelete() {

        if (
            !this.activeParticipantId
        ) {

            this.showToast(
                "No participant is currently selected.",
                "error"
            );

            return;
        }


        const participant =
            ParticipantStore.getById(
                this.activeParticipantId
            );


        if (!participant) {

            this.showToast(
                "Participant record was not found.",
                "error"
            );

            return;
        }


        this.setText(
            "deleteParticipantName",
            participant.childName ||
            "this participant"
        );


        this.hideModal(
            "participantModal"
        );


        this.showModal(
            "deleteParticipantModal"
        );
    },


    /*=====================================
        CONFIRM PARTICIPANT DELETION
    ======================================*/

    confirmDelete() {

        if (
            !this.activeParticipantId
        ) {

            return;
        }


        const participant =
            ParticipantStore.getById(
                this.activeParticipantId
            );


        const deleteButton =
            document.getElementById(
                "confirmDeleteParticipantBtn"
            );


        const originalButtonContent =
            deleteButton
                ? deleteButton.innerHTML
                : "";


        if (deleteButton) {

            deleteButton.disabled = true;

            deleteButton.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                Deleting...
            `;
        }


        const removed =
            ParticipantStore.remove(
                this.activeParticipantId
            );


        if (deleteButton) {

            deleteButton.disabled = false;

            deleteButton.innerHTML =
                originalButtonContent;
        }


        if (!removed) {

            this.showToast(
                "The participant could not be deleted.",
                "error"
            );

            return;
        }


        this.hideModal(
            "deleteParticipantModal"
        );


        this.activeParticipantId =
            null;


        this.updateBodyLock();


        if (
            typeof AdminDashboard !==
            "undefined" &&
            typeof AdminDashboard.refreshDashboard ===
            "function"
        ) {

            AdminDashboard.refreshDashboard();

        }


        this.showToast(
            `${
                participant?.childName ||
                "Participant"
            } deleted successfully.`,
            "success"
        );
    },


    /*=====================================
        CLOSE PARTICIPANT PROFILE
    ======================================*/

    closeViewModal(
        clearParticipantId = true
    ) {

        this.hideModal(
            "participantModal"
        );


        if (clearParticipantId) {

            this.activeParticipantId =
                null;

        }


        this.updateBodyLock();
    },


    /*=====================================
        CLOSE EDIT MODAL
    ======================================*/

    closeEditModal(
        returnToProfile = true
    ) {

        this.hideModal(
            "editParticipantModal"
        );


        this.clearFormError();


        if (
            returnToProfile &&
            this.activeParticipantId
        ) {

            const participant =
                ParticipantStore.getById(
                    this.activeParticipantId
                );


            if (participant) {

                this.populateViewModal(
                    participant
                );


                this.showModal(
                    "participantModal"
                );


                return;
            }
        }


        this.updateBodyLock();
    },


    /*=====================================
        CLOSE DELETE MODAL
    ======================================*/

    closeDeleteModal(
        returnToProfile = true
    ) {

        this.hideModal(
            "deleteParticipantModal"
        );


        if (
            returnToProfile &&
            this.activeParticipantId
        ) {

            const participant =
                ParticipantStore.getById(
                    this.activeParticipantId
                );


            if (participant) {

                this.populateViewModal(
                    participant
                );


                this.showModal(
                    "participantModal"
                );


                return;
            }
        }


        this.updateBodyLock();
    },


    /*=====================================
        PRINT PARTICIPANT PROFILE
    ======================================*/

    printParticipant() {

        if (
            !this.activeParticipantId
        ) {

            this.showToast(
                "No participant is currently selected.",
                "error"
            );

            return;
        }


        const participant =
            ParticipantStore.getById(
                this.activeParticipantId
            );


        if (!participant) {

            this.showToast(
                "Participant record was not found.",
                "error"
            );

            return;
        }


        const printWindow =
            window.open(
                "",
                "_blank",
                "width=900,height=720"
            );


        if (!printWindow) {

            this.showToast(
                "Please allow pop-ups to print the participant profile.",
                "error"
            );

            return;
        }


        const participantName =
            participant.childName ||
            "Participant";


        printWindow.document.write(`
            <!DOCTYPE html>

            <html lang="en">

            <head>

                <meta charset="UTF-8">

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                >

                <title>
                    ${this.escapeHTML(
                        participantName
                    )} - Participant Profile
                </title>

                <style>

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        padding: 40px;
                        color: #172554;
                        font-family: Arial, Helvetica, sans-serif;
                        background: #ffffff;
                    }

                    .print-card {
                        max-width: 760px;
                        margin: auto;
                        overflow: hidden;
                        border: 1px solid #dbeafe;
                        border-radius: 24px;
                    }

                    .print-header {
                        padding: 30px;
                        background: linear-gradient(
                            135deg,
                            #eff6ff,
                            #f5f3ff
                        );
                    }

                    .print-header h1 {
                        margin: 0 0 8px;
                        color: #172554;
                    }

                    .print-header p {
                        margin: 0;
                        color: #64748b;
                    }

                    .print-grid {
                        display: grid;
                        grid-template-columns:
                            repeat(2, 1fr);
                        gap: 14px;
                        padding: 30px;
                    }

                    .print-item {
                        padding: 16px;
                        border: 1px solid #e2e8f0;
                        border-radius: 14px;
                    }

                    .print-item span {
                        display: block;
                        margin-bottom: 7px;
                        color: #64748b;
                        font-size: 13px;
                    }

                    .print-item strong {
                        color: #172554;
                        font-size: 16px;
                    }

                    .print-footer {
                        padding: 20px 30px;
                        text-align: center;
                        color: #64748b;
                        background: #f8fafc;
                    }

                    @media print {

                        body {
                            padding: 0;
                        }

                        .print-card {
                            border-radius: 0;
                        }
                    }

                    @media max-width: 600px {

                        .print-grid {
                            grid-template-columns: 1fr;
                        }
                    }

                </style>

            </head>

            <body>

                <div class="print-card">

                    <div class="print-header">

                        <h1>
                            ${this.escapeHTML(
                                participantName
                            )}
                        </h1>

                        <p>
                            ${this.escapeHTML(
                                participant.parentEmail ||
                                "No parent email"
                            )}
                        </p>

                    </div>


                    <div class="print-grid">

                        ${this.printItem(
                            "Participant ID",
                            participant.id || "—"
                        )}

                        ${this.printItem(
                            "Age",
                            participant.age ?? "—"
                        )}

                        ${this.printItem(
                            "Group",
                            participant.group
                                ? `Group ${participant.group}`
                                : "—"
                        )}

                        ${this.printItem(
                            "Section 1",
                            this.formatScore(
                                participant.section1Score
                            )
                        )}

                        ${this.printItem(
                            "Section 2",
                            this.formatScore(
                                participant.section2Score
                            )
                        )}

                        ${this.printItem(
                            "Status",
                            this.getStatus(
                                participant
                            )
                        )}

                        ${this.printItem(
                            "Attendance",
                            participant.liveAttendance ||
                            "Not Marked"
                        )}

                        ${this.printItem(
                            "Live Score",
                            this.formatValue(
                                participant.liveScore
                            )
                        )}

                        ${this.printItem(
                            "Position",
                            this.formatValue(
                                participant.finalPosition
                            )
                        )}

                        ${this.printItem(
                            "Prize",
                            this.formatValue(
                                participant.prize
                            )
                        )}

                        ${this.printItem(
                            "Registration Date",
                            this.formatDate(
                                participant.registrationDate
                            )
                        )}

                        ${this.printItem(
                            "Last Updated",
                            this.formatDate(
                                participant.lastUpdated
                            )
                        )}

                    </div>


                    <div class="print-footer">
                        Kiddysexplorer Quiz Participant Profile
                    </div>

                </div>

            </body>

            </html>
        `);


        printWindow.document.close();


        printWindow.focus();


        setTimeout(() => {

            printWindow.print();

        }, 300);
    },


    /*=====================================
        CREATE PRINT DETAIL ITEM
    ======================================*/

    printItem(label, value) {

        return `
            <div class="print-item">

                <span>
                    ${this.escapeHTML(
                        label
                    )}
                </span>

                <strong>
                    ${this.escapeHTML(
                        value
                    )}
                </strong>

            </div>
        `;
    },


    /*=====================================
        SHOW MODAL
    ======================================*/

    showModal(modalId) {

        const modal =
            document.getElementById(
                modalId
            );


        if (!modal) {

            console.warn(
                `${modalId} was not found.`
            );

            return;
        }


        modal.classList.add(
            "modal-visible"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "admin-modal-open"
        );
    },


    /*=====================================
        HIDE MODAL
    ======================================*/

    hideModal(modalId) {

        const modal =
            document.getElementById(
                modalId
            );


        if (!modal) {

            return;
        }


        modal.classList.remove(
            "modal-visible"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );
    },


    /*=====================================
        UPDATE BODY SCROLL LOCK
    ======================================*/

    updateBodyLock() {

        const openModal =
            document.querySelector(
                ".admin-modal.modal-visible"
            );


        document.body.classList.toggle(
            "admin-modal-open",
            Boolean(openModal)
        );
    },


    /*=====================================
        CHECK WHETHER MODAL IS VISIBLE
    ======================================*/

    isVisible(modalId) {

        const modal =
            document.getElementById(
                modalId
            );


        return Boolean(
            modal &&
            modal.classList.contains(
                "modal-visible"
            )
        );
    },


    /*=====================================
        SHOW EDIT FORM ERROR
    ======================================*/

    showFormError(message) {

        const errorElement =
            document.getElementById(
                "editParticipantError"
            );


        if (!errorElement) {

            this.showToast(
                message,
                "error"
            );

            return;
        }


        errorElement.textContent =
            message;


        errorElement.hidden =
            false;


        errorElement.scrollIntoView({
            behavior:
                "smooth",

            block:
                "nearest"
        });
    },


    /*=====================================
        CLEAR EDIT FORM ERROR
    ======================================*/

    clearFormError() {

        const errorElement =
            document.getElementById(
                "editParticipantError"
            );


        if (!errorElement) {

            return;
        }


        errorElement.textContent =
            "";


        errorElement.hidden =
            true;
    },


    /*=====================================
        SHOW TOAST NOTIFICATION
    ======================================*/

    showToast(
        message,
        type = "success"
    ) {

        const container =
            document.getElementById(
                "adminToastContainer"
            );


        if (!container) {

            alert(message);

            return;
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            `admin-toast admin-toast-${type}`;


        const iconClass =
            type === "success"
                ? "fa-circle-check"
                : "fa-circle-exclamation";


        toast.innerHTML = `
            <i class="fas ${iconClass}"></i>

            <span>
                ${this.escapeHTML(
                    message
                )}
            </span>
        `;


        container.appendChild(
            toast
        );


        requestAnimationFrame(() => {

            toast.classList.add(
                "toast-visible"
            );

        });


        setTimeout(() => {

            toast.classList.remove(
                "toast-visible"
            );


            setTimeout(() => {

                toast.remove();

            }, 250);

        }, 3200);
    },


    /*=====================================
        DETERMINE PARTICIPANT STATUS
    ======================================*/

    getStatus(participant) {

        if (
            participant.status &&
            participant.status !==
            "undefined"
        ) {

            return participant.status;

        }


        if (
            participant.qualified === true
        ) {

            return "Qualified";

        }


        if (
            participant.section2Score !==
            null &&
            participant.section2Score !==
            undefined &&
            participant.section2Score !==
            ""
        ) {

            return Number(
                participant.section2Score
            ) >= 80
                ? "Qualified"
                : "Keep Learning";
        }


        if (
            participant.section1Score !==
            null &&
            participant.section1Score !==
            undefined &&
            participant.section1Score !==
            ""
        ) {

            return Number(
                participant.section1Score
            ) >= 80
                ? "Section 2 Pending"
                : "Keep Learning";
        }


        return "Registered";
    },


    /*=====================================
        STATUS CSS CLASS
    ======================================*/

    statusClass(status) {

        switch (status) {

            case "Qualified":

                return "qualified";


            case "Section 2 Pending":

                return "pending";


            case "Keep Learning":

                return "learning";


            default:

                return "registered";
        }
    },


    /*=====================================
        FORMAT QUIZ SCORE
    ======================================*/

    formatScore(score) {

        if (
            score === null ||
            score === undefined ||
            score === ""
        ) {

            return "—";

        }


        return `${score}%`;
    },


    /*=====================================
        FORMAT OPTIONAL VALUE
    ======================================*/

    formatValue(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "—";

        }


        return String(value);
    },


    /*=====================================
        FORMAT DATE
    ======================================*/

    formatDate(value) {

        if (!value) {

            return "—";

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(value);

        }


        return date.toLocaleDateString(
            "en-GB",
            {
                day:
                    "2-digit",

                month:
                    "long",

                year:
                    "numeric"
            }
        );
    },


    /*=====================================
        SET ELEMENT TEXT
    ======================================*/

    setText(elementId, value) {

        const element =
            document.getElementById(
                elementId
            );


        if (element) {

            element.textContent =
                value;

        }
    },


    /*=====================================
        SET FORM FIELD VALUE
    ======================================*/

    setValue(elementId, value) {

        const element =
            document.getElementById(
                elementId
            );


        if (element) {

            element.value =
                value;

        }
    },


    /*=====================================
        ADD CLICK EVENT
    ======================================*/

    onClick(elementId, handler) {

        const element =
            document.getElementById(
                elementId
            );


        if (element) {

            element.addEventListener(
                "click",
                handler
            );

        }
    },


    /*=====================================
        ESCAPE HTML
    ======================================*/

    escapeHTML(value) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }
};