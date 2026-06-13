import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';

const AstronomyCard = () => {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackImage = 'https://via.placeholder.com/600x340?text=NASA+APOD+Unavailable';

  useEffect(() => {
    let mounted = true;
    const fetchApod = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE || '';
        const res = await fetch(`${baseUrl}/api/nasa/apod`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`APOD fetch failed: ${res.status} ${res.statusText} - ${errorText}`);
        }
        const data = await res.json();
        if (!mounted) return;
        setApod(data);
        setLoading(false);
      } catch (e) {
        if (mounted) {
          console.error('[APOD Error]', e.message || e);
          setError('Unable to load NASA Astronomy Picture.');
          setLoading(false);
        }
      }
    };
    fetchApod();
    const iv = setInterval(fetchApod, 86400000); // update once a day
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  if (loading) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        <ImageIcon size={20} style={{ marginRight: 8 }} />
        Loading APOD...
      </div>
    );
  }

  if (error && !apod) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#f87171', gap: 12, textAlign: 'center', padding: 16 }}>
        <AlertCircle size={24} />
        <div>Unable to load NASA Astronomy Picture.</div>
        <img
          src={fallbackImage}
          alt="NASA APOD placeholder"
          style={{ width: '100%', maxWidth: 320, borderRadius: 10, marginTop: 12 }}
        />
      </div>
    );
  }

  const imageToShow = apod?.image || fallbackImage;
  const titleToShow = apod?.title || 'Astronomy Picture of the Day';
  const dateToShow = apod?.date || 'Today';
  const descriptionToShow = apod?.description || 'NASA Astronomy Picture of the Day is currently unavailable.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', minHeight: '100%', overflow: 'hidden' }}>
      <motion.img
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        src={imageToShow}
        alt={titleToShow}
        style={{
          width: '100%',
          borderRadius: 8,
          border: '1px solid rgba(34, 211, 238, 0.2)',
          objectFit: 'cover',
          maxHeight: 220
        }}
      />
      <div>
        <div style={{ color: '#22d3ee', fontSize: '0.85rem', fontFamily: 'Courier New', marginBottom: 4 }}>
          {dateToShow}
        </div>
        <h3 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 600, marginBottom: 6 }}>
          {titleToShow}
        </h3>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5, maxHeight: 'calc(100% - 50px)', overflow: 'auto' }}>
          {descriptionToShow}
        </p>
      </div>
    </div>
  );
}
export default AstronomyCard;
