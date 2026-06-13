
import React from 'react';
import GlobeView from '../components/GlobeView';
import SatelliteDirectory from '../components/SatelliteDirectory';
import SatelliteInfo from '../components/SatelliteInfo';
import CosmicConditions from '../components/CosmicConditions';
import AstronomyCard from '../components/AstronomyCard';
import AsteroidCard from '../components/AsteroidCard';
import AIAssistant from '../components/AIAssistant';
import VisibilityPanel from '../components/VisibilityPanel';
import { Satellite, MapPin, Image as ImageIcon, AlertTriangle, Globe } from 'lucide-react';
import '../styles/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Left Column */}
      <div className="left-panel panel">
        <div className="panel-header">
          <Satellite size={16} />
          <span>Tracked Satellites</span>
        </div>
        <div className="panel-desc">Click to select a satellite and view its orbital information in real-time.</div>
        <SatelliteDirectory />
      </div>

      {/* Center - Globe */}
      <div className="globe-section">
        <div className="globe-centerplate">
          <GlobeView />
          <div className="hud-overlay">
            <div className="hud-item">T+ 00:12:34</div>
            <div className="hud-item">Live Stream</div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="right-panel panel">
        <div className="panel-header">
          <MapPin size={16} />
          <span>Satellite Information</span>
        </div>
        <div className="panel-desc">Details about the selected satellite including status, altitude, and agency.</div>
        <SatelliteInfo />
      </div>

      {/* Bottom - Space Weather */}
      <div className="bottom-panel panel">
        <div className="panel-header" style={{ position: 'absolute', top: 10, left: 20, border: 'none', margin: 0 }}>
          <Satellite size={16} />
          <span>Space Weather Today</span>
        </div>
        <div className="panel-desc" style={{ position: 'absolute', top: 40, left: 20, right: 20 }}>Current solar and radiation conditions with an easy-to-read risk indicator.</div>
        <CosmicConditions />
      </div>

      {/* Bottom-Left - NASA APOD */}
      <div className="apod-panel panel">
        <div className="panel-header">
          <ImageIcon size={16} />
          <span>Astronomy Picture of the Day</span>
        </div>
        <div className="panel-desc">Today's NASA image featuring stunning space photography and discoveries.</div>
        <AstronomyCard />
      </div>

      {/* Bottom-Center - Visibility Control */}
      <div className="visibility-panel panel">
        <div className="panel-header">
          <Globe size={16} />
          <span>Visibility Control</span>
        </div>
        <div className="panel-desc">Choose your location to unlock real-time viewability and ISS pass forecasts.</div>
        <VisibilityPanel />
      </div>

      {/* Bottom-Right - Near Earth Objects */}
      <div className="asteroids-panel panel">
        <div className="panel-header">
          <AlertTriangle size={16} />
          <span>Near Earth Objects</span>
        </div>
        <div className="panel-desc">Asteroids approaching Earth with hazard status and distance information.</div>
        <AsteroidCard />
      </div>
      {/* AI Assistant - Floating Button */}
      <AIAssistant />
    </div>
  );
};

export default Dashboard;