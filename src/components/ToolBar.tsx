
import { Brush, Eraser, Trash, Download, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

interface ToolBarProps {
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  tool: "pen" | "eraser";
  setTool: (tool: "pen" | "eraser") => void;
  onClear: () => void;
  onSave: () => void;
}

const ColorButton = ({ color, currentColor, onClick }: { color: string; currentColor: string; onClick: () => void }) => (
  <button
    className={`w-8 h-8 rounded-full transition-transform ${currentColor === color ? 'scale-110 ring-2 ring-gray-400' : ''}`}
    style={{ backgroundColor: color }}
    onClick={onClick}
  />
);

const ToolBar: React.FC<ToolBarProps> = ({
  color,
  setColor,
  brushSize,
  setBrushSize,
  tool,
  setTool,
  onClear,
  onSave,
}) => {
  const colors = ["#000000", "#FF0000", "#0000FF", "#008000", "#FFFF00", "#FFA500", "#800080"];

  return (
    <div className="bg-white border border-gray-300 p-4 shadow-sm flex flex-wrap gap-4 items-center">
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={tool === "pen" ? "default" : "outline"}
                size="icon"
                onClick={() => setTool("pen")}
              >
                <Brush size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Pen Tool</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={tool === "eraser" ? "default" : "outline"}
                size="icon"
                onClick={() => setTool("eraser")}
              >
                <Eraser size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Eraser Tool</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="h-6 border-l border-gray-300" />
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Size:</span>
        <div className="w-36">
          <Slider
            defaultValue={[brushSize]}
            min={1}
            max={50}
            step={1}
            onValueChange={(value) => setBrushSize(value[0])}
          />
        </div>
        <div className="w-6 h-6 relative">
          <Circle className="absolute inset-0 m-auto" size={brushSize} fill={color} stroke="none" />
        </div>
      </div>

      <div className="h-6 border-l border-gray-300" />
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Color:</span>
        <div className="flex gap-1">
          {colors.map((c) => (
            <ColorButton
              key={c}
              color={c}
              currentColor={color}
              onClick={() => setColor(c)}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
            title="Choose color"
          />
        </div>
      </div>

      <div className="h-6 border-l border-gray-300 ml-auto" />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onClear}>
              <Trash size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear Canvas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onSave}>
              <Download size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save Canvas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ToolBar;
