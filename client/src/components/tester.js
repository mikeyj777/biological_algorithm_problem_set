import { A, B, C, Mix, ResourceCollection } from "./proj002Classes/Resources.js";
import Trading from "./proj002Classes/Trading.js";
import Agent from "./proj002Classes/Agent.js";

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

for (let i = 0; i < 100; i++) {
  const trading = new Trading(agent1, agent2);
  trading.run();
  // console.log("idx: ", i, " | trading complete: ", trading.tradeComplete, " | trade pull: ", trading.tradePull, " | cost: ", trading.cost, " | agent1 money: ", agent1.money, " | agent2 money: ", agent2.money, " | highest value mix 1: ", trading.highestValueMixes[1].sellingCosts[trading.highestValueMixes[1].sellingCosts.length - 1], " | highest value mix 2: ", trading.highestValueMixes[2].sellingCosts[trading.highestValueMixes[2].sellingCosts.length - 1]);

   // Add row data
   results.push([
    i,
    trading.tradeComplete,
    trading.tradePull,
    trading.cost,
    agent1.money,
    agent2.money,
    trading.highestValueMixes[1].sellingCosts[trading.highestValueMixes[1].sellingCosts.length - 1],
    trading.highestValueMixes[2].sellingCosts[trading.highestValueMixes[2].sellingCosts.length - 1]
  ]);
}
  
// Convert array to CSV string
const csvContent = results.map(row => row.join(',')).join('\n');

// Create and download the CSV file
const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.setAttribute('download', 'trading_results.csv');
document.body.appendChild(link);
link.click();
document.body.removeChild(link);