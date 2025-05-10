
import { useRef, useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ToolBar from "@/components/ToolBar";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const { toast } = useToast();
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    // Set canvas to full size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      if (context) {
        context.lineCap = "round";
        context.lineJoin = "round";
      }
    };
    
    resizeCanvas();
    
    window.addEventListener("resize", resizeCanvas);
    
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    
    setIsDrawing(true);
    
    const { offsetX, offsetY } = getCoordinates(e);
    
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    
    // For the eraser tool
    if (tool === "eraser") {
      context.globalCompositeOperation = "destination-out";
    } else {
      context.globalCompositeOperation = "source-over";
      context.strokeStyle = color;
    }
    
    context.lineWidth = brushSize;
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext("2d");
    if (!context) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };
  
  const stopDrawing = () => {
    if (!canvasRef.current) return;
    
    const context = canvasRef.current.getContext("2d");
    if (!context) return;
    
    context.closePath();
    setIsDrawing(false);
  };
  
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { offsetX: 0, offsetY: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      };
    }
  };
  
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    toast({
      title: "Canvas cleared",
      description: "Your canvas has been cleared successfully."
    });
  };
  
  const saveCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    
    const link = document.createElement("a");
    link.download = "canvas-drawing.png";
    link.href = dataUrl;
    link.click();
    
    toast({
      title: "Drawing saved",
      description: "Your drawing has been downloaded successfully."
    });
  };
  
  return (
    <Layout>
      <div className="flex flex-col h-screen w-full">
        <ToolBar 
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          tool={tool}
          setTool={setTool}
          onClear={clearCanvas}
          onSave={saveCanvas}
        />
        <div className="flex-1 relative bg-white border border-gray-300">
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
