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
