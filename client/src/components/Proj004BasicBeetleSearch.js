import { useEffect, useState, useRef } from "react";
import Beetle from "./proj004Classes/Beetle.js";
import Grid from "./proj004Classes/Grid.js";

const Proj004BasicBeetleSearch = ( {gridSide = 30, numBeetles = 10, maxResourceCount = 10} ) => {
  const beetleId = useRef(0);
  const [beetles , setBeetles] = useState([]);
  const [grid, setGrid] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let newBeetles = [];
    for (let i = 0; i < numBeetles; i++) {
      const newBeetle = new Beetle(0, 0, beetleId.current);
      beetleId.current += 1;
      newBeetles.push(newBeetle);
    }
    setBeetles(newBeetles);
    setGrid(new Grid(gridSide, gridSide));
  }, [gridSide, numBeetles, maxResourceCount]);

  useEffect(() => {
    let timeoutId;
    let animationFrameId;

    const animate = () => {
        
      timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
        //agent actions
        
      for (const beetle of beetles) {
        if (!(beetle instanceof Beetle)) continue;
        const newGrid = beetle.step(grid);
        setGrid(newGrid);
      }

      }, 500);
    };

    if (isRunning) {
        animate();
    }
    return () => {
        clearTimeout(timeoutId);
        cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning]);

  return (
    <div className="container">
      Project 4
    </div>
  );
}

export default Proj004BasicBeetleSearch