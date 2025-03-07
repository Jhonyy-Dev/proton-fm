import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArtistTracksProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ArtistTracks = ({ isOpen, onClose }: ArtistTracksProps) => {
  return (
    <div className={`w-full lg:w-72 h-screen bg-app-darkest border-l border-app-light/10 flex flex-col animate-fade-in overflow-hidden pb-20 ${isOpen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="p-4 border-b border-app-light/10 flex justify-between items-center">
        <h2 className="text-white font-medium">Artist Tracks</h2>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-gray-400 hover:text-white hover:bg-app-dark"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <TrackItem 
          title="The Other Boys + Remixes" 
          artist="NERVO" 
          duration="4:20"
          isActive={true}
        />
        <TrackItem 
          title="Let It Go (Nervo Legend Remix)" 
          artist="NERVO" 
          duration="3:15"
        />
        <TrackItem 
          title="NERVO Nation April 2016" 
          artist="NERVO" 
          duration="4:02"
        />
        <TrackItem 
          title="Bulletproof (feat. Harrison Miya)" 
          artist="NERVO" 
          duration="3:18"
        />
        <TrackItem 
          title="You're Gonna Love Again (NERVO Remix)" 
          artist="NERVO" 
          duration="3:55"
        />
      </div>
    </div>
  );
};

interface TrackItemProps {
  title: string;
  artist: string;
  duration: string;
  isActive?: boolean;
}

const TrackItem = ({ title, artist, duration, isActive = false }: TrackItemProps) => {
  return (
    <div className={`p-4 hover:bg-app-light/10 transition-colors ${isActive ? 'bg-app-light/20' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-app-accent flex items-center justify-center flex-shrink-0">
          <Play size={12} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
            {title}
          </h4>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 truncate">{artist}</p>
            <span className="text-xs text-gray-500">{duration}</span>
          </div>
        </div>
      </div>
      
      {isActive && (
        <div className="mt-2">
          <div className="relative h-5 mb-1">
            <div className="absolute left-0 right-0 h-1 bg-gray-700 rounded-full top-2">
              <div className="h-full bg-app-accent rounded-full w-1/2"></div>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">1:34</span>
            <span className="text-xs text-gray-500">3:24</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistTracks;
