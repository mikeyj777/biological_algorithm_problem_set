import { A, B, C, ResourceCollection, Mix, getRandomResourceClass , getResource, Grid, Agent} from "./Proj002Landscape2D.js";

const testMix = () => {
  const collA = new ResourceCollection("A");
  const numA = Math.floor(Math.random() * 10);
  for (let i = 0; i < numA; i++) {
    const a = new A(0, 0, 10, 100);
    collA.collection.push(a);
  }
  console.log("coll A value: ", collA.getValue());
  // console.log("coll A values: ", collA.collection.forEach(a => console.log(a.value)));

  const collB = new ResourceCollection("B");
  const numB = Math.floor(Math.random() * 10);
  for (let i = 0; i < numB; i++) {
    const b = new B(0, 0, 10, 100);
    collB.collection.push(b);
  }
  console.log("coll B value: ", collB.getValue());

  const abMix = new Mix(collA, collB);
  console.log("abMix value: ", abMix.value);
  console.log("abMix type: ", abMix.type);
  

};

const testRandomResource = () => {
  const resClass = getRandomResourceClass();
  const resInstance = new resClass(0, 0);
  const type = resInstance.type;
  console.log("type: ", type);
  const res = resInstance.value;
  console.log("value: ", res);
};

const testGetResource = () => {
  const resInstance = getResource(20*Math.random(), 30*Math.random(), "A");
  const type = resInstance.type;
  console.log("type: ", type);
  const res = resInstance.value;
  console.log("value: ", res);
  console.log("x: ", resInstance.x, "y: ", resInstance.y);
};

// testGetResource();

const testGrid = () => {
  const grid = new Grid(3, 3);
  grid.grid[0][0].push(getResource(10,20));
  grid.grid[1][2].push(getResource(3,22));
  grid.grid[0][1].push(getResource(11,12));
  grid.grid.forEach(row => {
    row.forEach(obj => {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            console.log("obj: ", obj, " | key: ", key, " | value: ", obj[key]);
        }
      }
    });
  });
};

// testGrid();

const testAgent = () => {
  const agent = new Agent(10, 15);
  console.log("agent: ", agent);
  console.log("agent x: ", agent.x, "agent y: ", agent.y);
  console.log("agent money: ", agent.money);
  console.log("agent compounds: ", agent.compounds);
  console.log("agent resource collections: ", agent.resourceCollections);

  const countA = Math.floor(Math.random() * 10);
  const countB = Math.floor(Math.random() * 10);
  const countC = Math.floor(Math.random() * 10);
  for (let i = 0; i < countA; i++) agent.resourceCollections.A.collection.push(new A(i, i+1, 10, 100));
  for (let i = 0; i < countB; i++) agent.resourceCollections.B.collection.push(new B(i+2, i+3, 10, 100));
  for (let i = 0; i < countC; i++) agent.resourceCollections.C.collection.push(new C(i+4, i+5, 10, 100));
  console.log("agent resource collections: ", agent.resourceCollections);
  console.log("agent compounds: ", agent.compounds);
};

testAgent();