import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    // to prevent a memory link method1:
    // const cleanUp = () => {
    //   console.log("runs if a useEffect dependency changes");
    //   window.removeEventListener("resize", handleResize);
    // };

    // return cleanUp;

    //method2. they're basically the same thing:
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
