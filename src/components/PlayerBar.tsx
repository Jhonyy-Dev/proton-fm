
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, List, Heart, Plus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useRadio } from '@/contexts/RadioContext';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const PlayerBar = () => {
  const { 
    currentStation, 
    isPlaying, 
    isLoading, 
    togglePlayPause, 
    stations, 
    playStation 
  } = useRadio();
  const [volume, setVolume] = useState([70]);
  
  // Function to handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    // Get the audio element
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      // Set volume (0-1 range)
      audioElement.volume = newVolume[0] / 100;
    }
  };

  // Set initial volume on mount
  useEffect(() => {
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioElement.volume = volume[0] / 100;
    }
  }, []);

  const handleSkipNext = () => {
    if (!currentStation || stations.length === 0) return;
    
    const currentIndex = stations.findIndex(
      (station) => station.id === currentStation.id
    );
    
    const nextIndex = (currentIndex + 1) % stations.length;
    playStation(stations[nextIndex]);
  };

  const handleSkipPrevious = () => {
    if (!currentStation || stations.length === 0) return;
    
    const currentIndex = stations.findIndex(
      (station) => station.id === currentStation.id
    );
    
    const prevIndex = (currentIndex - 1 + stations.length) % stations.length;
    playStation(stations[prevIndex]);
  };

  // Get appropriate genre-based image for the current station
  const getGenreImage = () => {
    if (!currentStation) return "/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png";
    
    const genreImageMap: Record<string, string> = {
      "Electronic": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=300&auto=format",
      "Reggaeton": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&auto=format",
      "Latin": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&auto=format",
      "Latin Pop": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&auto=format",
      "Bachata": "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&auto=format",
    };
    
    return genreImageMap[currentStation.genre || ""] || "/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png";
  };

  // Function to select and play first station when no current station
  const handlePlayButtonClick = () => {
    if (!currentStation && stations.length > 0) {
      playStation(stations[0]);
    } else {
      togglePlayPause();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-app-dark border-t border-app-light/20 flex items-center justify-between px-4 py-2 animate-slide-in-bottom z-50">
      <div className="w-1/3 flex items-center">
        <img 
          src={getGenreImage()} 
          alt={currentStation?.name || "Radio player"} 
          className="w-12 h-12 object-cover rounded mr-3"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png";
          }}
        />
        <div className="flex-1">
          <h4 className="text-sm text-white font-medium">
            {currentStation?.name || "Radio Player"}
          </h4>
          <p className="text-xs text-gray-400">
            {currentStation?.genre || "Select a station to play"}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Heart size={16} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-6 mb-2">
          <button 
            className="text-gray-400 hover:text-white transition-colors"
            onClick={handleSkipPrevious}
            disabled={isLoading || stations.length <= 1}
          >
            <SkipBack size={20} />
          </button>
          <Button 
            className="bg-white rounded-full w-8 h-8 flex items-center justify-center p-0"
            onClick={handlePlayButtonClick}
            disabled={isLoading}
            variant="default"
            size="icon"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-app-accent border-t-transparent rounded-full animate-spin"></span>
            ) : isPlaying ? (
              <Pause size={16} className="text-black" />
            ) : (
              <Play size={16} className="text-black ml-0.5" />
            )}
          </Button>
          <button 
            className="text-gray-400 hover:text-white transition-colors"
            onClick={handleSkipNext}
            disabled={isLoading || stations.length <= 1}
          >
            <SkipForward size={20} />
          </button>
        </div>
        
        <div className="w-80 flex items-center gap-2">
          <span className="text-xs text-gray-400">LIVE</span>
          <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full ${isPlaying ? 'bg-app-red animate-pulse' : 'bg-gray-500'} w-full rounded-full`}></div>
          </div>
          <span className="text-xs text-gray-400">RADIO</span>
        </div>
      </div>
      
      <div className="w-1/3 flex items-center justify-end gap-4">
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-white transition-colors">
            <List size={18} />
          </button>
          <div className="flex items-center gap-2 w-24">
            <Volume2 size={18} className="text-gray-400" />
            <Slider 
              value={volume}
              onValueChange={handleVolumeChange}
              max={100} 
              step={1}
              className="h-1"
            />
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
