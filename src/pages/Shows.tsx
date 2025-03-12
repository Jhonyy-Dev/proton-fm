import { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu, Play, Pause, ExternalLink, Volume2, VolumeX, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useRadio } from '@/contexts/RadioContext';
import { fetchLiveHorrorStreams, HorrorStream } from '@/services/horrorShowsService';
import HLSPlayer, { HLSPlayerRef } from '@/components/HLSPlayer';

const YouTubeEmbed: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div className="youtube-embed-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
      <iframe 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        src={src}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const Shows = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [horrorStreams, setHorrorStreams] = useState<HorrorStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStreamId, setActiveStreamId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [loadingStreamId, setLoadingStreamId] = useState<string | null>(null);
  const [fullscreenStream, setFullscreenStream] = useState<HorrorStream | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const hlsPlayerRefs = useRef<Record<string, HLSPlayerRef | null>>({});
  const navigate = useNavigate();
  const { isPlaying } = useRadio();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cargar las transmisiones de horror con manejo de cancelación
  const loadHorrorStreams = useCallback(async () => {
    // Cancelar cualquier solicitud previa
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Crear un nuevo controlador de cancelación
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Obtener solo transmisiones en vivo
      const streams = await fetchLiveHorrorStreams();
      
      if (streams.length === 0) {
        setError('No se encontraron transmisiones en vivo disponibles');
      } else {
        setHorrorStreams(streams);
      }
    } catch (error) {
      console.error('Error al cargar transmisiones:', error);
      setError('Error al cargar las transmisiones en vivo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar las transmisiones al montar el componente
  useEffect(() => {
    loadHorrorStreams();
    
    // Limpiar al desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Pausar cualquier video activo al salir
      if (activeStreamId && videoRefs.current[activeStreamId]) {
        videoRefs.current[activeStreamId]?.pause();
      }
    };
  }, [loadHorrorStreams]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const playStream = (streamId: string) => {
    setLoadingStreamId(streamId);
    
    // Pausar el stream activo si existe
    if (activeStreamId && activeStreamId !== streamId) {
      if (hlsPlayerRefs.current[activeStreamId]) {
        hlsPlayerRefs.current[activeStreamId]?.pause();
      } else if (videoRefs.current[activeStreamId]) {
        videoRefs.current[activeStreamId]?.pause();
      }
    }
    
    setActiveStreamId(streamId);
    
    // Reproducir el nuevo stream
    if (hlsPlayerRefs.current[streamId]) {
      hlsPlayerRefs.current[streamId]?.play();
    } else if (videoRefs.current[streamId]) {
      videoRefs.current[streamId]?.play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // Aplicar el estado de mute al video activo
    if (activeStreamId && videoRefs.current[activeStreamId]) {
      videoRefs.current[activeStreamId]!.muted = !isMuted;
    }
  };

  // Función para determinar si una URL es un stream HLS
  const isHLSStream = (url: string): boolean => {
    return url.includes('.m3u8') && !url.toLowerCase().endsWith('.mp4');
  };

  // Función para manejar la referencia del reproductor HLS
  const handleHLSPlayerRef = (streamId: string, el: HLSPlayerRef | null) => {
    if (el) {
      hlsPlayerRefs.current[streamId] = el;
      // También almacenamos el elemento de video para mantener compatibilidad
      videoRefs.current[streamId] = el.getVideoElement();
    }
  };

  // Manejar cuando un video termina de cargar
  const handleVideoLoaded = (streamId: string) => {
    if (loadingStreamId === streamId) {
      setLoadingStreamId(null);
    }
  };

  // Manejar errores de video
  const handleVideoError = (streamId: string) => {
    console.error(`Error al cargar el video para stream: ${streamId}`);
    if (loadingStreamId === streamId) {
      setLoadingStreamId(null);
    }
    
    // Si el stream activo falla, intentar con otro
    if (activeStreamId === streamId) {
      setActiveStreamId(null);
    }
  };

  // Función para abrir la transmisión en pantalla completa
  const openFullscreen = (stream: HorrorStream) => {
    setFullscreenStream(stream);
  };

  // Función para cerrar la pantalla completa
  const closeFullscreen = () => {
    setFullscreenStream(null);
  };

  // Función para renderizar el reproductor adecuado según el tipo de fuente
  const renderPlayer = () => {
    if (!activeStreamId) return null;
    
    const activeStream = horrorStreams.find(stream => stream.id === activeStreamId);
    if (!activeStream) return null;
    
    // Si es un canal de YouTube, usar el componente de YouTube
    if (activeStream.source === 'youtube') {
      return (
        <YouTubeEmbed src={activeStream.streamUrl} />
      );
    }
    
    // Para el resto de canales, usar el reproductor HLS
    return (
      <HLSPlayer
        src={activeStream.streamUrl}
        sourceType={activeStream.source}
        autoPlay={true}
        controls={true}
        onPlay={() => handleVideoLoaded(activeStreamId)}
        onError={(error) => handleVideoError(activeStreamId)}
        ref={(el) => handleHLSPlayerRef(activeStreamId, el)}
      />
    );
  };

  // Función para abrir el stream en una ventana externa
  const openExternalStream = (streamId: string) => {
    const stream = horrorStreams.find(s => s.id === streamId);
    if (!stream) return;
    
    let externalUrl = stream.streamUrl;
    
    // Si es un canal de YouTube, modificar la URL para que se abra directamente en YouTube
    if (stream.source === 'youtube') {
      // Extraer el ID del canal de la URL de embed
      const channelMatch = stream.streamUrl.match(/channel=([^&]+)/);
      if (channelMatch && channelMatch[1]) {
        externalUrl = `https://www.youtube.com/channel/${channelMatch[1]}/live`;
      }
    }
    
    window.open(externalUrl, '_blank');
  };

  return (
    <div className="flex h-screen bg-app-darkest text-white overflow-hidden">
      {/* Pantalla completa */}
      {fullscreenStream && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="bg-app-darker p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{fullscreenStream.title}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-400 hover:text-white"
                onClick={closeFullscreen}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </div>
          </div>
          <div className="flex-1 bg-black flex items-center justify-center">
            {isHLSStream(fullscreenStream.streamUrl) ? (
              <HLSPlayer
                src={fullscreenStream.streamUrl}
                className="w-full h-full object-contain max-h-screen"
                autoPlay={true}
                controls={true}
                sourceType={fullscreenStream.source}
                onPlay={() => handleVideoLoaded(fullscreenStream.id)}
                ref={(el) => handleHLSPlayerRef(fullscreenStream.id, el)}
              />
            ) : (
              <video
                ref={el => videoRefs.current[fullscreenStream.id] = el}
                src={fullscreenStream.streamUrl}
                className="w-full h-full object-contain max-h-screen"
                playsInline
                controls
                autoPlay
                muted={isMuted}
                loop
              />
            )}
          </div>
          <div className="bg-app-darker p-4">
            <p className="text-gray-300">{fullscreenStream.description}</p>
            <div className="flex items-center mt-2 text-sm text-gray-400">
              <span className="flex items-center mr-4">
                <span className="h-2 w-2 bg-red-600 rounded-full mr-1 animate-pulse"></span>
                {fullscreenStream.viewerCount.toLocaleString()} espectadores
              </span>
              {fullscreenStream.rating && (
                <span className="flex items-center mr-4">
                  <Star size={14} className="fill-yellow-400 mr-1" />
                  {fullscreenStream.rating.toFixed(1)}
                </span>
              )}
              {fullscreenStream.year && (
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {fullscreenStream.year}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <Sidebar className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-app-darker p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white mr-4 md:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold">Shows de Terror</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {activeStreamId && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
              onClick={() => navigate('/')}
            >
              Volver al inicio
            </Button>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Transmisiones en vivo de películas de terror</h2>
            <p className="text-gray-400">Disfruta de las mejores películas de terror en streaming 24/7</p>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Cargando transmisiones...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-700 p-4 rounded-md">
              <p className="text-red-300">{error}</p>
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
                size="sm"
                onClick={() => loadHorrorStreams()}
              >
                Intentar de nuevo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {horrorStreams.map((stream) => (
                <div 
                  key={stream.id} 
                  className={`relative flex flex-col bg-app-dark rounded-lg overflow-hidden transition-all duration-300 hover:bg-app-light/20 cursor-pointer ${
                    activeStreamId === stream.id ? 'ring-2 ring-app-accent' : ''
                  }`}
                  onClick={() => setActiveStreamId(stream.id)}
                >
                  <div className="relative">
                    {activeStreamId === stream.id ? (
                      <div className="w-full h-48 bg-black flex items-center justify-center overflow-hidden">
                        {renderPlayer()}
                      </div>
                    ) : (
                      <div className="relative">
                        <img 
                          src={stream.thumbnail} 
                          alt={stream.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <button
                            className="bg-app-accent hover:bg-app-accent/80 text-white rounded-full p-3 transition-all duration-200 transform hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveStreamId(stream.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                    {stream.isLive && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        EN VIVO
                      </div>
                    )}
                    {stream.source === 'youtube' && (
                      <div className="absolute top-2 right-2 bg-red-700 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        YouTube
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-2 line-clamp-1">{stream.title}</h3>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">{stream.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {stream.viewerCount?.toLocaleString() || '---'}
                      </div>
                      <button
                        className="text-app-accent hover:text-app-accent/80 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          openExternalStream(stream.id);
                        }}
                        title="Abrir en ventana externa"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shows;
