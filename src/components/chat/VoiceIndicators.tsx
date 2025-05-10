
import React from "react";

interface VoiceIndicatorsProps {
  isListening: boolean;
  isWaitingForCommand: boolean;
  wakeWordDetected: boolean;
  isSpeaking: boolean;
}

const VoiceIndicators: React.FC<VoiceIndicatorsProps> = ({
  isListening,
  isWaitingForCommand,
  wakeWordDetected,
  isSpeaking
}) => {
  return (
    <>
      {/* Voice activation indicator */}
      {(isListening || isWaitingForCommand) && (
        <div className={`w-full max-w-3xl mx-auto flex justify-center items-center space-x-2 mb-2 p-2 rounded-lg ${wakeWordDetected ? "bg-blue-900/30" : ""}`}>
          <div className={`h-3 w-3 rounded-full ${isListening ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}></div>
          <p className="text-sm font-medium text-white">
            {isWaitingForCommand ? "Listening for command..." : "Voice activated"}
          </p>
        </div>
      )}
      
      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="text-xs text-center text-blue-400 mt-2 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full mx-1 animate-pulse" style={{animationDelay: "0.2s"}}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full ml-1 animate-pulse" style={{animationDelay: "0.4s"}}></div>
          <span className="ml-2">Speaking...</span>
        </div>
      )}
    </>
  );
};

export default VoiceIndicators;
