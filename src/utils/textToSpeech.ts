
// Text-to-speech utility using the Web Speech API

// Check if browser supports Web Speech Synthesis API
const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

// Initialize and configure text-to-speech
export const initTextToSpeech = () => {
  if (!isSpeechSynthesisSupported()) {
    console.error("Speech Synthesis not supported in this browser");
    return null;
  }
  
  const synth = window.speechSynthesis;
  
  return {
    // Convert text to speech with option to set voice and rate
    speak: (text: string, options?: { rate?: number; pitch?: number; voice?: string }) => {
      // Cancel any ongoing speech
      synth.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure rate, pitch, and voice if provided
      if (options?.rate) utterance.rate = options.rate;
      if (options?.pitch) utterance.pitch = options.pitch;
      
      // Select a professional voice if available
      if (synth.getVoices().length) {
        // Try to find a good quality voice
        const voices = synth.getVoices();
        
        if (options?.voice) {
          const selectedVoice = voices.find(v => v.name === options.voice);
          if (selectedVoice) utterance.voice = selectedVoice;
        } else {
          // Default to a calm, professional-sounding voice
          const preferredVoices = [
            "Google UK English Male",
            "Microsoft David - English (United States)",
            "Alex", // macOS high-quality voice
          ];
          
          for (const voiceName of preferredVoices) {
            const voice = voices.find(v => v.name === voiceName);
            if (voice) {
              utterance.voice = voice;
              break;
            }
          }
        }
      }
      
      // Add word boundary event for more accurate lip sync
      utterance.onboundary = (event) => {
        if (event.name === 'word' && event.charIndex !== undefined) {
          // Could dispatch custom event for better lip sync
          // This would require animation system to respond to it
          const word = text.substr(event.charIndex, event.charLength || 10);
          console.log('Speaking word:', word);
        }
      };
      
      // Speak the text
      synth.speak(utterance);
      
      return {
        stop: () => synth.cancel(),
        isPending: () => synth.speaking
      };
    },
    
    getAvailableVoices: () => {
      return synth.getVoices();
    },
    
    stop: () => synth.cancel()
  };
};
