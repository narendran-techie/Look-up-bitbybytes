import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/landing.css';

const sequences = [
  'Initializing Orbital Network...',
  'Connecting to Satellite Feeds...',
  'Retrieving Space Data...',
  'Systems Online.'
];

const Landing = () => {
  const [seqIndex, setSeqIndex] = useState(0);
  const [showHero, setShowHero] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (seqIndex < sequences.length) {
      const timer = setTimeout(() => setSeqIndex(prev => prev + 1), 1200);
      return () => clearTimeout(timer);
    }
    const heroTimer = setTimeout(() => setShowHero(true), 500);
    return () => clearTimeout(heroTimer);
  }, [seqIndex]);

  const handleMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    setParallax({ x, y });
  };

  return (
    <div className="landing-container" onMouseMove={handleMove} style={{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }}>
      <div className="stars-bg"></div>
      <div className="shooting-stars" aria-hidden />
      <AnimatePresence mode="wait">
        {!showHero ? (
          <motion.div key="sequence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="init-sequence">
            {sequences[seqIndex] || sequences[sequences.length - 1]}
          </motion.div>
        ) : (
          <motion.div key="hero" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="hero-content">
            <motion.h1 className="title" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.9 }}>LOOK UP</motion.h1>
            <motion.p className="subtitle" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.9 }}>The Universe Is Moving. Look Up.</motion.p>
            <motion.button className="enter-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.6 }} onClick={() => navigate('/dashboard')}>Enter Mission Control</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
