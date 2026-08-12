/*=========================================
    KIDDYSEXPLORER ADMIN DASHBOARD
==========================================*/

const AdminDashboard = {

    initialized: false,

    refreshTimer: null,


    /*=====================================
        INITIALIZE
    ======================================*/

    init() {

        if (this.initialized) {
            return;
        }

        if (typeof ParticipantStore === "undefined") {

            console.error(
                "ParticipantStore not found."
            );

            return;

        }

        this.initialized = true;

        this.bindEvents();

        this.refreshDashboard();

    },


    /*=====================================
        EVENTS
    ======================================*/

    bindEvents() {

    window.addEventListener(
        "participants-changed",
        () => {

            this.refreshDashboard();

        }
    );


    window.addEventListener(
        "kiddysexplorer:participants-changed",
        () => {

            this.refreshDashboard();

        }
    );


    window.addEventListener(
        "storage",
        event => {

            if (
                event.key ===
                ParticipantStore.storageKey
            ) {

                this.refreshDashboard();

            }

        }
    );


    window.addEventListener(
        "focus",
        () => {

            this.refreshDashboard();

        }
    );


    window.addEventListener(
        "pageshow",
        () => {

            this.refreshDashboard();

        }
    );

},


    /*=====================================
        REFRESH DASHBOARD
    ======================================*/

    refreshDashboard() {

        if (
            typeof ParticipantStore ===
            "undefined"
        ) {

            return;

        }

        const statistics =
            ParticipantStore.getStatistics();

        this.updateStatisticsCards(
            statistics
        );

        this.loadRecentParticipants();

        this.loadTopPerformers();

        this.loadQualificationChart();

        this.loadGroupChart();

    },


    /*=====================================
        UPDATE CARDS
    ======================================*/

   /*=====================================
    UPDATE CARDS
======================================*/

updateStatisticsCards() {

    const participants =
        ParticipantStore.getAll();


    const groupA =
        participants.filter(
            participant =>
                String(
                    participant.group || ""
                )
                    .trim()
                    .toUpperCase() === "A"
        ).length;


    const groupB =
        participants.filter(
            participant =>
                String(
                    participant.group || ""
                )
                    .trim()
                    .toUpperCase() === "B"
        ).length;


    const groupC =
        participants.filter(
            participant =>
                String(
                    participant.group || ""
                )
                    .trim()
                    .toUpperCase() === "C"
        ).length;


    const qualified =
        participants.filter(
            participant =>
                participant.qualified === true ||
                String(
                    participant.status || ""
                )
                    .trim()
                    .toLowerCase() ===
                    "qualified"
        ).length;


    const registered =
        participants.filter(
            participant => {

                const status =
                    String(
                        participant.status ||
                        "Registered"
                    )
                        .trim()
                        .toLowerCase();

                return status ===
                    "registered";

            }
        ).length;


    const keepLearning =
        participants.filter(
            participant =>
                String(
                    participant.status || ""
                )
                    .trim()
                    .toLowerCase() ===
                    "keep learning"
        ).length;


    const section2Pending =
        participants.filter(
            participant =>
                String(
                    participant.status || ""
                )
                    .trim()
                    .toLowerCase() ===
                    "section 2 pending"
        ).length;


    const liveCompetition =
        participants.filter(
            participant =>
                participant.liveScore !== null &&
                participant.liveScore !== undefined &&
                participant.liveScore !== ""
        ).length;


    const certificates =
        participants.filter(
            participant =>
                String(
                    participant.certificateStatus ||
                    ""
                )
                    .trim()
                    .toLowerCase() ===
                    "generated"
        ).length;


    this.setValue(
        "totalParticipantsCard",
        participants.length
    );


    this.setValue(
        "groupACard",
        groupA
    );


    this.setValue(
        "groupBCard",
        groupB
    );


    this.setValue(
        "groupCCard",
        groupC
    );


    this.setValue(
        "qualifiedCard",
        qualified
    );


    this.setValue(
        "registeredCard",
        registered
    );


    this.setValue(
        "learningCard",
        keepLearning
    );


    this.setValue(
        "section2PendingCard",
        section2Pending
    );


    this.setValue(
        "liveCompetitionCard",
        liveCompetition
    );


    this.setValue(
        "certificateCard",
        certificates
    );

},

    /*=====================================
        RECENT PARTICIPANTS
    ======================================*/

    loadRecentParticipants() {

        const container =
            document.getElementById(
                "recentParticipants"
            );

        if (!container) {

            return;

        }

        const participants =
            ParticipantStore
                .getAll()

                .sort((a,b)=>

                    new Date(
                        b.registrationDate
                    ) -

                    new Date(
                        a.registrationDate
                    )

                )

                .slice(0,5);

        if (
            participants.length === 0
        ) {

            container.innerHTML =

                `<p>No participants yet.</p>`;

            return;

        }

        container.innerHTML =

            participants.map(

                participant =>

                `

<div class="dashboard-participant">

<strong>

${participant.childName}

</strong>

<span>

Group ${participant.group}

</span>

</div>

`

            ).join("");

    },


    /*=====================================
        TOP PERFORMERS
    ======================================*/

    loadTopPerformers() {

        const container =
            document.getElementById(
                "topPerformers"
            );

        if (!container) {

            return;

        }

        const leaders =
            ParticipantStore
                .getLeaderboard()
                .slice(0,5);

        if (
            leaders.length === 0
        ) {

            container.innerHTML =

                `<p>No scores yet.</p>`;

            return;

        }

        container.innerHTML =

            leaders.map(

                (participant,index)=>`

<div class="leader-row">

<span>

${index+1}.

${participant.childName}

</span>

<strong>

${participant.liveScore ?? participant.section2Score ?? participant.section1Score ?? 0}%

</strong>

</div>

`

            ).join("");

    },

        /*=====================================
        GROUP CHART
    ======================================*/

    loadGroupChart() {

        const canvas =
            document.getElementById(
                "groupChart"
            );

        if (
            !canvas ||
            typeof Chart === "undefined"
        ) {
            return;
        }

        const stats =
            ParticipantStore.getStatistics();

        if (this.groupChart) {
            this.groupChart.destroy();
        }

        this.groupChart =
            new Chart(canvas, {

                type: "doughnut",

                data: {

                    labels: [

                        "Group A",
                        "Group B",
                        "Group C"

                    ],

                    datasets: [{

                        data: [

                            stats.groupA,
                            stats.groupB,
                            stats.groupC

                        ],

                        backgroundColor: [

                            "#4F46E5",
                            "#10B981",
                            "#F59E0B"

                        ]

                    }]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            position: "bottom"

                        }

                    }

                }

            });

    },


    /*=====================================
        QUALIFICATION CHART
    ======================================*/

    loadQualificationChart() {

        const canvas =
            document.getElementById(
                "qualificationChart"
            );

        if (
            !canvas ||
            typeof Chart === "undefined"
        ) {
            return;
        }

        const stats =
            ParticipantStore.getStatistics();

        if (
            this.qualificationChart
        ) {

            this.qualificationChart.destroy();

        }

        this.qualificationChart =
            new Chart(canvas,{

                type:"bar",

                data:{

                    labels:[

                        "Qualified",
                        "Learning",
                        "Registered"

                    ],

                    datasets:[{

                        label:"Participants",

                        data:[

                            stats.qualified,
                            stats.keepLearning,
                            stats.registered

                        ],

                        backgroundColor:[

                            "#22C55E",
                            "#F97316",
                            "#3B82F6"

                        ]

                    }]

                },

                options:{

                    responsive:true,

                    scales:{

                        y:{

                            beginAtZero:true

                        }

                    }

                }

            });

    },


    /*=====================================
        REGISTRATION TREND
    ======================================*/

    loadRegistrationChart() {

        const canvas =
            document.getElementById(
                "registrationChart"
            );

        if (
            !canvas ||
            typeof Chart === "undefined"
        ) {

            return;

        }

        const participants =
            ParticipantStore.getAll();

        const days = {};

        participants.forEach(

            participant=>{

                const date =
                    new Date(
                        participant.registrationDate
                    )

                    .toLocaleDateString();

                days[date] =
                    (days[date]||0)+1;

            }

        );

        if (
            this.registrationChart
        ) {

            this.registrationChart.destroy();

        }

        this.registrationChart =
            new Chart(canvas,{

                type:"line",

                data:{

                    labels:
                        Object.keys(days),

                    datasets:[{

                        label:
                            "Registrations",

                        data:
                            Object.values(days),

                        borderWidth:3,

                        tension:.3,

                        fill:false

                    }]

                },

                options:{

                    responsive:true

                }

            });

    },


    /*=====================================
        RECENT ACTIVITY
    ======================================*/

    loadRecentActivity() {

        const container =
            document.getElementById(
                "recentActivity"
            );

        if (!container) {

            return;

        }

        const participants =
            ParticipantStore
                .getAll()

                .sort(

                    (a,b)=>

                        new Date(
                            b.lastUpdated ||
                            b.registrationDate
                        )

                        -

                        new Date(
                            a.lastUpdated ||
                            a.registrationDate
                        )

                )

                .slice(0,8);

        if (
            participants.length===0
        ) {

            container.innerHTML=

                "<p>No recent activity.</p>";

            return;

        }

        container.innerHTML=

            participants.map(

                participant=>`

<div class="activity-row">

<div>

<strong>

${participant.childName}

</strong>

</div>

<div>

${participant.status ||
"Registered"}

</div>

</div>

`

            ).join("");

    },


    /*=====================================
        QUICK ACTION BUTTONS
    ======================================*/

    bindQuickActions() {

        this.quickAction(

            "quickRegister",

            "admin-participants.html"

        );

        this.quickAction(

            "quickCertificates",

            "admin-certificates.html"

        );

        this.quickAction(

            "quickPrizes",

            "admin-prizes.html"

        );

        this.quickAction(

            "quickLeaderboard",

            "admin-leaderboard.html"

        );

        this.quickAction(

            "quickReports",

            "admin-reports.html"

        );

        this.quickAction(

            "quickLive",

            "admin-live-competition.html"

        );

    },


    quickAction(id,url){

        const button =
            document.getElementById(id);

        if(!button)
            return;

        button.onclick=()=>{

            window.location.href=url;

        };

    },

        /*=====================================
        UPDATE DASHBOARD VALUE
    ======================================*/

    setValue(elementId, value) {

        const element =
            document.getElementById(
                elementId
            );

        if (!element) {

            return;

        }

        const numericValue =
            Number(value);

        if (
            Number.isFinite(
                numericValue
            )
        ) {

            this.animateNumber(
                element,
                numericValue
            );

            return;

        }

        element.textContent =
            value ?? 0;

    },


    /*=====================================
        ANIMATE STATISTIC NUMBERS
    ======================================*/

    animateNumber(
        element,
        finalValue
    ) {

        const currentValue =
            Number(
                element.dataset.currentValue ||
                element.textContent
            ) || 0;

        const targetValue =
            Number(finalValue) || 0;

        if (
            currentValue ===
            targetValue
        ) {

            element.textContent =
                targetValue;

            element.dataset.currentValue =
                targetValue;

            return;

        }

        const duration =
            500;

        const startTime =
            performance.now();


        const updateNumber =
            currentTime => {

                const elapsed =
                    currentTime -
                    startTime;

                const progress =
                    Math.min(
                        elapsed / duration,
                        1
                    );

                const animatedValue =
                    Math.round(
                        currentValue +
                        (
                            targetValue -
                            currentValue
                        ) *
                        progress
                    );

                element.textContent =
                    animatedValue;

                if (
                    progress < 1
                ) {

                    requestAnimationFrame(
                        updateNumber
                    );

                    return;

                }

                element.textContent =
                    targetValue;

                element.dataset.currentValue =
                    targetValue;

            };


        requestAnimationFrame(
            updateNumber
        );

    },


    /*=====================================
        FORMAT PARTICIPANT SCORE
    ======================================*/

    getParticipantScore(
        participant
    ) {

        const possibleScores = [

            participant.liveScore,
            participant.section2Score,
            participant.section1Score

        ];

        const score =
            possibleScores.find(
                value =>
                    value !== null &&
                    value !== undefined &&
                    value !== "" &&
                    Number.isFinite(
                        Number(value)
                    )
            );

        return score === undefined
            ? 0
            : Number(score);

    },


    /*=====================================
        FORMAT DATE
    ======================================*/

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
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"
            }
        );

    },


    /*=====================================
        FORMAT RELATIVE TIME
    ======================================*/

    formatRelativeTime(value) {

        if (!value) {

            return "Date unavailable";

        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Date unavailable";

        }

        const difference =
            Date.now() -
            date.getTime();

        const minutes =
            Math.floor(
                difference /
                60000
            );

        if (minutes < 1) {

            return "Just now";

        }

        if (minutes < 60) {

            return `${minutes} minute${
                minutes === 1
                    ? ""
                    : "s"
            } ago`;

        }

        const hours =
            Math.floor(
                minutes / 60
            );

        if (hours < 24) {

            return `${hours} hour${
                hours === 1
                    ? ""
                    : "s"
            } ago`;

        }

        const days =
            Math.floor(
                hours / 24
            );

        if (days < 7) {

            return `${days} day${
                days === 1
                    ? ""
                    : "s"
            } ago`;

        }

        return this.formatDate(
            value
        );

    },


    /*=====================================
        ESCAPE HTML
    ======================================*/

    escapeHTML(value) {

        return String(
            value ?? ""
        )
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
    EXTEND THE MAIN DASHBOARD REFRESH
==========================================*/

const originalDashboardRefresh =
    AdminDashboard
        .refreshDashboard
        .bind(
            AdminDashboard
        );


AdminDashboard.refreshDashboard =
    function() {

        originalDashboardRefresh();

        this.loadRegistrationChart();

        this.loadRecentActivity();

    };


/*=========================================
    START DASHBOARD WHEN PAGE IS READY
==========================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        AdminDashboard.init();

        AdminDashboard.bindQuickActions();

    }
);