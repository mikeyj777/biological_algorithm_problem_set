import Agent from "./Agent";
import { getRandomResourceClass, resourceDict, getResourceTypes } from "./Resources";

export default class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = [];
    for (let i = 0; i < width; i++) {
      this.grid[i] = [];
      for (let j = 0; j < height; j++) {
        this.grid[i][j] = [];
      }
    }
  }
}

export const generateResourceLevelGradient = (resourceType = null, maxAmountPerCell = 20, newGrid) => {
  const xMax = newGrid.width - 1;
  const yMax = newGrid.height - 1;
  
  const xOffset = Math.random();
  const yOffset = Math.random();
  console.log("xOffset: ", xOffset, "yOffset: ", yOffset);
  let x = -1;
  let y = -1;
  let resourceClass = getRandomResourceClass();
  if (resourceType) {
    resourceClass = resourceDict[resourceType];
  }
  // use a circular gradient to determine amount of each resource.
  // track min & max resource allocated to adjust the contents of all cells accordingly.
  let minResourceAmt = maxAmountPerCell * 100;
  let maxResourceAmt = 0;
  for (let i = 0; i <= xMax; i++) {
    x = i / xMax;
    for (let j = 0; j <= yMax; j++) {
      y = j / yMax;
      let resourceAmt = Math.floor(maxAmountPerCell * (1 - Math.sqrt((x-xOffset)**2 + (y-yOffset)**2)));
      resourceAmt = Math.max(0, resourceAmt);
      minResourceAmt = Math.min(minResourceAmt, resourceAmt);
      maxResourceAmt = Math.max(maxResourceAmt, resourceAmt);
      // console.log("i, ", i, ", j, ", j, "resourceAmt, ", resourceAmt);
      
      for (let m = 0; m < resourceAmt; m++) {
        const resource = new resourceClass(i, j);
        newGrid.grid[i][j].push(resource);
      }
    }
  }
  // console.log("minResourceAmt: ", minResourceAmt, "maxResourceAmt: ", maxResourceAmt);
  for (let i = 0; i <= xMax; i++) {
    for (let j = 0; j <= yMax; j++) {
      const currentResources = newGrid.grid[i][j].length;
      if (currentResources === 0) continue;
      if (maxResourceAmt === minResourceAmt) continue;
      const adjustedCount = Math.max(0, Math.floor(
        ((currentResources - minResourceAmt) / (maxResourceAmt - minResourceAmt)) * maxAmountPerCell
      ));
      // console.log("currentresources: ", currentResources, "adjustedCount: ", adjustedCount, "minResourceAmt: ", minResourceAmt, "maxResourceAmt: ", maxResourceAmt);
      if (adjustedCount <= 0) continue;
      // Adjust the actual grid - might need to add or remove resources
      while (newGrid.grid[i][j].length > adjustedCount) {
        newGrid.grid[i][j].pop();  // Remove excess resources
      }
      while (newGrid.grid[i][j].length < adjustedCount) {
        const resource = new resourceClass(i, j);
        newGrid.grid[i][j].push(resource);  // Add missing resources
      }
    }
  }
  return newGrid;
}

export const populateGrid = (agentIdRef, agentMaxMoney, numAgents, gridSide, maxResourceCount) => {
  let newGrid = new Grid(gridSide, gridSide);
  let newAgents = [];
  const MAX_ATTEMPTS = 25;
  for (let i = 0; i < numAgents; i++) { 
    let agentHere = true;
    let attempts = 0;
    while (agentHere && attempts < MAX_ATTEMPTS) {
      attempts++;
      agentHere = false;
      const x = Math.floor(Math.random() * gridSide);
      const y = Math.floor(Math.random() * gridSide); 
      // only one agent per cell
      newGrid.grid[x][y].forEach((obj) => {
        if (obj instanceof Agent) {
          agentHere = true;
          return;
        }
      })
      if (agentHere) continue;
      const agent = new Agent(x, y);
      agent.money = 0.1 * agentMaxMoney + Math.random() * 0.9 * agentMaxMoney;
      agent.id = agentIdRef.current++;
      newGrid.grid[x][y].push(agent);
      newAgents.push(agent);
      agentHere = false;
    }
  }

  // console.log("grid with agents: ", newGrid.grid);
  const resourceTypes = getResourceTypes();
  resourceTypes.forEach((resourceType) => {
    newGrid = generateResourceLevelGradient(resourceType, maxResourceCount, newGrid);
  });
  console.log("grid with agents and resources: ", newGrid.grid);
  console.log("agents from populate grid: ", newAgents);
  
  return {
    grid: newGrid,
    agents: newAgents
  };
}