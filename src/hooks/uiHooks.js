import React from "react";
import { useState, useEffect } from "react";

export function useScreenWidth() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
    useEffect(() => {
      function handleResize() {
        setScreenWidth(window.innerWidth);
      }
  
      // Add an event listener for the resize event.
      window.addEventListener('resize', handleResize);
  
      // Cleanup the event listener when the component unmounts.
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
    return screenWidth;
  }