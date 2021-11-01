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
      //   context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = "black";
      context.lineWidth = 5;
      contextRef.current = context;
      contextRef.current.beginPath();
      contextRef.current.lineWidth = 3;
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
    if (offsetX > startPoint.offsetX && offsetX < startPoint.offsetX + 20) {
      if (offsetY > startPoint.offsetY < startPoint.offsetY + 20) {
        return true;
      }
    } else {
      return false;
    }
  }
  //   const finishDrawing = () => {
  //     contextRef.current.closePath();
  //     setIsDrawing(false);
  //   };

  //   const draw = ({ nativeEvent }) => {
  //     if (!isDrawing) {
  //       return;
  //     }
  //     const { offsetX, offsetY } = nativeEvent;
  //     contextRef.current.lineTo(offsetX, offsetY);
  //     contextRef.current.stroke();
  //   };
  return (
    <>
      <canvas onMouseDown={startDrawing} ref={canvasRef} />
      <div />
    </>
  );
};

export default SiteMapDrawing;
