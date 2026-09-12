# CLYX Media — Performance Marketing & Creator Ads Agency

> **We turn organic clips into scaled accounts.**  
> Official web platform for CLYX Media, specializing in creator whitelisting, performance marketing, UGC content pipelines, and conversion-built web experiences for high-growth D2C brands.

---

## 🌟 Key Features

- **Dynamic Hero Section:** Strict dual-line kinetic headline with interactive light/dark mode accent hover highlights and floating 3D parallax creator clip stack.
- **3D Hacker Villa Macbook Engine:** Interactive 3D perspective scroll tilt showcasing the live Meta & Google Ads performance analytics dashboard.
- **Dynamic Campaigns Carousel:** Horizontal multi-mode navigation (mouse wheel, click-and-drag, arrow controls) with dynamic active center card pop-up magnification and zero scrollbar clutter.
- **Interactive Founder Roster:** Customizable leadership cards with direct in-browser photo insertion (local device upload via HTML5 `FileReader` + direct URL support).
- **15s D2C Testimonial Marquee:** High-energy infinite testimonial reel delivering rapid social proof.
- **Luxury Brand-Matched WhatsApp Launcher:** Dual-theme frosted glass pill launcher with live pulsing availability dot.
- **Centralized Data Layer:** All case studies, ROAS statistics, founder bios, and reviews are separated into `js/data.js` for instant updates.
- **Dual Mode System:** Smooth, persistent Dark Mode (Obsidian Carbon) and Light Mode (Clean Editorial with Royal Blue `#003AA3` & Electric Yellow `#FFDE59` highlights).

---

## 📁 Repository Structure

```
CLYX-Media/
├── index.html            # Main semantic HTML entry point
├── css/
│   └── style.css         # Complete design system, layouts, animations & responsive rules
├── js/
│   ├── data.js           # Centralized client data store (portfolio campaigns, founders, reviews)
│   └── main.js           # Core UI logic (theme toggle, 3D laptop tilt, pop-up carousel, cursor, upload)
├── .gitignore            # Excludes node_modules/ and temporary build caches
├── .nojekyll             # Enables zero-config static hosting on GitHub Pages
└── README.md             # Project documentation
```

---

## 🚀 Live Deployment on GitHub Pages

1. Navigate to repository **Settings > Pages**.
2. Under **Build and deployment > Source**, select **Deploy from a branch**.
3. Select branch **`main`** and folder **`/ (root)`**.
4. Click **Save**. The live URL will be active at:
   ```
   https://prai-10.github.io/CLYX-Media/
   ```

---

## 🛠️ Local Development

Simply open `index.html` in any modern web browser:

```bash
# Optional: Serve with any static server
npx serve .
# or
python -m http.server 3000
```

---

© 2026 CLYX Media. All rights reserved.
