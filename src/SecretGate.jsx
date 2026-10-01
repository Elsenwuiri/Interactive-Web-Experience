import React, { useEffect, useRef, useState } from "react";
import "./SecretGate.css";

const SECRET_PARTS = import.meta.env.VITE_SECRET_PARTS.split(",").map((value) => value.trim());
const TARGET_DATE = new Date("2026-10-24T00:00:00+07:00").getTime();

const CLUES = [
    "Dua angka pertama adalah sesuatu yang hampir selalu hadir ketika seseorang membagikan cerita singkatnya.",
    "Dua angka berikutnya menggambarkan sejauh mana perjalanan seseorang telah berjalan.",
    "Dua angka terakhir mungkin tidak berarti banyak bagi orang lain.\n\nTapi mungkin berbeda bagi kita.",
];

const CLUE_LABELS = ["CLUE I", "CLUE II", "CLUE III"];

const ERROR_MESSAGES = [
    "aduhhhh masih salahhh nihhh",
    "bukannn",
    "dikittt lagiii.",
    "terlalu di-ini-in.",
    "Semangatt sayangg, wkwkwkwkwk",
    "ayo ditebak lagiiiii"
];

const WAIT_TEXTS = [
    "nungguin yaaaaa",
    "bentar...",
    "dikit lagi...",
    "yang benerrrrr nihhhhh",
    "serius udah mau masuk?",
    "satu lagi dehhh",
    "janjii 1 lagii",
    "ehh satu lagii dehhh",
    "benerrr ini terakhirr",
    "wkwkwkwkwk",
    "seberapa seriuss mau buka webnya?",
    "yakin?",
    "benerrr?",
    "gila seserius itu, wkwkwwk",
    "yaudahh dehh terakhirr",
    "wkwkwkw serius habis ini",
];

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

function SecretGate({ onUnlock }) {
    const [parts, setParts] = useState(["", "", ""]);
    const [solved, setSolved] = useState([false, false, false]);
    const [cluesRevealed, setCluesRevealed] = useState(0);
    const [error, setError] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [time, setTime] = useState(getTimeRemaining());
    const [phase, setPhase] = useState("input");
    const [checkedCount, setCheckedCount] = useState(0);
    const [clickStage, setClickStage] = useState(0);
    const [clickSwitching, setClickSwitching] = useState(false);

    const inputRefs = useRef([]);
    const timers = useRef([]);
    const sequenceStarted = useRef(false);
    const lastClickAt = useRef(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(getTimeRemaining());
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

    const solvedAll = solved.every(Boolean);

    const canRevealClue =
        cluesRevealed < SECRET_PARTS.length &&
        (cluesRevealed === 0 || solved[cluesRevealed - 1]);

    useEffect(() => {
        if (!solvedAll || phase !== "input" || sequenceStarted.current) {
            return;
        }

        sequenceStarted.current = true;

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
        schedule(() => setPhase("waiting"), 4400);
        schedule(() => setPhase("clicks"), 8900);
    }, [solvedAll, phase, onUnlock]);

    const handlePartChange = (index, value) => {
        const messageIndex = attempts % ERROR_MESSAGES.length;
        if (solved[index] || solvedAll) return;

        const digits = value.replace(/\D/g, "").slice(0, 2);

        if (error) setError("");

        if (digits.length < 2) {
            setParts((prev) => {
                const next = [...prev];
                next[index] = digits;
                return next;
            });
            return;
        }

        if (digits === SECRET_PARTS[index]) {
            setParts((prev) => {
                const next = [...prev];
                next[index] = digits;
                return next;
            });

            setSolved((prev) => {
                const next = [...prev];
                next[index] = true;
                return next;
            });

            const nextInput = inputRefs.current[index + 1];
            if (nextInput) nextInput.focus();
            return;
        }

        setParts((prev) => {
            const next = [...prev];
            next[index] = "";
            return next;
        });

        setError(ERROR_MESSAGES[messageIndex]);
        setAttempts((prev) => prev + 1);
    };

    const revealClue = () => {
        if (!canRevealClue) return;
        setCluesRevealed((prev) => prev + 1);
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

            const leaveTimer = setTimeout(() => {
                onUnlock();
            }, 700);

            timers.current.push(leaveTimer);
            return;
        }

        setClickSwitching(true);

        const swapTimer = setTimeout(() => {
            setClickStage((prev) => prev + 1);

            const revealTimer = setTimeout(() => {
                setClickSwitching(false);
            }, 40);

            timers.current.push(revealTimer);
        }, 300);

        timers.current.push(swapTimer);
    };

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

    if (phase === "verifying" || phase === "granted") {
        return (
            <div
                className={`secret-gate ${phase === "granted" ? "is-granted" : ""
                    }`}
            >
                <div className="secret-grid" />

                <div className="gate-sequence">
                    <p className="gate-sequence-status">
                        {phase === "verifying"
                            ? "VERIFYING..."
                            : "ACCESS GRANTED"}
                    </p>

                    <div className="gate-sequence-list">
                        {SECRET_PARTS.map((value, index) => (
                            <div
                                key={value}
                                className={`gate-sequence-item ${checkedCount > index ? "is-checked" : ""
                                    }`}
                            >
                                <span className="gate-sequence-value">
                                    {value}
                                </span>
                                <span className="gate-sequence-check">✓</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="secret-gate">
            <div className="secret-grid" />
            <div className="secret-glow secret-glow-one" />
            <div className="secret-glow secret-glow-two" />

            <div className="secret-content">
                <div className="secret-symbol">
                    <span />
                </div>

                <p className="secret-label">RESTRICTED ACCESS</p>

                <h1>SOMETHING IS WAITING</h1>

                <p className="secret-description">
                    Some things are better discovered slowly.
                </p>

                <div className="secret-parts">
                    {SECRET_PARTS.map((_, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <span className="secret-separator">|</span>
                            )}

                            <div
                                className={`secret-part ${solved[index] ? "is-solved" : ""
                                    }`}
                            >
                                <input
                                    ref={(element) => {
                                        inputRefs.current[index] = element;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    value={parts[index]}
                                    onChange={(event) =>
                                        handlePartChange(
                                            index,
                                            event.target.value
                                        )
                                    }
                                    placeholder="··"
                                    maxLength={2}
                                    disabled={solved[index] || solvedAll}
                                    autoComplete="off"
                                    aria-label={`Kode bagian ${index + 1}`}
                                />

                                <span className="secret-part-check">✓</span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                <div className="secret-error">{error}</div>

                <div className="clues">
                    <div className="clues-head">
                        <span className="clues-count">
                            CLUES {cluesRevealed}/3
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
                            {CLUES.slice(0, cluesRevealed).map(
                                (clue, index) => (
                                    <div className="clue-card" key={index}>
                                        <span className="clue-card-label">
                                            {CLUE_LABELS[index]}
                                        </span>
                                        <p className="clue-card-text">
                                            {clue}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                <div className="countdown">
                    <p className="countdown-label">ACCESS WINDOW</p>

                    <div className="countdown-grid">
                        <div>
                            <strong>
                                {String(time.days).padStart(2, "0")}
                            </strong>
                            <span>DAYS</span>
                        </div>

                        <i>:</i>

                        <div>
                            <strong>
                                {String(time.hours).padStart(2, "0")}
                            </strong>
                            <span>HOURS</span>
                        </div>

                        <i>:</i>

                        <div>
                            <strong>
                                {String(time.minutes).padStart(2, "0")}
                            </strong>
                            <span>MINUTES</span>
                        </div>

                        <i>:</i>

                        <div>
                            <strong>
                                {String(time.seconds).padStart(2, "0")}
                            </strong>
                            <span>SECONDS</span>
                        </div>
                    </div>

                    {time.expired && (
                        <p className="access-open">ACCESS WINDOW OPEN</p>
                    )}
                </div>

                <div className="secret-footer">
                    <span>PRIVATE</span>
                    <span>•</span>
                    <span>2026</span>
                </div>
            </div>
        </div>
    );
}

export default SecretGate;


