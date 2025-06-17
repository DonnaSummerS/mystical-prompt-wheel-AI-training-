# Daily AI Prompt Wheel  
_Mystical Fantasy Edition_

An immersive, single-page web app that lets users spin a 5-segment, rune-inscribed wheel once every 24 hours to receive a writing prompt (or any “tip” you define). A password-protected control panel lets admins change prompts, background art, and background music—all with shimmering animations and a lavish fantasy RPG aesthetic.

---

## ✨ Features
* 5-segment wheel (72 ° each) with ornate border, floating rune tablets, and particle effects  
* Daily spin limitation enforced through `localStorage` (24 h cooldown + live countdown timer)  
* Tip revelation “ceremony” with 35-40 sparkles and tablet celebration  
* Admin Control Panel protected by passcode `BerniBOT`  
  * Edit separate tip pools for each segment  
  * Upload or link background images (≤ 5 MB; JPG/PNG/GIF)  
  * Unlock Music panel (secondary passcode `BerniBOTYousic`) to upload/link audio (≤ 10 MB; MP3/WAV/OGG) and control playback  
* Responsive layout (desktop, tablet, mobile)  
* Smooth phase-cycling color system (cool ↔ warm) and multi-layer particle engine (≤ 50 particles)  
* Works offline once loaded—everything is cached in the browser

---

## 🗂 Project Structure
```
/
├── index.html          # main page
├── styles.css          # full mystical theme
├── script.js           # wheel logic, admin tools, effects
└── README.md           # you are here
```
No build step is required.

---

## 🚀 Getting Started

1. **Clone or download** the project folder.  
2. **Serve locally** (recommended to avoid CORS with local file uploads):

   ```bash
   # Using Node.js
   npx serve .
   # or Python 3
   python -m http.server 8080
   ```
   Then open `http://localhost:8080` in your browser.

   You can also just double-click `index.html`, but some browsers block certain features (e.g., audio autoplay) over the `file://` protocol.

3. Enjoy the mystical experience!

### Browser Support
* Chrome 80+, Firefox 75+, Safari 13+, Edge 80+  
* Graceful degradation: if Web Animations API or audio autoplay is blocked, core functionality remains.

---

## 🧙‍♂️ Using the Wheel

1. Click **LET’S GO!!!**  
2. The wheel spins for ~3.5 s, runes glow, particles swirl.  
3. A modal reveals your prompt.  
4. You cannot spin again until the countdown timer reaches 0.

Data is stored in `localStorage` under:
* `mysticalWheel_lastSpin`
* `mysticalWheel_nextSpin`

Clearing site data resets the cooldown.

---

## 🔐 Admin Access & Passcodes

| Action                         | Passcode       |
| ------------------------------ | -------------- |
| Open Admin Control Panel       | `BerniBOT`     |
| Unlock Music Settings section  | `BerniBOTYousic` |

### Opening the Panel
1. Click the glowing rune **⚙** in the top-right corner.  
2. Enter the `BerniBOT` passcode.  
3. The Control Panel portal animates into view.

### Music Settings
Inside the Control Panel click **Unlock Music Settings**. Enter `BerniBOTYousic` to reveal music upload/link options.

---

## 🛠 Customisation Guide

### 1. Editing Tip Pools
* In **Tips Management**, each textarea corresponds to a wheel segment (starting at the top, going clockwise).
* Write multiple prompts separated by new lines _or_ commas—`script.js` will randomly choose one at spin time (you can modify this logic in code).
* Click **Save All Tips** to persist to `localStorage`.

### 2. Background Image
* Paste an external URL or click **Upload File** (≤ 5 MB).  
* Click **Apply**. The gradient overlay plus your image become the new background.

### 3. Music
* After unlocking music controls, paste a URL or upload an audio file (≤ 10 MB).  
* Click **Apply** then **Play/Pause** to test.  
* Audio loops automatically; autoplay is attempted on load but may require user interaction.

### 4. Colours & Fonts
* Global CSS variables are declared at the top of `styles.css`.  
  * `--cool-cyan`, `--gentle-pink`, etc. Adjust to match your palette.  
* Fonts are loaded via Google Fonts (`Cinzel Decorative`, `Spectral`, `Crimson Text`). Swap them by editing the `<link>` in `index.html` and the variables in `styles.css`.

### 5. Wheel Configuration
Need more segments?  
* Change `WHEEL_SEGMENTS` in `script.js`.  
* Adjust `SEGMENT_ANGLE = 360 / WHEEL_SEGMENTS`.  
* Duplicate `.wheel-segment` elements in `index.html` and corresponding CSS gradient rules.

> Complex redesigns may require updating the clip-paths or using an SVG wheel instead of CSS polygons.

### 6. Particle Limits
Keep total particles under **50** for smooth performance. Modify `PARTICLE_LIMIT` in `script.js` if you have a beefier target device.

---

## 🔄 Resetting / Troubleshooting

* **Forgot passcodes?** They’re hard-coded in `script.js`; change them and rebuild if desired.  
* **Corrupted state?** Clear `localStorage` for the site (DevTools → Application → Storage → Clear).  
* **Audio blocked?** Browsers often require user interaction before playback. Click **Play/Pause** manually.

---

## 📜 License

MIT — free to use, modify, and share. Please keep the original credits to retain the mystical goodwill of the runic spirits.

> Crafted with stardust, CSS gradients, and a dash of JavaScript sorcery ✧
