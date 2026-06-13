import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Activity } from 'lucide-react';

const AsteroidCard = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchAsteroids = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE || '';
        const res = await fetch(`${baseUrl}/api/nasa/asteroids`);
        if (!res.ok) throw new Error('Asteroids fetch failed');
        const data = await res.json();
        if (!mounted) return;
        setAsteroids(data);
        setLoading(false);
      } catch (e) {
        if (mounted) {
          setError('Failed to load asteroid data');
          setLoading(false);
        }
      }
    };
    fetchAsteroids();
    const iv = setInterval(fetchAsteroids, 3600000); // update every hour
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  const hazardousCount = asteroids.filter(a => a.hazardous).length;

  if (loading) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        <Activity size={20} style={{ marginRight: 8 }} />
        Loading asteroids...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
        <AlertTriangle size={20} style={{ marginRight: 8 }} />
        {error}
      </div>
    );
  }

  if (!loading && asteroids.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textAlign: 'center', padding: 16 }}>
        <AlertTriangle size={24} />
        <div>No near earth objects detected today.</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', height: '100%', overflow: 'auto' }}>
      {hazardousCount > 0 && (
        <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8 }}>
          <div style={{ color: '#fca5a5', fontSize: '0.85rem', fontWeight: 600 }}>
            ⚠️ {hazardousCount} Potentially Hazardous Asteroid{hazardousCount !== 1 ? 's' : ''}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 'calc(100% - 60px)', overflow: 'auto' }}>
        <AnimatePresence>
          {asteroids.map((ast, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              style={{
                padding: 12,
                background: ast.hazardous ? 'rgba(239, 68, 68, 0.08)' : 'rgba(148, 163, 184, 0.04)',
                border: `1px solid ${ast.hazardous ? 'rgba(239, 68, 68, 0.2)' : 'rgba(148, 163, 184, 0.2)'}`,
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ color: ast.hazardous ? '#fca5a5' : '#f8fafc', fontSize: '0.95rem', fontWeight: 500 }}>
                  {ast.hazardous && '🔴 '}{ast.name}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 2 }}>
                  Distance: {ast.distance}
                </div>
              </div>
              <div style={{ color: ast.hazardous ? '#ef4444' : '#22c55e', fontSize: '0.8rem', fontWeight: 600 }}>
                {ast.hazardous ? 'HAZARD' : 'SAFE'}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AsteroidCard;
