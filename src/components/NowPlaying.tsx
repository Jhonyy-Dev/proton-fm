import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  isPlaying?: boolean;
}

interface NowPlayingProps {
  playlist: PlaylistTrack[];
  onClose?: () => void;
}

const NowPlaying = ({ playlist, onClose }: NowPlayingProps) => {
  const location = useLocation();
  const isNewsPage = location.pathname === '/news';

  // If we're on the News page, we don't render this component
  if (isNewsPage) {
    return null;
  }

  return (
    <div className="w-full sm:w-72 md:w-72 h-screen bg-app-darkest flex flex-col animate-fade-in pb-20">
      <div className="p-4 flex justify-between items-center border-b border-app-light/10">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">Top</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
        {onClose && (
          <button 
            className="lg:hidden p-1 rounded-full text-gray-400 hover:text-white"
            onClick={onClose}
            aria-label="Close now playing"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {playlist.map((track, index) => (
          <div 
            key={track.id}
            className={`flex items-center p-3 gap-3 hover:bg-app-light/10 transition-colors cursor-default ${track.isPlaying ? 'bg-app-light/20' : ''}`}
          >
            <img 
              src={track.coverArt} 
              alt={track.title}
              className="w-10 h-10 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-medium truncate ${track.isPlaying ? 'text-app-red' : 'text-white'}`}>
                {track.title}
              </h4>
              <p className="text-xs text-gray-400 truncate">{track.artist}</p>
            </div>
            <div>
              {track.isPlaying ? (
                <Check size={16} className="text-app-red" />
              ) : (
                <Plus size={16} className="text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NowPlaying;
