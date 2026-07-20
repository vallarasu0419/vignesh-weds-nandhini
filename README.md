# 💌 Animated Wedding Invitation — React + Vite

A fully animated wedding invitation website: a sealed envelope opens on click,
ornate doors swing apart, and the invitation is revealed — followed by couple
info, story timeline, events, countdown, gallery, venue map, RSVP, and guest
wishes.

## Quick Start

```bash
npm install
npm run dev      # open the printed localhost URL
npm run build    # production build (dist/)
```

## Customize Everything (2 files only)

1. **`src/data/weddingData.js`** — ALL text content: names, date, venue,
   quotes, story milestones, events, gallery images, music track, footer note.
2. **`src/styles/global.css`** — the `:root` block at the top holds every
   color (gold / blush pink / florals), font, spacing, and shadow variable.
   Change a variable once and the whole site updates.

### Add real photos
Put images in `public/images/` and edit the `gallery` array in
`weddingData.js`, e.g. `{ id: "g1", src: "/images/us.jpg", alt: "At the beach", tone: "" }`.

### Add the live map
Google Maps → Share → *Embed a map* → copy the `src` URL into
`venue.mapEmbedUrl` in `weddingData.js`.

### Add background music
Drop an mp3 into `public/music/` and set `musicSrc: "/music/theme.mp3"`.

## Structure

```
src/
├── styles/global.css       # theme variables + all styles
├── data/weddingData.js     # all content (edit me!)
├── hooks/useCountdown.js
├── components/
│   ├── common/    Button, SectionTitle, Divider, FloralCorner, MusicToggle
│   ├── landing/   Envelope, DoorReveal
│   ├── sections/  Hero, CoupleInfo, LoveQuote, OurStory, EventTimeline,
│   │              Countdown, Gallery, VenueMap, RSVPForm, GuestWishes
│   └── layout/    Navbar, Footer
├── App.jsx                 # landing flow state (envelope → doors → site)
└── main.jsx
```

## Notes
- Built with React 18, Vite, Framer Motion, PropTypes.
- RSVP is front-end only; connect it to a backend (Firebase, Google Forms,
  etc.) to store responses.
- Guest Wishes is backed by a shared Upstash Redis store via the `/api/wishes`
  serverless functions in `api/`. Locally it uses `server/index.js` instead
  (`npm run server`, proxied by Vite). On Vercel, add the Upstash Redis
  integration (Storage → Marketplace) to your project so the
  `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` env vars are set, then
  redeploy.
- Respects `prefers-reduced-motion` and is responsive down to mobile.
