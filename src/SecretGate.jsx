import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import "./SecretGate.css";

const ACCESS_CODE = "240426";
const TARGET_DATE = new Date("2026-10-24T00:00:00+07:00").getTime();

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
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [unlocked, setUnlocked] = useState(false);
    const [time, setTime] = useState(getTimeRemaining());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(getTimeRemaining());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!time.expired) return;

        const duration = 5000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            confetti({
                particleCount: 8,
                spread: 100,
                startVelocity: 25,
                origin: {
                    x: Math.random(),
                    y: Math.random() * 0.6,
                },
            });
        }, 150);

        return () => clearInterval(interval);
    }, [time.expired]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (password === ACCESS_CODE) {
            setError("");
            setUnlocked(true);

            const duration = 2200;
            const animationEnd = Date.now() + duration;

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    clearInterval(interval);
                    return;
                }

                confetti({
                    particleCount: 4,
                    startVelocity: 18,
                    spread: 70,
                    ticks: 120,
                    gravity: 0.8,
                    origin: {
                        x: Math.random(),
                        y: 0.45 + Math.random() * 0.25,
                    },
                });
            }, 120);

            setTimeout(() => {
                onUnlock();
            }, 1800);

            return;
        }

        setError("Access code tidak valid.");
        setPassword("");
    };

    if (unlocked) {
        return (
            <div className="secret-gate secret-success">
                <div className="secret-grid" />

                <div className="success-content">
                    <span className="success-symbol">✓</span>
                    <p className="secret-label">ACCESS GRANTED</p>
                    <h1>Welcome.</h1>
                    <span className="success-line" />
                    <p>Something has been waiting for you.</p>
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

                <h1>Something<br />is waiting.</h1>

                <p className="secret-description">
                    This place is not meant to be opened yet.
                </p>

                <form className="secret-form" onSubmit={handleSubmit}>
                    <label htmlFor="access-code">
                        ENTER ACCESS CODE
                    </label>

                    <div className="password-wrapper">
                        <input
                            id="access-code"
                            type="password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setError("");
                            }}
                            placeholder="••••••"
                            autoComplete="off"
                            maxLength={20}
                        />

                        <button type="submit">
                            ENTER
                        </button>
                    </div>

                    <div className="secret-error">
                        {error}
                    </div>
                </form>

                <div className="countdown">
                    <p className="countdown-label">
                        ACCESS WINDOW
                    </p>

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

                    {time.expired && (
                        <p className="access-open">
                            ACCESS WINDOW OPEN
                        </p>
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