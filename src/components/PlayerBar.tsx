import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, List, Heart, Plus } from 'lucide-react';
import { useRadio } from '@/contexts/RadioContext';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
    setAudioVolume,
    toggleFavorite,
    isFavorite
  } = useRadio();
  
  const navigate = useNavigate();
  const [localVolume, setLocalVolume] = useState(contextVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(contextVolume);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  
  // Update local volume when context volume changes
  useEffect(() => {
    setLocalVolume(contextVolume);
  }, [contextVolume]);
  
  // Function to handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setLocalVolume(volumeValue);
    setPrevVolume(volumeValue);
    setIsMuted(volumeValue === 0);
    
    // Use the context's setAudioVolume function
    setAudioVolume(volumeValue);
  };

  // Toggle mute function
  const toggleMute = () => {
    if (isMuted) {
      // Unmute - restore previous volume
      setLocalVolume(prevVolume);
      setIsMuted(false);
      setAudioVolume(prevVolume);
    } else {
      // Mute - set volume to 0
      setPrevVolume(localVolume);
      setLocalVolume(0);
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
    
    // Primero intentamos buscar por nombre de emisora específico
    const stationImageMap: Record<string, string> = {
      "Retro Music": "https://i.iheart.com/v3/re/new_assets/604b5ca11b76b4e49288f80e?ops=contain(1480,0)",
    };
    
    // Si hay una imagen específica para esta emisora, la usamos
    if (currentStation.name && stationImageMap[currentStation.name]) {
      return stationImageMap[currentStation.name];
    }
    
    // Si no, buscamos por género
    const genreImageMap: Record<string, string> = {
      "Electronic": "https://cdn-images.dzcdn.net/images/cover/242c7a5af2e9d8f310920a7478b9b97d/0x1900-000000-80-0-0.jpg",
      "Reggaeton": "https://lastfm.freetls.fastly.net/i/u/300x300/48e2aa75085404fcb6ae547bfc56ee63.jpg",
      "Rock & Pop": "https://www.rollingstone.com/wp-content/uploads/2018/06/rs-178306-pop_albums_REAL.jpg",
      "Classic Rock": "https://i.iheart.com/v3/re/new_assets/604b5ca11b76b4e49288f80e?ops=contain(1480,0)",
      "Jazz": "https://downbeat.com/images/news/_full/DB21_12_28_Reviews_Kenny_Garrett_Lead.jpg",
      "Música Latina": "https://f4.bcbits.com/img/a1807740989_10.jpg",
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

  // Función para manejar el clic en el botón de favorito
  const handleFavoriteClick = () => {
    if (!currentStation) return;
    
    // Activar la animación
    setIsHeartAnimating(true);
    
    // Alternar el estado de favorito
    toggleFavorite(currentStation.id);
    
    // Desactivar la animación después de que termine
    setTimeout(() => {
      setIsHeartAnimating(false);
    }, 1000);
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
          <button 
            className={`transition-colors relative ${
              currentStation && isFavorite(currentStation.id) 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={handleFavoriteClick}
            disabled={!currentStation}
          >
            <Heart 
              size={16} 
              fill={currentStation && isFavorite(currentStation.id) ? "currentColor" : "none"} 
              className={`transition-transform ${isHeartAnimating ? 'animate-heartbeat' : ''}`}
            />
            {isHeartAnimating && (
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Heart 
                  size={16} 
                  fill="currentColor" 
                  className="text-red-500 animate-heart-burst opacity-0"
                />
              </span>
            )}
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
            <div className="flex-1">
              <div 
                className="relative w-full h-2 bg-gray-700 rounded-full cursor-pointer touch-action-none" 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
                  setLocalVolume(percentage);
                  setAudioVolume(percentage);
                  if (isMuted && percentage > 0) {
                    setIsMuted(false);
                  }
                }}
                onMouseDown={(e) => {
                  const sliderEl = e.currentTarget;
                  
                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const rect = sliderEl.getBoundingClientRect();
                    const x = moveEvent.clientX - rect.left;
                    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
                    setLocalVolume(percentage);
                    setAudioVolume(percentage);
                    if (isMuted && percentage > 0) {
                      setIsMuted(false);
                    }
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
                onTouchStart={(e) => {
                  const sliderEl = e.currentTarget;
                  
                  const handleTouchMove = (touchEvent: TouchEvent) => {
                    // Prevenir el desplazamiento de la página mientras se ajusta el volumen
                    touchEvent.preventDefault();
                    
                    const touch = touchEvent.touches[0];
                    const rect = sliderEl.getBoundingClientRect();
                    const x = touch.clientX - rect.left;
                    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
                    setLocalVolume(percentage);
                    setAudioVolume(percentage);
                    if (isMuted && percentage > 0) {
                      setIsMuted(false);
                    }
                  };
                  
                  const handleTouchEnd = () => {
                    document.removeEventListener('touchmove', handleTouchMove);
                    document.removeEventListener('touchend', handleTouchEnd);
                  };
                  
                  document.addEventListener('touchmove', handleTouchMove, { passive: false });
                  document.addEventListener('touchend', handleTouchEnd);
                }}
              >
                <div 
                  className="absolute h-full bg-blue-600 rounded-full" 
                  style={{ width: `${isMuted ? 0 : localVolume}%` }}
                ></div>
                <div 
                  className="absolute h-5 w-5 rounded-full border-2 border-blue-600 bg-white" 
                  style={{ 
                    left: `${isMuted ? 0 : localVolume}%`, 
                    top: '50%', 
                    transform: 'translate(-50%, -50%)' 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Fullscreen button - hidden on small screens */}
          <button 
            className="hidden md:block text-gray-400 hover:text-white transition-colors"
            onClick={() => navigate('/listen')}
            title="Abrir reproductor"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
