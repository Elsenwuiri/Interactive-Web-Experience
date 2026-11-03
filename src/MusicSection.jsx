import { useEffect, useRef, useState } from "react";
import "./MusicSection.css";

const tracks = [
    {
        id: 1,
        title: "Another Birthday Song",
        file: "[your link song]",
        caption:
            "your caption here"
    },
    {
        id: 2,
        title: "Song 2",
        file: "[your link song]",
        caption:
            "your caption here"
    },
    {
        id: 3,
        title: "Song 3",
        file: "[your link song]",
        caption:
            "your caption here"
    },
    {
        id: 4,
        title: "Song 4",
        file: "[your link song]",
        caption:
            "your caption here"
    },
];

function MusicSection({ audioRef, musicEnabled, setMusicEnabled }) {
    const [currentTrack, setCurrentTrack] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isChanging, setIsChanging] = useState(false);

    const isChangingRef = useRef(false);
    const fadeFrame = useRef(null);

    const [typedCaption, setTypedCaption] = useState("");

    const currentCaption = tracks[currentTrack].caption;

    useEffect(() => {
        setTypedCaption("");

        let index = 0;

        const interval = setInterval(() => {
            index += 1;

            setTypedCaption(currentCaption.slice(0, index));

            if (index >= currentCaption.length) {
                clearInterval(interval);
            }
        }, 35);

        return () => clearInterval(interval);
    }, [currentTrack, currentCaption]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => {
            setIsPlaying(true);
            setMusicEnabled(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        const handleEnded = () => {
            setIsPlaying(false);
        };

        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("ended", handleEnded);

        if (!audio.paused) {
            setIsPlaying(true);
        }

        return () => {
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [audioRef, setMusicEnabled]);

    const stopFadeAnimation = () => {
        if (fadeFrame.current) {
            cancelAnimationFrame(fadeFrame.current);
            fadeFrame.current = null;
        }
    };

    const changeTrack = async (targetIndex) => {
        const audio = audioRef.current;

        // Synchronous ref check prevents double-triggering on rapid clicks
        if (!audio || isChangingRef.current) {
            return;
        }

        isChangingRef.current = true;
        setIsChanging(true);
        stopFadeAnimation();

        try {
            const wasPlaying = !audio.paused || musicEnabled;

            audio.pause();
            audio.src = tracks[targetIndex].file;
            audio.currentTime = 0;
            audio.volume = 0.8;
            audio.load();

            setCurrentTrack(targetIndex);

            if (wasPlaying) {
                try {
                    await audio.play();
                    setMusicEnabled(true);
                    setIsPlaying(true);
                } catch (playError) {
                    if (playError.name !== "AbortError") {
                        console.error("Gagal memainkan lagu:", playError);
                    }
                }
            }
        } catch (err) {
            console.error("Error saat mengganti track:", err);
        } finally {
            setTimeout(() => {
                isChangingRef.current = false;
                setIsChanging(false);
            }, 150);
        }
    };

    const togglePlayback = async () => {
        const audio = audioRef.current;
        if (!audio || isChangingRef.current) return;

        stopFadeAnimation();

        if (!audio.src || !audio.src.endsWith(".mp3")) {
            audio.src = tracks[currentTrack].file;
            audio.load();
        }

        if (audio.paused) {
            try {
                audio.volume = 0.8;
                await audio.play();
                setMusicEnabled(true);
                setIsPlaying(true);
            } catch (error) {
                console.error("Audio gagal dimainkan:", error);
            }
        } else {
            audio.pause();
            setMusicEnabled(false);
            setIsPlaying(false);
        }
    };

    const nextTrack = () => {
        const nextIndex = (currentTrack + 1) % tracks.length;
        changeTrack(nextIndex);
    };

    const previousTrack = () => {
        const previousIndex =
            (currentTrack - 1 + tracks.length) % tracks.length;
        changeTrack(previousIndex);
    };

    return (
        <section className="music-section section">
            <div className="music-background">
                <span className="music-decoration music-decoration-one">♫</span>
                <span className="music-decoration music-decoration-two">✦</span>
                <span className="music-decoration music-decoration-three">♡</span>
            </div>

            <div className="music-container">
                <div className="music-heading">
                    <span className="music-number">06</span>
                    <div>
                        <p className="eyebrow">A LITTLE SOUNDTRACK</p>
                        <h2>Our Little Soundtrack. 🎶</h2>
                    </div>
                </div>

                <div className="music-intro">
                    <p>
                        Some songs are just songs.
                        <br />
                        Some songs become memories.
                    </p>
                    <span>♫</span>
                </div>

                <div className={`vinyl-stage ${isChanging ? "is-changing" : ""}`}>
                    <div
                        className={`vinyl-record ${isPlaying ? "is-playing" : ""}`}
                        onClick={togglePlayback}
                        style={{ cursor: "pointer" }}
                        title={isPlaying ? "Klik untuk jeda" : "Klik untuk putar"}
                    >
                        <div className="vinyl-grooves" />

                        <div className="vinyl-label">
                            <span className="vinyl-track-number">
                                {String(tracks[currentTrack].id).padStart(2, "0")}
                            </span>

                            <div className="vinyl-label-title">
                                {tracks[currentTrack].title}
                            </div>

                            <span className="vinyl-heart">♡</span>
                        </div>

                        <div className="vinyl-hole" />
                    </div>

                    <div className="vinyl-shadow" />

                    <div className="vinyl-note">
                        <span>{isPlaying ? "NOW PLAYING" : "PAUSED"}</span>
                        <span>♡</span>
                    </div>
                </div>


                <div className="music-player">
                    <div className="music-player-top">
                        <div>
                            <p className="music-track-label">
                                TRACK{" "}
                                {String(tracks[currentTrack].id).padStart(2, "0")}{" "}
                                / {String(tracks.length).padStart(2, "0")}
                            </p>

                            <h3>{tracks[currentTrack].title}</h3>

                            <div className="music-caption">
                                <span>{typedCaption}</span>
                                <span className="typewriter-cursor">|</span>
                            </div>
                        </div>

                        <button
                            className="music-main-button"
                            onClick={togglePlayback}
                            aria-label={isPlaying ? "Pause music" : "Play music"}
                        >
                            {isPlaying ? "Ⅱ" : "▶"}
                        </button>
                    </div>

                    <div className="music-controls">
                        <button
                            onClick={previousTrack}
                            disabled={isChanging}
                            aria-label="Previous song"
                        >
                            ←
                        </button>

                        <div className="music-wave">
                            {Array.from({ length: 24 }).map((_, index) => (
                                <span
                                    key={index}
                                    style={{
                                        "--delay": `${index * 0.045}s`,
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTrack}
                            disabled={isChanging}
                            aria-label="Next song"
                        >
                            →
                        </button>
                    </div>
                </div>

                <div className="track-list">
                    {tracks.map((item, index) => (
                        <button
                            key={item.id}
                            className={`track-card ${index === currentTrack ? "is-active" : ""
                                }`}
                            onClick={() => changeTrack(index)}
                            disabled={isChanging}
                        >
                            <span className="track-card-number">
                                {String(item.id).padStart(2, "0")}
                            </span>

                            <span className="track-card-title">
                                {item.title}
                            </span>

                            <span className="track-card-symbol">
                                {index === currentTrack ? "♡" : "○"}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="music-message">
                    <span className="music-message-line" />
                    <p>
                        Pick a song.
                        <br />
                        I'll let it stay here with you.
                    </p>
                    <span className="music-message-heart">♡</span>
                </div>
            </div>
        </section>
    );
}

export default MusicSection;