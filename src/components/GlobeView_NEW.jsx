import React, { useEffect, useRef, useState, useContext } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { SatelliteContext } from '../context/SatelliteContext';

// Orbital data: { orbitalPeriod (minutes), inclination (degrees), raan (degrees), eccentricity }
const ORBITAL_DATA = {
  ISS: { period: 90, inclination: 51.6, raan: 0, eccentricity: 0 },
  HUBBLE: { period: 96, inclination: 28.47, raan: 120, eccentricity: 0 },
  TERRA: { period: 99, inclination: 98.3, raan: 240, eccentricity: 0 },
  NOAA20: { period: 102, inclination: 99.1, raan: 60, eccentricity: 0 },
  GPS: { period: 720, inclination: 55, raan: 180, eccentricity: 0.02 }
};

const GlobeView = () => {
  const globeRef = useRef();
  const { selectedSatellite, SATELLITES_DATA } = useContext(SatelliteContext);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const [satellites, setSatellites] = useState([]);
  const timeRef = useRef(0);
  const markerRefsRef = useRef({});
  const orbitPathRefsRef = useRef({});
  const pulseRef = useRef(0);
  const cameraInitialRef = useRef(false);

  // Simulate satellite position based on time and orbital data
  const calculateSatellitePosition = (satKey, timeInSeconds) => {
    const orbital = ORBITAL_DATA[satKey];
    if (!orbital) return { lat: 0, lng: 0 };

    const satData = SATELLITES_DATA[satKey];
    const earthRadius = 6371;
    const altitudeKm = satData.altitude || 400;
    const orbitRadiusKm = earthRadius + altitudeKm;

    // Anomaly progression based on orbital period
    const meanAnomaly = ((timeInSeconds / 60) % orbital.period) * (360 / orbital.period);
    const meanAnomalyRad = (meanAnomaly * Math.PI) / 180;

    // Simple 2D orbital position (simplified, not full SGP4)
    const lat = Math.sin(meanAnomalyRad) * orbital.inclination;
    const lng = (meanAnomalyRad * 180) / Math.PI + orbital.raan;

    return {
      lat: Math.max(-90, Math.min(90, lat)),
      lng: (lng % 360 + 360) % 360
    };
  };

  // Generate orbital path for visualization
  const generateOrbitPath = (satKey) => {
    const orbital = ORBITAL_DATA[satKey];
    const points = [];

    for (let i = 0; i <= 360; i += 10) {
      const meanAnomalyRad = (i * Math.PI) / 180;
      const lat = Math.sin(meanAnomalyRad) * orbital.inclination;
      const lng = i + orbital.raan;

      points.push([
        Math.max(-90, Math.min(90, lat)),
        (lng % 360 + 360) % 360
      ]);
    }

    return points;
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth > 1200 ? 600 : window.innerWidth > 900 ? 500 : 350;
      setDimensions({ width, height: width });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Setup globe
  useEffect(() => {
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = true;

    try {
      const scene = globeRef.current.scene();
      if (scene) scene.fog = null;
    } catch (e) {}

    // Initialize satellite marker refs
    const scene = globeRef.current.scene();
    if (scene) {
      const satKeys = Object.keys(SATELLITES_DATA);
      satKeys.forEach(satKey => {
        if (!markerRefsRef.current[satKey]) {
          const satData = SATELLITES_DATA[satKey];
          const size = satKey === 'ISS' ? 0.15 : 0.08;
          const geom = new THREE.SphereGeometry(size, 16, 16);
          const mat = new THREE.MeshBasicMaterial({ color: satData.color });
          const mesh = new THREE.Mesh(geom, mat);
          mesh.visible = false;
          scene.add(mesh);
          markerRefsRef.current[satKey] = mesh;

          // Create glow ring
          const glowGeom = new THREE.SphereGeometry(size * 2.5, 16, 16);
          const glowMat = new THREE.MeshBasicMaterial({
            color: satData.color,
            transparent: true,
            opacity: 0.1
          });
          const glowMesh = new THREE.Mesh(glowGeom, glowMat);
          glowMesh.visible = false;
          scene.add(glowMesh);
          markerRefsRef.current[`${satKey}_glow`] = glowMesh;
        }
      });
    }
  }, []);

  // Animation loop: update satellite positions imperatively
  useEffect(() => {
    let rafId;
    const tick = () => {
      timeRef.current += 1 / 60; // ~16ms per frame
      pulseRef.current += 0.05;

      if (globeRef.current) {
        const globe = globeRef.current;
        const satKeys = Object.keys(SATELLITES_DATA);

        satKeys.forEach(satKey => {
          const marker = markerRefsRef.current[satKey];
          const glowMarker = markerRefsRef.current[`${satKey}_glow`];
          if (!marker || !glowMarker) return;

          const pos = calculateSatellitePosition(satKey, timeRef.current);
          const { x, y, z } = globe.getCoords(pos.lat, pos.lng, 1.05);

          marker.position.set(x, y, z);
          glowMarker.position.set(x, y, z);
          marker.visible = true;
          glowMarker.visible = true;

          // Pulse effect for selected satellite
          if (selectedSatellite === satKey) {
            const pulse = (Math.sin(pulseRef.current * 1.6) + 1) / 2;
            const scale = 1.25 + pulse * 1.8;
            marker.scale.set(scale, scale, scale);

            const glowPulse = (Math.sin(pulseRef.current) + 1) / 2;
            const glowScale = 3.5 + glowPulse * 2.5;
            glowMarker.scale.set(glowScale, glowScale, glowScale);
          } else {
            marker.scale.set(1, 1, 1);
            glowMarker.scale.set(2.5, 2.5, 2.5);
          }

          // Rotation animation
          marker.rotation.x += 0.01;
          marker.rotation.y += 0.015;
        });

        if (!cameraInitialRef.current) {
          cameraInitialRef.current = true;
        }
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [selectedSatellite]);

  // Generate points and labels data
  const pointsData = React.useMemo(() => {
    const time = timeRef.current;
    return Object.keys(SATELLITES_DATA).map(satKey => {
      const pos = calculateSatellitePosition(satKey, time);
      const satData = SATELLITES_DATA[satKey];
      return {
        id: satKey,
        lat: pos.lat,
        lng: pos.lng,
        name: satData.name,
        type: satData.type
      };
    });
  }, []);

  // Labels for satellites
  const labelsData = React.useMemo(() => {
    const time = timeRef.current;
    return Object.keys(SATELLITES_DATA).map(satKey => {
      const pos = calculateSatellitePosition(satKey, time);
      const satData = SATELLITES_DATA[satKey];
      return {
        id: satKey,
        lat: pos.lat,
        lng: pos.lng,
        text: satKey,
        size: selectedSatellite === satKey ? 1.2 : 0.7,
        color: satData.color
      };
    });
  }, [selectedSatellite]);

  // Generate arcs for orbital paths
  const arcsData = React.useMemo(() => {
    return Object.keys(SATELLITES_DATA).map(satKey => {
      const orbital = ORBITAL_DATA[satKey];
      const points = [];

      for (let i = 0; i <= 360; i += 5) {
        const meanAnomalyRad = (i * Math.PI) / 180;
        const lat = Math.sin(meanAnomalyRad) * orbital.inclination;
        const lng = i + orbital.raan;
        points.push({
          lat: Math.max(-90, Math.min(90, lat)),
          lng: (lng % 360 + 360) % 360
        });
      }

      return {
        id: satKey,
        points: points,
        color: SATELLITES_DATA[satKey].color
      };
    });
  }, []);

  return (
    <div style={{ position: 'relative', width: dimensions.width, height: dimensions.height }}>
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#22d3ee"
        atmosphereAltitude={0.15}
        backgroundColor="rgba(0,0,0,0)"
        pointsData={pointsData}
        pointLat={d => d.lat}
        pointLng={d => d.lng}
        pointAltitude={0.02}
        pointColor={d => SATELLITES_DATA[d.id]?.color || '#ffffff'}
        pointRadius={d => {
          if (d.id === 'ISS') return 0.15;
          if (selectedSatellite === d.id) return 0.12;
          return 0.08;
        }}
        labelsData={labelsData}
        labelLat={d => d.lat}
        labelLng={d => d.lng}
        labelText={d => d.text}
        labelSize={d => d.size}
        labelColor={d => d.color}
        labelAltitude={0.15}
        arcsData={arcsData}
        arcLat={d => d.lat}
        arcLng={d => d.lng}
        arcAltitude={0.0}
        arcColor={d => `${d.color}40`}
        arcDashLength={0.5}
        arcDashGap={0.3}
        arcDashInitialGap={0}
        arcStroke={0.5}
      />
    </div>
  );
};

export default GlobeView;
