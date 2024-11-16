class Beetle {
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
  }

  makeAntennae() {
    let plusMinus = 1;
    for (let i = 0; i < 2; i++) {
      const antenna = new Antenna(this, this.initialAntennaSize, plusMinus);
      plusMinus *= -1;
      this.antennae.push(antenna);
    }
  }

  updateAntennaAndStepSize() {
    for (let i = 0; i < this.antennae.length; i++) {
      if (this.antennae[i].size > this.minAntennaSize) {
        this.antennae[i].size -= this.antennae[i].size * this.decayRate;
      }
      if (this.stepSize > this.minStepSize) {
        this.stepSize -= this.stepSize * this.decayRate;
      }
    }
  }

  storeMemory() {
    return;
  }

  move() {
    return;
  }

  optimize() {
    // chose optimal movement
    return;
  }

}

class Antenna {
  constructor(beetleId, antennaSize, plusMinus = 1) {
    this.beetleId = beetleId;
    this.angle = plusMinus * Math.PI / 4;
    this.color = "#FF0000";
    this.size = antennaSize;
  }

  sense(cell) {
    if (!cell) return 0;
    if (cell instanceof Resource) return cell.value;
  }

}