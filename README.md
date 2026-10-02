# Bharath M G — 3D Interactive Ocean Portfolio

A 3D interactive personal portfolio website for **Bharath M G** featuring a serene **Calm Ocean** visual theme. Built with **Vite, Vanilla JavaScript, Three.js, GSAP ScrollTrigger, and plain CSS**.

---

## 🌊 Visual Theme: "Calm Ocean"

- **Palette**: Soft aqua (`#4ecdc4`), seafoam (`#72d6c9`), pale teal (`#2c8a9e`), sandy white (`#f7fcfa`), and peaceful oceanic deep blue (`#071c2b`). Avoids harsh pitch-black backgrounds and aggressive neon.
- **Atmosphere**: Gentle sunlight glints, low-amplitude water waves, volumetric light rays (god rays), drifting plankton, slow rising bubbles, a peaceful school of fish, a translucent pulsing jellyfish, and a gliding sea turtle.
- **Depth Transitions**: Scrolling moves the camera smoothly downwards from surface to seabed, shifting the ambient lighting and fog density:
  - `SURFACE // 0 m` (Sunlit Aqua & Hero)
  - `SHALLOWS // 10 m` (Teal & Skills)
  - `REEF // 30 m` (Tranquil Blue & Interactive 3D Project Orbs)
  - `DEEP // 60 m` (Oceanic Deep Blue, Pulsing Jellyfish & Milestones)
  - `SEABED // 100 m` (Tranquil Seabed & Contact)
- **Glassmorphism**: Translucent frosted cards with soft blur, subtle borders, and accessible high-contrast typography.
- **Procedural Ocean Audio**: Built-in ambient ocean surf synthesized entirely via the **Web Audio API** (filtered pink/brown noise and LFO wave swell modulation; zero external audio files). Default is OFF with a toggle button.

---

## 🛠️ Tech Stack

- **Bundler & Dev Server**: Vite (Vanilla JS, zero framework overhead)
- **3D Graphics**: Three.js (WebGL with procedural geometry, custom lighting, raycasting)
- **Animation & Scroll Choreography**: GSAP + ScrollTrigger
- **Styling**: Modern Plain CSS with Glassmorphism, CSS Custom Properties, and responsive flex/grid layouts
- **Audio**: Web Audio API (procedural ocean synthesis)
- **Modal**: Accessible HTML5 `<dialog>` with keyboard trapping and focus restoration
- **Data Architecture**: Single source of truth in `src/data/portfolioData.js`

---

## 🚀 Local Development

To run the project locally on your machine:

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev

# 3. Build for production (outputs to ./dist)
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## 🚢 Deploying to Vercel (Zero Config)

This project is pre-configured to deploy directly to **Vercel** with zero extra configuration:

### Method 1: Deploy via Vercel Web Dashboard (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of 3D Ocean Portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** > **"Project"**.
   - Select your GitHub repository from the list.

3. **Configure Project Settings**:
   - **Framework Preset**: `Vite` (Vercel automatically detects this).
   - **Root Directory**: `./` (leave default).
   - **Build Command**: `npm run build` (detected automatically).
   - **Output Directory**: `dist` (detected automatically).
   - **Install Command**: `npm install` (detected automatically).

4. **Click "Deploy"**:
   - Vercel builds the site in seconds and gives you a live production URL (e.g. `https://bharath-portfolio.vercel.app`).
   - Every future `git push` to `main` will automatically trigger a new deployment.

---

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Run vercel deploy inside the project directory
vercel

# For production deployment
vercel --prod
```

---

## 📁 Project Structure

```
bharath-portfolio/
├── index.html                 # Semantic HTML5 markup, meta tags, and font imports
├── package.json               # Project manifest and scripts
├── public/
│   └── favicon.svg            # Calm ocean droplet & wave SVG favicon
├── src/
│   ├── data/
│   │   └── portfolioData.js   # SINGLE data file for profile, skills, projects, timeline, and contacts
│   ├── audio.js               # Web Audio API procedural wave synthesizer
│   ├── modal.js               # Accessible <dialog> project detail modal controller
│   ├── scene.js               # Three.js 3D scene (water, particles, creatures, floating orbs)
│   ├── sections.js            # Dynamic DOM rendering, copy email, contact mailto, depth tracker
│   ├── style.css              # Calm ocean palette, glassmorphism, responsive styles
│   └── main.js                # App entry point & GSAP ScrollTrigger orchestration
└── README.md                  # Documentation and deployment guide
```

---

## ♿ Accessibility & Performance

- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` by disabling heavy camera movement, creature oscillations, and rapid transforms.
- **Tab Visibility**: Pauses the Three.js render loop when the browser tab is hidden to conserve GPU/CPU power.
- **Pixel Ratio Capping**: Capped at `2.0` to preserve smooth 60fps performance on high-DPI displays.
- **Keyboard Navigation**: Project cards and dialog modal support full keyboard navigation (`Tab`, `Enter`, `Escape` to close).
- **WebGL Fallback**: If WebGL is unavailable or disabled, gracefully falls back to a CSS ocean gradient with animated bubbles.
- **High Contrast**: Uses crisp readable text atop translucent glass backdrops satisfying WCAG AA contrast standards.
