import { A, B, C, ResourceCollection, Mix } from "./Proj002Landscape2D.js";

const test = () => {
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

test();