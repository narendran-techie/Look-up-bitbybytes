import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const statusColor = (s) => {
  if (!s) return '#94a3b8';
  if (s === 'ONLINE' || s === 'Locked' || s === 'Open' || s === 'Nominal') return '#22c55e';
  if (s === 'OFFLINE' || s === 'Degraded' || s === 'Limited') return '#f59e0b';
  return '#ef4444';
};

const OrbitalPanel = () => {
  const [iss, setIss] = useState({ latitude: null, longitude: null, altitude: null, velocity: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState('OFFLINE');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchISS = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE || '';
      const res = await fetch(`${baseUrl}/api/iss`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();

      // normalize fields - accept several possible keys
      const latitude = data.latitude ?? data.lat ?? data.latitude ?? null;
      const longitude = data.longitude ?? data.lng ?? data.lon ?? data.longitude ?? null;
      const altitude = data.altitude ?? data.alt ?? data.alt_km ?? null;
      const velocity = data.velocity ?? data.vel ?? data.velocity_kmh ?? null;

      setIss({ latitude, longitude, altitude, velocity });
      setTracking('ONLINE');
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error('[ISS Fetch]', err.message || err);
      setError('Unable to reach ISS data');
      setTracking('OFFLINE');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchISS();
    const iv = setInterval(fetchISS, 10000); // every 10s
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = [
    { label: 'Latitude', value: iss.latitude != null ? iss.latitude : (loading ? 'Loading...' : '—') },
    { label: 'Longitude', value: iss.longitude != null ? iss.longitude : (loading ? 'Loading...' : '—') },
    { label: 'Altitude (km)', value: iss.altitude != null ? iss.altitude : (loading ? 'Loading...' : '—') },
    { label: 'Velocity (km/h)', value: iss.velocity != null ? iss.velocity : (loading ? 'Loading...' : '—') },
    { label: 'Last Updated', value: lastUpdated ? new Date(lastUpdated).toLocaleString() : (loading ? 'Loading...' : '—') }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(124,58,237,0.06)', background: 'linear-gradient(90deg, rgba(255,255,255,0.01), rgba(124,58,237,0.02))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase' }}>ISS Status</div>
            <div style={{ color: '#f8fafc', fontSize: '1.2rem', fontFamily: 'Courier New', fontWeight: 700 }}>{tracking === 'ONLINE' ? 'Online' : 'Offline'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: statusColor(tracking), boxShadow: `0 0 8px ${statusColor(tracking)}` }} />
            <div style={{ color: statusColor(tracking), fontSize: '0.85rem', textTransform: 'uppercase' }}>{tracking}</div>
          </div>
        </div>
      </motion.div>

      {error ? (
        <div style={{ padding: '10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 8, color: '#fecaca' }}>{error}</div>
      ) : null}

      {items.map((it, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }} style={{ padding: '12px', background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(124,58,237,0.02))', borderRadius: '8px', border: '1px solid rgba(124,58,237,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase' }}>{it.label}</div>
              <div style={{ color: '#f8fafc', fontSize: '1.05rem', fontFamily: 'Courier New', fontWeight: 700 }}>{it.value}</div>
            </div>
          </div>
        </motion.div>
      ))}

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px' }}>
        <div className="pulse-dot" />
        <span style={{ color: '#22d3ee', fontSize: '0.8rem', letterSpacing: '1px' }}>{tracking === 'ONLINE' ? 'TRACKING ONLINE' : 'TRACKING OFFLINE'}</span>
      </div>
    </div>
  );
};

export default OrbitalPanel;
