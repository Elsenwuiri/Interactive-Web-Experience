import React, { useEffect, useRef, useState } from "react";
import "./SecretGate.css";
import {
    FIRST_RIDDLE_PARTS,
    RIDDLE_STORAGE_KEYS,
    SECOND_RIDDLE_PARTS,
    SECRET_GATE_CONFIG,
    TARGET_DATE,
    formatGateDate,
    readFlag,
    writeFlag,
    readGateStep,
    writeGateStep,
} from "./secretGateConfig";

// Owner bypass. Checked separately from the riddles so it never affects riddle state.
const MASTERKEY = import.meta.env.VITE_MASTERKEY;
const MASTER_PARTS = MASTERKEY != null
    ? String(MASTERKEY).match(/.{1,2}/g) || []
    : [];

// Riddle 2's hint block mirrors Riddle 1 exactly: one reveal button in the
// header, then hint cards appear in sequence (not one button per card).
const SECOND_RIDDLE_HINTS = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consequat enim gravida sagittis venenatis. Nullam eu facilisis tortor, at tempus enim. Pellentesque tempor risus ut quam facilisis fringilla vitae ut ligula.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consequat enim gravida sagittis venenatis. Nullam eu facilisis tortor, at tempus enim. Pellentesque tempor risus ut quam facilisis fringilla vitae ut ligula.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consequat enim gravida sagittis venenatis. Nullam eu facilisis tortor, at tempus enim. Pellentesque tempor risus ut quam facilisis fringilla vitae ut ligula.",
];
const RIDDLE_TWO_HINT_LABELS = ["HINT 01", "HINT 02", "HINT 03"];

const RIDDLE_ONE_CLUES = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consequat enim gravida sagittis venenatis. Nullam eu facilisis tortor, at tempus enim. Pellentesque tempor risus ut quam facilisis fringilla vitae ut ligula.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consequat enim gravida sagittis venenatis. Nullam eu facilisis tortor, at tempus enim. Pellentesque tempor risus ut quam facilisis fringilla vitae ut ligula.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consequat enim gravida sagittis venenatis. Nullam eu facilisis tortor, at tempus enim. Pellentesque tempor risus ut quam facilisis fringilla vitae ut ligula.",
];

const CLUE_LABELS = ["CLUE I", "CLUE II", "CLUE III"];

const ERROR_MESSAGES = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
];

const WAIT_TEXTS = [
    "wait text 1",
    "wait text 2",
    "wait text 3",
    // tambahkan sesuka hatimu
];

const NOTICE_TEXT = "eh... ada yang berubah.";
const RECOVERY_HINT =
    "Sebelum mencari jawaban yang baru,\ncoba ingat kembali jawaban yang pertama.";
const RECOVERY_SUCCESS_TEXT = "Nah... akhirnya ketemu juga. Semangat riddle ke-2nya";
const RIDDLE_TWO_LOCKED_TEXT = "Sepertinya ada sesuatu yang belum kamu selesaikan.";

const NOTICE_DURATION = 2400;
const RECOVERY_SUCCESS_DURATION = 1900;
const RIDDLE_ONE_SUCCESS_DURATION = 900;
// WAIT TEXT stays on screen before the click-through starts. Same timing as the
// original sequence (waiting at 4400ms, click-through at 8900ms).
const WAIT_TEXT_DURATION = 4500;

// Riddle 1 owns the screen until the time lock opens the second layer.
const RIDDLE_ONE_PHASES = ["riddle1", "riddle1Solved", "locked"];

function getTimeRemaining() {
    const difference = TARGET_DATE - Date.now();

    if (difference <= 0) {
        return {
            expired: true,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
    }

    return {
        expired: false,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
}

function isTargetDateReached() {
    return Date.now() >= TARGET_DATE;
}

// Riddle 1 is history once the second layer is active, so riddle 2 is the only
// active riddle: unlocked when riddle 1 was solved, locked when it was skipped.
function resolveRiddleTwoPhase(riddleOneIsSolved) {
    if (!readFlag(RIDDLE_STORAGE_KEYS.notice)) return "notice";

    return riddleOneIsSolved || readFlag(RIDDLE_STORAGE_KEYS.riddleOne)
        ? "riddle2"
        : "riddle2Locked";
}

function resolvePostRiddleOnePhase() {
    if (!isTargetDateReached()) return "locked";

    return resolveRiddleTwoPhase(true);
}

// The persisted gate step ("waiting" | "clicks:<index>") is read before the very
// first render, so a refresh resumes on WAIT TEXT instead of replaying VERIFYING.
function getInitialPhase(gateStep = "") {
    if (gateStep === "waiting") return "waiting";
    if (gateStep.startsWith("clicks:")) return "clicks";

    if (!isTargetDateReached()) {
        return readFlag(RIDDLE_STORAGE_KEYS.riddleOne) ? "locked" : "riddle1";
    }

    return resolveRiddleTwoPhase(readFlag(RIDDLE_STORAGE_KEYS.riddleOne));
}

function getInitialClickStage(gateStep = "") {
    if (!gateStep.startsWith("clicks:")) return 0;

    const stage = Number(gateStep.slice("clicks:".length));

    if (!Number.isInteger(stage) || stage < 0) return 0;

    return Math.min(stage, WAIT_TEXTS.length - 1);
}

// Shared 2-digit entry used by riddle 1, riddle 2 and the riddle-1 recovery.
// Passkeys never reach the UI: only what the visitor typed is ever rendered.
function usePasskeyEntry({
    passkeyParts,
    enabled,
    onTyping,
    onWrong,
    onSolved,
    onAlternateSolved,
}) {
    const [values, setValues] = useState(() => passkeyParts.map(() => ""));
    const [solvedFlags, setSolvedFlags] = useState(() =>
        passkeyParts.map(() => false)
    );
    const inputRefs = useRef([]);

    const solvedAll = solvedFlags.every(Boolean);

    const handleChange = (index, rawValue) => {
        if (!enabled || solvedFlags[index] || solvedAll) return;

        onTyping();

        const digits = rawValue.replace(/\D/g, "").slice(0, 2);

        if (digits.length < 2) {
            setValues((prev) => {
                const next = [...prev];
                next[index] = digits;
                return next;
            });
            return;
        }

        const matchesPasskey = digits === passkeyParts[index];

        const priorMatchesAlternate = values
            .slice(0, index)
            .every((part, partIndex) => part === MASTER_PARTS[partIndex]);

        const matchesAlternate =
            priorMatchesAlternate && digits === MASTER_PARTS[index];

        if (!matchesPasskey && !matchesAlternate) {
            setValues((prev) => {
                const next = [...prev];
                next[index] = "";
                return next;
            });

            onWrong();
            return;
        }

        const nextValues = [...values];
        nextValues[index] = digits;
        setValues(nextValues);

        const nextInput = inputRefs.current[index + 1];
        if (nextInput) nextInput.focus();

        if (!matchesPasskey) {
            if (nextValues.join("") === MASTERKEY) onAlternateSolved();
            return;
        }

        const nextSolved = [...solvedFlags];
        nextSolved[index] = true;
        setSolvedFlags(nextSolved);

        if (nextSolved.every(Boolean)) onSolved();
    };

    return { values, solvedFlags, solvedAll, inputRefs, handleChange };
}

function SecretGate({ onUnlock }) {
    const [riddle1Solved, setRiddle1Solved] = useState(() =>
        readFlag(RIDDLE_STORAGE_KEYS.riddleOne)
    );
    const [riddle2Solved, setRiddle2Solved] = useState(() =>
        readFlag(RIDDLE_STORAGE_KEYS.riddleTwo)
    );
    const [dateReached, setDateReached] = useState(isTargetDateReached);
    const [cluesRevealed, setCluesRevealed] = useState(0);
    // Riddle 2 memakai pola hint yang sama dengan Riddle 1: satu tombol reveal di
    // header, lalu kartu hint muncul berurutan (bukan tombol per-kartu).
    const [riddle2HintsRevealed, setRiddle2HintsRevealed] = useState(0);
    const [error, setError] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [riddle2Attempts, setRiddle2Attempts] = useState(0);
    const [time, setTime] = useState(getTimeRemaining);
    // Lazy read of the persisted gate step: the saved WAIT state is applied before
    // the first render, never from an effect afterwards.
    const [gateStep] = useState(readGateStep);
    const [phase, setPhase] = useState(() => getInitialPhase(gateStep));
    const [checkedCount, setCheckedCount] = useState(0);
    const [clickStage, setClickStage] = useState(() =>
        getInitialClickStage(gateStep)
    );
    const [clickSwitching, setClickSwitching] = useState(false);
    const [masterAccess, setMasterAccess] = useState(false);

    const timers = useRef([]);
    const sequenceStarted = useRef(false);
    const lastClickAt = useRef(0);

    // Both riddle layers and the time lock have to be satisfied.
    const canAccessWebsite = riddle1Solved && riddle2Solved && dateReached;
    const canProceed = canAccessWebsite || masterAccess;

    const handleWrong = () => {
        setError(ERROR_MESSAGES[attempts % ERROR_MESSAGES.length]);
        setAttempts((prev) => prev + 1);
    };

    const handleTyping = () => {
        if (error) setError("");
    };

    const handleRiddle2Wrong = () => {
        setError(
            ERROR_MESSAGES[riddle2Attempts % ERROR_MESSAGES.length]
        );
        setRiddle2Attempts((prev) => prev + 1);
    };

    const handleAlternateSolved = () => {
        setMasterAccess(true);
    };

    const handleRiddleOneSolved = () => {
        setError("");
        writeFlag(RIDDLE_STORAGE_KEYS.riddleOne);
        setRiddle1Solved(true);

        if (isTargetDateReached()) {
            setDateReached(true);
            return;
        }

        setPhase("riddle1Solved");

        const id = setTimeout(() => {
            setPhase((prev) =>
                prev === "riddle1Solved" ? resolvePostRiddleOnePhase() : prev
            );
        }, RIDDLE_ONE_SUCCESS_DURATION);

        timers.current.push(id);
    };

    const handleRiddleTwoSolved = () => {
        setError("");
        writeFlag(RIDDLE_STORAGE_KEYS.riddleTwo);
        setRiddle2Solved(true);
    };

    const handleRecoverySolved = () => {
        setError("");
        writeFlag(RIDDLE_STORAGE_KEYS.riddleOne);

        // Let the ✓ on the recovered code stay visible for a moment first.
        const solvedTimer = setTimeout(() => {
            setPhase((prev) => (prev === "recover" ? "recovered" : prev));

            const messageTimer = setTimeout(() => {
                setRiddle1Solved(true);
                setPhase((prev) => (prev === "recovered" ? "riddle2" : prev));
            }, RECOVERY_SUCCESS_DURATION);

            timers.current.push(messageTimer);
        }, RIDDLE_ONE_SUCCESS_DURATION);

        timers.current.push(solvedTimer);
    };

    const handleStartRecovery = () => {
        setError("");
        setPhase("recover");
    };

    const riddleOneEntry = usePasskeyEntry({
        passkeyParts: FIRST_RIDDLE_PARTS,
        enabled: phase === "riddle1",
        onTyping: handleTyping,
        onWrong: handleWrong,
        onSolved: handleRiddleOneSolved,
        onAlternateSolved: handleAlternateSolved,
    });

    const riddleTwoEntry = usePasskeyEntry({
        passkeyParts: SECOND_RIDDLE_PARTS,
        enabled: phase === "riddle2",
        onTyping: handleTyping,
        onWrong: handleRiddle2Wrong,
        onSolved: handleRiddleTwoSolved,
        onAlternateSolved: handleAlternateSolved,
    });

    const recoveryEntry = usePasskeyEntry({
        passkeyParts: FIRST_RIDDLE_PARTS,
        enabled: phase === "recover",
        onTyping: handleTyping,
        onWrong: handleWrong,
        onSolved: handleRecoverySolved,
        onAlternateSolved: handleAlternateSolved,
    });

    const canRevealClue =
        cluesRevealed < RIDDLE_ONE_CLUES.length &&
        (cluesRevealed === 0 || riddleOneEntry.solvedFlags[cluesRevealed - 1]);

    const revealClue = () => {
        if (!canRevealClue) return;
        setCluesRevealed((prev) => prev + 1);
    };

    // Riddle 2: reveal berurutan lewat tombol header — persis perilaku Riddle 1
    // (canRevealClue/revealClue); hanya isi & label yang berbeda.
    const canRevealRiddle2Hint =
        riddle2HintsRevealed < SECOND_RIDDLE_HINTS.length &&
        (riddle2HintsRevealed === 0 ||
            riddleTwoEntry.solvedFlags[riddle2HintsRevealed - 1]);

    const revealRiddle2Hint = () => {
        if (!canRevealRiddle2Hint) return;
        setRiddle2HintsRevealed((prev) => prev + 1);
    };

    const handleStageClick = () => {
        if (phase !== "clicks") return;

        const now = Date.now();

        if (now - lastClickAt.current < 500) {
            return;
        }

        lastClickAt.current = now;

        if (clickStage >= WAIT_TEXTS.length - 1) {
            setPhase("leaving");
            // The sequence finished: the next visit starts the existing flow again.
            writeGateStep("");

            const leaveTimer = setTimeout(() => {
                onUnlock();
            }, 700);

            timers.current.push(leaveTimer);
            return;
        }

        setClickSwitching(true);

        const swapTimer = setTimeout(() => {
            setClickStage((prev) => prev + 1);
            // Keep the click-through progress so a refresh continues there.
            writeGateStep(`clicks:${clickStage + 1}`);

            const revealTimer = setTimeout(() => {
                setClickSwitching(false);
            }, 40);

            timers.current.push(revealTimer);
        }, 300);

        timers.current.push(swapTimer);
    };

    // Countdown + time lock, cleaned up on unmount.
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(getTimeRemaining());
            setDateReached(isTargetDateReached());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        return () => {
            timers.current.forEach((id) => clearTimeout(id));
            timers.current = [];
        };
    }, []);

    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Something is waiting";

        return () => {
            document.title = previousTitle;
        };
    }, []);

    // Midnight transition: riddle 1 disappears and riddle 2 takes over, without a
    // reload and without breaking whatever the visitor is looking at.
    useEffect(() => {
        if (!dateReached || !RIDDLE_ONE_PHASES.includes(phase)) return;

        setPhase(resolveRiddleTwoPhase(riddle1Solved));
    }, [dateReached, phase, riddle1Solved]);

    // The first time riddle 2 becomes active, a short unexplained notice runs.
    useEffect(() => {
        if (phase !== "notice") return undefined;

        writeFlag(RIDDLE_STORAGE_KEYS.notice);

        const id = setTimeout(() => {
            setPhase((prev) =>
                prev === "notice" ? resolveRiddleTwoPhase(riddle1Solved) : prev
            );
        }, NOTICE_DURATION);

        timers.current.push(id);

        return () => clearTimeout(id);
    }, [phase, riddle1Solved]);

    // Existing "Access Granted" sequence.
    useEffect(() => {
        if (!canProceed || sequenceStarted.current) return;

        sequenceStarted.current = true;

        // The sequence already reached WAIT TEXT before this refresh: resume there
        // and never run the verification a second time.
        if (phase === "waiting" || phase === "clicks") return;

        const schedule = (callback, delay) => {
            const id = setTimeout(callback, delay);
            timers.current.push(id);
        };

        setPhase("verifying");
        schedule(() => setCheckedCount(1), 800);
        schedule(() => setCheckedCount(2), 1400);
        schedule(() => setCheckedCount(3), 2000);
        schedule(() => setPhase("granted"), 2700);
        schedule(() => setPhase("blackout"), 3800);
        schedule(() => {
            setPhase("waiting");
            writeGateStep("waiting");
        }, 4400);
    }, [canProceed, phase]);

    // WAIT TEXT pauses before the click-through starts. Kept outside the sequence
    // effect so a WAIT step restored after a refresh still moves on as before.
    useEffect(() => {
        if (phase !== "waiting") return undefined;

        const id = setTimeout(() => {
            setPhase("clicks");
            writeGateStep("clicks:0");
        }, WAIT_TEXT_DURATION);

        timers.current.push(id);

        return () => clearTimeout(id);
    }, [phase]);

    const sequenceParts = masterAccess ? MASTER_PARTS : FIRST_RIDDLE_PARTS;

    const footer = (
        <div className="secret-footer">
            <span>PRIVATE</span>
            <span>•</span>
            <span>2026</span>
        </div>
    );

    const countdownBlock = (
        <div className="countdown">
            <p className="countdown-label">ACCESS WINDOW</p>

            <div className="countdown-grid">
                <div>
                    <strong>{String(time.days).padStart(2, "0")}</strong>
                    <span>DAYS</span>
                </div>

                <i>:</i>

                <div>
                    <strong>{String(time.hours).padStart(2, "0")}</strong>
                    <span>HOURS</span>
                </div>

                <i>:</i>

                <div>
                    <strong>{String(time.minutes).padStart(2, "0")}</strong>
                    <span>MINUTES</span>
                </div>

                <i>:</i>

                <div>
                    <strong>{String(time.seconds).padStart(2, "0")}</strong>
                    <span>SECONDS</span>
                </div>
            </div>

            {time.expired && <p className="access-open">ACCESS WINDOW OPEN</p>}
        </div>
    );

    // Only what the visitor typed is rendered. Passkeys stay in the configuration.
    const renderEntry = (entry, passkeyParts, labelPrefix) => (
        <div className="secret-parts">
            {passkeyParts.map((_, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span className="secret-separator">|</span>}

                    <div
                        className={`secret-part ${entry.solvedFlags[index] ? "is-solved" : ""
                            }`}
                    >
                        <input
                            ref={(element) => {
                                entry.inputRefs.current[index] = element;
                            }}
                            type="text"
                            inputMode="numeric"
                            value={entry.values[index]}
                            onChange={(event) =>
                                entry.handleChange(index, event.target.value)
                            }
                            placeholder="··"
                            maxLength={2}
                            disabled={
                                masterAccess ||
                                entry.solvedFlags[index] ||
                                entry.solvedAll
                            }
                            autoComplete="off"
                            aria-label={`${labelPrefix} ${index + 1}`}
                        />

                        <span className="secret-part-check">✓</span>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );

    const renderClues = (clues) => (
        <div className="clues">
            <div className="clue-list">
                {clues.map((clue, index) => (
                    <div className="clue-card" key={index}>
                        <span className="clue-card-label">
                            {CLUE_LABELS[index]}
                        </span>
                        <p className="clue-card-text">{clue}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderGateScreen = (content) => (
        <div className="secret-gate">
            <div className="secret-grid" />
            <div className="secret-glow secret-glow-one" />
            <div className="secret-glow secret-glow-two" />

            <div className="secret-content">{content}</div>
        </div>
    );

    if (phase === "blackout") {
        return <div className="secret-gate is-black" />;
    }

    if (phase === "waiting") {
        return (
            <div className="secret-gate is-black">
                <div className="gate-wait">
                    <p className="gate-wait-text">{WAIT_TEXTS[0]}</p>
                </div>
            </div>
        );
    }

    if (phase === "clicks" || phase === "leaving") {
        return (
            <div className="secret-gate is-black">
                <div
                    className={`gate-clicks ${clickSwitching || phase === "leaving"
                        ? "is-switching"
                        : ""
                        }`}
                >
                    <p className="gate-click-text">
                        {WAIT_TEXTS[clickStage]}
                    </p>

                    <button
                        type="button"
                        className="gate-click-button"
                        onClick={handleStageClick}
                        disabled={clickSwitching || phase === "leaving"}
                    >
                        lanjut
                    </button>
                </div>
            </div>
        );
    }

    // Riddle 1 recovered on the second layer.
    if (phase === "recovered") {
        return (
            <div className="secret-gate is-black">
                <div className="gate-wait">
                    <p className="gate-wait-text">{RECOVERY_SUCCESS_TEXT}</p>
                </div>
            </div>
        );
    }

    // Riddle 2 became the active riddle for the first time.
    if (phase === "notice") {
        return (
            <div className="secret-gate is-black">
                <div className="gate-wait">
                    <p className="gate-wait-text">{NOTICE_TEXT}</p>
                </div>
            </div>
        );
    }

    if (phase === "verifying" || phase === "granted" || canProceed) {
        return (
            <div
                className={`secret-gate ${phase === "granted" ? "is-granted" : ""
                    }`}
            >
                <div className="secret-grid" />

                <div className="gate-sequence">
                    <p className="gate-sequence-status">
                        {phase === "granted"
                            ? "ACCESS GRANTED"
                            : "VERIFYING..."}
                    </p>

                    <div className="gate-sequence-list">
                        {sequenceParts.map((value, index) => (
                            <div
                                key={index}
                                className={`gate-sequence-item ${checkedCount > index
                                    ? "is-checked"
                                    : ""
                                    }`}
                            >
                                <span className="gate-sequence-value">
                                    {"•".repeat(value.length)}
                                </span>
                                <span className="gate-sequence-check">✓</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Time lock layer: riddle 1 is solved, but 24.10.2026 has not arrived yet.
    if (phase === "locked") {
        return renderGateScreen(
            <React.Fragment>
                <p className="secret-label">
                    {SECRET_GATE_CONFIG.lockedMessage.title}
                </p>

                <h1>SOMETHING IS WAITING</h1>

                <p className="secret-description">
                    {SECRET_GATE_CONFIG.lockedMessage.message}
                </p>

                <p className="secret-note">
                    {SECRET_GATE_CONFIG.lockedMessage.subtitle}
                </p>

                <p className="secret-date">{formatGateDate()}</p>

                {countdownBlock}
                {footer}
            </React.Fragment>
        );
    }

    // Riddle 2 is active, but riddle 1 was never solved.
    if (phase === "riddle2Locked") {
        return renderGateScreen(
            <React.Fragment>
                <p className="secret-label">RIDDLE 02</p>

                <h1>SOMETHING IS WAITING</h1>

                <p className="secret-description">{RIDDLE_TWO_LOCKED_TEXT}</p>

                <p className="locked-badge">🔒 SECOND CLUE LOCKED</p>

                <p className="secret-note">{RECOVERY_HINT}</p>

                <button
                    type="button"
                    className="gate-click-button"
                    onClick={handleStartRecovery}
                >
                    I THINK I REMEMBER
                </button>

                {footer}
            </React.Fragment>
        );
    }

    // Recovering riddle 1. Its clues are shown again, never its passkey.
    if (phase === "recover") {
        return renderGateScreen(
            <React.Fragment>
                <p className="secret-label">RIDDLE 01</p>

                <h1>SOMETHING IS WAITING</h1>

                <p className="secret-description">{RECOVERY_HINT}</p>

                {renderEntry(recoveryEntry, FIRST_RIDDLE_PARTS, "Kode bagian")}

                <div className="secret-error">{error}</div>

                {renderClues(RIDDLE_ONE_CLUES)}
                {footer}
            </React.Fragment>
        );
    }

    // Riddle 2, unlocked because riddle 1 was solved.
    // Struktur DOM-nya SAMA PERSIS dengan Riddle 1 (lihat return terakhir):
    // symbol -> label -> h1 -> description -> parts -> error -> clues -> countdown -> footer.
    // Riddle 1 = baseline, Riddle 2 hanya beda label + content/passkey/hint.
    // Blok hint juga identik: header "HINTS x/3" + tombol REVEAL HINT di header,
    // kartu hint reveal berurutan (bukan tombol per-kartu).
    // renderEntry dipakai ulang => 3 input group 2 digit (13|23|05) dengan class
    // .secret-parts/.secret-part yang sama, jadi ukurannya otomatis identik.
    // Validasi tetap satu passkey: values.join("") === "132305".
    if (phase === "riddle2") {
        return renderGateScreen(
            <React.Fragment>
                <div className="secret-symbol">
                    <span />
                </div>

                <p className="secret-label">RIDDLE 02</p>

                <h1>EITSSSS, RIDDLE LAGI KITAAAAA</h1>

                <p className="secret-description">
                    biar lebih misterius aja sihhhh, wkwkwkk.
                </p>

                <p className="secret-description">
                    semangat sayang, loppp u sekebonn dahh, wkwkwwkk
                </p>


                {renderEntry(riddleTwoEntry, SECOND_RIDDLE_PARTS, "Kode bagian")}

                <div className="secret-error">{error}</div>

                <div className="clues">
                    <div className="clues-head">
                        <span className="clues-count">
                            HINTS {riddle2HintsRevealed}/
                            {SECOND_RIDDLE_HINTS.length}
                        </span>

                        {canRevealRiddle2Hint && (
                            <button
                                type="button"
                                className="clue-reveal-button"
                                onClick={revealRiddle2Hint}
                            >
                                REVEAL{" "}
                                {RIDDLE_TWO_HINT_LABELS[riddle2HintsRevealed]}
                            </button>
                        )}
                    </div>

                    {riddle2HintsRevealed > 0 && (
                        <div className="clue-list">
                            {SECOND_RIDDLE_HINTS.slice(
                                0,
                                riddle2HintsRevealed
                            ).map((hint, index) => (
                                <div className="clue-card" key={index}>
                                    <span className="clue-card-label">
                                        {RIDDLE_TWO_HINT_LABELS[index]}
                                    </span>
                                    <p className="clue-card-text">{hint}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {countdownBlock}
                {footer}
            </React.Fragment>
        );
    }

    // Riddle 1 is the active riddle before the target date.
    return renderGateScreen(
        <React.Fragment>
            <div className="secret-symbol">
                <span />
            </div>

            <p className="secret-label">RIDDLE 01</p>

            <h1>SOMETHING IS WAITING</h1>

            <p className="secret-description">
                Some things are better discovered slowly.
            </p>

            {renderEntry(riddleOneEntry, FIRST_RIDDLE_PARTS, "Kode bagian")}

            <div className="secret-error">{error}</div>

            <div className="clues">
                <div className="clues-head">
                    <span className="clues-count">
                        CLUES {cluesRevealed}/{RIDDLE_ONE_CLUES.length}
                    </span>

                    {canRevealClue && (
                        <button
                            type="button"
                            className="clue-reveal-button"
                            onClick={revealClue}
                        >
                            REVEAL {CLUE_LABELS[cluesRevealed]}
                        </button>
                    )}
                </div>

                {cluesRevealed > 0 && (
                    <div className="clue-list">
                        {RIDDLE_ONE_CLUES.slice(0, cluesRevealed).map(
                            (clue, index) => (
                                <div className="clue-card" key={index}>
                                    <span className="clue-card-label">
                                        {CLUE_LABELS[index]}
                                    </span>
                                    <p className="clue-card-text">{clue}</p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {countdownBlock}
            {footer}
        </React.Fragment>
    );
}

export default SecretGate;
