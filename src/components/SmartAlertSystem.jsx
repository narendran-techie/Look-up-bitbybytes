import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SmartAlertSystem = ({ locationData }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!locationData) return;
    const newAlerts = [];
    
    if (locationData.iss?.nextPass && locationData.iss.nextPass.duration > 0) {
      newAlerts.push({
        id: 'iss',
        type: 'info',
        title: 'ISS Pass Approaching',
        message: `The ISS will be visible from your location at ${locationData.iss.nextPass.startTime}.`
      });
    }

    if (locationData.weather?.current?.weather?.[0]?.main === 'Clear') {
      newAlerts.push({
        id: 'clear-sky',
        type: 'success',
        title: 'Clear Skies Tonight',
        message: 'Optimal viewing conditions for astronomy tonight.'
      });
    }

    setAlerts(newAlerts);
  }, [locationData]);

  if (alerts.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', padding: 16 }}>
        <Bell size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
        <div>No active alerts</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto', height: '100%' }}>
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              padding: 12,
              background: alert.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(56, 189, 248, 0.1)',
              borderLeft: `3px solid ${alert.type === 'success' ? '#22c55e' : '#38bdf8'}`,
              borderRadius: '0 6px 6px 0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: alert.type === 'success' ? '#86efac' : '#bae6fd', fontWeight: 600, fontSize: '0.9rem' }}>
              <BellRing size={14} /> {alert.title}
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: 4 }}>
              {alert.message}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SmartAlertSystem;
