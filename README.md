# 👟 COMET // All-Weather Storm Edition — Interactive 3D Canvas Showcase & Order Desk

An Apple-style, high-performance canvas scroll experience built from a full 240-frame storm sequence (`ezgif-frame-001.jpg` to `ezgif-frame-240.jpg`), paired with technical engineering deep dives, interactive telemetry, fit guide matrix, product summary, authorized student retailer desk (**Aashutosh Soni**, 2nd Year, Arya College, Jaipur), and a direct in-page **Order Now** checkout terminal.

---

## 🚀 Live Deployment Options

This project is built to be **100% flexible and deployment-ready** for any hosting environment:

### Option 1: GitHub Pages (Free Static Hosting)
1. Go to your repository **Settings** > **Pages**.
2. Under **Build and deployment**, select:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or `master`) / `(root)`
3. Click **Save**. Within 1–2 minutes, your site will be live at:
   `https://aashutoshsoni2407-ux.github.io/comet-3d-view/`

### Option 2: Vercel (Recommended — 1 Click)
- Import this GitHub repository into [Vercel](https://vercel.com).
- Framework preset: **Other** / Static.
- Root directory: `./`.
- Click **Deploy**. Vercel will automatically read `vercel.json` and serve the site with high-performance edge caching for all 240 sequence frames.

### Option 3: Netlify (1 Click)
- Import into [Netlify](https://netlify.com).
- Publish directory: `.`
- Reads `netlify.toml` automatically.

### Option 4: Render / Railway / Heroku (Node.js Server)
- Runs `npm start` which launches `server.js`.
- Binds to `process.env.PORT` automatically.

---

## 💻 Local Development

### Option A: Direct Node Server (Zero Dependencies)
```bash
# Clone the repository
git clone https://github.com/aashutoshsoni2407-ux/comet-3d-view.git
cd comet-3d-view

# Start local server
npm start
# or: node server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Option B: Windows One-Click
Double-click `run.bat` in the project folder to start the server and automatically launch your default browser.

### Option C: Any Static Server
```bash
npx serve .
# or: python -m http.server 3000
```

---

## 🌟 Key Architecture & Features

### 1. 🎞️ 240-Frame Fixed Curtain Canvas Engine
- **Curtain Architecture**: Canvas stays fixed at `z-index: 1` behind the viewport while the content layer (`z-index: 20`) slides seamlessly over it, preventing black flashes and layout shifts.
- **Lerped Scroll Scrubbing**: Uses linear interpolation (`diff * 0.12`) on `requestAnimationFrame` for buttery-smooth scrolling on both high-precision mousepads and standard scroll wheels.
- **Aspect-Ratio Cover**: Scales frames to fill any screen size (mobile, tablet, ultra-wide) while preserving the shoe aspect ratio.
- **Missing Frame Fallback**: `getClosestAvailableImage()` guarantees continuous rendering without flickering if frames load asynchronously.

### 2. 💎 Dynamic Transparent Glassmorphism Navbar
- Glassmorphic top navigation with dynamic backdrop blur on scroll (`.nav-scrolled`).
- Quick navigation links:
  - `01. Overview`
  - `02. Engineering`
  - `03. Telemetry`
  - `04. Fit Guide`
  - `05. Retailer`
  - `06. Order Now`
- Prominent `[ ORDER NOW ]` action button that smoothly scrolls to checkout.

### 3. 🏷️ Bold COMET Brand First-Frame Title
- Displays the **COMET** brand title in bold on frame 1 with subtle drop-shadows.
- Automatically fades out smoothly as the user begins scrolling.

### 4. 🔬 Comprehensive Technical Sections
- **Section 02 // Engineering**: Hydrophobic membrane, dual-density carbon matrix, and vulcanized star traction lugs.
- **Section 03 // Live Telemetry & 360° Angle Scanner**: Interactive angle switcher previewing frames with instant feedback.
- **Section 04 // Precision Fit Matrix**: Dynamic US Men size guide and foot-measurement recommendations.

### 5. 🎓 Authorized Retailer Desk
- **Authorized Retailer**: **Aashutosh Soni**
- **Academic Status**: 2nd Year Student
- **Institution**: Arya College of Engineering, Jaipur, Rajasthan, India
- **Fulfillment**: Jaipur Regional Hub & Pan-India Express Delivery
- **Authenticity ID**: `AUTH-ARYA-JPR-2026-SONI`

### 6. 🛒 Section 06: Order Now Checkout Terminal ("At Last")
- Positioned right before the footer for maximum conversion.
- **Interactive Colorway Selector**: `Onyx Cyber-Black` and `Storm Mist Silver` with live preview image update.
- **Size Selector**: US 7.0 through US 12.0.
- **Quantity Stepper**: Dynamic subtotal calculation ($220 / ₹18,499 per pair).
- **Payment Modes**: UPI (GPay/PhonePe), Cash on Delivery, or Arya Campus Handover.
- **Instant Confirmation Ticket**: Generates official order ticket (e.g., `#CMT-JPR-8492`) and provides a 1-click **Chat on WhatsApp** link directly with retailer Aashutosh Soni.

---

## 📁 Repository Structure
```
comet-3d-view/
├── ezgif-frame-001.jpg ... ezgif-frame-240.jpg  # 240 Full HD Frames
├── index.html                                  # Semantic HTML & all 6 sections
├── styles.css                                  # Glassmorphism dark-mode styles
├── script.js                                   # Canvas engine, lerp, HUD, & order logic
├── server.js                                   # Node.js server with HTTP caching
├── vercel.json                                 # Vercel deployment configuration
├── netlify.toml                                # Netlify deployment configuration
├── package.json                                # NPM scripts and metadata
├── run.bat                                     # Windows 1-click launcher
├── .gitignore                                  # Git ignore rules
└── README.md                                   # Documentation
```

---

## 📜 License
MIT License. Created by [Aashutosh Soni](https://github.com/aashutoshsoni2407-ux) (Arya College, Jaipur).
