import React, { createRef, useEffect, useState, useRef } from 'react';


/**Canvas size*/
const WIDTH = 466;
const HEIGHT = 326;

/**The image coordinate returned by the interface is the location relative to the upper left corner of the original image*/
const imgInfo = {
  lableBottom: "492",
  lableLeft: "342",
  lableRight: "353",
  lableTop: "470",
  position: "03",
  src: 'https://parts-images.cassmall.com/bmw_test/322664.jpg?version=16',
}

const Canvas = () => {

  const canvasRef = createRef();
  /**Record whether the mouse is pressed*/
  const [mouseDowmFlag, setMouseDowmFlag] = useState(false);
  /**Record the coordinates of the mouse down*/
  const [mouseDowmPos, setMouseDowmPos] = useState({x: 0, y: 0});
  /**Record the distance before this translation*/
  const [offsetDis, setOffsetDis] = useState({left: 0, top: 0});
  /**Picture node*/
  const [imgElement, setImgElement] = useState(new Image());
  /**Display image size*/
  const [size, setSize] = useState({width: WIDTH, height: HEIGHT});
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pointsList, setPointsList] = useState([]);
  const [points, setPoints] = useState([]);
  const [startPoint, setStartPoint] = useState({});

  
  /**Initialize image location*/
  const initImg = () => {
    /**Initializes a picture node object*/
    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current?.getContext('2d');
      const { naturalWidth, height, naturalHeight } = img;
      //Scaling
      const imgScale = height / naturalHeight;
      //Set the width of the picture
      const width = naturalWidth * imgScale;
      //The position of the picture relative to the horizontal and vertical center of the parent element
      const left = WIDTH / 2 - width / 2;
      const top = HEIGHT / 2 - height / 2;
      //Draw a picture
      ctx.drawImage(img, left, top, width, height);
      //Drawing icons
      const labelLeft = parseInt('${imgInfo.lableLeft}', 10) * imgScale;
      const labelTop = parseInt('${imgInfo.lableTop}', 10) * imgScale;
      ctx.strokeStyle = '#da2727';
      ctx.strokeRect(labelLeft, labelTop, 28, 28);
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      contextRef.current = ctx;
      contextRef.current.beginPath();
      contextRef.current.lineWidth = 3;
      setSize({width, height});
      setImgElement(img);
    }
    img.height = HEIGHT;
    img.src = imgInfo.src;
  }

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

  /**Convert browser coordinate system to canvas coordinate system*/
  const windowToCanvas = (canvas, x, y) => {
    var canvasBox = canvas.getBoundingClientRect();
    return {
        x: (x - canvasBox. Left) * (canvas.width / canvasBox.width), // / Zoom when the size of the canvas element is inconsistent with the size of the drawing surface
        y: (y - canvasBox.top) * (canvas.height/canvasBox.height),
    };
  }

  /**Picture translation*/
  const handleMouseDown = (event) => {
    event.stopPropagation();
    event.preventDefault(); //  Block browser default behavior, drag to open picture
    const { clientX, clientY } = event;
    //Relative to canvas coordinates
    const canvas = canvasRef.current;
    const pos = windowToCanvas(canvas, clientX, clientY);
    canvas.style.cursor = 'move';
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
    const pos = windowToCanvas(canvas, clientX, clientY)
    //Offset
    const diffX = pos.x - mouseDowmPos.x;
    const diffY = pos.y - mouseDowmPos.y;
    if ((diffX === 0 && diffY === 0)) return;
    //Coordinate positioning = last positioning + offset
    const offsetX = parseInt('${diffX + offsetDis.left}', 10);
    const offsetY = parseInt('${diffY + offsetDis.top}', 10);
    //Pan picture
    const ctx = canvas.getContext('2d');
    //Empty canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    //Draw a picture
    ctx.drawImage(imgElement, offsetX, offsetY, size.width, size.height);
    //Drawing icons
    const { naturalWidth, height, naturalHeight } = imgElement;
    const imgScale = height / naturalHeight; //Scaling
    const totalZoomRateX = size.width / (naturalWidth * imgScale);
    const totalZoomRateY = size.height / height;
    const labelLeft = parseInt('${imgInfo.lableLeft}', 10) * imgScale * totalZoomRateX + offsetX;
    const labelTop = parseInt('${imgInfo.lableTop}', 10) * imgScale * totalZoomRateY + offsetY;
    ctx.strokeStyle = '#da2727';
    ctx.strokeRect(labelLeft, labelTop, 28 * totalZoomRateX, 28 * totalZoomRateY);

    //Update pressed coordinates
    setMouseDowmPos({
      x: pos.x,
      y: pos.y,
    });
    //Update last coordinates
    setOffsetDis({
      left: offsetX,
      top: offsetY,
    })
  };

  const handleMouseUp = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const canvas = canvasRef.current;
    canvas.style.cursor = 'default';
    setMouseDowmFlag(false);
  };

  /**Scrolling*/
  const handleWheelImage = (event) => {
    event.stopPropagation();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    //Up is negative and down is positive
    const bigger = event.deltaY > 0 ? -1 : 1;
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
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.drawImage(imgElement, offsetDis.left, offsetDis.top, width, height);

    //Drawing icons
    const totalZoomRateX = width / (naturalWidth * imgScale);
    const totalZoomRateY = height / initHeight;
    const labelLeft = parseInt('${imgInfo.lableLeft}', 10) * imgScale * totalZoomRateX + offsetDis.left;
    const labelTop = parseInt('${imgInfo.lableTop}', 10) * imgScale * totalZoomRateY + offsetDis.top;
    ctx.strokeStyle = '#da2727';
    ctx.strokeRect(labelLeft, labelTop, 28 * totalZoomRateX, 28 * totalZoomRateY);

    setSize({width, height});
    return false;
  };

  useEffect(() => {
    /**Initialize picture*/
    initImg();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <canvas 
        ref={canvasRef} 
        width={WIDTH} 
        height={HEIGHT} 
        onWheel={handleWheelImage}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        
      ></canvas>
    </div>
  )
}

export default Canvas;