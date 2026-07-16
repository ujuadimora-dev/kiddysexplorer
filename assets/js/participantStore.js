/*=========================================
    KIDDYSEXPLORER PARTICIPANT STORE
==========================================*/

const ParticipantStore = {

    storageKey: "kiddysexplorerParticipants",


    /* Get every registered participant */
    getAll() {
        try {
            return JSON.parse(
                localStorage.getItem(this.storageKey) || "[]"
            );
        } catch (error) {
            console.error("Could not read participants:", error);
            return [];
        }
    },


    /* Save the complete participant list */
    saveAll(participants) {
        localStorage.setItem(
            this.storageKey,
            JSON.stringify(participants)
        );
    },


    /* Create a simple unique participant ID */
    createId() {
        return (
            "KX-" +
            Date.now() +
            "-" +
            Math.floor(Math.random() * 1000)
        );
    },


    /* Find the active participant */
    getCurrent() {
        const participantId =
            localStorage.getItem("currentParticipantId");

        if (!participantId) {
            return null;
        }

        return (
            this.getAll().find(
                participant =>
                    participant.id === participantId
            ) || null
        );
    },


    /* Register a child */
    register(data) {
        const participants = this.getAll();

        const participant = {
            id: this.createId(),

            childName: data.childName,
            age: Number(data.age) || null,
            parentEmail: data.parentEmail,
            group: data.group,

            section1Score: null,
            section2Score: null,

            section1Status: "Not Started",
            section2Status: "Not Started",

            qualified: false,

            liveAttendance: "Not Marked",
            liveScore: null,

            finalPosition: null,
            prize: null,

            registrationDate:
                new Date().toISOString(),

            lastUpdated:
                new Date().toISOString()
        };

        participants.push(participant);
        this.saveAll(participants);

        localStorage.setItem(
            "currentParticipantId",
            participant.id
        );

        return participant;
    },


    /* Update the current participant */
    updateCurrent(changes) {
        const participantId =
            localStorage.getItem("currentParticipantId");

        if (!participantId) {
            console.warn(
                "No active participant was found."
            );

            return null;
        }

        const participants = this.getAll();

        const participantIndex =
            participants.findIndex(
                participant =>
                    participant.id === participantId
            );

        if (participantIndex === -1) {
            console.warn(
                "The active participant record was not found."
            );

            return null;
        }

        participants[participantIndex] = {
            ...participants[participantIndex],
            ...changes,
            lastUpdated: new Date().toISOString()
        };

        this.saveAll(participants);

        return participants[participantIndex];
    },


    /* Save a Section 1 result */
    saveSection1Score(score) {
        return this.updateCurrent({
            section1Score: score,

            section1Status:
                score >= 80
                    ? "Passed"
                    : "Keep Learning"
        });
    },


    /* Save a Section 2 result */
    saveSection2Score(score) {
        return this.updateCurrent({
            section2Score: score,

            section2Status:
                score >= 80
                    ? "Passed"
                    : "Keep Learning",

            qualified: score >= 80
        });
    },


    /* Save live competition information */
    saveLiveResult(data) {
        return this.updateCurrent({
            liveAttendance:
                data.liveAttendance ??
                "Not Marked",

            liveScore:
                data.liveScore ?? null,

            finalPosition:
                data.finalPosition ?? null,

            prize:
                data.prize ?? null
        });
    },


    /* Remove one participant */
    remove(participantId) {
        const participants =
            this.getAll().filter(
                participant =>
                    participant.id !== participantId
            );

        this.saveAll(participants);
    },


    /* Remove every participant — admin use only */
    clearAll() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(
            "currentParticipantId"
        );
    }
};