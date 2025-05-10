
import React from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PodcastPlayerProps {
  isPlaying: boolean;
  togglePlayPause: () => void;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ isPlaying, togglePlayPause }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2 text-white">Featured Podcast</h1>
      <div className="bg-black/60 backdrop-blur-sm text-white p-4 rounded-xl shadow-sm border border-gray-800">
        <div className="flex items-center">
          <img
            src="https://images.unsplash.com/photo-1614149162883-504ce4d13909?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
            alt="Featured podcast"
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div className="ml-4 flex-1">
            <h2 className="font-semibold">Investment Strategies for 2025</h2>
            <p className="text-sm text-gray-300">Robert Chen • 45:12</p>
            <span className="inline-block px-2 py-0.5 bg-gray-700 text-gray-200 rounded text-xs mt-1">Education</span>
            
            <div className="flex items-center mt-3 space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10 bg-white/20 border-white/40 hover:bg-white/30 text-white ring-offset-black"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="default" 
                size="icon" 
                className="rounded-full h-12 w-12 bg-white hover:bg-gray-200"
                onClick={togglePlayPause}
              >
                {isPlaying ? 
                  <Pause className="h-5 w-5 text-black" /> : 
                  <Play className="h-5 w-5 text-black ml-0.5" />
                }
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10 bg-white/20 border-white/40 hover:bg-white/30 text-white ring-offset-black"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;
