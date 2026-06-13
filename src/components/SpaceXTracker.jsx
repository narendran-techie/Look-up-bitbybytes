import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Activity } from 'lucide-react';

const SpaceXTracker = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchLaunches = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE || '';
        const res = await fetch(`${baseUrl}/api/spacex/launches`);
        if (!res.ok) throw new Error('Failed to fetch launches');
        const { data } = await res.json();
        if (mounted) {
          setLaunches(data.slice(0, 5));
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };
    fetchLaunches();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', height: '100%' }}><Activity size={20} style={{ marginRight: 8 }} /> Loading SpaceX Data...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', height: '100%', overflow: 'auto' }}>
      <AnimatePresence>
        {launches.map((launch, idx) => {
          const date = new Date(launch.date_utc);
          const timeToLaunch = Math.max(0, date.getTime() - Date.now());
          const days = Math.floor(timeToLaunch / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeToLaunch / (1000 * 60 * 60)) % 24);
          
          return (
            <motion.div
              key={launch.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              style={{
                padding: 12,
                background: 'rgba(34, 211, 238, 0.04)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ color: '#f8fafc', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Rocket size={14} color="#22d3ee" /> {launch.name}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 2 }}>
                  {date.toLocaleDateString()} {date.toLocaleTimeString()}
                </div>
              </div>
              <div style={{ color: '#22d3ee', fontSize: '0.85rem', fontWeight: 600, textAlign: 'right' }}>
                T-Minus
                <br/>
                {days}d {hours}h
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default SpaceXTracker;
