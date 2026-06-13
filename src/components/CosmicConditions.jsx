import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const levelToPercentage = (level) => {
  if (level === 'Low') return 20;
  if (level === 'Moderate') return 50;
  return 80;
};

const barColor = (value) => {
  if (value < 40) return '#22c55e';
  if (value < 75) return '#f59e0b';
  return '#ef4444';
};

const StatBar = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
    <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ width: '100%', height: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden' }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', background: barColor(value) }} />
    </div>
    <div style={{ color: '#f8fafc', fontFamily: 'Courier New', fontSize: '0.9rem' }}>{value}%</div>
  </div>
);

const CosmicConditions = () => {
  const [solar, setSolar] = useState(25);
  const [radiation, setRadiation] = useState(18);
  const [geo, setGeo] = useState(12);
  const [risk, setRisk] = useState('Low');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchWeather = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE || '';
        const res = await fetch(`${baseUrl}/api/weather`);
        if (!res.ok) throw new Error('weather fetch failed');
        const data = await res.json();
        if (!mounted) return;
        setSolar(data.cloudCover ?? 0);
        setRadiation(data.humidity ?? 0);
        setGeo(Math.min(100, (data.visibility ?? 10000) / 100));
        setRisk(data.observationRating || 'Good');
        setLoading(false);
      } catch (e) {
        if (mounted) setLoading(false);
      }
    };
    fetchWeather();
    const iv = setInterval(fetchWeather, 30000);
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  const riskVal = levelToPercentage(risk);
  const riskColor = riskVal < 40 ? '#22c55e' : riskVal < 70 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'center', height: '100%', padding: '10px 12px' }}>
      <StatBar label="Solar Activity" value={Math.round(solar)} />
      <StatBar label="Radiation" value={Math.round(radiation)} />
      <StatBar label="Magnetic Activity" value={Math.round(geo)} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Risk Level</div>
        <div style={{ width: 100, height: 28, background: 'rgba(255,255,255,0.03)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${riskColor}` }}>
          <div style={{ color: riskColor, fontWeight: 700 }}>{riskVal}%</div>
        </div>
      </div>
    </div>
  );
};

export default CosmicConditions;
