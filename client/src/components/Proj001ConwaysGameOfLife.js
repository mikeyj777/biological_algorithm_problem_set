/*

Build Conway's Game with probability rules
Learning goals:

Basic emergence concepts
Probabilistic rules
Grid-based simulation
Visual feedback

*/

import { useEffect, useState, useRef } from "react";
import "../styles/Proj001.css";

class Agent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alive = false;
    this.neighborsAlive = 0;
    this.id = 0;
  }

  countNeighborsAlive(agents, gridSide) {
    this.neighborsAlive = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue; // Skip self
        
        const neighborX = this.x + i;
        const neighborY = this.y + j;
        
        // Check bounds
        if (neighborX < 0 || neighborX >= gridSide || neighborY < 0 || neighborY >= gridSide) {
          continue;
        }

        const neighbor = agents.find(
          (a) => a && a.x === neighborX && a.y === neighborY
        );
        
        if (neighbor && neighbor.alive) {
          this.neighborsAlive++;
        }
      }
    }
  }

  toggleAlive() {
    this.alive = !this.alive;
  };
}

const Proj001ConwaysGameOfLife = ({numAgents = 1000, gridSide = 50}) => {
  const [agents, setAgents] = useState([]);
  const [grid, setGrid] = useState(Array(gridSide).fill().map(() => Array(gridSide).fill(false)));
  const [isRunning, setIsRunning] = useState(false);
  const firstUpdate = useRef(true);

  const getDisplayGrid = () => {
    const newGrid = Array(gridSide).fill().map(() => Array(gridSide).fill(false));
    agents.forEach(agent => {
      if (!agent) {
        return;
      }
      if (agent.alive) {
        newGrid[agent.x][agent.y] = true;
      }
    });
    setGrid(newGrid);
  };

  const update = () => {
    setAgents(prevAgents => {
      const newAgents = [...prevAgents];
      
      // First pass: count neighbors using current state
      newAgents.forEach(agent => {
        if (!agent) return;
        agent.countNeighborsAlive(newAgents, gridSide);
      });

      // Second pass: update states based on counted neighbors
      let alives = 0;
      newAgents.forEach(agent => {
        if (!agent) return;
        
        if (agent.alive && (agent.neighborsAlive < 2 || agent.neighborsAlive > 3)) {
          agent.toggleAlive();
        } else if (!agent.alive && agent.neighborsAlive === 3) {
          agent.toggleAlive();
        }
        if (agent.alive) alives++;
      });

      console.log("Living cells:", alives);
      return newAgents;
    });
  };

  const generateAgents = () => {
    const newAgents = [];
    let agentId = 0;

    // Maya: "Let's compose a symphony of patterns!"
    const patterns = {
      glider: [[0, 0], [1, 0], [2, 0], [2, 1], [1, 2]],
      blinker: [[0, 0], [0, 1], [0, 2]],
      beacon: [[0, 0], [1, 0], [0, 1], [1, 1], [2, 2], [3, 2], [2, 3], [3, 3]],
      pulsar: [
        // Top section
        [2, 4], [2, 5], [2, 6], [2, 10], [2, 11], [2, 12],
        [4, 2], [5, 2], [6, 2], [10, 2], [11, 2], [12, 2],
        [4, 7], [5, 7], [6, 7], [10, 7], [11, 7], [12, 7],
        [7, 4], [7, 5], [7, 6], [7, 10], [7, 11], [7, 12],
        // Bottom section (mirrored)
        [9, 4], [9, 5], [9, 6], [9, 10], [9, 11], [9, 12],
        [4, 9], [5, 9], [6, 9], [10, 9], [11, 9], [12, 9]
      ],
      pentadecathlon: [
        [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
        [0, 6], [0, 7], [0, 8], [0, 9]
      ],
      lwss: [ // Lightweight spaceship
        [0, 0], [0, 3], [1, 4], [2, 0], 
        [2, 4], [3, 1], [3, 2], [3, 3], [3, 4]
      ]
    };

    // Kai: "Let's create multiple pattern instances at strategic locations"
    const patternPlacements = [
      // Quadrant 1
      { pattern: 'glider', x: 5, y: 5 },
      { pattern: 'lwss', x: 20, y: 5 },
      
      // Quadrant 2
      { pattern: 'pulsar', x: 15, y: 15 }, // Centered
      
      // Quadrant 3
      { pattern: 'pentadecathlon', x: 35, y: 30 },
      
      // Quadrant 4
      { pattern: 'beacon', x: 40, y: 40 },
      { pattern: 'glider', x: 25, y: 35 }
  ];

    patternPlacements.forEach(placement => {
        const pattern = patterns[placement.pattern];
        pattern.forEach(([dx, dy]) => {
            const x = (placement.x + dx) % gridSide;
            const y = (placement.y + dy) % gridSide;
            
            // Check if position is already occupied
            if (!newAgents.some(agent => agent && agent.x === x && agent.y === y)) {
                const newAgent = new Agent(x, y);
                newAgent.id = agentId++;
                newAgent.alive = true;
                newAgents.push(newAgent);
            }
        });
    });

    console.log(`Generated ${newAgents.length} living cells in patterns`);
    setAgents(newAgents);
  };

  useEffect(() => {
    let timeoutId;
    let animationFrameId;

    const animate = () => {
        update();
        getDisplayGrid();
        
        // Maya: "Like a heartbeat, schedule the next pulse"
        timeoutId = setTimeout(() => {
            animationFrameId = requestAnimationFrame(animate);
        }, 500);
    };

    if (isRunning) {
        animate();
    }

    // Maya: "Clean up both rhythms when they stop"
    return () => {
        clearTimeout(timeoutId);
        cancelAnimationFrame(animationFrameId);
    };
}, [isRunning]); // The core rhythm depends only on isRunning

// Add a separate effect for initial setup
  useEffect(() => {
    generateAgents();
  }, []); // Run once on mount

  const startSimulation = () => { 
    setIsRunning(true);
  }

  const pauseSimulation = () => {
    setIsRunning(false);
  }

  const resetSimulation = () => {
    setIsRunning(false);
    setAgents([]);
    setGrid(Array(gridSide).fill().map(() => Array(gridSide).fill(false)));
    generateAgents();
  }


  return (
    <div className="game-container">
        <h1 className="game-title">Conway's Game of Life</h1>
        <div className="controls">
            <button onClick={startSimulation} disabled={isRunning}>Start</button>
            <button onClick={pauseSimulation} disabled={!isRunning}>Pause</button>
            <button onClick={resetSimulation}>Reset</button>
            <span className="grid-info">
                Grid: {gridSide}×{gridSide} | Active Patterns: {
                    agents.filter(a => a && a.alive).length
                }
            </span>
        </div>
        <div 
          className="game-grid" 
          style={{
              gridTemplateColumns: `repeat(${gridSide}, 1fr)`,
              gridTemplateRows: `repeat(${gridSide}, 1fr)`  // Add this for explicit rows
          }}
        >
            {grid.map((row, x) => 
                row.map((isAlive, y) => (
                    <div
                        key={`${x}-${y}`}
                        className={`cell ${isAlive ? 'alive' : ''}`}
                        title={`(${x},${y}): ${isAlive}`}
                    />
                ))
            )}
        </div>
    </div>
);
};

export default Proj001ConwaysGameOfLife;