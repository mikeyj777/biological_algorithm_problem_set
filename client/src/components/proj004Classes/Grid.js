import Resource from "./Resources.js";

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

export const generateResourceLevelGradient = (maxAmountPerCell = 20, newGrid) => {
  const xMax = newGrid.width - 1;
  const yMax = newGrid.height - 1;
  
  const xOffset = Math.random();
  const yOffset = Math.random();
  let x = -1;
  let y = -1;
  
  // use a circular gradient to determine amount of resource.
  // track min & max resource allocated to adjust the contents of all cells accordingly.
  for (let i = 0; i <= xMax; i++) {
    x = i / xMax;
    for (let j = 0; j <= yMax; j++) {
      y = j / yMax;
      let resourceAmt = Math.floor(maxAmountPerCell * (1 - Math.sqrt((x-xOffset)**2 + (y-yOffset)**2)));
      
      for (let m = 0; m < resourceAmt; m++) {
        const resource = new Resource(i, j);
        newGrid.grid[i][j] = resource;
      }
    }
  }
  
  return newGrid;
}