import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface RadioStation {
  id: string;
  name: string;
  url: string;
  favicon: string;
  genre?: string;
  country?: string;
  language?: string;
}

// Updated list of radio stations with more reliable streams
const DEFAULT_STATIONS: RadioStation[] = [
  {
    id: '1',
    name: 'Deep House Radio',
    url: 'https://strm112.1.fm/deephouse_mobile_mp3',
    favicon: 'https://media.illustrationx.com/images/news/4592/700/blog_4592_637412982672965730.jpg',
    genre: 'Electronic',
    country: 'Global',
    language: 'English'
  },
  {
    id: '3',
    name: 'EDM & Electronica',
    url: 'https://strm112.1.fm/electronica_mobile_mp3',
    favicon: 'https://media.illustrationx.com/images/news/4592/700/blog_4592_637412982672965730.jpg',
    genre: 'Electronic',
    country: 'Global',
    language: 'English'
  },
  {
    id: '4',
    name: 'Club & Dance Hits',
    url: 'https://strm112.1.fm/club_mobile_mp3',
    favicon: 'https://media.illustrationx.com/images/news/4592/700/blog_4592_637412982672965730.jpg',
    genre: 'Electronic',
    country: 'Global',
    language: 'English'
  },
  {
    id: '5',
    name: 'Reggaeton',
    url: 'https://strm112.1.fm/reggaeton_mobile_mp3',
    favicon: 'https://lastfm.freetls.fastly.net/i/u/300x300/48e2aa75085404fcb6ae547bfc56ee63.jpg',
    genre: 'Reggaeton',
    country: 'Latin America',
    language: 'Spanish'
  },
  {
    id: '6',  
    name: 'Retro Music',
    url: 'https://strm112.1.fm/spanisholdies_mobile_mp3',
    favicon: 'https://i.iheart.com/v3/re/new_assets/604b5ca11b76b4e49288f80e?ops=contain(1480,0)',
    genre: 'Classic Rock',
    country: 'United States',
    language: 'English'
  },
  {
    id: '7',
    name: 'Rock Classics',
    url: 'https://strm112.1.fm/classicrock_mobile_mp3',
    favicon: 'https://i.iheart.com/v3/re/new_assets/604b5ca11b76b4e49288f80e?ops=contain(1480,0)',
    genre: 'Classic Rock',
    country: 'United States',
    language: 'English'
  },
  {
    id: '8',
    name: 'Jazz Cafe',
    url: 'https://strm112.1.fm/smoothjazz_mobile_mp3',
    favicon: 'https://downbeat.com/images/news/_full/DB21_12_28_Reviews_Kenny_Garrett_Lead.jpg',
    genre: 'Jazz',
    country: 'Global',
    language: 'English'
  },
  {
    id: '9',
    name: 'Música Latina Variada',
    url: 'https://streamer.radio.co/s83eb8ff39/listen',
    favicon: 'https://f4.bcbits.com/img/a1807740989_10.jpg',
    genre: 'Música Latina',
    country: 'LATAM',
    language: 'Spanish'
  },
  {
    id: '10',
    name: 'Reggaeton 2',
    url: 'https://strm112.1.fm/latino_mobile_mp3',
    favicon: 'https://lastfm.freetls.fastly.net/i/u/300x300/48e2aa75085404fcb6ae547bfc56ee63.jpg',
    genre: 'Reggaeton',
    country: 'Latin America',
    language: 'Spanish'
  },
  {
    id: '11',
    name: 'Rock & Pop',
    url: 'https://22983.live.streamtheworld.com/ROCK_AND_POP_SC',
    favicon: 'https://www.rollingstone.com/wp-content/uploads/2018/06/rs-178306-pop_albums_REAL.jpg',
    genre: 'Rock & Pop',
    country: 'Latin America',
    language: 'Spanish'
  },
];

// Servidores alternativos conocidos para emisoras específicas
const STATION_FALLBACKS = {
  // Rock Classics - ID 7
  '7': [
    'https://strm112.1.fm/classicrock_mobile_mp3',
    'https://stream.1a-webradio.de/saw-rock/mp3-128/radiode-1a/',
    'https://stream.laut.fm/classicrock?ref=radiode',
  ],
  // Reggaeton 2 - ID 10
  '10': [
    'https://strm112.1.fm/latino_mobile_mp3',
    'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_LATIN_SC',
    'https://stream.zeno.fm/0a3kc3vqkrhvv',
  ],
  // Rock en Español - ID 11
  '11': [
    'https://22983.live.streamtheworld.com/ROCK_AND_POP_SC',
    'https://playerservices.streamtheworld.com/api/livestream-redirect/ROCK_AND_POP_SC',
    'https://14013.live.streamtheworld.com/ROCK_AND_POP_SC',
    'https://14083.live.streamtheworld.com/ROCK_AND_POP_SC'
  ],
};

// Proxy para emisoras problemáticas
const CORS_PROXY_URL = 'https://corsproxy.io/?';

// Función para verificar si una URL es accesible
const checkStreamUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
    return true; // Si no hay error, consideramos que la URL es accesible
  } catch (error) {
    console.error(`Error checking URL ${url}:`, error);
    return false;
  }
};

const useRadioPlayer = () => {
  const [stations, setStations] = useState<RadioStation[]>(DEFAULT_STATIONS);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(50); // Add volume state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      // Create a new audio element
      const audio = new Audio();
      audio.crossOrigin = "anonymous"; // Enable CORS for cross-origin streams
      
      // Set audio attributes for better streaming
      audio.preload = "auto";
      
      // Set initial volume
      audio.volume = volume / 100;
      
      // Clear event listeners to prevent memory leaks
      const clearListeners = () => {
        audio.onerror = null;
        audio.oncanplaythrough = null;
        audio.onplaying = null;
      };
      
      // Add global error handler
      audio.onerror = (e) => {
        console.error('Audio error:', e);
        console.error('Audio error code:', audio.error?.code);
        console.error('Audio error message:', audio.error?.message);
        
        setIsPlaying(false);
        setIsLoading(false);
        
        toast({
          title: 'Playback Error',
          description: `Could not play this station. Error: ${audio.error?.message || 'Unknown error'}`,
          variant: 'destructive',
        });
      };

      // Add canplaythrough event
      audio.oncanplaythrough = () => {
        setIsLoading(false);
      };
      
      // Add abort handler
      audio.onabort = () => {
        setIsLoading(false);
        setIsPlaying(false);
      };
      
      // Set the ref
      audioRef.current = audio;
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load(); // Force resource release
        
        // Clear all event listeners
        audioRef.current.onerror = null;
        audioRef.current.oncanplaythrough = null;
        audioRef.current.onplaying = null;
        audioRef.current.onabort = null;
      }
    };
  }, [toast]);

  const fetchRadioStations = async (limit = 20) => {
    // Simply return our default stations
    return stations;
  };

  // Función para reproducir una estación con manejo avanzado de errores
  const playStation = (station: RadioStation) => {
    if (!audioRef.current) return;

    // Set loading state and current station
    setIsLoading(true);
    setCurrentStation(station);
    
    // Contador para intentos de fallback
    let fallbackAttempt = 0;
    
    // Función para intentar reproducir con URL alternativa
    const tryWithFallbackUrl = () => {
      if (!audioRef.current) return;
      
      // Obtener fallbacks para esta emisora si existen
      const fallbacks = STATION_FALLBACKS[station.id as keyof typeof STATION_FALLBACKS];
      
      // Si hay fallbacks disponibles y no hemos agotado los intentos
      if (fallbacks && fallbackAttempt < fallbacks.length) {
        console.log(`Intentando con URL alternativa ${fallbackAttempt + 1} para ${station.name}`);
        
        // Usar la siguiente URL alternativa
        const fallbackUrl = fallbacks[fallbackAttempt];
        audioRef.current.src = fallbackUrl;
        audioRef.current.load();
        
        // Incrementar contador de intentos
        fallbackAttempt++;
        
        // Intentar reproducir
        const fallbackPlayPromise = audioRef.current.play();
        if (fallbackPlayPromise !== undefined) {
          fallbackPlayPromise.catch(error => {
            console.error(`Error con URL alternativa ${fallbackAttempt}:`, error);
            
            // Si aún hay más alternativas, intentar con la siguiente
            if (fallbackAttempt < fallbacks.length) {
              tryWithFallbackUrl();
            } else {
              // Intentar con proxy CORS como último recurso
              console.log('Intentando con proxy CORS...');
              audioRef.current!.src = `${CORS_PROXY_URL}${encodeURIComponent(station.url)}`;
              audioRef.current!.load();
              
              const proxyPlayPromise = audioRef.current!.play();
              if (proxyPlayPromise !== undefined) {
                proxyPlayPromise.catch(finalError => {
                  console.error('Error final, no se pudo reproducir la emisora:', finalError);
                  setIsPlaying(false);
                  setIsLoading(false);
                  toast({
                    title: 'Error de reproducción',
                    description: `No se pudo reproducir ${station.name} después de múltiples intentos. Por favor, intente con otra emisora.`,
                    variant: 'destructive',
                  });
                });
              }
            }
          });
        }
      } else {
        // Si no hay fallbacks definidos, intentar con la lista genérica de servidores alternativos
        tryAlternativeUrl(station.url);
      }
    };
    
    // Lista de servidores alternativos para probar si la URL principal falla
    const alternativeServers = [
      { prefix: 'https://stream.', suffix: '' },
      { prefix: 'https://stream-157.', suffix: '' },
      { prefix: 'https://stream-uk.', suffix: '' },
      { prefix: 'https://stream-us.', suffix: '' },
      { prefix: 'https://', suffix: '' },
    ];
    
    // Función para intentar reproducir con URL alternativa generada automáticamente
    const tryAlternativeUrl = (baseUrl: string, index: number = 0) => {
      if (!audioRef.current || index >= alternativeServers.length) {
        // Si hemos agotado todas las alternativas, mostrar error
        setIsPlaying(false);
        setIsLoading(false);
        toast({
          title: 'Error de reproducción',
          description: `No se pudo reproducir ${station.name}. Por favor, intente con otra emisora.`,
          variant: 'destructive',
        });
        return;
      }
      
      // Extraer el dominio y la ruta de la URL original
      let urlObj: URL;
      try {
        urlObj = new URL(baseUrl);
      } catch (e) {
        console.error('URL inválida:', baseUrl);
        tryAlternativeUrl(baseUrl, index + 1);
        return;
      }
      
      const path = urlObj.pathname + urlObj.search;
      const domain = urlObj.hostname;
      
      // Construir URL alternativa
      const alt = alternativeServers[index];
      const altDomain = domain.startsWith('stream.') ? domain.substring(7) : domain;
      const alternativeUrl = `${alt.prefix}${altDomain}${alt.suffix}${path}`;
      
      console.log(`Probando URL alternativa (${index + 1}/${alternativeServers.length}):`, alternativeUrl);
      
      // Configurar el audio con la URL alternativa
      audioRef.current.src = alternativeUrl;
      audioRef.current.load();
      
      // Intentar reproducir
      const altPlayPromise = audioRef.current.play();
      if (altPlayPromise !== undefined) {
        altPlayPromise.catch(error => {
          console.error(`Error con URL alternativa ${index + 1}:`, error);
          // Intentar con la siguiente alternativa
          tryAlternativeUrl(baseUrl, index + 1);
        });
      }
    };
    
    try {
      // Stop current playback
      audioRef.current.pause();
      
      // Reset the audio element
      audioRef.current.currentTime = 0;
      
      // Update console for debugging
      console.log('Setting audio source to:', station.url);
      
      // Set new source
      audioRef.current.src = station.url;
      
      // For better cross-browser compatibility
      audioRef.current.load();
      
      // Add event listener for when playback actually starts
      audioRef.current.onplaying = () => {
        setIsPlaying(true);
        setIsLoading(false);
        toast({
          title: 'Reproduciendo',
          description: `${station.name}`,
          className: "min-w-0 w-auto max-w-[200px] p-2 text-xs bg-black/80 backdrop-blur-md",
          duration: 2000,
        });
      };
      
      // Add error handler
      audioRef.current.onerror = () => {
        console.error('Error reproduciendo emisora:', station.name);
        
        // Intentar con URL alternativa
        tryWithFallbackUrl();
      };
      
      // Add play promise with error handling
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started
            console.log('Reproducción iniciada correctamente');
          })
          .catch(error => {
            console.error('Error reproduciendo emisora:', error);
            
            // Intentar con URL alternativa
            tryWithFallbackUrl();
          });
      }
    } catch (error) {
      console.error('Error configurando audio:', error);
      setIsPlaying(false);
      setIsLoading(false);
      toast({
        title: 'Error de configuración',
        description: 'No se pudo configurar el reproductor de audio. Por favor, intente de nuevo.',
        variant: 'destructive',
      });
    }
  };

  const togglePlayPause = () => {
    // If there's no audio element, return
    if (!audioRef.current) return;
    
    // If no current station, play the first one
    if (!currentStation && stations.length > 0) {
      playStation(stations[0]);
      return;
    }

    if (isPlaying) {
      // Pause current playback
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // If audio has a source but is paused, resume playback
      if (audioRef.current.src) {
        try {
          setIsLoading(true);
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setIsLoading(false);
              })
              .catch(error => {
                console.error('Error resuming playback:', error);
                setIsPlaying(false);
                setIsLoading(false);
                
                // If we can't resume, try playing the current station again
                if (currentStation) {
                  playStation(currentStation);
                }
              });
          }
        } catch (error) {
          console.error('Error in togglePlayPause:', error);
          setIsPlaying(false);
          setIsLoading(false);
          
          // Try playing the current station again
          if (currentStation) {
            playStation(currentStation);
          }
        }
      } else if (currentStation) {
        // If audio has no source but we have a current station, play it
        playStation(currentStation);
      }
    }
  };

  const stopPlayback = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  // Add volume control function
  const setAudioVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    
    // Ensure volume is between 0 and 100
    const clampedVolume = Math.max(0, Math.min(100, newVolume));
    
    // Update audio element volume (range 0-1)
    audioRef.current.volume = clampedVolume / 100;
    
    // Establecer el factor de volumen global para las ondas del espectro
    (window as any).audioVolumeFactor = clampedVolume / 100;
    
    // Update volume state
    setVolume(clampedVolume);
  };

  return {
    stations,
    currentStation,
    isPlaying,
    isLoading,
    volume,
    fetchRadioStations,
    playStation,
    togglePlayPause,
    stopPlayback,
    setCurrentStation,
    setAudioVolume, // Expose volume control function
  };
};

export default useRadioPlayer;
