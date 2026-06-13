import React, { useState } from 'react';
import { Clock, Play, Pause, Rewind, FastForward } from 'lucide-react';

const TimeMachineMode = ({ onTimeChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x, 10x, 60x

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#e2e8f0', fontSize: '1.1rem', fontFamily: 'Courier New, monospace' }}>
        {new Date().toLocaleString()}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        <button style={btnStyle} onClick={() => setSpeed(s => Math.max(1, s / 10))}><Rewind size={18} /></button>
        <button style={{...btnStyle, background: isPlaying ? 'rgba(34, 211, 238, 0.2)' : 'rgba(255,255,255,0.1)'}} onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause size={24} color="#22d3ee" /> : <Play size={24} color="#22d3ee" />}
        </button>
        <button style={btnStyle} onClick={() => setSpeed(s => Math.min(3600, s * 10))}><FastForward size={18} /></button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem' }}>
        <span>Speed: {speed}x</span>
        <span>Live Time: {isPlaying ? 'No' : 'Yes'}</span>
      </div>
      
      <input type="range" min="-86400" max="86400" defaultValue="0" style={{ width: '100%', accentColor: '#22d3ee' }} />
    </div>
  );
};

const btnStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '50%',
  width: 44,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#f8fafc',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

export default TimeMachineMode;
