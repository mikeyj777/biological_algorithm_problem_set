import { A, B, C, Mix, ResourceCollection } from "./proj002Classes/Resources.js";
import Trading from "./proj002Classes/Trading.js";
import Agent from "./proj002Classes/Agent.js";
import Grid from "./proj002Classes/Grid.js";

// Create array to store all results
const results = [];

// Add header row
results.push(['index', 'tradeComplete', 'tradePull', 'cost', 'agent1Money', 'agent2Money', 'highestValueMix1', 'highestValueMix2']);

const resCollA = new ResourceCollection("A");
const resCollB = new ResourceCollection("B");
const resCollC = new ResourceCollection("C");

for (let i = 0; i < Math.floor(9000 * Math.random() + 1000); i++) resCollA.collection.push(new A(i, i));
for (let i = 0; i < Math.floor(9000 * Math.random() + 1000); i++) resCollB.collection.push(new B(i, i));
for (let i = 0; i < Math.floor(9000 * Math.random() + 1000); i++) resCollC.collection.push(new C(i, i));

const mixAB = new Mix(resCollA, resCollB);
const mixAC = new Mix(resCollA, resCollC);
const mixBC = new Mix(resCollB, resCollC);

const agent1 = new Agent(0,0, 10000000);
agent1.compounds.push(mixAB, mixAC, mixBC, mixAB, mixAC, mixBC, mixAB, mixAC, mixBC, mixAB, mixAC, mixBC, mixAB, mixAC, mixBC);

const agent2 = new Agent(0,0, 10000000);
agent2.compounds.push(mixAC, mixBC, mixAB, mixAC, mixBC, mixAB, mixAC, mixBC, mixAB, mixAC, mixBC, mixAB, mixAC, mixBC);

agent1.maxCompoundInventory = 5;
agent1.grid = new Grid(100, 100);
agent1.x = 5;
agent1.y = 5;
agent1.dropMixes();

  
