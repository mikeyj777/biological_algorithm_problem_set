class Trading {
  constructor (agent1, agent2, tradeLikelihoodDistribution = null) {
    this.agent1 = agent1;
    this.agent2 = agent2;
    this.agents = {
      1:agent1, 
      2:agent2};
    this.tradeComplete = false;
    if (!tradeLikelihoodDistribution) {
      this.tradeLikelihoodDistribution = {
        "agent1buys": 0.25,
        "agent2buys": 0.25,
        "trade": 0.25,
        "noDeal": 0.25
      }
    }
    this.tradeThresholds = {};
    this.setTradeThresholds();
  }
  
  run(tradePull = null) {
    this.getHighestValueMixes();
    this.doTheDeals(tradePull);
  }

  setTradeThresholds() {
    const sum = Object.values(this.tradeLikelihoodDistribution).reduce((a, b) => a + b, 0);
    
    for (let key in this.tradeLikelihoodDistribution) {
        this.tradeLikelihoodDistribution[key] /= sum;
    }
    let tot = 0;
    for (let key in this.tradeLikelihoodDistribution) {
        tot += this.tradeLikelihoodDistribution[key];
        this.tradeThresholds[key] = tot;
    }

  }

  getHighestValueMixes() {

    const agent1 = this.agent1;
    const agent2 = this.agent2;
    this.highestValueMixes = {};
    
    // search for highest value mix
    const highestValueMix1 = null;
    for (let i = 0; i < agent1.compounds.length; i++) {
      if (!highestValueMix1) highestValueMix1 = agent1.compounds[i];
      if (agent1.compounds[i].value > highestValueMix1.value) highestValueMix1 = agent1.compounds[i];
    }

    let highestValueMix2 = null;
    for (let i = 0; i < agent2.compounds.length; i++) {
      if (!highestValueMix2) highestValueMix2 = agent2.compounds[i];
      if (agent2.compounds[i].value > highestValueMix2.value) highestValueMix2 = agent2.compounds[i];
    }
    
    highestValueMix1.value *= agent1.compoundSaleMarkup;
    highestValueMix2.value *= agent2.compoundSaleMarkup;

    this.highestValueMixes[1] = highestValueMix1;
    this.highestValueMixes[2] = highestValueMix2;
  }

  doTheDeals(tradePull = null) {
    if (!tradePull) {
      tradePull = Math.random();
    }
    
    if (tradePull > this.tradeThresholds["trade"]) return;
    
    this.tradeComplete = true;
    if (tradePull <= this.tradeThresholds["agent1buys"]) {
      this.buySell(1);
      return;
    }
    if (tradePull <= this.tradeThresholds["agent2buys"]) {
      this.buySell(2);
      return;
    }
    if (tradePull <= this.tradeThresholds["trade"]) {
      this.trade();
    }
  }

  buySell(sellerAgentNum) {
    let buyerAgentNum = 2;
    if (sellerAgentNum === 2) buyerAgentNum = 1;
    const buyerAgent = this.agents[buyerAgentNum];
    const sellerAgent = this.agents[sellerAgentNum];
    const compoundToSell = this.highestValueMixes[sellerAgentNum];
    const cost = compoundToSell.value;
    if (buyerAgent.money < cost) {
      this.tradeComplete = false;
      return;
    }
    buyerAgent.compounds.push(compoundToSell);
    sellerAgent.compounds.splice(sellerAgent.compounds.indexOf(compoundToSell), 1);
    buyerAgent.money += cost;
    sellerAgent.money -= cost;
  }

  trade() {
    this.agent1.compounds.push(this.highestValueMixes[1]);
    this.agent2.compounds.push(this.highestValueMixes[2]);
    this.agent1.compounds.splice(this.agent1.compounds.indexOf(this.highestValueMixes[1]), 1);
    this.agent2.compounds.splice(this.agent2.compounds.indexOf(this.highestValueMixes[2]), 1);
  }

}