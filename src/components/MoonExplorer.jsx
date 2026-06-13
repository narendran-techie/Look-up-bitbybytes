import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Calendar } from 'lucide-react';

const MoonExplorer = ({ moonData }) => {
  if (!moonData) {
    return <div style={{ color: '#94a3b8', padding: 16 }}>Select a location on the globe to explore lunar data.</div>;
  }

  const { moonPhase, moonIllumination, moonrise, moonset } = moonData;
  const phaseEmoji = moonPhase?.toLowerCase().includes('full') ? '🌕' :
                     moonPhase?.toLowerCase().includes('new') ? '🌑' :
                     moonPhase?.toLowerCase().includes('quarter') ? '🌗' : '🌒';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', height: '100%', padding: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.4))' }}
        >
          {phaseEmoji}
        </motion.div>
      </div>
      
      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: 12, borderRadius: 8 }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#f8fafc', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Moon size={16} color="#e2e8f0" /> Current Phase: {moonPhase}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.85rem' }}>
          <div style={{ color: '#94a3b8' }}>Illumination:</div>
          <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{Math.round(moonIllumination)}%</div>
          <div style={{ color: '#94a3b8' }}>Moonrise:</div>
          <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{moonrise || 'N/A'}</div>
          <div style={{ color: '#94a3b8' }}>Moonset:</div>
          <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{moonset || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

export default MoonExplorer;
