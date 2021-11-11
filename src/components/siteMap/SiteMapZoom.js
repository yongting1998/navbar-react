import React, { createRef, useEffect, useState, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const SiteMapZoom = () => {
  const canvasRef = useRef();
  const contextRef = useRef(null);

  /**Picture node*/
  const [imgElement, setImgElement] = useState(new Image());
  /**Display image size*/
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [selected, setSelected] = useState();
  const [isDrawing, setIsDrawing] = useState(false);
  const [pointsList, setPointsList] = useState([]);
  const [points, setPoints] = useState([]);
  const [startPoint, setStartPoint] = useState({});

  useEffect(() => {
    console.log(selected);
    /**Initializes a picture node object*/
    const background = new Image();
    background.src = "http://i.imgur.com/yf6d9SX.jpg";
    background.onload = () => {
      const canvas = canvasRef.current;
      const width = background.naturalWidth;
      const height = background.naturalHeight;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.style.border = "1px solid black";

      const context = canvas.getContext("2d");

      // context.scale(view.zoom, view.zoom);
      // context.translate(-view.x, -view.y);
      context.drawImage(background, 0, 0);

      //   context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = "black";
      context.lineWidth = 5;
      contextRef.current = context;
      contextRef.current.beginPath();
      contextRef.current.lineWidth = 3;

      setSize({ width, height });
      setImgElement(background);
    };
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (points.length === 0) {
      contextRef.current.moveTo(offsetX, offsetY);
      contextRef.current.rect(offsetX, offsetY, 20, 20);
      setStartPoint({ offsetX, offsetY });
      setPoints([...points, { offsetX, offsetY }]);
    } else {
      if (isStart(offsetX, offsetY)) {
        console.log("END");
        contextRef.current.lineTo(startPoint.offsetX, startPoint.offsetY);
        contextRef.current.closePath();
        setPointsList([...pointsList, points]);
        setPoints([]);
      } else {
        contextRef.current.lineTo(offsetX, offsetY);
        setPoints([...points, { offsetX, offsetY }]);
      }
    }
    contextRef.current.stroke();
  };

  function isStart(offsetX, offsetY) {
    if (offsetX >= startPoint.offsetX && offsetX <= startPoint.offsetX + 20) {
      if (offsetY >= startPoint.offsetY && offsetY <= startPoint.offsetY + 20) {
        return true;
      }
    } else {
      return false;
    }
  }

  return (
    <div style={{ display: "flex"}}>
      <TransformWrapper
        panning={{ disabled: selected == "draw" ? true : false }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => {
          return (
            <React.Fragment>
              <TransformComponent pan={{ disabled: true }}>
                <canvas
                  ref={canvasRef}
                  onMouseDown={(event) => {
                    if (selected == "draw") {
                      startDrawing(event);
                    }
                  }}
                ></canvas>
              </TransformComponent>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50px",
                  margin: 5,
                }}
              >
                <button onClick={() => zoomIn()}>+</button>
                <button onClick={() => zoomOut()}>-</button>
                <button onClick={() => resetTransform()}>x</button>
                <button
                  name="btn-pan"
                  className=""
                  onClick={() => setSelected("pan")}
                >
                  <span style={{ fontSize: "14px" }}>Pan</span>
                </button>
                <button
                  name="btn-draw"
                  className=""
                  onClick={() => setSelected("draw")}
                >
                  <span style={{ fontSize: "14px" }}>Draw</span>
                </button>
              </div>
            </React.Fragment>
          );
        }}
      </TransformWrapper>
    </div>
  );
};

export default SiteMapZoom;
