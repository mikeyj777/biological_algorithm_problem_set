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
    this.value = -1;
    this.ratio = -1;
    this.color = "#000000";
    this.colorRGB = [0, 0, 0];
    this.getType();
    this.valid = this.mixIsValid();
    console.log("mix valid: ", this.valid);
    if (!this.valid) return;
    this.getValue();
    this.getColor();
  }

  getType() {
    if (!this.resourceCollection1 || !this.resourceCollection2) return;
    const type1char = this.resourceCollection1.type.charCodeAt(0);
    const type2char = this.resourceCollection2.type.charCodeAt(0);
    if (type1char > type2char) {
      const resColl = this.resourceCollection1;
      this.resourceCollection1 = this.resourceCollection2;
      this.resourceCollection2 = resColl;
    }
    this.type = this.resourceCollection1.type + this.resourceCollection2.type;
    console.log("mix type: ", this.type);
  }

  mixIsValid() {
    if (!this.resourceCollection1 || !this.resourceCollection2) return false;
    const requirements = mixResouceQuantityRequirementsAndValueBoosts;
    if (!(this.type in requirements)) return false;
    const requirement = requirements[this.type];
    this.maxBoostPercent = requirement["valueBoost"];
    const requiredLen1 = requirement[this.resourceCollection1.type];
    const requiredLen2 = requirement[this.resourceCollection2.type];
    return (this.resourceCollection1.collection.length >= requiredLen1 && 
            this.resourceCollection2.collection.length >= requiredLen2);
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
    const totValue = value1 + value2;
    const ratio = value1 / totValue;
    this.ratio = ratio;
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
    console.log("mix value: ", this.value);
  }

  getColor() {
    const color1rgb = this.resourceCollection1.collection[0].colorRGB;
    const color2rgb = this.resourceCollection2.collection[0].colorRGB;
    
    const r1 = color1rgb[0];
    const g1 = color1rgb[1];
    const b1 = color1rgb[2];
    const r2 = color2rgb[0];
    const g2 = color2rgb[1];
    const b2 = color2rgb[2];
    const r = Math.floor(r1 * (this.ratio) + r2 * (1-this.ratio));
    const g = Math.floor(g1 * (this.ratio) + g2 * (1-this.ratio));
    const b = Math.floor(b1 * (this.ratio) + b2 * (1-this.ratio));

    this.colorRGB = [r, g, b];
    this.color = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    console.log("mix color: ", this.color);
    console.log("mix color rgb: ", this.colorRGB);
  }
}

export const mixResouceQuantityRequirementsAndValueBoosts = {
  AB: {"A": 200, "B": 200, valueBoost: 0.25},
  AC: {"A": 500, "C": 500, valueBoost: 0.5},
  BC: {"B": 500, "C": 500, valueBoost: 2}, 
}

export const resourceDict = {
  A: A,
  B: B,
  C: C,
};

export const getResourceTypes = () => Object.keys(resourceDict);

export const getRandomResourceClass = () => {

  const resourceArray  = getResourceTypes();
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
