/*=========================================================
  KIDDYSEXPLORER ADMIN CERTIFICATE MANAGEMENT
=========================================================*/

"use strict";


const AdminCertificates = {

    storageKey:
        "kiddysexplorerCertificateRecords",

    prizeStorageKey:
        "kiddysexplorerPrizeRecords",

    participants: [],

    prizeRecords: [],

    certificateRecords: [],

    certificateRows: [],

    filteredRows: [],

    selectedParticipantId: null,

    initialized: false,

    eventsBound: false,


    init() {

        if (this.initialized) {

            return;

        }

        this.initialized = true;

        this.cacheElements();

        this.bindEvents();

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

            refreshBtn:
                document.getElementById(
                    "refreshCertificatesBtn"
                ),

            generateAllBtn:
                document.getElementById(
                    "generateAllCertificatesBtn"
                ),

            generateWinnersBtn:
                document.getElementById(
                    "generateWinnerCertificatesBtn"
                ),

            generateFinalistsBtn:
                document.getElementById(
                    "generateFinalistsBtn"
                ),

            generateGroupBtn:
                document.getElementById(
                    "generateGroupCertificatesBtn"
                ),

            searchInput:
                document.getElementById(
                    "certificateSearchInput"
                ),

            groupFilter:
                document.getElementById(
                    "certificateGroupFilter"
                ),

            typeFilter:
                document.getElementById(
                    "certificateTypeFilter"
                ),

            statusFilter:
                document.getElementById(
                    "certificateStatusFilter"
                ),

            resetFiltersBtn:
                document.getElementById(
                    "resetCertificateFiltersBtn"
                ),

            exportBtn:
                document.getElementById(
                    "exportCertificatesBtn"
                ),

            printListBtn:
                document.getElementById(
                    "printCertificatesBtn"
                ),

            tableContainer:
                document.getElementById(
                    "certificateTableContainer"
                ),

            tableBody:
                document.getElementById(
                    "certificateTableBody"
                ),

            emptyState:
                document.getElementById(
                    "certificateEmptyState"
                ),

            resultSummary:
                document.getElementById(
                    "certificateResultSummary"
                ),

            eligibleCount:
                document.getElementById(
                    "eligibleCertificateCount"
                ),

            generatedCount:
                document.getElementById(
                    "generatedCertificateCount"
                ),

            pendingCount:
                document.getElementById(
                    "pendingCertificateCount"
                ),

            printedCount:
                document.getElementById(
                    "printedCertificateCount"
                ),

            previewWrapper:
                document.getElementById(
                    "certificatePreviewWrapper"
                ),

            previewPlaceholder:
                document.getElementById(
                    "certificatePlaceholder"
                ),

            preview:
                document.getElementById(
                    "certificatePreview"
                ),

            previewTitle:
                document.getElementById(
                    "previewCertificateTitle"
                ),

            previewName:
                document.getElementById(
                    "previewParticipantName"
                ),

            previewDescription:
                document.getElementById(
                    "previewCertificateDescription"
                ),

            previewOrganizer:
                document.getElementById(
                    "previewOrganizerName"
                ),

            previewDate:
                document.getElementById(
                    "previewCertificateDate"
                ),

            previewNumber:
                document.getElementById(
                    "previewCertificateNumber"
                ),

            generateSelectedBtn:
                document.getElementById(
                    "generateSelectedCertificateBtn"
                ),

            editSelectedBtn:
                document.getElementById(
                    "editSelectedCertificateBtn"
                ),

            printSelectedBtn:
                document.getElementById(
                    "printSelectedCertificateBtn"
                ),

            downloadSelectedBtn:
                document.getElementById(
                    "downloadSelectedCertificateBtn"
                ),

            certificateModal:
                document.getElementById(
                    "certificateModal"
                ),

            certificateModalTitle:
                document.getElementById(
                    "certificateModalTitle"
                ),

            closeCertificateModalBtn:
                document.getElementById(
                    "closeCertificateModalBtn"
                ),

            cancelCertificateBtn:
                document.getElementById(
                    "cancelCertificateBtn"
                ),


            /*---------------------------------
                DELETE CERTIFICATE MODAL
            ---------------------------------*/

            deleteCertificateModal:
                document.getElementById(
                    "deleteCertificateModal"
                ),

            deleteCertificateParticipantName:
                document.getElementById(
                    "deleteCertificateParticipantName"
                ),

            cancelDeleteCertificateBtn:
                document.getElementById(
                    "cancelDeleteCertificateBtn"
                ),

            confirmDeleteCertificateBtn:
                document.getElementById(
                    "confirmDeleteCertificateBtn"
                ),


            certificateForm:
                document.getElementById(
                    "certificateForm"
                ),

            certificateRecordId:
                document.getElementById(
                    "certificateRecordId"
                ),

            certificateParticipantId:
                document.getElementById(
                    "certificateParticipantId"
                ),

            participantInitials:
                document.getElementById(
                    "certificateParticipantInitials"
                ),
            participantPreviewName:
                document.getElementById(
                    "certificateParticipantPreviewName"
                ),

            participantPreviewDetails:
                document.getElementById(
                    "certificateParticipantPreviewDetails"
                ),

            certificateType:
                document.getElementById(
                    "certificateType"
                ),

            certificateNumber:
                document.getElementById(
                    "certificateNumber"
                ),

            certificateGroup:
                document.getElementById(
                    "certificateGroup"
                ),

            certificatePosition:
                document.getElementById(
                    "certificatePosition"
                ),

            certificateAwardDate:
                document.getElementById(
                    "certificateAwardDate"
                ),

            certificateOrganizer:
                document.getElementById(
                    "certificateOrganizer"
                ),

            certificateDescription:
                document.getElementById(
                    "certificateDescription"
                ),

            certificateStatus:
                document.getElementById(
                    "certificateStatus"
                ),

            certificateFormat:
                document.getElementById(
                    "certificateFormat"
                ),

            includeSeal:
                document.getElementById(
                    "includeCertificateSeal"
                ),

            groupModal:
                document.getElementById(
                    "groupCertificateModal"
                ),

            closeGroupModalBtn:
                document.getElementById(
                    "closeGroupCertificateModalBtn"
                ),

            cancelGroupBtn:
                document.getElementById(
                    "cancelGroupCertificateBtn"
                ),

            confirmGroupBtn:
                document.getElementById(
                    "confirmGroupCertificatesBtn"
                ),

            batchGroup:
                document.getElementById(
                    "batchCertificateGroup"
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
                () => {

                    this.openSidebar();

                }
            );


        this.elements.sidebarCloseBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closeSidebar();

                }
            );


        this.elements.sidebarOverlay
            ?.addEventListener(
                "click",
                () => {

                    this.closeSidebar();

                }
            );


        this.elements.refreshBtn
            ?.addEventListener(
                "click",
                () => {

                    this.refresh();

                    AdminCommon.showToast(
                        "Certificate records refreshed.",
                        "info"
                    );

                }
            );


        const delayedFilter =
            AdminCommon.debounce(
                () => {

                    this.applyFilters();

                },
                180
            );


        this.elements.searchInput
            ?.addEventListener(
                "input",
                delayedFilter
            );


        [
            this.elements.groupFilter,
            this.elements.typeFilter,
            this.elements.statusFilter
        ].forEach(
            element => {

                element?.addEventListener(
                    "change",
                    () => {

                        this.applyFilters();

                    }
                );

            }
        );


        this.elements.resetFiltersBtn
            ?.addEventListener(
                "click",
                () => {

                    this.resetFilters();

                }
            );


        this.elements.tableBody
            ?.addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            "[data-certificate-action]"
                        );


                    if (!button) {

                        return;

                    }


                    const action =
                        button.dataset
                            .certificateAction;


                    const participantId =
                        button.dataset
                            .participantId;


                    if (!participantId) {

                        return;

                    }


                    switch (action) {

                        case "preview":

                            this.selectParticipant(
                                participantId
                            );

                            break;


                        case "generate":

                            this.openCertificateModal(
                                participantId
                            );

                            break;


                        case "edit":

                            this.openCertificateModal(
                                participantId,
                                true
                            );

                            break;


                        case "print":

                            this.selectParticipant(
                                participantId
                            );

                            this.printSelectedCertificate();

                            break;


                        case "download":

                            this.selectParticipant(
                                participantId
                            );

                            this.downloadSelectedCertificate();

                            break;


                        case "delete":

                            this.deleteCertificate(
                                participantId
                            );

                            break;

                    }

                }
            );


        this.elements.generateSelectedBtn
            ?.addEventListener(
                "click",
                () => {

                    if (
                        !this.selectedParticipantId
                    ) {

                        AdminCommon.showToast(
                            "Select a participant first.",
                            "warning"
                        );

                        return;

                    }


                    this.openCertificateModal(
                        this.selectedParticipantId
                    );

                }
            );


        this.elements.editSelectedBtn
            ?.addEventListener(
                "click",
                () => {

                    if (
                        !this.selectedParticipantId
                    ) {

                        AdminCommon.showToast(
                            "Select a participant first.",
                            "warning"
                        );

                        return;

                    }


                    this.openCertificateModal(
                        this.selectedParticipantId,
                        true
                    );

                }
            );


        this.elements.printSelectedBtn
            ?.addEventListener(
                "click",
                () => {

                    this.printSelectedCertificate();

                }
            );


        this.elements.downloadSelectedBtn
            ?.addEventListener(
                "click",
                () => {

                    this.downloadSelectedCertificate();

                }
            );


        this.elements.generateAllBtn
            ?.addEventListener(
                "click",
                () => {

                    this.batchGenerate(
                        this.participants,
                        "all participants"
                    );

                }
            );


        this.elements.generateWinnersBtn
            ?.addEventListener(
                "click",
                () => {

                    const winners =
                        this.participants.filter(
                            participant => {

                                const position =
                                    this.getParticipantPosition(
                                        participant
                                    );


                                return (
                                    position !== null &&
                                    position <= 3
                                );

                            }
                        );


                    this.batchGenerate(
                        winners,
                        "competition winners"
                    );

                }
            );


        this.elements.generateFinalistsBtn
            ?.addEventListener(
                "click",
                () => {

                    const finalists =
                        this.participants.filter(
                            participant =>
                                this.isFinalist(
                                    participant
                                )
                        );


                    this.batchGenerate(
                        finalists,
                        "finalists"
                    );

                }
            );


        this.elements.generateGroupBtn
            ?.addEventListener(
                "click",
                () => {

                    this.openGroupModal();

                }
            );


        /*=====================================
     CERTIFICATE MODAL EVENTS
 =====================================*/

        this.elements.closeCertificateModalBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closeCertificateModal();

                }
            );


        this.elements.cancelCertificateBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closeCertificateModal();

                }
            );


        this.elements.certificateModal
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        this.elements.certificateModal
                    ) {

                        this.closeCertificateModal();

                    }

                }
            );


        /*=====================================
            DELETE CERTIFICATE MODAL EVENTS
        =====================================*/

        this.elements.cancelDeleteCertificateBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closeDeleteCertificateModal();

                }
            );


        this.elements.confirmDeleteCertificateBtn
            ?.addEventListener(
                "click",
                () => {

                    this.confirmDeleteCertificate();

                }
            );


        this.elements.deleteCertificateModal
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        this.elements.deleteCertificateModal
                    ) {

                        this.closeDeleteCertificateModal();

                    }

                }
            );

        this.elements.certificateForm
            ?.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    this.saveCertificate();

                }
            );


        this.elements.certificateType
            ?.addEventListener(
                "change",
                () => {

                    this.updateModalDescription();

                }
            );


        this.elements.closeGroupModalBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closeGroupModal();

                }
            );


        this.elements.cancelGroupBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closeGroupModal();

                }
            );


        this.elements.groupModal
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        this.elements.groupModal
                    ) {

                        this.closeGroupModal();

                    }

                }
            );


        this.elements.confirmGroupBtn
            ?.addEventListener(
                "click",
                () => {

                    this.generateSelectedGroup();

                }
            );


        this.elements.exportBtn
            ?.addEventListener(
                "click",
                () => {

                    this.exportCSV();

                }
            );


        this.elements.printListBtn
            ?.addEventListener(
                "click",
                () => {

                    AdminCommon.printPage();

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

                this.closeCertificateModal();

                this.closeDeleteCertificateModal();

                this.closeGroupModal();

                this.closeSidebar();
            }
        );


        window.addEventListener(
            "storage",
            event => {

                const relevantKeys = [

                    this.storageKey,

                    this.prizeStorageKey,

                    "kiddysexplorerParticipants",

                    "participants",

                    "quizParticipants",

                    "kiddysexplorer_participants",

                    "participantStore"

                ];


                if (
                    !event.key ||
                    relevantKeys.includes(
                        event.key
                    )
                ) {

                    this.refresh();

                }

            }
        );


        document.addEventListener(
            "participants-changed",
            () => {

                this.refresh();

            }
        );


        document.addEventListener(
            "participant-updated",
            () => {

                this.refresh();

            }
        );


        document.addEventListener(
            "live-results-updated",
            () => {

                this.refresh();

            }
        );

    },
    refresh() {

        /*
        ========================================
        Load data in the correct order
        ========================================
        */

        this.prizeRecords =
            this.loadPrizeRecords();

        this.participants =
            this.getParticipants();

        this.certificateRecords =
            this.loadCertificateRecords();

        this.buildCertificateRows();

        this.applyFilters();


        /*
        ========================================
        Refresh preview if selected participant
        still exists
        ========================================
        */

        if (this.selectedParticipantId) {

            const exists =
                this.participants.some(
                    participant =>
                        String(participant.id) ===
                        String(this.selectedParticipantId)
                );

            if (exists) {

                this.selectParticipant(
                    this.selectedParticipantId
                );

            } else {

                this.clearPreview();

            }

        }

    },


    getParticipants() {

        let records = [];

        try {

            if (window.ParticipantStore) {

                if (
                    typeof ParticipantStore.getAll ===
                    "function"
                ) {

                    records =
                        ParticipantStore.getAll();

                }

                else if (
                    typeof ParticipantStore.getParticipants ===
                    "function"
                ) {

                    records =
                        ParticipantStore.getParticipants();

                }

                else if (
                    typeof ParticipantStore.getAllParticipants ===
                    "function"
                ) {

                    records =
                        ParticipantStore.getAllParticipants();

                }

                else if (
                    Array.isArray(
                        ParticipantStore.participants
                    )
                ) {

                    records =
                        ParticipantStore.participants;

                }

            }

        }

        catch (error) {

            console.error(
                "Unable to load ParticipantStore:",
                error
            );

        }


        if (
            !Array.isArray(records) ||
            records.length === 0
        ) {

            records =
                this.findParticipantsInStorage();

        }


        return records.map(
            participant =>
                this.normalizeParticipant(
                    participant
                )
        );

    },


    findParticipantsInStorage() {

        const possibleKeys = [

            "participantStore",

            "kiddysexplorerParticipants",

            "participants",

            "quizParticipants",

            "kiddysexplorer_participants"

        ];


        for (const key of possibleKeys) {

            const parsed =
                AdminCommon.safeJSONParse(
                    localStorage.getItem(key),
                    null
                );

            if (
                Array.isArray(parsed)
            ) {

                return parsed;

            }

            if (
                parsed &&
                Array.isArray(
                    parsed.participants
                )
            ) {

                return parsed.participants;

            }

        }

        return [];

    },


    normalizeParticipant(
        participant
    ) {

        const firstName =
            participant.firstName ||
            participant.firstname ||
            "";

        const lastName =
            participant.lastName ||
            participant.lastname ||
            "";

        const fullName =
            participant.name ||
            participant.fullName ||
            participant.childName ||
            `${firstName} ${lastName}`.trim() ||
            "Unnamed Participant";


        const participantId =
            String(

                participant.id ||

                participant.participantId ||

                participant.registrationId ||

                participant.registrationNumber ||

                participant.email ||

                this.slugify(fullName)

            );


        return {

            ...participant,

            id:
                participantId,

            name:
                fullName,

            group:
                this.getParticipantGroup(
                    participant
                ),

            position:
                this.getParticipantPosition(
                    participant
                ),

            finalist:
                this.isFinalist(
                    participant
                ),

            certificateIssued:
                Boolean(
                    participant.certificateIssued
                ),

            certificateNumber:
                participant.certificateNumber ||
                "",

            certificateIssuedDate:
                participant.certificateIssuedDate ||
                "",

            resultsPublished:
                participant.resultsPublished === true,

            parentName:
                participant.parentName ||
                participant.guardianName ||
                participant.parent ||
                participant.guardian ||
                "",

            email:
                participant.email ||
                participant.parentEmail ||
                ""

        };

    },


    getParticipantGroup(
        participant
    ) {

        return String(

            participant.group ||

            participant.category ||

            participant.ageGroup ||

            participant.competitionGroup ||

            ""

        )
            .trim()
            .toUpperCase()
            .replace(
                /^GROUP\s+/,
                ""
            );

    },


    getParticipantPosition(
        participant
    ) {

        /*
        =====================================
        NEW SOURCE OF TRUTH
        =====================================
        */

        if (
            participant.finalPosition != null
        ) {

            return Number(
                participant.finalPosition
            );

        }

        if (
            participant.position != null
        ) {

            return Number(
                participant.position
            );

        }

        if (
            participant.rank != null
        ) {

            return Number(
                participant.rank
            );

        }

        /*
        =====================================
        Legacy compatibility
        =====================================
        */

        const prize =
            this.prizeRecords.find(
                record =>
                    String(record.participantId) ===
                    String(participant.id)
            );

        if (
            prize &&
            prize.position != null
        ) {

            return Number(
                prize.position
            );

        }

        return null;

    },


    isFinalist(
        participant
    ) {

        if (

            participant.finalist === true ||

            participant.isFinalist === true ||

            participant.qualifiedForFinal === true

        ) {

            return true;

        }


        const position =
            this.getParticipantPosition(
                participant
            );


        if (
            position !== null &&
            position <= 10
        ) {

            return true;

        }


        const section2Score =
            Number(

                participant.section2Score ??

                participant.sectionTwoScore ??

                participant.secondSectionScore ??

                0

            );


        return section2Score >= 80;

    },
    loadPrizeRecords() {

        const records =
            AdminCommon.safeJSONParse(
                localStorage.getItem(
                    this.prizeStorageKey
                ),
                []
            );

        return Array.isArray(records)
            ? records
            : [];

    },


    loadCertificateRecords() {

        const records =
            AdminCommon.safeJSONParse(
                localStorage.getItem(
                    this.storageKey
                ),
                []
            );

        return Array.isArray(records)
            ? records
            : [];

    },


    saveCertificateRecords() {

        try {

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(
                    this.certificateRecords
                )
            );

            document.dispatchEvent(
                new CustomEvent(
                    "certificates-changed",
                    {
                        detail: {

                            total:
                                this.certificateRecords.length,

                            updatedAt:
                                new Date().toISOString()

                        }
                    }
                )
            );

            return true;

        } catch (error) {

            console.error(
                "Unable to save certificate records:",
                error
            );

            AdminCommon.showToast(
                "Certificate records could not be saved.",
                "error"
            );

            return false;

        }

    },


    buildCertificateRows() {

        this.certificateRows =
            this.participants.map(
                participant => {

                    const certificate =
                        this.findCertificate(
                            participant.id
                        );

                    return {

                        participant,

                        certificate,

                        eligible:
                            this.isCertificateEligible(
                                participant
                            )

                    };

                }
            );

    },


    findParticipant(
        participantId
    ) {

        return (
            this.participants.find(
                participant =>
                    String(participant.id) ===
                    String(participantId)
            ) ||
            null
        );

    },


    findCertificate(
        participantId
    ) {

        return (
            this.certificateRecords.find(
                certificate =>
                    String(
                        certificate.participantId
                    ) ===
                    String(
                        participantId
                    )
            ) ||
            null
        );

    },


    isCertificateEligible(
        participant
    ) {

        if (!participant) {

            return false;

        }

        const registrationStatus =
            String(
                participant.status ||
                participant.registrationStatus ||
                "active"
            ).toLowerCase();

        if (
            registrationStatus === "deleted" ||
            registrationStatus === "disqualified" ||
            registrationStatus === "withdrawn"
        ) {

            return false;

        }

        return true;

    },


    generateCertificateNumber() {

        const currentYear =
            new Date().getFullYear();

        let highestNumber = 0;

        this.certificateRecords.forEach(
            certificate => {

                const certificateNumber =
                    String(
                        certificate.number ||
                        certificate.certificateNumber ||
                        ""
                    );

                const match =
                    certificateNumber.match(
                        /(\d+)$/
                    );

                if (!match) {

                    return;

                }

                const numericPart =
                    Number(
                        match[1]
                    );

                if (
                    Number.isFinite(
                        numericPart
                    )
                ) {

                    highestNumber =
                        Math.max(
                            highestNumber,
                            numericPart
                        );

                }

            }
        );

        const nextNumber =
            String(
                highestNumber + 1
            ).padStart(
                4,
                "0"
            );

        return `KX-${currentYear}-${nextNumber}`;

    },


    defaultCertificateType(
        participant
    ) {

        const position =
            this.getParticipantPosition(
                participant
            );

        if (position === 1) {

            return "Gold Certificate";

        }

        if (position === 2) {

            return "Silver Certificate";

        }

        if (position === 3) {

            return "Bronze Certificate";

        }

        if (
            this.isFinalist(
                participant
            )
        ) {

            return "Finalist Certificate";

        }

        return "Participation Certificate";

    },


    defaultDescription(
        participant
    ) {

        const certificateType =
            this.defaultCertificateType(
                participant
            );

        const descriptions = {

            "Gold Certificate":

                "Awarded for achieving First Place in the Kiddysexplorer Quiz Competition through outstanding knowledge and excellent performance.",

            "Silver Certificate":

                "Awarded for achieving Second Place in the Kiddysexplorer Quiz Competition with exceptional performance and dedication.",

            "Bronze Certificate":

                "Awarded for achieving Third Place in the Kiddysexplorer Quiz Competition through determination and excellent effort.",

            "Finalist Certificate":

                "Awarded in recognition of reaching the final stage of the Kiddysexplorer Quiz Competition.",

            "Participation Certificate":

                "Awarded for participating in the Kiddysexplorer Quiz Competition and demonstrating enthusiasm, confidence and a love of learning."

        };

        return (
            descriptions[
            certificateType
            ] ||
            descriptions[
            "Participation Certificate"
            ]
        );

    },
    applyFilters() {

        const keyword =
            (this.elements.searchInput?.value || "")
                .trim()
                .toLowerCase();

        const group =
            this.elements.groupFilter?.value || "";

        const type =
            this.elements.typeFilter?.value || "";

        const status =
            this.elements.statusFilter?.value || "";

        this.filteredRows =
            this.certificateRows.filter(row => {

                const participant =
                    row.participant;

                const certificate =
                    row.certificate;

                if (keyword) {

                    const searchText = [

                        participant.name,

                        participant.id,

                        participant.parentName,

                        participant.email

                    ]
                        .join(" ")
                        .toLowerCase();

                    if (!searchText.includes(keyword)) {

                        return false;

                    }

                }

                if (
                    group &&
                    participant.group !== group
                ) {

                    return false;

                }

                if (
                    type &&
                    this.defaultCertificateType(
                        participant
                    ) !== type
                ) {

                    return false;

                }

                if (status) {

                    if (
                        status === "generated" &&
                        !certificate
                    ) {

                        return false;

                    }

                    if (
                        status === "pending" &&
                        certificate
                    ) {

                        return false;

                    }

                }

                return true;

            });

        this.updateStatistics();

        this.renderTable();

    },


    resetFilters() {

        if (this.elements.searchInput) {

            this.elements.searchInput.value = "";

        }

        if (this.elements.groupFilter) {

            this.elements.groupFilter.value = "";

        }

        if (this.elements.typeFilter) {

            this.elements.typeFilter.value = "";

        }

        if (this.elements.statusFilter) {

            this.elements.statusFilter.value = "";

        }

        this.applyFilters();

    },


    updateStatistics() {

        const eligible =
            this.certificateRows.filter(
                row => row.eligible
            ).length;

        const generated =
            this.certificateRows.filter(
                row => row.certificate
            ).length;

        const pending =
            eligible - generated;

        const printed =
            this.certificateRows.filter(
                row =>
                    row.certificate &&
                    row.certificate.printed
            ).length;

        if (this.elements.eligibleCount) {

            this.elements.eligibleCount.textContent =
                eligible;

        }

        if (this.elements.generatedCount) {

            this.elements.generatedCount.textContent =
                generated;

        }

        if (this.elements.pendingCount) {

            this.elements.pendingCount.textContent =
                pending;

        }

        if (this.elements.printedCount) {

            this.elements.printedCount.textContent =
                printed;

        }

        if (this.elements.resultSummary) {

            this.elements.resultSummary.textContent =
                `${this.filteredRows.length} participant(s)`;

        }

    },


    renderTable() {

        if (!this.elements.tableBody) {

            return;

        }

        if (
            this.filteredRows.length === 0
        ) {

            this.elements.tableBody.innerHTML = "";

            this.elements.emptyState?.classList.remove(
                "hidden"
            );

            return;

        }

        this.elements.emptyState?.classList.add(
            "hidden"
        );

        this.elements.tableBody.innerHTML =
            this.filteredRows
                .map(row => {

                    const participant =
                        row.participant;

                    const certificate =
                        row.certificate;

                    return `
<tr>

<td>${participant.name}</td>

<td>${participant.group || "-"}</td>

<td>${participant.position ?? "-"}</td>

<td>${this.defaultCertificateType(participant)}</td>

<td>

${certificate
                            ? '<span class="badge badge-success">Generated</span>'
                            : '<span class="badge badge-warning">Pending</span>'}

</td>

<td>

<button
class="btn btn-sm btn-primary"
data-certificate-action="preview"
data-participant-id="${participant.id}">

Preview

</button>

${!certificate ? `
<button
class="btn btn-sm btn-success"
data-certificate-action="generate"
data-participant-id="${participant.id}">

Generate

</button>
` : ""}

<button
class="btn btn-sm btn-secondary"
data-certificate-action="print"
data-participant-id="${participant.id}">

Print

</button>

<button
class="btn btn-sm btn-danger"
data-certificate-action="delete"
data-participant-id="${participant.id}">

Delete

</button>

</td>

</tr>
`;

                })
                .join("");

    },

    /*=====================================
    SELECT PARTICIPANT
=====================================*/

    selectParticipant(participantId) {

        const participant =
            this.findParticipant(
                participantId
            );


        if (!participant) {

            AdminCommon.showToast(
                "Participant could not be found.",
                "error"
            );

            this.clearPreview();

            return;

        }


        this.selectedParticipantId =
            String(
                participant.id
            );


        const certificate =
            this.findCertificate(
                participant.id
            );


        this.renderPreview(
            participant,
            certificate
        );

    },


    /*=====================================
        RENDER CERTIFICATE PREVIEW
    =====================================*/

    renderPreview(
        participant,
        certificate = null
    ) {

        if (!participant) {

            return;

        }


        const preview =
            document.getElementById(
                "certificatePreview"
            );


        const placeholder =
            document.getElementById(
                "certificatePlaceholder"
            );


        if (!preview) {

            console.error(
                "certificatePreview element was not found."
            );

            return;

        }


        /*---------------------------------
            CERTIFICATE INFORMATION
        ---------------------------------*/

        const certificateType =
            certificate?.type ||
            certificate?.certificateType ||
            this.defaultCertificateType(
                participant
            );


        const description =
            certificate?.description ||
            this.defaultDescription(
                participant
            );


        const organizer =
            certificate?.organizer ||
            certificate?.organizerName ||
            "Kiddysexplorer";


        const awardDate =
            certificate?.awardDate ||
            certificate?.issuedDate ||
            certificate?.createdAt ||
            new Date().toISOString();


        const certificateNumber =
            certificate?.number ||
            certificate?.certificateNumber ||
            participant.certificateNumber ||
            "Not generated";


        /*---------------------------------
            UPDATE CERTIFICATE CONTENT
        ---------------------------------*/

        if (
            this.elements.previewTitle
        ) {

            this.elements.previewTitle.textContent =
                certificateType;

        }


        if (
            this.elements.previewName
        ) {

            this.elements.previewName.textContent =
                participant.name ||
                participant.childName ||
                "Participant";

        }


        if (
            this.elements.previewDescription
        ) {

            this.elements.previewDescription.textContent =
                description;

        }


        if (
            this.elements.previewOrganizer
        ) {

            this.elements.previewOrganizer.textContent =
                organizer;

        }


        if (
            this.elements.previewDate
        ) {

            this.elements.previewDate.textContent =
                this.formatDate(
                    awardDate
                );

        }


        if (
            this.elements.previewNumber
        ) {

            this.elements.previewNumber.textContent =
                certificateNumber;

        }


        /*---------------------------------
            SHOW CERTIFICATE
        ---------------------------------*/

        if (placeholder) {

            placeholder.hidden =
                true;

            placeholder.style.display =
                "none";

        }


        preview.hidden =
            false;

        preview.style.display =
            "block";


        /*---------------------------------
            ACTION BUTTONS
        ---------------------------------*/

        if (
            this.elements.generateSelectedBtn
        ) {

            this.elements.generateSelectedBtn.disabled =
                false;

            this.elements.generateSelectedBtn.hidden =
                Boolean(
                    certificate
                );

        }


        if (
            this.elements.editSelectedBtn
        ) {

            this.elements.editSelectedBtn.disabled =
                !certificate;

            this.elements.editSelectedBtn.hidden =
                false;

        }


        if (
            this.elements.printSelectedBtn
        ) {

            this.elements.printSelectedBtn.disabled =
                !certificate;

        }


        if (
            this.elements.downloadSelectedBtn
        ) {

            this.elements.downloadSelectedBtn.disabled =
                !certificate;

        }

    },

    /*=====================================
     CLEAR CERTIFICATE PREVIEW
 =====================================*/

    clearPreview() {

        this.selectedParticipantId =
            null;


        /* Hide the certificate preview */

        if (
            this.elements.preview
        ) {

            this.elements.preview.hidden =
                true;

        }


        /* Show the placeholder */

        if (
            this.elements.previewPlaceholder
        ) {

            this.elements.previewPlaceholder.hidden =
                false;

        }


        /* Generate button */

        if (
            this.elements.generateSelectedBtn
        ) {

            this.elements.generateSelectedBtn.hidden =
                false;

        }


        /* Edit button */

        if (
            this.elements.editSelectedBtn
        ) {

            this.elements.editSelectedBtn.hidden =
                true;

        }


        /* Print button */

        if (
            this.elements.printSelectedBtn
        ) {

            this.elements.printSelectedBtn.disabled =
                true;

        }


        /* Download button */

        if (
            this.elements.downloadSelectedBtn
        ) {

            this.elements.downloadSelectedBtn.disabled =
                true;

        }

    },

    openCertificateModal(
        participantId,
        editMode = false
    ) {

        const participant =
            this.findParticipant(
                participantId
            );

        if (!participant) {

            AdminCommon.showToast(
                "Participant could not be found.",
                "error"
            );

            return;

        }

        if (
            !this.isCertificateEligible(
                participant
            )
        ) {

            AdminCommon.showToast(
                "This participant is not eligible for a certificate.",
                "warning"
            );

            return;

        }

        const existingCertificate =
            this.findCertificate(
                participant.id
            );

        const certificate =
            editMode && existingCertificate
                ? existingCertificate
                : null;

        const certificateType =
            certificate?.type ||
            certificate?.certificateType ||
            this.defaultCertificateType(
                participant
            );

        const certificateNumber =
            certificate?.number ||
            certificate?.certificateNumber ||
            this.generateCertificateNumber();

        const participantPosition =
            this.getParticipantPosition(
                participant
            );

        if (this.elements.certificateModalTitle) {

            this.elements.certificateModalTitle.textContent =
                certificate
                    ? "Edit Certificate"
                    : "Generate Certificate";

        }

        if (this.elements.certificateRecordId) {

            this.elements.certificateRecordId.value =
                certificate?.id || "";

        }

        if (
            this.elements.certificateParticipantId
        ) {

            this.elements.certificateParticipantId.value =
                participant.id;

        }

        if (
            this.elements.participantInitials
        ) {

            this.elements.participantInitials.textContent =
                this.getInitials(
                    participant.name
                );

        }

        if (
            this.elements.participantPreviewName
        ) {

            this.elements.participantPreviewName.textContent =
                participant.name;

        }

        if (
            this.elements.participantPreviewDetails
        ) {

            const details = [];

            if (participant.group) {

                details.push(
                    `Group ${participant.group}`
                );

            }

            if (
                participantPosition !== null &&
                Number.isFinite(
                    participantPosition
                )
            ) {

                details.push(
                    this.formatPosition(
                        participantPosition
                    )
                );

            }

            this.elements.participantPreviewDetails.textContent =
                details.join(" • ") ||
                "Registered participant";

        }

        if (this.elements.certificateType) {

            this.elements.certificateType.value =
                certificateType;

        }

        if (this.elements.certificateNumber) {

            this.elements.certificateNumber.value =
                certificateNumber;

        }

        if (this.elements.certificateGroup) {

            this.elements.certificateGroup.value =
                certificate?.group ||
                participant.group ||
                "";

        }

        if (this.elements.certificatePosition) {

            this.elements.certificatePosition.value =
                certificate?.position ??
                participantPosition ??
                "";

        }

        if (
            this.elements.certificateAwardDate
        ) {

            this.elements.certificateAwardDate.value =
                this.formatDateForInput(
                    certificate?.awardDate ||
                    certificate?.issuedDate ||
                    new Date()
                );

        }

        if (
            this.elements.certificateOrganizer
        ) {

            this.elements.certificateOrganizer.value =
                certificate?.organizer ||
                certificate?.organizerName ||
                "Kiddysexplorer";

        }

        if (
            this.elements.certificateDescription
        ) {

            this.elements.certificateDescription.value =
                certificate?.description ||
                this.defaultDescription(
                    participant
                );

        }

        if (
            this.elements.certificateStatus
        ) {

            this.elements.certificateStatus.value =
                certificate?.status ||
                "Generated";

        }

        if (
            this.elements.certificateFormat
        ) {

            this.elements.certificateFormat.value =
                certificate?.format ||
                "A4 Landscape";

        }

        if (this.elements.includeSeal) {

            this.elements.includeSeal.checked =
                certificate?.includeSeal !== false;

        }

        this.elements.certificateModal
            ?.classList.add(
                "show"
            );

        this.elements.certificateModal
            ?.classList.remove(
                "hidden"
            );

        this.elements.certificateModal
            ?.setAttribute(
                "aria-hidden",
                "false"
            );

        document.body.classList.add(
            "modal-open"
        );

        window.setTimeout(
            () => {

                this.elements.certificateType
                    ?.focus();

            },
            50
        );

    },


    closeCertificateModal() {

        if (
            !this.elements.certificateModal
        ) {

            return;

        }

        this.elements.certificateModal
            .classList.remove(
                "show"
            );

        this.elements.certificateModal
            .classList.add(
                "hidden"
            );

        this.elements.certificateModal
            .setAttribute(
                "aria-hidden",
                "true"
            );

        document.body.classList.remove(
            "modal-open"
        );

        this.elements.certificateForm
            ?.reset();

    },


    updateModalDescription() {

        const participantId =
            this.elements
                .certificateParticipantId
                ?.value;

        const participant =
            this.findParticipant(
                participantId
            );

        if (
            !participant ||
            !this.elements.certificateDescription
        ) {

            return;

        }

        const selectedType =
            this.elements.certificateType?.value ||
            this.defaultCertificateType(
                participant
            );

        const descriptions = {

            "Gold Certificate":

                "Awarded for achieving First Place in the Kiddysexplorer Quiz Competition through outstanding knowledge and excellent performance.",

            "Silver Certificate":

                "Awarded for achieving Second Place in the Kiddysexplorer Quiz Competition with exceptional performance and dedication.",

            "Bronze Certificate":

                "Awarded for achieving Third Place in the Kiddysexplorer Quiz Competition through determination and excellent effort.",

            "Finalist Certificate":

                "Awarded in recognition of reaching the final stage of the Kiddysexplorer Quiz Competition.",

            "Participation Certificate":

                "Awarded for participating in the Kiddysexplorer Quiz Competition and demonstrating enthusiasm, confidence and a love of learning."

        };

        this.elements.certificateDescription.value =
            descriptions[selectedType] ||
            this.defaultDescription(
                participant
            );

    },
    saveCertificate() {

        const participantId =
            this.elements.certificateParticipantId.value;

        const participant =
            this.findParticipant(
                participantId
            );

        if (!participant) {

            AdminCommon.showToast(
                "Participant not found.",
                "error"
            );

            return;

        }

        const recordId =
            this.elements.certificateRecordId.value ||
            this.createUniqueId();

        const certificate = {

            id: recordId,

            participantId: participant.id,

            participantName: participant.name,

            group:
                this.elements.certificateGroup.value,

            position:
                this.elements.certificatePosition.value,

            type:
                this.elements.certificateType.value,

            number:
                this.elements.certificateNumber.value,

            awardDate:
                this.elements.certificateAwardDate.value,

            organizer:
                this.elements.certificateOrganizer.value,

            description:
                this.elements.certificateDescription.value,

            status:
                this.elements.certificateStatus.value,

            format:
                this.elements.certificateFormat.value,

            includeSeal:
                this.elements.includeSeal.checked,

            printed: false,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

        };


        const index =
            this.certificateRecords.findIndex(
                item =>
                    String(item.participantId) ===
                    String(participant.id)
            );

        if (index >= 0) {

            certificate.createdAt =
                this.certificateRecords[index].createdAt;

            this.certificateRecords[index] =
                certificate;

        } else {

            this.certificateRecords.push(
                certificate
            );

        }


        this.updateParticipantCertificateMetadata(
            participant.id,
            certificate
        );


        this.saveCertificateRecords();

        this.closeCertificateModal();

        this.refresh();

        this.selectParticipant(
            participant.id
        );

        AdminCommon.showToast(
            "Certificate saved successfully.",
            "success"
        );

    },


    updateParticipantCertificateMetadata(
        participantId,
        certificate
    ) {

        if (
            !window.ParticipantStore
        ) {

            return;

        }

        try {

            const participant =
                this.findParticipant(
                    participantId
                );

            if (!participant) {

                return;

            }

            const updatedParticipant = {

                ...participant,

                certificateIssued: true,

                certificateNumber:
                    certificate.number,

                certificateIssuedDate:
                    certificate.awardDate,

                certificateType:
                    certificate.type

            };


            if (
                typeof ParticipantStore.updateParticipant ===
                "function"
            ) {

                ParticipantStore.updateParticipant(
                    participantId,
                    updatedParticipant
                );

            }

            else if (
                typeof ParticipantStore.saveParticipant ===
                "function"
            ) {

                ParticipantStore.saveParticipant(
                    updatedParticipant
                );

            }

            document.dispatchEvent(
                new CustomEvent(
                    "participant-updated"
                )
            );

        }

        catch (error) {

            console.error(
                error
            );

        }

    },


    createUniqueId() {

        if (
            window.crypto &&
            crypto.randomUUID
        ) {

            return crypto.randomUUID();

        }

        return (

            Date.now().toString(36) +

            "-" +

            Math.random()
                .toString(36)
                .substring(2, 10)

        );

    },


    /*=====================================
     OPEN DELETE CERTIFICATE MODAL
 =====================================*/

    deleteCertificate(participantId) {

        const participant =
            this.findParticipant(
                participantId
            );


        if (!participant) {

            AdminCommon.showToast(
                "Participant could not be found.",
                "error"
            );

            return;

        }


        const certificate =
            this.findCertificate(
                participantId
            );


        if (!certificate) {

            AdminCommon.showToast(
                "Certificate could not be found.",
                "warning"
            );

            return;

        }


        this.pendingDeleteCertificateParticipantId =
            String(
                participantId
            );


        if (
            this.elements.deleteCertificateParticipantName
        ) {

            this.elements.deleteCertificateParticipantName.textContent =
                participant.name ||
                participant.childName ||
                "this participant";

        }


        if (
            this.elements.deleteCertificateModal
        ) {

            this.elements.deleteCertificateModal.hidden =
                false;

            this.elements.deleteCertificateModal.setAttribute(
                "aria-hidden",
                "false"
            );

        }


        document.body.classList.add(
            "modal-open"
        );

    },


    /*=====================================
        CLOSE DELETE CERTIFICATE MODAL
    =====================================*/

    closeDeleteCertificateModal() {

        if (
            this.elements.deleteCertificateModal
        ) {

            this.elements.deleteCertificateModal.hidden =
                true;

            this.elements.deleteCertificateModal.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        this.pendingDeleteCertificateParticipantId =
            null;


        document.body.classList.remove(
            "modal-open"
        );

    },


    /*=====================================
        CONFIRM DELETE CERTIFICATE
    =====================================*/

    confirmDeleteCertificate() {

        const participantId =
            this.pendingDeleteCertificateParticipantId;


        if (!participantId) {

            this.closeDeleteCertificateModal();

            return;

        }


        const participant =
            this.findParticipant(
                participantId
            );


        this.certificateRecords =
            this.certificateRecords.filter(
                certificate =>
                    String(
                        certificate.participantId
                    ) !==
                    String(
                        participantId
                    )
            );


        if (
            window.ParticipantStore
        ) {

            try {

                if (
                    participant &&
                    typeof ParticipantStore.updateParticipant ===
                    "function"
                ) {

                    ParticipantStore.updateParticipant(
                        participantId,
                        {
                            ...participant,

                            certificateIssued:
                                false,

                            certificateNumber:
                                "",

                            certificateIssuedDate:
                                "",

                            certificateType:
                                ""
                        }
                    );

                }

            }
            catch (error) {

                console.error(
                    error
                );

            }

        }


        this.saveCertificateRecords();

        this.closeDeleteCertificateModal();

        this.refresh();

        this.clearPreview();


        AdminCommon.showToast(
            "Certificate deleted successfully.",
            "success"
        );

    },
    batchGenerate(
        participants,
        label = "participants"
    ) {

        if (
            !Array.isArray(participants) ||
            participants.length === 0
        ) {

            AdminCommon.showToast(
                `No ${label} were found.`,
                "warning"
            );

            return;

        }

        const eligibleParticipants =
            participants.filter(
                participant =>
                    this.isCertificateEligible(
                        participant
                    )
            );

        if (
            eligibleParticipants.length === 0
        ) {

            AdminCommon.showToast(
                `No eligible ${label} were found.`,
                "warning"
            );

            return;

        }

        const confirmed =
            confirm(
                `Generate certificates for ${eligibleParticipants.length} ${label}?`
            );

        if (!confirmed) {

            return;

        }

        let generatedCount = 0;

        eligibleParticipants.forEach(
            participant => {

                const existingCertificate =
                    this.findCertificate(
                        participant.id
                    );

                if (existingCertificate) {

                    return;

                }

                const certificate = {

                    id:
                        this.createUniqueId(),

                    participantId:
                        participant.id,

                    participantName:
                        participant.name,

                    group:
                        participant.group || "",

                    position:
                        this.getParticipantPosition(
                            participant
                        ) ?? "",

                    type:
                        this.defaultCertificateType(
                            participant
                        ),

                    number:
                        this.generateCertificateNumber(),

                    awardDate:
                        this.formatDateForInput(
                            new Date()
                        ),

                    organizer:
                        "Kiddysexplorer",

                    description:
                        this.defaultDescription(
                            participant
                        ),

                    status:
                        "Generated",

                    format:
                        "A4 Landscape",

                    includeSeal:
                        true,

                    printed:
                        false,

                    createdAt:
                        new Date()
                            .toISOString(),

                    updatedAt:
                        new Date()
                            .toISOString()

                };

                this.certificateRecords.push(
                    certificate
                );

                this.updateParticipantCertificateMetadata(
                    participant.id,
                    certificate
                );

                generatedCount += 1;

            }
        );

        if (generatedCount === 0) {

            AdminCommon.showToast(
                `Certificates already exist for the selected ${label}.`,
                "info"
            );

            return;

        }

        this.saveCertificateRecords();

        this.refresh();

        AdminCommon.showToast(
            `${generatedCount} certificate(s) generated successfully.`,
            "success"
        );

    },


    openGroupModal() {

        if (
            !this.elements.groupModal
        ) {

            return;

        }

        if (
            this.elements.batchGroup
        ) {

            this.elements.batchGroup.value =
                "";
        }

        this.elements.groupModal
            .classList.remove(
                "hidden"
            );

        this.elements.groupModal
            .classList.add(
                "show"
            );

        this.elements.groupModal
            .setAttribute(
                "aria-hidden",
                "false"
            );

        document.body.classList.add(
            "modal-open"
        );

        window.setTimeout(
            () => {

                this.elements.batchGroup
                    ?.focus();

            },
            50
        );

    },


    closeGroupModal() {

        if (
            !this.elements.groupModal
        ) {

            return;

        }

        this.elements.groupModal
            .classList.remove(
                "show"
            );

        this.elements.groupModal
            .classList.add(
                "hidden"
            );

        this.elements.groupModal
            .setAttribute(
                "aria-hidden",
                "true"
            );

        document.body.classList.remove(
            "modal-open"
        );

    },


    generateSelectedGroup() {

        const selectedGroup =
            this.elements.batchGroup?.value
                ?.trim()
                ?.toUpperCase();

        if (!selectedGroup) {

            AdminCommon.showToast(
                "Select a participant group.",
                "warning"
            );

            return;

        }

        const groupParticipants =
            this.participants.filter(
                participant =>
                    String(
                        participant.group
                    ).toUpperCase() ===
                    selectedGroup
            );

        if (
            groupParticipants.length === 0
        ) {

            AdminCommon.showToast(
                `No participants were found in Group ${selectedGroup}.`,
                "warning"
            );

            return;

        }

        this.closeGroupModal();

        this.batchGenerate(
            groupParticipants,
            `Group ${selectedGroup} participants`
        );

    },


    printSelectedCertificate() {

        if (
            !this.selectedParticipantId
        ) {

            AdminCommon.showToast(
                "Select a participant first.",
                "warning"
            );

            return;

        }

        const participant =
            this.findParticipant(
                this.selectedParticipantId
            );

        const certificate =
            this.findCertificate(
                this.selectedParticipantId
            );

        if (
            !participant ||
            !certificate
        ) {

            AdminCommon.showToast(
                "Generate the certificate before printing.",
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
                "The print window was blocked by your browser.",
                "error"
            );

            return;

        }

        printWindow.document.write(
            this.buildPrintableCertificate(
                participant,
                certificate
            )
        );

        printWindow.document.close();

        printWindow.focus();

        printWindow.onload =
            () => {

                printWindow.print();

            };

        certificate.printed = true;

        certificate.printedAt =
            new Date().toISOString();

        certificate.updatedAt =
            new Date().toISOString();

        this.saveCertificateRecords();

        this.refresh();

        this.selectParticipant(
            participant.id
        );

    },


    downloadSelectedCertificate() {

        if (
            !this.selectedParticipantId
        ) {

            AdminCommon.showToast(
                "Select a participant first.",
                "warning"
            );

            return;

        }

        const participant =
            this.findParticipant(
                this.selectedParticipantId
            );

        const certificate =
            this.findCertificate(
                this.selectedParticipantId
            );

        if (
            !participant ||
            !certificate
        ) {

            AdminCommon.showToast(
                "Generate the certificate before downloading it.",
                "warning"
            );

            return;

        }

        const printableHTML =
            this.buildPrintableCertificate(
                participant,
                certificate
            );

        const file =
            new Blob(
                [printableHTML],
                {
                    type:
                        "text/html;charset=utf-8"
                }
            );

        const downloadURL =
            URL.createObjectURL(
                file
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            downloadURL;

        link.download =
            `${this.slugify(participant.name)}-${certificate.number || "certificate"}.html`;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            downloadURL
        );

        AdminCommon.showToast(
            "Certificate downloaded successfully.",
            "success"
        );

    },


    buildPrintableCertificate(
        participant,
        certificate
    ) {

        const sealHTML =
            certificate.includeSeal
                ? `
                    <div class="certificate-seal">
                        <span>KX</span>
                        <small>OFFICIAL</small>
                    </div>
                `
                : "";

        const position =
            certificate.position
                ? this.formatPosition(
                    Number(
                        certificate.position
                    )
                )
                : "";

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
${this.escapeHTML(
            participant.name
        )} Certificate
</title>

<style>

@page {

    size: A4 landscape;

    margin: 0;

}

* {

    box-sizing: border-box;

}

body {

    margin: 0;

    background: #f4f4f4;

    font-family:
        Georgia,
        "Times New Roman",
        serif;

}

.certificate-page {

    width: 297mm;

    height: 210mm;

    padding: 12mm;

    background: white;

}

.certificate-border {

    position: relative;

    width: 100%;

    height: 100%;

    border: 6px solid #0b1f3a;

    outline: 2px solid #f28c28;

    outline-offset: -12px;

    padding: 22mm 25mm;

    text-align: center;

    overflow: hidden;

}

.certificate-brand {

    margin: 0;

    color: #0b1f3a;

    font-family:
        Arial,
        sans-serif;

    font-size: 20px;

    font-weight: 800;

    letter-spacing: 4px;

    text-transform: uppercase;

}

.certificate-title {

    margin: 18px 0 8px;

    color: #f28c28;

    font-size: 42px;

    text-transform: uppercase;

    letter-spacing: 2px;

}

.presented-text {

    margin-top: 18px;

    color: #555;

    font-size: 18px;

}

.participant-name {

    display: inline-block;

    min-width: 65%;

    margin: 16px 0;

    padding: 7px 20px;

    border-bottom: 2px solid #0b1f3a;

    color: #0b1f3a;

    font-size: 40px;

    font-weight: bold;

}

.certificate-description {

    width: 82%;

    margin: 12px auto;

    color: #333;

    font-size: 19px;

    line-height: 1.55;

}

.certificate-details {

    display: flex;

    justify-content: center;

    gap: 30px;

    margin-top: 18px;

    color: #444;

    font-family:
        Arial,
        sans-serif;

    font-size: 15px;

}

.signature-row {

    display: flex;

    justify-content: space-between;

    align-items: flex-end;

    margin-top: 35px;

}

.signature-box {

    width: 220px;

    text-align: center;

}

.signature-line {

    border-top: 1px solid #333;

    margin-bottom: 8px;

}

.certificate-number {

    font-family:
        Arial,
        sans-serif;

    font-size: 13px;

    color: #666;

}

.certificate-seal {

    position: absolute;

    right: 30mm;

    bottom: 25mm;

    display: flex;

    width: 85px;

    height: 85px;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    border: 5px double #f28c28;

    border-radius: 50%;

    color: #0b1f3a;

    font-family:
        Arial,
        sans-serif;

    font-weight: bold;

    transform: rotate(-8deg);

}

.certificate-seal span {

    font-size: 28px;

}

.certificate-seal small {

    font-size: 9px;

    letter-spacing: 1px;

}

@media print {

    body {

        background: white;

    }

}

</style>

</head>

<body>

<div class="certificate-page">

<div class="certificate-border">

<p class="certificate-brand">
Kiddysexplorer
</p>

<h1 class="certificate-title">
${this.escapeHTML(
            certificate.type
        )}
</h1>

<p class="presented-text">
This certificate is proudly presented to
</p>

<div class="participant-name">
${this.escapeHTML(
            participant.name
        )}
</div>

<p class="certificate-description">
${this.escapeHTML(
            certificate.description
        )}
</p>

<div class="certificate-details">

<span>
Group:
<strong>
${this.escapeHTML(
            certificate.group || "-"
        )}
</strong>
</span>

${position
                ? `
        <span>
            Position:
            <strong>
                ${this.escapeHTML(position)}
            </strong>
        </span>
    `
                : ""}

<span>
Date:
<strong>
${this.escapeHTML(
                    this.formatDate(
                        certificate.awardDate
                    )
                )}
</strong>
</span>

</div>

<div class="signature-row">

<div class="signature-box">

<div class="signature-line"></div>

<div>
${this.escapeHTML(
                    certificate.organizer
                )}
</div>

<small>
Competition Organizer
</small>

</div>

<div class="certificate-number">

Certificate No.
<strong>
${this.escapeHTML(
                    certificate.number
                )}
</strong>

</div>

</div>

${sealHTML}

</div>

</div>

</body>

</html>
`;

    },


    exportCSV() {

        if (
            this.certificateRecords.length === 0
        ) {

            AdminCommon.showToast(
                "There are no certificate records to export.",
                "warning"
            );

            return;

        }

        const headers = [

            "Certificate Number",

            "Participant ID",

            "Participant Name",

            "Group",

            "Position",

            "Certificate Type",

            "Award Date",

            "Organizer",

            "Status",

            "Printed",

            "Created At",

            "Updated At"

        ];

        const rows =
            this.certificateRecords.map(
                certificate => [

                    certificate.number || "",

                    certificate.participantId || "",

                    certificate.participantName || "",

                    certificate.group || "",

                    certificate.position || "",

                    certificate.type || "",

                    certificate.awardDate || "",

                    certificate.organizer || "",

                    certificate.status || "",

                    certificate.printed
                        ? "Yes"
                        : "No",

                    certificate.createdAt || "",

                    certificate.updatedAt || ""

                ]
            );

        const filename =
            `kiddysexplorer-certificates-${this.formatDateForFilename(new Date())}.csv`;

        AdminCommon.exportCSV(
            filename,
            headers,
            rows
        );

    },


    openSidebar() {

        this.elements.sidebar
            ?.classList.add(
                "open"
            );

        this.elements.sidebarOverlay
            ?.classList.add(
                "show"
            );

        document.body.classList.add(
            "sidebar-open"
        );

    },


    closeSidebar() {

        this.elements.sidebar
            ?.classList.remove(
                "open"
            );

        this.elements.sidebarOverlay
            ?.classList.remove(
                "show"
            );

        document.body.classList.remove(
            "sidebar-open"
        );

    },


    getInitials(
        name
    ) {

        return String(name || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(
                word =>
                    word.charAt(0)
                        .toUpperCase()
            )
            .join("") ||
            "KX";

    },


    formatPosition(
        position
    ) {

        const numericPosition =
            Number(position);

        if (
            !Number.isFinite(
                numericPosition
            )
        ) {

            return "";

        }

        const remainder100 =
            numericPosition % 100;

        if (
            remainder100 >= 11 &&
            remainder100 <= 13
        ) {

            return `${numericPosition}th Place`;

        }

        switch (
        numericPosition % 10
        ) {

            case 1:

                return `${numericPosition}st Place`;

            case 2:

                return `${numericPosition}nd Place`;

            case 3:

                return `${numericPosition}rd Place`;

            default:

                return `${numericPosition}th Place`;

        }

    },


    formatDate(
        value
    ) {

        if (!value) {

            return "-";

        }

        const date =
            value instanceof Date
                ? value
                : new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(value);

        }

        return new Intl.DateTimeFormat(
            "en-GB",
            {
                day:
                    "2-digit",

                month:
                    "long",

                year:
                    "numeric"
            }
        ).format(date);

    },


    formatDateForInput(
        value
    ) {

        const date =
            value instanceof Date
                ? value
                : new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";

        }

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );

        return `${year}-${month}-${day}`;

    },


    formatDateForFilename(
        value
    ) {

        return this.formatDateForInput(
            value
        );

    },


    slugify(
        value
    ) {

        return String(value || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            ) ||
            "participant";

    },


    escapeHTML(
        value
    ) {

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


document.addEventListener(
    "DOMContentLoaded",
    () => {

        AdminCertificates.init();

    }
);


window.AdminCertificates =
    AdminCertificates;