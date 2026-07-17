/*=========================================
    KIDDYSEXPLORER ADMIN DASHBOARD
==========================================*/

const AdminDashboard = {

    participants: [],
    filteredParticipants: [],


    /*=====================================
        INITIALIZE DASHBOARD
    ======================================*/

    init() {
        if (
            typeof ParticipantStore === "undefined" ||
            typeof ParticipantStore.getAll !== "function"
        ) {
            console.error(
                "ParticipantStore is not loaded."
            );

            return;
        }

        this.loadParticipants();
        this.bindEvents();
        this.applyFilters();
    },


    /*=====================================
        LOAD PARTICIPANTS
    ======================================*/

    loadParticipants() {
        const storedParticipants =
            ParticipantStore.getAll();

        this.participants =
            Array.isArray(storedParticipants)
                ? storedParticipants
                : [];

        this.filteredParticipants = [
            ...this.participants
        ];
    },


    /*=====================================
        CONNECT DASHBOARD EVENTS
    ======================================*/

    bindEvents() {
        const searchInput =
            document.getElementById(
                "adminSearchInput"
            );

        const groupFilter =
            document.getElementById(
                "adminGroupFilter"
            );

        const statusFilter =
            document.getElementById(
                "adminStatusFilter"
            );

        const csvButton =
            document.getElementById(
                "exportCsvBtn"
            );

        const excelButton =
            document.getElementById(
                "exportExcelBtn"
            );

        const refreshButton =
            document.getElementById(
                "refreshAdminBtn"
            );


        if (searchInput) {
            searchInput.addEventListener(
                "input",
                () => {
                    this.applyFilters();
                }
            );
        }


        if (groupFilter) {
            groupFilter.addEventListener(
                "change",
                () => {
                    this.applyFilters();
                }
            );
        }


        if (statusFilter) {
            statusFilter.addEventListener(
                "change",
                () => {
                    this.applyFilters();
                }
            );
        }


        if (csvButton) {
            csvButton.addEventListener(
                "click",
                () => {
                    this.exportCSV();
                }
            );
        }


        if (excelButton) {
            excelButton.addEventListener(
                "click",
                () => {
                    this.exportExcel();
                }
            );
        }


        if (refreshButton) {
            refreshButton.addEventListener(
                "click",
                () => {
                    this.refreshDashboard();
                }
            );
        }


        document.addEventListener(
            "click",
            event => {

                const viewButton =
                    event.target.closest(
                        ".view-btn"
                    );

                if (viewButton) {
                    this.viewParticipant(
                        viewButton.dataset.id
                    );

                    return;
                }


                const deleteButton =
                    event.target.closest(
                        ".delete-btn"
                    );

                if (deleteButton) {
                    this.deleteParticipant(
                        deleteButton.dataset.id
                    );
                }
            }
        );
    },


    /*=====================================
        REFRESH DASHBOARD
    ======================================*/

    refreshDashboard() {
        this.loadParticipants();
        this.applyFilters();
    },


    /*=====================================
        APPLY SEARCH AND FILTERS
    ======================================*/

    applyFilters() {
        const searchInput =
            document.getElementById(
                "adminSearchInput"
            );

        const groupFilter =
            document.getElementById(
                "adminGroupFilter"
            );

        const statusFilter =
            document.getElementById(
                "adminStatusFilter"
            );


        const searchTerm =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";

        const selectedGroup =
            groupFilter
                ? groupFilter.value
                : "All";

        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "All";


        this.filteredParticipants =
            this.participants.filter(
                participant => {

                    const childName =
                        String(
                            participant.childName ||
                            ""
                        ).toLowerCase();

                    const parentEmail =
                        String(
                            participant.parentEmail ||
                            ""
                        ).toLowerCase();

                    const group =
                        String(
                            participant.group ||
                            ""
                        ).toUpperCase();

                    const status =
                        this.getParticipantStatus(
                            participant
                        );


                    const matchesSearch =
                        !searchTerm ||
                        childName.includes(
                            searchTerm
                        ) ||
                        parentEmail.includes(
                            searchTerm
                        );


                    const matchesGroup =
                        selectedGroup === "All" ||
                        selectedGroup === "" ||
                        group ===
                        selectedGroup.toUpperCase();


                    const matchesStatus =
                        selectedStatus === "All" ||
                        selectedStatus === "" ||
                        status === selectedStatus;


                    return (
                        matchesSearch &&
                        matchesGroup &&
                        matchesStatus
                    );
                }
            );


        this.renderTable();
        this.updateStatistics();
    },


    /*=====================================
        UPDATE STATISTICS
    ======================================*/

    updateStatistics() {
        const total =
            this.participants.length;

        const qualified =
            this.participants.filter(
                participant =>
                    this.getParticipantStatus(
                        participant
                    ) === "Qualified"
            ).length;

        const pending =
            this.participants.filter(
                participant =>
                    this.getParticipantStatus(
                        participant
                    ) ===
                    "Section 2 Pending"
            ).length;

        const learning =
            this.participants.filter(
                participant =>
                    this.getParticipantStatus(
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
    ======================================*/

    renderTable() {
        const tbody =
            document.getElementById(
                "participantTableBody"
            );

        const emptyState =
            document.getElementById(
                "adminEmptyState"
            );


        if (!tbody) {
            console.error(
                "participantTableBody was not found."
            );

            return;
        }


        tbody.innerHTML = "";


        if (
            this.filteredParticipants.length ===
            0
        ) {
            if (emptyState) {
                emptyState.style.display =
                    "flex";
            }

            return;
        }


        if (emptyState) {
            emptyState.style.display =
                "none";
        }


        this.filteredParticipants.forEach(
            (participant, index) => {

                const status =
                    this.getParticipantStatus(
                        participant
                    );

                const section1Score =
                    this.formatScore(
                        participant.section1Score
                    );

                const section2Score =
                    this.formatScore(
                        participant.section2Score
                    );

                const attendance =
                    participant.liveAttendance ||
                    "Not Marked";

                const liveScore =
                    this.formatOptionalValue(
                        participant.liveScore
                    );

                const position =
                    this.formatOptionalValue(
                        participant.finalPosition
                    );

                const prize =
                    this.formatOptionalValue(
                        participant.prize
                    );

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `
                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <div class="participant-info">

                            <strong>
                                ${this.escapeHTML(
                                    participant.childName ||
                                    "Unknown"
                                )}
                            </strong>

                            <small>
                                ${this.escapeHTML(
                                    participant.parentEmail ||
                                    ""
                                )}
                            </small>

                        </div>
                    </td>

                    <td>
                        ${this.escapeHTML(
                            participant.age ??
                            "—"
                        )}
                    </td>

                    <td>
                        ${this.escapeHTML(
                            participant.group ||
                            "—"
                        )}
                    </td>

                    <td>
                        ${section1Score}
                    </td>

                    <td>
                        ${section2Score}
                    </td>

                    <td>
                        <span
                            class="status-badge ${this.statusClass(
                                status
                            )}"
                        >
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
                        ${this.escapeHTML(
                            liveScore
                        )}
                    </td>

                    <td>
                        ${this.escapeHTML(
                            position
                        )}
                    </td>

                    <td>
                        ${this.escapeHTML(
                            prize
                        )}
                    </td>

                    <td>
                        <div class="table-actions">

                            <button
                                type="button"
                                class="view-btn"
                                data-id="${this.escapeHTML(
                                    participant.id ||
                                    ""
                                )}"
                            >
                                View
                            </button>

                            <button
                                type="button"
                                class="delete-btn"
                                data-id="${this.escapeHTML(
                                    participant.id ||
                                    ""
                                )}"
                            >
                                Delete
                            </button>

                        </div>
                    </td>
                `;


                tbody.appendChild(row);
            }
        );
    },


    /*=====================================
        DETERMINE PARTICIPANT STATUS
    ======================================*/

    getParticipantStatus(participant) {
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
            participant.section2Score !== null &&
            participant.section2Score !==
            undefined &&
            participant.section2Score !== ""
        ) {
            return Number(
                participant.section2Score
            ) >= 80
                ? "Qualified"
                : "Keep Learning";
        }


        if (
            participant.section1Score !== null &&
            participant.section1Score !==
            undefined &&
            participant.section1Score !== ""
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
        FORMAT SCORE
    ======================================*/

    formatScore(score) {
        if (
            score === null ||
            score === undefined ||
            score === ""
        ) {
            return "—";
        }

        return (
            this.escapeHTML(score) +
            "%"
        );
    },


    /*=====================================
        FORMAT OPTIONAL VALUE
    ======================================*/

    formatOptionalValue(value) {
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
        VIEW PARTICIPANT
    ======================================*/

    viewParticipant(participantId) {
        if (
            typeof AdminParticipants !==
            "undefined" &&
            typeof AdminParticipants.openParticipant ===
            "function"
        ) {
            AdminParticipants.openParticipant(
                participantId
            );

            return;
        }

        console.error(
            "AdminParticipants is not loaded."
        );

        alert(
            "Participant profile could not open because adminParticipants.js is not loaded."
        );
    },


    /*=====================================
        DELETE PARTICIPANT
    ======================================*/

    deleteParticipant(participantId) {
        const participant =
            this.participants.find(
                item =>
                    String(item.id) ===
                    String(participantId)
            );

        if (!participant) {
            return;
        }


        if (
            typeof AdminParticipants !==
            "undefined" &&
            typeof AdminParticipants.openParticipant ===
            "function"
        ) {
            AdminParticipants.openParticipant(
                participantId
            );

            if (
                typeof AdminParticipants.requestDelete ===
                "function"
            ) {
                AdminParticipants.requestDelete();
            }

            return;
        }


        const confirmed =
            confirm(
                `Delete ${participant.childName}'s record?`
            );


        if (!confirmed) {
            return;
        }


        const removed =
            ParticipantStore.remove(
                participantId
            );


        if (!removed) {
            alert(
                "The participant could not be deleted."
            );

            return;
        }


        this.refreshDashboard();
    },


    /*=====================================
        EXPORT CSV
    ======================================*/

    exportCSV() {
        if (
            this.filteredParticipants.length ===
            0
        ) {
            alert(
                "There are no participants to export."
            );

            return;
        }


        const headers = [
            "Participant",
            "Age",
            "Group",
            "Parent Email",
            "Section 1",
            "Section 2",
            "Status",
            "Attendance",
            "Live Score",
            "Position",
            "Prize"
        ];


        const rows =
            this.filteredParticipants.map(
                participant => [
                    participant.childName ||
                    "",
                    participant.age ?? "",
                    participant.group || "",
                    participant.parentEmail ||
                    "",
                    participant.section1Score ??
                    "",
                    participant.section2Score ??
                    "",
                    this.getParticipantStatus(
                        participant
                    ),
                    participant.liveAttendance ||
                    "",
                    participant.liveScore ??
                    "",
                    participant.finalPosition ??
                    "",
                    participant.prize ?? ""
                ]
            );


        const csvContent =
            [headers, ...rows]
                .map(row =>
                    row
                        .map(value =>
                            this.csvEscape(
                                value
                            )
                        )
                        .join(",")
                )
                .join("\n");


        this.downloadFile(
            "\uFEFF" + csvContent,
            "kiddysexplorer-participants.csv",
            "text/csv;charset=utf-8;"
        );
    },


    /*=====================================
        EXPORT EXCEL
    ======================================*/

    exportExcel() {
        if (
            this.filteredParticipants.length ===
            0
        ) {
            alert(
                "There are no participants to export."
            );

            return;
        }


        if (
            typeof XLSX === "undefined"
        ) {
            alert(
                "The Excel library is not loaded."
            );

            return;
        }


        const exportData =
            this.filteredParticipants.map(
                participant => ({
                    Participant:
                        participant.childName ||
                        "",

                    Age:
                        participant.age ??
                        "",

                    Group:
                        participant.group ||
                        "",

                    "Parent Email":
                        participant.parentEmail ||
                        "",

                    "Section 1":
                        participant.section1Score ??
                        "",

                    "Section 2":
                        participant.section2Score ??
                        "",

                    Status:
                        this.getParticipantStatus(
                            participant
                        ),

                    Attendance:
                        participant.liveAttendance ||
                        "",

                    "Live Score":
                        participant.liveScore ??
                        "",

                    Position:
                        participant.finalPosition ??
                        "",

                    Prize:
                        participant.prize ??
                        ""
                })
            );


        const worksheet =
            XLSX.utils.json_to_sheet(
                exportData
            );

        const workbook =
            XLSX.utils.book_new();


        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Participants"
        );


        XLSX.writeFile(
            workbook,
            "kiddysexplorer-participants.xlsx"
        );
    },


    /*=====================================
        DOWNLOAD FILE
    ======================================*/

    downloadFile(
        content,
        filename,
        mimeType
    ) {
        const blob =
            new Blob(
                [content],
                {
                    type: mimeType
                }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);

        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    },


    /*=====================================
        CSV ESCAPE
    ======================================*/

    csvEscape(value) {
        const stringValue =
            String(value ?? "");

        return (
            '"' +
            stringValue.replace(
                /"/g,
                '""'
            ) +
            '"'
        );
    },


    /*=====================================
        SET TEXT SAFELY
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
        ESCAPE HTML
    ======================================*/

    escapeHTML(value) {
        return String(value ?? "")
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


/*=========================================
    START ADMIN DASHBOARD
==========================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {
        AdminDashboard.init();

        if (
            typeof AdminParticipants !==
            "undefined" &&
            typeof AdminParticipants.init ===
            "function"
        ) {
            AdminParticipants.init();
        }
    }
);