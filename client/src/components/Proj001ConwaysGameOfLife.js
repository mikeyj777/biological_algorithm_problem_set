/*

Build Conway's Game with probability rules
Learning goals:

Basic emergence concepts
Probabilistic rules
Grid-based simulation
Visual feedback

*/

import { useEffect, useState } from "react";

class Agent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alive = false;
    this.neighborsAlive = 0;
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

const Proj001ConwaysGameOfLife = ({numAgents = 100, gridSide = 100, numGenerations = 100}) => {
  const [agents, setAgents] = useState([]);

  const gridSide = 100;

  useEffect(() => {
    const newAgents = []; 
    for (let i = 0; i < numAgents; i++) {
      let agentHere = true;
      let x;
      let y;
      while (agentHere) {
        agentHere = false;
        x = Math.floor(Math.random() * gridSide);
        y = Math.floor(Math.random() * gridSide);
        for (let j = 0; j < i; j++) {
          if (newAgents[j].x === x || newAgents[j].y === y) {
            agentHere = true;
            break;
          }
        }
      }
      newAgents.push(new Agent(x, y));
    }
    setAgents(newAgents);
  }, [numAgents]);


useEffect(() => {
  const update = () => {
    const newAgents = [];
    for (const agent of agents) {
      agent.countNeighborsAlive(agents);
      if (agent.alive && (agent.neighborsAlive < 2 || agent.neighborsAlive > 3)) {
        agent.toggleAlive();
      } else if (!agent.alive && agent.neighborsAlive === 3) {
        agent.toggleAlive();
      }
      newAgents.push(agent);
    }
    setAgents(newAgents);
  };

  for (let i = 0; i < numGenerations; i++) {
    update();
  }

}, [gridSide, numGenerations]);

  return (
    <div>
      <h1>Conways Game of Life</h1>
      <div className="grid">
        {agents.map((agent) => (
          <div
            key={`${agent.x}-${agent.y}`}
            className={`cell ${agent.alive ? "alive" : ""}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Proj001ConwaysGameOfLife;