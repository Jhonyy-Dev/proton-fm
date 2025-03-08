import React from 'react';
import { Twitter, Globe, Music, Share2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArtistBannerProps {
  name: string;
  imageUrl?: string;
}

const ArtistBanner: React.FC<ArtistBannerProps> = ({ 
  name, 
  imageUrl = "https://www.rollingstone.com/wp-content/uploads/2019/12/Mana-Full-Band-Press-Photo-e1575412647199.jpg" 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-xl border border-app-accent/20">
      <div className="mb-4 sm:mb-0 sm:mr-5 md:mr-6 w-full sm:w-auto relative group">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full sm:w-40 md:w-52 lg:w-60 h-auto sm:h-40 md:h-52 lg:h-60 object-cover rounded-lg shadow-lg border border-app-accent/30 group-hover:border-app-accent/60 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-lg">
          <Button variant="ghost" size="icon" className="rounded-full bg-app-accent/90 hover:bg-app-accent text-white h-12 w-12">
            <Play size={24} className="ml-1" />
          </Button>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-app-accent/80 mb-2 sm:mb-3 font-medium uppercase tracking-wider">Artist featured on</div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 truncate">{name}</h1>
        
        <div className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-5 max-w-2xl line-clamp-2 sm:line-clamp-3">
          Internationally acclaimed band known for their unique blend of rock, Latin rhythms, and powerful vocals. 
          With numerous awards and sold-out shows worldwide, they continue to inspire music lovers across generations.
        </div>
        
        <div className="flex flex-wrap gap-3 mb-3">
          <Button className="bg-app-accent hover:bg-app-accent/90 text-white font-medium text-xs rounded-full px-5 sm:px-7 py-1 h-8 sm:h-9 shadow-md hover:shadow-lg transition-all">
            LISTEN NOW
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-app-darker hover:bg-app-dark border border-app-accent/30 hover:border-app-accent/60 h-8 w-8 sm:h-9 sm:w-9 shadow-md transition-all">
            <Twitter size={14} className="text-app-accent sm:w-4 sm:h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-app-darker hover:bg-app-dark border border-app-accent/30 hover:border-app-accent/60 h-8 w-8 sm:h-9 sm:w-9 shadow-md transition-all">
            <Globe size={14} className="text-app-accent sm:w-4 sm:h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-app-darker hover:bg-app-dark border border-app-accent/30 hover:border-app-accent/60 h-8 w-8 sm:h-9 sm:w-9 shadow-md transition-all">
            <Music size={14} className="text-app-accent sm:w-4 sm:h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-app-darker hover:bg-app-dark border border-app-accent/30 hover:border-app-accent/60 h-8 w-8 sm:h-9 sm:w-9 shadow-md transition-all">
            <Share2 size={14} className="text-app-accent sm:w-4 sm:h-4" />
          </Button>
        </div>
        
        <div className="flex flex-col xs:flex-row xs:items-center text-xs text-gray-400 mt-3 sm:mt-4 gap-2 xs:gap-0">
          <span className="xs:mr-4 flex items-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-app-accent mr-2"></span>
            Monthly Listeners: 12.8M
          </span>
          <span className="hidden xs:flex xs:items-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-app-accent mr-2"></span>
            Top Chart Position: #4
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArtistBanner;
