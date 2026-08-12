/*=========================================
    KIDDYSEXPLORER PARTICIPANT STORE
==========================================*/

const ParticipantStore = {

    storageKey: "kiddysexplorerParticipants",


    /*=====================================
        GET ALL PARTICIPANTS
    ======================================*/

    getAll() {
        try {
            const storedData =
                localStorage.getItem(
                    this.storageKey
                );

            const participants =
                JSON.parse(
                    storedData || "[]"
                );

            return Array.isArray(participants)
                ? participants
                : [];

        } catch (error) {
            console.error(
                "Could not read participants:",
                error
            );

            return [];
        }
    },


    /*=====================================
        SAVE ALL PARTICIPANTS
    ======================================*/

   saveAll(participants) {

    try {

        if (!Array.isArray(participants)) {

            console.error(
                "Participants must be an array."
            );

            return false;
        }


        localStorage.setItem(
            this.storageKey,
            JSON.stringify(participants)
        );


        window.dispatchEvent(
            new CustomEvent(
                "participants-changed",
                {
                    detail: {
                        participants:
                            [...participants]
                    }
                }
            )
        );


        return true;

    } catch (error) {

        console.error(
            "Could not save participants:",
            error
        );

        return false;

    }

},


    /*=====================================
        CREATE PARTICIPANT ID
    ======================================*/

    createId() {
        return (
            "KX-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 100000
            )
        );
    },


    /*=====================================
        GET CURRENT PARTICIPANT
    ======================================*/

    getCurrent() {
        const participantId =
            localStorage.getItem(
                "currentParticipantId"
            );


        if (!participantId) {
            return null;
        }


        return this.getById(
            participantId
        );
    },


    /*=====================================
        GET PARTICIPANT BY ID
    ======================================*/

    getById(participantId) {
        if (!participantId) {
            return null;
        }


        return (
            this.getAll().find(
                participant =>
                    String(participant.id) ===
                    String(participantId)
            ) || null
        );
    },


    /*=====================================
        REGISTER PARTICIPANT
    ======================================*/

    register(data) {
        if (
            !data ||
            typeof data !== "object"
        ) {
            console.error(
                "Participant registration data is missing."
            );

            return null;
        }


        const participants =
            this.getAll();


        const childName =
            String(
                data.childName || ""
            ).trim();


        const parentEmail =
            String(
                data.parentEmail || ""
            )
                .trim()
                .toLowerCase();


        const group =
            String(
                data.group || ""
            )
                .trim()
                .toUpperCase();


        const age =
            Number(data.age);


        if (
            !childName ||
            !parentEmail ||
            !group ||
            !Number.isInteger(age) ||
            age < 3 ||
            age > 12
        ) {
            console.error(
                "Incomplete or invalid participant registration data."
            );

            return null;
        }


        if (
            !["A", "B", "C"].includes(group)
        ) {
            console.error(
                "Invalid participant group."
            );

            return null;
        }


        const existingParticipant =
            participants.find(
                participant =>
                    String(
                        participant.childName ||
                        ""
                    )
                        .trim()
                        .toLowerCase() ===
                    childName.toLowerCase() &&

                    String(
                        participant.parentEmail ||
                        ""
                    )
                        .trim()
                        .toLowerCase() ===
                    parentEmail
            );


        if (existingParticipant) {
            localStorage.setItem(
                "currentParticipantId",
                existingParticipant.id
            );

            return existingParticipant;
        }


        const currentDate =
            new Date().toISOString();


        const participant = {

            id:
                this.createId(),

            childName:
                childName,

            age:
                age,

            parentEmail:
                parentEmail,

            group:
                group,

            section1Score:
                null,

            section2Score:
                null,

            section1Status:
                "Not Started",

            section2Status:
                "Not Started",

            status:
                "Registered",

            qualified:
                false,

            liveAttendance:
                "Not Marked",

            liveScore:
                null,

            finalPosition:
                null,

            prize:
                null,

            registrationDate:
                currentDate,

            lastUpdated:
                currentDate
        };


        participants.push(
            participant
        );


        const saved =
            this.saveAll(
                participants
            );


        if (!saved) {
            return null;
        }


        localStorage.setItem(
            "currentParticipantId",
            participant.id
        );


        return participant;
    },


    /*=====================================
        UPDATE PARTICIPANT BY ID
    ======================================*/

    update(participantId, changes) {
        if (!participantId) {
            console.error(
                "Participant ID is required."
            );

            return null;
        }


        if (
            !changes ||
            typeof changes !== "object"
        ) {
            console.error(
                "Participant update data is missing."
            );

            return null;
        }


        const participants =
            this.getAll();


        const participantIndex =
            participants.findIndex(
                participant =>
                    String(participant.id) ===
                    String(participantId)
            );


        if (participantIndex === -1) {
            console.warn(
                "Participant record was not found."
            );

            return null;
        }


        const currentParticipant =
            participants[
            participantIndex
            ];


        const allowedChanges = {};


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "childName"
            )
        ) {
            const childName =
                String(
                    changes.childName || ""
                ).trim();


            if (!childName) {
                console.error(
                    "Child name cannot be empty."
                );

                return null;
            }


            allowedChanges.childName =
                childName;
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "parentEmail"
            )
        ) {
            const parentEmail =
                String(
                    changes.parentEmail || ""
                )
                    .trim()
                    .toLowerCase();


            if (
                !this.isValidEmail(
                    parentEmail
                )
            ) {
                console.error(
                    "A valid parent email is required."
                );

                return null;
            }


            allowedChanges.parentEmail =
                parentEmail;
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "age"
            )
        ) {
            const age =
                Number(
                    changes.age
                );


            if (
                !Number.isInteger(age) ||
                age < 3 ||
                age > 12
            ) {
                console.error(
                    "Participant age must be between 3 and 12."
                );

                return null;
            }


            allowedChanges.age =
                age;
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "group"
            )
        ) {
            const group =
                String(
                    changes.group || ""
                )
                    .trim()
                    .toUpperCase();


            if (
                !["A", "B", "C"].includes(
                    group
                )
            ) {
                console.error(
                    "Participant group must be A, B or C."
                );

                return null;
            }


            allowedChanges.group =
                group;
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "section1Score"
            )
        ) {
            allowedChanges.section1Score =
                this.normalizeScore(
                    changes.section1Score
                );
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "section2Score"
            )
        ) {
            allowedChanges.section2Score =
                this.normalizeScore(
                    changes.section2Score
                );
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "section1Status"
            )
        ) {
            allowedChanges.section1Status =
                String(
                    changes.section1Status ||
                    ""
                ).trim();
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "section2Status"
            )
        ) {
            allowedChanges.section2Status =
                String(
                    changes.section2Status ||
                    ""
                ).trim();
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "status"
            )
        ) {
            allowedChanges.status =
                String(
                    changes.status ||
                    ""
                ).trim();
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "qualified"
            )
        ) {
            allowedChanges.qualified =
                Boolean(
                    changes.qualified
                );
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "liveAttendance"
            )
        ) {
            allowedChanges.liveAttendance =
                String(
                    changes.liveAttendance ||
                    "Not Marked"
                ).trim();
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "liveScore"
            )
        ) {
            allowedChanges.liveScore =
                this.normalizeOptionalNumber(
                    changes.liveScore
                );
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "finalPosition"
            )
        ) {
            allowedChanges.finalPosition =
                this.normalizeOptionalValue(
                    changes.finalPosition
                );
        }


        if (
            Object.prototype.hasOwnProperty.call(
                changes,
                "prize"
            )
        ) {
            allowedChanges.prize =
                this.normalizeOptionalValue(
                    changes.prize
                );
        }


        const duplicateParticipant =
            participants.find(
                participant =>
                    String(participant.id) !==
                    String(participantId) &&

                    String(
                        participant.childName ||
                        ""
                    )
                        .trim()
                        .toLowerCase() ===
                    String(
                        allowedChanges.childName ??
                        currentParticipant.childName ??
                        ""
                    )
                        .trim()
                        .toLowerCase() &&

                    String(
                        participant.parentEmail ||
                        ""
                    )
                        .trim()
                        .toLowerCase() ===
                    String(
                        allowedChanges.parentEmail ??
                        currentParticipant.parentEmail ??
                        ""
                    )
                        .trim()
                        .toLowerCase()
            );


        if (duplicateParticipant) {
            console.error(
                "Another participant already uses this child name and parent email."
            );

            return null;
        }


        participants[
            participantIndex
        ] = {

            ...currentParticipant,

            ...allowedChanges,

            lastUpdated:
                new Date().toISOString()
        };


        const saved =
            this.saveAll(
                participants
            );


        if (!saved) {
            return null;
        }


        return participants[
            participantIndex
        ];
    },


    /*=====================================
        UPDATE CURRENT PARTICIPANT
    ======================================*/

    updateCurrent(changes) {
        const participantId =
            localStorage.getItem(
                "currentParticipantId"
            );


        if (!participantId) {
            console.warn(
                "No active participant was found."
            );

            return null;
        }


        return this.update(
            participantId,
            changes
        );
    },


    /*=====================================
        SAVE SECTION 1 SCORE
    ======================================*/

    saveSection1Score(score) {
        const percentage =
            this.normalizeScore(
                score
            );


        const finalScore =
            percentage === null
                ? 0
                : percentage;


        const passed =
            finalScore >= 80;


        return this.updateCurrent({

            section1Score:
                finalScore,

            section1Status:
                passed
                    ? "Passed"
                    : "Keep Learning",

            status:
                passed
                    ? "Section 2 Pending"
                    : "Keep Learning",

            qualified:
                false
        });
    },


    /*=====================================
        SAVE SECTION 2 SCORE
    ======================================*/

    saveSection2Score(score) {
        const percentage =
            this.normalizeScore(
                score
            );


        const finalScore =
            percentage === null
                ? 0
                : percentage;


        const passed =
            finalScore >= 80;


        return this.updateCurrent({

            section2Score:
                finalScore,

            section2Status:
                passed
                    ? "Passed"
                    : "Keep Learning",

            status:
                passed
                    ? "Qualified"
                    : "Keep Learning",

            qualified:
                passed
        });
    },


    /*=====================================
        SAVE LIVE COMPETITION RESULT
    ======================================*/

    saveLiveResult(data) {
        if (
            !data ||
            typeof data !== "object"
        ) {
            console.error(
                "Live competition data is missing."
            );

            return null;
        }


        return this.updateCurrent({

            liveAttendance:
                data.liveAttendance ??
                "Not Marked",

            liveScore:
                data.liveScore ??
                null,

            finalPosition:
                data.finalPosition ??
                null,

            prize:
                data.prize ??
                null
        });
    },


    /*=====================================
        SAVE LIVE RESULT BY PARTICIPANT ID
    ======================================*/

    saveLiveResultById(
        participantId,
        data
    ) {
        if (
            !data ||
            typeof data !== "object"
        ) {
            console.error(
                "Live competition data is missing."
            );

            return null;
        }


        return this.update(
            participantId,
            {

                liveAttendance:
                    data.liveAttendance ??
                    "Not Marked",

                liveScore:
                    data.liveScore ??
                    null,

                finalPosition:
                    data.finalPosition ??
                    null,

                prize:
                    data.prize ??
                    null
            }
        );
    },


    /*=====================================
        REMOVE PARTICIPANT
    ======================================*/

    remove(participantId) {
        if (!participantId) {
            return false;
        }


        const participants =
            this.getAll();


        const participantExists =
            participants.some(
                participant =>
                    String(participant.id) ===
                    String(participantId)
            );


        if (!participantExists) {
            return false;
        }


        const remainingParticipants =
            participants.filter(
                participant =>
                    String(participant.id) !==
                    String(participantId)
            );


        const saved =
            this.saveAll(
                remainingParticipants
            );


        if (!saved) {
            return false;
        }


        const currentParticipantId =
            localStorage.getItem(
                "currentParticipantId"
            );


        if (
            String(currentParticipantId) ===
            String(participantId)
        ) {
            localStorage.removeItem(
                "currentParticipantId"
            );
        }


        return true;
    },


    /*=====================================
        CLEAR ALL PARTICIPANTS
    ======================================*/

   clearAll() {

    try {

        localStorage.removeItem(
            this.storageKey
        );

        localStorage.removeItem(
            "currentParticipantId"
        );


        window.dispatchEvent(
            new CustomEvent(
                "participants-changed",
                {
                    detail: {
                        participants: []
                    }
                }
            )
        );


        return true;

    } catch (error) {

        console.error(
            "Could not clear participants:",
            error
        );

        return false;

    }

},

    /*=====================================
        VALIDATE EMAIL
    ======================================*/

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            String(email || "").trim()
        );
    },


    /*=====================================
        NORMALIZE SCORE
    ======================================*/

    normalizeScore(score) {
        if (
            score === null ||
            score === undefined ||
            score === ""
        ) {
            return null;
        }


        const numericScore =
            Number(score);


        if (
            !Number.isFinite(
                numericScore
            )
        ) {
            return null;
        }


        return Math.min(
            100,
            Math.max(
                0,
                numericScore
            )
        );
    },


    /*=====================================
        NORMALIZE OPTIONAL NUMBER
    ======================================*/

    normalizeOptionalNumber(value) {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return null;
        }


        const numberValue =
            Number(value);


        return Number.isFinite(numberValue)
            ? numberValue
            : null;
    },


    /*=====================================
        NORMALIZE OPTIONAL VALUE
    ======================================*/

    normalizeOptionalValue(value) {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return null;
        }


        return String(value).trim();
    },

    /*=====================================
    GET PARTICIPANTS BY GROUP
=====================================*/

    getParticipantsByGroup(group) {

        group = String(group || "")
            .trim()
            .toUpperCase();

        return this.getAll().filter(

            participant =>

                participant.group === group

        );

    },


    /*=====================================
        GET QUALIFIED PARTICIPANTS
    =====================================*/

    getQualifiedParticipants() {

        return this.getAll().filter(

            participant =>

                participant.qualified === true ||

                participant.status === "Qualified"

        );

    },


    /*=====================================
        GET LEADERBOARD
    =====================================*/

    getLeaderboard(group = null) {

        let participants = this.getAll();

        if (group) {

            participants = participants.filter(

                participant =>

                    participant.group ===
                    String(group).toUpperCase()

            );

        }

        return participants.sort(

            (a, b) => {

                const scoreA =
                    a.liveScore ??
                    a.section2Score ??
                    a.section1Score ??
                    0;

                const scoreB =
                    b.liveScore ??
                    b.section2Score ??
                    b.section1Score ??
                    0;

                return scoreB - scoreA;

            }

        );

    },


    /*=====================================
        GET TOP THREE
    =====================================*/

    getTopThree(group = null) {

        return this.getLeaderboard(group)
            .slice(0, 3);

    },


    /*=====================================
        GET STATISTICS
    =====================================*/

    getStatistics() {

        const participants =
            this.getAll();

        return {

            totalParticipants:
                participants.length,

            qualifiedParticipants:
                participants.filter(

                    p => p.qualified

                ).length,

            section1Completed:
                participants.filter(

                    p =>

                        p.section1Score !== null

                ).length,

            section2Completed:
                participants.filter(

                    p =>

                        p.section2Score !== null

                ).length,

            liveCompleted:
                participants.filter(

                    p =>

                        p.liveScore !== null

                ).length

        };

    },
};