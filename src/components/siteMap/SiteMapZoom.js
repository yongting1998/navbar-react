import React, { createRef, useEffect, useState, useRef } from "react";

const SiteMapZoom = () => {
  const canvasRef = useRef();
  const contextRef = useRef(null);

  /**Picture node*/
  const [imgElement, setImgElement] = useState(new Image());
  /**Display image size*/
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [view, setView] = useState({ x: 0.0, y: 0.0, zoom: 1.0 });
  const [mousePos, setmousePos] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState();

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

  useEffect(() => {}, [selected]);

  const zoomPan = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.resetTransform();
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.save();
    ctx.scale(view.zoom, view.zoom);
    ctx.translate(-view.x, -view.y);
    ctx.drawImage(imgElement, 0, 0);
    ctx.restore();
  };

  const handlePan = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (event.buttons === 1) {
      view.x -= event.movementX;
      view.y -= event.movementY;
      zoomPan();
    }
  };

  /**Scrolling*/
  const handleZoom = (event) => {
    event.stopPropagation();

    const canvas = canvasRef.current;

    // Get mouse offset.
    const mousex = event.clientX - canvas.offsetLeft;
    const mousey = event.clientY - canvas.offsetTop;

    // Store the mouse pos for btn zoom
    // mousePos.x = mousex;
    // mousePos.y = mousey;

    const wheel = event.deltaY < 0 ? 1 : -1;
    // Compute zoom factor.
    const zoom = Math.exp(wheel * 0.2);
    const min_scale = 1;
    const max_scale = 8;

    const previous_x = view.x;
    const previous_y = view.y;

    view.x -= mousex / (view.zoom * zoom) - mousex / view.zoom;
    view.y -= mousey / (view.zoom * zoom) - mousey / view.zoom;
    view.zoom = Math.max(min_scale, Math.min(max_scale, view.zoom * zoom));

    if (view.zoom == max_scale) {
      view.x = previous_x;
      view.y = previous_y;
    }

    if (view.zoom == min_scale) {
      view.x = 0;
      view.y = 0;
    }
    zoomPan();
  };

  const btnZoomIn = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    view.zoom *= 1.1;
    console.log(view.x, view.y);

    ctx.resetTransform();
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.save();
    ctx.translate(size.width / 2, size.height / 2);
    ctx.scale(view.zoom, view.zoom);
    ctx.translate(-view.x, -view.y);
    ctx.drawImage(
      imgElement,
      size.width / -2,
      size.height / -2,
      size.width,
      size.height
    );
    ctx.restore();
  };

  const btnZoomOut = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    view.zoom *= 0.8;

    ctx.resetTransform();
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.save();
    ctx.translate(size.width / 2, size.height / 2);
    ctx.scale(view.zoom, view.zoom);
    ctx.translate(-view.x, -view.y);
    ctx.drawImage(
      imgElement,
      size.width / -2,
      size.height / -2,
      size.width,
      size.height
    );
    ctx.restore();
  };

  const btnReset = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    view.zoom = 1;
    view.x = 0;
    view.y = 0;
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

  return (
    <div style={{ display: "flex" }}>
      <canvas
        ref={canvasRef}
        onWheel={handleZoom}
        onMouseDown={(event) => {
          if (selected == "draw") {
            startDrawing(event);
          }
        }}
        onMouseMove={(event) => {
          if (selected == "pan") {
            handlePan(event);
          }
        }}
        // onMouseMove={handlePan}
      ></canvas>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50px",
          margin: 5,
        }}
      >
        <button name="btn-zoomin" className="" onClick={btnZoomIn}>
          <span>&#43;</span>
        </button>
        <button name="btn-zoomout" className="" onClick={btnZoomOut}>
          <span>&#8722;</span>
        </button>
        <button name="btn-resetZoom" className="" onClick={btnReset}>
          <span style={{ fontSize: "14px" }}>Reset</span>
        </button>
        <button name="btn-pan" className="" onClick={() => setSelected("pan")}>
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
    </div>
  );
};

export default SiteMapZoom;
