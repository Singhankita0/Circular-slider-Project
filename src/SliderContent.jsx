import React from "react";
import "./styles.css";
import { useEffect, useRef, useState } from "react";

const SliderContent = () => {
  function App() {
    const [sliderOneDeg, setSliderOneDeg] = useState(218.8);
    const [sliderTwoDeg, setSliderTwoDeg] = useState(176.4);
    const [sliderOnePos, setSliderOnePos] = useState({ x: 0, y: 0 });
    const [sliderTwoPos, setSliderTwoPos] = useState({ x: 0, y: 0 });
    const circleRef = useRef(null);
    const sliderOneRef = useRef(null);
    const sliderTwoRef = useRef(null);

    useEffect(() => {
      const handleSliderPos = (radius, theta, deg, setSliderValues) => {
        const X = radius * Math.cos(theta);
        const Y = radius * Math.sin(theta);
        // if (X > 0) {
        //   X -= 8;
        // } else {
        //   X += 8;
        // }

        // if (Y > 0) {
        //   Y -= 8;
        // } else {
        //   Y += 8;
        // }
        setSliderValues(deg, { x: X + radius, y: Y + radius });
      };

      const handleSliderMove = (event, deg, setSliderValues) => {
        let degCopy = deg;
        let radius = circleRef.current.clientWidth / 2;
        let circlePos = {
          x: circleRef.current.offsetLeft,
          y: circleRef.current.offsetTop,
        };
        let theta = (degCopy * Math.PI) / 180;

        let mousePos = {
          x: event.clientX - (circlePos.x + radius),
          y: event.clientY - (circlePos.y + radius),
        };
        theta = Math.atan(mousePos.y / mousePos.x);

        // quadrant 2
        if (mousePos.x < 0 && mousePos.y > 0) {
          theta += Math.PI;
          // quadrant 3
        } else if (mousePos.x < 0 && mousePos.y <= 0) {
          theta += Math.PI;
          // quadrant 4
        } else if (mousePos.x > 0 && mousePos.y <= 0) {
          theta += 2 * Math.PI;
        }

        degCopy = (theta * 180) / Math.PI + 90;
        if (degCopy > 360) {
          degCopy = degCopy - 90;
        }
        handleSliderPos(radius, theta, degCopy, setSliderValues);
      };

      if (
        circleRef.current &&
        !sliderOnePos.x &&
        !sliderOnePos.y &&
        !sliderTwoPos.x &&
        !sliderTwoPos.y
      ) {
        const radius = circleRef.current.clientWidth / 2;
        const thetaOne = ((sliderOneDeg - 90) * Math.PI) / 180;
        handleSliderPos(radius, thetaOne, sliderOneDeg, (_deg, pos) => {
          setSliderOnePos(pos);
        });

        const thetaTwo = ((sliderTwoDeg - 90) * Math.PI) / 180;
        handleSliderPos(radius, thetaTwo, sliderTwoDeg, (_deg, pos) => {
          setSliderTwoPos(pos);
        });
      }

      if (circleRef.current && sliderOneRef.current && sliderTwoRef.current) {
        let mouseDownOnCircle = false,
          mouseDownOnSliderOne = false,
          mouseDownOnSliderTwo = false;

        circleRef.current.addEventListener("mousedown", function (e) {
          mouseDownOnCircle = true;
        });
        circleRef.current.addEventListener("mouseup", function (e) {
          mouseDownOnCircle = false;
        });

        sliderOneRef.current.addEventListener("mousedown", function (e) {
          mouseDownOnSliderOne = true;
        });
        sliderOneRef.current.addEventListener("mouseup", function (e) {
          mouseDownOnSliderOne = false;
        });

        sliderTwoRef.current.addEventListener("mousedown", function (e) {
          mouseDownOnSliderTwo = true;
        });
        sliderTwoRef.current.addEventListener("mouseup", function (e) {
          mouseDownOnSliderTwo = false;
        });

        circleRef.current.addEventListener("mousemove", function (e) {
          if (mouseDownOnCircle && mouseDownOnSliderOne) {
            handleSliderMove(e, sliderOneDeg, (deg, pos) => {
              if (deg > 180 && deg < 324) {
                console.log(deg);
                setSliderOneDeg(deg);
                setSliderOnePos(pos);
              }
            });
          } else if (mouseDownOnCircle && mouseDownOnSliderTwo) {
            handleSliderMove(e, sliderTwoDeg, (deg, pos) => {
              console.log(deg);
              if (deg < 180) {
                console.log(deg);
                setSliderTwoDeg(deg);
                setSliderTwoPos(pos);
              }
            });
          }
        });
      }
    }, [sliderOneDeg, sliderTwoDeg, sliderOnePos, sliderTwoPos]);
  }

  return (
    <>
      <div className="container">
        <div
          id="circle"
          ref={circleRef}
          style={{
            backgroundImage: `conic-gradient(blue 0deg, blue ${sliderTwoDeg}deg, orange ${sliderTwoDeg}deg, orange ${sliderOneDeg}deg, gray ${sliderOneDeg}deg, gray 324deg, yellow 324deg`,
          }}
        >
          <div id="inner-circle"></div>
          <div
            id="slider-one"
            ref={sliderOneRef}
            style={{ left: `${sliderOnePos.x}px`, top: `${sliderOnePos.y}px` }}
          ></div>
          <div
            id="slider-two"
            ref={sliderTwoRef}
            style={{ left: `${sliderTwoPos.x}px`, top: `${sliderTwoPos.y}px` }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default SliderContent;
