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

  countNeighborsAlive(agents) {
    this.neighborsAlive = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const neighbor = agents.find(
          (a) => a.x === this.x + i && a.y === this.y + j
        );
        if (neighbor && neighbor.alive) {
          this.neighborsAlive++;
        }
      }
    }
  };

  toggleAlive() {
    this.alive = !this.alive;
  };
}

const Proj001ConwaysGameOfLife = ({numAgents = 600, gridSide = 30}) => {
  const [agents, setAgents] = useState([]);
  const [grid, setGrid] = useState(Array(gridSide).fill().map(() => Array(gridSide).fill(false)));
  const [isRunning, setIsRunning] = useState(false);
  const firstUpdate = useRef(true);

  const getDisplayGrid = () => {
    console.log("getDisplayGrid called");
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
    console.log("update called");
    setAgents(prevAgents => {
      const newAgents = [...prevAgents];
      let alives = 0;
      for (const agent of newAgents) {
        if (!agent) {
          continue;
        }
        console.log("first update: ", firstUpdate.current);
        if (firstUpdate.current) {
          console.log("agent id: ", agent.id, "agent alive: ", agent.alive, " neighborsAlive: ", agent.neighborsAlive);
        }
        
        agent.countNeighborsAlive(agents);
        if (agent.alive && (agent.neighborsAlive < 2 || agent.neighborsAlive > 3)) {
          agent.toggleAlive();
        } else if (!agent.alive && agent.neighborsAlive === 3) {
          agent.toggleAlive();
        }
        if (agent.alive) {
          alives++;
        }
      }
      console.log("updated alives: ", alives);
      return newAgents;
    });
    firstUpdate.current = false;
  };

  const generateAgents = () => {
    console.log("generateAgents called");
    const newAgents = []; 
    let agentId = 0;
    let alives = 0;
    for (let i = 0; i < numAgents; i++) {
      let agentHere = true;
      let x;
      let y;
      let angentPlacementAttempt = 0;
      while (agentHere && angentPlacementAttempt < numAgents && agentId < numAgents) {
        angentPlacementAttempt++;
        agentHere = false;
        x = Math.floor(Math.random() * gridSide);
        y = Math.floor(Math.random() * gridSide);
        for (let j = 0; j < i; j++) {
          if (!newAgents[j]) {
            continue;
          }

          if (newAgents[j].x === x && newAgents[j].y === y) {
            agentHere = true;
            break;
          }
        }
      }
      if (!agentHere) {
        const newAgent = new Agent(x, y);
        newAgent.id = agentId++;
        newAgent.alive = Math.random() < 0.9;
        if (newAgent.alive) {
          alives++;
        }
        // console.log("newAgent id: ", newAgent.id, " x: ", newAgent.x, " y: ", newAgent.y, " alive: ", newAgent.alive);
        newAgents.push(newAgent);
      }
    }
    console.log("generated alives: ", alives);
    setAgents(newAgents);
  };

  useEffect(() => {
    console.log("useEffect called");
    let animationFrame;

    if (isRunning) {
      const timeoutId = setTimeout(() => {
        animationFrame = requestAnimationFrame(() => {
          // console.log("requestAnimationFrame called");
          update();
          getDisplayGrid();
        });
      }, 500); 
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };

  }, [isRunning]);

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
      </div>
      <div 
        className="game-grid" 
        style={{
          gridTemplateColumns: `repeat(${gridSide}, 1fr)`
        }}
      >
        {grid.map((row, x) => 
          row.map((isAlive, y) => (
            
            <div
              key={`${x}-${y}`}
              className={`cell ${isAlive ? 'alive' : ''}`}
              title={`(${x},${y}): ${isAlive}`} // Hover to see info
              onClick={() => console.log(`Clicked cell (${x},${y}): ${isAlive}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Proj001ConwaysGameOfLife;