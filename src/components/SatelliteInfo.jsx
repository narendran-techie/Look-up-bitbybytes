import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { SatelliteContext } from '../context/SatelliteContext';

const SatelliteInfo = () => {
  const { selectedSatellite, SATELLITES_DATA } = useContext(SatelliteContext);
  const sat = SATELLITES_DATA[selectedSatellite];

  if (!sat) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
        No satellite selected
      </div>
    );
  }

  const infoItems = [
    { label: 'Name', value: sat.name },
    { label: 'Type', value: sat.type },
    { label: 'Status', value: sat.status, color: '#22c55e' },
    { label: 'Altitude (km)', value: sat.altitude.toLocaleString() },
    { label: 'Velocity (km/s)', value: sat.velocity.toFixed(2) },
    { label: 'Agency', value: sat.agency }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', overflow: 'auto', paddingRight: '6px' }}>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          padding: '14px',
          borderRadius: '8px',
          border: `2px solid ${sat.color}`,
          background: `linear-gradient(90deg, ${sat.color}15, rgba(124,58,237,0.05))`,
          boxShadow: `0 0 20px ${sat.color}40, inset 0 0 12px ${sat.color}15`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <span style={{ fontSize: '2rem' }}>{sat.icon}</span>
          <div>
            <div style={{ color: sat.color, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {sat.id}
            </div>
            <div style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 600 }}>
              {sat.name}
            </div>
          </div>
        </div>
        <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.4', fontStyle: 'italic' }}>
          {sat.description}
        </div>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {infoItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(124,58,237,0.06)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(124,58,237,0.02))',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {item.label}
            </div>
            <div style={{ color: item.color || '#f8fafc', fontSize: '1rem', fontFamily: 'Courier New', fontWeight: 600 }}>
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SatelliteInfo;
