import { useEffect, useRef } from "react";
import "./CustomCursor.css";

const circles = [
  {
    size: 6,
    className: "custom-cursor__circle custom-cursor__circle--core",
  },
  {
    size: 22,
    className: "custom-cursor__circle custom-cursor__circle--ring",
  },
  {
    size: 30,
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
    let interactiveElements = [];

    const moveCursor = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const setHoverState = (isHovering) => {
      const middleCircleNode = circleRefs.current[1];
      const outerCircleNode = circleRefs.current[2];

      if (middleCircleNode) {
        middleCircleNode.style.setProperty("--cursor-scale", isHovering ? "1.2" : "1");
      }

      if (outerCircleNode) {
        outerCircleNode.style.setProperty("--cursor-scale", isHovering ? "1.5" : "1");
        outerCircleNode.style.opacity = isHovering ? "1" : "0.85";
      }
    };

    const handleMouseEnter = () => setHoverState(true);
    const handleMouseLeave = () => setHoverState(false);

    const bindInteractiveElements = () => {
      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });

      interactiveElements = Array.from(
        document.querySelectorAll("button, a, .clickable"),
      );

      interactiveElements.forEach((element) => {
        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);
      });
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
    bindInteractiveElements();
    animationFrameId = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
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
          }}
        />
      ))}
    </>
  );
}

export default CustomCursor;
