/*=========================================
    KIDDYSEXPLORER ADMIN PARTICIPANTS
==========================================*/

const AdminParticipants = {

    activeParticipantId: null,

    eventsBound: false,


    /*=====================================
        INITIALIZE PARTICIPANTS PAGE
    ======================================*/

    init() {

        if (
            typeof ParticipantStore ===
            "undefined"
        ) {

            console.error(
                "ParticipantStore is not loaded. Load participantStore.js before adminParticipants.js."
            );

            return;

        }


        if (!this.eventsBound) {

            this.bindEvents();

            this.eventsBound = true;

        }


        this.refreshParticipantPage();

    },


    /*=====================================
        LOAD PARTICIPANTS
    ======================================*/

    loadParticipants() {

        if (
            typeof ParticipantStore ===
            "undefined"
        ) {

            return [];

        }


        const participants =
            ParticipantStore.getAll();


        return Array.isArray(participants)
            ? participants
            : [];

    },


    /*=====================================
    REFRESH PARTICIPANTS PAGE
=====================================*/

    refreshParticipantPage() {

        const participants =
            this.loadParticipants();


        this.updateStatistics(
            participants
        );


        const filteredParticipants =
            this.filterParticipants(
                participants
            );


        this.renderParticipantTable(
            filteredParticipants
        );

    },

    /*=====================================
    FILTER PARTICIPANTS
=====================================*/

    filterParticipants(participants) {

        const records =
            Array.isArray(participants)
                ? participants
                : [];


        /*---------------------------------
            SEARCH VALUE
        ---------------------------------*/

        const searchInput =
            document.getElementById(
                "adminSearchInput"
            );


        const searchTerm =
            String(
                searchInput?.value || ""
            )
                .trim()
                .toLowerCase();


        /*---------------------------------
            GROUP VALUE
        ---------------------------------*/

        const groupFilter =
            document.getElementById(
                "adminGroupFilter"
            );


        const selectedGroup =
            String(
                groupFilter?.value || ""
            )
                .trim()
                .toUpperCase();


        /*---------------------------------
            STATUS VALUE
        ---------------------------------*/

        const statusFilter =
            document.getElementById(
                "adminStatusFilter"
            );


        const selectedStatus =
            String(
                statusFilter?.value || ""
            )
                .trim()
                .toLowerCase();


        /*---------------------------------
            APPLY FILTERS
        ---------------------------------*/

        return records.filter(
            participant => {

                const childName =
                    String(
                        participant.childName ||
                        participant.name ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                const parentEmail =
                    String(
                        participant.parentEmail ||
                        participant.email ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                const participantGroup =
                    String(
                        participant.group || ""
                    )
                        .trim()
                        .toUpperCase();


                const participantStatus =
                    String(
                        this.getStatus(
                            participant
                        )
                    )
                        .trim()
                        .toLowerCase();


                /* SEARCH */

                const matchesSearch =
                    !searchTerm ||
                    childName.includes(
                        searchTerm
                    ) ||
                    parentEmail.includes(
                        searchTerm
                    );


                /* GROUP */

                const matchesGroup =
                    !selectedGroup ||
                    selectedGroup === "ALL" ||
                    participantGroup ===
                    selectedGroup;


                /* STATUS */

                const matchesStatus =
                    !selectedStatus ||
                    selectedStatus === "all" ||
                    participantStatus ===
                    selectedStatus;


                return (
                    matchesSearch &&
                    matchesGroup &&
                    matchesStatus
                );

            }
        );

    },
    /*=====================================
        FILTER PARTICIPANTS
    =====================================*

    filterParticipants(participants) {

        const records =
            Array.isArray(participants)
                ? participants
                : [];


        const searchInput =
            document.getElementById(
                "adminSearchInput"
            );


        const searchTerm =
            String(
                searchInput?.value || ""
            )
                .trim()
                .toLowerCase();


        if (!searchTerm) {

            return records;

        }


        return records.filter(
            participant => {

                const childName =
                    String(
                        participant.childName ||
                        participant.name ||
                        ""
                    )
                        .toLowerCase();


                const parentEmail =
                    String(
                        participant.parentEmail ||
                        participant.email ||
                        ""
                    )
                        .toLowerCase();


                return (
                    childName.includes(
                        searchTerm
                    ) ||
                    parentEmail.includes(
                        searchTerm
                    )
                );

            }
        );

    },


    /*=====================================
        UPDATE STATISTICS
    ======================================*/

    updateStatistics(participants) {

        const records =
            Array.isArray(participants)
                ? participants
                : [];


        const total =
            records.length;


        const qualified =
            records.filter(
                participant =>
                    this.getStatus(
                        participant
                    ) === "Qualified"
            ).length;


        const pending =
            records.filter(
                participant =>
                    this.getStatus(
                        participant
                    ) ===
                    "Section 2 Pending"
            ).length;


        const learning =
            records.filter(
                participant =>
                    this.getStatus(
                        participant
                    ) ===
                    "Keep Learning"
            ).length;


        this.setText(
            "totalParticipants",
            total
        );


        this.setText(
            "qualifiedParticipants",
            qualified
        );


        this.setText(
            "pendingParticipants",
            pending
        );


        this.setText(
            "keepLearningParticipants",
            learning
        );

    },

    /*=====================================
    RENDER PARTICIPANT TABLE
=====================================*/

    renderParticipantTable(participants) {

        const tableBody =
            document.getElementById(
                "participantTableBody"
            );


        const emptyState =
            document.getElementById(
                "adminEmptyState"
            );


        if (!tableBody) {

            console.error(
                "Participant table body was not found."
            );

            return;

        }


        const records =
            Array.isArray(participants)
                ? participants
                : [];


        tableBody.innerHTML = "";


        if (records.length === 0) {

            if (emptyState) {

                emptyState.style.display =
                    "block";

            }


            return;

        }


        if (emptyState) {

            emptyState.style.display =
                "none";

        }


        const fragment =
            document.createDocumentFragment();


        records.forEach(
            (participant, index) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML =
                    this.buildParticipantRow(
                        participant,
                        index
                    );


                fragment.appendChild(
                    row
                );

            }
        );


        tableBody.appendChild(
            fragment
        );

    },




    /*=====================================
        BUILD PARTICIPANT TABLE ROW
    =====================================*/

    buildParticipantRow(
        participant,
        index
    ) {

        const status =
            this.getStatus(
                participant
            );


        const childName =
            this.escapeHTML(
                participant.childName ||
                participant.name ||
                "Unknown Participant"
            );


        const parentEmail =
            this.escapeHTML(
                participant.parentEmail ||
                participant.email ||
                "No parent email"
            );


        const age =
            this.escapeHTML(
                participant.age ?? "—"
            );


        const group =
            this.escapeHTML(
                participant.group || "—"
            );


        const participantId =
            this.escapeHTML(
                participant.id || ""
            );


        const attendance =
            this.getAttendanceText(
                participant.liveAttendance
            );


        const liveScore =
            participant.liveScore ??
            participant.competitionScore;


        const position =
            participant.finalPosition ??
            participant.position;


        const prize =
            participant.prize ??
            participant.prizeName;


        return `

        <td>
            ${index + 1}
        </td>


        <td>
            <div class="participant-table-profile">

                <strong>
                    ${childName}
                </strong>

                <span>
                    ${parentEmail}
                </span>

            </div>
        </td>


        <td>
            ${age}
        </td>


        <td>
            <span class="group-badge">
                Group ${group}
            </span>
        </td>


        <td>
            ${this.formatScore(
            participant.section1Score
        )}
        </td>


        <td>
            ${this.formatScore(
            participant.section2Score
        )}
        </td>


        <td>
            <span class="status-badge ${this.statusClass(
            status
        )}">
                ${this.escapeHTML(
            status
        )}
            </span>
        </td>


        <td>
            ${this.escapeHTML(
            attendance
        )}
        </td>


        <td>
            ${this.formatScore(
            liveScore
        )}
        </td>


        <td>
            ${this.escapeHTML(
            this.formatValue(
                position
            )
        )}
        </td>


        <td>
            ${this.escapeHTML(
            this.formatValue(
                prize
            )
        )}
        </td>


        <td>
            <div class="table-actions">

                <button
                    class="icon-btn"
                    type="button"
                    data-action="view"
                    data-id="${participantId}"
                    title="View participant"
                    aria-label="View ${childName}"
                >
                    <i class="fas fa-eye"></i>
                </button>


                <button
                    class="icon-btn"
                    type="button"
                    data-action="edit"
                    data-id="${participantId}"
                    title="Edit participant"
                    aria-label="Edit ${childName}"
                >
                    <i class="fas fa-pen"></i>
                </button>


                <button
                    class="icon-btn danger"
                    type="button"
                    data-action="delete"
                    data-id="${participantId}"
                    title="Delete participant"
                    aria-label="Delete ${childName}"
                >
                    <i class="fas fa-trash"></i>
                </button>

            </div>
        </td>

    `;

    },

    /*=====================================
        PARTICIPANT STATUS CLASS
    =====================================*/

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
        FORMAT ATTENDANCE
    =====================================*/

    getAttendanceText(value) {

        const attendance =
            String(value ?? "")
                .trim()
                .toLowerCase();


        if (
            value === true ||
            attendance === "present"
        ) {

            return "Present";

        }


        if (
            value === false ||
            attendance === "absent"
        ) {

            return "Absent";

        }


        return "Not Marked";

    },


    /*=====================================
        FORMAT SCORE
    =====================================*/

    formatScore(value) {

        const score =
            this.parseScore(value);


        if (score === null) {

            return "—";

        }


        return `${score}%`;

    },


    /*=====================================
        FORMAT GENERAL VALUE
    =====================================*/

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
        ESCAPE HTML
    =====================================*/

    escapeHTML(value) {

        return String(value ?? "")

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    },

    /*=====================================
        CONNECT BASIC EVENTS
    =====================================*/

    bindEvents() {

        /*---------------------------------
            REFRESH BUTTON
        ---------------------------------*/

        const refreshButton =
            document.getElementById(
                "refreshAdminBtn"
            );


        refreshButton?.addEventListener(
            "click",
            () => {

                this.refreshParticipantPage();

            }
        );


        /*---------------------------------
            SEARCH PARTICIPANTS
        ---------------------------------*/

        const searchInput =
            document.getElementById(
                "adminSearchInput"
            );


        searchInput?.addEventListener(
            "input",
            () => {

                this.refreshParticipantPage();

            }
        );

        /*---------------------------------
        GROUP FILTER
    ---------------------------------*/

        const groupFilter =
            document.getElementById(
                "adminGroupFilter"
            );


        groupFilter?.addEventListener(
            "change",
            () => {

                this.refreshParticipantPage();

            }
        );

        /*---------------------------------
    STATUS FILTER
---------------------------------*/

        const statusFilter =
            document.getElementById(
                "adminStatusFilter"
            );


        statusFilter?.addEventListener(
            "change",
            () => {

                this.refreshParticipantPage();

            }
        );

        /*---------------------------------
    EXPORT CSV
---------------------------------*/

        const exportCsvBtn =
            document.getElementById(
                "exportCsvBtn"
            );


        exportCsvBtn?.addEventListener(
            "click",
            () => {

                this.exportParticipantsCSV();

            }
        );

        /*---------------------------------
    EXPORT EXCEL
---------------------------------*/

        const exportExcelBtn =
            document.getElementById(
                "exportExcelBtn"
            );


        exportExcelBtn?.addEventListener(
            "click",
            () => {

                this.exportParticipantsExcel();

            }
        );


        /*---------------------------------
            PARTICIPANT DATA CHANGES
        ---------------------------------*/

        window.addEventListener(
            "participants-changed",
            () => {

                this.refreshParticipantPage();

            }
        );


        window.addEventListener(
            "kiddysexplorer:participants-changed",
            () => {

                this.refreshParticipantPage();

            }
        );


        window.addEventListener(
            "storage",
            event => {

                if (
                    event.key ===
                    ParticipantStore.storageKey
                ) {

                    this.refreshParticipantPage();

                }

            }
        );


        window.addEventListener(
            "focus",
            () => {

                this.refreshParticipantPage();

            }
        );


        /*---------------------------------
            PARTICIPANT TABLE ACTIONS
        ---------------------------------*/

        const tableBody =
            document.getElementById(
                "participantTableBody"
            );


        tableBody?.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );


                if (!button) {

                    return;

                }


                const participantId =
                    button.dataset.id;


                const action =
                    button.dataset.action;


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


                switch (action) {

                    case "view":

                        this.openParticipant(
                            participant.id
                        );

                        break;


                    case "edit":

                        this.openEditParticipant(
                            participant.id
                        );

                        break;


                    case "delete":

                        this.openDeleteParticipant(
                            participant.id
                        );

                        break;

                }

            }
        );


        /*---------------------------------
            VIEW PARTICIPANT MODAL
        ---------------------------------*/

        const closeParticipantModalBtn =
            document.getElementById(
                "closeParticipantModalBtn"
            );


        const closeParticipantFooterBtn =
            document.getElementById(
                "closeParticipantFooterBtn"
            );


        closeParticipantModalBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closeParticipantModal();

                }
            );


        closeParticipantFooterBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closeParticipantModal();

                }
            );


        document
            .querySelectorAll(
                "[data-close-participant-modal]"
            )
            .forEach(
                overlay => {

                    overlay.addEventListener(
                        "click",
                        () => {

                            this.closeParticipantModal();

                        }
                    );

                }
            );


        /*---------------------------------
            EDIT PARTICIPANT FORM
        ---------------------------------*/

        const editParticipantForm =
            document.getElementById(
                "editParticipantForm"
            );


        editParticipantForm
            ?.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    this.saveParticipantChanges();

                }
            );


        /*---------------------------------
            DELETE PARTICIPANT MODAL
        ---------------------------------*/

        const cancelDeleteParticipantBtn =
            document.getElementById(
                "cancelDeleteParticipantBtn"
            );


        const confirmDeleteParticipantBtn =
            document.getElementById(
                "confirmDeleteParticipantBtn"
            );


        const deleteModalOverlay =
            document.querySelector(
                "#deleteParticipantModal [data-close-delete-modal]"
            );


        cancelDeleteParticipantBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closeDeleteParticipant();

                }
            );


        confirmDeleteParticipantBtn
            ?.addEventListener(
                "click",
                () => {

                    this.confirmDeleteParticipant();

                }
            );


        deleteModalOverlay
            ?.addEventListener(
                "click",
                () => {

                    this.closeDeleteParticipant();

                }
            );


        /*---------------------------------
            ESCAPE KEY
        ---------------------------------*/

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Escape"
                ) {

                    return;

                }


                if (
                    this.isModalVisible(
                        "deleteParticipantModal"
                    )
                ) {

                    this.closeDeleteParticipant();

                    return;

                }


                if (
                    this.isModalVisible(
                        "participantModal"
                    )
                ) {

                    this.closeParticipantModal();

                }

            }
        );

    },/*=====================================
    DETERMINE PARTICIPANT STATUS
=====================================*/

    getStatus(participant) {

        if (!participant) {

            return "Registered";

        }


        const storedStatus =
            String(
                participant.status || ""
            )
                .trim()
                .toLowerCase();


        if (
            participant.qualified === true ||
            participant.qualified === "true" ||
            storedStatus === "qualified"
        ) {

            return "Qualified";

        }


        const section2Score =
            this.parseScore(
                participant.section2Score
            );


        if (
            section2Score !== null &&
            section2Score >= 80
        ) {

            return "Qualified";

        }


        if (section2Score !== null) {

            return "Keep Learning";

        }


        const section1Score =
            this.parseScore(
                participant.section1Score
            );


        if (
            section1Score !== null &&
            section1Score >= 80
        ) {

            return "Section 2 Pending";

        }


        if (section1Score !== null) {

            return "Keep Learning";

        }


        return "Registered";

    },
    /*=====================================
    OPEN PARTICIPANT PROFILE
=====================================*/

    openParticipant(participantId) {

        const participant =
            ParticipantStore.getById(
                participantId
            );


        if (!participant) {

            console.error(
                "Participant record was not found."
            );

            return;

        }


        this.activeParticipantId =
            participant.id;


        this.populateParticipantModal(
            participant
        );


        this.showModal(
            "participantModal"
        );

    },


    /*=====================================
        POPULATE PARTICIPANT MODAL
    =====================================*/

    populateParticipantModal(participant) {

        const status =
            this.getStatus(
                participant
            );


        this.setText(
            "modalParticipantName",
            participant.childName ||
            participant.name ||
            "Unknown Participant"
        );


        this.setText(
            "modalParticipantEmail",
            participant.parentEmail ||
            participant.email ||
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
            this.getAttendanceText(
                participant.liveAttendance
            )
        );


        this.setText(
            "modalLiveScore",
            this.formatScore(
                participant.liveScore ??
                participant.competitionScore
            )
        );


        this.setText(
            "modalPosition",
            this.formatValue(
                participant.finalPosition ??
                participant.position
            )
        );


        this.setText(
            "modalPrize",
            this.formatValue(
                participant.prize ??
                participant.prizeName
            )
        );


        this.setText(
            "modalRegistrationDate",
            this.formatDate(
                participant.registrationDate ??
                participant.createdAt
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
        CLOSE PARTICIPANT MODAL
    =====================================*/

    closeParticipantModal() {

        this.hideModal(
            "participantModal"
        );


        this.activeParticipantId =
            null;

    },

    /*=====================================
    OPEN EDIT PARTICIPANT
=====================================*/

    openEditParticipant(participantId) {

        const participant =
            ParticipantStore.getById(
                participantId
            );

        if (!participant) {

            console.error(
                "Participant not found."
            );

            return;

        }

        this.activeParticipantId =
            participant.id;

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
            participant.age || ""
        );

        this.setValue(
            "editGroup",
            participant.group || ""
        );

        this.setValue(
            "editParentEmail",
            participant.parentEmail || ""
        );

        this.hideModal(
            "participantModal"
        );

        this.showModal(
            "editParticipantModal"
        );

    },

    /*=====================================
        SAVE PARTICIPANT CHANGES
    =====================================*/
    /*=====================================
        SAVE PARTICIPANT CHANGES
    =====================================*/

    saveParticipantChanges() {

        if (!this.activeParticipantId) {

            this.showToast(
                "No participant is selected.",
                "error"
            );

            return;

        }


        const childName =
            document.getElementById(
                "editChildName"
            )?.value
                .trim();


        const age =
            Number(
                document.getElementById(
                    "editAge"
                )?.value
            );


        const group =
            String(
                document.getElementById(
                    "editGroup"
                )?.value || ""
            )
                .trim()
                .toUpperCase();


        const parentEmail =
            String(
                document.getElementById(
                    "editParentEmail"
                )?.value || ""
            )
                .trim()
                .toLowerCase();


        if (!childName) {

            this.showToast(
                "Please enter the child's name.",
                "error"
            );

            return;

        }


        if (
            !Number.isInteger(age) ||
            age < 3 ||
            age > 12
        ) {

            this.showToast(
                "Age must be between 3 and 12.",
                "error"
            );

            return;

        }


        if (
            !["A", "B", "C"].includes(
                group
            )
        ) {

            this.showToast(
                "Please select Group A, B or C.",
                "error"
            );

            return;

        }


        if (
            typeof ParticipantStore.isValidEmail ===
            "function" &&
            !ParticipantStore.isValidEmail(
                parentEmail
            )
        ) {

            this.showToast(
                "Please enter a valid parent email address.",
                "error"
            );

            return;

        }


        const updatedParticipant =
            ParticipantStore.update(
                this.activeParticipantId,
                {

                    childName,

                    age,

                    group,

                    parentEmail

                }
            );


        if (!updatedParticipant) {

            this.showToast(
                "Unable to save participant. Please check the details and try again.",
                "error"
            );

            return;

        }


        this.hideModal(
            "editParticipantModal"
        );


        this.activeParticipantId =
            updatedParticipant.id;


        this.refreshParticipantPage();


        window.dispatchEvent(
            new CustomEvent(
                "kiddysexplorer:participants-changed"
            )
        );


        this.showToast(
            "Participant updated successfully.",
            "success"
        );

    },

    /*=====================================
        OPEN DELETE PARTICIPANT MODAL
    =====================================*/

    openDeleteParticipant(participantId) {

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


        this.setText(
            "deleteParticipantName",
            participant.childName ||
            participant.name ||
            "this participant"
        );


        this.showModal(
            "deleteParticipantModal"
        );

    },


    /*=====================================
        CLOSE DELETE PARTICIPANT MODAL
    =====================================*/

    closeDeleteParticipant() {

        this.hideModal(
            "deleteParticipantModal"
        );


        this.activeParticipantId =
            null;

    },


    /*=====================================
        CONFIRM DELETE PARTICIPANT
    =====================================*/

    confirmDeleteParticipant() {

        if (!this.activeParticipantId) {

            this.showToast(
                "No participant is selected.",
                "error"
            );

            return;

        }


        const participant =
            ParticipantStore.getById(
                this.activeParticipantId
            );


        if (!participant) {

            this.hideModal(
                "deleteParticipantModal"
            );


            this.activeParticipantId =
                null;


            this.showToast(
                "Participant record was not found.",
                "error"
            );

            return;

        }


        const participantName =
            participant.childName ||
            participant.name ||
            "Participant";


        const removed =
            ParticipantStore.remove(
                participant.id
            );


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


        this.refreshParticipantPage();


        window.dispatchEvent(
            new CustomEvent(
                "kiddysexplorer:participants-changed"
            )
        );


        this.showToast(
            `${participantName} deleted successfully.`,
            "success"
        );

    },

    /*=====================================
    EXPORT PARTICIPANTS CSV
=====================================*/

    exportParticipantsCSV() {

        const participants =
            this.loadParticipants();


        const filteredParticipants =
            this.filterParticipants(
                participants
            );


        if (
            filteredParticipants.length === 0
        ) {

            this.showToast(
                "There are no participants to export.",
                "error"
            );

            return;

        }


        const headers = [

            "Participant ID",

            "Child Name",

            "Parent Email",

            "Age",

            "Group",

            "Section 1 Score",

            "Section 2 Score",

            "Status",

            "Attendance",

            "Live Score",

            "Final Position",

            "Prize",

            "Registration Date"

        ];


        const rows =
            filteredParticipants.map(
                participant => [

                    participant.id || "",

                    participant.childName ||
                    participant.name ||
                    "",

                    participant.parentEmail ||
                    participant.email ||
                    "",

                    participant.age ?? "",

                    participant.group || "",

                    this.formatCSVScore(
                        participant.section1Score
                    ),

                    this.formatCSVScore(
                        participant.section2Score
                    ),

                    this.getStatus(
                        participant
                    ),

                    this.getAttendanceText(
                        participant.liveAttendance
                    ),

                    this.formatCSVScore(
                        participant.liveScore ??
                        participant.competitionScore
                    ),

                    participant.finalPosition ??
                    participant.position ??
                    "",

                    participant.prize ??
                    participant.prizeName ??
                    "",

                    this.formatDate(
                        participant.registrationDate ??
                        participant.createdAt
                    )

                ]
            );


        const csvRows = [

            headers,

            ...rows

        ];


        const csv =
            csvRows
                .map(
                    row =>
                        row
                            .map(
                                value =>
                                    this.escapeCSVValue(
                                        value
                                    )
                            )
                            .join(",")
                )
                .join("\r\n");


        const blob =
            new Blob(
                [
                    "\uFEFF",
                    csv
                ],
                {
                    type:
                        "text/csv;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        const date =
            new Date()
                .toISOString()
                .slice(
                    0,
                    10
                );


        link.href =
            url;


        link.download =
            `kiddysexplorer-participants-${date}.csv`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        window.setTimeout(
            () => {

                URL.revokeObjectURL(
                    url
                );

            },
            1000
        );


        this.showToast(
            `${filteredParticipants.length} participant record(s) exported successfully.`,
            "success"
        );

    },

    /*=====================================
    FORMAT SCORE FOR CSV
=====================================*/

    formatCSVScore(value) {

        const score =
            this.parseScore(
                value
            );


        return score === null
            ? ""
            : score;

    },


    /*=====================================
        ESCAPE CSV VALUE
    =====================================*/

    escapeCSVValue(value) {

        const text =
            String(
                value ?? ""
            );


        return `"${text.replace(
            /"/g,
            '""'
        )}"`;

    },

    /*=====================================
    EXPORT PARTICIPANTS EXCEL
=====================================*/

    exportParticipantsExcel() {

        if (
            typeof XLSX ===
            "undefined"
        ) {

            this.showToast(
                "Excel export library is not available.",
                "error"
            );

            return;

        }


        const participants =
            this.loadParticipants();


        const filteredParticipants =
            this.filterParticipants(
                participants
            );


        if (
            filteredParticipants.length === 0
        ) {

            this.showToast(
                "There are no participants to export.",
                "error"
            );

            return;

        }


        const excelRows =
            filteredParticipants.map(
                participant => {

                    return {

                        "Participant ID":
                            participant.id || "",

                        "Child Name":
                            participant.childName ||
                            participant.name ||
                            "",

                        "Parent Email":
                            participant.parentEmail ||
                            participant.email ||
                            "",

                        "Age":
                            participant.age ?? "",

                        "Group":
                            participant.group || "",

                        "Section 1 Score":
                            this.formatExcelScore(
                                participant.section1Score
                            ),

                        "Section 2 Score":
                            this.formatExcelScore(
                                participant.section2Score
                            ),

                        "Status":
                            this.getStatus(
                                participant
                            ),

                        "Attendance":
                            this.getAttendanceText(
                                participant.liveAttendance
                            ),

                        "Live Score":
                            this.formatExcelScore(
                                participant.liveScore ??
                                participant.competitionScore
                            ),

                        "Final Position":
                            participant.finalPosition ??
                            participant.position ??
                            "",

                        "Prize":
                            participant.prize ??
                            participant.prizeName ??
                            "",

                        "Registration Date":
                            this.formatDate(
                                participant.registrationDate ??
                                participant.createdAt
                            )

                    };

                }
            );


        const worksheet =
            XLSX.utils.json_to_sheet(
                excelRows
            );


        worksheet["!cols"] = [

            { wch: 26 },

            { wch: 24 },

            { wch: 32 },

            { wch: 8 },

            { wch: 10 },

            { wch: 18 },

            { wch: 18 },

            { wch: 22 },

            { wch: 16 },

            { wch: 14 },

            { wch: 16 },

            { wch: 22 },

            { wch: 22 }

        ];


        const workbook =
            XLSX.utils.book_new();


        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Participants"
        );


        const date =
            new Date()
                .toISOString()
                .slice(
                    0,
                    10
                );


        const filename =
            `kiddysexplorer-participants-${date}.xlsx`;


        XLSX.writeFile(
            workbook,
            filename
        );


        this.showToast(
            `${filteredParticipants.length} participant record(s) exported to Excel successfully.`,
            "success"
        );

    },

    /*=====================================
    FORMAT SCORE FOR EXCEL
=====================================*/

    formatExcelScore(value) {

        const score =
            this.parseScore(
                value
            );


        return score === null
            ? ""
            : score;

    },


    /*=====================================
        SHOW MODAL
    =====================================*/

    showModal(modalId) {

        const modal =
            document.getElementById(
                modalId
            );


        if (!modal) {

            console.error(
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
    =====================================*/

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


        document.body.classList.remove(
            "admin-modal-open"
        );

    },


    /*=====================================
        CHECK MODAL VISIBILITY
    =====================================*/

    isModalVisible(modalId) {

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
        FORMAT DATE
    =====================================*/

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
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    },


    /*=====================================
        PARSE QUIZ SCORE
    ======================================*/

    parseScore(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return null;

        }


        const cleanedValue =
            String(value)
                .replace("%", "")
                .trim();


        const score =
            Number(cleanedValue);


        return Number.isFinite(score)
            ? score
            : null;

    },

    /*=====================================
    TOAST MESSAGE
=====================================*/

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


        toast.innerHTML =
            `<span>${message}</span>`;


        container.appendChild(
            toast
        );


        requestAnimationFrame(
            () => {

                toast.classList.add(
                    "toast-visible"
                );

            }
        );


        setTimeout(
            () => {

                toast.classList.remove(
                    "toast-visible"
                );


                setTimeout(
                    () => {

                        toast.remove();

                    },

                    300

                );

            },

            3000

        );

    },
    /*=====================================
        SET FORM ELEMENT VALUE
    =====================================*/

    setValue(
        elementId,
        value
    ) {

        const element =
            document.getElementById(
                elementId
            );


        if (element) {

            element.value =
                value ?? "";

        }

    },


    /*=====================================
        SET ELEMENT TEXT
    ======================================*/

    setText(
        elementId,
        value
    ) {

        const element =
            document.getElementById(
                elementId
            );


        if (element) {

            element.textContent =
                String(value);

        }

    }

};


/*=========================================
    START PARTICIPANTS PAGE
==========================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        AdminParticipants.init();

    }
);