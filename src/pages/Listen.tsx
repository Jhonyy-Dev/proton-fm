import { useState, useEffect, useRef } from 'react';
import { useRadio } from '@/contexts/RadioContext';
import Sidebar from '@/components/Sidebar';
import { Menu, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Radio, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';

// Componente para el fondo personalizado de Deep House Radio
const DeepHouseBackground = () => {
  const backgroundImageUrl = "https://cdn-images.dzcdn.net/images/cover/242c7a5af2e9d8f310920a7478b9b97d/0x1900-000000-80-0-0.jpg";

  return (
    <>
      {/* Fondo con imagen y efecto de desenfoque */}
      <div 
        className="absolute inset-0 z-0 opacity-60 bg-black"
        style={{ 
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: 'blur(5px) brightness(0.8)',
        }}
      />
      
      {/* Overlay con gradiente para mejorar la legibilidad */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
    </>
  );
};

const Listen = () => {
  const { 
    stations, 
    currentStation, 
    isPlaying, 
    isLoading,
    volume,
    playStation, 
    togglePlayPause, 
    setAudioVolume,
    fetchRadioStations
  } = useRadio();
  
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(70);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Cargar estaciones si no están disponibles
  useEffect(() => {
    if (stations.length === 0) {
      fetchRadioStations();
    }
  }, [stations, fetchRadioStations]);
  
  // Manejar el cierre del sidebar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) && 
        sidebarOpen
      ) {
        const target = event.target as HTMLElement;
        // No cerrar si se hace clic en el botón de toggle
        if (target.id !== 'sidebar-toggle' && !target.closest('#sidebar-toggle')) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);
  
  // Función para cambiar a la estación anterior
  const handlePreviousStation = () => {
    if (!currentStation || stations.length === 0) return;
    
    const currentIndex = stations.findIndex(station => station.id === currentStation.id);
    const previousIndex = currentIndex <= 0 ? stations.length - 1 : currentIndex - 1;
    playStation(stations[previousIndex]);
  };
  
  // Función para cambiar a la siguiente estación
  const handleNextStation = () => {
    if (!currentStation || stations.length === 0) return;
    
    const currentIndex = stations.findIndex(station => station.id === currentStation.id);
    const nextIndex = currentIndex >= stations.length - 1 ? 0 : currentIndex + 1;
    playStation(stations[nextIndex]);
  };
  
  // Función para alternar el silencio
  const handleMuteToggle = () => {
    if (muted) {
      setMuted(false);
      setAudioVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setMuted(true);
      setAudioVolume(0);
    }
  };
  
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-app-darkest text-white">
      {/* Fondo personalizado */}
      <DeepHouseBackground />
      
      {/* Contenedor principal con z-index para estar por encima del fondo */}
      <div className="relative z-10 flex h-full w-full overflow-hidden">
        {/* Sidebar con comportamiento responsive */}
        <div 
          ref={sidebarRef}
          id="sidebar"
          className={`fixed inset-y-0 left-0 z-50 w-1/7 md:w-72 transition-transform duration-300 ease-in-out transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:relative md:z-10 bg-app-darkest shadow-xl`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
        
        {/* Overlay para cerrar el sidebar en móvil */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Contenido principal - Separado completamente del sidebar */}
        <div className="w-full md:w-[calc(100%-18rem)] md:ml-auto relative flex flex-col items-center justify-center p-4 md:p-6 lg:p-8">
          {/* Botón de toggle para sidebar en móvil */}
          <button 
            id="sidebar-toggle"
            className="md:hidden fixed top-4 left-4 z-30 bg-black/70 backdrop-blur-md p-2.5 rounded-full shadow-lg active:scale-95 transition-transform"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
          
          {/* Botón para volver a la página anterior */}
          <button 
            className="fixed top-4 right-4 z-30 bg-black/70 backdrop-blur-md p-2.5 rounded-full shadow-lg active:scale-95 transition-transform"
            onClick={() => navigate(-1)}
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          
          {/* Logo en móvil */}
          <div className="md:hidden fixed top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
            <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
              <div className="bg-app-accent rounded-full p-1">
                <Radio className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-wider">PARADZIT</span>
            </div>
          </div>
          
          {/* Contenedor del reproductor con glassmorphism */}
          <div className="w-full max-w-md mx-auto mt-20 md:mt-0 bg-black/50 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/5">
            {/* Cabecera con información de la estación */}
            <div className="text-center p-6 border-b border-white/10">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {currentStation?.name || 'Select a Station'}
              </h1>
              <p className="text-gray-400">
                {currentStation?.genre || ''} {currentStation?.country ? `• ${currentStation.country}` : ''}
              </p>
              
              {/* Indicador de estado */}
              <div className="mt-4 flex items-center justify-center">
                <div className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-app-accent animate-pulse' : 'bg-gray-500'} mr-2`}></div>
                <span className={`text-xs font-medium uppercase tracking-wider ${isPlaying ? 'text-app-accent' : 'text-gray-500'}`}>
                  {isLoading ? 'Loading...' : isPlaying ? 'LIVE' : 'Paused'}
                </span>
              </div>
            </div>
            
            {/* Controles del reproductor */}
            <div className="p-6">
              {/* Controles principales */}
              <div className="flex items-center justify-center space-x-6 md:space-x-8 mb-8">
                <button 
                  onClick={handlePreviousStation}
                  className="p-2.5 rounded-full text-white hover:bg-white/10 active:bg-white/20 transition-colors"
                  aria-label="Previous station"
                >
                  <SkipBack className="h-6 w-6" />
                </button>
                
                <button 
                  onClick={togglePlayPause}
                  className="p-5 bg-app-accent hover:bg-app-accent/90 active:bg-app-accent/80 rounded-full text-white shadow-lg transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isLoading ? (
                    <div className="h-8 w-8 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  ) : isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </button>
                
                <button 
                  onClick={handleNextStation}
                  className="p-2.5 rounded-full text-white hover:bg-white/10 active:bg-white/20 transition-colors"
                  aria-label="Next station"
                >
                  <SkipForward className="h-6 w-6" />
                </button>
              </div>
              
              {/* Control de volumen mejorado para móvil */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleMuteToggle}
                  className="text-white hover:bg-white/10 active:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                
                <div className="flex-1 px-1">
                  <Slider
                    value={[muted ? 0 : volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => {
                      const newVolume = value[0];
                      setAudioVolume(newVolume);
                      if (muted && newVolume > 0) {
                        setMuted(false);
                      }
                    }}
                    className="cursor-pointer touch-action-manipulation"
                    aria-label="Volume control"
                  />
                </div>
                
                <div className="w-9 text-right text-sm text-gray-400 font-medium">
                  {muted ? '0%' : `${volume}%`}
                </div>
              </div>
            </div>
          </div>
          
          {/* Imagen de la emisora en la parte inferior izquierda */}
          {currentStation && (
            <div className="fixed bottom-4 left-4 z-50">
              <div className="flex items-center space-x-3 bg-black/70 backdrop-blur-md p-2 rounded-lg shadow-lg border border-white/10">
                <img 
                  src={currentStation.favicon} 
                  alt={currentStation.name} 
                  className="h-12 w-12 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png'; // Imagen de respaldo
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{currentStation.name}</span>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-app-accent animate-pulse' : 'bg-gray-500'} mr-2`}></div>
                    <span className={`text-xs font-medium uppercase tracking-wider ${isPlaying ? 'text-app-accent' : 'text-gray-500'}`}>
                      {isPlaying ? 'LIVE' : 'PAUSED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listen;
