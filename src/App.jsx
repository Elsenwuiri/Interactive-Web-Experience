import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import SecretGate from "./SecretGate";
import "./App.css";
import { supabase } from "./lib/supabase";


const AUTH_KEY = "birthday_site_access";
const AUTH_DURATION = 10 * 60 * 1000;

const photos = [
    {
        src: "/images/photo-01.webp",
        caption: "lagi mejem mbak:)",
        rotation: "2deg",
    },
    {
        src: "/images/photo-02.webp",
        caption: "takut ke tempat serangga",
        rotation: "-1deg",
    },
    {
        src: "/images/photo-03.webp",
        caption: "senyum bahagia bangettt",
        rotation: "3deg",
    },
    {
        src: "/images/photo-04.webp",
        caption: "dokter kelelahan menangani pasien",
        rotation: "-3deg",
    },
    {
        src: "/images/photo-05.webp",
        caption: "senyum tipis tipis",
        rotation: "1deg",
    },
    {
        src: "/images/photo-06.webp",
        caption: "'dalam nama Yesus, dalam nama Yesus'",
        rotation: "-2deg",
    },
    {
        src: "/images/photo-07.webp",
        caption: "OOOOOOOOOOOOOOooooooooo",
        rotation: "2deg",
    },
    {
        src: "/images/photo-08.webp",
        caption: "😋",
        rotation: "-1deg",
    },
    {
        src: "/images/photo-09.webp",
        caption: "hmmmmmmmzzzzzz_-",
        rotation: "3deg",
    },
    {
        src: "/images/photo-10.webp",
        caption: "aduh belum siap, wkwkwkwk",
        rotation: "-2deg",
    },
];

const herPhotos = [
    {
        src: "/images/her/her-01.webp",
        caption: "The way you smile.",
        rotation: "-2deg",
    },
    {
        src: "/images/her/her-02.webp",
        caption: "A beautiful little moment.",
        rotation: "2deg",
    },
    {
        src: "/images/her/her-03.webp",
        caption: "You, just being you.",
        rotation: "-1deg",
    },
    {
        src: "/images/her/her-04.webp",
        caption: "One of my favorite pictures of you.",
        rotation: "3deg",
    },
    {
        src: "/images/her/her-05.webp",
        caption: "A moment worth keeping.",
        rotation: "-3deg",
    },
    {
        src: "/images/her/her-06.webp",
        caption: "There is something special about you.",
        rotation: "1deg",
    },
    {
        src: "/images/her/her-07.webp",
        caption: "Just you.",
        rotation: "-2deg",
    },
];

function App() {
    const [siteUnlocked, setSiteUnlocked] = useState(false);
    const [opened, setOpened] = useState(false);
    const [finalReveal, setFinalReveal] = useState(false);
    const [musicEnabled, setMusicEnabled] = useState(false);
    const [reply, setReply] = useState("");
    const [replyStatus, setReplyStatus] = useState("");
    const [isSending, setIsSending] = useState(false);

    const audioRef = useRef(null);

    useEffect(() => {
        const savedAccess = localStorage.getItem(AUTH_KEY);

        if (!savedAccess) {
            setSiteUnlocked(false);
            return;
        }

        const loginTime = Number(savedAccess);
        const elapsed = Date.now() - loginTime;

        if (elapsed < AUTH_DURATION) {
            setSiteUnlocked(true);
        } else {
            localStorage.removeItem(AUTH_KEY);
            setSiteUnlocked(false);
        }
    }, []);

    const handleUnlock = () => {
        localStorage.setItem(AUTH_KEY, String(Date.now()));
        setSiteUnlocked(true);
    };

    const handleVideoPlay = () => {
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            setMusicEnabled(false);
        }
    };

    const handleVideoEnded = () => {
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                setMusicEnabled(true);
            }).catch((error) => {
                console.error("Audio gagal dilanjutkan:", error);
            });
        }
    };

    const toggleMusic = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            try {
                await audio.play();
                setMusicEnabled(true);
            } catch (error) {
                console.error("Audio gagal dimainkan:", error);
            }
        } else {
            audio.pause();
            setMusicEnabled(false);
        }
    };

    const openGift = async () => {
        setOpened(true);
        setMusicEnabled(true);

        const audio = audioRef.current;
        if (audio) {
            try {
                audio.currentTime = 0;
                audio.volume = 0.8;
                await audio.play();
                console.log("Audio berhasil dimainkan.");
            } catch (error) {
                console.error("Audio gagal dimainkan:", error);
            }
        }

        setTimeout(() => {
            document.getElementById("birthday")?.scrollIntoView({
                behavior: "smooth",
            });
        }, 300);
    };

    const sendReply = async () => {
        const message = reply.trim();

        if (!message || isSending) return;

        setIsSending(true);
        setReplyStatus("");

        if (!supabase) {
            setReplyStatus("Supabase URL/Key belum dikonfigurasi di .env ♡");
            setIsSending(false);
            return;
        }

        const { error } = await supabase
            .from("letter_replies")
            .insert({
                message,
            });

        if (error) {
            console.error(error);
            setReplyStatus("Something went wrong. Please try again.");
        } else {
            setReply("");
            setReplyStatus("MAKASIHHH UDHH NULISSS, WKWKWKWK LOVE U SO MUCH!! ♡");
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

    if (!siteUnlocked) {
        return <SecretGate onUnlock={handleUnlock} />;
    }

    return (
        <main className="site">
            <audio
                ref={audioRef}
                src="./music/birthday-song.mp3"
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
                    <span className="music-toggle-label">{musicEnabled ? "MUSIC ON" : "MUSIC OFF"}</span>
                </button>
            )}

            <div className="paper-texture" />

            <section className="opening section">
                <div className="opening-background">
                    <img
                        src="/images/background.webp"
                        alt=""
                    />
                </div>

                <div className="opening-overlay" />

                <div className="opening-decor opening-decor-one">♡</div>
                <div className="opening-decor opening-decor-two">✦</div>
                <div className="opening-decor opening-decor-three">✿</div>

                <div className="tape tape-top" />

                <div className="opening-card paper-card">
                    <div className="small-label">24 OCTOBER 2026</div>

                    <div className="recipient">
                        给<span>温云花</span>
                    </div>

                    <div className="envelope-line" />

                    <h1>给温云花的一封信</h1>

                    <p className="opening-description">
                        一份小小的礼物，
                        <br />
                        写给今天的你。
                    </p>

                    <button className="open-button" onClick={openGift}>
                        OPEN<span>→</span>
                    </button>

                    <div className="stamp">
                        <span>24</span>
                        <small>YEARS</small>
                    </div>
                </div>

                <div className="scribble scribble-one">
                    for you ♡
                </div>

                <div className="scribble scribble-two">
                    keep this page
                </div>

                <div className="opening-bottom-note">
                    <span>scroll gently</span>
                    <span>↓</span>
                </div>
            </section>

            <section
                id="birthday"
                className={`birthday section ${opened ? "is-opened" : ""} `}
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
                                依然可以做自己喜欢的事，
                                <br />
                                去喜欢的地方，
                                <br />
                                遇见更多值得珍惜的人。
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

            <section className="verse-section section">
                <div className="verse-paper">
                    <div className="verse-decoration verse-decoration-one">
                        ✦
                    </div>

                    <div className="verse-decoration verse-decoration-two">
                        ♡
                    </div>

                    <div className="verse-top">
                        <span>02</span>

                        <div>
                            <p className="eyebrow">SOMETHING TO KEEP</p>
                            <h2>Bible Verse</h2>
                        </div>
                    </div>

                    <div className="verse-content">
                        <span className="verse-mark">“</span>

                        <blockquote>
                            "Bagi Dialah, yang dapat melakukan jauh lebih banyak dari pada yang kita doakan atau pikirkan,
                            seperti yang ternyata dari kuasa yang bekerja di dalam kita"
                        </blockquote>

                        <div className="verse-line" />

                        <p className="verse-reference">
                            Efesus 3:20
                        </p>
                    </div>

                    <div className="verse-note">
                        A little blessing for you ♡
                    </div>
                </div>
            </section>


            <section className="memories section">
                <div className="section-inner">
                    <div className="section-heading centered">
                        <span>03</span>

                        <div>
                            <p className="eyebrow">A FEW LITTLE MOMENTS</p>
                            <h2>Your "best" photo</h2>
                        </div>
                    </div>

                    <p className="section-intro">
                        有些记忆很普通，
                        <br />
                        但因为和你有关，
                        <br />
                        就变得特别。
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
                                        alt={`Memory ${index + 1} `}
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

            <section className="her-section section">
                <div className="her-floating her-floating-one">♡</div>
                <div className="her-floating her-floating-two">✦</div>
                <div className="her-floating her-floating-three">✿</div>

                <div className="section-inner">
                    <div className="section-heading her-heading">
                        <span>04</span>

                        <div>
                            <p className="eyebrow">PORTRAITS OF YOU</p>
                            <h2>Her Gallery</h2>
                        </div>
                    </div>

                    <div className="her-intro">
                        <p className="her-intro-text">
                            每一张照片，
                            <br />
                            都是你最美的样子。
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
                                    <img
                                        src={photo.src}
                                        alt={`Portrait ${index + 1}`}
                                        loading="lazy"
                                    />

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
                                    04 / 01
                                </span>
                            </div>

                            <video
                                className="her-video"
                                controls
                                playsInline
                                preload="metadata"
                                poster="/images/background-vid.webp"
                                onPlay={handleVideoPlay}
                                onEnded={handleVideoEnded}
                            >
                                <source
                                    src="/videos/photo-14.mp4"
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

            {/* <section className="video-section section">
                <div className="section-inner">
                    <div className="section-heading centered">
                        <span>04</span>

                        <div>
                            <p className="eyebrow">A LITTLE VIDEO FOR YOU</p>
                            <h2>A Message For You</h2>
                        </div>
                    </div>

                    <p className="section-intro">
                        Ada sesuatu yang ingin aku sampaikan,
                        <br />
                        bukan hanya lewat tulisan.
                    </p>

                    <div className="personal-video-card">
                        <div className="video-doodle video-doodle-one">♡</div>
                        <div className="video-doodle video-doodle-two">✦</div>
                        <div className="video-tape video-tape-left" />
                        <div className="video-tape video-tape-right" />

                        <div className="personal-video-frame">
                            <video
                                controls
                                playsInline
                                preload="metadata"
                                poster="/images/photo-14.webp"
                            >
                                <source
                                    src="/videos/photo-16.mp4"
                                    type="video/mp4"
                                />

                                Browser kamu tidak mendukung pemutaran video.
                            </video>
                        </div>

                        <div className="video-caption">
                            <span>♡</span>
                            <p>A little message, just for you.</p>
                        </div>
                    </div>
                </div>
            </section> */}

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

                        <h2>Dear 温云花,</h2>

                        <div className="letter-content">
                            <p>这里以后可以写给她的第一段话。</p>

                            <p>
                                这里可以写你们之间的故事、回忆，
                                或者你想对她说的话。
                            </p>

                            <p>
                                这里也可以写生日祝福。
                                这一部分你可以按照自己的方式修改。
                            </p>

                            <p className="letter-placeholder">
                                —— 朱有贤
                            </p>
                        </div>

                        <div className="letter-flower">✿</div>
                    </div>
                </div>
            </section>

            <section className="music section">
                <div className="section-inner">
                    <div className="section-heading">
                        <span>06</span>

                        <div>
                            <p className="eyebrow">A SONG FOR TODAY</p>
                            <h2>Listen With Me</h2>
                        </div>
                    </div>

                    <div className="music-card">
                        <div className="music-decoration music-decoration-one">♪</div>
                        <div className="music-decoration music-decoration-two">✦</div>
                        <div className="music-copy">
                            <span className="music-label">NOW PLAYING</span>

                            <h3>一首属于今天的歌</h3>

                            <p>
                                Lagu ini akan menemani kamu
                                <br />
                                selama membuka halaman ini.
                            </p>
                        </div>

                        <div className="local-music-status">
                            <div className="music-disc">
                                ♫
                            </div>

                            <div>
                                <p className="music-status-title">
                                    Birthday Song
                                </p>

                                <span>
                                    Playing since you opened this page ♡
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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

                                <p className="final-message">
                                    愿你新的一岁，
                                    <br />
                                    有更多快乐，
                                    <br />
                                    有更多勇气，
                                    <br />
                                    也有更多值得珍藏的回忆。
                                </p>

                                <p className="final-signature">
                                    Always Love You ♡
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* letter reply */}
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
                    note: tidak menerima short message :)
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
    );
}

export default App;
