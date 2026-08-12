/*=========================================================
  KIDDYSEXPLORER ADMIN PRIZE MANAGEMENT
=========================================================*/

"use strict";


const AdminPrizes = {

    storageKey:
        "kiddysexplorerPrizeRecords",

    participants: [],

    prizeRecords: [],

    filteredRecords: [],

    activeDetailsRecordId: null,

    initialized: false,


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

            assignPrizeBtn:
                document.getElementById(
                    "assignPrizeBtn"
                ),

            printPrizeListBtn:
                document.getElementById(
                    "printPrizeListBtn"
                ),

            exportPrizeCSVBtn:
                document.getElementById(
                    "exportPrizeCSVBtn"
                ),

            resetPrizeFiltersBtn:
                document.getElementById(
                    "resetPrizeFiltersBtn"
                ),

            refreshPrizeBtn:
                document.getElementById(
                    "refreshPrizeBtn"
                ),

            searchInput:
                document.getElementById(
                    "prizeSearchInput"
                ),

            groupFilter:
                document.getElementById(
                    "prizeGroupFilter"
                ),

            typeFilter:
                document.getElementById(
                    "prizeTypeFilter"
                ),

            statusFilter:
                document.getElementById(
                    "prizeStatusFilter"
                ),

            tableWrapper:
                document.getElementById(
                    "prizeTableWrapper"
                ),

            tableBody:
                document.getElementById(
                    "prizeTableBody"
                ),

            emptyState:
                document.getElementById(
                    "prizeEmptyState"
                ),

            resultSummary:
                document.getElementById(
                    "prizeResultSummary"
                ),

            prizeModal:
                document.getElementById(
                    "prizeModal"
                ),

            closePrizeModalBtn:
                document.getElementById(
                    "closePrizeModalBtn"
                ),

            cancelPrizeBtn:
                document.getElementById(
                    "cancelPrizeBtn"
                ),

            prizeForm:
                document.getElementById(
                    "prizeForm"
                ),

            modalTitle:
                document.getElementById(
                    "prizeModalTitle"
                ),

            recordId:
                document.getElementById(
                    "prizeRecordId"
                ),

            participantId:
                document.getElementById(
                    "prizeParticipantId"
                ),

            position:
                document.getElementById(
                    "prizePosition"
                ),

            group:
                document.getElementById(
                    "prizeGroup"
                ),

            type:
                document.getElementById(
                    "prizeType"
                ),

            customPrizeName:
                document.getElementById(
                    "customPrizeName"
                ),

            collectionStatus:
                document.getElementById(
                    "prizeCollectionStatus"
                ),

            collectionDate:
                document.getElementById(
                    "prizeCollectionDate"
                ),

            parentName:
                document.getElementById(
                    "prizeParentName"
                ),

            parentPhone:
                document.getElementById(
                    "prizeParentPhone"
                ),

            collectedBy:
                document.getElementById(
                    "prizeCollectedBy"
                ),

            value:
                document.getElementById(
                    "prizeValue"
                ),

            currency:
                document.getElementById(
                    "prizeCurrency"
                ),

            remarks:
                document.getElementById(
                    "prizeRemarks"
                ),

            participantPreview:
                document.getElementById(
                    "prizeParticipantPreview"
                ),

            participantInitials:
                document.getElementById(
                    "prizeParticipantInitials"
                ),

            participantPreviewName:
                document.getElementById(
                    "prizeParticipantPreviewName"
                ),

            participantPreviewDetails:
                document.getElementById(
                    "prizeParticipantPreviewDetails"
                ),

            detailsModal:
                document.getElementById(
                    "prizeDetailsModal"
                ),

            closeDetailsBtn:
                document.getElementById(
                    "closePrizeDetailsBtn"
                ),

            closeDetailsFooterBtn:
                document.getElementById(
                    "closePrizeDetailsFooterBtn"
                ),

            printPrizeDetailsBtn:
                document.getElementById(
                    "printPrizeDetailsBtn"
                ),

            detailsContent:
                document.getElementById(
                    "prizeDetailsContent"
                )

        };

    },


    bindEvents() {

        this.elements.assignPrizeBtn
            ?.addEventListener(
                "click",
                () => {

                    this.openCreateModal();

                }
            );


        this.elements.closePrizeModalBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closePrizeModal();

                }
            );


        this.elements.cancelPrizeBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closePrizeModal();

                }
            );


        this.elements.prizeModal
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        this.elements.prizeModal
                    ) {

                        this.closePrizeModal();

                    }

                }
            );


        this.elements.prizeForm
            ?.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    this.savePrizeRecord();

                }
            );


        this.elements.participantId
            ?.addEventListener(
                "change",
                () => {

                    this.handleParticipantSelection();

                }
            );


        this.elements.type
            ?.addEventListener(
                "change",
                () => {

                    this.updateCustomPrizeState();

                }
            );


        this.elements.collectionStatus
            ?.addEventListener(
                "change",
                () => {

                    this.handleStatusChange();

                }
            );


        const applyFilters =
            AdminCommon.debounce(
                () => {

                    this.applyFilters();

                },
                180
            );


        this.elements.searchInput
            ?.addEventListener(
                "input",
                applyFilters
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


        this.elements.resetPrizeFiltersBtn
            ?.addEventListener(
                "click",
                () => {

                    this.resetFilters();

                }
            );


        this.elements.refreshPrizeBtn
            ?.addEventListener(
                "click",
                () => {

                    this.refresh();

                    AdminCommon.showToast(
                        "Prize records refreshed.",
                        "info"
                    );

                }
            );


        this.elements.exportPrizeCSVBtn
            ?.addEventListener(
                "click",
                () => {

                    this.exportCSV();

                }
            );


        this.elements.printPrizeListBtn
            ?.addEventListener(
                "click",
                () => {

                    AdminCommon.printPage();

                }
            );


        this.elements.tableBody
            ?.addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            "[data-prize-action]"
                        );


                    if (!button) {

                        return;

                    }


                    const action =
                        button.dataset.prizeAction;


                    const recordId =
                        button.dataset.recordId;


                    if (
                        action === "view"
                    ) {

                        this.openDetailsModal(
                            recordId
                        );

                    }


                    if (
                        action === "edit"
                    ) {

                        this.openEditModal(
                            recordId
                        );

                    }


                    if (
                        action === "delete"
                    ) {

                        this.deletePrizeRecord(
                            recordId
                        );

                    }

                }
            );


        this.elements.closeDetailsBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closeDetailsModal();

                }
            );


        this.elements.closeDetailsFooterBtn
            ?.addEventListener(
                "click",
                () => {

                    this.closeDetailsModal();

                }
            );


        this.elements.detailsModal
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        this.elements.detailsModal
                    ) {

                        this.closeDetailsModal();

                    }

                }
            );


        this.elements.printPrizeDetailsBtn
            ?.addEventListener(
                "click",
                () => {

                    this.printActivePrizeDetails();

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


                this.closePrizeModal();

                this.closeDetailsModal();

            }
        );

    },


    refresh() {

        this.participants =
            this.getParticipants();


        this.prizeRecords =
            this.loadPrizeRecords();


        this.importPublishedWinners();


        this.populateParticipantOptions();

        this.applyFilters();

    },


    getParticipants() {

        let participants = [];


        try {

            if (
                window.ParticipantStore
            ) {

                if (
                    typeof ParticipantStore
                        .getAllParticipants ===
                    "function"
                ) {

                    participants =
                        ParticipantStore
                            .getAllParticipants();

                } else if (
                    typeof ParticipantStore
                        .getParticipants ===
                    "function"
                ) {

                    participants =
                        ParticipantStore
                            .getParticipants();

                } else if (
                    typeof ParticipantStore
                        .getAll ===
                    "function"
                ) {

                    participants =
                        ParticipantStore
                            .getAll();

                } else if (
                    Array.isArray(
                        ParticipantStore
                            .participants
                    )
                ) {

                    participants =
                        ParticipantStore
                            .participants;

                }

            }

        } catch (error) {

            console.error(
                "Unable to read ParticipantStore:",
                error
            );

        }


        if (
            !Array.isArray(participants) ||
            participants.length === 0
        ) {

            participants =
                this.findParticipantsInLocalStorage();

        }


        return Array.isArray(participants)
            ? participants.map(
                participant =>
                    this.normalizeParticipant(
                        participant
                    )
            )
            : [];

    },


    findParticipantsInLocalStorage() {

        const possibleKeys = [

            "kiddysexplorerParticipants",

            "participants",

            "quizParticipants",

            "kiddysexplorer_participants",

            "participantStore"

        ];


        for (
            const key of possibleKeys
        ) {

            const parsed =
                AdminCommon.safeJSONParse(
                    localStorage.getItem(
                        key
                    ),
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


        const name =
            participant.name ||
            participant.fullName ||
            participant.childName ||
            `${firstName} ${lastName}`.trim() ||
            "Unnamed Participant";


        const id =
            String(
                participant.id ||
                participant.participantId ||
                participant.registrationId ||
                participant.email ||
                this.slugify(name)
            );


        return {

            ...participant,

            id,

            name,

            group:
                this.getParticipantGroup(
                    participant
                ),

            position:
                this.getParticipantPosition(
                    participant
                ),

            parentName:
                participant.parentName ||
                participant.guardianName ||
                participant.parent ||
                participant.guardian ||
                "",

            parentPhone:
                participant.parentPhone ||
                participant.guardianPhone ||
                participant.phone ||
                participant.phoneNumber ||
                "",

            email:
                participant.email ||
                participant.parentEmail ||
                "",

            published:
                this.isParticipantPublished(
                    participant
                )

        };

    },


    getParticipantGroup(
        participant
    ) {

        const group =
            participant.group ||
            participant.ageGroup ||
            participant.category ||
            participant.competitionGroup ||
            "";


        return String(group)
            .replace(
                /^group\s*/i,
                ""
            )
            .trim()
            .toUpperCase();

    },


    getParticipantPosition(
        participant
    ) {

        const values = [

            participant.finalPosition,

            participant.position,

            participant.rank,

            participant.livePosition,

            participant.resultPosition

        ];


        for (
            const value of values
        ) {

            const number =
                Number(value);


            if (
                Number.isFinite(number) &&
                number > 0
            ) {

                return number;

            }

        }


        return null;

    },


    isParticipantPublished(
        participant
    ) {

        return Boolean(

            participant.published === true ||

            participant.isPublished === true ||

            participant.winnerPublished === true ||

            participant.resultsPublished === true ||

            participant.publicationStatus ===
                "Published" ||

            participant.status ===
                "Published"

        );

    },
        loadPrizeRecords() {

        const stored =
            AdminCommon.safeJSONParse(
                localStorage.getItem(
                    this.storageKey
                ),
                []
            );

        return Array.isArray(stored)
            ? stored
            : [];

    },


    savePrizeRecords() {

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(
                this.prizeRecords
            )
        );

    },


    importPublishedWinners() {

        const winners =
            this.participants.filter(
                participant =>
                    participant.published &&
                    participant.position &&
                    participant.position <= 3
            );

        let changed =
            false;

        winners.forEach(
            participant => {

                const exists =
                    this.prizeRecords.some(
                        record =>
                            record.participantId ===
                            participant.id
                    );

                if (
                    exists
                ) {

                    return;

                }

                this.prizeRecords.push(

                    this.createPrizeRecordFromWinner(
                        participant
                    )

                );

                changed =
                    true;

            }
        );

        if (
            changed
        ) {

            this.savePrizeRecords();

        }

    },


    createPrizeRecordFromWinner(
        participant
    ) {

        return {

            id:
                crypto.randomUUID(),

            participantId:
                participant.id,

            participantName:
                participant.name,

            group:
                participant.group,

            position:
                participant.position,

            prize:
                this.defaultPrizeForPosition(
                    participant.position
                ),

            customPrizeName:
                "",

            collectionStatus:
                "Pending",

            collectionDate:
                "",

            parentName:
                participant.parentName,

            parentPhone:
                participant.parentPhone,

            collectedBy:
                "",

            value:
                "",

            currency:
                "EUR",

            remarks:
                "",

            createdAt:
                new Date()
                    .toISOString(),

            updatedAt:
                new Date()
                    .toISOString()

        };

    },


    defaultPrizeForPosition(
        position
    ) {

        switch (
            Number(position)
        ) {

            case 1:

                return
                    "Gold Medal";

            case 2:

                return
                    "Silver Medal";

            case 3:

                return
                    "Bronze Medal";

            default:

                return
                    "Participation Medal";

        }

    },


    populateParticipantOptions() {

        const select =
            this.elements
                .participantId;

        if (
            !select
        ) {

            return;

        }

        select.innerHTML =
            `
            <option value="">
                Select a participant
            </option>
            `;

        this.participants
            .slice()
            .sort(
                (
                    a,
                    b
                ) =>
                    a.name.localeCompare(
                        b.name
                    )
            )
            .forEach(
                participant => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        participant.id;

                    option.textContent =
                        `${participant.name} (${participant.group || "-"})`;

                    select.appendChild(
                        option
                    );

                }
            );

    },


    openCreateModal() {

        this.elements.modalTitle
            .textContent =
            "Assign Prize";

        this.elements.prizeForm
            .reset();

        this.elements.recordId
            .value =
            "";

        this.hideParticipantPreview();

        this.updateCustomPrizeState();

        this.elements.prizeModal
            .hidden =
            false;

    },


    openEditModal(
        recordId
    ) {

        const record =
            this.prizeRecords.find(
                item =>
                    item.id ===
                    recordId
            );

        if (
            !record
        ) {

            return;

        }

        this.elements.modalTitle
            .textContent =
            "Edit Prize";

        this.elements.recordId
            .value =
            record.id;

        this.elements.participantId
            .value =
            record.participantId;

        this.elements.position
            .value =
            record.position || "";

        this.elements.group
            .value =
            record.group || "";

        this.elements.type
            .value =
            record.prize;

        this.elements.customPrizeName
            .value =
            record.customPrizeName || "";

        this.elements.collectionStatus
            .value =
            record.collectionStatus;

        this.elements.collectionDate
            .value =
            record.collectionDate;

        this.elements.parentName
            .value =
            record.parentName;

        this.elements.parentPhone
            .value =
            record.parentPhone;

        this.elements.collectedBy
            .value =
            record.collectedBy;

        this.elements.value
            .value =
            record.value;

        this.elements.currency
            .value =
            record.currency;

        this.elements.remarks
            .value =
            record.remarks;

        this.handleParticipantSelection();

        this.updateCustomPrizeState();

        this.elements.prizeModal
            .hidden =
            false;

    },


    closePrizeModal() {

        this.elements.prizeModal
            .hidden =
            true;

    },


    handleParticipantSelection() {

        const participant =
            this.participants.find(
                item =>
                    item.id ===
                    this.elements
                        .participantId
                        .value
            );

        if (
            !participant
        ) {

            this.hideParticipantPreview();

            return;

        }

        this.showParticipantPreview(
            participant
        );

        if (
            !this.elements.position.value
        ) {

            this.elements.position.value =
                participant.position || "";

        }

        if (
            !this.elements.group.value
        ) {

            this.elements.group.value =
                participant.group || "";

        }

        if (
            !this.elements.parentName.value
        ) {

            this.elements.parentName.value =
                participant.parentName || "";

        }

        if (
            !this.elements.parentPhone.value
        ) {

            this.elements.parentPhone.value =
                participant.parentPhone || "";

        }

    },


    showParticipantPreview(
        participant
    ) {

        this.elements
            .participantPreview
            .hidden =
            false;

        const initials =
            participant.name
                .split(
                    " "
                )
                .map(
                    word =>
                        word[0]
                )
                .join(
                    ""
                )
                .slice(
                    0,
                    2
                )
                .toUpperCase();

        this.elements
            .participantInitials
            .textContent =
            initials;

        this.elements
            .participantPreviewName
            .textContent =
            participant.name;

        this.elements
            .participantPreviewDetails
            .textContent =
            `Group ${participant.group || "-"} • Position ${participant.position || "-"}`;

    },


    hideParticipantPreview() {

        this.elements
            .participantPreview
            .hidden =
            true;

    },


    updateCustomPrizeState() {

        const custom =
            this.elements.type.value ===
            "Custom Prize";

        this.elements
            .customPrizeName
            .disabled =
            !custom;

        if (
            !custom
        ) {

            this.elements
                .customPrizeName
                .value =
                "";

        }

    },


    handleStatusChange() {

        if (
            this.elements
                .collectionStatus
                .value ===
                "Collected" &&
            !this.elements
                .collectionDate
                .value
        ) {

            this.elements
                .collectionDate
                .value =
                new Date()
                    .toISOString()
                    .split(
                        "T"
                    )[0];

        }

    },
        savePrizeRecord() {

        const participant =
            this.participants.find(
                item =>
                    item.id ===
                    this.elements.participantId.value
            );

        if (!participant) {

            AdminCommon.showToast(
                "Please select a participant.",
                "warning"
            );

            return;

        }

        const prizeType =
            this.elements.type.value;

        const prizeName =
            prizeType === "Custom Prize"
                ? (
                    this.elements.customPrizeName.value.trim() ||
                    "Custom Prize"
                )
                : prizeType;

        const record = {

            id:
                this.elements.recordId.value ||
                crypto.randomUUID(),

            participantId:
                participant.id,

            participantName:
                participant.name,

            group:
                this.elements.group.value ||
                participant.group,

            position:
                Number(
                    this.elements.position.value
                ) || null,

            prize:
                prizeName,

            customPrizeName:
                this.elements.customPrizeName.value.trim(),

            collectionStatus:
                this.elements.collectionStatus.value,

            collectionDate:
                this.elements.collectionDate.value,

            parentName:
                this.elements.parentName.value.trim(),

            parentPhone:
                this.elements.parentPhone.value.trim(),

            collectedBy:
                this.elements.collectedBy.value.trim(),

            value:
                this.elements.value.value,

            currency:
                this.elements.currency.value,

            remarks:
                this.elements.remarks.value.trim(),

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

        };


        const index =
            this.prizeRecords.findIndex(
                item =>
                    item.id === record.id
            );

        if (
            index >= 0
        ) {

            record.createdAt =
                this.prizeRecords[index]
                    .createdAt;

            this.prizeRecords[index] =
                record;

            AdminCommon.showToast(
                "Prize updated successfully.",
                "success"
            );

        } else {

            this.prizeRecords.push(
                record
            );

            AdminCommon.showToast(
                "Prize assigned successfully.",
                "success"
            );

        }

        this.savePrizeRecords();

        this.closePrizeModal();

        this.applyFilters();

    },


    deletePrizeRecord(
        recordId
    ) {

        const confirmed =
            AdminCommon.confirmAction(
                "Delete this prize record?"
            );

        if (!confirmed) {

            return;

        }

        this.prizeRecords =
            this.prizeRecords.filter(
                record =>
                    record.id !== recordId
            );

        this.savePrizeRecords();

        this.applyFilters();

        AdminCommon.showToast(
            "Prize deleted.",
            "success"
        );

    },


    applyFilters() {

        const search =
            AdminCommon
                .normalizeSearch(
                    this.elements
                        .searchInput
                        .value
                );

        const group =
            this.elements
                .groupFilter
                .value;

        const prizeType =
            this.elements
                .typeFilter
                .value;

        const status =
            this.elements
                .statusFilter
                .value;

        this.filteredRecords =
            this.prizeRecords.filter(
                record => {

                    if (
                        group &&
                        record.group !== group
                    ) {

                        return false;

                    }

                    if (
                        prizeType &&
                        record.prize !== prizeType
                    ) {

                        return false;

                    }

                    if (
                        status &&
                        record.collectionStatus !== status
                    ) {

                        return false;

                    }

                    if (!search) {

                        return true;

                    }

                    const haystack = [

                        record.participantName,

                        record.parentName,

                        record.parentPhone,

                        record.prize,

                        record.group,

                        record.collectionStatus

                    ]
                        .join(" ")
                        .toLowerCase();

                    return haystack.includes(
                        search
                    );

                }
            );

        this.renderTable();

        this.updateStatistics();

        this.updateWinnerCards();

    },


    renderTable() {

        this.elements.tableBody.innerHTML =
            "";

        if (
            this.filteredRecords.length === 0
        ) {

            this.elements.tableWrapper.hidden =
                true;

            this.elements.emptyState.hidden =
                false;

            this.elements.resultSummary.textContent =
                "Showing 0 prize records";

            return;

        }

        this.elements.tableWrapper.hidden =
            false;

        this.elements.emptyState.hidden =
            true;

        this.filteredRecords
            .sort(
                (
                    a,
                    b
                ) =>
                    (a.position || 999) -
                    (b.position || 999)
            )
            .forEach(
                record => {

                    const row =
                        document.createElement(
                            "tr"
                        );

                    row.innerHTML =
`
<td>

<span class="position-badge position-${record.position || "other"}">

${record.position || "-"}

</span>

</td>

<td>

<div class="participant-cell">

<div class="participant-avatar">

${record.participantName
    .split(" ")
    .map(
        p => p[0]
    )
    .join("")
    .slice(0,2)
    .toUpperCase()}

</div>

<div>

<strong>

${AdminCommon.escapeHTML(record.participantName)}

</strong>

<small>

${AdminCommon.escapeHTML(record.parentName || "-")}

</small>

</div>

</div>

</td>

<td>

<span class="group-badge">

Group ${record.group || "-"}

</span>

</td>

<td>

<span class="prize-badge">

${AdminCommon.escapeHTML(record.prize)}

</span>

</td>

<td>

<span class="status-badge ${record.collectionStatus.toLowerCase()}">

${record.collectionStatus}

</span>

</td>

<td>

${AdminCommon.escapeHTML(record.parentPhone || "-")}

</td>

<td>

${record.collectionDate || "-"}

</td>

<td>

<div class="table-actions">

<button
class="icon-btn"
data-prize-action="view"
data-record-id="${record.id}"
title="View">

<i class="fas fa-eye"></i>

</button>

<button
class="icon-btn"
data-prize-action="edit"
data-record-id="${record.id}"
title="Edit">

<i class="fas fa-pen"></i>

</button>

<button
class="icon-btn"
data-prize-action="delete"
data-record-id="${record.id}"
title="Delete">

<i class="fas fa-trash"></i>

</button>

</div>

</td>
`;

                    this.elements.tableBody.appendChild(
                        row
                    );

                }
            );

        this.elements.resultSummary.textContent =
            `Showing ${this.filteredRecords.length} prize record(s)`;

    },


    updateStatistics() {

        AdminCommon.setText(
            "totalPrizeWinners",
            this.prizeRecords.length
        );

        AdminCommon.setText(
            "goldPrizeCount",
            this.prizeRecords.filter(
                r =>
                    r.prize ===
                    "Gold Medal"
            ).length
        );

        AdminCommon.setText(
            "silverPrizeCount",
            this.prizeRecords.filter(
                r =>
                    r.prize ===
                    "Silver Medal"
            ).length
        );

        AdminCommon.setText(
            "bronzePrizeCount",
            this.prizeRecords.filter(
                r =>
                    r.prize ===
                    "Bronze Medal"
            ).length
        );

        AdminCommon.setText(
            "pendingPrizeCount",
            this.prizeRecords.filter(
                r =>
                    r.collectionStatus ===
                    "Pending"
            ).length
        );

        AdminCommon.setText(
            "collectedPrizeCount",
            this.prizeRecords.filter(
                r =>
                    r.collectionStatus ===
                        "Collected" ||
                    r.collectionStatus ===
                        "Delivered"
            ).length
        );

    },


    updateWinnerCards() {

        this.updateWinnerCard(
            1,
            "gold"
        );

        this.updateWinnerCard(
            2,
            "silver"
        );

        this.updateWinnerCard(
            3,
            "bronze"
        );

    },
        updateWinnerCard(
        position,
        prefix
    ) {

        const record =
            this.prizeRecords.find(
                item =>
                    Number(
                        item.position
                    ) === position
            );


        const nameElement =
            document.getElementById(
                `${prefix}WinnerName`
            );


        const groupElement =
            document.getElementById(
                `${prefix}WinnerGroup`
            );


        const prizeElement =
            document.getElementById(
                `${prefix}WinnerPrize`
            );


        const emptyElement =
            document.getElementById(
                `${prefix}WinnerEmpty`
            );


        if (!record) {

            if (nameElement) {

                nameElement.textContent =
                    "Not assigned";

            }


            if (groupElement) {

                groupElement.textContent =
                    "—";

            }


            if (emptyElement) {

                emptyElement.hidden =
                    false;

            }


            return;

        }


        if (nameElement) {

            nameElement.textContent =
                record.participantName;

        }


        if (groupElement) {

            groupElement.textContent =
                record.group
                    ? `Group ${record.group}`
                    : "Group not specified";

        }


        if (prizeElement) {

            prizeElement.innerHTML =
                `
                <i class="fas fa-gift"></i>
                ${AdminCommon.escapeHTML(
                    record.prize
                )}
                `;

        }


        if (emptyElement) {

            emptyElement.hidden =
                true;

        }

    },


    openDetailsModal(
        recordId
    ) {

        const record =
            this.prizeRecords.find(
                item =>
                    item.id === recordId
            );


        if (!record) {

            AdminCommon.showToast(
                "Prize record could not be found.",
                "error"
            );

            return;

        }


        this.activeDetailsRecordId =
            recordId;


        const prizeValue =
            record.value
                ? AdminCommon.formatCurrency(
                    Number(
                        record.value
                    ),
                    record.currency || "EUR"
                )
                : "Not specified";


        this.elements.detailsContent.innerHTML =
            `
            <div class="participant-preview">

                <div class="participant-preview-icon">

                    ${this.getInitials(
                        record.participantName
                    )}

                </div>

                <div>

                    <strong>

                        ${AdminCommon.escapeHTML(
                            record.participantName
                        )}

                    </strong>

                    <span>

                        Group ${AdminCommon.escapeHTML(
                            record.group || "—"
                        )}
                        • Position
                        ${AdminCommon.escapeHTML(
                            record.position || "—"
                        )}

                    </span>

                </div>

            </div>


            <div class="form-grid">

                ${this.createDetailItem(
                    "Prize",
                    record.prize || "—"
                )}

                ${this.createDetailItem(
                    "Collection Status",
                    record.collectionStatus || "Pending"
                )}

                ${this.createDetailItem(
                    "Parent / Guardian",
                    record.parentName || "Not provided"
                )}

                ${this.createDetailItem(
                    "Phone Number",
                    record.parentPhone || "Not provided"
                )}

                ${this.createDetailItem(
                    "Collection Date",
                    record.collectionDate
                        ? AdminCommon.formatDate(
                            record.collectionDate
                        )
                        : "Not recorded"
                )}

                ${this.createDetailItem(
                    "Collected By",
                    record.collectedBy || "Not recorded"
                )}

                ${this.createDetailItem(
                    "Prize Value",
                    prizeValue
                )}

                ${this.createDetailItem(
                    "Currency",
                    record.currency || "EUR"
                )}

                <div class="form-group full-width">

                    <label>
                        Remarks
                    </label>

                    <div
                        style="
                            min-height: 80px;
                            padding: 12px;
                            border: 1px solid #cbd5e1;
                            border-radius: 10px;
                            background: #f8fafc;
                            line-height: 1.6;
                        "
                    >

                        ${AdminCommon.escapeHTML(
                            record.remarks ||
                            "No remarks were added."
                        )}

                    </div>

                </div>

            </div>
            `;


        this.elements.detailsModal.hidden =
            false;

    },


    createDetailItem(
        label,
        value
    ) {

        return `
            <div class="form-group">

                <label>

                    ${AdminCommon.escapeHTML(
                        label
                    )}

                </label>

                <div
                    style="
                        min-height: 43px;
                        display: flex;
                        align-items: center;
                        padding: 10px 12px;
                        border: 1px solid #cbd5e1;
                        border-radius: 10px;
                        background: #f8fafc;
                        color: #1e293b;
                    "
                >

                    ${AdminCommon.escapeHTML(
                        String(
                            value ?? "—"
                        )
                    )}

                </div>

            </div>
        `;

    },


    closeDetailsModal() {

        if (
            this.elements.detailsModal
        ) {

            this.elements.detailsModal.hidden =
                true;

        }


        this.activeDetailsRecordId =
            null;

    },


    printActivePrizeDetails() {

        const record =
            this.prizeRecords.find(
                item =>
                    item.id ===
                    this.activeDetailsRecordId
            );


        if (!record) {

            AdminCommon.showToast(
                "No prize details are currently selected.",
                "warning"
            );

            return;

        }


        const printWindow =
            window.open(
                "",
                "_blank",
                "width=850,height=700"
            );


        if (!printWindow) {

            AdminCommon.showToast(
                "Please allow pop-ups to print the prize details.",
                "warning"
            );

            return;

        }


        const prizeValue =
            record.value
                ? AdminCommon.formatCurrency(
                    Number(
                        record.value
                    ),
                    record.currency || "EUR"
                )
                : "Not specified";


        printWindow.document.write(
            `
            <!DOCTYPE html>

            <html lang="en">

            <head>

                <meta charset="UTF-8">

                <title>
                    Prize Details
                </title>

                <style>

                    body {

                        margin: 0;
                        padding: 40px;
                        color: #1e293b;
                        font-family: Arial, Helvetica, sans-serif;

                    }

                    .document {

                        max-width: 760px;
                        margin: 0 auto;

                    }

                    .header {

                        padding-bottom: 20px;
                        border-bottom: 3px solid #253b80;

                    }

                    h1 {

                        margin: 0;
                        color: #172554;
                        font-size: 28px;

                    }

                    .subtitle {

                        margin-top: 7px;
                        color: #64748b;

                    }

                    .participant {

                        margin: 25px 0;
                        padding: 18px;
                        border-radius: 12px;
                        background: #eff6ff;

                    }

                    .participant h2 {

                        margin: 0 0 7px;
                        color: #1e3a8a;

                    }

                    table {

                        width: 100%;
                        border-collapse: collapse;

                    }

                    th,
                    td {

                        padding: 12px;
                        border: 1px solid #cbd5e1;
                        text-align: left;

                    }

                    th {

                        width: 35%;
                        background: #f8fafc;

                    }

                    .footer {

                        margin-top: 35px;
                        color: #64748b;
                        font-size: 12px;
                        text-align: center;

                    }

                </style>

            </head>

            <body>

                <div class="document">

                    <div class="header">

                        <h1>
                            Kiddysexplorer Prize Record
                        </h1>

                        <div class="subtitle">
                            Quiz Competition Prize Management
                        </div>

                    </div>


                    <div class="participant">

                        <h2>

                            ${AdminCommon.escapeHTML(
                                record.participantName
                            )}

                        </h2>

                        Group
                        ${AdminCommon.escapeHTML(
                            record.group || "—"
                        )}
                        • Position
                        ${AdminCommon.escapeHTML(
                            record.position || "—"
                        )}

                    </div>


                    <table>

                        <tr>

                            <th>
                                Prize
                            </th>

                            <td>

                                ${AdminCommon.escapeHTML(
                                    record.prize || "—"
                                )}

                            </td>

                        </tr>

                        <tr>

                            <th>
                                Collection Status
                            </th>

                            <td>

                                ${AdminCommon.escapeHTML(
                                    record.collectionStatus ||
                                    "Pending"
                                )}

                            </td>

                        </tr>

                        <tr>

                            <th>
                                Parent / Guardian
                            </th>

                            <td>

                                ${AdminCommon.escapeHTML(
                                    record.parentName ||
                                    "Not provided"
                                )}

                            </td>

                        </tr>

                        <tr>

                            <th>
                                Phone Number
                            </th>

                            <td>

                                ${AdminCommon.escapeHTML(
                                    record.parentPhone ||
                                    "Not provided"
                                )}

                            </td>

                        </tr>

                        <tr>

                            <th>
                                Collection Date
                            </th>

                            <td>

                                ${
                                    record.collectionDate
                                        ? AdminCommon.formatDate(
                                            record.collectionDate
                                        )
                                        : "Not recorded"
                                }

                            </td>

                        </tr>

                        <tr>

                            <th>
                                Collected By
                            </th>

                            <td>

                                ${AdminCommon.escapeHTML(
                                    record.collectedBy ||
                                    "Not recorded"
                                )}

                            </td>

                        </tr>

                        <tr>

                            <th>
                                Prize Value
                            </th>

                            <td>

                                ${AdminCommon.escapeHTML(
                                    prizeValue
                                )}

                            </td>

                        </tr>

                        <tr>

                            <th>
                                Remarks
                            </th>

                            <td>

                                ${AdminCommon.escapeHTML(
                                    record.remarks ||
                                    "No remarks"
                                )}

                            </td>

                        </tr>

                    </table>


                    <div class="footer">

                        Printed on
                        ${AdminCommon.formatDateTime(
                            new Date()
                        )}

                    </div>

                </div>

            </body>

            </html>
            `
        );


        printWindow.document.close();

        printWindow.focus();


        window.setTimeout(
            () => {

                printWindow.print();

            },
            300
        );

    },


    exportCSV() {

        if (
            this.filteredRecords.length === 0
        ) {

            AdminCommon.showToast(
                "There are no prize records to export.",
                "warning"
            );

            return;

        }


        const rows =
            this.filteredRecords.map(
                record => ({

                    Position:
                        record.position || "",

                    Participant:
                        record.participantName || "",

                    Group:
                        record.group || "",

                    Prize:
                        record.prize || "",

                    Status:
                        record.collectionStatus || "",

                    "Parent or Guardian":
                        record.parentName || "",

                    "Phone Number":
                        record.parentPhone || "",

                    "Collection Date":
                        record.collectionDate || "",

                    "Collected By":
                        record.collectedBy || "",

                    "Prize Value":
                        record.value || "",

                    Currency:
                        record.currency || "",

                    Remarks:
                        record.remarks || ""

                })
            );


        AdminCommon.exportCSV(
            rows,
            AdminCommon.createDateFilename(
                "kiddysexplorer-prize-records",
                "csv"
            )
        );


        AdminCommon.showToast(
            "Prize records exported successfully.",
            "success"
        );

    },


    resetFilters() {

        this.elements.searchInput.value =
            "";

        this.elements.groupFilter.value =
            "";

        this.elements.typeFilter.value =
            "";

        this.elements.statusFilter.value =
            "";


        this.applyFilters();


        AdminCommon.showToast(
            "Prize filters have been reset.",
            "info"
        );

    },


    getInitials(
        name
    ) {

        return String(
            name || "Participant"
        )
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map(
                word =>
                    word.charAt(0)
            )
            .join("")
            .slice(
                0,
                2
            )
            .toUpperCase();

    },


    slugify(
        value
    ) {

        return String(
            value || ""
        )
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            );

    }

};


document.addEventListener(
    "DOMContentLoaded",
    () => {

        AdminPrizes.init();

    }
);