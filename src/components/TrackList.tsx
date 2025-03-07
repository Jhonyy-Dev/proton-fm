import { Plus } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
}

interface TrackListProps {
  title: string;
  tracks: Track[];
}

const TrackList = ({ title, tracks }: TrackListProps) => {
  return (
    <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6 animate-slide-in-bottom">
      <h2 className="text-xl font-bold text-white mb-4 md:mb-6">{title}</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {tracks.map((track) => (
          <div key={track.id} className="track-card group">
            <div className="relative mb-2 md:mb-3">
              <img 
                src={track.coverArt} 
                alt={track.title} 
                className="w-full aspect-square object-cover rounded-md shadow-md"
              />
              <button className="absolute bottom-2 right-2 bg-app-accent text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:block hidden">
                <Plus size={18} />
              </button>
              <button className="absolute bottom-2 right-2 bg-app-accent text-white p-1 rounded-full sm:hidden">
                <Plus size={16} />
              </button>
            </div>
            <h3 className="text-sm font-medium text-white truncate">{track.title}</h3>
            <p className="text-xs text-gray-400 truncate">{track.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;
