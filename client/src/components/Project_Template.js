// Project 5: First Flock

// Basic particle swarm implementation
// Learning goals:

// Multiple agents
// Velocity updates
// Information sharing
// Basic swarm behavior

import { useEffect, useState } from "react";
import '../styles/Proj005.css';

const Proj005BasicFlock = () => {
  const [separation, setSeparation] = useState(0);
  const [alignment, setAlignment] = useState(0);
  const [cohesion, setCohesion] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleReset = () => {
    setSeparation(0);
    setAlignment(0);
    setCohesion(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="flock-container">
      <h1 className="flock-title">Proj005BasicFlock</h1>
      
      <div className="control-group">
        <div className="slider-container">
          <label className="slider-label" htmlFor="separation">Separation</label>
          <input
            type="range"
            id="separation"
            min="0"
            max="100"
            value={separation}
            onChange={(e) => setSeparation(e.target.value)}
            className="slider-input"
          />
          <span className="slider-value">Value: {separation}</span>
        </div>

        <div className="slider-container">
          <label className="slider-label" htmlFor="alignment">Alignment</label>
          <input
            type="range"
            id="alignment"
            min="0"
            max="100"
            value={alignment}
            onChange={(e) => setAlignment(e.target.value)}
            className="slider-input"
          />
          <span className="slider-value">Value: {alignment}</span>
        </div>

        <div className="slider-container">
          <label className="slider-label" htmlFor="cohesion">Cohesion</label>
          <input
            type="range"
            id="cohesion"
            min="0"
            max="100"
            value={cohesion}
            onChange={(e) => setCohesion(e.target.value)}
            className="slider-input"
          />
          <span className="slider-value">Value: {cohesion}</span>
        </div>
      </div>

      <div className="button-group">
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className="control-button"
        >
          {isRunning ? 'Stop' : 'Start'} Simulation
        </button>

        {isRunning && (
          <>
            <button 
              onClick={handlePauseResume}
              className="control-button"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>

            <button 
              onClick={handleReset}
              className="control-button reset-button"
            >
              Reset
            </button>
          </>
        )}
      </div>

      {isRunning && (
        <div className="simulation-stats">
          <h3>Simulation Parameters:</h3>
          <p>Separation: {separation}</p>
          <p>Alignment: {alignment}</p>
          <p>Cohesion: {cohesion}</p>
          <p>Status: {isPaused ? 'Paused' : 'Running'}</p>
        </div>
      )}
    </div>
  );
} 

export default Proj005BasicFlock;