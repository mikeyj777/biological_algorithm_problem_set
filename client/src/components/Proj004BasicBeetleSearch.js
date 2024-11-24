import { useEffect, useState, useRef } from "react";
import Beetle from "./proj004Classes/Beetle.js";
import Grid from "./proj004Classes/Grid.js";

const Proj004BasicBeetleSearch = ({ gridSide = 30, numBeetles = 10, maxResourceCount = 10 }) => {
  const beetleId = useRef(0);
  const [beetles, setBeetles] = useState([]);
  const [grid, setGrid] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let newBeetles = [];
    for (let i = 0; i < numBeetles; i++) {
      // Random starting positions within the grid
      const x = Math.floor(Math.random() * gridSide);
      const y = Math.floor(Math.random() * gridSide);
      const newBeetle = new Beetle(x, y, beetleId.current, 5, 2, 5, 0.05, 1, 1);
      beetleId.current += 1;
      newBeetles.push(newBeetle);
    }
    setBeetles(newBeetles);
    
    const newGrid = new Grid(gridSide, gridSide);
    newGrid.generateResourceLevelGradient(maxResourceCount);
    setGrid(newGrid);
  }, [gridSide, numBeetles, maxResourceCount]);

  useEffect(() => {
    let timeoutId;
    let animationFrameId;

    const animate = () => {
      timeoutId = setTimeout(() => {
        animationFrameId = requestAnimationFrame(animate);
        
        const updatedBeetles = beetles.map(beetle => {
          if (!(beetle instanceof Beetle)) return beetle;
          const newGrid = beetle.step(grid);
          return beetle;
        });
        
        setBeetles(updatedBeetles);
      }, 500);
    };

    if (isRunning) {
      animate();
    }
    
    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, beetles, grid]);

  const startSimulation = () => {
    setIsRunning(true);
  };

  const pauseSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    const newGrid = new Grid(gridSide, gridSide);
    newGrid.generateResourceLevelGradient(maxResourceCount);
    setGrid(newGrid);
    
    let newBeetles = [];
    for (let i = 0; i < numBeetles; i++) {
      const x = Math.floor(Math.random() * gridSide);
      const y = Math.floor(Math.random() * gridSide);
      const newBeetle = new Beetle(x, y, beetleId.current, 5, 2, 5, 0.05, 1, 1);
      beetleId.current += 1;
      newBeetles.push(newBeetle);
    }
    setBeetles(newBeetles);
  };

  const getCellColor = (cell) => {
    if (!cell || cell.length === 0) return '#fff';
    if (cell instanceof Resource) return cell.color;
    return '#fff';
  };

  const getBeetlePosition = (x, y) => {
    return {
      left: `${(x / gridSide) * 100}%`,
      top: `${(y / gridSide) * 100}%`
    };
  };

  return (
    <div className="game-container">
      <h1 className="text-2xl font-bold mb-4">Beetle Search Simulation</h1>
      <div className="controls space-x-4 mb-4">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={startSimulation} 
          disabled={isRunning}
        >
          Start
        </button>
        <button 
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          onClick={pauseSimulation} 
          disabled={!isRunning}
        >
          Pause
        </button>
        <button 
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={resetSimulation}
        >
          Reset
        </button>
      </div>

      <div className="grid-container">
        <div 
          className="grid relative"
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
          {grid && grid.grid.flat().map((cell, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: getCellColor(cell),
                width: '100%',
                paddingBottom: '100%',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
          
          {/* Render beetles and their antennae */}
          {beetles.map((beetle) => (
            <div key={beetle.id} className="absolute">
              {/* Beetle body */}
              <div
                className="w-2 h-2 rounded-full absolute"
                style={{
                  ...getBeetlePosition(beetle.x, beetle.y),
                  backgroundColor: beetle.color,
                  transform: 'translate(-50%, -50%)'
                }}
              />
              
              {/* Beetle antennae */}
              {beetle.antennae.map((antenna, idx) => (
                <div
                  key={idx}
                  className="absolute w-1 bg-red-500"
                  style={{
                    ...getBeetlePosition(beetle.x, beetle.y),
                    height: `${antenna.size}px`,
                    transform: `translate(-50%, -50%) rotate(${antenna.angle}rad)`,
                    transformOrigin: '0 0'
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Proj004BasicBeetleSearch;