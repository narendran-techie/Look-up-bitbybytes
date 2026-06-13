import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { SatelliteContext } from '../context/SatelliteContext';

const SatelliteDirectory = () => {
  const { selectedSatellite, setSelectedSatellite, SATELLITES_DATA } = useContext(SatelliteContext);
  const satellites = Object.values(SATELLITES_DATA);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
      {satellites.map((sat, idx) => (
        <motion.button
          key={sat.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => setSelectedSatellite(sat.id)}
          style={{
            padding: '14px',
            borderRadius: '8px',
            border: selectedSatellite === sat.id 
              ? `2px solid ${sat.color}` 
              : '1px solid rgba(124,58,237,0.06)',
            background: selectedSatellite === sat.id
              ? `linear-gradient(90deg, rgba(${sat.color === '#ffff00' ? '255,255,0' : sat.color === '#00ffff' ? '0,255,255' : sat.color === '#00ff00' ? '0,255,0' : sat.color === '#ff9500' ? '255,149,0' : '255,0,255'},0.08), rgba(124,58,237,0.04))`
              : 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(124,58,237,0.02))',
            cursor: 'pointer',
            transition: 'all 0.28s ease',
            boxShadow: selectedSatellite === sat.id 
              ? `0 0 20px ${sat.color}40, inset 0 0 12px ${sat.color}10`
              : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
          onMouseEnter={(e) => {
            if (selectedSatellite !== sat.id) {
              e.target.style.borderColor = `${sat.color}40`;
              e.target.style.boxShadow = `0 0 12px ${sat.color}30`;
            }
          }}
          onMouseLeave={(e) => {
            if (selectedSatellite !== sat.id) {
              e.target.style.borderColor = 'rgba(124,58,237,0.06)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>{sat.icon}</span>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ color: '#f8fafc', fontSize: '0.95rem', fontWeight: 600 }}>
              {sat.name}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              {sat.type}
            </div>
          </div>
          {selectedSatellite === sat.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: sat.color,
                boxShadow: `0 0 12px ${sat.color}`
              }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default SatelliteDirectory;
