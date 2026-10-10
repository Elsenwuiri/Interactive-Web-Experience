import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import SecretGate from "./SecretGate";
import "./App.css";
import { supabase } from "./lib/supabase";
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
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/photo-01.webp",
        caption: "lagi mejem mbak:)",
        rotation: "2deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/photo-02.webp",
        caption: "takut ke tempat serangga, wkwkwkwk",
        rotation: "-1deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/photo-03.webp",
        caption: "senyum bahagia bangettt",
        rotation: "3deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/photo-04.webp",
        caption: "dokter kelelahan menangani pasien gess",
        rotation: "-3deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/photo-05.webp",
        caption: "makasihhh fotonya, WKWKWKWK",
        rotation: "1deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/photo-06.webp",
        caption: "'dalam nama Yesus, dalam nama Yesus'",
        rotation: "-2deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/photo-07.webp",
        caption: "OOOOOOOOoooo",
        rotation: "2deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/photo-08.webp",
        caption: "😋",
        rotation: "-1deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/photo-09.webp",
        caption: "hmmmmzzz_-",
        rotation: "3deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/photo-10.webp",
        caption: "aduh belum siap, wkwkwkwk",
        rotation: "-2deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/photo-11.webp",
        caption: "noleh dikit, etttt",
        rotation: "-2deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/photo-12.webp",
        caption: "matcha apa cheese yaaa, hmmmm",
        rotation: "-2deg",
    },
];

const herPhotos = [
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/her/her-02.webp",
        caption: "就像52一样, 意思是我爱温, 呵呵",
        rotation: "2deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/her/her-03.webp",
        caption: "这张照片拍起来有点费劲。",
        rotation: "-1deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/her/her-07.webp",
        caption: "不得不说，这张真的很酷",
        rotation: "-2deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/her/her-06.webp",
        caption: "我要吃你啊, aaaaaaa",
        rotation: "1deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/her/her-05.webp",
        caption: "我们再去徒步吧～～ ",
        rotation: "-3deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/her/her-04.webp",
        caption: "风景和你一样美～～",
        rotation: "3deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/her/her-12.webp",
        caption: "我有一位超酷的医生啦:)",
        rotation: "-2deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/her/her-11.webp",
        caption: "我们的第一张合照 🤍",
        rotation: "-2deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/her/her-09.webp",
        caption: "我们的 photobooth 还要再多一点！",
        rotation: "-2deg",
    },
    {
        type: "video",
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Videos/photo-15.mp4",
        caption: "太绝了！",
        rotation: "1deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/her/her-10.webp",
        caption: "没有别的话了，完美",
        rotation: "-2deg",
    },
    {
        src: "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Images/her/her-14.webp",
        caption: "可爱。",
        rotation: "2deg",
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
    const [siteUnlocked, setSiteUnlocked] = useState(readStoredAccess);
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
                audio.src = "https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Musics/birthday-song.mp3";
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
            setReplyStatus("Supabase URL/Key belum dikonfigurasi di .env ♡, screenshoot kirim ke aku yaakkk");
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
                "MAKASIHHH UDHH NULISSS, WKWKWKWK LOVE U SO MUCH!! ♡"
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
                        src="/music/birthday-song.mp3"
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
                            <img src="/images/background.webp" alt="" />
                        </div>

                        <div className="opening-overlay" />

                        <div className="opening-decor opening-decor-one">♡</div>
                        <div className="opening-decor opening-decor-two">✦</div>
                        <div className="opening-decor opening-decor-three">✿</div>

                        <div className="tape tape-top" />

                        <div className="opening-card paper-card">
                            <div className="small-label">24 OCTOBER 2026</div>

                            <div className="recipient">
                                给<span>温云花❤️</span>
                            </div>

                            <div className="envelope-line" />

                            <h1>给你的一封信</h1>

                            <p className="opening-description">
                                这是一份小小的礼物，
                                <br />
                                也是我想在今天送给你的心意。
                            </p>

                            <button className="open-button" onClick={openGift}>
                                OPEN<span>→</span>
                            </button>

                            <div className="stamp">
                                <span>24</span>
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
                                    <p className="chinese-name">温云花</p>

                                    <p className="birthday-age">
                                        <strong>24</strong>
                                        <span>years old</span>
                                    </p>

                                    <div className="handwritten">
                                        今天，
                                        <br />
                                        是属于你的日子。
                                    </div>

                                    <p className="body-copy">
                                        希望你在新的一岁里，
                                        <br />
                                        你可以做任何自己喜欢的事情，
                                        <br />
                                        去任何你想去的地方，
                                        <br />
                                        以后也能遇见更多对你好的人。
                                    </p>
                                </div>

                                <div className="hero-photo-frame">
                                    <div className="photo-tape" />
                                    <div className="hero-photo">
                                        <img src="/images/photo-wen.webp" alt="温云花" />
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
                                    <h2>Your "Best" Photos :) 😗</h2>
                                </div>
                            </div>

                            <p className="section-intro">
                                这些照片可能很普通，
                                <br />
                                但因为有你，就变得特别了。
                                <br />
                                哈哈哈哈，不许生气哦，嘿嘿。
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
                                    <h2>Our Gallery 🥰</h2>
                                </div>
                            </div>

                            <div className="her-intro">
                                <p className="her-intro-text">
                                    这些照片看起来都很珍贵，
                                    <br />
                                    希望以后我们可以有更多这样的合照🌚
                                    <br />
                                    这些照片真的很好看，
                                    <br />
                                    因为有你在:)
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
                                            24 / 10
                                        </span>
                                    </div>

                                    <video
                                        className="her-video"
                                        controls
                                        playsInline
                                        preload="metadata"
                                        poster="/images/background-vid.webp"
                                        onPlay={handleVideoPlay}
                                        onPause={handleVideoPause}
                                        onEnded={handleVideoEnded}
                                    >
                                        <source
                                            src="https://fribzjcwqyveydprvxkc.supabase.co/storage/v1/object/public/wen-birthday-public/Videos/photo-14.mp4"
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

                                <h2>Dear 温云花 ❤️,</h2>

                                <div className="letter-content">
                                    <p>
                                        写到这里，我只想先谢谢耶稣，<br />
                                        谢谢祂让我遇见了这么优秀、这么漂亮、也这么可爱的你。
                                    </p>

                                    <p>
                                        好像真的没有什么话可以形容我现在的心情，<br />
                                        除了感谢，还是感谢。
                                    </p>

                                    <p>
                                        感谢能够成为你的另一半，<br />
                                        能够成为你的男朋友，<br />
                                        也希望以后，我可以一直陪着你，<br />
                                        成为你第二个可以回去的家，<br />
                                        一直到很久很久以后，直到永远。
                                    </p>

                                    <p>
                                        愿上帝一直祝福你的生活、你的家人，还有你的工作。
                                    </p>

                                    <p>
                                        我想对你说的话其实只有一句：<br />
                                        无论以后遇到什么，<br />
                                        都要记得，在每一个生命的阶段里，依靠上帝。
                                    </p>

                                    <p>
                                        愿祂一直带领你，也一直与你同在。
                                    </p>

                                    <p className="letter-placeholder">
                                        —— 来自你最爱的人，<br />
                                        朱有贤
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
                                        <h2>温云花</h2>
                                        <div className="final-age">24</div>

                                        <div className="final-message">
                                            <p>
                                                愿这一年，祝福满满地临到你，<br />
                                                愿你远离一切危险，<br />
                                                远离所有的悲伤，<br />
                                                也愿上帝将喜乐充满在你的生命中。
                                            </p>

                                            <p>
                                                上帝已经陪伴你走过了24年，<br />
                                                愿你在新的一岁里越来越成熟，<br />
                                                也越来越爱上帝。
                                            </p>

                                            <p>
                                                愿上帝继续陪伴你走过新的一岁，<br />
                                                也愿你把生命中的一切，<br />
                                                都交托在上帝的手中。
                                            </p>

                                            <p>
                                                最后，生日快乐，温云花。<br />
                                                愿你岁岁欢愉，平安喜乐。
                                            </p>
                                        </div>

                                        <p className="final-signature">
                                            Always love u ❤️
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
                            note: nggak menerima short messages :)
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
                        <p>2026</p>
                    </footer>
                </main>
            )}
            <Analytics />
        </>
    );
}

export default App;
