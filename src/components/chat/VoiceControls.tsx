
import React from "react";
import { Mic, MicOff, Volume, VolumeX, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VoiceControlsProps {
  isVoiceActive: boolean;
  speechEnabled: boolean;
  toggleVoice: () => void;
  toggleSpeech: () => void;
  isSpeechRecognitionSupported?: boolean;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ 
  isVoiceActive, 
  speechEnabled, 
  toggleVoice, 
  toggleSpeech,
  isSpeechRecognitionSupported = true
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button 
                className={`relative rounded-full p-2 h-10 w-10 ${
                  isSpeechRecognitionSupported 
                    ? isVoiceActive 
                      ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                      : 'bg-gray-800/80 text-gray-400'
                    : 'bg-gray-800/60 text-gray-500 opacity-50 cursor-not-allowed'
                }`}
                onClick={toggleVoice}
                aria-label={isVoiceActive ? "Disable voice input" : "Enable voice input"}
                variant="ghost"
                disabled={!isSpeechRecognitionSupported}
              >
                {isVoiceActive ? <Mic className="animate-pulse" size={20} /> : <MicOff size={20} />}
                {!isSpeechRecognitionSupported && (
                  <span className="absolute -top-1 -right-1 text-red-500">
                    <AlertCircle size={12} className="fill-red-500" />
                  </span>
                )}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {!isSpeechRecognitionSupported 
              ? "Voice input not supported in this browser" 
              : (isVoiceActive ? "Disable voice input" : "Enable voice input")
            }
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Button 
        className={`rounded-full p-2 h-10 w-10 ${speechEnabled ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-800/80 text-gray-400'}`}
        onClick={toggleSpeech}
        aria-label={speechEnabled ? "Disable speech output" : "Enable speech output"}
        variant="ghost"
      >
        {speechEnabled ? <Volume size={20} /> : <VolumeX size={20} />}
      </Button>
    </div>
  );
};

export default VoiceControls;
