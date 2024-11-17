export default class Beetle {
  constructor(x, y, id = -1, initialAntennaSize = 5, antennaCount = 2, stepSize = 5, decayRate = 0.05, minAntennaSize = 1, minStepSize = 1) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.color = "#FFC0CB";
    this.antennae = [];
    this.antennaCount = antennaCount;
    this.makeAntennae();
    this.initialAntennaSize = initialAntennaSize;
    this.minAntennaSize = minAntennaSize;
    this.stepSize = stepSize;
    this.decayRate = decayRate;
    this.minStepSize = minStepSize;
    this.maxValueSensed = 0;
    this.memory = [];
  }

  makeAntennae() {
    let plusMinus = 1;
    for (let i = 0; i < 2; i++) {
      const antenna = new Antenna(this, this.initialAntennaSize, plusMinus);
      plusMinus *= -1;
      this.antennae.push(antenna);
    }
  }

  step(grid) {
    
    // record greatest value from each antenna
    this.getAntennaValues(grid);  
    // move in direction of greatest value
    this.move();
    // reduce step size
    this.updateAntennaAndStepSize();

    return grid;
  }
  
  getAntennaValues(grid) {
    // sense whats around from both antennae
    let angle;
    let xy;
    for (const antenna of this.antennae) {
      value = antenna.sense(grid);
      if (value > this.maxValueSensed) {
        angle = antenna.angle;
        xy = antenna.xy;
        this.maxValueSensed = value;
      }
    }
    this.storeMemory({maxValue, angle, xy});
  }
  storeMemory(memDict) {
    this.memory.push(memDict);
  }

  move() {
    const latestMemory = this.memory[this.memory.length - 1];
    const angle = latestMemory.angle;
    this.x += this.stepSize * Math.cos(angle);
    this.y += this.stepSize * Math.sin(angle);
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
  }
  updateAntennaAndStepSize() {
    for (let i = 0; i < this.antennae.length; i++) {
      if (this.antennae[i].size > this.minAntennaSize) {
        this.antennae[i].size -= this.antennae[i].size * this.decayRate;
        this.antennae[i].setXy(this.x, this.y);
      }
      if (this.stepSize > this.minStepSize) {
        this.stepSize -= this.stepSize * this.decayRate;
      }
    }
  }

}

class Antenna {
  constructor(beetleId, antennaSize, plusMinus = 1) {
    this.beetleId = beetleId;
    this.angle = plusMinus * Math.PI / 4;
    this.color = "#FF0000";
    this.size = antennaSize;
    this.xy = {x: 0, y: 0};
  }

  setXy(beetleX, beetleY) {
    this.x = Math.floor(beetleX + this.size * Math.cos(this.angle));
    this.y = Math.floor(beetleY + this.size * Math.sin(this.angle));
    this.xy = {x: this.x, y: this.y};
  }
  
  sense(grid) {
    cell = grid.grid(this.x, this.y);
    
    if (!cell) return 0;
    if (cell instanceof Resource) return cell.value;
  }

}