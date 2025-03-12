import { useEffect, useRef, forwardRef, useState, useImperativeHandle } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
  sourceType?: string;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
}

export interface HLSPlayerRef {
  play: () => Promise<void> | void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  getVideoElement: () => HTMLVideoElement | null;
}

const HLSPlayer = forwardRef<HLSPlayerRef, HLSPlayerProps>((props, ref) => {
  const {
    src,
    autoPlay = false,
    controls = true,
    width = '100%',
    height = 'auto',
    className = '',
    sourceType = 'unknown',
    onReady,
    onPlay,
    onPause,
    onEnded,
    onError
  } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const retryCountRef = useRef(0);

  // Función para determinar si es un stream MP4
  const isMp4Stream = (url: string): boolean => {
    return url.toLowerCase().endsWith('.mp4');
  };

  // Función para inicializar el reproductor
  const initPlayer = () => {
    // Obtener el elemento de video
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Limpiar cualquier instancia previa de HLS
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Si es un archivo MP4, reproducirlo directamente sin HLS.js
    if (isMp4Stream(src)) {
      console.log('Reproduciendo archivo MP4 directamente');
      videoElement.src = src;
      videoElement.addEventListener('loadeddata', () => {
        setIsLoading(false);
        if (autoPlay) {
          videoElement.play().catch(e => {
            console.error('Error al reproducir video MP4:', e);
            setError('Error al iniciar la reproducción');
          });
        }
      });
      
      videoElement.addEventListener('error', () => {
        console.error('Error en el elemento de video (MP4):', videoElement.error);
        setError(`Error en el reproductor: ${videoElement.error?.message || 'Desconocido'}`);
        setIsLoading(false);
      });
      
      videoElement.addEventListener('playing', () => {
        console.log('Video MP4 reproduciendo');
        setIsLoading(false);
        setError(null);
      });
      
      return;
    }
    
    // Para streams HLS
    if (Hls.isSupported()) {
      try {
        console.log(`Inicializando HLS para ${src} con sourceType: ${sourceType}`);
        
        // Configuración específica para diferentes fuentes
        const isPlutoTV = src.includes('pluto.tv') || src.includes('stitcher');
        const isTDTChannels = sourceType === 'tdtchannels' || src.includes('rmtv') || src.includes('hispantv');
        const isFrequency = sourceType === 'frequency' || src.includes('frequency.stream');
        const isLocalNow = sourceType === 'localnow' || src.includes('localnow');
        const isProxied = src.includes('cors.zimjs.com');
        
        // Configuración básica de HLS
        const config = {
          debug: false,
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          maxBufferSize: 60 * 1000 * 1000, // 60 MB
          maxBufferHole: 0.5,
          startLevel: -1, // Auto start level selection
          xhrSetup: function(xhr: XMLHttpRequest, url: string) {
            if (isProxied) {
              return;
            }
            
            if (isPlutoTV) {
              xhr.setRequestHeader('Origin', 'https://pluto.tv');
              xhr.setRequestHeader('Referer', 'https://pluto.tv/');
            } else if (isTDTChannels) {
              xhr.setRequestHeader('Origin', 'https://www.tdtchannels.com');
              xhr.setRequestHeader('Referer', 'https://www.tdtchannels.com/');
            } else if (isFrequency) {
              xhr.setRequestHeader('Origin', 'https://www.frequency.com');
              xhr.setRequestHeader('Referer', 'https://www.frequency.com/');
            } else if (isLocalNow) {
              xhr.setRequestHeader('Origin', 'https://www.localnow.com');
              xhr.setRequestHeader('Referer', 'https://www.localnow.com/');
            }
            
            xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
          }
        };
        
        const hls = new Hls(config);
        hlsRef.current = hls;
        
        console.log(`Cargando stream HLS: ${src}`);
        
        hls.loadSource(src);
        hls.attachMedia(videoElement);
        
        hls.on(Hls.Events.MEDIA_ATTACHED, function() {
          console.log('HLS: Media attached');
          
          if (autoPlay) {
            const playPromise = videoElement.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error('Error al reproducir automáticamente:', error);
              });
            }
          }
        });
        
        hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
          console.log('HLS: Manifest parsed, found ' + data.levels.length + ' quality levels');
          if (onReady) onReady();
          
          if (autoPlay) {
            videoElement.play().catch(e => {
              console.error('Error al reproducir después de manifest parsed:', e);
            });
          }
        });
        
        hls.on(Hls.Events.LEVEL_LOADED, function() {
          console.log('HLS: Level loaded');
          setIsLoading(false);
        });
        
        hls.on(Hls.Events.LEVEL_SWITCHING, function(event, data) {
          console.log(`HLS: Switching to level ${data.level}`);
        });
        
        hls.on(Hls.Events.ERROR, function(event, data) {
          console.error('HLS Error:', data);
          
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('HLS Error de red:', data);
                setError(`Error de red. Reintentando (${retryCountRef.current + 1}/3)...`);
                
                if (retryCountRef.current < 3) {
                  retryCountRef.current += 1;
                  setRetryCount(retryCountRef.current);
                  
                  setTimeout(() => {
                    console.log(`Reintento ${retryCountRef.current}/3`);
                    if (hlsRef.current) {
                      hlsRef.current.destroy();
                    }
                    initPlayer();
                  }, 2000);
                } else {
                  setError('Error de red. No se pudo cargar el video después de varios intentos.');
                  hls.destroy();
                  hlsRef.current = null;
                  if (onError) onError('Error de red persistente');
                }
                break;
                
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('HLS Error de medio:', data);
                setError('Error en el reproductor. Recuperando...');
                hls.recoverMediaError();
                break;
                
              default:
                console.error('HLS Error fatal:', data);
                setError('Error fatal en el reproductor.');
                hls.destroy();
                hlsRef.current = null;
                if (onError) onError('Error fatal en el reproductor');
                break;
            }
          } else {
            console.warn('HLS Error no fatal:', data);
          }
        });
      } catch (error) {
        console.error('Error al inicializar HLS:', error);
        setError('Error al inicializar el reproductor');
        setIsLoading(false);
        if (onError) onError('Error al inicializar el reproductor');
      }
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('Usando soporte nativo de HLS');
      videoElement.src = src;
      
      videoElement.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        if (autoPlay) {
          videoElement.play().catch(e => {
            console.error('Error al reproducir con soporte nativo:', e);
          });
        }
      });
      
      videoElement.addEventListener('error', () => {
        console.error('Error en el elemento de video (nativo):', videoElement.error);
        setError(`Error en el reproductor: ${videoElement.error?.message || 'Desconocido'}`);
        setIsLoading(false);
        if (onError) onError(`Error en el reproductor: ${videoElement.error?.message || 'Desconocido'}`);
      });
    } else {
      console.error('HLS no es soportado por este navegador y no hay soporte nativo');
      setError('Tu navegador no soporta la reproducción de este contenido');
      setIsLoading(false);
      if (onError) onError('Tu navegador no soporta la reproducción de este contenido');
    }
  };

  useEffect(() => {
    console.log(`HLSPlayer: Inicializando con src=${src}, sourceType=${sourceType}`);
    initPlayer();
    
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, [src, sourceType]);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (videoRef.current) return videoRef.current.play();
    },
    pause: () => {
      if (videoRef.current) videoRef.current.pause();
    },
    stop: () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      
      if (hlsRef.current) {
        hlsRef.current.stopLoad();
      }
    },
    seek: (time: number) => {
      if (videoRef.current) videoRef.current.currentTime = time;
    },
    getDuration: () => {
      return videoRef.current?.duration || 0;
    },
    getCurrentTime: () => {
      return videoRef.current?.currentTime || 0;
    },
    getVideoElement: () => {
      return videoRef.current;
    }
  }));

  return (
    <div style={{ position: 'relative', width, height }}>
      <video
        ref={videoRef}
        className={`w-full h-full ${className}`}
        controls={controls}
        playsInline
        style={{ width: '100%', height: '100%' }}
        onPlay={() => {
          setIsLoading(false);
          if (onPlay) onPlay();
        }}
        onPause={() => {
          if (onPause) onPause();
        }}
        onEnded={() => {
          if (onEnded) onEnded();
        }}
      />
      
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            zIndex: 1
          }}
        >
          <div>Cargando...</div>
        </div>
      )}
      
      {error && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            zIndex: 1,
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div>{error}</div>
        </div>
      )}
    </div>
  );
});

export default HLSPlayer;
