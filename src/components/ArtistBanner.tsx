import React from 'react';
import { Twitter, Globe, Music, Share2 } from 'lucide-react';
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm">
      <div className="mb-3 sm:mb-0 sm:mr-4 md:mr-6 w-full sm:w-auto">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full sm:w-36 md:w-48 lg:w-56 h-auto sm:h-36 md:h-48 lg:h-56 object-cover rounded-md shadow-md"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 mb-1 sm:mb-2 font-medium uppercase tracking-wider">Artist featured on</div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 sm:mb-3 truncate">{name}</h1>
        
        <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 max-w-2xl line-clamp-2 sm:line-clamp-3">
          Internationally acclaimed band known for their unique blend of rock, Latin rhythms, and powerful vocals. 
          With numerous awards and sold-out shows worldwide, they continue to inspire music lovers across generations.
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          <Button className="bg-app-accent hover:bg-app-accent/90 text-white font-medium text-xs rounded-full px-4 sm:px-6 py-1 h-7 sm:h-8">
            LISTEN NOW
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300 h-7 w-7 sm:h-8 sm:w-8">
            <Twitter size={12} className="text-gray-700 sm:w-3.5 sm:h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300 h-7 w-7 sm:h-8 sm:w-8">
            <Globe size={12} className="text-gray-700 sm:w-3.5 sm:h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300 h-7 w-7 sm:h-8 sm:w-8">
            <Music size={12} className="text-gray-700 sm:w-3.5 sm:h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300 h-7 w-7 sm:h-8 sm:w-8">
            <Share2 size={12} className="text-gray-700 sm:w-3.5 sm:h-3.5" />
          </Button>
        </div>
        
        <div className="flex flex-col xs:flex-row xs:items-center text-xs text-gray-500 mt-2 sm:mt-3 gap-1 xs:gap-0">
          <span className="xs:mr-3">Monthly Listeners: 12.8M</span>
          <span className="hidden xs:inline">Top Chart Position: #4</span>
        </div>
      </div>
    </div>
  );
};

export default ArtistBanner;
