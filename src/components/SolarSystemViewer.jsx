import React from 'react';
import { Orbit, Search } from 'lucide-react';

const SolarSystemViewer = () => {
  // A simple placeholder or iframe/canvas integration can go here. 
  // Since we use react-globe.gl mostly for Earth, Solar System might just be a stylized view or list.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#e2e8f0' }}>
      <Orbit size={32} color="#fcd34d" style={{ marginBottom: 12 }} />
      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Solar System Overview</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', padding: '0 10px' }}>
        {['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].map(p => (
          <div key={p} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 12, fontSize: '0.85rem' }}>
            {p}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: '0.8rem', color: '#94a3b8' }}>
        Interactive orbit mode available in full view.
      </div>
    </div>
  );
};

export default SolarSystemViewer;
