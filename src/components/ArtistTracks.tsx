import { Play, X, Music, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArtistTracksProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ArtistTracks = ({ isOpen, onClose }: ArtistTracksProps) => {
  return (
    <div className={`w-full lg:w-72 h-screen bg-gradient-to-b from-app-darkest to-app-darker border-l border-app-accent/20 flex flex-col animate-fade-in overflow-hidden pb-20 ${isOpen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="p-4 border-b border-app-accent/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Music size={16} className="text-app-accent" />
          <h2 className="text-white font-medium">Artist Tracks</h2>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-app-accent hover:text-white hover:bg-app-dark/40"
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
    <div className={`p-4 hover:bg-black/30 transition-all duration-300 border-b border-app-accent/10 ${isActive ? 'bg-black/40 backdrop-blur-sm' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full ${isActive ? 'bg-app-accent' : 'bg-app-darker border border-app-accent/30'} flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-all`}>
          <Play size={14} className={`${isActive ? 'text-white' : 'text-app-accent'} ${isActive ? 'ml-0.5' : ''}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium truncate ${isActive ? 'text-app-accent' : 'text-gray-200'}`}>
            {title}
          </h4>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-400 truncate">{artist}</p>
            <div className="flex items-center gap-3">
              <button className="text-gray-500 hover:text-app-accent transition-colors">
                <Heart size={12} />
              </button>
              <button className="text-gray-500 hover:text-app-accent transition-colors">
                <MoreHorizontal size={12} />
              </button>
              <span className="text-xs text-gray-500">{duration}</span>
            </div>
          </div>
        </div>
      </div>
      
      {isActive && (
        <div className="mt-3 px-1">
          <div className="relative h-5 mb-1">
            <div className="absolute left-0 right-0 h-1 bg-app-darker rounded-full top-2">
              <div className="h-full bg-app-accent rounded-full w-1/2 relative">
                <div className="absolute -right-1.5 -top-1 w-3 h-3 rounded-full bg-white border-2 border-app-accent shadow-md"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">1:34</span>
            <span className="text-xs text-gray-400">3:24</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistTracks;
