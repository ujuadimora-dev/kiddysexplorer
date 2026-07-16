/*=========================================
    KIDDYSEXPLORER ADMIN DASHBOARD
==========================================*/

const AdminDashboard = {

    participants: [],
    filteredParticipants: [],


    /*=====================================
            START DASHBOARD
    ======================================*/

    init() {
        this.loadParticipants();
        this.bindEvents();
        this.renderDashboard();
    },


    /*=====================================
        LOAD PARTICIPANTS FROM STORAGE
    ======================================*/

    loadParticipants() {
        if (
            typeof ParticipantStore !== "undefined" &&
            typeof ParticipantStore.getAll === "function"
        ) {
            this.participants = ParticipantStore.getAll();
        } else {
            console.error(
                "ParticipantStore is not available."
            );

            this.participants = [];
        }

        this.filteredParticipants = [
            ...this.participants
        ];
    },


    /*=====================================
            CONNECT BUTTON EVENTS
    ======================================*/

    bindEvents() {
        const searchInput =
            document.getElementById("adminSearchInput");

        const groupFilter =
            document.getElementById("adminGroupFilter");

        const statusFilter =
            document.getElementById("adminStatusFilter");

        const refreshButton =
            document.getElementById("refreshAdminBtn");

        const exportCsvButton =
            document.getElementById("exportCsvBtn");

        const exportExcelButton =
            document.getElementById("exportExcelBtn");


        if (searchInput) {
            searchInput.addEventListener(
                "input",
                () => this.applyFilters()
            );
        }


        if (groupFilter) {
            groupFilter.addEventListener(
                "change",
                () => this.applyFilters()
            );
        }


        if (statusFilter) {
            statusFilter.addEventListener(
                "change",
                () => this.applyFilters()
            );
        }


        if (refreshButton) {
            refreshButton.addEventListener(
                "click",
                () => this.refresh()
            );
        }


        if (exportCsvButton) {
            exportCsvButton.addEventListener(
                "click",
                () => this.exportCSV()
            );
        }


        if (exportExcelButton) {
            exportExcelButton.addEventListener(
                "click",
                () => this.exportExcel()
            );
        }


        document.addEventListener(
            "click",
            event => {
                const deleteButton =
                    event.target.closest(
                        ".delete-participant-btn"
                    );

                if (!deleteButton) return;

                const participantId =
                    deleteButton.dataset.id;

                this.deleteParticipant(
                    participantId
                );
            }
        );
    },


    /*=====================================
            REFRESH DASHBOARD
    ======================================*/

    refresh() {
        this.loadParticipants();
        this.applyFilters();
    },


    /*=====================================
            APPLY SEARCH AND FILTERS
    ======================================*/

    applyFilters() {
        const searchValue =
            document
                .getElementById("adminSearchInput")
                ?.value
                .trim()
                .toLowerCase() || "";

        const selectedGroup =
            document
                .getElementById("adminGroupFilter")
                ?.value || "All";

        const selectedStatus =
            document
                .getElementById("adminStatusFilter")
                ?.value || "All";


        this.filteredParticipants =
            this.participants.filter(
                participant => {

                    const childName =
                        (
                            participant.childName ||
                            participant.name ||
                            ""
                        ).toLowerCase();

                    const parentEmail =
                        (
                            participant.parentEmail ||
                            participant.email ||
                            ""
                        ).toLowerCase();

                    const matchesSearch =
                        !searchValue ||
                        childName.includes(searchValue) ||
                        parentEmail.includes(searchValue);

                    const matchesGroup =
                        selectedGroup === "All" ||
                        participant.group === selectedGroup;

                    const participantStatus =
                        this.getParticipantStatus(
                            participant
                        );

                    const matchesStatus =
                        selectedStatus === "All" ||
                        participantStatus ===
                            selectedStatus;

                    return (
                        matchesSearch &&
                        matchesGroup &&
                        matchesStatus
                    );
                }
            );

        this.renderDashboard();
    },


    /*=====================================
        GET PARTICIPANT CURRENT STATUS
    ======================================*/

    getParticipantStatus(participant) {
        if (participant.qualified === true) {
            return "Qualified";
        }

        if (
            participant.section2Status ===
            "Keep Learning"
        ) {
            return "Keep Learning";
        }

        if (
            participant.section1Status ===
            "Keep Learning"
        ) {
            return "Keep Learning";
        }

        if (
            participant.section1Status ===
            "Passed" &&
            (
                participant.section2Status ===
                    "Not Started" ||
                participant.section2Score === null
            )
        ) {
            return "Section 2 Pending";
        }

        return "Registered";
    },


    /*=====================================
            RENDER EVERYTHING
    ======================================*/

    renderDashboard() {
        this.renderStatistics();
        this.renderParticipantsTable();
    },


    /*=====================================
            DASHBOARD STATISTICS
    ======================================*/

    renderStatistics() {
        const totalParticipants =
            this.participants.length;

        const qualifiedCount =
            this.participants.filter(
                participant =>
                    participant.qualified === true
            ).length;

        const keepLearningCount =
            this.participants.filter(
                participant =>
                    this.getParticipantStatus(
                        participant
                    ) === "Keep Learning"
            ).length;

        const section2PendingCount =
            this.participants.filter(
                participant =>
                    this.getParticipantStatus(
                        participant
                    ) === "Section 2 Pending"
            ).length;


        this.setText(
            "totalParticipants",
            totalParticipants
        );

        this.setText(
            "qualifiedParticipants",
            qualifiedCount
        );

        this.setText(
            "keepLearningParticipants",
            keepLearningCount
        );

        this.setText(
            "pendingParticipants",
            section2PendingCount
        );
    },


    /*=====================================
        DISPLAY PARTICIPANTS TABLE
    ======================================*/

    renderParticipantsTable() {
        const tableBody =
            document.getElementById(
                "participantTableBody"
            );

        const emptyState =
            document.getElementById(
                "adminEmptyState"
            );

        if (!tableBody) {
            console.warn(
                "participantTableBody was not found."
            );

            return;
        }

        tableBody.innerHTML = "";


        if (
            this.filteredParticipants.length === 0
        ) {
            if (emptyState) {
                emptyState.style.display = "block";
            }

            return;
        }


        if (emptyState) {
            emptyState.style.display = "none";
        }


        this.filteredParticipants.forEach(
            (participant, index) => {

                const status =
                    this.getParticipantStatus(
                        participant
                    );

                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td>${index + 1}</td>

                    <td>
                        <strong>
                            ${this.escapeHTML(
                                participant.childName ||
                                participant.name ||
                                "Student"
                            )}
                        </strong>

                        <small>
                            ${this.escapeHTML(
                                participant.parentEmail ||
                                participant.email ||
                                "No email"
                            )}
                        </small>
                    </td>

                    <td>
                        ${participant.age ?? "—"}
                    </td>

                    <td>
                        Group ${
                            this.escapeHTML(
                                participant.group ||
                                "—"
                            )
                        }
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
                        <span class="admin-status ${this.getStatusClass(status)}">
                            ${status}
                        </span>
                    </td>

                    <td>
                        ${
                            participant.liveAttendance ||
                            "Not Marked"
                        }
                    </td>

                    <td>
                        ${this.formatScore(
                            participant.liveScore
                        )}
                    </td>

                    <td>
                        ${
                            participant.finalPosition ||
                            "—"
                        }
                    </td>

                    <td>
                        ${
                            participant.prize ||
                            "—"
                        }
                    </td>

                    <td>
                        <button
                            type="button"
                            class="delete-participant-btn"
                            data-id="${participant.id}"
                            title="Delete participant"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);
            }
        );
    },


    /*=====================================
            DELETE PARTICIPANT
    ======================================*/

    deleteParticipant(participantId) {
        const confirmed = window.confirm(
            "Are you sure you want to remove this participant?"
        );

        if (!confirmed) return;


        if (
            typeof ParticipantStore !== "undefined"
        ) {
            ParticipantStore.remove(
                participantId
            );
        }

        this.refresh();
    },


    /*=====================================
            EXPORT AS CSV
    ======================================*/

    exportCSV() {
        const participants =
            this.filteredParticipants;

        if (participants.length === 0) {
            alert(
                "There are no participant records to export."
            );

            return;
        }


        const rows = [
            [
                "Participant ID",
                "Child Name",
                "Age",
                "Parent Email",
                "Group",
                "Section 1 Score",
                "Section 2 Score",
                "Status",
                "Live Attendance",
                "Live Score",
                "Final Position",
                "Prize",
                "Registration Date"
            ]
        ];


        participants.forEach(
            participant => {
                rows.push([
                    participant.id || "",
                    participant.childName ||
                        participant.name ||
                        "",
                    participant.age ?? "",
                    participant.parentEmail ||
                        participant.email ||
                        "",
                    participant.group || "",
                    participant.section1Score ?? "",
                    participant.section2Score ?? "",
                    this.getParticipantStatus(
                        participant
                    ),
                    participant.liveAttendance ||
                        "",
                    participant.liveScore ?? "",
                    participant.finalPosition ||
                        "",
                    participant.prize || "",
                    participant.registrationDate ||
                        ""
                ]);
            }
        );


        const csvContent =
            rows
                .map(row =>
                    row
                        .map(value =>
                            `"${String(value)
                                .replace(/"/g, '""')}"`
                        )
                        .join(",")
                )
                .join("\n");


        const blob = new Blob(
            [csvContent],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


        this.downloadFile(
            blob,
            "Kiddysexplorer-Participants.csv"
        );
    },


    /*=====================================
            EXPORT AS EXCEL
    ======================================*/

    exportExcel() {
        if (
            typeof XLSX === "undefined"
        ) {
            alert(
                "The Excel library is not loaded. Please add the SheetJS script to the admin page."
            );

            return;
        }


        const exportData =
            this.filteredParticipants.map(
                participant => ({
                    "Participant ID":
                        participant.id || "",

                    "Child Name":
                        participant.childName ||
                        participant.name ||
                        "",

                    "Age":
                        participant.age ?? "",

                    "Parent Email":
                        participant.parentEmail ||
                        participant.email ||
                        "",

                    "Group":
                        participant.group || "",

                    "Section 1 Score":
                        participant.section1Score ??
                        "",

                    "Section 2 Score":
                        participant.section2Score ??
                        "",

                    "Status":
                        this.getParticipantStatus(
                            participant
                        ),

                    "Live Attendance":
                        participant.liveAttendance ||
                        "",

                    "Live Score":
                        participant.liveScore ?? "",

                    "Final Position":
                        participant.finalPosition ||
                        "",

                    "Prize":
                        participant.prize || ""
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
            "Kiddysexplorer-Participants.xlsx"
        );
    },


    /*=====================================
            DOWNLOAD FILE
    ======================================*/

    downloadFile(blob, filename) {
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

        return `${score}%`;
    },


    /*=====================================
        GET CSS CLASS FOR STATUS
    ======================================*/

    getStatusClass(status) {
        if (status === "Qualified") {
            return "status-qualified";
        }

        if (status === "Keep Learning") {
            return "status-learning";
        }

        if (
            status === "Section 2 Pending"
        ) {
            return "status-pending";
        }

        return "status-registered";
    },


    /*=====================================
        SAFELY ADD TEXT TO HTML
    ======================================*/

    escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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
            element.textContent = value;
        }
    }

};


/*=========================================
        START ADMIN DASHBOARD
==========================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {
        AdminDashboard.init();
    }
);