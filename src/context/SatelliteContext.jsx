import React, { createContext, useState } from 'react';

export const SatelliteContext = createContext();

// Satellite data with details
export const SATELLITES_DATA = {
  ISS: {
    id: 'ISS',
    name: 'International Space Station',
    type: 'Space Station',
    status: 'Active',
    altitude: 408,
    velocity: 7.66,
    agency: 'International',
    description: 'A modular research facility orbiting Earth. The ISS serves as a microgravity and space environment research laboratory.',
    icon: '🛰',
    color: '#ffff00'
  },
  HUBBLE: {
    id: 'HUBBLE',
    name: 'Hubble Space Telescope',
    type: 'Observatory',
    status: 'Active',
    altitude: 540,
    velocity: 7.5,
    agency: 'NASA/ESA',
    description: 'The Hubble Space Telescope observes the universe in visible and ultraviolet light, providing deep space imagery.',
    icon: '🔭',
    color: '#00ffff'
  },
  TERRA: {
    id: 'TERRA',
    name: 'Terra',
    type: 'Earth Observer',
    status: 'Active',
    altitude: 705,
    velocity: 7.1,
    agency: 'NASA',
    description: 'The Terra satellite monitors Earth\'s climate, weather, and natural disasters in real-time.',
    icon: '🌍',
    color: '#00ff00'
  },
  NOAA20: {
    id: 'NOAA20',
    name: 'NOAA-20',
    type: 'Weather Satellite',
    status: 'Active',
    altitude: 833,
    velocity: 6.83,
    agency: 'NOAA',
    description: 'A polar-orbiting satellite providing weather forecasts, climate monitoring, and environmental data.',
    icon: '🌤',
    color: '#ff9500'
  },
  GPS: {
    id: 'GPS',
    name: 'GPS IIF-10',
    type: 'Navigation Satellite',
    status: 'Active',
    altitude: 20200,
    velocity: 3.87,
    agency: 'US Space Force',
    description: 'Part of the Global Positioning System constellation, providing navigation and timing worldwide.',
    icon: '📡',
    color: '#ff00ff'
  }
};

export const SatelliteProvider = ({ children }) => {
  const [selectedSatellite, setSelectedSatellite] = useState('ISS');
  const [intelligenceData, setIntelligenceData] = useState(null);

  return (
    <SatelliteContext.Provider value={{ selectedSatellite, setSelectedSatellite, intelligenceData, setIntelligenceData, SATELLITES_DATA }}>
      {children}
    </SatelliteContext.Provider>
  );
};
