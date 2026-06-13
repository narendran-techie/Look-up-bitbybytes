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
  const { selectedSatellite, SATELLITES_DATA, setIntelligenceData } = useContext(SatelliteContext);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [renderTick, setRenderTick] = useState(0);
  const timeRef = useRef(0);
  const markerRefsRef = useRef({});
  const locationMarkerRef = useRef(null);
  const locationGlowRef = useRef(null);
  const pulseRef = useRef(0);
  const cameraAnimationRef = useRef(null);

  const isValidCoordinate = (value, min, max) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
  const normalizeLongitude = (lng) => ((lng % 360) + 360) % 360;

  // Handle globe click - Task 1: Detect and capture location
  const handleGlobeClick = (...args) => {
    let lat;
    let lng;

    if (args.length >= 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      [lat, lng] = args;
    } else if (args.length >= 3 && typeof args[1] === 'number' && typeof args[2] === 'number') {
      lat = args[1];
      lng = args[2];
    } else if (args.length === 1 && args[0] && typeof args[0] === 'object') {
      lat = args[0].lat ?? args[0].latitude;
      lng = args[0].lng ?? args[0].longitude;
    }

    if (!isValidCoordinate(lat, -90, 90) || !isValidCoordinate(lng, -180, 180)) {
      console.warn('[Globe Click] Invalid coordinates received:', lat, lng, 'args:', args);
      return;
    }

    const location = {
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString()
    };

    setSelectedLocation(location);

    if (globeRef.current && typeof globeRef.current.pointOfView === 'function') {
      try {
        globeRef.current.pointOfView({
          lat,
          lng,
          altitude: 1.5
        }, 1500);
      } catch (error) {
        console.error('[Globe Click]', error);
      }
    }
  };

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

    const interval = setInterval(() => setRenderTick((tick) => tick + 1), 1000);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
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

      // Task 2: Create location marker (cyan, pulsing)
      if (!locationMarkerRef.current) {
        const markerGeom = new THREE.SphereGeometry(0.12, 16, 16);
        const markerMat = new THREE.MeshBasicMaterial({ 
          color: '#22d3ee', // cyan
          emissive: '#22d3ee',
          emissiveIntensity: 0.8
        });
        const marker = new THREE.Mesh(markerGeom, markerMat);
        marker.visible = false;
        scene.add(marker);
        locationMarkerRef.current = marker;

        // Create location glow
        const glowGeom = new THREE.SphereGeometry(0.3, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
          color: '#22d3ee',
          transparent: true,
          opacity: 0.3,
          emissive: '#22d3ee',
          emissiveIntensity: 0.5
        });
        const glow = new THREE.Mesh(glowGeom, glowMat);
        glow.visible = false;
        scene.add(glow);
        locationGlowRef.current = glow;
      }
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

          marker.rotation.x += 0.01;
          marker.rotation.y += 0.015;
        });

        if (selectedLocation && locationMarkerRef.current && locationGlowRef.current) {
          const { x, y, z } = globe.getCoords(selectedLocation.latitude, selectedLocation.longitude, 1.05);

          locationMarkerRef.current.position.set(x, y, z);
          locationGlowRef.current.position.set(x, y, z);
          locationMarkerRef.current.visible = true;
          locationGlowRef.current.visible = true;

          const pulse = (Math.sin(pulseRef.current * 0.8) + 1) / 2;
          const markerScale = 1 + pulse * 0.4;
          locationMarkerRef.current.scale.set(markerScale, markerScale, markerScale);

          const glowPulse = (Math.sin(pulseRef.current * 0.6) + 1) / 2;
          const glowScale = 2.5 + glowPulse * 1.5;
          locationGlowRef.current.scale.set(glowScale, glowScale, glowScale);
        } else if (locationMarkerRef.current && locationGlowRef.current) {
          locationMarkerRef.current.visible = false;
          locationGlowRef.current.visible = false;
        }
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [selectedSatellite, selectedLocation]);

  // Fetch location data from backend when location is clicked
  useEffect(() => {
    if (!selectedLocation) return;

    const fetchLocationData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
        const { latitude, longitude } = selectedLocation;

        console.log('[GlobeView] Fetching data for location:', { latitude, longitude });

        // Fetch multiple datasets in parallel
        const [locationRes, weatherRes, issRes, astronomyRes, satellitesRes] = await Promise.allSettled([
          fetch(`${baseUrl}/api/location?latitude=${latitude}&longitude=${longitude}`),
          fetch(`${baseUrl}/api/weather?latitude=${latitude}&longitude=${longitude}`),
          fetch(`${baseUrl}/api/iss/passes?latitude=${latitude}&longitude=${longitude}`),
          fetch(`${baseUrl}/api/astronomy?latitude=${latitude}&longitude=${longitude}`),
          fetch(`${baseUrl}/api/satellites`)
        ]);

        const results = {};

        if (locationRes.status === 'fulfilled' && locationRes.value.ok) {
          results.location = await locationRes.value.json();
        }

        if (weatherRes.status === 'fulfilled' && weatherRes.value.ok) {
          results.weather = await weatherRes.value.json();
        }

        if (issRes.status === 'fulfilled' && issRes.value.ok) {
          results.iss = await issRes.value.json();
        }

        if (astronomyRes.status === 'fulfilled' && astronomyRes.value.ok) {
          results.astronomy = await astronomyRes.value.json();
        }

        if (satellitesRes.status === 'fulfilled' && satellitesRes.value.ok) {
          results.satellites = await satellitesRes.value.json();
        }

        // Store in window for debugging or pass to parent context
        window.selectedLocationData = results;
        if (typeof setIntelligenceData === 'function') {
          setIntelligenceData(results);
        }
      } catch (error) {
        console.error('[GlobeView] Failed to fetch location data:', error);
      }
    };

    fetchLocationData();
  }, [selectedLocation]);

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
  }, [renderTick]);

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
  }, [selectedSatellite, renderTick]);

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
        onGlobeClick={({ lat, lng }) => handleGlobeClick(lat, lng)}
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
      {selectedLocation && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          backgroundColor: 'rgba(0, 20, 40, 0.95)',
          border: '2px solid #22d3ee',
          borderRadius: '8px',
          padding: '12px 16px',
          minWidth: '200px',
          fontFamily: 'Courier New, monospace',
          color: '#22d3ee',
          fontSize: '12px',
          lineHeight: '1.6',
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Selected Location</div>
          <div>Lat: {selectedLocation.latitude.toFixed(4)}</div>
          <div>Lng: {selectedLocation.longitude.toFixed(4)}</div>
        </div>
      )}
    </div>
  );
};

export default GlobeView;
