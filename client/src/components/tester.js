import { Resource } from "./Proj002Landscape2D.js";

const test = () => {
  const r = new Resource(0, 0, 0, 100);
  r.getValue();
  console.log(r.value); // 0-100
};

test();