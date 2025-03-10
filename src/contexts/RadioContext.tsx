import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import useRadioPlayer, { RadioStation } from '@/hooks/useRadioPlayer';

interface RadioContextType {
  stations: RadioStation[];
  currentStation: RadioStation | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  favoriteStations: string[]; 
  fetchRadioStations: (limit?: number) => Promise<RadioStation[]>;
  playStation: (station: RadioStation) => void;
  togglePlayPause: () => void;
  stopPlayback: () => void;
  setCurrentStation: (station: RadioStation) => void;
  setAudioVolume: (volume: number) => void;
  toggleFavorite: (stationId: string) => void; 
  isFavorite: (stationId: string) => boolean; 
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const RadioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const radioPlayer = useRadioPlayer();
  const [favoriteStations, setFavoriteStations] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('favoriteStations');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  useEffect(() => {
    if (radioPlayer.stations.length > 0 && !radioPlayer.currentStation) {
      const firstStation = radioPlayer.stations[0];
      radioPlayer.setCurrentStation(firstStation);
    }
  }, [radioPlayer.stations]);

  useEffect(() => {
    localStorage.setItem('favoriteStations', JSON.stringify(favoriteStations));
  }, [favoriteStations]);

  const toggleFavorite = (stationId: string) => {
    setFavoriteStations(prev => {
      if (prev.includes(stationId)) {
        return prev.filter(id => id !== stationId);
      } else {
        return [...prev, stationId];
      }
    });
  };

  const isFavorite = (stationId: string) => {
    return favoriteStations.includes(stationId);
  };

  return (
    <RadioContext.Provider value={{
      ...radioPlayer,
      favoriteStations,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </RadioContext.Provider>
  );
};

export const useRadio = (): RadioContextType => {
  const context = useContext(RadioContext);
  if (context === undefined) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};
