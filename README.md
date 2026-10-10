# 给温云花的一封信 — Birthday Gift Website

A personal, interactive birthday website created as a digital scrapbook for **温云花**.

The project combines photography, music, video, handwritten-style typography, animations, and a private message experience into a single mobile-first birthday gift.

## Overview

**Recipient:** 温云花  
**Birthday:** 24 October 2026  
**Project Type:** Personal interactive birthday gift  
**Design Direction:** Scrapbook / nostalgic / elegant / muted red  
**Primary Platform:** Mobile-first, responsive desktop support

The website is designed to feel less like a conventional webpage and more like opening a personal scrapbook containing memories, music, photographs, letters, and small surprises.

---

## Features

### 1. Layered Secret Gate

The website opens with a layered, riddle-based gate instead of immediately revealing the birthday content. Two riddles and a time lock guard the entrance, in this order:

```text
RIDDLE 01 → PASSKEY 01 → TIME LOCK → 24 OCTOBER 2026 → RIDDLE 02 → PASSKEY 02 → ACCESS GRANTED
```

Features:
- Riddle 01 before the target date (6-digit code entered as three 2-digit boxes)
- Solving Riddle 01 early only shows the `ACCESS LOCKED` screen with the live countdown
- Time lock based on the visitor's local clock (`24.10.2026`)
- At midnight Riddle 01 disappears and Riddle 02 becomes the only active riddle (in-page transition, no reload)
- A short notice (`eh... ada yang berubah.`) introduces Riddle 02 the first time it activates
- Late visitors see `🔒 SECOND CLUE LOCKED` and can reopen Riddle 01 with the `I THINK I REMEMBER` button
- Correct-code success state (`✓`), existing `VERIFYING... → ACCESS GRANTED` sequence
- Confetti effect after successful access
- Temporary access persistence using `localStorage`
- Access expires after 10 minutes

The gate only opens when all three layers are satisfied:

```js
const canAccessWebsite = riddle1Solved && riddle2Solved && isTargetDateReached;
```

Riddle progress is permanent and separate from the 10-minute viewing session:

```js
localStorage.getItem("riddle1Solved"); // "true" once Riddle 01 was solved
localStorage.getItem("riddle2Solved"); // "true" once Riddle 02 was solved
```

All gate values live in `src/secretGateConfig.js`:

```js
export const SECRET_GATE_CONFIG = {
    firstPasskey: "772452",
    secondPasskey: "123456",
    targetDate: "2026-10-24T00:00:00",
    lockedMessage: {
        title: "ACCESS LOCKED",
        message: "udahh buka riddle tapi belom waktunyaa, wkwkwkwk",
        subtitle: "Sabar sedikit lagi...",
    },
};
```

An invalid code reuses the existing playful error messages, and passkeys are never rendered in the UI.

> The gate is intended as a surprise/puzzle experience, not as real security. The passkeys live in the client-side application and can therefore be inspected by users with technical access to the deployed JavaScript bundle.

---

### 2. Birthday Countdown

The opening gate contains a live countdown with:

- Days
- Hours
- Minutes
- Seconds

The countdown is tied to:

```text
24 October 2026, 00:00 (visitor's local time, configured in src/secretGateConfig.js)
```

The interface intentionally avoids explicitly revealing the birthday context before access is granted.

---

### 3. Opening Experience

After opening the gift, the website transitions into the main scrapbook experience.

Includes:
- Full-screen opening section
- Personal background image
- Soft overlay
- Paper/card visual treatment
- Decorative scrapbook elements
- Handwritten notes
- Gentle animations
- Smooth transition from the access/opening experience into the main page

The opening experience is designed to feel like opening a physical scrapbook rather than navigating a standard website.

---

### 4. Local Background Music

The website uses locally hosted MP3 files instead of external music embeds.

The main birthday song starts when the gift is opened.

The opening track is `/music/birthday-song.mp3`, which starts when the gift is opened and loops until paused.

Features:
- Local MP3 playback
- Automatic looping of the opening track
- `MUSIC ON` / `MUSIC OFF` toggle button
- Single persistent `<audio>` element shared with the soundtrack section
- Fixed master volume (0.8), applied through fade-in / fade-out transitions
- Playback state synchronization between the toggle and the music player
- Audio fade transitions when changing tracks

Example music directory:

```text
public/
└── music/
    ├── birthday-song.mp3
    ├── song-1.mp3
    ├── song-2.mp3
    ├── song-3.mp3
    └── song-4.mp3
```

---

### 5. Little Soundtrack

The website includes a multi-track scrapbook-style music player rather than continuously playing a single song.

Each track contains:
- Track number
- Song title
- Local audio file
- Personal caption
- Vinyl-style visual representation

Supported interactions:
- Previous track
- Next track
- Play / pause
- Track selection
- Vinyl interaction
- Music fade-out
- Track switching
- Music fade-in
- Animated vinyl transition

When a new song is selected:
```text
Current song
↓
Fade out
↓
Stop current track
↓
Load new track
↓
Start new track
↓
Fade in
```

---

### 6. Typewriter Music Captions

Each song has its own personal caption.

The caption is displayed using a typewriter effect.

When the track changes:
```text
Old caption
↓
Cleared
↓
New caption starts typing
↓
Blinking cursor remains
```

This makes each song feel like it has its own personal message rather than being only a background soundtrack.

Example track configuration:

```js
{
  id: 1,
  title: "Another Birthday Song",
  file: "/music/song-1.mp3",
  caption: "May this song accompany you throughout this new chapter of your life, and may this year be filled with many beautiful moments, joy, and blessings. 🤍"
},
{
  id: 2,
  title: "Song 2",
  file: "/music/song-2.mp3",
  caption: "I'm giving this song to you, hoping that whenever you listen to it, you'll always be reminded of God's goodness and feel strengthened through every step of your journey."
},
{
  id: 3,
  title: "Song 3",
  file: "/music/song-3.mp3",
  caption: "Honestly, this was the first song I played when I started getting closer to you… hehehe. I guess the song was already telling the story before I even realized it. :)"
},
{
  id: 4,
  title: "Song 4",
  file: "/music/song-4.mp3",
  caption: "The title says it all… because somehow, “Perfect” reminds me of you. Wkwkwk, a little cheesy, but I mean it. 🤍"
},
```

---

### 7. Vinyl Record Interface

The music section uses a scrapbook-inspired vinyl record interface.

Visual elements include:
- Vinyl grooves
- Center label
- Track number
- Track title
- Heart decoration
- Vinyl center hole
- Vinyl shadow
- Playing / paused state
- Rotation animation
- Track-change transition

The vinyl can also be clicked directly to toggle playback.

---

### 8. Photo Scrapbook

The website contains a collection of personal photographs displayed as scrapbook cards.

Features:
- Multiple memory photos
- Individual captions
- Hand-set scrapbook-style rotation (a fixed `--rotation` value per photo)
- Paper-card appearance
- Decorative tape
- Responsive layout
- Mobile two-column presentation
- Desktop collage presentation

Captions automatically wrap onto additional lines on smaller screens so longer captions remain fully visible.

Example:
```text
photo-01.webp
photo-02.webp
...
photo-10.webp
```

---

### 9. Responsive Photo Captions

The photo cards are optimized for mobile screens.

Caption behavior includes:
- Automatic text wrapping
- No fixed caption height
- No forced single-line text
- No text clipping
- Responsive font size
- Responsive line height
- Full caption visibility

This prevents longer scrapbook captions from being cut off on smartphones.

---

### 10. "Our Gallery" Photo Section

A dedicated section (labeled *Our Gallery* / *PORTRAITS OF US*) focuses on photographs of the two of you.

Features:
- Personal photo collage
- Individual captions
- Scrapbook styling
- Floating decorative elements
- Responsive desktop/mobile layout
- Dedicated video section embedded below the gallery

Assets are read from the `herPhotos` array in `App.jsx`:

```text
public/images/her/
├── her-01.webp
├── her-02.webp
├── ...
└── her-09.webp
```

> The gallery currently renders `her-01.webp` → `her-07.webp`. Extra files (`her-08.webp`, `her-09.webp`) already exist in the folder and can be added to the `herPhotos` array.

---

### 11. Personal Video

The website contains a dedicated personal video section.

Supported behavior:
- Native HTML5 video controls
- Mobile-friendly playback
- Poster image
- Local MP4 source
- Automatic music coordination

Example (as used in `App.jsx`):
```text
public/videos/
├── photo-14.mp4   ← rendered inside the gallery section
├── photo-15.mp4
└── photo-16.mp4
```

The rendered `<video>` uses `poster="/images/background-vid.webp"` and `playsInline` for mobile compatibility.

---

### 12. Smart Video / Background Music Synchronization

The website coordinates video playback with the background music.

Behavior:
#### If music is playing

```text
Music playing
↓
Video starts
↓
Music pauses
↓
Video pauses or finishes
↓
Music resumes
```

#### If music was already OFF

```text
Music OFF
↓
Video starts
↓
Music remains OFF
↓
Video finishes
↓
Music remains OFF
```

The system tracks whether music was playing before the video started, preventing unwanted music playback.

---

### 13. Bible Verse Section

A dedicated blessing section (section `02`) contains:

> "Bagi Dialah, yang dapat melakukan jauh lebih banyak dari pada yang kita doakan atau pikirkan, seperti yang ternyata dari kuasa yang bekerja di dalam kita"

**Efesus 3:20**

The section uses a paper/card visual treatment consistent with the scrapbook design.

---

### 14. A Letter For You

The website includes a personal letter section (section `05`) presented as a paper card with tape, stamp, and handwritten styling.

Features:
- Long-form personal letter
- Paper card, tape, and stamp decorations
- Handwritten-style typography
- Signature line ("—— 来自你最爱的人，朱有贤")
- Static, neatly typeset layout

> Note: the typewriter effect is used only for the music captions (see section 6), not for the letter text.

---

### 15. Personal Letter / Reply

The recipient can write a response directly from the website.

The reply form includes:
- Textarea input
- Character limit (max 10000 characters)
- Send button
- Sending state
- Success state
- Error state

Messages are stored remotely using Supabase (table `letter_replies`). If Supabase is not configured, the form shows a setup hint instead of sending.

---

### 16. Supabase Integration

The project uses Supabase for storing letter replies.

Database table:
```text
letter_replies
```

Fields:
```text
id
message
created_at
```

The birthday website uses the public `anon` client for inserting replies.

Required environment variables:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The `.env` file should never be committed if it contains sensitive project configuration.

---

### 17. Reviewing Submitted Replies

This website only *writes* replies into Supabase (`letter_replies`). There is no reply viewer bundled inside this repository.

To read the submitted messages:
- Open the `letter_replies` table directly in the Supabase dashboard, or
- Connect a separate, private tool to the same Supabase project.

> Keep any viewer separate from this public gift website, since reviewing replies serves an administrative/personal purpose rather than being part of the recipient-facing experience.

---

### 18. Final Reveal

The website contains a final reveal section with a stronger celebratory animation.

Features:
- Final message
- Confetti animation
- Smooth navigation to the final section
- Closing scrapbook-style presentation

The final reveal acts as the ending of the interactive experience.

---

### 19. Confetti Effects

Confetti is used selectively rather than continuously.

Current triggers include:
- Successful access-code entry
- Final reveal

This keeps the effect meaningful and avoids making the website visually overwhelming.

---

### 20. Mobile-First Responsive Design

The website is designed primarily for smartphone viewing.

Responsive considerations include:
- Two-column photo layouts
- Wrapping captions
- Responsive typography
- Touch-friendly controls
- Responsive music player
- Video playback using `playsInline`
- Adaptive scrapbook cards
- Reduced spacing on smaller screens

Desktop layouts are also supported with larger collage arrangements and wider content areas.

---

### 21. Vercel Web Analytics

The site includes Vercel Web Analytics through `@vercel/analytics/react`:

```jsx
import { Analytics } from "@vercel/analytics/react";
// ...
<Analytics />
```

The `<Analytics />` component is rendered at the root level and reports anonymous page views when the site is deployed on Vercel. It is optional and can be removed if analytics are not desired.

---

## Technology Stack

### Frontend
- React
- Vite
- JavaScript / JSX
- Vanilla CSS

### Libraries / Services
- `canvas-confetti`
- `@supabase/supabase-js`
- `@vercel/analytics`
- Supabase
- Vercel Web Analytics

### Fonts
- Caveat
- Cormorant Garamond
- DM Sans

### Development Environment
- Node.js `20.x` (declared in `package.json` → `engines.node`)
- npm

---

## Project Structure

```text
birthday-wy/
├── public/
│   ├── images/
│   │   ├── photo-01.webp
│   │   ├── photo-02.webp
│   │   ├── ...
│   │   ├── photo-10.webp
│   │   ├── photo-wen.webp
│   │   ├── background.webp
│   │   ├── background-vid.webp
│   │   └── her/
│   │       ├── her-01.webp
│   │       ├── ...
│   │       └── her-09.webp
│   ├── music/
│   │   ├── birthday-song.mp3
│   │   ├── song-1.mp3
│   │   ├── song-2.mp3
│   │   ├── song-3.mp3
│   │   └── song-4.mp3
│   └── videos/
│       ├── photo-14.mp4
│       ├── photo-15.mp4
│       └── photo-16.mp4
├── src/
│   ├── App.jsx            (main page: photos, gallery, letter, reply + video logic)
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   ├── SecretGate.jsx     (layered riddle gate + time lock)
│   ├── SecretGate.css
│   ├── secretGateConfig.js (passkeys, target date, locked-page copy)
│   ├── MusicSection.jsx   (soundtrack, vinyl UI, typewriter captions)
│   ├── MusicSection.css
│   └── lib/
│       └── supabase.js
├── index.html
├── vite.config.js
├── package.json
├── package-lock.json
├── .env                   (git-ignored)
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Elsenwuiri/birthday-wy.git
cd birthday-wy
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Adding or Replacing Songs

Place MP3 files inside:

```text
public/music/
```

Then update the `tracks` array in `MusicSection.jsx`.

Example:

```js
const tracks = [
  {
    id: 1,
    title: "Another Birthday Song",
    file: "/music/song-1.mp3",
    caption: "May this song accompany you throughout this new chapter of your life, and may this year be filled with many beautiful moments, joy, and blessings. 🤍"
  },
  {
    id: 2,
    title: "Song 2",
    file: "/music/song-2.mp3",
    caption: "I'm giving this song to you, hoping that whenever you listen to it, you'll always be reminded of God's goodness and feel strengthened through every step of your journey."
  },
  {
    id: 3,
    title: "Song 3",
    file: "/music/song-3.mp3",
    caption: "Honestly, this was the first song I played when I started getting closer to you… hehehe. I guess the song was already telling the story before I even realized it. :)"
  },
  {
    id: 4,
    title: "Song 4",
    file: "/music/song-4.mp3",
    caption: "The title says it all… because somehow, “Perfect” reminds me of you. Wkwkwk, a little cheesy, but I mean it. 🤍"
  },
];
```

The file path must exactly match the filename, including spaces and capitalization.

---

## Adding or Replacing Photos, Gallery Photos, and Video

The scrapbook content is defined directly inside `src/App.jsx`.

### Scrapbook photos (section 03)

Edit the `photos` array (each item needs `src`, `caption`, and `rotation`):

```js
const photos = [
    { src: "/images/photo-01.webp", caption: "lagi mejem mbak:)", rotation: "2deg" },
    // ...
];
```

### Gallery photos (section 04)

Edit the `herPhotos` array. The files must exist in `public/images/her/`:

```js
const herPhotos = [
    { src: "/images/her/her-01.webp", caption: "可爱, 呵呵呵", rotation: "-2deg" },
    // ...
];
```

### Video (section 04)

Replace the `<source>` inside the `<video>` element and update `poster` if needed:

```jsx
<video poster="/images/background-vid.webp" playsInline>
    <source src="/videos/photo-14.mp4" type="video/mp4" />
</video>
```

---

## Configuration Reference

Key constants that control the experience:

```js
// src/secretGateConfig.js
export const SECRET_GATE_CONFIG = {
    firstPasskey: "772452",
    secondPasskey: "123456",
    targetDate: "2026-10-24T00:00:00", // visitor's local time
    lockedMessage: {
        title: "ACCESS LOCKED",
        message: "udahh buka riddle tapi belom waktunyaa, wkwkwkwk",
        subtitle: "Sabar sedikit lagi...",
    },
};

// src/App.jsx
const AUTH_KEY = "birthday_site_access";
const AUTH_DURATION = 10 * 60 * 1000; // 10 minutes

// src/App.jsx (opening track)
audio.src = "/music/birthday-song.mp3";
```

Change these values to retarget the countdown, change either passkey, rewrite the locked-page copy, or adjust how long an unlocked session lasts.

---

## Design System

The visual identity uses a muted scrapbook palette:

```css
--cream: #F7EFE7;
--paper: #FFFAF3;
--paper-dark: #EEE0D4;
--red: #9E4F55;
--red-dark: #71383D;
--red-soft: #C98284;
--brown: #4A3737;
--muted: #806D6D;
--line: rgba(113, 56, 61, 0.2);
```

The design intentionally avoids extremely saturated red or high-contrast colors to maintain a soft, intimate appearance.

---

## Deployment

The main website is designed to be deployed with Vercel.

Typical deployment flow:

```text
GitHub
↓
Vercel
↓
Production Website
```

Environment variables required by the production deployment:
```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

---

## Important Notes

### Client-Side Access Code

The access code is not a secure authentication mechanism.

Because this is a client-side React application, the access code can potentially be discovered from the built JavaScript bundle.

It is appropriate for:
- Personal gifts
- Surprise pages
- Casual access restriction

It is not appropriate for:
- Sensitive information
- Private authentication
- Confidential data
- Security-critical applications

### Local Media

Large video and audio files can significantly increase deployment size and loading time.

For production optimization, consider:
- Compressing MP4 files
- Compressing WebP images
- Keeping image dimensions appropriate for their display size
- Using reasonable MP3 bitrates
- Lazy-loading media where appropriate

---

## Project Goal

This project is intentionally more than a birthday greeting.

The goal is to create a small interactive experience where:
- photographs become memories,
- songs become personal messages,
- videos become moments,
- the letter becomes an interaction,
- and the final page becomes a celebration.

The website is designed as a digital scrapbook made specifically for one person.

---

## Status

**Project:** Birthday Gift Website  
**Status:** Active development  
**Target Date:** 24 October 2026  
**Frontend:** React + Vite  
**Deployment:** Vercel  
**Database:** Supabase