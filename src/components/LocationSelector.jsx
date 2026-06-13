import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { SatelliteContext } from '../context/SatelliteContext';

const LocationSelector = ({ onLocationSelected, onClose }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const globeRef = useRef(null);

  const handleGlobeClick = async (event) => {
    if (!globeRef.current) return;

    const rect = globeRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert click to lat/lng (simplified - center globe coordinates)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const lat = clamp(((centerY - y) / (rect.height / 2)) * 90, -90, 90);
    const lng = clamp(((x - centerX) / (rect.width / 2)) * 180, -180, 180);

    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE || '';
      const response = await fetch(
        `${baseUrl}/api/location?latitude=${lat}&longitude=${lng}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Location request failed: ${response.status} ${response.statusText} ${errorText}`);
      }

      const data = await response.json();
      setSelectedLocation(data);
      onLocationSelected(data);
    } catch (error) {
      console.error('Failed to get location:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 22, 0.8)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: 'linear-gradient(180deg, rgba(11,12,28,0.9), rgba(8,9,20,0.8))',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#22d3ee', fontSize: '1.2rem', margin: 0 }}>Select Observation Location</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '1.5rem'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>Click on the globe to select your observation location</p>

        <div
          ref={globeRef}
          onClick={handleGlobeClick}
          style={{
            width: '100%',
            height: '300px',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            borderRadius: '12px',
            border: '1px solid rgba(34, 211, 238, 0.2)',
            cursor: 'crosshair',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '16px'
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            fontSize: '0.9rem'
          }}>
            {loading ? 'Loading location data...' : 'Click anywhere on globe'}
          </div>
        </div>

        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}
          >
            <div style={{ color: '#22d3ee', fontSize: '0.85rem', marginBottom: '4px' }}>
              <MapPin size={14} style={{ marginRight: '6px' }} />
              Selected Location
            </div>
            <div style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 600 }}>
              {selectedLocation.city}, {selectedLocation.country}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>
              {selectedLocation.latitude.toFixed(2)}°, {selectedLocation.longitude.toFixed(2)}°
            </div>
          </motion.div>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            background: 'linear-gradient(90deg, #7c3aed, #8b5cf6)',
            border: 'none',
            borderRadius: '8px',
            color: '#f8fafc',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.28s ease'
          }}
        >
          View Visibility Results
        </button>
      </motion.div>
    </motion.div>
  );
};

export default LocationSelector;
