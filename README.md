# LOOK UP

**"The Universe Is Moving. Look Up."**

A cinematic space-tech web application designed to feel like a futuristic mission control center.

## Features

- **Cinematic Landing Page:** Startup sequence and smooth animations
- **Interactive 3D Globe:** Auto-rotating high-quality globe (using `react-globe.gl` and `Three.js`)
- **Space-Tech Dashboard:** 
  - Space Pulse / Orbital Velocity tracking
  - Continuous simulated Mission Logs
  - Cosmic Conditions monitor
- **Framer Motion Animations:** Smooth fade transitions, floating panels, and animated text
- **Responsive Design:** Optimized for Desktop, Laptop, Tablet, and Mobile devices

## Tech Stack

- React (Vite)
- JavaScript
- CSS
- Framer Motion
- Axios (ready for future integrations)
- react-globe.gl
- Three.js
- React Router DOM
- Lucide React (Icons)

## Setup & Run Instructions

### 1. Install Dependencies

Open your terminal in the project root (`look-up/`) and run:

```bash
npm install
```

### 2. Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

### 3. Open in Browser

Once the server is running, you can typically view the app at:
[http://localhost:5173](http://localhost:5173)

## Project Structure Highlights

- `src/pages/Landing.jsx`: The immersive startup sequence and landing screen.
- `src/pages/Dashboard.jsx`: The main mission control layout.
- `src/components/GlobeView.jsx`: The 3D Earth component.
- `src/components/OrbitalPanel.jsx`: Stats panel with Framer Motion entry animations.
- `src/components/MissionLog.jsx`: Continuously updating log messages.
- `src/components/CosmicConditions.jsx`: Bottom panel monitoring space weather.

---

*Designed for the cosmos. No boring statistic cards. Just orbital intelligence.*
