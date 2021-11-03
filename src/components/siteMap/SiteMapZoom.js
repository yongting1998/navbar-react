import React, { createRef, useEffect, useState, useRef } from "react";


var click;

const SiteMapZoom = () => {
  const canvasRef = createRef();
  const contextRef = useRef(null);

  /**Record whether the mouse is pressed*/
  const [mouseDowmFlag, setMouseDowmFlag] = useState(false);
  /**Record the coordinates of the mouse down*/
  const [mouseDowmPos, setMouseDowmPos] = useState({ x: 0, y: 0 });
  /**Record the distance before this translation*/
  const [offsetDis, setOffsetDis] = useState({ left: 0, top: 0 });
  /**Picture node*/
  const [imgElement, setImgElement] = useState(new Image());
  /**Display image size*/
  const [size, setSize] = useState({ width: 0, height: 0 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [pointsList, setPointsList] = useState([]);
  const [points, setPoints] = useState([]);
  const [startPoint, setStartPoint] = useState({});

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
      canvas.style.width = width+ "px";
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
    //img.height = HEIGHT;
    //img.src = imgInfo.src;
  }, []);

  /**Convert browser coordinate system to canvas coordinate system*/
  const windowToCanvas = (canvas, x, y) => {
    var canvasBox = canvas.getBoundingClientRect();
    return {
      x: (x - canvasBox.left) * (canvas.width / canvasBox.width), // / Zoom when the size of the canvas element is inconsistent with the size of the drawing surface
      y: (y - canvasBox.top) * (canvas.height / canvasBox.height),
    };
  };

  /**Picture translation*/
  const handleMouseDown = (event) => {
    event.stopPropagation();
    event.preventDefault(); //  Block browser default behavior, drag to open picture
    const { clientX, clientY } = event;
    //Relative to canvas coordinates
    const canvas = canvasRef.current;
    const pos = windowToCanvas(canvas, clientX, clientY);
    canvas.style.cursor = "move";
    setMouseDowmFlag(true); //  The control only performs MouseMove when the mouse is pressed
    setMouseDowmPos({
      x: pos.x,
      y: pos.y,
    });
  };

  const handleMouseMove = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!mouseDowmFlag) return;
    const { clientX, clientY } = event;
    const canvas = canvasRef.current;
    //Relative to canvas coordinates
    const pos = windowToCanvas(canvas, clientX, clientY);
    //Offset
    const diffX = pos.x - mouseDowmPos.x;
    const diffY = pos.y - mouseDowmPos.y;
    if (diffX === 0 && diffY === 0) return;
    //Coordinate positioning = last positioning + offset
    const offsetX = parseInt(`${diffX + offsetDis.left}`, 10);
    const offsetY = parseInt(`${diffY + offsetDis.top}`, 10);
    //Pan picture
    const ctx = canvas.getContext("2d");
    //Empty canvas
    ctx.clearRect(0, 0, size.width, size.height);
    //Draw a picture
    ctx.drawImage(imgElement, offsetX, offsetY, size.width, size.height);

    //Update pressed coordinates
    setMouseDowmPos({
      x: pos.x,
      y: pos.y,
    });
    //Update last coordinates
    setOffsetDis({
      left: offsetX,
      top: offsetY,
    });
  };

  const handleMouseUp = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const canvas = canvasRef.current;
    canvas.style.cursor = "default";
    setMouseDowmFlag(false);
  };

  /**Scrolling*/
  const handleWheelImage = (event) => {
    click = event.target.id;
    event.stopPropagation();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if(event.deltaY > 0 || click == "decrease") {
      var bigger = -1;
    } else {
      var bigger = 1;
    }
    //Up is negative and down is positive
    // const bigger = event.deltaY > 0 ? -1 : 1;
    //Magnification
    const enlargeRate = 1.2;
    //Scale down
    const shrinkRate = 0.8;

    //Scaling
    const { height: initHeight, naturalHeight, naturalWidth } = imgElement;
    const imgScale = initHeight / naturalHeight;

    const rate = bigger > 0 ? enlargeRate : shrinkRate;
    const width = size.width * rate;
    const height = size.height * rate;

    //Empty canvas
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.drawImage(imgElement, offsetDis.left, offsetDis.top, width, height);

    setSize({ width, height });
    return false;
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

  return (
    <div style={{ display: "flex" }}>
      <canvas
        ref={canvasRef}
        onWheel={handleWheelImage}
        onMouseDown={handleMouseDown}
        onDoubleClick={startDrawing}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50px",
          margin: 5,
        }}
      >
        <button className="" onClick={handleWheelImage}>
          <span>&#43;</span>
        </button>
        <button id="decrease" className="" onClick={handleWheelImage}>
          <span>&#8722;</span>
        </button>
      </div>
    </div>
  );
};

export default SiteMapZoom;
