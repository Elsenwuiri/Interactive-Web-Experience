export const ENABLE_SECRET_GATE = false;

export const SECRET_GATE_CONFIG = {
    firstPasskey: import.meta.env.VITE_FIRST_PASSKEY,
    secondPasskey: import.meta.env.VITE_SECOND_PASSKEY,
    targetDate: "YYYY-MM-DDT00:00:00", //ganti ke tanggal yang di inginkan
    lockedMessage: {
        title: "ACCESS LOCKED",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
};

export const RIDDLE_STORAGE_KEYS = {
    riddleOne: "riddle1Solved",
    riddleTwo: "riddle2Solved",
    notice: "riddleNoticeSeen",
};

export const splitPasskey = (passkey) => {
    if (passkey === null || passkey === undefined) return [];
    return String(passkey).match(/.{1,2}/g) || [];
};

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
    }
};

export const GATE_STEP_STORAGE_KEY = "gateStep";
export const GATE_STEP_DURATION = 10 * 60 * 1000;

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
    }
};
