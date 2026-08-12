/*=========================================================
  KIDDYSEXPLORER ADMIN LIVE COMPETITION
=========================================================*/

"use strict";


const AdminLiveCompetition = {

    participants: [],

    filteredParticipants: [],

    activeParticipantId: null,

    initialized: false,

    eventsBound: false,


    /*=====================================================
      INITIALIZE
    =====================================================*/

    init() {

        if (this.initialized) {
            return;
        }

        if (
            typeof ParticipantStore === "undefined" ||
            typeof ParticipantStore.getAll !== "function"
        ) {

            console.error(
                "ParticipantStore is not loaded."
            );

            this.showToast(
                "Live competition data could not be loaded.",
                "error"
            );

            return;

        }

        this.initialized = true;

        this.cacheElements();

        this.bindEvents();

        this.refresh();

    },


    /*=====================================================
      CACHE PAGE ELEMENTS
    =====================================================*/

    cacheElements() {

        this.elements = {

            searchInput:
                document.getElementById(
                    "liveCompetitionSearchInput"
                ),

            groupFilter:
                document.getElementById(
                    "liveCompetitionGroupFilter"
                ),

            attendanceFilter:
                document.getElementById(
                    "liveCompetitionAttendanceFilter"
                ),

            resultFilter:
                document.getElementById(
                    "liveCompetitionResultFilter"
                ),

            refreshButton:
                document.getElementById(
                    "refreshLiveCompetitionBtn"
                ),

            calculateButton:
                document.getElementById(
                    "calculateLivePositionsBtn"
                ),

            publishButton:
                document.getElementById(
                    "publishLiveResultsBtn"
                ),

            unpublishButton:
                document.getElementById(
                    "unpublishLiveResultsBtn"
                ),

            exportButton:
                document.getElementById(
                    "exportLiveCompetitionCSVBtn"
                ),

            printButton:
                document.getElementById(
                    "printLiveCompetitionBtn"
                ),

            resetFiltersButton:
                document.getElementById(
                    "resetLiveCompetitionFiltersBtn"
                ),

            tableBody:
                document.getElementById(
                    "liveCompetitionTableBody"
                ),

            tableWrapper:
                document.getElementById(
                    "liveCompetitionTableWrapper"
                ),

            emptyState:
                document.getElementById(
                    "liveCompetitionEmptyState"
                ),

            resultSummary:
                document.getElementById(
                    "liveCompetitionResultSummary"
                ),

            scoreModal:
                document.getElementById(
                    "liveScoreModal"
                ),

            scoreForm:
                document.getElementById(
                    "liveScoreForm"
                ),

            closeScoreModalButton:
                document.getElementById(
                    "closeLiveScoreModalBtn"
                ),

            cancelScoreButton:
                document.getElementById(
                    "cancelLiveScoreBtn"
                ),

            participantIdInput:
                document.getElementById(
                    "liveParticipantId"
                ),

            participantName:
                document.getElementById(
                    "liveParticipantName"
                ),

            participantDetails:
                document.getElementById(
                    "liveParticipantDetails"
                ),

            attendanceInput:
                document.getElementById(
                    "liveAttendance"
                ),

            scoreInput:
                document.getElementById(
                    "liveScore"
                ),

            positionInput:
                document.getElementById(
                    "liveFinalPosition"
                ),

            prizeInput:
                document.getElementById(
                    "livePrize"
                ),

            remarksInput:
                document.getElementById(
                    "liveRemarks"
                ),

            saveScoreButton:
                document.getElementById(
                    "saveLiveScoreBtn"
                )

        };

    },


    /*=====================================================
      BIND PAGE EVENTS
    =====================================================*/

    bindEvents() {

        if (this.eventsBound) {
            return;
        }

        this.eventsBound = true;


        const delayedFilter =
            typeof AdminCommon !== "undefined" &&
            typeof AdminCommon.debounce === "function"
                ? AdminCommon.debounce(
                    () => this.applyFilters(),
                    180
                )
                : () => this.applyFilters();


        this.elements.searchInput
            ?.addEventListener(
                "input",
                delayedFilter
            );


        [
            this.elements.groupFilter,
            this.elements.attendanceFilter,
            this.elements.resultFilter
        ].forEach(
            element => {

                element?.addEventListener(
                    "change",
                    () => this.applyFilters()
                );

            }
        );


        this.elements.refreshButton
            ?.addEventListener(
                "click",
                () => {

                    this.refresh();

                    this.showToast(
                        "Live competition records refreshed.",
                        "info"
                    );

                }
            );


        this.elements.calculateButton
            ?.addEventListener(
                "click",
                () => this.calculatePositions()
            );


        this.elements.publishButton
            ?.addEventListener(
                "click",
                () => this.publishResults()
            );


        this.elements.unpublishButton
            ?.addEventListener(
                "click",
                () => this.unpublishResults()
            );


        this.elements.exportButton
            ?.addEventListener(
                "click",
                () => this.exportCSV()
            );


        this.elements.printButton
            ?.addEventListener(
                "click",
                () => {

                    if (
                        typeof AdminCommon !== "undefined" &&
                        typeof AdminCommon.printPage === "function"
                    ) {

                        AdminCommon.printPage();

                        return;

                    }

                    window.print();

                }
            );


        this.elements.resetFiltersButton
            ?.addEventListener(
                "click",
                () => this.resetFilters()
            );


        this.elements.tableBody
            ?.addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            "[data-live-action]"
                        );

                    if (!button) {
                        return;
                    }

                    const action =
                        button.dataset.liveAction;

                    const participantId =
                        button.dataset.participantId;

                    if (!participantId) {
                        return;
                    }

                    if (action === "edit") {

                        this.openScoreModal(
                            participantId
                        );

                    }

                    if (action === "present") {

                        this.quickAttendanceUpdate(
                            participantId,
                            true
                        );

                    }

                    if (action === "absent") {

                        this.quickAttendanceUpdate(
                            participantId,
                            false
                        );

                    }

                    if (action === "clear") {

                        this.clearLiveResult(
                            participantId
                        );

                    }

                }
            );


        this.elements.scoreForm
            ?.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    this.saveLiveResult();

                }
            );


        this.elements.closeScoreModalButton
            ?.addEventListener(
                "click",
                () => this.closeScoreModal()
            );


        this.elements.cancelScoreButton
            ?.addEventListener(
                "click",
                () => this.closeScoreModal()
            );


        this.elements.scoreModal
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        this.elements.scoreModal
                    ) {

                        this.closeScoreModal();

                    }

                }
            );


        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {

                    this.closeScoreModal();

                }

            }
        );


        window.addEventListener(
            "kiddysexplorer:participants-changed",
            () => this.refresh()
        );


        window.addEventListener(
            "storage",
            event => {

                if (
                    event.key ===
                    ParticipantStore.storageKey
                ) {

                    this.refresh();

                }

            }
        );

    },


    /*=====================================================
      REFRESH PAGE
    =====================================================*/

    refresh() {

        const records =
            ParticipantStore.getAll();

        this.participants =
            Array.isArray(records)
                ? records
                    .filter(
                        participant =>
                            this.isLiveCompetitionParticipant(
                                participant
                            )
                    )
                    .map(
                        participant =>
                            this.normalizeParticipant(
                                participant
                            )
                    )
                : [];

        this.sortParticipants();

        this.applyFilters();

    },


    /*=====================================================
      QUALIFIED PARTICIPANTS
    =====================================================*/

 /*=====================================================
  QUALIFIED PARTICIPANTS
=====================================================*/

isLiveCompetitionParticipant(
    participant
) {

    if (!participant) {

        return false;

    }


    const qualifiedValue =
        String(
            participant.qualified ?? ""
        )
            .trim()
            .toLowerCase();


    const status =
        String(
            participant.status || ""
        )
            .trim()
            .toLowerCase();


    const section2Status =
        String(
            participant.section2Status || ""
        )
            .trim()
            .toLowerCase();


    const section2Score =
        this.parseQualificationScore(
            participant.section2Score
        );


    return (

        participant.qualified === true ||

        qualifiedValue === "true" ||

        status === "qualified" ||

        section2Status === "passed" ||

        section2Score >= 80

    );

},

/*=====================================================
  PARSE QUALIFICATION SCORE
=====================================================*/

parseQualificationScore(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }


    const cleanedValue =
        String(value)
            .replace("%", "")
            .trim();


    const numericScore =
        Number(cleanedValue);


    return Number.isFinite(
        numericScore
    )
        ? numericScore
        : 0;

},
    /*=====================================================
      NORMALIZE PARTICIPANT
    =====================================================*/

    normalizeParticipant(
        participant
    ) {

        return {

            ...participant,

            id:
                String(
                    participant.id ??
                    participant.participantId ??
                    participant.registrationId ??
                    ""
                ),

            childName:
                participant.childName ||
                participant.name ||
                participant.participantName ||
                "Unnamed Participant",

            parentEmail:
                participant.parentEmail ||
                participant.email ||
                "",

            group:
                String(
                    participant.group || ""
                )
                    .replace(
                        /^group\s*/i,
                        ""
                    )
                    .trim()
                    .toUpperCase(),

            liveAttendance:
                this.normalizeAttendance(
                    participant.liveAttendance
                ),

            liveScore:
                this.normalizeNullableNumber(
                    participant.liveScore
                ),

            finalPosition:
                this.normalizeNullableNumber(
                    participant.finalPosition ??
                    participant.position
                ),

            prize:
                participant.prize || "",

            liveRemarks:
                participant.liveRemarks ||
                participant.remarks ||
                "",

            resultsPublished:
                participant.resultsPublished ===
                true

        };

    },


    /*=====================================================
      NORMALIZE ATTENDANCE
    =====================================================*/

    normalizeAttendance(
        attendance
    ) {

        if (
            attendance === true ||
            attendance === "Present" ||
            attendance === "present" ||
            attendance === "Attended"
        ) {

            return true;

        }

        if (
            attendance === false ||
            attendance === "Absent" ||
            attendance === "absent"
        ) {

            return false;

        }

        return null;

    },


    /*=====================================================
      NORMALIZE NUMBER
    =====================================================*/

    normalizeNullableNumber(
        value
    ) {

        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {

            return null;

        }

        const number =
            Number(value);

        return Number.isFinite(number)
            ? number
            : null;

    },


    /*=====================================================
      SORT PARTICIPANTS
    =====================================================*/

    sortParticipants() {

        this.participants.sort(
            (first, second) => {

                const groupComparison =
                    first.group.localeCompare(
                        second.group
                    );

                if (groupComparison !== 0) {

                    return groupComparison;

                }

                const firstPosition =
                    first.finalPosition ??
                    Number.MAX_SAFE_INTEGER;

                const secondPosition =
                    second.finalPosition ??
                    Number.MAX_SAFE_INTEGER;

                if (
                    firstPosition !==
                    secondPosition
                ) {

                    return (
                        firstPosition -
                        secondPosition
                    );

                }

                return first.childName.localeCompare(
                    second.childName
                );

            }
        );

    },


    /*=====================================================
      APPLY FILTERS
    =====================================================*/

    applyFilters() {

        const search =
            this.getElementValue(
                this.elements.searchInput
            )
                .trim()
                .toLowerCase();

        const group =
            this.getElementValue(
                this.elements.groupFilter
            );

        const attendance =
            this.getElementValue(
                this.elements.attendanceFilter
            );

        const result =
            this.getElementValue(
                this.elements.resultFilter
            );


        this.filteredParticipants =
            this.participants.filter(
                participant => {

                    const matchesSearch =
                        !search ||
                        this.includesSearch(
                            search,
                            participant.childName,
                            participant.parentEmail,
                            participant.id,
                            participant.group
                        );

                    const matchesGroup =
                        !group ||
                        group === "All" ||
                        participant.group ===
                        group;

                    const matchesAttendance =
                        this.matchesAttendanceFilter(
                            participant,
                            attendance
                        );

                    const matchesResult =
                        this.matchesResultFilter(
                            participant,
                            result
                        );

                    return (
                        matchesSearch &&
                        matchesGroup &&
                        matchesAttendance &&
                        matchesResult
                    );

                }
            );

        this.render();

    },


    /*=====================================================
      ATTENDANCE FILTER
    =====================================================*/

    matchesAttendanceFilter(
        participant,
        filter
    ) {

        if (
            !filter ||
            filter === "All"
        ) {

            return true;

        }

        if (filter === "Present") {

            return (
                participant.liveAttendance ===
                true
            );

        }

        if (filter === "Absent") {

            return (
                participant.liveAttendance ===
                false
            );

        }

        if (filter === "Not Marked") {

            return (
                participant.liveAttendance ===
                null
            );

        }

        return true;

    },


    /*=====================================================
      RESULT FILTER
    =====================================================*/

    matchesResultFilter(
        participant,
        filter
    ) {

        if (
            !filter ||
            filter === "All"
        ) {

            return true;

        }

        if (filter === "Scored") {

            return (
                participant.liveScore !==
                null
            );

        }

        if (filter === "Not Scored") {

            return (
                participant.liveScore ===
                null
            );

        }

        if (filter === "Ranked") {

            return (
                participant.finalPosition !==
                null
            );

        }

        if (filter === "Published") {

            return (
                participant.resultsPublished ===
                true
            );

        }

        if (filter === "Not Published") {

            return (
                participant.resultsPublished !==
                true
            );

        }

        return true;

    },


    /*=====================================================
      RENDER PAGE
    =====================================================*/

    render() {

        this.renderTable();

        this.updateStatistics();

        this.updateWinnerCards();

    },


    /*=====================================================
      RENDER TABLE
    =====================================================*/

    renderTable() {

        const tableBody =
            this.elements.tableBody;

        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";

        const hasRecords =
            this.filteredParticipants.length >
            0;

        if (this.elements.tableWrapper) {

            this.elements.tableWrapper.hidden =
                !hasRecords;

        }

        if (this.elements.emptyState) {

            this.elements.emptyState.hidden =
                hasRecords;

        }

        if (!hasRecords) {

            if (
                this.elements.resultSummary
            ) {

                this.elements.resultSummary.textContent =
                    "Showing 0 live competition participants";

            }

            return;

        }


        const fragment =
            document.createDocumentFragment();


        this.filteredParticipants.forEach(
            participant => {

                const row =
                    document.createElement(
                        "tr"
                    );

                row.innerHTML =
                    this.createTableRow(
                        participant
                    );

                fragment.appendChild(
                    row
                );

            }
        );


        tableBody.appendChild(
            fragment
        );


        if (
            this.elements.resultSummary
        ) {

            this.elements.resultSummary.textContent =
                `Showing ${this.filteredParticipants.length} of ${this.participants.length} qualified participant(s)`;

        }

    },


    /*=====================================================
      TABLE ROW
    =====================================================*/

    createTableRow(
        participant
    ) {

        const attendance =
            this.getAttendanceLabel(
                participant.liveAttendance
            );

        const attendanceClass =
            this.getAttendanceClass(
                participant.liveAttendance
            );

        const publicationLabel =
            participant.resultsPublished
                ? "Published"
                : "Not Published";

        const publicationClass =
            participant.resultsPublished
                ? "published"
                : "not-published";

        return `
            <td>

                <strong>
                    ${this.escapeHTML(
                        participant.childName
                    )}
                </strong>

                <br>

                <small>
                    ${this.escapeHTML(
                        participant.parentEmail ||
                        participant.id
                    )}
                </small>

            </td>

            <td>

                <span class="group-badge">
                    Group ${this.escapeHTML(
                        participant.group || "—"
                    )}
                </span>

            </td>

            <td>
                ${this.formatScore(
                    participant.section1Score,
                    "%"
                )}
            </td>

            <td>
                ${this.formatScore(
                    participant.section2Score,
                    "%"
                )}
            </td>

            <td>

                <span class="attendance-badge ${attendanceClass}">
                    ${attendance}
                </span>

            </td>

            <td>

                <strong class="live-score-value">
                    ${this.formatScore(
                        participant.liveScore,
                        " points"
                    )}
                </strong>

            </td>

            <td>

                <span class="position-badge ${this.positionClass(
                    participant.finalPosition
                )}">
                    ${this.positionDisplay(
                        participant.finalPosition
                    )}
                </span>

            </td>

            <td>
                ${this.escapeHTML(
                    participant.prize ||
                    "Not assigned"
                )}
            </td>

            <td>

                <span class="publication-badge ${publicationClass}">
                    ${publicationLabel}
                </span>

            </td>

            <td>

                <div class="table-actions">

                    <button
                        type="button"
                        class="icon-btn"
                        data-live-action="edit"
                        data-participant-id="${this.escapeHTML(
                            participant.id
                        )}"
                        title="Enter live result"
                        aria-label="Enter live result for ${this.escapeHTML(
                            participant.childName
                        )}"
                    >
                        <i class="fas fa-pen"></i>
                    </button>

                    <button
                        type="button"
                        class="icon-btn"
                        data-live-action="present"
                        data-participant-id="${this.escapeHTML(
                            participant.id
                        )}"
                        title="Mark present"
                        aria-label="Mark ${this.escapeHTML(
                            participant.childName
                        )} present"
                    >
                        <i class="fas fa-user-check"></i>
                    </button>

                    <button
                        type="button"
                        class="icon-btn"
                        data-live-action="absent"
                        data-participant-id="${this.escapeHTML(
                            participant.id
                        )}"
                        title="Mark absent"
                        aria-label="Mark ${this.escapeHTML(
                            participant.childName
                        )} absent"
                    >
                        <i class="fas fa-user-xmark"></i>
                    </button>

                    <button
                        type="button"
                        class="icon-btn danger"
                        data-live-action="clear"
                        data-participant-id="${this.escapeHTML(
                            participant.id
                        )}"
                        title="Clear live result"
                        aria-label="Clear live result for ${this.escapeHTML(
                            participant.childName
                        )}"
                    >
                        <i class="fas fa-rotate-left"></i>
                    </button>

                </div>

            </td>
        `;

    },


    /*=====================================================
      OPEN SCORE MODAL
    =====================================================*/

    openScoreModal(
        participantId
    ) {

        const participant =
            this.getParticipantById(
                participantId
            );

        if (!participant) {

            this.showToast(
                "Participant record could not be found.",
                "error"
            );

            return;

        }

        this.activeParticipantId =
            participant.id;


        if (
            this.elements.participantIdInput
        ) {

            this.elements.participantIdInput.value =
                participant.id;

        }


        if (
            this.elements.participantName
        ) {

            this.elements.participantName.textContent =
                participant.childName;

        }


        if (
            this.elements.participantDetails
        ) {

            this.elements.participantDetails.textContent =
                `Group ${participant.group || "—"} • Section 2: ${this.formatScore(
                    participant.section2Score,
                    "%"
                )}`;

        }


        if (
            this.elements.attendanceInput
        ) {

            this.elements.attendanceInput.value =
                participant.liveAttendance ===
                true
                    ? "Present"
                    : participant.liveAttendance ===
                        false
                        ? "Absent"
                        : "";

        }


        if (
            this.elements.scoreInput
        ) {

            this.elements.scoreInput.value =
                participant.liveScore ??
                "";

        }


        if (
            this.elements.positionInput
        ) {

            this.elements.positionInput.value =
                participant.finalPosition ??
                "";

        }


        if (
            this.elements.prizeInput
        ) {

            this.elements.prizeInput.value =
                participant.prize || "";

        }


        if (
            this.elements.remarksInput
        ) {

            this.elements.remarksInput.value =
                participant.liveRemarks ||
                "";

        }


        if (
            this.elements.scoreModal
        ) {

            this.elements.scoreModal.hidden =
                false;

            this.elements.scoreModal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "admin-modal-open"
            );

        }


        window.setTimeout(
            () => {

                this.elements.attendanceInput
                    ?.focus();

            },
            100
        );

    },


    /*=====================================================
      CLOSE SCORE MODAL
    =====================================================*/

    closeScoreModal() {

        if (
            this.elements.scoreModal
        ) {

            this.elements.scoreModal.hidden =
                true;

            this.elements.scoreModal.setAttribute(
                "aria-hidden",
                "true"
            );

        }

        document.body.classList.remove(
            "admin-modal-open"
        );

        this.activeParticipantId =
            null;

    },


    /*=====================================================
      SAVE LIVE RESULT
    =====================================================*/

    saveLiveResult() {

        const participantId =
            this.elements.participantIdInput
                ?.value ||
            this.activeParticipantId;

        const participant =
            this.getParticipantById(
                participantId
            );

        if (!participant) {

            this.showToast(
                "Participant record could not be found.",
                "error"
            );

            return;

        }


        const attendanceValue =
            this.elements.attendanceInput
                ?.value ||
            "";

        const attendance =
            attendanceValue === "Present"
                ? true
                : attendanceValue === "Absent"
                    ? false
                    : null;


        const scoreValue =
            this.elements.scoreInput
                ?.value
                .trim() ||
            "";

        const positionValue =
            this.elements.positionInput
                ?.value
                .trim() ||
            "";

        const prize =
            this.elements.prizeInput
                ?.value
                .trim() ||
            "";

        const remarks =
            this.elements.remarksInput
                ?.value
                .trim() ||
            "";


        if (attendance === null) {

            this.showToast(
                "Please select Present or Absent.",
                "warning"
            );

            return;

        }


        let liveScore =
            null;

        if (scoreValue !== "") {

            liveScore =
                Number(scoreValue);

            if (
                !Number.isFinite(
                    liveScore
                ) ||
                liveScore < 0 ||
                liveScore > 100
            ) {

                this.showToast(
                    "Live score must be between 0 and 100.",
                    "warning"
                );

                return;

            }

        }


        if (
            attendance === false &&
            liveScore !== null
        ) {

            this.showToast(
                "An absent participant cannot have a live score.",
                "warning"
            );

            return;

        }


        let finalPosition =
            null;

        if (positionValue !== "") {

            finalPosition =
                Number(positionValue);

            if (
                !Number.isInteger(
                    finalPosition
                ) ||
                finalPosition < 1
            ) {

                this.showToast(
                    "Position must be a whole number greater than zero.",
                    "warning"
                );

                return;

            }

        }


        const updateData = {

            liveAttendance:
                attendance,

            liveScore:
                attendance
                    ? liveScore
                    : null,

            finalPosition:
                attendance
                    ? finalPosition
                    : null,

            prize:
                attendance
                    ? prize
                    : "",

            liveRemarks:
                remarks,

            liveCompleted:
                attendance === true &&
                liveScore !== null,

            liveCompletedDate:
                attendance === true &&
                liveScore !== null
                    ? new Date()
                        .toISOString()
                    : null,

            lastUpdated:
                new Date()
                    .toISOString()

        };


        const updated =
            this.updateParticipantLiveResult(
                participant.id,
                updateData
            );


        if (!updated) {

            this.showToast(
                "The live result could not be saved.",
                "error"
            );

            return;

        }


        this.closeScoreModal();

        this.refresh();


        this.showToast(
            "Live competition result saved successfully.",
            "success"
        );

    },


    /*=====================================================
      UPDATE PARTICIPANT STORE
    =====================================================*/

    updateParticipantLiveResult(
        participantId,
        updateData
    ) {

        try {

            if (
                typeof ParticipantStore
                    .saveLiveResultById ===
                "function"
            ) {

                const result =
                    ParticipantStore
                        .saveLiveResultById(
                            participantId,
                            updateData
                        );

                if (result) {
                    return result;
                }

            }


            if (
                typeof ParticipantStore.update ===
                "function"
            ) {

                return ParticipantStore.update(
                    participantId,
                    updateData
                );

            }

        } catch (error) {

            console.error(
                "Unable to update live result:",
                error
            );

        }

        return null;

    },


    /*=====================================================
      QUICK ATTENDANCE UPDATE
    =====================================================*/

    quickAttendanceUpdate(
        participantId,
        attendance
    ) {

        const participant =
            this.getParticipantById(
                participantId
            );

        if (!participant) {
            return;
        }


        const updateData = {

            liveAttendance:
                attendance,

            lastUpdated:
                new Date()
                    .toISOString()

        };


        if (!attendance) {

            updateData.liveScore =
                null;

            updateData.finalPosition =
                null;

            updateData.prize =
                "";

            updateData.liveCompleted =
                false;

            updateData.liveCompletedDate =
                null;

        }


        const updated =
            this.updateParticipantLiveResult(
                participantId,
                updateData
            );


        if (!updated) {

            this.showToast(
                "Attendance could not be updated.",
                "error"
            );

            return;

        }


        this.refresh();


        this.showToast(
            attendance
                ? `${participant.childName} marked present.`
                : `${participant.childName} marked absent.`,
            "success"
        );

    },


    /*=====================================================
      CLEAR LIVE RESULT
    =====================================================*/

    clearLiveResult(
        participantId
    ) {

        const participant =
            this.getParticipantById(
                participantId
            );

        if (!participant) {
            return;
        }


        const confirmed =
            this.confirmAction(
                `Clear the live competition result for ${participant.childName}?`
            );

        if (!confirmed) {
            return;
        }


        const updated =
            this.updateParticipantLiveResult(
                participantId,
                {

                    liveAttendance:
                        null,

                    liveScore:
                        null,

                    finalPosition:
                        null,

                    prize:
                        "",

                    liveRemarks:
                        "",

                    liveCompleted:
                        false,

                    liveCompletedDate:
                        null,

                    resultsPublished:
                        false,

                    resultsPublishedDate:
                        null,

                    lastUpdated:
                        new Date()
                            .toISOString()

                }
            );


        if (!updated) {

            this.showToast(
                "The live result could not be cleared.",
                "error"
            );

            return;

        }


        this.refresh();


        this.showToast(
            "Live competition result cleared.",
            "success"
        );

    },


    /*=====================================================
      CALCULATE POSITIONS
    =====================================================*/

    calculatePositions() {

        const scoredParticipants =
            this.participants.filter(
                participant =>
                    participant.liveAttendance ===
                        true &&
                    participant.liveScore !==
                        null
            );


        if (scoredParticipants.length === 0) {

            this.showToast(
                "Enter live scores before calculating positions.",
                "warning"
            );

            return;

        }


        const confirmed =
            this.confirmAction(
                "Calculate positions separately for Groups A, B and C? Existing positions and default prizes will be updated."
            );

        if (!confirmed) {
            return;
        }


        const groups =
            ["A", "B", "C"];

        let updatedCount =
            0;


        groups.forEach(
            group => {

                const groupParticipants =
                    scoredParticipants
                        .filter(
                            participant =>
                                participant.group ===
                                group
                        )
                        .sort(
                            (
                                first,
                                second
                            ) =>
                                this.compareLiveResults(
                                    first,
                                    second
                                )
                        );


                groupParticipants.forEach(
                    (
                        participant,
                        index
                    ) => {

                        const position =
                            index + 1;

                        const existingPrize =
                            participant.prize ||
                            "";

                        const prize =
                            position <= 3
                                ? this.defaultPrizeForPosition(
                                    position
                                )
                                : existingPrize;


                        const updated =
                            this.updateParticipantLiveResult(
                                participant.id,
                                {

                                    finalPosition:
                                        position,

                                    prize:
                                        prize,

                                    liveCompleted:
                                        true,

                                    liveCompletedDate:
                                        participant
                                            .liveCompletedDate ||
                                        new Date()
                                            .toISOString(),

                                    lastUpdated:
                                        new Date()
                                            .toISOString()

                                }
                            );


                        if (updated) {

                            updatedCount++;

                        }

                    }
                );

            }
        );


        this.refresh();


        this.showToast(
            `${updatedCount} position(s) calculated successfully.`,
            "success"
        );

    },


    /*=====================================================
      COMPARE LIVE RESULTS
    =====================================================*/

    compareLiveResults(
        first,
        second
    ) {

        const liveDifference =
            Number(
                second.liveScore
            ) -
            Number(
                first.liveScore
            );

        if (liveDifference !== 0) {

            return liveDifference;

        }


        const section2Difference =
            Number(
                second.section2Score ||
                0
            ) -
            Number(
                first.section2Score ||
                0
            );

        if (
            section2Difference !== 0
        ) {

            return section2Difference;

        }


        const section1Difference =
            Number(
                second.section1Score ||
                0
            ) -
            Number(
                first.section1Score ||
                0
            );

        if (
            section1Difference !== 0
        ) {

            return section1Difference;

        }


        const firstDate =
            new Date(
                first.registrationDate ||
                0
            ).getTime();

        const secondDate =
            new Date(
                second.registrationDate ||
                0
            ).getTime();


        return (
            firstDate -
            secondDate
        );

    },


    /*=====================================================
      DEFAULT PRIZE
    =====================================================*/

    defaultPrizeForPosition(
        position
    ) {

        switch (
            Number(position)
        ) {

            case 1:
                return "Gold Medal";

            case 2:
                return "Silver Medal";

            case 3:
                return "Bronze Medal";

            default:
                return "";

        }

    },


    /*=====================================================
      PUBLISH RESULTS
    =====================================================*/

    publishResults() {

        const rankedParticipants =
            this.participants.filter(
                participant =>
                    participant.finalPosition !==
                    null
            );


        if (
            rankedParticipants.length ===
            0
        ) {

            this.showToast(
                "Calculate final positions before publishing results.",
                "warning"
            );

            return;

        }


        const confirmed =
            this.confirmAction(
                "Publish the ranked live competition results?"
            );

        if (!confirmed) {
            return;
        }


        const publishedDate =
            new Date()
                .toISOString();

        let updatedCount =
            0;


        rankedParticipants.forEach(
            participant => {

                const updated =
                    this.updateParticipantLiveResult(
                        participant.id,
                        {

                            resultsPublished:
                                true,

                            resultsPublishedDate:
                                publishedDate,

                            lastUpdated:
                                publishedDate

                        }
                    );


                if (updated) {

                    updatedCount++;

                }

            }
        );


        this.refresh();


        window.dispatchEvent(
            new CustomEvent(
                "kiddysexplorer:live-results-published",
                {
                    detail: {

                        total:
                            updatedCount,

                        publishedDate:
                            publishedDate

                    }
                }
            )
        );


        this.showToast(
            `${updatedCount} live competition result(s) published.`,
            "success"
        );

    },


    /*=====================================================
      UNPUBLISH RESULTS
    =====================================================*/

    unpublishResults() {

        const publishedParticipants =
            this.participants.filter(
                participant =>
                    participant.resultsPublished ===
                    true
            );


        if (
            publishedParticipants.length ===
            0
        ) {

            this.showToast(
                "There are no published results.",
                "info"
            );

            return;

        }


        const confirmed =
            this.confirmAction(
                "Remove the published status from all live competition results?"
            );

        if (!confirmed) {
            return;
        }


        let updatedCount =
            0;


        publishedParticipants.forEach(
            participant => {

                const updated =
                    this.updateParticipantLiveResult(
                        participant.id,
                        {

                            resultsPublished:
                                false,

                            resultsPublishedDate:
                                null,

                            lastUpdated:
                                new Date()
                                    .toISOString()

                        }
                    );


                if (updated) {

                    updatedCount++;

                }

            }
        );


        this.refresh();


        this.showToast(
            `${updatedCount} result(s) unpublished.`,
            "success"
        );

    },


    /*=====================================================
      UPDATE STATISTICS
    =====================================================*/

    updateStatistics() {

        const presentCount =
            this.participants.filter(
                participant =>
                    participant.liveAttendance ===
                    true
            ).length;

        const absentCount =
            this.participants.filter(
                participant =>
                    participant.liveAttendance ===
                    false
            ).length;

        const scoredParticipants =
            this.participants.filter(
                participant =>
                    participant.liveScore !==
                    null
            );

        const rankedCount =
            this.participants.filter(
                participant =>
                    participant.finalPosition !==
                    null
            ).length;

        const publishedCount =
            this.participants.filter(
                participant =>
                    participant.resultsPublished ===
                    true
            ).length;

        const averageScore =
            scoredParticipants.length >
            0
                ? (
                    scoredParticipants.reduce(
                        (
                            total,
                            participant
                        ) =>
                            total +
                            Number(
                                participant.liveScore
                            ),
                        0
                    ) /
                    scoredParticipants.length
                ).toFixed(1)
                : "—";


        this.setText(
            "liveQualifiedCount",
            this.participants.length
        );

        this.setText(
            "livePresentCount",
            presentCount
        );

        this.setText(
            "liveAbsentCount",
            absentCount
        );

        this.setText(
            "liveScoredCount",
            scoredParticipants.length
        );

        this.setText(
            "liveRankedCount",
            rankedCount
        );

        this.setText(
            "livePublishedCount",
            publishedCount
        );

        this.setText(
            "liveAverageScore",
            averageScore
        );

    },


    /*=====================================================
      UPDATE WINNER CARDS
    =====================================================*/

    updateWinnerCards() {

        ["A", "B", "C"].forEach(
            group => {

                [1, 2, 3].forEach(
                    position => {

                        const participant =
                            this.participants.find(
                                item =>
                                    item.group ===
                                        group &&
                                    Number(
                                        item.finalPosition
                                    ) ===
                                        position
                            );


                        const prefix =
                            `group${group}Position${position}`;


                        this.setText(
                            `${prefix}Name`,
                            participant
                                ? participant.childName
                                : "Not yet available"
                        );


                        this.setText(
                            `${prefix}Score`,
                            participant
                                ? `${participant.liveScore} points`
                                : "—"
                        );


                        this.setText(
                            `${prefix}Prize`,
                            participant
                                ? (
                                    participant.prize ||
                                    "No prize assigned"
                                )
                                : "No prize assigned"
                        );

                    }
                );

            }
        );

    },


    /*=====================================================
      EXPORT CSV
    =====================================================*/

    exportCSV() {

        if (
            this.filteredParticipants.length ===
            0
        ) {

            this.showToast(
                "There are no live competition records to export.",
                "warning"
            );

            return;

        }


        const headers = [

            "Participant ID",
            "Participant",
            "Parent Email",
            "Group",
            "Section 1 Score",
            "Section 2 Score",
            "Attendance",
            "Live Score",
            "Final Position",
            "Prize",
            "Publication Status",
            "Remarks"

        ];


        const rows =
            this.filteredParticipants.map(
                participant => [

                    participant.id,

                    participant.childName,

                    participant.parentEmail,

                    participant.group,

                    participant.section1Score ??
                    "",

                    participant.section2Score ??
                    "",

                    this.getAttendanceLabel(
                        participant.liveAttendance
                    ),

                    participant.liveScore ??
                    "",

                    participant.finalPosition ??
                    "",

                    participant.prize ||
                    "",

                    participant.resultsPublished
                        ? "Published"
                        : "Not Published",

                    participant.liveRemarks ||
                    ""

                ]
            );


        const filename =
            typeof AdminCommon !==
                "undefined" &&
            typeof AdminCommon
                .createDateFilename ===
                "function"
                ? AdminCommon
                    .createDateFilename(
                        "kiddysexplorer-live-competition",
                        ".csv"
                    )
                : `kiddysexplorer-live-competition-${
                    new Date()
                        .toISOString()
                        .slice(
                            0,
                            10
                        )
                }.csv`;


        if (
            typeof AdminCommon !==
                "undefined" &&
            typeof AdminCommon.exportCSV ===
                "function"
        ) {

            const successful =
                AdminCommon.exportCSV(
                    filename,
                    headers,
                    rows
                );

            if (successful) {

                this.showToast(
                    "Live competition CSV exported successfully.",
                    "success"
                );

            }

            return;

        }


        this.exportCSVFallback(
            filename,
            headers,
            rows
        );

    },


    /*=====================================================
      CSV FALLBACK
    =====================================================*/

    exportCSVFallback(
        filename,
        headers,
        rows
    ) {

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
                                    `"${String(
                                        value ?? ""
                                    ).replace(
                                        /"/g,
                                        '""'
                                    )}"`
                            )
                            .join(",")
                )
                .join("\n");


        const blob =
            new Blob(
                [
                    "\ufeff" +
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


        link.href =
            url;

        link.download =
            filename;


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
            "Live competition CSV exported successfully.",
            "success"
        );

    },


    /*=====================================================
      RESET FILTERS
    =====================================================*/

    resetFilters() {

        if (
            this.elements.searchInput
        ) {

            this.elements.searchInput.value =
                "";

        }

        if (
            this.elements.groupFilter
        ) {

            this.elements.groupFilter.value =
                "";

        }

        if (
            this.elements.attendanceFilter
        ) {

            this.elements.attendanceFilter.value =
                "";

        }

        if (
            this.elements.resultFilter
        ) {

            this.elements.resultFilter.value =
                "";

        }

        this.applyFilters();


        this.showToast(
            "Live competition filters reset.",
            "info"
        );

    },


    /*=====================================================
      GET PARTICIPANT
    =====================================================*/

    getParticipantById(
        participantId
    ) {

        return this.participants.find(
            participant =>
                String(
                    participant.id
                ) ===
                String(
                    participantId
                )
        ) || null;

    },


    /*=====================================================
      ATTENDANCE FORMAT
    =====================================================*/

    getAttendanceLabel(
        attendance
    ) {

        if (attendance === true) {

            return "Present";

        }

        if (attendance === false) {

            return "Absent";

        }

        return "Not Marked";

    },


    getAttendanceClass(
        attendance
    ) {

        if (attendance === true) {

            return "present";

        }

        if (attendance === false) {

            return "absent";

        }

        return "not-marked";

    },


    /*=====================================================
      POSITION FORMAT
    =====================================================*/

    positionDisplay(
        position
    ) {

        const number =
            Number(position);

        if (
            !Number.isFinite(number) ||
            number < 1
        ) {

            return "—";

        }

        if (number === 1) {

            return "🥇 1st";

        }

        if (number === 2) {

            return "🥈 2nd";

        }

        if (number === 3) {

            return "🥉 3rd";

        }


        if (
            typeof AdminCommon !==
                "undefined" &&
            typeof AdminCommon.ordinal ===
                "function"
        ) {

            return AdminCommon.ordinal(
                number
            );

        }


        return `${number}th`;

    },


    positionClass(
        position
    ) {

        switch (
            Number(position)
        ) {

            case 1:
                return "first";

            case 2:
                return "second";

            case 3:
                return "third";

            default:
                return "";

        }

    },


    /*=====================================================
      FORMAT SCORE
    =====================================================*/

    formatScore(
        value,
        suffix = ""
    ) {

        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {

            return "—";

        }

        return `${this.escapeHTML(
            value
        )}${suffix}`;

    },


    /*=====================================================
      SEARCH
    =====================================================*/

    includesSearch(
        search,
        ...fields
    ) {

        if (
            typeof AdminCommon !==
                "undefined" &&
            typeof AdminCommon.includesSearch ===
                "function"
        ) {

            return AdminCommon.includesSearch(
                search,
                ...fields
            );

        }

        return fields.some(
            field =>
                String(
                    field ?? ""
                )
                    .toLowerCase()
                    .includes(
                        search
                    )
        );

    },


    /*=====================================================
      CONFIRMATION
    =====================================================*/

    confirmAction(
        message
    ) {

        if (
            typeof AdminCommon !==
                "undefined" &&
            typeof AdminCommon.confirmAction ===
                "function"
        ) {

            return AdminCommon.confirmAction(
                message
            );

        }

        return window.confirm(
            message
        );

    },


    /*=====================================================
      TOAST
    =====================================================*/

    showToast(
        message,
        type = "success"
    ) {

        if (
            typeof AdminCommon !==
                "undefined" &&
            typeof AdminCommon.showToast ===
                "function"
        ) {

            AdminCommon.showToast(
                message,
                type
            );

            return;

        }

        console.log(
            `[${type}] ${message}`
        );

        if (type === "error") {

            window.alert(
                message
            );

        }

    },


    /*=====================================================
      SET TEXT
    =====================================================*/

    setText(
        elementId,
        value
    ) {

        if (
            typeof AdminCommon !==
                "undefined" &&
            typeof AdminCommon.setText ===
                "function"
        ) {

            AdminCommon.setText(
                elementId,
                value
            );

            return;

        }

        const element =
            document.getElementById(
                elementId
            );

        if (element) {

            element.textContent =
                value ?? "";

        }

    },


    /*=====================================================
      GET ELEMENT VALUE
    =====================================================*/

    getElementValue(
        element
    ) {

        return element?.value ?? "";

    },


    /*=====================================================
      ESCAPE HTML
    =====================================================*/

    escapeHTML(
        value
    ) {

        if (
            typeof AdminCommon !==
                "undefined" &&
            typeof AdminCommon.escapeHTML ===
                "function"
        ) {

            return AdminCommon.escapeHTML(
                value
            );

        }

        return String(
            value ?? ""
        ).replace(
            /[&<>'"]/g,
            character => ({

                "&": "&amp;",

                "<": "&lt;",

                ">": "&gt;",

                "'": "&#39;",

                '"': "&quot;"

            })[character]
        );

    }

};


/*=========================================================
  START LIVE COMPETITION PAGE
=========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        AdminLiveCompetition.init();

    }
);