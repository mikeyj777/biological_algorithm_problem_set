class Trading {
  constructor (agent1, agent2, tradeLikelihoodDistribution = null) {
    this.agent1 = agent1;
    this.agent2 = agent2;
    this.agents = {
      1:agent1, 
      2:agent2};
    this.tradeComplete = false;
    this.tradeLikelihoodDistribution = tradeLikelihoodDistribution;
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
    const dealOk = this.getHighestValueMixes();
    if (!dealOk) return;
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

    this.highestValueMixes = {};
    
    let mix1 = null;
    let mix2 = null;

    if (this.agent1.compounds.length == 0 && this.agent2.compounds.length == 0) return false;

    if (this.agent1.compounds.length > 0) {
        mix1 = this.agent1.compounds.sort((a, b) => b.value - a.value)[0];
    }

    if (this.agent2.compounds.length > 0) {
        mix2 = this.agent2.compounds.sort((a, b) => b.value - a.value)[0];
    }
    
    this.highestValueMixes[1] = mix1;
    this.highestValueMixes[2] = mix2;

    console.log("highestValueMixes: ", this.highestValueMixes);

    return true;
  }

  doTheDeals(tradePull = null) {
    if (!tradePull) {
      tradePull = Math.random();
    }
    this.tradePull = tradePull;
    this.tradeComplete = false;
    if (tradePull > this.tradeThresholds["trade"]) return;
    
    if (tradePull <= this.tradeThresholds["agent1buys"]) {
      // console.log("agent1buys");
      this.buySell(1);
      return;
    }
    if (tradePull <= this.tradeThresholds["agent2buys"]) {
      // console.log("agent2buys");
      this.buySell(2);
      return;
    }
    if (tradePull <= this.tradeThresholds["trade"]) {
      // console.log("trade");
      this.trade();
    }
  }

  buySell(sellerAgentNum) {
    let buyerAgentNum = 2;
    if (sellerAgentNum === 2) buyerAgentNum = 1;
    const buyerAgent = this.agents[buyerAgentNum];
    const sellerAgent = this.agents[sellerAgentNum];
    const compoundToSell = this.highestValueMixes[sellerAgentNum];
    console.log("compoundToSell: ", compoundToSell);
    const cost = compoundToSell.sellingCosts[compoundToSell.sellingCosts.length - 1];
    // console.log("cost: ", cost);
    if (buyerAgent.money < cost) {
      return;
    }
    buyerAgent.compounds.push(compoundToSell);
    const compoundIdx = sellerAgent.compounds.indexOf(compoundToSell);
    if (compoundIdx === -1) {
      return;
    }
    sellerAgent.compounds.splice(compoundIdx, 1);
    buyerAgent.money -= cost;
    sellerAgent.money += cost;
    this.tradeComplete = true;
    this.cost = cost;
  }

  trade() {
    this.agent1.compounds.push(this.highestValueMixes[2]);
    this.agent2.compounds.push(this.highestValueMixes[1]);
    const compountIdx1 = this.agent1.compounds.indexOf(this.highestValueMixes[1]);
    if (compountIdx1 === -1) {
      return;
    }
    const compountIdx2 = this.agent2.compounds.indexOf(this.highestValueMixes[2]);
    if (compountIdx2 === -1) {
      return;
    }
    this.agent1.compounds.splice(compountIdx1, 1);
    this.agent2.compounds.splice(compountIdx2, 1);
    this.tradeComplete = true;
    this.cost = null;
  }

}

export default Trading;