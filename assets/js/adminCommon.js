/*=========================================================
  KIDDYSEXPLORER ADMIN COMMON UTILITIES
=========================================================*/

"use strict";

const AdminCommon = {

    initialized: false,

    init() {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        this.bindSidebar();

        this.setCurrentYear();

    },

    bindSidebar() {

        const menuButton =
            document.getElementById(
                "adminMenuBtn"
            );

        const sidebar =
            document.getElementById(
                "adminSidebar"
            );

        const overlay =
            document.getElementById(
                "adminOverlay"
            );

        if (
            !menuButton ||
            !sidebar
        ) {
            return;
        }

        menuButton.addEventListener(
            "click",
            () => {

                this.toggleSidebar();

            }
        );

        overlay?.addEventListener(
            "click",
            () => {

                this.closeSidebar();

            }
        );

        document
            .querySelectorAll(
                ".sidebar-link"
            )
            .forEach(
                link => {

                    link.addEventListener(
                        "click",
                        () => {

                            if (
                                window.innerWidth <=
                                1024
                            ) {

                                this.closeSidebar();

                            }

                        }
                    );

                }
            );

        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth >
                    1024
                ) {

                    this.closeSidebar();

                }

            }
        );

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    this.closeSidebar();

                }

            }
        );

    },

    openSidebar() {

        const sidebar =
            document.getElementById(
                "adminSidebar"
            );

        const overlay =
            document.getElementById(
                "adminOverlay"
            );

        const menuButton =
            document.getElementById(
                "adminMenuBtn"
            );

        sidebar?.classList.add(
            "sidebar-open"
        );

        overlay?.classList.add(
            "overlay-visible"
        );

        overlay?.setAttribute(
            "aria-hidden",
            "false"
        );

        menuButton?.setAttribute(
            "aria-expanded",
            "true"
        );

    },

    closeSidebar() {

        const sidebar =
            document.getElementById(
                "adminSidebar"
            );

        const overlay =
            document.getElementById(
                "adminOverlay"
            );

        const menuButton =
            document.getElementById(
                "adminMenuBtn"
            );

        sidebar?.classList.remove(
            "sidebar-open"
        );

        overlay?.classList.remove(
            "overlay-visible"
        );

        overlay?.setAttribute(
            "aria-hidden",
            "true"
        );

        menuButton?.setAttribute(
            "aria-expanded",
            "false"
        );

    },

    toggleSidebar() {

        const sidebar =
            document.getElementById(
                "adminSidebar"
            );

        if (!sidebar) {
            return;
        }

        const isOpen =
            sidebar.classList.contains(
                "sidebar-open"
            );

        if (isOpen) {

            this.closeSidebar();

            return;

        }

        this.openSidebar();

    },

    showToast(
        message,
        type = "success",
        duration = 3200
    ) {

        let container =
            document.getElementById(
                "adminToastContainer"
            );

        if (!container) {

            container =
                document.createElement(
                    "div"
                );

            container.id =
                "adminToastContainer";

            container.className =
                "admin-toast-container";

            container.setAttribute(
                "aria-live",
                "polite"
            );

            container.setAttribute(
                "aria-atomic",
                "true"
            );

            document.body.appendChild(
                container
            );

        }

        const validTypes = [
            "success",
            "error",
            "warning",
            "info"
        ];

        const safeType =
            validTypes.includes(type)
                ? type
                : "info";

        const iconMap = {

            success:
                "fa-circle-check",

            error:
                "fa-circle-exclamation",

            warning:
                "fa-triangle-exclamation",

            info:
                "fa-circle-info"

        };

        const toast =
            document.createElement(
                "div"
            );

        toast.className =
            `admin-toast ${safeType}`;

        toast.innerHTML = `
            <i class="fas ${iconMap[safeType]}"></i>

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

        window.setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

                window.setTimeout(
                    () => {

                        toast.remove();

                    },
                    300
                );

            },
            Number(duration) > 0
                ? Number(duration)
                : 3200
        );

    },

        exportCSV(
        filename,
        headers,
        rows
    ) {

        if (
            !Array.isArray(headers) ||
            headers.length === 0
        ) {

            this.showToast(
                "CSV export requires at least one column heading.",
                "error"
            );

            return false;

        }

        if (!Array.isArray(rows)) {

            this.showToast(
                "CSV export data is invalid.",
                "error"
            );

            return false;

        }

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
                                    this.escapeCSVValue(
                                        value
                                    )
                            )
                            .join(",")
                )
                .join("\n");

        const safeFilename =
            this.ensureFileExtension(
                filename ||
                "kiddysexplorer-export",
                ".csv"
            );

        this.downloadFile(
            safeFilename,
            "\ufeff" + csv,
            "text/csv;charset=utf-8"
        );

        return true;

    },

    escapeCSVValue(value) {

        const text =
            String(
                value ?? ""
            );

        return `"${text.replace(
            /"/g,
            '""'
        )}"`;

    },

    downloadFile(
        filename,
        content,
        mimeType =
            "application/octet-stream"
    ) {

        try {

            const blob =
                content instanceof Blob
                    ? content
                    : new Blob(
                        [content],
                        {
                            type:
                                mimeType
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
                filename ||
                "download";

            downloadLink.style.display =
                "none";

            document.body.appendChild(
                downloadLink
            );

            downloadLink.click();

            downloadLink.remove();

            window.setTimeout(
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                },
                100
            );

            return true;

        } catch (error) {

            console.error(
                "File download failed:",
                error
            );

            this.showToast(
                "The file could not be downloaded.",
                "error"
            );

            return false;

        }

    },

    printPage() {

        window.print();

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

    },

    normalizeSearch(value) {

        return String(
            value ?? ""
        )
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    },

    includesSearch(
        searchValue,
        ...fields
    ) {

        const normalizedSearch =
            this.normalizeSearch(
                searchValue
            );

        if (!normalizedSearch) {

            return true;

        }

        return fields.some(
            field =>
                this.normalizeSearch(
                    field
                ).includes(
                    normalizedSearch
                )
        );

    },

    setText(id, value) {

        const element =
            document.getElementById(
                id
            );

        if (!element) {

            return false;

        }

        element.textContent =
            value ?? "";

        return true;

    },

    setHTML(id, html) {

        const element =
            document.getElementById(
                id
            );

        if (!element) {

            return false;

        }

        element.innerHTML =
            html ?? "";

        return true;

    },

    setCurrentYear(
        elementId =
            "adminCurrentYear"
    ) {

        this.setText(
            elementId,
            new Date().getFullYear()
        );

    },

    toggleElement(
        elementOrId,
        shouldShow
    ) {

        const element =
            typeof elementOrId ===
            "string"
                ? document.getElementById(
                    elementOrId
                )
                : elementOrId;

        if (!element) {

            return false;

        }

        element.hidden =
            !shouldShow;

        return true;

    },

    toggleEmptyState(
        emptyStateId,
        itemCount
    ) {

        const emptyState =
            document.getElementById(
                emptyStateId
            );

        if (!emptyState) {

            return false;

        }

        emptyState.hidden =
            Number(itemCount) > 0;

        return true;

    },

    clearElement(elementOrId) {

        const element =
            typeof elementOrId ===
            "string"
                ? document.getElementById(
                    elementOrId
                )
                : elementOrId;

        if (!element) {

            return false;

        }

        element.innerHTML = "";

        return true;

    },

        formatDate(
        value,
        options = {}
    ) {

        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {

            return "—";

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

            return "—";

        }

        const defaultOptions = {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"

        };

        return new Intl.DateTimeFormat(
            "en-GB",
            {
                ...defaultOptions,
                ...options
            }
        ).format(
            date
        );

    },

    formatDateTime(
        value,
        options = {}
    ) {

        const defaultOptions = {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"

        };

        return this.formatDate(
            value,
            {
                ...defaultOptions,
                ...options
            }
        );

    },

    formatNumber(
        value,
        options = {}
    ) {

        const number =
            Number(value);

        if (
            !Number.isFinite(number)
        ) {

            return "0";

        }

        return new Intl.NumberFormat(
            "en-GB",
            options
        ).format(
            number
        );

    },

    formatCurrency(
        value,
        currency = "EUR",
        options = {}
    ) {

        const number =
            Number(value);

        if (
            !Number.isFinite(number)
        ) {

            return "—";

        }

        return new Intl.NumberFormat(
            "de-DE",
            {
                style:
                    "currency",

                currency,

                ...options
            }
        ).format(
            number
        );

    },

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

    ordinal(value) {

        const number =
            Number(value);

        if (
            !Number.isFinite(number)
        ) {

            return "—";

        }

        const remainder100 =
            number % 100;

        if (
            remainder100 >= 11 &&
            remainder100 <= 13
        ) {

            return `${number}th`;

        }

        switch (
            number % 10
        ) {

            case 1:

                return `${number}st`;

            case 2:

                return `${number}nd`;

            case 3:

                return `${number}rd`;

            default:

                return `${number}th`;

        }

    },

    ensureFileExtension(
        filename,
        extension
    ) {

        const safeFilename =
            String(
                filename ||
                "download"
            );

        const safeExtension =
            String(
                extension || ""
            ).startsWith(".")
                ? String(extension)
                : `.${extension}`;

        return safeFilename
            .toLowerCase()
            .endsWith(
                safeExtension.toLowerCase()
            )
                ? safeFilename
                : `${safeFilename}${safeExtension}`;

    },

    createDateFilename(
        prefix,
        extension = ""
    ) {

        const date =
            new Date()
                .toISOString()
                .slice(
                    0,
                    10
                );

        const baseName =
            `${prefix}-${date}`;

        if (!extension) {

            return baseName;

        }

        return this.ensureFileExtension(
            baseName,
            extension
        );

    },

    getValue(
        elementId,
        fallback = ""
    ) {

        return (
            document.getElementById(
                elementId
            )?.value ??
            fallback
        );

    },

    setValue(
        elementId,
        value
    ) {

        const element =
            document.getElementById(
                elementId
            );

        if (!element) {

            return false;

        }

        element.value =
            value ?? "";

        return true;

    },

    parseNumber(
        value,
        fallback = 0
    ) {

        const number =
            Number(value);

        return Number.isFinite(number)
            ? number
            : fallback;

    },

    debounce(
        callback,
        delay = 250
    ) {

        let timeoutId;

        return function (...args) {

            window.clearTimeout(
                timeoutId
            );

            timeoutId =
                window.setTimeout(
                    () => {

                        callback.apply(
                            this,
                            args
                        );

                    },
                    delay
                );

        };

    },

        confirmAction(
        message,
        options = {}
    ) {

        const finalMessage =
            options.title
                ? `${options.title}\n\n${message}`
                : message;

        return window.confirm(
            finalMessage
        );

    },

    safeJSONParse(
        value,
        fallback = null
    ) {

        try {

            return JSON.parse(
                value
            );

        } catch (error) {

            return fallback;

        }

    },

    copyText(
        text,
        successMessage =
            "Copied to clipboard."
    ) {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            return navigator.clipboard
                .writeText(
                    String(
                        text ?? ""
                    )
                )
                .then(
                    () => {

                        this.showToast(
                            successMessage,
                            "success"
                        );

                        return true;

                    }
                )
                .catch(
                    error => {

                        console.error(
                            "Clipboard copy failed:",
                            error
                        );

                        this.showToast(
                            "The text could not be copied.",
                            "error"
                        );

                        return false;

                    }
                );

        }

        const textArea =
            document.createElement(
                "textarea"
            );

        textArea.value =
            String(
                text ?? ""
            );

        textArea.style.position =
            "fixed";

        textArea.style.opacity =
            "0";

        document.body.appendChild(
            textArea
        );

        textArea.select();

        let copied =
            false;

        try {

            copied =
                document.execCommand(
                    "copy"
                );

        } catch (error) {

            copied =
                false;

        }

        textArea.remove();

        this.showToast(
            copied
                ? successMessage
                : "The text could not be copied.",
            copied
                ? "success"
                : "error"
        );

        return Promise.resolve(
            copied
        );

    }

};

document.addEventListener(
    "DOMContentLoaded",
    () => {

        AdminCommon.init();

    }
);

