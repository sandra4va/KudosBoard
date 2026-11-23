# KudosBoard — Real-Time Collaborative Celebration & Appreciation Wall

> Built for Google Antigravity based on the Full-Stack Architecture & Real-Time Implementation Plan.

KudosBoard replaces physical group greeting cards and office farewell books with a live, interactive, real-time digital bulletin board. It bridges frictionless guest participation with strict authenticated creator data ownership.

---

## 🌟 Key Features

### 1. Hybrid Security & Access Model
* **Creator-Only Database Management & Ownership:**
  * Only authenticated **Board Creators** can create new celebration boards, update board metadata (title, subtitle, visual theme), toggle submission lock (`is_locked`), moderate/delete inappropriate posts or replies, or permanently delete boards.
  * Security rules and Row-Level Security (RLS) policies prevent guest tampering with board settings or other users' contributions.
* **Frictionless No-Login Guest Participation:**
  * Guests visit a single shareable link (`#/board/:slug`) with **zero login friction**.
  * Immediate sticky-note composition: guest name or anonymous toggle, rich message textarea, inspiration prompt generator, 6 pastel sticky-note colors, 10 corner accent emojis, and animated stickers or photo attachments.
* **Instant Real-Time Live Sync (< 150ms):**
  * Powered by `BroadcastChannel` and storage event synchronization across multiple browser windows and tabs, plus Supabase Realtime WebSocket adapters.
  * Real-time live presence counter (`🟢 5 people viewing & signing live`).

### 2. 5 Distinct Visual Themes
Each theme dynamically adjusts Google Fonts, background textures, card treatments, and headers:
1. **Classic Corkboard (`corkboard`):**
   * Font: `Caveat` (Handwritten)
   * Warm cork pinboard pattern (`#b88351`) + 3D pushpins
   * Alternating card tilts (`-1deg` / `+1deg`), soft drop shadows, paper curls
2. **Birthday Bash (`birthday`):**
   * Font: `Fredoka` (Rounded Playful)
   * Pastel confetti gradient (`#fff1f5` → `#fef9c3` → `#e0f2fe`)
   * Rounded `22px` cards, crisp white borders, buoyant lift, confetti bursts
3. **Work Milestone (`milestone`):**
   * Font: `Playfair Display` (Editorial Serif)
   * Deep midnight navy radial (`#0b1120`) with prestige gold accents (`#fbbf24`)
   * Sleek 16px cards with gold hairline borders
4. **Farewell & Good Luck (`farewell`):**
   * Font: `Lora` (Warm Serif)
   * Sunset amber peach gradient (`#ffedd5` → `#fecdd3`)
   * Warm editorial cards with terracotta shadows
5. **Classroom / Teacher Appreciation (`classroom`):**
   * Font: `Patrick Hand` (Chalk/Marker)
   * Deep chalkboard green (`#183327`) with subtle grid lines
   * Notebook-style cards with red top-margin line

### 3. 3 Viewing Layouts
1. **Masonry Corkboard Grid:** Responsive multi-column layout (`columns-1 sm:columns-2 lg:columns-3`) where cards of varying lengths and photo heights interlock organically.
2. **Chronological Timeline View:** Centered vertical spine with emoji milestone nodes, chronological ordering, and clear timestamps.
3. **Full-Screen Slideshow Presentation Mode:**
   * Full-screen dark theater overlay (`z-50`) built for Zoom/Google Meet screen sharing or office TVs.
   * Large readable typography, side-by-side photo layout, keyboard `←` / `→` / `Esc` navigation.
   * **4.5s Auto-Play toggle** with progress countdown bar.
   * **Confetti burst trigger** (`canvas-confetti`).

### 4. High-Res Keepsake Exports
1. **High-Res JPG Snapshot:** Captures the board at 2x Retina DPI via `html2canvas`, stripping all `.no-print` UI chrome (navbars, reaction drawers, delete buttons, action chips), saving `{slug}-keepsake.jpg`.
2. **Multi-Page PDF Celebration Book:** Formats the board into clean, printable A4 pages with cover page, cards, timestamps, and metadata using `jsPDF`.
3. **Print-Ready Keepsake Layout:** Dedicated `@media print` stylesheet with clean white background, crisp borders, 2-column layout, `break-inside: avoid`, and keepsake headers/footers.

---

## 📁 Directory Structure

```text
kudosboard/
├── index.html                           # Complete, rich React 18 SPA (Tailwind, Lucide, Confetti, html2canvas, jsPDF)
├── server.ps1                           # Pure TCP local HTTP server (.NET Sockets)
├── start-server.bat                     # 1-click batch launcher for local server
├── setup-git.bat                        # 1-click GitHub initialization script
├── Dockerfile                           # Production container image using Caddy
├── Caddyfile                            # SPA routing & compression configuration
├── railway.json                         # Railway deployment specification
├── package.json                         # Fallback build & start script
├── config.js                            # Optional static Supabase configuration
├── .env.example                         # Environment variables template
├── .gitignore                           # Git ignore rules
├── README.md                            # Comprehensive documentation & implementation guide
├── supabase/
│   └── migrations/
│       └── 001_init_kudos_schema.sql    # Complete PostgreSQL schema, RLS policies, Realtime publication & RPCs
└── src/
    ├── types/
    │   └── database.ts                  # TypeScript interfaces for Boards, Posts, Reactions, Replies
    └── lib/
        ├── themes.js                    # Theme definitions, color palettes, stickers & inspiration prompts
        ├── storage.js                   # Hybrid access control, Realtime Broadcast bus, local persistence
        ├── export.js                    # JPG, PDF & Print export utilities
        └── supabase/
            └── client.ts                # Remote Supabase connection adapter
```

---

## 🚀 Step 1: Push to GitHub

1. If Git is installed on your computer, run:
   ```cmd
   setup-git.bat
   ```
   Or execute manually in the `kudosboard` folder:
   ```cmd
   git init
   git branch -M main
   git add .
   git commit -m "feat: complete KudosBoard full-stack collaborative celebration wall"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Push your code:
   ```cmd
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

*(Note: If you don't have Git installed yet, install it quickly via `winget install --id Git.Git -e --source winget` or download from [git-scm.com](https://git-scm.com/download/win)).*

---

## ⚡ Step 2: Connect to Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. In the left sidebar, click **SQL Editor** -> **New query**.
3. Open `supabase/migrations/001_init_kudos_schema.sql` from this project, copy all its contents, paste them into the SQL editor, and click **Run**.
4. In your Supabase Dashboard, go to **Project Settings** -> **API**:
   * Copy the **Project URL** (`https://<project-ref>.supabase.co`)
   * Copy the **Project API keys -> `anon` public key** (`eyJ...`)
5. In KudosBoard:
   * Click the **⚡ Connect Supabase** button in the top navigation bar.
   * Paste your **Project URL** and **Anon Key**, then click **Test & Connect**.
   * Status will change to **Connected to Supabase PostgreSQL**, enabling live database persistence and WebSockets sync across devices!

---

## 🚂 Step 3: Publish on Railway

1. Log in to [Railway](https://railway.app).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select the `kudosboard` repository you pushed in Step 1.
4. Railway automatically detects `railway.json`, `Dockerfile`, and `Caddyfile`:
   * It builds the high-performance Caddy container.
   * It automatically maps Railway's dynamic `$PORT`.
5. Once deployed, click on your service in Railway:
   * Go to **Settings** → **Networking** → **Generate Domain** (e.g. `https://kudosboard-production.up.railway.app`).
   * Optionally set environment variables in Railway's **Variables** tab (`SUPABASE_URL` and `SUPABASE_ANON_KEY`).
6. Your KudosBoard is now live and accessible globally!
