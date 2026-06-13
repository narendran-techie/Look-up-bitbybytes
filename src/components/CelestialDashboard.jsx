import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar } from 'lucide-react';

const CelestialDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchEvents = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE || '';
        const res = await fetch(`${baseUrl}/api/visibility/events`); // Assume this maps to getEvents
        if (!res.ok) throw new Error('Failed to fetch events');
        const { data } = await res.json();
        if (mounted) {
          setEvents(Array.isArray(data) ? data : (data.events || []));
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <div style={{ color: '#94a3b8', padding: 16 }}>Loading celestial events...</div>;
  }

  if (events.length === 0) {
    return <div style={{ color: '#94a3b8', padding: 16 }}>No upcoming major celestial events found.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', height: '100%', overflow: 'auto' }}>
      {events.slice(0, 5).map((evt, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          style={{
            padding: 12,
            background: 'rgba(236, 72, 153, 0.05)',
            border: '1px solid rgba(236, 72, 153, 0.2)',
            borderRadius: 6,
          }}
        >
          <div style={{ color: '#fbcfe8', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={14} color="#ec4899" /> {evt.name || evt.title || 'Celestial Event'}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={12} /> {evt.date || evt.time || 'Upcoming'}
          </div>
          {(evt.description || evt.visibility) && (
            <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: 6 }}>
              {evt.visibility ? `Visibility: ${evt.visibility}` : evt.description}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default CelestialDashboard;
