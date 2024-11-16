import { Resource, Mix, ResourceCollection , getResourceTypes, resourceDict} from "./Resources.js";
import Trading from "./Trading.js";

class Agent {
  constructor(x, y, money = 0, chanceOfMix = 0.25, compoundSaleMarkup = 0.1, maxCompoundInventory = 50) {
    this.x = x;
    this.y = y;
    this.id = -1;
    this.money = money;
    this.chanceOfMix = chanceOfMix;
    this.compoundSaleMarkup = compoundSaleMarkup;
    this.maxCompoundInventory = maxCompoundInventory;
    this.compounds = [];
    this.resourceCollections = {
      A: new ResourceCollection("A"),
      B: new ResourceCollection("B"),
      C: new ResourceCollection("C"),
    }
    this.grid = null;
    this.color = "#3b82f6";
  }

  step(grid = null) {
    if (grid) this.grid = grid; 
    this.gatherResources();
    this.makeMix();
    this.tradeMixes();
    // drop mixes once you have over a certain amount
    this.dropMixes();
    this.move();

  }

  getValidMoves(x = null, y = null) {
    if (!x) x = this.x;
    if (!y) y = this.y;
    const moveIncrements = [-1, 0, 1];
    const xMax = this.grid.width - 1; 
    const yMax = this.grid.height - 1;
    let validXmoves = [];
    let validYmoves = [];
    moveIncrements.forEach( (increment) => {
      if (x + increment <= xMax && x - increment >=0 ) validXmoves.push(x + increment)
      if (y + increment <= yMax && y - increment >=0 ) validYmoves.push(y + increment)
    });

    return {validXmoves, validYmoves};
  }

  gatherResources(maxResourcesToCollectPerStep = 5) {
    const grid = this.grid;
    const x = this.x;
    const y = this.y;
    let resourceCount = 0;
    if (grid.grid[x][y].length === 0) return;
    // one of the grid elements is an agent.  
    if (grid.grid[x][y].length < maxResourcesToCollectPerStep) maxResourcesToCollectPerStep = grid.grid[x][y].length - 1;
    while (resourceCount < maxResourcesToCollectPerStep && grid.grid[x][y].length > 1) {
      if (grid.grid[x][y].length < maxResourcesToCollectPerStep) maxResourcesToCollectPerStep = grid.grid[x][y].length - 1;
      const idxPulled = Math.floor(Math.random() * grid.grid[x][y].length);
      if (grid.grid[x][y][idxPulled] instanceof Resource) {
        const type = grid.grid[x][y][idxPulled].type;
        const res = grid.grid[x][y][idxPulled];
        resourceCount++;
        this.resourceCollections[type].collection.push(res);
        grid.grid[x][y].splice(idxPulled, 1);
        // console.log("agent id: ", this.id, " | type of resource pulled: ", type, " | x: ", res.x, " | y: ", res.y, " | value: ", res.value, "resource Collection: ", this.resourceCollections[type]);
      }
    }
  }

  makeMix() {
    const resourceCollctionTypes = Object.keys(this.resourceCollections);
    const type1 = resourceCollctionTypes[Math.floor(Math.random() * resourceCollctionTypes.length)];
    let type2 = resourceCollctionTypes[Math.floor(Math.random() * resourceCollctionTypes.length)];
    const MAX_ATTEMPTS = 25;
    let attempts = 0;
    while (type1 === type2 && attempts < MAX_ATTEMPTS) {
      attempts++;
      type2 = resourceCollctionTypes[Math.floor(Math.random() * resourceCollctionTypes.length)];
    };
    if (attempts >= MAX_ATTEMPTS) return;
    const mix = new Mix(this.resourceCollections[type1], this.resourceCollections[type2]);
    this.compounds.push(mix);
  }

  tradeMixes() {
    // look for nearby agents
    const grid = this.grid;
    const valiDirections = this.getValidMoves();
    const validXdirections = valiDirections.validXmoves;
    const validYdirections = valiDirections.validYmoves;
    let attempts = 0;
    const MAX_ATTEMPTS = 25;
    let agentFound = false;
    let tradeAgent = null;
    while (!agentFound && attempts < MAX_ATTEMPTS) {
      attempts++;
      const x = validXdirections[Math.floor(Math.random() * validXdirections.length)];
      const y = validYdirections[Math.floor(Math.random() * validYdirections.length)];
      if (x === 0 && y === 0) continue;
      for (let i = 0; i < grid.grid[x][y].length; i++) {
        if (grid.grid[x][y][i] instanceof Agent) {
          agentFound = true;
          tradeAgent = grid.grid[x][y][i];
          break;
        }
      }
    }
    
    if (!tradeAgent) return;
    const trading = new Trading(this, tradeAgent);
    trading.run();
  }

  dropMixes() {
    
    if (this.compounds.length <= this.maxCompoundInventory) {
        return;
    }
    
    const updatedCompounds = [...this.compounds].sort((a, b) => b.value - a.value);
    const compoundsToDrop = updatedCompounds.slice(this.maxCompoundInventory);
    this.compounds = updatedCompounds.slice(0, this.maxCompoundInventory);
    
    let dropIndex = 0;
    
    // Relative coordinates for all 8 directions at each radius
    const getDirections = (radius) => [
        [radius, 0],    // right
        [radius, radius],   // bottom-right
        [0, radius],    // bottom
        [-radius, radius],  // bottom-left
        [-radius, 0],   // left
        [-radius, -radius], // top-left
        [0, -radius],   // top
        [radius, -radius]   // top-right
    ];

    // Try radius 1 drops first
    const innerDrops = getDirections(1);
    for (const [dx, dy] of innerDrops) {
        if (dropIndex >= compoundsToDrop.length) break;
        
        const dropX = this.x + dx;
        const dropY = this.y + dy;
        
        if (dropX >= 0 && dropX < this.grid.width && 
            dropY >= 0 && dropY < this.grid.height) {
            this.grid.grid[dropX][dropY].push(compoundsToDrop[dropIndex]);
            dropIndex++;
            console.log("drop index: ", dropIndex, "x position: ", dropX, "y position: ", dropY, "compound dropped: ", compoundsToDrop[dropIndex]);
        }
    }
    
    // Then radius 2 drops for remaining compounds
    if (dropIndex < compoundsToDrop.length) {
        const outerDrops = getDirections(2);
        for (const [dx, dy] of outerDrops) {
            if (dropIndex >= compoundsToDrop.length) break;
            
            const dropX = this.x + dx;
            const dropY = this.y + dy;
            
            if (dropX >= 0 && dropX < this.grid.width && 
                dropY >= 0 && dropY < this.grid.height) {
                this.grid.grid[dropX][dropY].push(compoundsToDrop[dropIndex]);
                dropIndex++;
                console.log("drop index: ", dropIndex, "x position: ", dropX, "y position: ", dropY, "compound dropped: ", compoundsToDrop[dropIndex]);
            }
        }
    }
    
    // If we still have compounds to drop, place them at any valid radius 2 location
    while (dropIndex < compoundsToDrop.length) {
        const angle = Math.random() * 2 * Math.PI;
        const dropX = Math.round(this.x + 2 * Math.cos(angle));
        const dropY = Math.round(this.y + 2 * Math.sin(angle));
        
        if (dropX >= 0 && dropX < this.grid.width && 
            dropY >= 0 && dropY < this.grid.height) {
            this.grid.grid[dropX][dropY].push(compoundsToDrop[dropIndex]);
            dropIndex++;
            console.log("drop index: ", dropIndex, "x position: ", dropX, "y position: ", dropY, "compound dropped: ", compoundsToDrop[dropIndex]);
        }
    }
  }

  move() {
    const grid = this.grid;
    const previousPosition = {x: this.x, y: this.y};
    let attempts = 0;
    const MAX_ATTEMPTS = 25;
    let x = this.x;
    let y = this.y;
    let agentHere = true;
    while (agentHere && attempts < MAX_ATTEMPTS) {
      attempts++;
      agentHere = false;
      const validMoves = this.getValidMoves(x, y);
      const validXmoves = validMoves.validXmoves;
      const validYmoves = validMoves.validYmoves;
      const xMove = validXmoves[Math.floor(Math.random() * validXmoves.length)];
      const yMove = validYmoves[Math.floor(Math.random() * validYmoves.length)];

      // if agent isn't moving, break out of this loop
      if (xMove === 0 && yMove === 0) break;
      x += xMove;
      y += yMove;
      for (let i = 0; i < grid.grid[x][y].length; i++) {
        if (grid.grid[x][y][i] instanceof Agent) {
          agentHere = true;
          break;
        }
      }
      
    }
    
    // Remove agent from old position
    const oldCell = grid.grid[previousPosition.x][previousPosition.y];
    const agentIndex = oldCell.findIndex(item => item instanceof Agent && item.id === this.id);
    if (agentIndex !== -1) oldCell.splice(agentIndex, 1);
    
    this.x = x;
    this.y = y;
    // Add agent to new position
    grid.grid[x][y].push(this);

  }
}

export default Agent;