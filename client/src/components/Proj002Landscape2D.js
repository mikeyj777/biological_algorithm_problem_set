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


const Proj002Landscape2D = ({optimalRatio = 0.33, maxBoostPercent = 0.5, agentMaxMoney = 1000, gridSide = 30, numAgents = 300, maxResourceCount = 10}) => {

  // optimalRatio is between 0 and 1, representing the resource mix ratio where max boost occurs
  // ratio is interms of A component to total mix (current AB and AC are possible compounds)
  // maxBoostPercent is the percentage boost at the optimal point (e.g. 0.25 for 25% boost)
  const [grid, setGrid] = useState(new Grid(gridSide, gridSide));
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState([]);
  const agentId = useRef(0);

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
          agent.grid = grid;
          agent.step();
          setGrid(agent.grid);
        }

        // render grid



      }, 500);
    };

    if (isRunning) {
        animate();
    }

    
    return () => {
        clearTimeout(timeoutId);
        cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning]);

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
    </div>

  );
}

export default Proj002Landscape2D;