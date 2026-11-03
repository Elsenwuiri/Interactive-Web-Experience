import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import SecretGate from "./SecretGate";
import "./App.css";
import { supabase } from "./lib/supabase";
import { ENABLE_SECRET_GATE } from "./secretGateConfig";
import { Analytics } from "@vercel/analytics/react";
import MusicSection from "./MusicSection";

const AUTH_KEY = "birthday_site_access";
const AUTH_DURATION = 10 * 60 * 1000;

const readStoredAccess = () => {
    try {
        const savedAccess = localStorage.getItem(AUTH_KEY);

        if (!savedAccess) return false;

        const loginTime = Number(savedAccess);

        if (
            !Number.isFinite(loginTime) ||
            Date.now() - loginTime >= AUTH_DURATION
        ) {
            localStorage.removeItem(AUTH_KEY);
            return false;
        }

        return true;
    } catch {
        return false;
    }
};

const photos = [
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 1",
        rotation: "2deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 2",
        rotation: "-1deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 3",
        rotation: "3deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 4",
        rotation: "-3deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 5",
        rotation: "1deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 6",
        rotation: "-2deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 7",
        rotation: "2deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 8",
        rotation: "-1deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 9",
        rotation: "3deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 10",
        rotation: "-2deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 11",
        rotation: "-2deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 12",
        rotation: "-2deg",
    },
];

const herPhotos = [
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 1",
        rotation: "2deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 2",
        rotation: "-1deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 3",
        rotation: "3deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 4",
        rotation: "-3deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 5",
        rotation: "1deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 6",
        rotation: "-2deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 7",
        rotation: "2deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 8",
        rotation: "-1deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 9",
        rotation: "3deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 10",
        rotation: "-2deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 11",
        rotation: "-2deg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10",
        caption: "Preview 12",
        rotation: "-2deg",
    },

];

const bibleVerses = [
    {
        reference: "Efesus 3:20",
        text: "\"Bagi Dialah, yang dapat melakukan jauh lebih banyak dari pada yang kita doakan atau pikirkan, seperti yang ternyata dari kuasa yang bekerja di dalam kita\"",
    },
    {
        reference: "Yeremia 29:11",
        text: "\"Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan\"",
    },
    {
        reference: "Mazmur 91:11",
        text: "\"Sebab malaikat-malaikat-Nya akan diperintahkan-Nya kepadamu untuk menjaga engkau di segala jalanmu\"",
    },
];

const easeInOutCubic = (progress) =>
    progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

const smoothScrollTo = (targetY, duration = 1100) => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const startY = window.scrollY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 1) {
        root.style.scrollBehavior = previousBehavior;
        return;
    }

    const startTime = performance.now();

    const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);

        window.scrollTo(0, startY + distance * easeInOutCubic(progress));

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            root.style.scrollBehavior = previousBehavior;
        }
    };

    requestAnimationFrame(step);
};

function App() {
    const [siteUnlocked, setSiteUnlocked] = useState(() => {
        if (!ENABLE_SECRET_GATE) return true;
        return readStoredAccess();
    });
    const [opened, setOpened] = useState(false);
    const [finalReveal, setFinalReveal] = useState(false);
    const [musicEnabled, setMusicEnabled] = useState(false);
    const [reply, setReply] = useState("");
    const [replyStatus, setReplyStatus] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [currentVerse, setCurrentVerse] = useState(0);

    const audioRef = useRef(null);
    const overlayRef = useRef(null);
    const sessionEndingRef = useRef(false);
    const welcomeConfettiRef = useRef(false);
    const verseTouchStart = useRef(0);

    useEffect(() => {
        if (!siteUnlocked) return undefined;

        let lastWrite = 0;

        const markActivity = () => {
            const now = Date.now();

            if (now - lastWrite < 3000) return;

            lastWrite = now;
            localStorage.setItem(AUTH_KEY, String(now));
        };

        markActivity();

        const events = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
            "wheel",
        ];

        events.forEach((event) =>
            window.addEventListener(event, markActivity, { passive: true })
        );

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, markActivity)
            );
        };
    }, [siteUnlocked]);

    useEffect(() => {
        if (!siteUnlocked) return undefined;

        const interval = setInterval(() => {
            const saved = Number(localStorage.getItem(AUTH_KEY));

            if (!saved || Date.now() - saved >= AUTH_DURATION) {
                beginSessionEnd();
            }
        }, 5000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteUnlocked]);

    const wasAudioPlayingBeforeVideo = useRef(false);

    const fadeOutAudio = (audio, duration = 500) => {
        return new Promise((resolve) => {
            if (!audio || audio.paused) {
                resolve();
                return;
            }
            const startVolume = audio.volume;
            const startTime = performance.now();

            const animate = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                audio.volume = startVolume * (1 - progress);

                if (progress < 1 && !audio.paused) {
                    requestAnimationFrame(animate);
                } else {
                    audio.pause();
                    audio.volume = 0.8;
                    resolve();
                }
            };
            requestAnimationFrame(animate);
        });
    };

    const fadeInAudio = (audio, targetVolume = 0.8, duration = 600) => {
        return new Promise((resolve) => {
            if (!audio) {
                resolve();
                return;
            }
            audio.volume = 0;
            audio.play()
                .then(() => {
                    const startTime = performance.now();
                    const animate = (now) => {
                        const progress = Math.min((now - startTime) / duration, 1);
                        audio.volume = targetVolume * progress;

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            audio.volume = targetVolume;
                            resolve();
                        }
                    };
                    requestAnimationFrame(animate);
                })
                .catch((error) => {
                    console.error("Audio gagal dimainkan:", error);
                    resolve();
                });
        });
    };

    const fadeOverlayIn = (duration = 700) =>
        new Promise((resolve) => {
            const element = overlayRef.current;

            if (!element) {
                resolve();
                return;
            }

            element.style.transition = "none";
            element.style.opacity = "0";
            element.style.pointerEvents = "auto";
            void element.offsetWidth;
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = "1";

            setTimeout(resolve, duration);
        });

    const fadeOverlayOut = (duration = 900) =>
        new Promise((resolve) => {
            const element = overlayRef.current;

            if (!element) {
                resolve();
                return;
            }

            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = "0";
            element.style.pointerEvents = "none";

            setTimeout(resolve, duration);
        });

    const beginSessionEnd = async () => {
        if (sessionEndingRef.current) return;

        sessionEndingRef.current = true;

        await fadeOverlayIn();
        localStorage.removeItem(AUTH_KEY);
        setSiteUnlocked(false);
        await fadeOverlayOut();

        sessionEndingRef.current = false;
    };

    const fireWelcomeConfetti = () => {
        if (welcomeConfettiRef.current) return;

        welcomeConfettiRef.current = true;

        const colors = ["#9e4f55", "#c98284", "#71383d", "#eea9ab", "#f7efe7"];

        confetti({
            particleCount: 90,
            spread: 100,
            startVelocity: 45,
            origin: { y: 0.65 },
            colors,
        });

        const end = Date.now() + 1800;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 60,
                origin: { x: 0, y: 0.72 },
                colors,
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 60,
                origin: { x: 1, y: 0.72 },
                colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        requestAnimationFrame(frame);
    };

    const fireOpenConfetti = () => {
        const colors = ["#9e4f55", "#c98284", "#71383d", "#eea9ab", "#f7efe7"];

        confetti({
            particleCount: 130,
            spread: 90,
            startVelocity: 50,
            origin: { y: 0.6 },
            colors,
        });
    };

    const handleUnlock = () => {
        localStorage.setItem(AUTH_KEY, String(Date.now()));

        const element = overlayRef.current;

        if (element) {
            element.style.transition = "none";
            element.style.opacity = "1";
            element.style.pointerEvents = "auto";
        }

        setSiteUnlocked(true);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!element) return;

                element.style.transition = "opacity 1000ms ease";
                element.style.opacity = "0";
                element.style.pointerEvents = "none";
            });
        });

        setTimeout(() => {
            fireWelcomeConfetti();
        }, 1100);
    };

    const musicWasPlaying = useRef(false);
    const videoResumeHandled = useRef(false);

    const handleVideoPlay = () => {
        const audio = audioRef.current;

        if (!audio) return;

        musicWasPlaying.current = !audio.paused;
        videoResumeHandled.current = false;

        if (musicWasPlaying.current) {
            audio.pause();
        }
    };

    const resumeMusicAfterVideo = () => {
        const audio = audioRef.current;

        if (
            !audio ||
            !musicWasPlaying.current ||
            videoResumeHandled.current
        ) {
            return;
        }

        videoResumeHandled.current = true;

        audio.volume = 0.8;

        audio.play().catch((error) => {
            console.error("Audio gagal dilanjutkan:", error);
        });

        musicWasPlaying.current = false;
    };

    const handleVideoPause = () => {
        resumeMusicAfterVideo();
    };

    const handleVideoEnded = () => {
        resumeMusicAfterVideo();
    };

    const toggleMusic = async () => {
        const audio = audioRef.current;

        if (!audio) return;

        if (audio.paused) {
            try {
                await fadeInAudio(audio, 0.8, 500);
                setMusicEnabled(true);
            } catch (error) {
                console.error("Audio gagal dimainkan:", error);
                setMusicEnabled(false);
            }
        } else {
            await fadeOutAudio(audio, 500);
            setMusicEnabled(false);
        }
    };

    const goToVerse = (index) => {
        setCurrentVerse(index);
    };

    const nextVerse = () => {
        setCurrentVerse((prev) => (prev + 1) % bibleVerses.length);
    };

    const prevVerse = () => {
        setCurrentVerse(
            (prev) => (prev - 1 + bibleVerses.length) % bibleVerses.length
        );
    };

    const handleVerseTouchStart = (event) => {
        verseTouchStart.current = event.touches[0].clientX;
    };

    const handleVerseTouchEnd = (event) => {
        const delta =
            event.changedTouches[0].clientX - verseTouchStart.current;

        if (Math.abs(delta) < 40) return;

        if (delta < 0) {
            nextVerse();
        } else {
            prevVerse();
        }
    };

    const openGift = async () => {
        setOpened(true);
        fireOpenConfetti();

        const target = document.getElementById("birthday");

        if (target) {
            const targetY =
                target.getBoundingClientRect().top + window.scrollY;
            smoothScrollTo(targetY, 1200);
        }

        const audio = audioRef.current;

        if (audio) {
            try {
                audio.src = "[your audio link]";
                audio.currentTime = 0;
                audio.volume = 0;
                audio.load();

                await fadeInAudio(audio, 0.8, 600);
                setMusicEnabled(true);
            } catch (error) {
                console.error("Audio gagal dimainkan:", error);
                setMusicEnabled(false);
            }
        }
    };

    const sendReply = async () => {
        const message = reply.trim();

        if (!message || isSending) return;

        setIsSending(true);
        setReplyStatus("");

        if (!supabase) {
            setReplyStatus("Supabase URL/Key not configure yet in .env");
            setIsSending(false);
            return;
        }

        const { error } = await supabase.from("letter_replies").insert({
            message,
        });

        if (error) {
            console.error(error);
            setReplyStatus("Something went wrong. Please try again.");
        } else {
            setReply("");
            setReplyStatus(
                "Thank you"
            );
        }

        setIsSending(false);
    };

    const revealFinal = () => {
        setFinalReveal(true);

        const duration = 3500;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            confetti({
                particleCount: 5,
                startVelocity: 20,
                spread: 80,
                origin: {
                    x: Math.random(),
                    y: Math.random() * 0.5,
                },
            });
        }, 180);

        setTimeout(() => {
            document.getElementById("final")?.scrollIntoView({
                behavior: "smooth",
            });
        }, 100);
    };

    return (
        <>
            <div ref={overlayRef} className="session-fade" />

            {!siteUnlocked ? (
                <SecretGate onUnlock={handleUnlock} />
            ) : (
                <main className="site">
                    <audio
                        ref={audioRef}
                        src="[your link audio]"
                        loop
                        preload="auto"
                    />

                    {opened && (
                        <button
                            className={`music-toggle ${musicEnabled ? "is-on" : "is-off"}`}
                            onClick={toggleMusic}
                            aria-label={musicEnabled ? "Matikan musik" : "Nyalakan musik"}
                        >
                            <span className="music-toggle-icon">♪</span>
                            <span className="music-toggle-label">
                                {musicEnabled ? "MUSIC ON" : "MUSIC OFF"}
                            </span>
                        </button>
                    )}

                    <div className="paper-texture" />

                    {/* Opening Section */}
                    <section className="opening section">
                        <div className="opening-background">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10" alt="" />
                        </div>

                        <div className="opening-overlay" />

                        <div className="opening-decor opening-decor-one">♡</div>
                        <div className="opening-decor opening-decor-two">✦</div>
                        <div className="opening-decor opening-decor-three">✿</div>

                        <div className="tape tape-top" />

                        <div className="opening-card paper-card">
                            <div className="small-label">DD MM YYYY</div>

                            <div className="recipient">
                                To<span>(your name)</span>
                            </div>

                            <div className="envelope-line" />

                            <h1>Lorem ipsum dolor sit amet</h1>

                            <p className="opening-description">
                                Lorem ipsum dolor sit amet,
                                <br />
                                consectetur adipiscing elit.
                            </p>

                            <button className="open-button" onClick={openGift}>
                                OPEN<span>→</span>
                            </button>

                            <div className="stamp">
                                <span>XX</span>
                                <small>YEARS</small>
                            </div>
                        </div>

                        <div className="scribble scribble-one">for you ♡</div>
                        <div className="scribble scribble-two">keep this page</div>

                        <div className="opening-bottom-note">
                            <span>scroll gently</span>
                            <span>↓</span>
                        </div>
                    </section>

                    {/* 01. Birthday Wish */}
                    <section
                        id="birthday"
                        className={`birthday section ${opened ? "is-opened" : ""}`}
                    >
                        <div className="section-doodle birthday-doodle-one">✿</div>
                        <div className="section-doodle birthday-doodle-two">♡</div>
                        <div className="section-doodle birthday-doodle-three">✦</div>
                        <div className="section-inner">
                            <div className="section-heading">
                                <span>01</span>
                                <div>
                                    <p className="eyebrow">TODAY IS YOUR DAY</p>
                                    <h2>Happy Birthday</h2>
                                </div>
                            </div>

                            <div className="birthday-grid">
                                <div className="birthday-copy">
                                    <p className="chinese-name">(name)</p>

                                    <p className="birthday-age">
                                        <strong>XX</strong>
                                        <span>years old</span>
                                    </p>

                                    <div className="handwritten">
                                        Today，
                                        <br />
                                        is the best day for you.
                                    </div>

                                    <p className="body-copy">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                                        Curabitur vitae massa sed turpis pellentesque consectetur. <br />
                                        Sed tempor arcu in efficitur sagittis. Pellentesque ut sapien massa. <br />
                                        Curabitur laoreet neque nisl, non volutpat ipsum rhoncus ut.。
                                    </p>
                                </div>

                                <div className="hero-photo-frame">
                                    <div className="photo-tape" />
                                    <div className="hero-photo">
                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10" alt="name" />
                                    </div>
                                    <p className="photo-note">the birthday girl ♡</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 02. Bible Verse */}
                    <section className="verse-section section">
                        <div className="verse-paper">
                            <div className="verse-decoration verse-decoration-one">✦</div>
                            <div className="verse-decoration verse-decoration-two">♡</div>

                            <div className="verse-top">
                                <span>02</span>
                                <div>
                                    <p className="eyebrow">SOMETHING TO KEEP</p>
                                    <h2>Bible Verse ✝️</h2>
                                </div>
                            </div>

                            <div className="verse-content">
                                <span className="verse-mark">“</span>

                                <div
                                    className="verse-carousel"
                                    onTouchStart={handleVerseTouchStart}
                                    onTouchEnd={handleVerseTouchEnd}
                                >
                                    <div
                                        className="verse-track"
                                        style={{
                                            transform: `translateX(-${currentVerse * 100
                                                }%)`,
                                        }}
                                    >
                                        {bibleVerses.map((verse) => (
                                            <div
                                                className="verse-slide"
                                                key={verse.reference}
                                            >
                                                <blockquote>
                                                    {verse.text}
                                                </blockquote>
                                                <div className="verse-line" />
                                                <p className="verse-reference">
                                                    {verse.reference}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="verse-controls">
                                    <button
                                        type="button"
                                        className="verse-arrow"
                                        onClick={prevVerse}
                                        aria-label="Ayat sebelumnya"
                                    >
                                        ‹
                                    </button>

                                    <div className="verse-dots">
                                        {bibleVerses.map((verse, index) => (
                                            <button
                                                key={verse.reference}
                                                type="button"
                                                className={`verse-dot ${index === currentVerse
                                                    ? "is-active"
                                                    : ""
                                                    }`}
                                                onClick={() => goToVerse(index)}
                                                aria-label={`Ayat ${index + 1
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        className="verse-arrow"
                                        onClick={nextVerse}
                                        aria-label="Ayat berikutnya"
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>

                            <div className="verse-note">
                                A little blessing for you ♡
                            </div>
                        </div>
                    </section>

                    {/* 03. Your Best Photo */}
                    <section className="memories section">
                        <div className="section-inner">
                            <div className="section-heading centered">
                                <span>03</span>
                                <div>
                                    <p className="eyebrow">A FEW LITTLE MOMENTS</p>
                                    <h2>Her Photos</h2>
                                </div>
                            </div>

                            <p className="section-intro">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                                Curabitur laoreet neque nisl, non volutpat ipsum rhoncus ut.
                            </p>

                            <div className="photo-grid">
                                {photos.map((photo, index) => (
                                    <article
                                        className="memory-card"
                                        key={photo.src}
                                        style={{ "--rotation": photo.rotation }}
                                    >
                                        <div className="memory-tape" />
                                        <div className="memory-photo">
                                            <img
                                                src={photo.src}
                                                alt={`Memory ${index + 1}`}
                                            />
                                        </div>
                                        <div className="memory-caption">
                                            <span>#{String(index + 1).padStart(2, "0")}</span>
                                            <p>{photo.caption}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 04. Our Gallery & Video */}
                    <section className="her-section section">
                        <div className="her-floating her-floating-one">♡</div>
                        <div className="her-floating her-floating-two">✦</div>
                        <div className="her-floating her-floating-three">✿</div>

                        <div className="section-inner">
                            <div className="section-heading her-heading">
                                <span>04</span>
                                <div>
                                    <p className="eyebrow">PORTRAITS OF US</p>
                                    <h2>Your Gallery</h2>
                                </div>
                            </div>

                            <div className="her-intro">
                                <p className="her-intro-text">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                                    Donec ultrices sed augue sed tincidunt. <br />
                                    Curabitur laoreet neque nisl, non volutpat ipsum rhoncus ut.
                                </p>
                                <span>♡</span>
                            </div>

                            <div className="her-gallery">
                                {herPhotos.map((photo, index) => (
                                    <article
                                        className={`her-photo her-photo-${index + 1}`}
                                        key={photo.src}
                                        style={{ "--rotation": photo.rotation }}
                                    >
                                        <div className="her-photo-frame">
                                            {photo.type === "video" ? (
                                                <video
                                                    src={photo.src}
                                                    controls
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    preload="metadata"
                                                />
                                            ) : (
                                                <img
                                                    src={photo.src}
                                                    alt={`Portrait ${index + 1}`}
                                                    loading="lazy"
                                                />
                                            )}

                                            <div className="her-photo-caption">
                                                {photo.caption}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="her-video-wrapper">
                                <div className="her-video-tape her-video-tape-left" />
                                <div className="her-video-tape her-video-tape-right" />

                                <div className="her-video-note">
                                    <span>one more thing...</span>
                                    <span>♡</span>
                                </div>

                                <div className="her-video-card">
                                    <div className="her-video-header">
                                        <div>
                                            <p className="eyebrow">A LITTLE VIDEO</p>
                                            <h3>For You</h3>
                                        </div>
                                        <span className="her-video-number">
                                            dd / mm
                                        </span>
                                    </div>

                                    <video
                                        className="her-video"
                                        controls
                                        playsInline
                                        preload="metadata"
                                        poster="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc49HC_qo15wMEoYZAvadrLqv3QEnc92yZYPCKBEPohdNFWuDu7HHHLnWb&s=10"
                                        onPlay={handleVideoPlay}
                                        onPause={handleVideoPause}
                                        onEnded={handleVideoEnded}
                                    >
                                        <source
                                            src="https://youtu.be/Aq5WXmQQooo?si=Aq_v1WAZtKXqeVF8"
                                            type="video/mp4"
                                        />
                                        Browser kamu tidak mendukung video.
                                    </video>

                                    <div className="her-video-footer">
                                        <span>PLAY WHEN YOU'RE READY</span>
                                        <span>♡</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 05. A Letter For You */}
                    <section className="letter section">
                        <div className="section-inner letter-inner">
                            <div className="letter-paper">
                                <div className="letter-tape" />
                                <div className="letter-stamp">LOVE</div>
                                <div className="letter-flower-decoration">✿</div>
                                <div className="letter-header">
                                    <span>05</span>
                                    <p>A LETTER FOR YOU</p>
                                </div>

                                <h2>Dear (Her Name),</h2>

                                <div className="letter-content">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                                        Curabitur vitae massa sed turpis pellentesque consectetur.

                                    </p>

                                    <p>
                                        Sed tempor arcu in efficitur sagittis. Pellentesque ut sapien massa.<br />
                                        Quisque diam justo, ultrices id diam ultrices, mattis fermentum nisi.
                                    </p>

                                    <p>
                                        Ut sit amet sapien ullamcorper, mattis lorem ac, cursus dui. <br />
                                        onec ultrices sed augue sed tincidunt. <br />
                                        Curabitur laoreet neque nisl, non volutpat ipsum rhoncus ut.<br />
                                    </p>

                                    <p className="letter-placeholder">
                                        From，<br />
                                        Your Name
                                    </p>
                                </div>

                                <div className="letter-flower">✿</div>
                            </div>
                        </div>
                    </section>

                    {/* 06. Music Section */}
                    <MusicSection
                        audioRef={audioRef}
                        musicEnabled={musicEnabled}
                        setMusicEnabled={setMusicEnabled}
                    />

                    {/* Final Heart & Wish Section */}
                    <section id="final" className="final section">
                        <div className="final-decor final-decor-one">♡</div>
                        <div className="final-decor final-decor-two">♡</div>
                        <div className="final-decor final-decor-three">✦</div>
                        <div className="final-decor final-decor-four">✿</div>
                        <div className="section-inner">
                            <div className="final-card">
                                {!finalReveal ? (
                                    <>
                                        <div className="final-decoration">♡</div>
                                        <p className="eyebrow">ONE LAST THING</p>
                                        <h2>Before you go...</h2>
                                        <p>
                                            还有一件事情
                                            <br />
                                            想亲口告诉你。
                                        </p>
                                        <button
                                            className="reveal-button"
                                            onClick={revealFinal}
                                        >
                                            OPEN MY HEART
                                        </button>
                                    </>
                                ) : (
                                    <div className="final-reveal">
                                        <div className="final-heart">♥</div>
                                        <p className="eyebrow">HAPPY BIRTHDAY</p>
                                        <h2>(Her Name)</h2>
                                        <div className="final-age">XX</div>

                                        <div className="final-message">
                                            <p>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
                                                Curabitur vitae massa sed turpis pellentesque consectetur. <br />
                                                Sed tempor arcu in efficitur sagittis. Pellentesque ut sapien massa. <br />
                                                Quisque diam justo, ultrices id diam ultrices, mattis fermentum nisi. <br />
                                                Ut sit amet sapien ullamcorper, mattis lorem ac, cursus dui. <br />
                                                Donec ultrices sed augue sed tincidunt. <br />
                                                Curabitur laoreet neque nisl, non volutpat ipsum rhoncus ut.
                                            </p>
                                        </div>

                                        <p className="final-signature">
                                            Always love u
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Reply Form */}
                    <div className="letter-reply">
                        <p className="eyebrow">A LITTLE MESSAGE BACK</p>
                        <h3>Now it's your turn.</h3>

                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Write anything..."
                            maxLength={10000}
                        />
                        <p className="final-signature">
                            note: (your note)
                        </p>

                        <div className="reply-footer">
                            <span>{reply.length}/10000</span>
                            <button
                                onClick={sendReply}
                                disabled={!reply.trim() || isSending}
                            >
                                {isSending ? "SENDING..." : "SEND MY MESSAGE ♡"}
                            </button>
                        </div>

                        {replyStatus && (
                            <p className="reply-status">{replyStatus}</p>
                        )}
                    </div>

                    <footer className="footer">
                        <p>made with love</p>
                        <span>♡</span>
                        <p>by your name</p>
                    </footer>
                </main>
            )}
            <Analytics />
        </>
    );
}

export default App;
