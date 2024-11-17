import { useEffect, useState, useRef } from "react";
import Beetle from "./proj004Classes/Beetle.js";
import Grid from "./proj004Classes/Grid.js";

const Proj004BasicBeetleSearch = ( {gridSide = 30, numBeetles = 10, maxResourceCount = 10} ) => {
  const beetleId = useRef(0);
  const [beetles , setBeetles] = useState([]);
  const [grid, setGrid] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let newBeetles = [];
    for (let i = 0; i < numBeetles; i++) {
      const newBeetle = new Beetle(0, 0, beetleId.current, initialAntennaSize = 5, antennaCount = 2, stepSize = 5, decayRate = 0.05, minAntennaSize = 1, minStepSize = 1);
      beetleId.current += 1;
      newBeetles.push(newBeetle);
    }
    setBeetles(newBeetles);
    const newGrid = Grid(gridSide, gridSide);
    newGrid.generateResourceLevelGradient();  
    setGrid(new Grid(gridSide, gridSide));
  }, [gridSide, numBeetles, maxResourceCount]);

  useEffect(() => {
    let timeoutId;
    let animationFrameId;

    const animate = () => {
        
      timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
        //agent actions
        
      for (const beetle of beetles) {
        if (!(beetle instanceof Beetle)) continue;
        const newGrid = beetle.step(grid);
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

export default Proj004BasicBeetleSearch