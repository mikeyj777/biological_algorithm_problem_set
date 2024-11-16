/*

Project 2: Resource Landscape

Create a 2D environment with resources
Learning goals:

Gradient creation
Value visualization
Environment interaction
Basic optimization concepts

*/

import { useState, useEffect, useRef } from "react";
import Grid, { populateGrid } from "./proj002Classes/Grid";
import Agent from "./proj002Classes/Agent";
import '../styles/Proj002.css';


const Proj002Landscape2D = ({optimalRatio = 0.33, maxBoostPercent = 0.5, agentMaxMoney = 1000000, gridSide = 30, numAgents = 300, maxResourceCount = 10}) => {

  // optimalRatio is between 0 and 1, representing the resource mix ratio where max boost occurs
  // ratio is interms of A component to total mix (current AB and AC are possible compounds)
  // maxBoostPercent is the percentage boost at the optimal point (e.g. 0.25 for 25% boost)
  const [grid, setGrid] = useState(new Grid(gridSide, gridSide));
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState([]);
  const agentId = useRef(0);

  const getCellColor = (cell) => {
    // use color of top object to shade the cell.
    let idx = cell.length - 1;
    while (idx >= 0) {
      if ('color' in cell[idx]) return cell[idx].color;
      idx--;
    } 
    
    return '#f0f0f0';
  }

  useEffect(() => {
    const gridAndAgents = populateGrid(agentId, agentMaxMoney, numAgents, gridSide, maxResourceCount);
    setGrid(gridAndAgents.grid);
    setAgents(gridAndAgents.agents);
  }, [gridSide, numAgents]);

  useEffect(() => {
    let timeoutId;
    let animationFrameId;

    const animate = () => {
        
      timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
        //agent actions
        
      for (const agent of agents) {
        if (!(agent instanceof Agent)) continue;
        const newGrid = agent.step(grid);
        setGrid(newGrid);
      }

      }, 500);
    };

    if (isRunning) {
        animate();
    }
    return () => {
        clearTimeout(timeoutId);
        cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, agents, grid]);

  const startSimulation = () => { 
    const gridAndAgents = populateGrid(agentId, agentMaxMoney, numAgents, gridSide, maxResourceCount);
    setGrid(gridAndAgents.grid);
    setAgents(gridAndAgents.agents);
    setIsRunning(true);
  }

  const pauseSimulation = () => {
    setIsRunning(false);
  }

  const resetSimulation = () => {
    setIsRunning(false);
    setGrid(Array(gridSide).fill().map(() => Array(gridSide).fill([])));
  }

  return ( 
    
    <div className="game-container">
      <h1 className="game-title">2D Landscape</h1>
      <div className="controls">
        <button onClick={startSimulation} disabled={isRunning}>Start</button>
        <button onClick={pauseSimulation} disabled={!isRunning}>Pause</button>
        <button onClick={resetSimulation}>Reset</button>
      </div>

      <div className="grid-container">
        <div 
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSide}, 1fr)`,
            gap: '1px',
            backgroundColor: '#ddd',
            padding: '1px',
            width: 'min(90vw, 600px)',
            height: 'min(90vw, 600px)',
            margin: '20px auto'
          }}
        >
          {grid.grid.flat().map((cell, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: getCellColor(cell),
                width: '100%',
                paddingBottom: '100%', // This creates square cells
                transition: 'background-color 0.3s',
                position: 'relative'
              }}
              title={`Cell ${idx}: ${JSON.stringify(cell)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Proj002Landscape2D;