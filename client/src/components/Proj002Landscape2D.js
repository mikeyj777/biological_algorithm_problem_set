import { useState, useEffect, useRef } from "react";

class Resource {
  constructor(x, y, minValue = 0, maxValue = 100) {
    this.x = x;
    this.y = y;
    this.type = null;
    this.color = "#FF0000";
    this.colorRGB = [255, 0, 0];
    this.value = -1;
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  getValue() {
    this.value = this.minValue + Math.random() * (this.maxValue - this.minValue);
  }
}

class A extends Resource { //Aethernium
  constructor(x, y, maxValue = 100, minValue = 30) {
    super(x, y, minValue, maxValue);
    this.type = "A";
    this.colorRGB = [255, 0, 0];
    this.color = "#FF0000";
    this.getValue()
  }
}

class B extends Resource { //Blazilite
  constructor(x, y, maxValue = 100, minValue = 30) {
    super(x, y, minValue, maxValue);
    this.type = "B";
    this.colorRGB = [0, 255, 0];
    this.color = "#00FF00";
    this.getValue()
  }
}

class C extends Resource { //Chronite
  constructor(x, y, maxValue = 100, minValue = 30) {
    super(x, y, value);
    this.type = "C";
    this.colorRGB = [0, 0, 255];
    this.color = "#0000FF";
    this.getValue()
  }
}

class ResourceCollection {
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

class Mix {
  constructor(resourceCollection1, resourceCollection2, optimalRatio = 0.33, maxBoostPercent = 0.5) {
    this.type = "Mix";
    this.resourceCollection1 = resourceCollection1;
    this.resourceCollection2 = resourceCollection2;
    this.optimalRatio = optimalRatio;
    this.maxBoostPercent = maxBoostPercent;
    this.getType();
    this.getValue();
  }

  getType() {
    if (!this.resourceCollection1 || !this.resourceCollection2) return;
    this.type = this.collectionResource1.type + this.collectionResouce2.type;
  }

  getValue() {
    // optimal ratio is the most valuable combination of the two resources.  
    // at this point, the value is boosted above the max of either resource value
    // this method uses the total value of the two resource collections 
    if (!this.resourceCollection1 || !this.collectionResouce2) return;
    let value1 = 0;
    this.collectionResource1.collection.forEach((resource) => {
      value1 += resource.value;
    });
    let value2 = 0;
    this.collectionResouce2.collection.forEach((resource) => {
      value2 += resource.value;
    });
    let totValue = value1 + value2;
    let ratio = value1 / totValue;
    let boosted = this.maxBoostPercent * Math.max(value1, value2);
    const m1 = (boosted - value1) / (this.optimalRatio);
    const b1 = boosted - m * this.optimalRatio;
    const m2 = (value2 - boosted) / (1 - this.optimalRatio);
    const b2 = value2 - m2 * (1 - this.optimalRatio);
    if (ratio <= this.optimalRatio) {
      this.value = m1 * ratio + b1;
    } else {
      this.value = m2 * ratio + b2;
    }
  }
}

const resourceDict = {
  A: A,
  B: B,
  C: C,
};

const getResource = (x, y) => {
  let resourceArray  = Object.keys(resourceDict);
  let randomNumber = Math.random();
  let resourceIndex  = Math.floor(randomNumber * resourceArray.length);
  let randomKey    = resourceArray[resourceIndex];
  let resourceClass  = resourceDict[randomKey];
  let resourceInstance = new resourceClass(x, y);
  return resourceInstance;
}

class Grid {
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

class Agent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.resourceCollections = {
      A: new ResourceCollection("A"),
      B: new ResourceCollection("B"),
      C: new ResourceCollection("C"),
    };
    this.compounds = [];
    this.money = 0;
  }

}

const Proj002Landscape2D = ({optimalRatio = 0.33, maxBoostPercent = 0.5, agentMaxMoney = 1000, gridSide = 30, numAgents = 300, maxResourceCount = 300}) => {

  // optimalRatio is between 0 and 1, representing the resource mix ratio where max boost occurs
  // ratio is interms of A component to other component (current AB and AC are possible compounds)
  // maxBoostPercent is the percentage boost at the optimal point (e.g. 0.25 for 25% boost)
  const grid = new Grid(gridSide, gridSide);
  
  const poulateGrid = () => {
    for (let i = 0; i < numAgents; i++) { 
      let agentHere = true;
      while (agentHere) {
        agentHere = false;
        const x = Math.floor(Math.random() * gridSide);
        const y = Math.floor(Math.random() * gridSide); 
        // only one agent per cell
        if (grid.grid[x][y] instanceof Agent) continue;
        grid.grid[x][y].forEach((obj) => {
          if (obj instanceof Agent) {
            agentHere = true;
            return;
          }
        })
        if (agentHere) continue;
        const agent = new Agent(x, y);
        agent.money = 0.1 * agentMaxMoney + Math.random() * 0.9 * agentMaxMoney;
        grid.grid[x][y].push(agent);  
        agentHere = false;
      }
    }

    for (let i = 0; i < maxResourceCount; i++) {
      const x = Math.floor(Math.random() * gridSide);
      const y = Math.floor(Math.random() * gridSide);
      // resources can exist anywhere regardless of current occupancy in cell.
      const resource = getResource(x, y);
      grid.grid[x][y].push(resource);
    }

    return newGrid;
  }


  useEffect(() => {
    const newGrid = populateGrid();
    setGrid(newGrid);
  }, [gridSide, numAgents]);
  

  return ( 
    <div>Proj002Landscape2D</div>
  );
}

export default Proj002Landscape2D;