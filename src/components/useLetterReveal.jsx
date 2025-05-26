import { useState, useEffect, useRef } from "react";

export function useLetterReveal(targetText, defaultText, speed = 0.25) {
  const [displayText, setDisplayText] = useState(defaultText);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("forward"); // "forward" | "backward"
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const animationFrame = useRef();

  const startAnimation = () => {
    if (isAnimating) return;
    setDirection("forward");
    setIsAnimating(true);
  };

  const reverseAnimation = () => {
    if (isAnimating) return;
    setDirection("backward");
    setIsAnimating(true);
  };

  useEffect(() => {
    if (!isAnimating) return;

    let iteration = 0;

    const activeTarget = direction === "forward" ? targetText : defaultText;

    const updateText = () => {
      let result = "";

      for (let i = 0; i < activeTarget.length; i++) {
        if (i < iteration) {
          result += activeTarget[i];
        } else if (activeTarget[i] === " ") {
          result += " ";
        } else {
          result += letters[Math.floor(Math.random() * letters.length)];
        }
      }

      setDisplayText(result);

      if (iteration <= activeTarget.length) {
        iteration += speed;
        animationFrame.current = requestAnimationFrame(updateText);
      } else {
        setIsAnimating(false);
      }
    };

    updateText();

    return () => cancelAnimationFrame(animationFrame.current);
  }, [isAnimating, targetText, defaultText, speed, direction]);

  return { displayText, startAnimation, reverseAnimation };
}
