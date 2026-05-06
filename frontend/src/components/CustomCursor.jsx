import { useEffect, useRef } from "react";
import "./CustomCursor.css";

const circles = [
  {
    size: 8,
    color: "#2563eb",
    className: "custom-cursor__circle custom-cursor__circle--dot",
  },
  {
    size: 22,
    color: "rgba(37, 99, 235, 0.4)",
    className: "custom-cursor__circle custom-cursor__circle--mid",
  },
  {
    size: 36,
    color: "rgba(37, 99, 235, 0.15)",
    className: "custom-cursor__circle custom-cursor__circle--outer",
  },
];

function CustomCursor() {
  const circleRefs = useRef([]);

  useEffect(() => {
    const positions = circles.map(() => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }));
    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    let animationFrameId;

    const moveCursor = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const setHoverState = (isHovering) => {
      const outerCircleNode = circleRefs.current[2];
      if (!outerCircleNode) return;

      outerCircleNode.style.setProperty("--cursor-scale", isHovering ? "1.45" : "1");
      outerCircleNode.style.opacity = isHovering ? "1" : "0.85";
    };

    const handlePointerOver = (event) => {
      if (event.target.closest("button, a")) {
        setHoverState(true);
      }
    };

    const handlePointerOut = (event) => {
      if (event.target.closest("button, a")) {
        setHoverState(false);
      }
    };

    const animateCursor = () => {
      positions[0].x = mouse.x;
      positions[0].y = mouse.y;

      for (let index = 1; index < positions.length; index += 1) {
        positions[index].x += (positions[index - 1].x - positions[index].x) * 0.2;
        positions[index].y += (positions[index - 1].y - positions[index].y) * 0.2;
      }

      circleRefs.current.forEach((circle, index) => {
        if (!circle) return;

        circle.style.left = `${positions[index].x}px`;
        circle.style.top = `${positions[index].y}px`;
      });

      animationFrameId = requestAnimationFrame(animateCursor);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handlePointerOver);
    document.addEventListener("mouseout", handlePointerOut);
    animationFrameId = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handlePointerOver);
      document.removeEventListener("mouseout", handlePointerOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {circles.map((circle, index) => (
        <span
          aria-hidden="true"
          className={circle.className}
          key={circle.size}
          ref={(element) => {
            circleRefs.current[index] = element;
          }}
          style={{
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            backgroundColor: circle.color,
          }}
        />
      ))}
    </>
  );
}

export default CustomCursor;