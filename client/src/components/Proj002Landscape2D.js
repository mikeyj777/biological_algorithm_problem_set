import { useState, useEffect, useRef } from "react";

class Resource {
  constructor(x, y, minValue = 0, maxValue = 100) {
    this.x = x;
    this.y = y;
    this.value;
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  getValue() {
    this.value = this.minValue + Math.random() * (this.maxValue - this.minValue);
  }
}

class A extends Resource { //Aethernium 
  constructor(x, y, maxValue = 100, minValue = 30) {
    super(x, y, value);
    this.color = "#FF0000";
    this.getValue()
  }
}

class Z extends Resource { //Zephyrix
  constructor(x, y, maxValue = 200, minValue = 50) {
    super(x, y, value); 
    this.color = "#0000FF";
    this.getValue()
  }
}

class M extends Resource { //Magnophorium 
  constructor(x, y, value = 30) {
    super(x, y, value); 
    this.color = "#00FF00";
    this.value = value; // this will be updated based on the ratio of A to Z used by the agent.
  }
}


const Proj002Landscape2D = ({optimalRatio = 0.33, maxBoostPercent = 0.5}) => {

  // optimalRatio is between 0 and 1, representing the A:Z ratio where max boost occurs
  // maxBoostPercent is the percentage boost at the optimal point (e.g. 0.25 for 25% boost)
  // valueA and valueZ are the base values of the pure elements
  
  const calculateMagnophorium = (optimalRatio, maxBoostPercent) => (valueA, valueZ, ratioA) => {
    // Ensure ratio is between 0 and 1
    const ratio = Math.max(0, Math.min(1, ratioA));
    
    // Calculate the weighted average at this ratio
    const weightedAvg = valueA * ratio + valueZ * (1 - ratio);
    
    // Build quadratic that peaks at optimal ratio with maxBoost
    // and returns to weighted average at pure A (ratio=1) or pure Z (ratio=0)
    const a = -maxBoostPercent / (optimalRatio * optimalRatio - optimalRatio);
    const b = 2 * maxBoostPercent * optimalRatio / (optimalRatio * optimalRatio - optimalRatio);
    const boost = a * ratio * ratio + b * ratio;
    
    return weightedAvg * (1 + boost);
  };

  return ( 
    <div>Proj002Landscape2D</div>
  );
}

export default Proj002Landscape2D;