import { Resource, Mix, ResourceCollection , getResourceTypes, resourceDict} from "./Resources";

class Agent {
  constructor(x, y, money = 0, chanceOfMix = 0.25) {
    this.x = x;
    this.y = y;
    this.id = -1;
    this.money = money;
    this.chanceOfMix = chanceOfMix;
    this.compounds = [];
    this.resourceCollections = {
      A: new ResourceCollection("A"),
      B: new ResourceCollection("B"),
      C: new ResourceCollection("C"),
    };
    this.grid = null;
  }

  makeMix(type1, type2, chanceOfMix = null) {
    if (!chanceOfMix) chanceOfMix = this.chanceOfMix;
    if (Math.random() > this.chanceOfMix) return;
    if (!this.resourceCollections[type1].collection.length) return;
    if (!this.resourceCollections[type2].collection.length) return;
    const mix = new Mix(this.resourceCollections[type1], this.resourceCollections[type2]);
    this.compounds.push(mix);
  }

  step(grid = null) {
    // pick up resources
    if (grid) this.grid = grid; 
    this.gatherResources();
    // make mix

    // trade mixes
    // drop mixes
    //agents take a step (diagonal allowed as long as no agents are present)
    
    // this.move();

    
    
    
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
        console.log("agent id: ", this.id, " | type of resource pulled: ", type, " | x: ", res.x, " | y: ", res.y, " | value: ", res.value, "resource Collection: ", this.resourceCollections[type]);
      }
    }
  }

  move() {
    const grid = this.grid;
    const previousPosition = {x: this.x, y: this.y};
    let attempts = 0;
    const MAX_ATTEMPTS = 25;
    const xMax = grid.width - 1;
    const yMax = grid.height - 1;
    let x = this.x;
    let y = this.y;
    let validXmoves = [];
    let validYmoves = [];
    const moveIncrements = [-1, 0, 1];
    let agentHere = true;
    while (agentHere && attempts < MAX_ATTEMPTS) {
      attempts++;
      agentHere = false;
      moveIncrements.forEach( (increment) => {
        if (x + increment <= xMax && x - increment >=0 ) validXmoves.push(increment)
        if (y + increment <= yMax && y - increment >=0 ) validYmoves.push(increment)
      });
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
    // Check if agent actually moved
    if (previousPosition.x === x && previousPosition.y === y) return;
    
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