import React, { useState } from "react";
import confetti from "canvas-confetti";
import "./App.css";

const YOUTUBE_VIDEO_ID = "_akQhEANnPA";

const photos = [
    {
        src: "/images/photo-02.webp",
        caption: "One of my favorite memories.",
        rotation: "-2deg",
    },
    {
        src: "/images/photo-03.webp",
        caption: "A little moment worth remembering.",
        rotation: "2deg",
    },
    {
        src: "/images/photo-04.webp",
        caption: "Somewhere between ordinary and special.",
        rotation: "-1deg",
    },
    {
        src: "/images/photo-05.webp",
        caption: "A memory I want to keep.",
        rotation: "3deg",
    },
    {
        src: "/images/photo-06.webp",
        caption: "Another little piece of us.",
        rotation: "-3deg",
    },
    {
        src: "/images/photo-07.webp",
        caption: "This moment still makes me smile.",
        rotation: "1deg",
    },
    {
        src: "/images/photo-08.webp",
        caption: "A day worth putting in this scrapbook.",
        rotation: "-2deg",
    },
    {
        src: "/images/photo-09.webp",
        caption: "Thank you for this memory.",
        rotation: "2deg",
    },
    {
        src: "/images/photo-10.webp",
        caption: "One more page of our story.",
        rotation: "-1deg",
    },
    {
        src: "/images/photo-11.webp",
        caption: "And many more memories to come.",
        rotation: "3deg",
    },
    {
        src: "/images/photo-12.webp",
        caption: "A memory I want to keep.",
        rotation: "3deg",
    },
    {
        src: "/images/photo-13.webp",
        caption: "Another little piece of us.",
        rotation: "-5deg",
    },
];

function App() {
    const [opened, setOpened] = useState(false);
    const [finalReveal, setFinalReveal] = useState(false);

    const openGift = () => {
        setOpened(true);

        setTimeout(() => {
            document.getElementById("birthday")?.scrollIntoView({ behavior: "smooth" });
        }, 300);
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
            document
                .getElementById("final")
                ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    return (
        <main className="site">
            <div className="paper-texture" />

            <section className="opening section">
                <div className="tape tape-top" />

                <div className="opening-card paper-card">
                    <div className="small-label">24 OCTOBER 2026</div>

                    <div className="recipient">
                        给
                        <span>温云花</span>
                    </div>

                    <div className="envelope-line" />

                    <h1>给温云花的一封信</h1>

                    <p className="opening-description">
                        一份小小的礼物，
                        <br />
                        写给今天的你。
                    </p>

                    <button className="open-button" onClick={openGift}>
                        OPEN
                        <span>→</span>
                    </button>

                    <div className="stamp">
                        <span>24</span>
                        <small>YEARS</small>
                    </div>
                </div>

                <div className="scribble scribble-one">for you ♡</div>
                <div className="scribble scribble-two">keep this page</div>
            </section>

            <section
                id="birthday"
                className={`birthday section ${opened ? "is-opened" : ""}`}
            >
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
                                <img
                                    src="/images/photo-01.webp"
                                    alt="温云花"
                                />
                            </div>

                            <p className="photo-note">
                                the birthday girl ♡
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="memories section">
                <div className="section-inner">
                    <div className="section-heading centered">
                        <span>02</span>

                        <div>
                            <p className="eyebrow">A FEW LITTLE MOMENTS</p>
                            <h2>Our Scrapbook</h2>
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
                                style={{
                                    "--rotation": photo.rotation,
                                }}
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

            <section className="video-section section">
                <div className="section-inner">
                    <div className="section-heading centered">
                        <span>03</span>
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
                        <div className="video-tape video-tape-left" />
                        <div className="video-tape video-tape-right" />

                        <div className="personal-video-frame">
                            <video
                                controls
                                playsInline
                                preload="metadata"
                                x
                            >
                                <source src="/videos/photo-15.mp4" type="video/mp4" />
                                Browser kamu tidak mendukung pemutaran video.
                            </video>
                        </div>

                        <div className="video-caption">
                            <span>♡</span>
                            <p>A little message, just for you.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="letter section">
                <div className="section-inner letter-inner">
                    <div className="letter-paper">
                        <div className="letter-tape" />

                        <div className="letter-header">
                            <span>04</span>
                            <p>A LETTER FOR YOU</p>
                        </div>

                        <h2>Dear 温云花,</h2>

                        <div className="letter-content">
                            <p>
                                这里以后可以写给她的第一段话。
                            </p>

                            <p>
                                这里可以写你们之间的故事、回忆，
                                或者你想对她说的话。
                            </p>

                            <p>
                                这里也可以写生日祝福。
                                这一部分你可以按照自己的方式修改。
                            </p>

                            <p className="letter-placeholder">
                                ——朱有贤
                            </p>
                        </div>

                        <div className="letter-flower">
                            ✿
                        </div>
                    </div>
                </div>
            </section>

            <section className="music section">
                <div className="section-inner">
                    <div className="section-heading">
                        <span>05</span>

                        <div>
                            <p className="eyebrow">A SONG FOR TODAY</p>
                            <h2>Listen With Me</h2>
                        </div>
                    </div>

                    <div className="music-card">
                        <div className="music-copy">
                            <span className="music-label">NOW PLAYING</span>

                            <h3>一首属于今天的歌</h3>

                            <p>
                                放一首你想送给她的歌。
                                <br />
                                YouTube 链接可以随时更换。
                            </p>
                        </div>

                        {YOUTUBE_VIDEO_ID !== "YOUR_YOUTUBE_VIDEO_ID" ? (
                            <div className="youtube-wrapper">
                                <iframe
                                    src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&playsinline=1&rel=0`}
                                    title="Birthday song"
                                    allow="autoplay; encrypted-media; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="youtube-placeholder">
                                <span>♫</span>
                                <p>YOUR YOUTUBE SONG</p>
                                <small>
                                    Replace YOUTUBE_VIDEO_ID in App.jsx
                                </small>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section id="final" className="final section">
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
                                    Always with you ♡
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <footer className="footer">
                <p>made with love</p>
                <span>♡</span>
                <p>2026</p>
            </footer>
        </main>
    );
}

export default App;