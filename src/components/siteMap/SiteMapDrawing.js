import { useEffect, useRef, useState } from "react/cjs/react.development";
const SiteMapDrawing = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pointsList, setPointsList] = useState([]);
  const [points, setPoints] = useState([]);
  const [startPoint, setStartPoint] = useState({});
  useEffect(() => {
    var background = new Image();
    background.src = "http://i.imgur.com/yf6d9SX.jpg";
    background.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = background.naturalWidth;
      canvas.height = background.naturalHeight;
      canvas.style.width = background.naturalWidth + "px";
      canvas.style.height = background.naturalHeight + "px";
      canvas.style.border = "1px solid black";

      const context = canvas.getContext("2d");
      context.drawImage(background, 0, 0);
      context.lineCap = "round";
      context.strokeStyle = "black";
      context.lineWidth = 5;
      contextRef.current = context;
      contextRef.current.lineWidth = 3;
    };
  }, []);
  const startDrawing = (offsetX, offsetY) => {
    if (points.length === 0) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      contextRef.current.rect(offsetX, offsetY, 20, 20);
      setStartPoint({ offsetX, offsetY });
      setPoints([...points, { offsetX, offsetY }]);
    } else {
      if (isStart(offsetX, offsetY)) {
        console.log("END");
        contextRef.current.lineTo(startPoint.offsetX, startPoint.offsetY);
        contextRef.current.fillStyle = "#8ED6FF";
        contextRef.current.fill();
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
  const clickShape = (offsetX, offsetY) => {
    console.log(offsetX, offsetY);
  };

  const canvasClickHandler = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (isDrawing) {
      startDrawing(offsetX, offsetY);
    } else {
      isClickOnShape(offsetX, offsetY);
    }
  };
  const toggleIsDrawing = () => {
    setIsDrawing((prevState) => !prevState);
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

  function isClickOnShape(offsetX, offsetY) {
    for (var i = 0; i < pointsList.length; i++) {
      var shape = pointsList[i];
      defineShape(shape);
      console.log("DEFINED");
      if (contextRef.current.isPointInPath(offsetX, offsetY)) {
        alert("asdasdasd");
      }
    }
  }
  function defineShape(shape) {
    var points = shape;
    contextRef.current.beginPath();
    contextRef.current.moveTo(points[0].offsetX, points[0].offsetY);
    for (var i = 1; i < points.length; i++) {
      contextRef.current.lineTo(points[i].offsetX, points[i].offsetY);
    }
  }
  return (
    <>
      <button onClick={toggleIsDrawing} />
      <canvas onClick={canvasClickHandler} ref={canvasRef} />
    </>
  );
};

export default SiteMapDrawing;
