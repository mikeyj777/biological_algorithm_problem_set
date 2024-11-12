/*

Project 2: Resource Landscape

Create a 2D environment with resources
Learning goals:

Gradient creation
Value visualization
Environment interaction
Basic optimization concepts

*/

// import { useState, useEffect, useRef } from "react";

export class Resource {
  constructor(x, y, minValue = 0, maxValue = 100) {
    this.x = x;
    this.y = y;
    this.type = null;
    this.color = "#FF0000";
    this.colorRGB = [255, 0, 0];
    this.value = -1;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.getValue();
  }

  getValue() {
    this.value = this.minValue + Math.random() * (this.maxValue - this.minValue);
  }
}

export class A extends Resource { //Aethernium
  constructor(x, y, maxValue = 100, minValue = 30) {
    super(x, y, minValue, maxValue);
    this.type = "A";
    this.colorRGB = [255, 0, 0];
    this.color = "#FF0000";
  }
}

export class B extends Resource { //Blazilite
  constructor(x, y, maxValue = 100, minValue = 30) {
    super(x, y, minValue, maxValue);
    this.type = "B";
    this.colorRGB = [0, 255, 0];
    this.color = "#00FF00";
  }
}

export class C extends Resource { //Chronite
  constructor(x, y, maxValue = 100, minValue = 30) {
    super(x, y, maxValue, minValue);
    this.type = "C";
    this.colorRGB = [0, 0, 255];
    this.color = "#0000FF";
  }
}

export class ResourceCollection {
  constructor(type = "A"){
    this.type = type;
    this.collection = [];

  }

  getValue() {
    let value = 0;
    this.collection.forEach((resource) => {
      value += resource.value;
    });
    return value;
  }
}

export class Mix {
  constructor(resourceCollection1, resourceCollection2, optimalRatio = 0.33, maxBoostPercent = 0.5) {
    this.type = "Mix";
    this.resourceCollection1 = resourceCollection1;
    this.resourceCollection2 = resourceCollection2;
    this.optimalRatio = optimalRatio;
    this.maxBoostPercent = maxBoostPercent;
    this.value;
    this.getType();
    this.getValue();
  }

  getType() {
    if (!this.resourceCollection1 || !this.resourceCollection2) return;
    this.type = this.resourceCollection1.type + this.resourceCollection2.type;
  }

  getValue() {
    // optimal ratio is the most valuable combination of the two resources.  
    // at this point, the value is boosted above the max of either resource value
    // this method uses the total value of the two resource collections 
    if (!this.resourceCollection1 || !this.resourceCollection2) return;
    let value1 = 0;
    this.resourceCollection1.collection.forEach((resource) => {
      value1 += resource.value;
    });
    let value2 = 0;
    this.resourceCollection2.collection.forEach((resource) => {
      value2 += resource.value;
    });
    let totValue = value1 + value2;
    let ratio = value1 / totValue;
    let boosted = (1+this.maxBoostPercent) * Math.max(value1, value2);
    const m1 = (boosted - value1) / (this.optimalRatio);
    const b1 = boosted - m1 * this.optimalRatio;
    const m2 = (value2 - boosted) / (1 - this.optimalRatio);
    const b2 = value2 - m2 * 1;
    let m = m1;
    let b = b1;
    if (ratio > this.optimalRatio) {
      m = m2;
      b = b2;
    }
    this.value = m * ratio + b;
  }
}

export const resourceDict = {
  A: A,
  B: B,
  C: C,
};

export const getRandomResourceClass = () => {

  const resourceArray  = Object.keys(resourceDict);
  const randomNumber = Math.random();
  const resourceIndex  = Math.floor(randomNumber * resourceArray.length);
  const randomKey = resourceArray[resourceIndex];
  const resourceClass  = resourceDict[randomKey];

  return resourceClass;
};

export const getResource = (x, y, type = null) => {
  if (type) return new resourceDict[type](x, y);

  const resourceClass = getRandomResourceClass();
  const resourceInstance = new resourceClass(x, y);
  return resourceInstance;
}

export class Grid {
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

export class Agent {
  constructor(x, y, money = 0, chanceOfMix = 0.25) {
    this.x = x;
    this.y = y;
    this.money = money;
    this.chanceOfMix = chanceOfMix;
    this.compounds = [];
    this.resourceCollections = {
      A: new ResourceCollection("A"),
      B: new ResourceCollection("B"),
      C: new ResourceCollection("C"),
    };
  }

  makeMix(type1, type2) {
    if (Math.random() > this.chanceOfMix) return;
    if (!this.resourceCollections[type1].collection.length) return;
    if (!this.resourceCollections[type2].collection.length) return;
    const mix = new Mix(this.resourceCollections[type1], this.resourceCollections[type2]);
    this.compounds.push(mix);
  }


}

// export const generateResourceLevelGradient = (resourceType = null, maxAmountPerCell = 20, newGrid) => {
//   const xMax = newGrid.width - 1;
//   const yMax = newGrid.height - 1;
//   const xOffset = Math.random();
//   const yOffset = Math.random();
//   let x;
//   const xStep = xMax / 100;
//   let y;
//   const yStep = yMax / 100;
//   const resourceClass = getRandomResourceClass();
//   if (resourceType) {
//     resourceClass = resourceDict[resourceType];
//   }
//   // use a circular gradient to determine amount of each resource.
//   // track min resource allocated to adjust the contents of all cells accordingly.
//   let minResourceAmt = maxAmountPerCell * 100;
//   let maxResourceAmt = 0;
//   for (let i = 0; i < xMax; i++) {
//     x = Math.floor(i * xStep);
//     for (let j = 0; j < yMax; j++) {
//       y = Math.floor(j * yStep);
//       let resourceAmt = Math.floor(maxAmountPerCell * (1 - Math.sqrt((x-xOffset)**2 + (y-yOffset)**2)));
//       resourceAmt = Math.max(0, resourceAmt - minResourceAmt);
//       minResourceAmt = Math.min(minResourceAmt, resourceAmt);
//       maxResourceAmt = Math.max(maxResourceAmt, resourceAmt);
      
//       for (let i = 0; i < resourceAmt; i++) {
//         const resource = resourceClass(x, y);
//         newGrid.grid[i][j].push(resource);
//       }
//     }
//   }

//   for (let i = 0; i < xMax; i++) {
//     for (let j = 0; j < yMax; j++) {
//       const currentResources = newGrid.grid[i][j].length;
//       const adjustedCount = Math.floor(
//         ((currentResources - minResourceAmt) / (maxResourceAmt - minResourceAmt)) * maxAmountPerCell
//       );
      
//       // Adjust the actual grid - might need to add or remove resources
//       while (newGrid.grid[i][j].length > adjustedCount) {
//         newGrid.grid[i][j].pop();  // Remove excess resources
//       }
//       while (newGrid.grid[i][j].length < adjustedCount) {
//         const resource = resourceClass(i, j);
//         newGrid.grid[i][j].push(resource);  // Add missing resources
//       }
//     }
//   }
//   return newGrid;
// }

// const Proj002Landscape2D = ({optimalRatio = 0.33, maxBoostPercent = 0.5, agentMaxMoney = 1000, gridSide = 30, numAgents = 300, maxResourceCount = 300}) => {

//   // optimalRatio is between 0 and 1, representing the resource mix ratio where max boost occurs
//   // ratio is interms of A component to total mix (current AB and AC are possible compounds)
//   // maxBoostPercent is the percentage boost at the optimal point (e.g. 0.25 for 25% boost)
//   const [grid, setGrid] = useEffect(new Grid(gridSide, gridSide));
//   const [isRunning, setIsRunning] = useState(false);

//   const populateGrid = () => {
//     for (let i = 0; i < numAgents; i++) { 
//       let agentHere = true;
//       while (agentHere) {
//         agentHere = false;
//         const x = Math.floor(Math.random() * gridSide);
//         const y = Math.floor(Math.random() * gridSide); 
//         // only one agent per cell
//         if (grid.grid[x][y] instanceof Agent) continue;
//         grid.grid[x][y].forEach((obj) => {
//           if (obj instanceof Agent) {
//             agentHere = true;
//             return;
//           }
//         })
//         if (agentHere) continue;
//         const agent = new Agent(x, y);
//         agent.money = 0.1 * agentMaxMoney + Math.random() * 0.9 * agentMaxMoney;
//         grid.grid[x][y].push(agent);  
//         agentHere = false;
//       }
//     }

//     for (let i = 0; i < maxResourceCount; i++) {
//       const x = Math.floor(Math.random() * gridSide);
//       const y = Math.floor(Math.random() * gridSide);
//       // resources can exist anywhere regardless of current occupancy in cell.
//       const resource = getResource(x, y);
//       grid.grid[x][y].push(resource);
//     }

//     return newGrid;
//   }


//   useEffect(() => {
//     setGrid(populateGrid());
//   }, [gridSide, numAgents]);
  
//   useEffect(() => {
//     let timeoutId;
//     let animationFrameId;

//     const animate = () => {
        
//       setGrid(populateGrid());
//       const resourceArray  = Object.keys(resourceDict);
//       resourceArray.forEach((resourceType) => {
//         const maxAmountPerCell = 10 + Math.floor(Math.random() * 10);
//         setGrid(generateResourceLevelGradient(resourceType, maxAmountPerCell, grid));
//       })

//       timeoutId = setTimeout(() => {
//         animationFrameId = requestAnimationFrame(animate);
//       }, 500);
//     };

//     if (isRunning) {
//         animate();
//     }

    
//     return () => {
//         clearTimeout(timeoutId);
//         cancelAnimationFrame(animationFrameId);
//     };
//   }, [isRunning]);

// const startSimulation = () => { 
//   setIsRunning(true);
// }

// const pauseSimulation = () => {
//   setIsRunning(false);
// }

// const resetSimulation = () => {
//   setIsRunning(false);
//   setGrid(Array(gridSide).fill().map(() => Array(gridSide).fill([])));
//   populateGrid();
// }

//   return ( 
    
//     <div className="game-container">
//       <h1 className="game-title">2D Landscape</h1>
//       <div className="controls">
//         <button onClick={startSimulation} disabled={isRunning}>Start</button>
//         <button onClick={pauseSimulation} disabled={!isRunning}>Pause</button>
//         <button onClick={resetSimulation}>Reset</button>
//       </div>
//     </div>

//   );
// }

// export default Proj002Landscape2D;