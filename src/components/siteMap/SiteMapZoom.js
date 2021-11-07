import React, { createRef, useEffect, useState, useRef } from "react";

const SiteMapZoom = () => {
  const canvasRef = createRef();
  const contextRef = useRef(null);

  /**Picture node*/
  const [imgElement, setImgElement] = useState(new Image());
  /**Display image size*/
  const [size, setSize] = useState({ width: 0, height: 0 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [pointsList, setPointsList] = useState([]);
  const [points, setPoints] = useState([]);
  const [startPoint, setStartPoint] = useState({});

  const [scaleFactor, setScaleFactor] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });


  useEffect(() => {
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

  const zoomPan = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.resetTransform();
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.save();
    ctx.translate(size.width / 2, size.height / 2);
    ctx.scale(scaleFactor, scaleFactor);
    ctx.translate(pan.x, pan.y);
    ctx.drawImage(
      imgElement,
      size.width / -2,
      size.height / -2,
      size.width,
      size.height
    );
    ctx.restore();
  };

  const handlePan = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (event.buttons === 1) {
      pan.x += event.movementX;
      pan.y += event.movementY;

      zoomPan();
    }
  };

  /**Scrolling*/
  const handleZoom = (event) => {
    event.stopPropagation();
    if (event.deltaY > 0) {
      setScaleFactor(scaleFactor * 1.1);
    } else {
      setScaleFactor(scaleFactor / 1.1);
    }
    zoomPan();
  };

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

  useEffect(() => {
    zoomPan();
  }, [scaleFactor]);

  return (
    <div style={{ display: "flex" }}>
      <canvas
        ref={canvasRef}
        onWheel={handleZoom}
        onMouseDown={startDrawing}
        onMouseMove={handlePan}
      ></canvas>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50px",
          margin: 5,
        }}
      >
        <button name="btn-zoomin" className=""  onClick={() => setScaleFactor(scaleFactor * 1.1)}>
          <span>&#43;</span>
        </button>
        <button name="btn-zoomout" className="" onClick={() => setScaleFactor(scaleFactor / 1.1)}>
          <span>&#8722;</span>
        </button>
        <button name="btn-resetZoom" className="" onClick={() => setScaleFactor(1.0)}>
          <span style={{ fontSize: "14px" }}>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default SiteMapZoom;
