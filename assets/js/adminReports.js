"use strict";

const AdminReports = {

    participants: [],

    prizes: [],

    certificates: [],

    filteredRows: [],

    charts: {},

    elements: {},

    eventsBound: false,

    storageKeys: {

        prizes:
            "kiddysexplorerPrizeRecords",

        certificates:
            "kiddysexplorerCertificateRecords"

    },


    init() {

        this.cacheElements();

        this.bindEvents();

        this.loadData();

        this.refresh();

    },


    cacheElements() {

        this.elements = {

            sidebar:
                document.getElementById(
                    "adminSidebar"
                ),

            sidebarOverlay:
                document.getElementById(
                    "sidebarOverlay"
                ),

            menuToggleBtn:
                document.getElementById(
                    "menuToggleBtn"
                ),

            sidebarCloseBtn:
                document.getElementById(
                    "sidebarCloseBtn"
                ),

            refreshReportsBtn:
                document.getElementById(
                    "refreshReportsBtn"
                ),

            printReportPageBtn:
                document.getElementById(
                    "printReportPageBtn"
                ),

            reportCompetitionFilter:
                document.getElementById(
                    "reportCompetitionFilter"
                ),

            reportGroupFilter:
                document.getElementById(
                    "reportGroupFilter"
                ),

            reportScoreFilter:
                document.getElementById(
                    "reportScoreFilter"
                ),

            reportDateFrom:
                document.getElementById(
                    "reportDateFrom"
                ),

            reportDateTo:
                document.getElementById(
                    "reportDateTo"
                ),

            applyReportFiltersBtn:
                document.getElementById(
                    "applyReportFiltersBtn"
                ),

            resetReportFiltersBtn:
                document.getElementById(
                    "resetReportFiltersBtn"
                ),

            reportTableBody:
                document.getElementById(
                    "reportTableBody"
                ),

            reportEmptyState:
                document.getElementById(
                    "reportEmptyState"
                ),

            reportResultSummary:
                document.getElementById(
                    "reportResultSummary"
                ),

            reportTableWrapper:
                document.getElementById(
                    "reportTableWrapper"
                ),

            reportTotalParticipants:
                document.getElementById(
                    "reportTotalParticipants"
                ),

            reportCompletedCompetitions:
                document.getElementById(
                    "reportCompletedCompetitions"
                ),

            reportTotalWinners:
                document.getElementById(
                    "reportTotalWinners"
                ),

            reportPrizesAwarded:
                document.getElementById(
                    "reportPrizesAwarded"
                ),

            reportCertificatesGenerated:
                document.getElementById(
                    "reportCertificatesGenerated"
                ),

            reportAverageScore:
                document.getElementById(
                    "reportAverageScore"
                ),

            summaryParticipants:
                document.getElementById(
                    "summaryParticipants"
                ),

            summaryAverageScore:
                document.getElementById(
                    "summaryAverageScore"
                ),

            summaryWinners:
                document.getElementById(
                    "summaryWinners"
                ),

            summaryPrizes:
                document.getElementById(
                    "summaryPrizes"
                ),

            summaryCertificates:
                document.getElementById(
                    "summaryCertificates"
                ),

            summaryCompletionRate:
                document.getElementById(
                    "summaryCompletionRate"
                ),

            participantReportModal:
                document.getElementById(
                    "participantReportModal"
                ),

            closeParticipantReportModalBtn:
                document.getElementById(
                    "closeParticipantReportModalBtn"
                ),

            closeParticipantReportFooterBtn:
                document.getElementById(
                    "closeParticipantReportFooterBtn"
                )

        };

    },
    bindEvents() {

        if (this.eventsBound) {

            return;

        }

        this.eventsBound = true;


        this.elements.menuToggleBtn
            ?.addEventListener(
                "click",
                () => this.openSidebar()
            );


        this.elements.sidebarCloseBtn
            ?.addEventListener(
                "click",
                () => this.closeSidebar()
            );


        this.elements.sidebarOverlay
            ?.addEventListener(
                "click",
                () => this.closeSidebar()
            );


        this.elements.refreshReportsBtn
            ?.addEventListener(
                "click",
                () => {

                    this.loadData();

                    this.refresh();

                    AdminCommon.showToast(
                        "Reports refreshed successfully.",
                        "success"
                    );

                }
            );


        this.elements.printReportPageBtn
            ?.addEventListener(
                "click",
                () => window.print()
            );


        this.elements.applyReportFiltersBtn
            ?.addEventListener(
                "click",
                () => this.applyFilters()
            );


        this.elements.resetReportFiltersBtn
            ?.addEventListener(
                "click",
                () => this.resetFilters()
            );


        document
            .querySelectorAll(
                "[data-quick-report]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    event => {

                        const reportType =
                            event.currentTarget
                                .dataset
                                .quickReport;

                        this.generateQuickReport(
                            reportType
                        );

                    }
                );

            });


        this.elements.reportTableBody
            ?.addEventListener(
                "click",
                event => {

                    const actionButton =
                        event.target.closest(
                            "[data-action]"
                        );

                    if (!actionButton) {

                        return;

                    }

                    const action =
                        actionButton.dataset.action;

                    const participantId =
                        actionButton.dataset
                            .participantId;

                    if (!participantId) {

                        return;

                    }

                    if (
                        action === "view"
                    ) {

                        this.openParticipantModal(
                            participantId
                        );

                    }

                    if (
                        action === "print"
                    ) {

                        this.printParticipantReport(
                            participantId
                        );

                    }

                }
            );


        this.elements.closeParticipantReportModalBtn
            ?.addEventListener(
                "click",
                () => this.closeParticipantModal()
            );


        this.elements.closeParticipantReportFooterBtn
            ?.addEventListener(
                "click",
                () => this.closeParticipantModal()
            );


        this.elements.participantReportModal
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        this.elements
                            .participantReportModal
                    ) {

                        this.closeParticipantModal();

                    }

                }
            );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Escape"
                ) {

                    return;

                }

                this.closeParticipantModal();

                this.closeSidebar();

            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth >
                    992
                ) {

                    this.closeSidebar();

                }

            }
        );


        window.addEventListener(
            "storage",
            event => {

                const relevantKeys = [

                    this.storageKeys.prizes,

                    this.storageKeys.certificates,

                    "kiddyParticipants",

                    "participants",

                    "quizParticipants"

                ];

                if (
                    event.key &&
                    !relevantKeys.includes(
                        event.key
                    )
                ) {

                    return;

                }

                this.loadData();

                this.refresh();

            }
        );


        const refreshEvents = [

            "participants-changed",

            "participant-updated",

            "participant-created",

            "participant-deleted",

            "leaderboard-updated",

            "live-results-updated",

            "prizes-changed",

            "certificates-changed"

        ];


        refreshEvents.forEach(
            eventName => {

                document.addEventListener(
                    eventName,
                    () => {

                        this.loadData();

                        this.refresh();

                    }
                );

            }
        );

    },
    loadData() {

        this.participants =
            this.loadParticipants();

        this.prizes =
            this.loadPrizeRecords();

        this.certificates =
            this.loadCertificateRecords();

    },


    loadParticipants() {

        if (

            window.ParticipantStore &&

            typeof ParticipantStore.getAll ===
            "function"

        ) {

            try {

                const participants =
                    ParticipantStore.getAll();

                if (

                    Array.isArray(
                        participants
                    )

                ) {

                    return participants;

                }

            }

            catch (error) {

                console.error(
                    error
                );

            }

        }


        const storageKeys = [

            "kiddyParticipants",

            "participants",

            "quizParticipants"

        ];


        for (

            const key of storageKeys

        ) {

            try {

                const data =
                    JSON.parse(
                        localStorage.getItem(
                            key
                        )
                    );

                if (

                    Array.isArray(
                        data
                    )

                ) {

                    return data;

                }

            }

            catch (error) {

                console.error(
                    error
                );

            }

        }

        return [];

    },


    loadPrizeRecords() {

        try {

            return JSON.parse(

                localStorage.getItem(

                    this.storageKeys.prizes

                )

            ) || [];

        }

        catch (error) {

            console.error(
                error
            );

            return [];

        }

    },


    loadCertificateRecords() {

        try {

            return JSON.parse(

                localStorage.getItem(

                    this.storageKeys.certificates

                )

            ) || [];

        }

        catch (error) {

            console.error(
                error
            );

            return [];

        }

    },


    buildReportRows() {

        this.filteredRows =

            this.participants.map(

                participant => {

                    const prize =

                        this.prizes.find(

                            prize =>

                                String(
                                    prize.participantId
                                ) ===

                                String(
                                    participant.id
                                )

                        ) ||

                        null;


                    const certificate =

                        this.certificates.find(

                            certificate =>

                                String(
                                    certificate.participantId
                                ) ===

                                String(
                                    participant.id
                                )

                        ) ||

                        null;


                    return {

                        participant,

                        prize,

                        certificate

                    };

                }

            );

    },


    findParticipant(

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

        );

    },


    findPrize(

        participantId

    ) {

        return this.prizes.find(

            prize =>

                String(
                    prize.participantId
                ) ===

                String(
                    participantId
                )

        ) || null;

    },


    findCertificate(

        participantId

    ) {

        return this.certificates.find(

            certificate =>

                String(
                    certificate.participantId
                ) ===

                String(
                    participantId
                )

        ) || null;

    },


    refresh() {

        this.buildReportRows();

        this.updateStatistics();

        this.renderTable();

        this.renderCharts();

    },
    updateStatistics() {

        const participantCount =
            this.participants.length;

        const completedParticipants =
            this.participants.filter(
                participant =>
                    this.isParticipantCompleted(
                        participant
                    )
            );

        const completedCount =
            completedParticipants.length;

        const winners =
            this.participants.filter(
                participant => {

                    const position =
                        this.getParticipantPosition(
                            participant
                        );

                    return (
                        position >= 1 &&
                        position <= 3
                    );

                }
            );

        const awardedPrizes =
            this.prizes.filter(
                prize =>
                    this.isPrizeAwarded(
                        prize
                    )
            );

        const generatedCertificates =
            this.certificates.filter(
                certificate =>
                    this.isCertificateGenerated(
                        certificate
                    )
            );

        const completedScores =
            completedParticipants
                .map(
                    participant =>
                        this.getParticipantScore(
                            participant
                        )
                )
                .filter(
                    score =>
                        Number.isFinite(
                            score
                        )
                );

        const totalScore =
            completedScores.reduce(
                (
                    total,
                    score
                ) =>
                    total + score,
                0
            );

        const averageScore =
            completedScores.length > 0
                ? Math.round(
                    totalScore /
                    completedScores.length
                )
                : 0;

        AdminCommon.setText(
            this.elements
                .reportTotalParticipants,
            participantCount
        );

        AdminCommon.setText(
            this.elements
                .reportCompletedCompetitions,
            completedCount
        );

        AdminCommon.setText(
            this.elements
                .reportTotalWinners,
            winners.length
        );

        AdminCommon.setText(
            this.elements
                .reportPrizesAwarded,
            awardedPrizes.length
        );

        AdminCommon.setText(
            this.elements
                .reportCertificatesGenerated,
            generatedCertificates.length
        );

        AdminCommon.setText(
            this.elements
                .reportAverageScore,
            `${averageScore}%`
        );

        this.updateFilteredSummary();

    },


    updateFilteredSummary() {

        const total =
            this.filteredRows.length;

        const completedRows =
            this.filteredRows.filter(
                row =>
                    this.isParticipantCompleted(
                        row.participant
                    )
            );

        const completedCount =
            completedRows.length;

        const completedScores =
            completedRows
                .map(
                    row =>
                        this.getParticipantScore(
                            row.participant
                        )
                )
                .filter(
                    score =>
                        Number.isFinite(
                            score
                        )
                );

        const totalScore =
            completedScores.reduce(
                (
                    sum,
                    score
                ) =>
                    sum + score,
                0
            );

        const averageScore =
            completedScores.length > 0
                ? Math.round(
                    totalScore /
                    completedScores.length
                )
                : 0;

        const winners =
            this.filteredRows.filter(
                row => {

                    const position =
                        this.getParticipantPosition(
                            row.participant
                        );

                    return (
                        position >= 1 &&
                        position <= 3
                    );

                }
            );

        const prizeCount =
            this.filteredRows.filter(
                row =>
                    this.isPrizeAwarded(
                        row.prize
                    )
            ).length;

        const certificateCount =
            this.filteredRows.filter(
                row =>
                    this.isCertificateGenerated(
                        row.certificate
                    )
            ).length;

        const completionRate =
            total > 0
                ? Math.round(
                    (
                        completedCount /
                        total
                    ) *
                    100
                )
                : 0;

        AdminCommon.setText(
            this.elements.summaryParticipants,
            total
        );

        AdminCommon.setText(
            this.elements.summaryAverageScore,
            `${averageScore}%`
        );

        AdminCommon.setText(
            this.elements.summaryWinners,
            winners.length
        );

        AdminCommon.setText(
            this.elements.summaryPrizes,
            prizeCount
        );

        AdminCommon.setText(
            this.elements.summaryCertificates,
            certificateCount
        );

        AdminCommon.setText(
            this.elements.summaryCompletionRate,
            `${completionRate}%`
        );

        AdminCommon.setText(
            this.elements.reportResultSummary,
            `Showing ${total} participant${total === 1 ? "" : "s"
            }`
        );

    },


    isParticipantCompleted(
        participant
    ) {

        if (!participant) {

            return false;

        }

        const status =
            String(
                participant.status ||
                participant.competitionStatus ||
                participant.progressStatus ||
                ""
            )
                .trim()
                .toLowerCase();

        if (
            status.includes(
                "complete"
            ) ||
            status.includes(
                "qualified"
            ) ||
            status.includes(
                "final"
            ) ||
            status.includes(
                "finished"
            )
        ) {

            return true;

        }

        const completedFlags = [

            participant.completed,

            participant.isCompleted,

            participant.quizCompleted,

            participant.competitionCompleted,

            participant.finalCompleted

        ];

        if (
            completedFlags.some(
                value =>
                    value === true ||
                    String(value)
                        .toLowerCase() ===
                    "true"
            )
        ) {

            return true;

        }

        return (
            this.getParticipantScore(
                participant
            ) > 0
        );

    },


    isPrizeAwarded(
        prize
    ) {

        if (!prize) {

            return false;

        }

        if (
            prize.awarded === true ||
            prize.issued === true ||
            prize.delivered === true
        ) {

            return true;

        }

        const status =
            String(
                prize.status ||
                prize.prizeStatus ||
                ""
            )
                .trim()
                .toLowerCase();

        return (
            status.includes(
                "award"
            ) ||
            status.includes(
                "issued"
            ) ||
            status.includes(
                "deliver"
            ) ||
            status.includes(
                "collect"
            )
        );

    },


    isCertificateGenerated(
        certificate
    ) {

        if (!certificate) {

            return false;

        }

        if (
            certificate.certificateIssued ===
            true
        ) {

            return true;

        }

        const status =
            String(
                certificate.status ||
                certificate.certificateStatus ||
                ""
            )
                .trim()
                .toLowerCase();

        if (
            status === "pending" ||
            status === "not generated" ||
            status === "not issued"
        ) {

            return false;

        }

        return Boolean(
            certificate.number ||
            certificate.certificateNumber ||
            certificate.id ||
            status
        );

    },
    renderTable() {

        const tbody =
            this.elements.reportTableBody;

        if (!tbody) {

            return;

        }

        tbody.innerHTML = "";

        if (
            this.filteredRows.length === 0
        ) {

            this.elements
                .reportTableWrapper
                ?.setAttribute(
                    "hidden",
                    ""
                );

            this.elements
                .reportEmptyState
                ?.removeAttribute(
                    "hidden"
                );

            this.updateFilteredSummary();

            return;

        }

        this.elements
            .reportTableWrapper
            ?.removeAttribute(
                "hidden"
            );

        this.elements
            .reportEmptyState
            ?.setAttribute(
                "hidden",
                ""
            );

        const fragment =
            document.createDocumentFragment();

        this.filteredRows.forEach(
            row => {

                const participant =
                    row.participant;

                const score =
                    this.getParticipantScore(
                        participant
                    );

                const position =
                    this.getParticipantPosition(
                        participant
                    );

                const tr =
                    document.createElement(
                        "tr"
                    );

                tr.dataset.participantId =
                    participant.id;

                tr.innerHTML = `

<td>

<div class="participant-cell">

<div class="participant-avatar">

${AdminCommon.escapeHTML(

                    this.getInitials(

                        this.getParticipantName(
                            participant
                        )

                    )

                )}

</div>

<div>

<strong>

${AdminCommon.escapeHTML(

                    this.getParticipantName(
                        participant
                    )

                )}

</strong>

<small>

${AdminCommon.escapeHTML(

                    this.getParticipantParentName(
                        participant
                    )

                )}

</small>

</div>

</div>

</td>

<td>

${this.renderGroupBadge(

                    this.getParticipantGroup(
                        participant
                    )

                )}

</td>

<td>

${AdminCommon.escapeHTML(

                    this.getParticipantCompetition(
                        participant
                    )

                )}

</td>

<td>

${this.renderScoreBadge(
                    score
                )}

</td>

<td>

${this.renderPositionBadge(
                    position
                )}

</td>

<td>

${this.renderPrizeBadge(
                    row.prize
                )}

</td>

<td>

${this.renderCertificateBadge(
                    row.certificate
                )}

</td>

<td>

${this.renderStatusBadge(

                    this.getParticipantStatus(
                        participant
                    )

                )}

</td>

<td>

<div class="table-actions">

<button
class="icon-btn"
type="button"
data-action="view"
data-participant-id="${participant.id}"
title="View Report">

<i class="fas fa-eye"></i>

</button>

<button
class="icon-btn"
type="button"
data-action="print"
data-participant-id="${participant.id}"
title="Print Report">

<i class="fas fa-print"></i>

</button>

</div>

</td>

`;

                fragment.appendChild(
                    tr
                );

            }

        );

        tbody.appendChild(
            fragment
        );

        this.updateFilteredSummary();

    },
    applyFilters() {

        const selectedGroup =
            this.elements
                .reportGroupFilter
                ?.value
                ?.trim()
                ?.toUpperCase() || "";

        const selectedCompetition =
            this.elements
                .reportCompetitionFilter
                ?.value
                ?.trim()
                ?.toLowerCase() || "";

        const minimumScore =
            Number(
                this.elements
                    .reportScoreFilter
                    ?.value || 0
            );

        const dateFrom =
            this.parseDateInput(
                this.elements
                    .reportDateFrom
                    ?.value
            );

        const dateTo =
            this.parseDateInput(
                this.elements
                    .reportDateTo
                    ?.value,
                true
            );

        const reportRows =
            this.buildRowsFromParticipants();

        this.filteredRows =
            reportRows.filter(
                row => {

                    const participant =
                        row.participant;

                    const participantGroup =
                        this.getParticipantGroup(
                            participant
                        )
                            .toUpperCase();

                    if (
                        selectedGroup &&
                        participantGroup !==
                        selectedGroup
                    ) {

                        return false;

                    }

                    const competition =
                        this.getParticipantCompetition(
                            participant
                        )
                            .trim()
                            .toLowerCase();

                    if (
                        selectedCompetition &&
                        competition !==
                        selectedCompetition
                    ) {

                        return false;

                    }

                    const participantScore =
                        this.getParticipantScore(
                            participant
                        );

                    if (
                        minimumScore > 0 &&
                        participantScore <
                        minimumScore
                    ) {

                        return false;

                    }

                    const registrationDate =
                        this.getParticipantRegistrationDate(
                            participant
                        );

                    if (
                        dateFrom &&
                        (
                            !registrationDate ||
                            registrationDate <
                            dateFrom
                        )
                    ) {

                        return false;

                    }

                    if (
                        dateTo &&
                        (
                            !registrationDate ||
                            registrationDate >
                            dateTo
                        )
                    ) {

                        return false;

                    }

                    return true;

                }
            );

        this.renderTable();

        this.renderCharts();

        AdminCommon.showToast(
            `${this.filteredRows.length} report result${this.filteredRows.length === 1
                ? ""
                : "s"
            } found.`,
            "success"
        );

    },


    resetFilters() {

        if (
            this.elements
                .reportGroupFilter
        ) {

            this.elements
                .reportGroupFilter
                .value = "";

        }

        if (
            this.elements
                .reportCompetitionFilter
        ) {

            this.elements
                .reportCompetitionFilter
                .value = "";

        }

        if (
            this.elements
                .reportScoreFilter
        ) {

            this.elements
                .reportScoreFilter
                .value = "";

        }

        if (
            this.elements
                .reportDateFrom
        ) {

            this.elements
                .reportDateFrom
                .value = "";

        }

        if (
            this.elements
                .reportDateTo
        ) {

            this.elements
                .reportDateTo
                .value = "";

        }

        this.filteredRows =
            this.buildRowsFromParticipants();

        this.renderTable();

        this.renderCharts();

        AdminCommon.showToast(
            "Report filters cleared.",
            "info"
        );

    },


    generateQuickReport(
        type
    ) {

        const normalizedType =
            String(type || "")
                .trim()
                .toLowerCase();

        this.clearFilterInputs();

        const allRows =
            this.buildRowsFromParticipants();

        switch (
        normalizedType
        ) {

            case "group-a":

                this.elements
                    .reportGroupFilter
                    .value = "A";

                this.filteredRows =
                    allRows.filter(
                        row =>
                            this.getParticipantGroup(
                                row.participant
                            ) === "A"
                    );

                break;


            case "group-b":

                this.elements
                    .reportGroupFilter
                    .value = "B";

                this.filteredRows =
                    allRows.filter(
                        row =>
                            this.getParticipantGroup(
                                row.participant
                            ) === "B"
                    );

                break;


            case "group-c":

                this.elements
                    .reportGroupFilter
                    .value = "C";

                this.filteredRows =
                    allRows.filter(
                        row =>
                            this.getParticipantGroup(
                                row.participant
                            ) === "C"
                    );

                break;


            case "winners":

                this.filteredRows =
                    allRows.filter(
                        row => {

                            const position =
                                this.getParticipantPosition(
                                    row.participant
                                );

                            return (
                                position >= 1 &&
                                position <= 3
                            );

                        }
                    );

                break;


            case "prizes":

                this.filteredRows =
                    allRows.filter(
                        row =>
                            this.isPrizeAwarded(
                                row.prize
                            )
                    );

                break;


            case "certificates":

                this.filteredRows =
                    allRows.filter(
                        row =>
                            this.isCertificateGenerated(
                                row.certificate
                            )
                    );

                break;


            case "completed":

                this.filteredRows =
                    allRows.filter(
                        row =>
                            this.isParticipantCompleted(
                                row.participant
                            )
                    );

                break;


            case "qualified":

                this.filteredRows =
                    allRows.filter(
                        row =>
                            this.getParticipantScore(
                                row.participant
                            ) >= 80
                    );

                break;


            case "pending":

                this.filteredRows =
                    allRows.filter(
                        row =>
                            !this.isParticipantCompleted(
                                row.participant
                            )
                    );

                break;


            case "all":

            default:

                this.filteredRows =
                    allRows;

                break;

        }

        this.renderTable();

        this.renderCharts();

        const reportName =
            this.getQuickReportLabel(
                normalizedType
            );

        AdminCommon.showToast(
            `${reportName} generated.`,
            "success"
        );

    },


    buildRowsFromParticipants() {

        return this.participants.map(
            participant => ({

                participant,

                prize:
                    this.findPrize(
                        participant.id
                    ),

                certificate:
                    this.findCertificate(
                        participant.id
                    )

            })
        );

    },


    clearFilterInputs() {

        const filterElements = [

            this.elements
                .reportCompetitionFilter,

            this.elements
                .reportGroupFilter,

            this.elements
                .reportScoreFilter,

            this.elements
                .reportDateFrom,

            this.elements
                .reportDateTo

        ];

        filterElements.forEach(
            element => {

                if (element) {

                    element.value = "";

                }

            }
        );

    },


    getParticipantRegistrationDate(
        participant
    ) {

        const value =
            participant.registrationDate ||
            participant.registeredAt ||
            participant.createdAt ||
            participant.date ||
            participant.submittedAt ||
            "";

        if (!value) {

            return null;

        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return null;

        }

        return date;

    },


    parseDateInput(
        value,
        endOfDay = false
    ) {

        if (!value) {

            return null;

        }

        const date =
            new Date(
                `${value}T${endOfDay
                    ? "23:59:59.999"
                    : "00:00:00.000"
                }`
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return null;

        }

        return date;

    },


    getQuickReportLabel(
        type
    ) {

        const labels = {

            "group-a":
                "Group A report",

            "group-b":
                "Group B report",

            "group-c":
                "Group C report",

            winners:
                "Winner report",

            prizes:
                "Prize report",

            certificates:
                "Certificate report",

            completed:
                "Completed participant report",

            qualified:
                "Qualified participant report",

            pending:
                "Pending participant report",

            all:
                "Full participant report"

        };

        return (
            labels[type] ||
            "Participant report"
        );

    },
    renderCharts() {

        if (
            typeof Chart ===
            "undefined"
        ) {

            return;

        }

        this.destroyCharts();

        this.createGroupChart();

        this.createScoreChart();

        this.createPrizeChart();

        this.createCertificateChart();

    },


    destroyCharts() {

        Object.values(
            this.charts
        ).forEach(chart => {

            if (
                chart &&
                typeof chart.destroy ===
                "function"
            ) {

                chart.destroy();

            }

        });

        this.charts = {};

    },


    createGroupChart() {

        const canvas =
            document.getElementById(
                "groupChart"
            );

        if (!canvas) {

            return;

        }

        const groups = {

            A: 0,

            B: 0,

            C: 0

        };

        this.filteredRows.forEach(
            row => {

                const group =
                    this.getParticipantGroup(
                        row.participant
                    );

                if (
                    groups[group] !==
                    undefined
                ) {

                    groups[group]++;

                }

            }
        );

        this.charts.group =
            new Chart(
                canvas,
                {

                    type: "doughnut",

                    data: {

                        labels: [

                            "Group A",

                            "Group B",

                            "Group C"

                        ],

                        datasets: [{

                            data: [

                                groups.A,

                                groups.B,

                                groups.C

                            ]

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false

                    }

                }

            );

    },


    createScoreChart() {

        const canvas =
            document.getElementById(
                "scoreChart"
            );

        if (!canvas) {

            return;

        }

        const scores = {

            A: [],

            B: [],

            C: []

        };

        this.filteredRows.forEach(
            row => {

                const participant =
                    row.participant;

                const group =
                    this.getParticipantGroup(
                        participant
                    );

                scores[group]?.push(

                    this.getParticipantScore(
                        participant
                    )

                );

            }
        );

        const average =
            group => {

                if (
                    scores[group].length === 0
                ) {

                    return 0;

                }

                return Math.round(

                    scores[group].reduce(
                        (a, b) => a + b,
                        0
                    ) /

                    scores[group].length

                );

            };

        this.charts.score =
            new Chart(
                canvas,
                {

                    type: "bar",

                    data: {

                        labels: [

                            "Group A",

                            "Group B",

                            "Group C"

                        ],

                        datasets: [{

                            label: "Average Score",

                            data: [

                                average("A"),

                                average("B"),

                                average("C")

                            ]

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {

                                beginAtZero: true,

                                max: 100

                            }

                        }

                    }

                }

            );

    },


    createPrizeChart() {

        const canvas =
            document.getElementById(
                "prizeChart"
            );

        if (!canvas) {

            return;

        }

        const awarded =
            this.filteredRows.filter(
                row =>

                    this.isPrizeAwarded(
                        row.prize
                    )

            ).length;

        const pending =

            this.filteredRows.length -

            awarded;

        this.charts.prize =
            new Chart(
                canvas,
                {

                    type: "pie",

                    data: {

                        labels: [

                            "Awarded",

                            "Pending"

                        ],

                        datasets: [{

                            data: [

                                awarded,

                                pending

                            ]

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false

                    }

                }

            );

    },


    createCertificateChart() {

        const canvas =
            document.getElementById(
                "certificateChart"
            );

        if (!canvas) {

            return;

        }

        const generated =
            this.filteredRows.filter(
                row =>

                    this.isCertificateGenerated(
                        row.certificate
                    )

            ).length;

        const pending =

            this.filteredRows.length -

            generated;

        this.charts.certificate =
            new Chart(
                canvas,
                {

                    type: "pie",

                    data: {

                        labels: [

                            "Generated",

                            "Pending"

                        ],

                        datasets: [{

                            data: [

                                generated,

                                pending

                            ]

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false

                    }

                }

            );

    },
    openParticipantReport(
        participantId
    ) {

        const participant =
            this.findParticipant(
                participantId
            );

        if (!participant) {

            AdminCommon.showToast(
                "Participant record was not found.",
                "error"
            );

            return;

        }

        const prize =
            this.findPrize(
                participantId
            );

        const certificate =
            this.findCertificate(
                participantId
            );

        const modal =
            this.elements.reportModal;

        const modalContent =
            this.elements.reportModalContent;

        if (
            !modal ||
            !modalContent
        ) {

            console.error(
                "Report modal elements are missing."
            );

            return;

        }

        modalContent.innerHTML =
            this.buildParticipantReportHTML(
                participant,
                prize,
                certificate
            );

        modal.removeAttribute(
            "hidden"
        );

        modal.classList.add(
            "is-open"
        );

        document.body.classList.add(
            "modal-open"
        );

        const closeButton =
            modal.querySelector(
                "[data-close-report-modal]"
            );

        closeButton?.focus();

    },


    closeParticipantReport() {

        const modal =
            this.elements.reportModal;

        if (!modal) {

            return;

        }

        modal.classList.remove(
            "is-open"
        );

        modal.setAttribute(
            "hidden",
            ""
        );

        document.body.classList.remove(
            "modal-open"
        );

    },


    buildParticipantReportHTML(
        participant,
        prize,
        certificate
    ) {

        const participantId =
            participant.id;

        const name =
            this.getParticipantName(
                participant
            );

        const parentName =
            this.getParticipantParentName(
                participant
            );

        const group =
            this.getParticipantGroup(
                participant
            );

        const competition =
            this.getParticipantCompetition(
                participant
            );

        const score =
            this.getParticipantScore(
                participant
            );

        const position =
            this.getParticipantPosition(
                participant
            );

        const status =
            this.getParticipantStatus(
                participant
            );

        const registrationDate =
            this.getParticipantRegistrationDate(
                participant
            );

        const sectionScores =
            this.getParticipantSectionScores(
                participant
            );

        return `

<div class="report-modal-header">

    <div>

        <p class="report-eyebrow">
            Kiddysexplorer Competition Report
        </p>

        <h2>
            ${AdminCommon.escapeHTML(name)}
        </h2>

        <p>
            Participant ID:
            <strong>
                ${AdminCommon.escapeHTML(
            String(participantId || "—")
        )}
            </strong>
        </p>

    </div>

    <button
        type="button"
        class="icon-btn"
        data-close-report-modal
        aria-label="Close report"
        title="Close"
    >
        <i class="fas fa-times"></i>
    </button>

</div>


<div class="report-profile-summary">

    <div class="report-avatar-large">

        ${AdminCommon.escapeHTML(
            this.getInitials(name)
        )}

    </div>

    <div>

        <h3>
            ${AdminCommon.escapeHTML(name)}
        </h3>

        <p>
            ${AdminCommon.escapeHTML(
            parentName || "Parent or guardian not provided"
        )}
        </p>

        <div class="report-badge-list">

            ${this.renderGroupBadge(group)}

            ${this.renderStatusBadge(status)}

            ${this.renderScoreBadge(score)}

            ${this.renderPositionBadge(position)}

        </div>

    </div>

</div>


<div class="report-information-grid">

    ${this.renderReportInformationItem(
            "Competition",
            competition,
            "fa-trophy"
        )}

    ${this.renderReportInformationItem(
            "Group",
            group
                ? `Group ${group}`
                : "Not assigned",
            "fa-users"
        )}

    ${this.renderReportInformationItem(
            "Final score",
            score > 0
                ? `${score}%`
                : "Not scored",
            "fa-chart-line"
        )}

    ${this.renderReportInformationItem(
            "Final position",
            position > 0
                ? this.formatOrdinal(position)
                : "Not ranked",
            "fa-medal"
        )}

    ${this.renderReportInformationItem(
            "Registration date",
            this.formatDisplayDate(
                registrationDate
            ),
            "fa-calendar-alt"
        )}

    ${this.renderReportInformationItem(
            "Competition status",
            status || "Pending",
            "fa-flag-checkered"
        )}

</div>


<section class="report-section">

    <div class="report-section-heading">

        <div>

            <p class="report-eyebrow">
                Performance
            </p>

            <h3>
                Section Results
            </h3>

        </div>

    </div>

    ${this.renderSectionScores(
            sectionScores
        )}

</section>


<section class="report-section">

    <div class="report-section-heading">

        <div>

            <p class="report-eyebrow">
                Recognition
            </p>

            <h3>
                Prize and Certificate
            </h3>

        </div>

    </div>

    <div class="report-information-grid">

        ${this.renderReportInformationItem(
            "Prize",
            prize
                ? this.getPrizeName(prize)
                : "No prize recorded",
            "fa-gift"
        )}

        ${this.renderReportInformationItem(
            "Prize status",
            prize
                ? this.getPrizeStatus(prize)
                : "Not awarded",
            "fa-award"
        )}

        ${this.renderReportInformationItem(
            "Certificate",
            certificate
                ? this.getCertificateStatus(
                    certificate
                )
                : "Not generated",
            "fa-certificate"
        )}

        ${this.renderReportInformationItem(
            "Certificate number",
            this.getCertificateNumber(
                certificate
            ),
            "fa-hashtag"
        )}

    </div>

</section>


<section class="report-section">

    <div class="report-section-heading">

        <div>

            <p class="report-eyebrow">
                Parent Information
            </p>

            <h3>
                Contact Details
            </h3>

        </div>

    </div>

    <div class="report-information-grid">

        ${this.renderReportInformationItem(
            "Parent or guardian",
            parentName ||
            "Not provided",
            "fa-user"
        )}

        ${this.renderReportInformationItem(
            "Email address",
            this.getParticipantParentEmail(
                participant
            ),
            "fa-envelope"
        )}

        ${this.renderReportInformationItem(
            "Phone number",
            this.getParticipantParentPhone(
                participant
            ),
            "fa-phone"
        )}

        ${this.renderReportInformationItem(
            "Participant age",
            this.getParticipantAge(
                participant
            ),
            "fa-child"
        )}

    </div>

</section>


<div class="report-modal-actions">

    <button
        type="button"
        class="btn btn-secondary"
        data-close-report-modal
    >
        Close
    </button>

    <button
        type="button"
        class="btn btn-primary"
        data-action="print-modal-report"
        data-participant-id="${AdminCommon.escapeHTML(
            String(participantId)
        )}"
    >
        <i class="fas fa-print"></i>
        Print Report
    </button>

</div>

`;

    },
    exportReport(
        format = "csv"
    ) {

        const normalizedFormat =
            String(format || "csv")
                .trim()
                .toLowerCase();

        if (
            this.filteredRows.length === 0
        ) {

            AdminCommon.showToast(
                "There are no report records to export.",
                "warning"
            );

            return;

        }

        switch (
        normalizedFormat
        ) {

            case "json":

                this.exportReportAsJSON();

                break;

            case "print":

            case "pdf":

                this.printFullReport();

                break;

            case "csv":

            default:

                this.exportReportAsCSV();

                break;

        }

    },


    exportReportAsCSV() {

        const headers = [

            "Participant ID",

            "Participant Name",

            "Parent or Guardian",

            "Parent Email",

            "Parent Phone",

            "Age",

            "Group",

            "Competition",

            "Section 1 Score",

            "Section 2 Score",

            "Section 3 Score",

            "Final Score",

            "Final Position",

            "Competition Status",

            "Prize",

            "Prize Status",

            "Certificate Status",

            "Certificate Number",

            "Registration Date"

        ];

        const rows =
            this.filteredRows.map(
                row => {

                    const participant =
                        row.participant;

                    const sectionScores =
                        this.getParticipantSectionScores(
                            participant
                        );

                    return [

                        participant.id || "",

                        this.getParticipantName(
                            participant
                        ),

                        this.getParticipantParentName(
                            participant
                        ),

                        this.getParticipantParentEmail(
                            participant
                        ),

                        this.getParticipantParentPhone(
                            participant
                        ),

                        this.getParticipantAge(
                            participant
                        ),

                        this.getParticipantGroup(
                            participant
                        ),

                        this.getParticipantCompetition(
                            participant
                        ),

                        this.formatExportScore(
                            sectionScores[0]?.score
                        ),

                        this.formatExportScore(
                            sectionScores[1]?.score
                        ),

                        this.formatExportScore(
                            sectionScores[2]?.score
                        ),

                        this.formatExportScore(
                            this.getParticipantScore(
                                participant
                            )
                        ),

                        this.getParticipantPosition(
                            participant
                        ) || "",

                        this.getParticipantStatus(
                            participant
                        ),

                        row.prize
                            ? this.getPrizeName(
                                row.prize
                            )
                            : "",

                        this.getPrizeStatus(
                            row.prize
                        ),

                        row.certificate
                            ? this.getCertificateStatus(
                                row.certificate
                            )
                            : "Not generated",

                        this.getCertificateNumber(
                            row.certificate
                        ),

                        this.formatDisplayDate(
                            this.getParticipantRegistrationDate(
                                participant
                            )
                        )

                    ];

                }
            );

        const csvContent =
            [

                headers,

                ...rows

            ]
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

        this.downloadTextFile(
            csvContent,
            this.createReportFilename(
                "csv"
            ),
            "text/csv;charset=utf-8"
        );

        AdminCommon.showToast(
            `${rows.length} report record${rows.length === 1
                ? ""
                : "s"
            } exported as CSV.`,
            "success"
        );

    },
    downloadTextFile(
        content,
        filename,
        mimeType
    ) {

        const blob =
            new Blob(
                [
                    "\uFEFF",
                    content
                ],
                {
                    type:
                        mimeType ||
                        "text/plain;charset=utf-8"
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

        link.style.display =
            "none";

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

    },


    createReportFilename(
        extension
    ) {

        const date =
            new Date();

        const dateStamp =
            [

                date.getFullYear(),

                String(
                    date.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                ),

                String(
                    date.getDate()
                ).padStart(
                    2,
                    "0"
                )

            ].join("-");

        const timeStamp =
            [

                String(
                    date.getHours()
                ).padStart(
                    2,
                    "0"
                ),

                String(
                    date.getMinutes()
                ).padStart(
                    2,
                    "0"
                )

            ].join("-");

        return (
            `kiddysexplorer-report-${dateStamp}-${timeStamp}.${extension}`
        );

    },
    printFullReport() {

        if (
            this.filteredRows.length === 0
        ) {

            AdminCommon.showToast(
                "There are no report records to print.",
                "warning"
            );

            return;

        }

        const printWindow =
            window.open(
                "",
                "_blank",
                "width=1200,height=850"
            );

        if (!printWindow) {

            AdminCommon.showToast(
                "The print window was blocked. Please allow pop-ups and try again.",
                "error"
            );

            return;

        }

        printWindow.document.write(
            this.buildPrintableFullReportDocument()
        );

        printWindow.document.close();

        printWindow.focus();

        printWindow.addEventListener(
            "load",
            () => {

                window.setTimeout(
                    () => {

                        printWindow.print();

                    },
                    250
                );

            },
            {
                once: true
            }
        );

    },
    buildPrintableFullReportDocument() {

        const statistics =
            this.getExportStatistics();

        const tableRows =
            this.filteredRows
                .map(
                    row => {

                        const participant =
                            row.participant;

                        const name =
                            this.getParticipantName(
                                participant
                            );

                        const group =
                            this.getParticipantGroup(
                                participant
                            );

                        const score =
                            this.getParticipantScore(
                                participant
                            );

                        const position =
                            this.getParticipantPosition(
                                participant
                            );

                        return `

<tr>

    <td>
        ${AdminCommon.escapeHTML(
                            String(
                                participant.id || "—"
                            )
                        )}
    </td>

    <td>
        ${AdminCommon.escapeHTML(name)}
    </td>

    <td>
        ${AdminCommon.escapeHTML(
                            group
                                ? `Group ${group}`
                                : "—"
                        )}
    </td>

    <td>
        ${AdminCommon.escapeHTML(
                            this.getParticipantCompetition(
                                participant
                            )
                        )}
    </td>

    <td>
        ${score > 0
                                ? `${score}%`
                                : "—"
                            }
    </td>

    <td>
        ${position > 0
                                ? AdminCommon.escapeHTML(
                                    this.formatOrdinal(
                                        position
                                    )
                                )
                                : "—"
                            }
    </td>

    <td>
        ${AdminCommon.escapeHTML(
                                this.getParticipantStatus(
                                    participant
                                )
                            )}
    </td>

    <td>
        ${AdminCommon.escapeHTML(
                                row.prize
                                    ? this.getPrizeName(
                                        row.prize
                                    )
                                    : "None"
                            )}
    </td>

    <td>
        ${AdminCommon.escapeHTML(
                                row.certificate
                                    ? this.getCertificateStatus(
                                        row.certificate
                                    )
                                    : "Pending"
                            )}
    </td>

</tr>

`;

                    }
                )
                .join("");

        return `

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
    Kiddysexplorer Participant Report
</title>

<style>

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 30px;
        color: #1f2937;
        background: #ffffff;
        font-family:
            Arial,
            Helvetica,
            sans-serif;
        line-height: 1.45;
    }

    .report-page {
        max-width: 1200px;
        margin: 0 auto;
    }

    .report-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 30px;
        padding-bottom: 20px;
        border-bottom: 3px solid #5b21b6;
    }

    .report-header h1 {
        margin: 0;
        color: #5b21b6;
        font-size: 27px;
    }

    .report-header p {
        margin: 6px 0 0;
    }

    .report-date {
        font-size: 13px;
        text-align: right;
    }

    .statistics-grid {
        display: grid;
        grid-template-columns:
            repeat(6, 1fr);
        gap: 10px;
        margin: 24px 0;
    }

    .statistic-card {
        padding: 14px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        text-align: center;
    }

    .statistic-card span {
        display: block;
        color: #6b7280;
        font-size: 11px;
        text-transform: uppercase;
    }

    .statistic-card strong {
        display: block;
        margin-top: 5px;
        color: #5b21b6;
        font-size: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
    }

    th,
    td {
        padding: 8px;
        border: 1px solid #d1d5db;
        text-align: left;
        vertical-align: top;
    }

    th {
        color: #111827;
        background: #f3f4f6;
        font-weight: bold;
    }

    tbody tr:nth-child(even) {
        background: #fafafa;
    }

    .report-footer {
        margin-top: 28px;
        padding-top: 14px;
        color: #6b7280;
        border-top: 1px solid #d1d5db;
        font-size: 11px;
        text-align: center;
    }

    @media print {

        body {
            padding: 0;
        }

        .report-page {
            max-width: none;
        }

        table {
            font-size: 9px;
        }

        th,
        td {
            padding: 5px;
        }

        .statistics-grid {
            grid-template-columns:
                repeat(6, 1fr);
        }

        thead {
            display: table-header-group;
        }

        tr {
            page-break-inside: avoid;
        }

        @page {
            size: A4 landscape;
            margin: 10mm;
        }

    }

</style>

</head>

<body>

<div class="report-page">

    <header class="report-header">

        <div>

            <h1>
                KIDDYSEXPLORER
            </h1>

            <p>
                Participant Competition Report
            </p>

        </div>

        <div class="report-date">

            <strong>
                Generated:
            </strong>

            <br>

            ${AdminCommon.escapeHTML(
            this.formatDisplayDate(
                new Date()
            )
        )}

            <br>

            <strong>
                Records:
            </strong>

            ${statistics.totalParticipants}

        </div>

    </header>


    <section class="statistics-grid">

        ${this.buildPrintableStatistic(
            "Participants",
            statistics.totalParticipants
        )}

        ${this.buildPrintableStatistic(
            "Completed",
            statistics.completedParticipants
        )}

        ${this.buildPrintableStatistic(
            "Winners",
            statistics.winners
        )}

        ${this.buildPrintableStatistic(
            "Prizes",
            statistics.prizesAwarded
        )}

        ${this.buildPrintableStatistic(
            "Certificates",
            statistics.certificatesGenerated
        )}

        ${this.buildPrintableStatistic(
            "Average Score",
            `${statistics.averageScore}%`
        )}

    </section>


    <table>

        <thead>

            <tr>

                <th>ID</th>

                <th>Participant</th>

                <th>Group</th>

                <th>Competition</th>

                <th>Score</th>

                <th>Position</th>

                <th>Status</th>

                <th>Prize</th>

                <th>Certificate</th>

            </tr>

        </thead>

        <tbody>

            ${tableRows}

        </tbody>

    </table>


    <footer class="report-footer">

        This report contains
        ${statistics.totalParticipants}
        participant record${statistics.totalParticipants === 1
                ? ""
                : "s"
            } from the Kiddysexplorer administration system.

    </footer>

</div>

</body>

</html>

`;

    },


    buildPrintableStatistic(
        label,
        value
    ) {

        return `

<div class="statistic-card">

    <span>
        ${AdminCommon.escapeHTML(label)}
    </span>

    <strong>
        ${AdminCommon.escapeHTML(
            String(value)
        )}
    </strong>

</div>

`;

    },
    this.elements
        .exportCsvButton
        ?.addEventListener(
            "click",
            () => {

                this.exportReport(
                    "csv"
                );

            }
        );


    this.elements
        .exportJsonButton
        ?.addEventListener(
            "click",
            () => {

                this.exportReport(
                    "json"
                );

            }
        );


    this.elements
        .printReportButton
        ?.addEventListener(
            "click",
            () => {

                this.exportReport(
                    "print"
                );

            }
        );
    this.elements.exportCsvButton =
        document.getElementById(
            "exportCsvButton"
        );

    this.elements.exportJsonButton =
        document.getElementById(
            "exportJsonButton"
        );

    this.elements.printReportButton =
        document.getElementById(
            "printReportButton"
        );
    getParticipantName(participant) {

        return (
            participant.fullName ||
            participant.participantName ||
            participant.name ||
            participant.childName ||
            "Unknown Participant"
        );

    },


    getParticipantParentName(participant) {

        return (
            participant.parentName ||
            participant.guardianName ||
            participant.contactPerson ||
            ""
        );

    },


    getParticipantCompetition(participant) {

        return (
            participant.competition ||
            participant.category ||
            participant.competitionName ||
            "General Competition"
        );

    },


    getParticipantGroup(participant) {

        return String(

            participant.group ||

            participant.ageGroup ||

            ""

        ).toUpperCase();

    },


    getParticipantStatus(participant) {

        return (

            participant.status ||

            participant.competitionStatus ||

            participant.progressStatus ||

            "Pending"

        );

    },


    getParticipantScore(participant) {

        const score =

            participant.finalScore ??

            participant.totalScore ??

            participant.score ??

            participant.averageScore ??

            0;

        return Number(score) || 0;

    },


    getParticipantPosition(participant) {

        const position =

            participant.finalPosition ??

            participant.position ??

            participant.rank ??

            participant.place ??

            0;

        return Number(position) || 0;

    },


    getPrizeName(prize) {

        if (!prize) {

            return "No Prize";

        }

        return (

            prize.prizeName ||

            prize.name ||

            prize.title ||

            "Prize"

        );

    },


    getCertificateStatus(certificate) {

        if (!certificate) {

            return "Pending";

        }

        return (

            certificate.status ||

            certificate.certificateStatus ||

            "Generated"

        );

    },


    getInitials(name) {

        if (!name) {

            return "?";

        }

        return name

            .split(/\s+/)

            .slice(0, 2)

            .map(

                word =>

                    word.charAt(0)

            )

            .join("")

            .toUpperCase();

    },


    formatOrdinal(number) {

        number = Number(number);

        if (!number) {

            return "—";

        }

        const mod10 = number % 10;

        const mod100 = number % 100;

        if (

            mod10 === 1 &&

            mod100 !== 11

        ) return `${number}st`;

        if (

            mod10 === 2 &&

            mod100 !== 12

        ) return `${number}nd`;

        if (

            mod10 === 3 &&

            mod100 !== 13

        ) return `${number}rd`;

        return `${number}th`;

    },
    init() {

        this.cacheElements();

        this.bindEvents();

        this.loadData();

        this.refresh();

        console.log(

            "Admin Reports initialized."

        );

    },
    
    document.addEventListener(

        "DOMContentLoaded",

        () => {

            AdminReports.init();

        }

    );
    window.addEventListener(

        "focus",

        () => {

            this.loadData();

            this.refresh();

        }

    );
    refresh() {

        this.loadData();

        this.buildReportRows();

        this.updateStatistics();

        this.renderTable();

        this.renderCharts();

    },