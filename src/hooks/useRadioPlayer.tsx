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
    favicon: '/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png',
    genre: 'Electronic',
    country: 'Global',
    language: 'English'
  },
  {
    id: '2',
    name: 'Techno & Trance',
    url: 'https://strm112.1.fm/trance_mobile_mp3',
    favicon: '/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png',
    genre: 'Electronic',
    country: 'Global',
    language: 'English'
  },
  {
    id: '3',
    name: 'EDM & Electronica',
    url: 'https://strm112.1.fm/electronica_mobile_mp3',
    favicon: '/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png',
    genre: 'Electronic',
    country: 'Global',
    language: 'English'
  },
  {
    id: '4',
    name: 'Club & Dance Hits',
    url: 'https://strm112.1.fm/club_mobile_mp3',
    favicon: '/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png',
    genre: 'Electronic',
    country: 'Global',
    language: 'English'
  },
  {
    id: '5',
    name: 'Reggaeton',
    url: 'https://strm112.1.fm/reggaeton_mobile_mp3',
    favicon: '/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png',
    genre: 'Reggaeton',
    country: 'Latin America',
    language: 'Spanish'
  },
  {
    id: '6',  
    name: 'Salsa',
    url: 'https://strm112.1.fm/spanisholdies_mobile_mp3',
    favicon: '/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png',
    genre: 'Latin',
    country: 'Latin America',
    language: 'Spanish'
  },
  {
    id: '8',
    name: 'Latino Pop',
    url: 'https://strm112.1.fm/top40_mobile_mp3',
    favicon: '/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png',
    genre: 'Latin Pop',
    country: 'Latin America',
    language: 'Spanish'
  },
  {
    id: '9',
    name: 'Bachata',
    url: 'https://streamer.radio.co/s83eb8ff39/listen',
    favicon: '/lovable-uploads/88cccc36-9139-4f33-8d9f-f3006bf4526e.png',
    genre: 'Bachata',
    country: 'Dominican Republic',
    language: 'Spanish'
  },
];

const useRadioPlayer = () => {
  const [stations, setStations] = useState<RadioStation[]>(DEFAULT_STATIONS);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(70); // Add volume state
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

  const playStation = (station: RadioStation) => {
    if (!audioRef.current) return;

    // Set loading state and current station
    setIsLoading(true);
    setCurrentStation(station);
    
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
          title: 'Now Playing',
          description: `${station.name}`,
        });
      };
      
      // Add play promise with error handling
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started
            console.log('Playback started successfully');
          })
          .catch(error => {
            console.error('Error playing station:', error);
            setIsPlaying(false);
            setIsLoading(false);
            toast({
              title: 'Playback Error',
              description: `Could not play ${station.name}. ${error.message}`,
              variant: 'destructive',
            });
          });
      }
    } catch (error) {
      console.error('Error setting up audio:', error);
      setIsPlaying(false);
      setIsLoading(false);
      toast({
        title: 'Setup Error',
        description: 'Could not set up the audio player. Please try again.',
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
