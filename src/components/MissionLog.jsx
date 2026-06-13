import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MissionLog = () => {
  const [logs, setLogs] = useState([
    { id: 0, message: 'System Initialized', time: new Date().toLocaleTimeString() }
  ]);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchActivity = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE || '';
        const res = await fetch(`${baseUrl}/api/activity`);
        if (!res.ok) throw new Error('activity fetch failed');
        const data = await res.json();
        if (!mounted) return;
        setLogs(data.map((item, idx) => ({
          id: idx,
          message: item.message,
          time: item.time
        })));
        setLoading(false);
      } catch (e) {
        if (mounted) {
          setLogs([{ id: 0, message: 'Activity feed unavailable', time: new Date().toLocaleTimeString() }]);
          setLoading(false);
        }
      }
    };
    fetchActivity();
    const iv = setInterval(fetchActivity, 15000); // refresh every 15s
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  // keep newest on top visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [logs]);

  return (
    <div ref={containerRef} style={{ height: '100%', overflow: 'auto', paddingRight: 6 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px' }}>
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              style={{
                padding: '12px',
                background: 'linear-gradient(90deg, rgba(34,211,238,0.03), rgba(124,58,237,0.02))',
                border: '1px solid rgba(124, 58, 237, 0.06)',
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'transform 0.2s ease'
              }}
            >
              <span style={{ color: '#a5b4fc', fontSize: '0.7rem', fontFamily: 'Courier New' }}>[{log.time}]</span>
              <span style={{ color: '#f8fafc', fontSize: '0.95rem', letterSpacing: '0.4px' }}>{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MissionLog;
