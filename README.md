# Birthday Gift Website — Interactive Digital Scrapbook

An interactive digital birthday gift website designed as a nostalgic scrapbook experience. This project combines photography, music, videos, handwritten-style typography, animations, and personal messages into a single mobile-first experience.

---

## About the Project

This project is a personalized interactive birthday gift website designed to deliver more than just a simple birthday greeting. Visitors go through multiple layers of experiences before reaching the main content, including unlocking a digital memory book filled with photos, music, videos, and a personal letter.

**Project Type:** Personal Interactive Gift Website  
**Design Concept:** Scrapbook / Nostalgic / Elegant / Soft Pink  
**Primary Platform:** Mobile-first, with responsive desktop support  
**Technology:** React + Vite  
**Deployment:** Vercel  
**Database:** Supabase

---

## Key Features

### 1. Layered Secret Gate

The website begins with a puzzle-based access system before allowing visitors to explore the main content. It consists of two puzzle layers and a time-based lock, following this sequence:

```text
RIDDLE 01 → KEY 01 → TIME LOCK → TARGET DATE → RIDDLE 02 → KEY 02 → ACCESS GRANTED
```

**Feature Details:**

- Riddle 01 is available before the target date. Its six-digit access code is entered through three separate two-digit input fields.
- If Riddle 01 is solved before the target time, visitors will only see the `ACCESS LOCKED` screen with a live countdown.
- The time lock follows the visitor's local time.
- After midnight, Riddle 01 automatically disappears and Riddle 02 becomes the only active puzzle, without requiring a page reload.
- A short notification introduces Riddle 02 when it becomes available for the first time.
- Late visitors will see `SECOND CLUE LOCKED` and can revisit Riddle 01.
- Successful code verification displays a checkmark (`✓`).
- The verification sequence follows `VERIFYING... → ACCESS GRANTED`.
- A confetti animation plays after successful access.
- Temporary access is stored using `localStorage`.
- Access automatically expires after 10 minutes.

The website can only be unlocked when all three conditions are satisfied:

```js
const canAccessWebsite = riddle1Solved && riddle2Solved && isTargetDateReached;
```

Puzzle progress is stored permanently and separately from the temporary 10-minute viewing session:

```js
localStorage.getItem("riddle1Solved"); // "true" after solving Riddle 01
localStorage.getItem("riddle2Solved"); // "true" after solving Riddle 02
```

All secret gate values are managed in `src/secretGateConfig.js`. Access codes are never displayed in the user interface.

> **Security Note:** This gate is intended for puzzle-based interactions and surprise experiences, not as an actual security mechanism. Since this is a client-side React application, access keys can be extracted from the deployed JavaScript bundle. It is suitable for personal gifts and casual access restrictions, but not for sensitive information or secure authentication.

---

### 2. Birthday Countdown

The initial access screen features a live countdown consisting of:

- Days
- Hours
- Minutes
- Seconds

The countdown is connected to the target date configured in `src/secretGateConfig.js`.

The interface intentionally avoids explicitly revealing the birthday context before access is granted.

---

### 3. Opening Experience

After successfully unlocking the secret gate, the website transitions into a full-screen scrapbook experience.

This experience includes:

- Full-screen presentation.
- Smooth transitions between sections.
- Responsive layouts for mobile and desktop devices.

---

### 4. Photo Gallery

The gallery displays a collection of photographs with rotation effects and scrapbook-inspired styling.

**How to Customize Photos:**

Edit the `photos` array in `src/App.jsx`:

```jsx
const photos = [
    {
        src: "/images/her/photo-1.jpg",
        caption: "Photo caption",
        rotation: "2deg",
    },
    // Add more photos here
];
```

- `src`: Image file path. Store images in `public/images/her/`.
- `caption`: Text displayed below each photograph.
- `rotation`: Rotation angle for the scrapbook effect (e.g., `2deg`, `-1deg`, `3deg`).

---

### 5. Video Section

The video section plays videos in a full-screen viewing mode with playback controls.

**How to Customize Videos:**

Edit the `<video>` element in `src/App.jsx`:

```jsx
<video poster="/images/background-vid.webp" playsInline>
    <source src="/videos/video-1.mp4" type="video/mp4" />
    Your browser does not support the video element.
</video>
```

- Store video files in `public/videos/`.
- `poster`: Preview image displayed before the video starts playing.
- `src`: Path to the video file.

---

### 6. Letter Section

The letter section presents a personal message in a letter-inspired layout, featuring layered paper elements, decorative seals, and floral details.

**How to Customize the Letter:**

Edit the letter content in the `<section className="letter section">` section of `src/App.jsx`:

```jsx
<h2>Dear (Recipient's Name),</h2>
<div className="letter-content">
    <p>Write your personal message here.</p>
</div>
<p className="letter-placeholder">
    From,
    Your Name
</p>
```

Replace the placeholder text with your personal message.

---

### 7. Music Section

The music section provides an integrated music player featuring multiple tracks, typewriter-style captions, and playback controls.

**How to Customize Music:**

Edit the `tracks` array in `src/MusicSection.jsx`:

```jsx
const tracks = [
    {
        id: 1,
        title: "Song Title",
        file: "/music/song-1.mp3",
        caption: "Your song caption goes here",
    },
    // Add more tracks here
];
```

- Store audio files in `public/music/`.
- `file`: Path to the audio file (MP3).
- `caption`: Text displayed using the typewriter effect.
- `title`: Song title displayed in the music player.

---

## Project Structure

```text
birthday-wy/
├── public/                     # Static assets (images, music, videos)
│   ├── images/
│   │   └── her/                 # Gallery photographs
│   ├── music/                   # Audio files (.mp3)
│   └── videos/                  # Video files (.mp4)
├── src/                         # React application source code
│   ├── lib/
│   │   └── supabase.js          # Supabase client configuration
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Main application styles
│   ├── index.css                # Global styles
│   ├── main.jsx                 # Application entry point
│   ├── MusicSection.jsx         # Music player component
│   ├── MusicSection.css         # Music player styles
│   ├── SecretGate.jsx           # Secret gate and puzzle component
│   ├── SecretGate.css           # Secret gate styles
│   └── secretGateConfig.js      # Secret gate configuration
├── .env                         # Environment variables (not committed)
├── .gitignore                   # Git ignore configuration
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and npm scripts
├── vite.config.js               # Vite configuration
└── README.md                    # Project documentation
```

---

## Installation and Setup

### Prerequisites

Make sure the following tools are installed:

- [Node.js](https://nodejs.org/) (version 24.x recommended).
- [npm](https://www.npmjs.com/) (usually included with Node.js).

### Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/Elsenwuiri/Interactive-Web-Experience.git
cd birthday-wy
```

Alternatively, open the existing project directory if you already have the repository locally.

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root directory with the following variables. Replace the placeholder values with your actual configuration:

```env
VITE_SUPABASE_URL=https://project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_FIRST_PASSKEY=your-first-passkey
VITE_SECOND_PASSKEY=your-second-passkey
VITE_MASTERKEY=your-masterkey
VITE_SECRET_PARTS=12,34,56
```

> **Important:** Never commit your `.env` file to Git. Make sure it is included in `.gitignore`.

**4. Start the development server**

```bash
npm run dev
```

The website will be available at:

```text
http://localhost:5173
```

Vite may use a different port if the default port is already occupied. Check the terminal output for the actual URL.

**5. Build for production**

```bash
npm run build
```

The production build will be generated in the `dist/` directory.

**6. Preview the production build**

```bash
npm run preview
```

---

## Configuration

### Secret Gate Configuration

The primary configuration file is located at `src/secretGateConfig.js`:

```js
export const ENABLE_SECRET_GATE = false; // Set to true to enable the secret gate

export const SECRET_GATE_CONFIG = {
    firstPasskey: import.meta.env.VITE_FIRST_PASSKEY,
    secondPasskey: import.meta.env.VITE_SECOND_PASSKEY,
    targetDate: "YYYY-MM-DDT00:00:00", // Visitor's local time
    lockedMessage: {
        title: "ACCESS LOCKED",
        message: "Your locked access message",
        subtitle: "Your reminder subtitle",
    },
};
```

### Additional Configuration

Other settings are available in `src/App.jsx`:

```js
const AUTH_KEY = "birthday_site_access";
const AUTH_DURATION = 10 * 60 * 1000; // 10 minutes
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |
| `VITE_FIRST_PASSKEY` | First puzzle access code | `123456` |
| `VITE_SECOND_PASSKEY` | Second puzzle access code | `123456` |
| `VITE_MASTERKEY` | Master key for bypass access | `123456` |
| `VITE_SECRET_PARTS` | Secret key components | `123456` |

---

## Design System

The website uses a soft, nostalgic color palette inspired by vintage paper, handwritten letters, and scrapbook aesthetics.

```css
--cream: #F7EFE7;       /* Cream */
--paper: #FFFAF3;       /* Paper */
--paper-dark: #EEE0D4;  /* Dark paper */
--red: #9E4F55;         /* Red */
--red-dark: #71383D;    /* Dark red */
--red-soft: #C98284;    /* Soft red */
--brown: #4A3737;       /* Brown */
--muted: #806D6D;       /* Muted gray */
--line: rgba(113, 56, 61, 0.2); /* Divider line */
```

The design intentionally avoids overly vibrant colors and harsh contrasts to maintain a soft, elegant, and intimate atmosphere.

---

## Deployment

This project is designed to be deployed using **Vercel**.

### Deployment Workflow

```text
GitHub
   ↓
Vercel
   ↓
Production Website
```

### Production Environment Variables

Add the following environment variables in your Vercel project settings:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_FIRST_PASSKEY
VITE_SECOND_PASSKEY
VITE_MASTERKEY
VITE_SECRET_PARTS
```

Make sure all required environment variables are configured before deploying the application.

---

## Important Notes

### Client-Side Access Control

The secret gate is not a secure authentication mechanism. Since this project uses a client-side React architecture, access keys can potentially be extracted from the production JavaScript bundle.

**Suitable for:**

- Personal birthday gifts.
- Surprise experiences.
- Casual access restrictions.

**Not suitable for:**

- Sensitive information.
- Personal authentication.
- Confidential data.
- Security-critical applications.

### Local Media Assets

Large video and audio files may increase deployment size and negatively affect loading performance.

For production optimization, consider the following:

- Compress MP4 video files.
- Convert images to WebP format.
- Keep image dimensions appropriate for their display sizes.
- Use reasonable MP3 bitrates.
- Implement lazy loading for media assets when necessary.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | Frontend UI framework |
| Vite 7 | Build tool and development server |
| Supabase | Database and backend services |
| Vercel Analytics | Visitor analytics |
| canvas-confetti | Confetti animations |
| CSS | Styling and responsive layouts |

---

## Project Status

**Project:** Birthday Gift Website  
**Status:** Actively Under Development  
**Frontend:** React + Vite  
**Deployment:** Vercel  
**Database:** Supabase

---

## License

This project was created for personal use, portfolio purposes, and as a personalized digital birthday gift.# Interactive-Web-Experience
