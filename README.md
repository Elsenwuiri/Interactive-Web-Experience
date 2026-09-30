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

### 1. Secret Access Gate

The website starts with a mysterious access screen instead of immediately revealing the birthday content.

Features:

- Password-protected access gate
- Countdown to the target date
- Restricted-access visual presentation
- Correct-password success state
- Confetti effect after successful access
- Temporary access persistence using `localStorage`
- Access expires after 10 minutes

> The access gate is intended as a surprise mechanism, not as real security. The password is stored in the client-side application and can therefore be inspected by users with technical access to the deployed JavaScript bundle.

---

### 2. Birthday Countdown

The opening gate contains a live countdown with:

- Days
- Hours
- Minutes
- Seconds

The countdown is tied to:

```text
24 October 2026
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

Features:

- Local MP3 playback
- Automatic looping
- Music ON/OFF control
- Persistent single audio controller
- Volume control
- Playback state synchronization
- Audio fade transitions when changing tracks

Example music directory:

```text
public/
└── music/
    ├── Birthday Song.mp3
    ├── Song 2.mp3
    ├── Song 3.mp3
    └── Song 4.mp3
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
  title: "Birthday Song",
  file: "/music/Birthday Song.mp3",
  caption: "A little song for your birthday..."
}
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
- Slightly randomized scrapbook-style rotation
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

### 10. "Just You" Photo Section

A dedicated section focuses on photographs of the recipient.

Features:

- Personal photo collage
- Individual captions
- Scrapbook styling
- Decorative elements
- Responsive desktop/mobile layout
- Dedicated video section

Example assets:

```text
her-01.webp
her-02.webp
her-03.webp
her-04.webp
her-05.webp
her-06.webp
her-07.webp
```

---

### 11. Personal Video

The website contains a dedicated personal video section.

Supported behavior:

- Native HTML5 video controls
- Mobile-friendly playback
- Poster image
- Local MP4 source
- Automatic music coordination

Example:

```text
public/videos/
├── birthday-video.mp4
└── her-video.mp4
```

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

A dedicated blessing section contains:

> TUHAN memberkati engkau  
> dan melindungi engkau.

**Bilangan 6:24**

The section uses a paper/card visual treatment consistent with the scrapbook design.

---

### 14. "A Letter That Writes Itself"

The website includes an interactive letter section using a typewriter animation.

Features:

- Text appears progressively
- Intersection Observer triggers the animation when the section enters the viewport
- Animated typing cursor
- Signature reveal
- Ending message
- Handwritten-style visual presentation

The effect is intended to make the letter feel like it is being written while the recipient is reading it.

---

### 15. Personal Letter / Reply

The recipient can write a response directly from the website.

The reply form includes:

- Textarea input
- Character limit
- Send button
- Sending state
- Success state
- Error state

Messages are stored remotely using Supabase.

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

A separate viewer project can retrieve the submitted replies.

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The `.env` file should never be committed if it contains sensitive project configuration.

---

### 17. Separate Reply Viewer

A separate React/Vite application is used to view submitted birthday replies.

Purpose:

- Keep the reply viewer separate from the gift website
- Retrieve messages from the same Supabase database
- Provide a simple interface for reviewing responses

The viewer is intentionally minimal because it serves an administrative/personal purpose rather than being part of the recipient-facing experience.

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

- Successful password entry
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

## Technology Stack

### Frontend

- React
- Vite
- JavaScript / JSX
- Vanilla CSS

### Libraries / Services

- `canvas-confetti`
- `@supabase/supabase-js`
- Supabase
- Vercel

### Fonts

The design uses a combination of:

- Caveat
- Cormorant Garamond
- DM Sans

### Development Environment

Recommended:

- Node.js 24+
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
│   │   ├── background.webp
│   │   ├── her-01.webp
│   │   ├── ...
│   │   └── her-07.webp
│   │
│   ├── music/
│   │   ├── Birthday Song.mp3
│   │   ├── Song 2.mp3
│   │   ├── Song 3.mp3
│   │   └── Song 4.mp3
│   │
│   └── videos/
│       ├── birthday-video.mp4
│       └── her-video.mp4
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── SecretGate.jsx
│   ├── SecretGate.css
│   ├── LetterWriting.jsx
│   ├── LetterWriting.css
│   ├── MusicSection.jsx
│   ├── MusicSection.css
│   ├── index.css
│   ├── main.jsx
│   └── lib/
│       └── supabase.js
│
├── .env
├── package.json
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Elsenwuiri/wen-birthday.git
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
    title: "Birthday Song",
    file: "/music/Birthday Song.mp3",
    caption: "A little song for your birthday..."
  },
  {
    id: 2,
    title: "Song 2",
    file: "/music/Song 2.mp3",
    caption: "A song for a special memory..."
  }
];
```

The file path must exactly match the filename, including spaces and capitalization.

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

### Client-Side Password

The access password is not a secure authentication mechanism.

Because this is a client-side React application, the password can potentially be discovered from the built JavaScript bundle.

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
