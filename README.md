# CLYX Media

Official digital platform for **CLYX Media** — a performance marketing and creator whitelisting agency partnering with high-growth Direct-to-Consumer (D2C) brands.

[![Live Site](https://img.shields.io/badge/Live%20Platform-prai--10.github.io%2FCLYX--Media-FFDE59?style=flat-square&logo=github&logoColor=050814)](https://prai-10.github.io/CLYX-Media/)
[![License](https://img.shields.io/badge/License-Proprietary-003AA3?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-10B981?style=flat-square)]()

---

## 🌐 Live Platform

* **Production URL:** [https://prai-10.github.io/CLYX-Media/](https://prai-10.github.io/CLYX-Media/)

---

## 📌 Overview

CLYX Media pairs organic creator storytelling with data-backed paid distribution (Meta, Google, and TikTok ad ecosystems). This repository contains the production agency showcase and client portal, built from the ground up with zero framework overhead for instant page loads, smooth 60fps animations, and a seamless responsive experience across all screen sizes.

---

## ⚡ Key Features & Technical Architecture

* **Zero-Dependency Core:** Built with pure semantic HTML5, modern CSS3, and vanilla ES6+ JavaScript. No bloated bundle sizes or hydration delays—ensuring sub-second load times and high Core Web Vitals scores.
* **Interactive 3D Campaign Carousel:** Custom-engineered coverflow carousel featuring smooth touch/drag physics, category filtering (`Fashion`, `Beauty`, `Food`, `Tech`), and active center-card focus calibrated to fit full case study metrics cleanly within the viewport.
* **Interactive 3D Laptop Showcase:** Scroll-responsive 3D perspective display demonstrating agency analytics dashboards, creator benchmarks, and live ad attribution metrics.
* **Decoupled Data Architecture (`js/data.js`):** Centralized data layer managing all case studies, leadership profiles, client testimonials, insights, and career openings. Completely decoupled from presentation for easy maintenance and future headless CMS or database integration.
* **Persistent Dual-Theme Engine:** Custom Dark Mode (deep navy `#050814` with electric yellow accents) and Light Mode (clean editorial layout with royal blue accents), saved persistently via `localStorage`.
* **Instant Global Search:** Fast client-side search modal that indexes services, case studies, team members, articles, and open positions in real time.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Semantic HTML5, Vanilla JavaScript (ES6+) |
| **Styling** | Modern CSS3 (CSS Variables, Flexbox, CSS Grid, 3D Perspective Transforms) |
| **Typography** | Space Grotesk (Headings) & Inter (Body UI) |
| **Media & Icons** | SVG Vector Icons, Optimized WebP Assets |
| **Hosting** | GitHub Pages (with `.nojekyll` configuration) |

---

## 📁 Repository Structure

```
CLYX-Media/
├── index.html            # Main semantic webpage
├── css/
│   └── style.css         # Design system, theme variables & responsive styles
├── js/
│   ├── data.js           # Centralized content store (campaigns, team, testimonials, etc.)
│   └── main.js           # UI interactions, carousel physics, theme toggle & search
├── .nojekyll             # Prevents Jekyll processing on GitHub Pages
└── README.md             # Project documentation
```

---

## 💻 Local Development

No package manager or build pipeline is required. Simply clone the repository and launch with any static server:

```bash
# Clone the repository
git clone https://github.com/prai-10/CLYX-Media.git

# Navigate to the project directory
cd CLYX-Media

# Run with a local HTTP server
npx serve .
# or
python -m http.server 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License & Ownership

© 2026 CLYX Media. All rights reserved.
