export const SECRET_GATE_CONFIG = {
    firstPasskey: import.meta.env.VITE_FIRST_PASSKEY,
    secondPasskey: import.meta.env.VITE_SECOND_PASSKEY,
    targetDate: "2025-10-24T00:00:00",
    lockedMessage: {
        title: "ACCESS LOCKED",
        message: "EITSSSSS udahh selesai sihhh riddlenya tapi belom waktunyaa, wkwkwkwk",
        subtitle: "Sabar sedikit lagi..., tunggu tanggalnya baru bukaa lagiii, hehehe",
    },
};

export const RIDDLE_STORAGE_KEYS = {
    riddleOne: "riddle1Solved",
    riddleTwo: "riddle2Solved",
    notice: "riddleNoticeSeen",
};

export const splitPasskey = (passkey) => String(passkey).match(/.{1,2}/g) || [];

export const FIRST_RIDDLE_PARTS = splitPasskey(SECRET_GATE_CONFIG.firstPasskey);
export const SECOND_RIDDLE_PARTS = splitPasskey(SECRET_GATE_CONFIG.secondPasskey);

export const TARGET_DATE = new Date(SECRET_GATE_CONFIG.targetDate).getTime();

export const formatGateDate = () => {
    const date = new Date(TARGET_DATE);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${day}.${month}.${date.getFullYear()}`;
};

export const readFlag = (key) => {
    try {
        return window.localStorage.getItem(key) === "true";
    } catch {
        return false;
    }
};

export const writeFlag = (key, value = true) => {
    try {
        window.localStorage.setItem(key, value ? "true" : "false");
    } catch {
        // Storage can be unavailable (private mode); the gate still works in-session.
    }
};

// The gate step of the access sequence ("WAIT TEXT" and its click-through
// progress) is persisted so a browser refresh resumes there instead of
// replaying VERIFYING from the start.
// It reuses the same temporary window as the access session in App.jsx
// (AUTH_DURATION = 10 minutes), so remembering the step never outlives the
// existing expiration.
export const GATE_STEP_STORAGE_KEY = "gateStep";
export const GATE_STEP_DURATION = 10 * 60 * 1000;

// Stored value shape: "<step>|<timestamp>", where step is "waiting" or
// "clicks:<index>". Returns "" when nothing usable is saved.
export const readGateStep = () => {
    try {
        const stored = window.localStorage.getItem(GATE_STEP_STORAGE_KEY);

        if (!stored) return "";

        const separator = stored.lastIndexOf("|");
        const step = stored.slice(0, separator);
        const savedAt = Number(stored.slice(separator + 1));
        const isWaitStep =
            step === "waiting" ||
            (step.startsWith("clicks:") &&
                Number.isInteger(Number(step.slice("clicks:".length))));

        if (
            separator < 0 ||
            !isWaitStep ||
            !Number.isFinite(savedAt) ||
            Date.now() - savedAt >= GATE_STEP_DURATION
        ) {
            window.localStorage.removeItem(GATE_STEP_STORAGE_KEY);
            return "";
        }

        return step;
    } catch {
        return "";
    }
};

export const writeGateStep = (step) => {
    try {
        if (!step) {
            window.localStorage.removeItem(GATE_STEP_STORAGE_KEY);
            return;
        }

        window.localStorage.setItem(
            GATE_STEP_STORAGE_KEY,
            `${step}|${Date.now()}`
        );
    } catch {
        // Storage can be unavailable (private mode); the gate still works in-session.
    }
};
