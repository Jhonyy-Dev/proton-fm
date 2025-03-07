import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import useRadioPlayer, { RadioStation } from '@/hooks/useRadioPlayer';

interface RadioContextType {
  stations: RadioStation[];
  currentStation: RadioStation | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  fetchRadioStations: (limit?: number) => Promise<RadioStation[]>;
  playStation: (station: RadioStation) => void;
  togglePlayPause: () => void;
  stopPlayback: () => void;
  setCurrentStation: (station: RadioStation) => void;
  setAudioVolume: (volume: number) => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const RadioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const radioPlayer = useRadioPlayer();
  
  // Pre-load the first station when component mounts
  useEffect(() => {
    if (radioPlayer.stations.length > 0 && !radioPlayer.currentStation) {
      // Just set the current station without playing
      const firstStation = radioPlayer.stations[0];
      radioPlayer.setCurrentStation(firstStation);
    }
  }, [radioPlayer.stations]);

  return (
    <RadioContext.Provider value={radioPlayer}>
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
