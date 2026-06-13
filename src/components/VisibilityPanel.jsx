import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import LocationSelector from './LocationSelector';
import VisibilitySummary from './VisibilitySummary';
import { SatelliteContext } from '../context/SatelliteContext';

const VisibilityPanel = () => {
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { intelligenceData } = useContext(SatelliteContext);

  useEffect(() => {
    if (intelligenceData && intelligenceData.location) {
      setSelectedLocation(intelligenceData.location);
    }
  }, [intelligenceData]);

  const handleLocationSelected = (location) => {
    setSelectedLocation(location);
    setShowLocationSelector(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowLocationSelector(true)}
        style={{
          padding: '12px',
          background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.15), rgba(124, 58, 237, 0.15))',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          borderRadius: '8px',
          color: '#22d3ee',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.28s ease'
        }}
      >
        <Globe size={18} />
        {selectedLocation ? `${selectedLocation.city}, ${selectedLocation.country}` : 'Select Location'}
      </motion.button>

      {selectedLocation && (
        <div style={{ flex: 1, overflow: 'auto', paddingRight: '6px' }}>
          <VisibilitySummary
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}

      <AnimatePresence>
        {showLocationSelector && (
          <LocationSelector
            onLocationSelected={handleLocationSelected}
            onClose={() => setShowLocationSelector(false)}
          />
        )}
      </AnimatePresence>

      {!selectedLocation && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
          <div>
            <Globe size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ fontSize: '0.9rem' }}>Click the button above to select your location and see tonight's visible astronomical objects.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisibilityPanel;
