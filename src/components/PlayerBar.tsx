import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, List, Heart, Plus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useRadio } from '@/contexts/RadioContext';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface PlayerBarProps {
  onNowPlayingToggle?: () => void;
  nowPlayingOpen?: boolean;
}

const PlayerBar = ({ onNowPlayingToggle, nowPlayingOpen }: PlayerBarProps) => {
  const { 
    currentStation, 
    isPlaying, 
    isLoading, 
    togglePlayPause, 
    stations, 
    playStation,
    volume: contextVolume,
    setAudioVolume
  } = useRadio();
  
  const [localVolume, setLocalVolume] = useState([contextVolume]);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(contextVolume);
  
  // Update local volume when context volume changes
  useEffect(() => {
    setLocalVolume([contextVolume]);
  }, [contextVolume]);
  
  // Function to handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    setLocalVolume(newVolume);
    setPrevVolume(newVolume[0]);
    setIsMuted(newVolume[0] === 0);
    
    // Use the context's setAudioVolume function
    setAudioVolume(newVolume[0]);
  };

  // Toggle mute function
  const toggleMute = () => {
    if (isMuted) {
      // Unmute - restore previous volume
      setLocalVolume([prevVolume]);
      setIsMuted(false);
      setAudioVolume(prevVolume);
    } else {
      // Mute - set volume to 0
      setPrevVolume(localVolume[0]);
      setLocalVolume([0]);
      setIsMuted(true);
      setAudioVolume(0);
    }
  };

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
    <div className="fixed bottom-0 left-0 right-0 h-auto md:h-20 bg-app-dark border-t border-app-light/20 flex flex-col md:flex-row items-center justify-between px-3 md:px-4 py-2 animate-slide-in-bottom z-50">
      {/* Mobile layout - top row with controls */}
      <div className="w-full md:hidden flex items-center justify-between mb-2">
        <button 
          className="text-gray-400 hover:text-white transition-colors"
          onClick={handleSkipPrevious}
          disabled={isLoading || stations.length <= 1}
        >
          <SkipBack size={18} />
        </button>
        
        <Button 
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center p-0 mx-2"
          onClick={handlePlayButtonClick}
          disabled={isLoading}
          variant="default"
          size="icon"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-app-accent border-t-transparent rounded-full animate-spin"></span>
          ) : isPlaying ? (
            <Pause size={14} className="text-black" />
          ) : (
            <Play size={14} className="text-black ml-0.5" />
          )}
        </Button>
        
        <button 
          className="text-gray-400 hover:text-white transition-colors"
          onClick={handleSkipNext}
          disabled={isLoading || stations.length <= 1}
        >
          <SkipForward size={18} />
        </button>
      </div>
      
      {/* Station info - responsive for all screens */}
      <div className="w-full md:w-1/3 flex items-center">
        <img 
          src={getGenreImage()} 
          alt={currentStation?.name || "Radio player"} 
          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded mr-3"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png";
          }}
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm text-white font-medium truncate">
            {currentStation?.name || "Radio Player"}
          </h4>
          <p className="text-xs text-gray-400 truncate">
            {currentStation?.genre || "Select a station to play"}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Heart size={16} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors md:hidden">
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      {/* Desktop controls - hidden on mobile */}
      <div className="hidden md:flex flex-col items-center justify-center">
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
      
      {/* Progress bar for mobile */}
      <div className="w-full md:hidden h-1 bg-gray-700 rounded-full overflow-hidden my-1">
        <div className={`h-full ${isPlaying ? 'bg-app-red animate-pulse' : 'bg-gray-500'} w-full rounded-full`}></div>
      </div>
      
      {/* Volume and controls - responsive */}
      <div className="w-full md:w-1/3 flex items-center justify-end gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Now Playing toggle button for mobile */}
          <button 
            className={`text-gray-400 hover:text-white transition-colors ${nowPlayingOpen ? 'text-white' : ''}`}
            onClick={onNowPlayingToggle}
          >
            <List size={18} />
          </button>
          
          {/* Volume control */}
          <div className="flex items-center gap-2 w-24 md:w-32">
            <button 
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <Slider 
              value={localVolume}
              onValueChange={handleVolumeChange}
              max={100} 
              step={1}
              className="cursor-pointer"
            />
          </div>
          
          {/* Fullscreen button - hidden on small screens */}
          <button className="hidden md:block text-gray-400 hover:text-white transition-colors">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
