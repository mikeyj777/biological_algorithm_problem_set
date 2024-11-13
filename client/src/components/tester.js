import { A, B, C, Mix, ResourceCollection } from "./proj002Classes/Resources.js";
import Trading from "./proj002Classes/Trading.js";
import Agent from "./proj002Classes/Agent.js";

const resCollA = new ResourceCollection("A");
const resCollB = new ResourceCollection("B");
const resCollC = new ResourceCollection("C");

for (let i = 0; i < Math.floor(9000 * Math.random() + 1000); i++) resCollA.collection.push(new A(i, i));
for (let i = 0; i < Math.floor(9000 * Math.random() + 1000); i++) resCollB.collection.push(new B(i, i));
for (let i = 0; i < Math.floor(9000 * Math.random() + 1000); i++) resCollC.collection.push(new C(i, i));

const mixAB = new Mix(resCollA, resCollB);
const mixAC = new Mix(resCollA, resCollC);
const mixBC = new Mix(resCollB, resCollC);

const agent1 = new Agent(0,0, 100000);
agent1.compounds.push(mixAB, mixAC);

const agent2 = new Agent(0,0, 100000);
agent2.compounds.push(mixAC, mixBC);

const trading = new Trading(agent1, agent2);
console.log("trading likelihoods: ", trading.tradeLikelihoodDistribution);
console.log("trading thresholds: ", trading.tradeThresholds);
trading.run();