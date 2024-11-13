class Trading {
  constructor (agent1, agent2, tradeLikelihood = 0.7) {
    this.agent1 = agent1;
    this.agent2 = agent2;
    this.tradeLikelihood = tradeLikelihood;

  }
  
  run() {
    
  }

  getHighestValueMixes() {

    const agent1 = this.agent1;
    const agent2 = this.agent2;
    
    // search for highest value mix
    let highestValueMix1 = null;
    for (let i = 0; i < agent1.compounds.length; i++) {
      if (!highestValueMix1) highestValueMix1 = agent1.compounds[i];
      if (agent1.compounds[i].value > highestValueMix1.value) highestValueMix1 = agent1.compounds[i];
    }

    let highestValueMix2 = null;
    for (let i = 0; i < agent2.compounds.length; i++) {
      if (!highestValueMix2) highestValueMix2 = agent2.compounds[i];
      if (agent2.compounds[i].value > highestValueMix2.value) highestValueMix2 = agent2.compounds[i];
    }
    
    tradeAgent.compounds.push(highestValueMix);
    this.compounds.splice(this.compounds.indexOf(highestValueMix), 1);
  }