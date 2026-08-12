/*=========================================================
  KIDDYSEXPLORER ADMIN LEADERBOARD
=========================================================*/

"use strict";

const AdminLeaderboard = {

    participants: [],

    filteredParticipants: [],

    init() {

        if (
            typeof ParticipantStore === "undefined" ||
            typeof ParticipantStore.getAll !== "function"
        ) {

            console.error(
                "ParticipantStore is not loaded."
            );

            this.showToast(
                "Leaderboard data could not be loaded.",
                "error"
            );

            return;

        }

        this.bindEvents();

        this.refresh();

    },

    bindEvents() {

        document
            .getElementById(
                "leaderboardSearchInput"
            )
            ?.addEventListener(
                "input",
                () => this.applyFilters()
            );

        document
            .getElementById(
                "leaderboardGroupFilter"
            )
            ?.addEventListener(
                "change",
                () => this.applyFilters()
            );

        document
            .getElementById(
                "leaderboardPublishFilter"
            )
            ?.addEventListener(
                "change",
                () => this.applyFilters()
            );

        document
            .getElementById(
                "refreshLeaderboardBtn"
            )
            ?.addEventListener(
                "click",
                () => this.refresh(true)
            );

        document
            .getElementById(
                "exportLeaderboardCsvBtn"
            )
            ?.addEventListener(
                "click",
                () => this.exportCSV()
            );

        document
            .getElementById(
                "printLeaderboardBtn"
            )
            ?.addEventListener(
                "click",
                () => window.print()
            );

    },

    refresh(showMessage = false) {

        const records =
            ParticipantStore.getAll();

        this.participants = (
            Array.isArray(records)
                ? records
                : []
        )
            .filter(
                participant =>
                    this.hasFinalPosition(
                        participant
                    )
            )
            .sort(
                (first, second) =>
                    this.compareParticipants(
                        first,
                        second
                    )
            );

        this.applyFilters();

        if (showMessage) {

            this.showToast(
                "Leaderboard refreshed.",
                "success"
            );

        }

    },

    hasFinalPosition(participant) {

        const position =
            Number(participant.position);

        const score =
            Number(participant.liveScore);

        return (
            Number.isFinite(position) &&
            position > 0 &&
            Number.isFinite(score)
        );

    },

    compareParticipants(first, second) {

        const positionDifference =
            Number(first.position) -
            Number(second.position);

        if (positionDifference !== 0) {

            return positionDifference;

        }

        return (
            Number(second.liveScore) -
            Number(first.liveScore)
        );

    },

    getId(participant) {

        return String(
            participant.id ??
            participant.participantId ??
            participant.registrationId ??
            ""
        );

    },

    getName(participant) {

        return (
            participant.childName ||
            participant.name ||
            participant.participantName ||
            "Unnamed Participant"
        );

    },

    getEmail(participant) {

        return (
            participant.parentEmail ||
            participant.email ||
            ""
        );

    },

    getGroup(participant) {

        return String(
            participant.group || "—"
        ).toUpperCase();

    },

    isPublished(participant) {

        return (
            participant.winnersPublished === true ||
            participant.resultsPublished === true
        );

    },

    applyFilters() {

        const search =
            (
                document.getElementById(
                    "leaderboardSearchInput"
                )?.value || ""
            )
                .trim()
                .toLowerCase();

        const group =
            document.getElementById(
                "leaderboardGroupFilter"
            )?.value || "All";

        const publication =
            document.getElementById(
                "leaderboardPublishFilter"
            )?.value || "All";

        this.filteredParticipants =
            this.participants.filter(
                participant => {

                    const name =
                        this.getName(
                            participant
                        ).toLowerCase();

                    const email =
                        this.getEmail(
                            participant
                        ).toLowerCase();

                    const matchesSearch =
                        !search ||
                        name.includes(search) ||
                        email.includes(search);

                    const matchesGroup =
                        group === "All" ||
                        this.getGroup(
                            participant
                        ) === group;

                    const published =
                        this.isPublished(
                            participant
                        );

                    const matchesPublication =
                        publication === "All" ||
                        (
                            publication ===
                            "Published" &&
                            published
                        ) ||
                        (
                            publication ===
                            "Not Published" &&
                            !published
                        );

                    return (
                        matchesSearch &&
                        matchesGroup &&
                        matchesPublication
                    );

                }
            );

        this.render();

    },

        render() {

        this.renderTable();

        this.renderPodium();

        this.updateStatistics();

    },

    renderTable() {

        const tableBody =
            document.getElementById(
                "leaderboardTableBody"
            );

        const emptyState =
            document.getElementById(
                "leaderboardEmptyState"
            );

        if (!tableBody) {

            return;

        }

        tableBody.innerHTML = "";

        if (
            this.filteredParticipants.length === 0
        ) {

            if (emptyState) {

                emptyState.hidden = false;

            }

            return;

        }

        if (emptyState) {

            emptyState.hidden = true;

        }

        this.filteredParticipants.forEach(
            participant => {

                tableBody.insertAdjacentHTML(
                    "beforeend",
                    this.rowTemplate(
                        participant
                    )
                );

            }
        );

    },

    rowTemplate(participant) {

        const position =
            Number(participant.position);

        const published =
            this.isPublished(
                participant
            );

        const prize =
            participant.prize ||
            "Not assigned";

        return `
            <tr>

                <td>
                    <span class="leader-position ${this.positionClass(
                        position
                    )}">
                        ${this.positionDisplay(
                            position
                        )}
                    </span>
                </td>

                <td>

                    <strong>
                        ${this.escapeHTML(
                            this.getName(
                                participant
                            )
                        )}
                    </strong>

                    <br>

                    <small>
                        ${this.escapeHTML(
                            this.getEmail(
                                participant
                            )
                        )}
                    </small>

                </td>

                <td>
                    Group ${this.escapeHTML(
                        this.getGroup(
                            participant
                        )
                    )}
                </td>

                <td>
                    ${this.formatScore(
                        participant.section2Score,
                        "%"
                    )}
                </td>

                <td>
                    <span class="leader-score">
                        ${this.formatScore(
                            participant.liveScore,
                            " points"
                        )}
                    </span>
                </td>

                <td>
                    <span class="leader-prize">
                        ${this.escapeHTML(
                            prize
                        )}
                    </span>
                </td>

                <td>
                    <span class="leader-status ${
                        published
                            ? "published"
                            : ""
                    }">
                        ${
                            published
                                ? "Published"
                                : "Not Published"
                        }
                    </span>
                </td>

            </tr>
        `;

    },

    renderPodium() {

        const ranked =
            [...this.participants]
                .sort(
                    (first, second) =>
                        this.compareParticipants(
                            first,
                            second
                        )
                );

        const first =
            ranked.find(
                participant =>
                    Number(
                        participant.position
                    ) === 1
            );

        const second =
            ranked.find(
                participant =>
                    Number(
                        participant.position
                    ) === 2
            );

        const third =
            ranked.find(
                participant =>
                    Number(
                        participant.position
                    ) === 3
            );

        this.fillPodiumSlot(
            "First",
            first
        );

        this.fillPodiumSlot(
            "Second",
            second
        );

        this.fillPodiumSlot(
            "Third",
            third
        );

    },

    fillPodiumSlot(slot, participant) {

        this.setText(
            `leader${slot}Name`,
            participant
                ? this.getName(
                    participant
                )
                : "Not yet available"
        );

        this.setText(
            `leader${slot}Group`,
            participant
                ? `Group ${this.getGroup(
                    participant
                )}`
                : "Group —"
        );

        this.setText(
            `leader${slot}Score`,
            participant
                ? `${participant.liveScore} points`
                : "—"
        );

        this.setText(
            `leader${slot}Prize`,
            participant
                ? (
                    participant.prize ||
                    "No prize assigned"
                )
                : "No prize assigned"
        );

    },
        updateStatistics() {

        const publishedCount =
            this.participants.filter(
                participant =>
                    this.isPublished(
                        participant
                    )
            ).length;

        const scores =
            this.participants
                .map(
                    participant =>
                        Number(
                            participant.liveScore
                        )
                )
                .filter(
                    score =>
                        Number.isFinite(score)
                );

        const highestScore =
            scores.length > 0
                ? Math.max(...scores)
                : null;

        const groups =
            new Set(
                this.participants
                    .map(
                        participant =>
                            this.getGroup(
                                participant
                            )
                    )
                    .filter(
                        group =>
                            group !== "—"
                    )
            );

        this.setText(
            "leaderRankedCount",
            this.participants.length
        );

        this.setText(
            "leaderPublishedCount",
            publishedCount
        );

        this.setText(
            "leaderHighestScore",
            highestScore === null
                ? "—"
                : `${highestScore}`
        );

        this.setText(
            "leaderGroupCount",
            groups.size
        );

    },

    exportCSV() {

        if (
            this.filteredParticipants.length === 0
        ) {

            this.showToast(
                "There are no leaderboard records to export.",
                "error"
            );

            return;

        }

        const rows = [
            [
                "Position",
                "Participant",
                "Parent Email",
                "Group",
                "Section 2 Score",
                "Live Score",
                "Prize",
                "Publication Status"
            ]
        ];

        this.filteredParticipants.forEach(
            participant => {

                rows.push([
                    participant.position ?? "",
                    this.getName(
                        participant
                    ),
                    this.getEmail(
                        participant
                    ),
                    this.getGroup(
                        participant
                    ),
                    participant.section2Score ?? "",
                    participant.liveScore ?? "",
                    participant.prize ?? "",
                    this.isPublished(
                        participant
                    )
                        ? "Published"
                        : "Not Published"
                ]);

            }
        );

        const csv =
            rows
                .map(
                    row =>
                        row
                            .map(
                                value =>
                                    `"${String(
                                        value
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

        const downloadLink =
            document.createElement(
                "a"
            );

        downloadLink.href =
            url;

        downloadLink.download =
            `kiddysexplorer-leaderboard-${
                new Date()
                    .toISOString()
                    .slice(
                        0,
                        10
                    )
            }.csv`;

        document.body.appendChild(
            downloadLink
        );

        downloadLink.click();

        downloadLink.remove();

        URL.revokeObjectURL(
            url
        );

        this.showToast(
            "Leaderboard CSV exported.",
            "success"
        );

    },

    positionDisplay(position) {

        if (position === 1) {

            return "🥇 1st";

        }

        if (position === 2) {

            return "🥈 2nd";

        }

        if (position === 3) {

            return "🥉 3rd";

        }

        return `${position}th`;

    },

    positionClass(position) {

        if (position === 1) {

            return "first";

        }

        if (position === 2) {

            return "second";

        }

        if (position === 3) {

            return "third";

        }

        return "";

    },

    formatScore(value, suffix = "") {

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

    setText(id, value) {

        const element =
            document.getElementById(
                id
            );

        if (element) {

            element.textContent =
                value;

        }

    },

    showToast(
        message,
        type = "success"
    ) {

        const container =
            document.getElementById(
                "adminToastContainer"
            );

        if (!container) {

            return;

        }

        const toast =
            document.createElement(
                "div"
            );

        toast.className =
            `admin-toast ${type}`;

        toast.innerHTML = `
            <i class="fas ${
                type === "error"
                    ? "fa-circle-exclamation"
                    : "fa-circle-check"
            }"></i>

            <span>
                ${this.escapeHTML(
                    message
                )}
            </span>
        `;

        container.appendChild(
            toast
        );

        requestAnimationFrame(
            () => {
                toast.classList.add(
                    "show"
                );
            }
        );

        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

                setTimeout(
                    () => toast.remove(),
                    300
                );

            },
            3200
        );

    },

    escapeHTML(value) {

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

document.addEventListener(
    "DOMContentLoaded",
    () => {

        AdminLeaderboard.init();

    }
);