
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-50 rounded-lg p-4 shadow-sm">
      <div className="mb-4 sm:mb-0 sm:mr-6 w-full sm:w-auto">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full sm:w-48 md:w-56 h-auto sm:h-48 md:h-56 object-cover rounded-md shadow-md"
        />
      </div>
      <div className="flex-1">
        <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Artist featured on</div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3">{name}</h1>
        
        <div className="text-sm text-gray-600 mb-4 max-w-2xl">
          Internationally acclaimed band known for their unique blend of rock, Latin rhythms, and powerful vocals. 
          With numerous awards and sold-out shows worldwide, they continue to inspire music lovers across generations.
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          <Button className="bg-app-accent hover:bg-app-accent/90 text-white font-medium text-xs rounded-full px-6 py-1">
            LISTEN NOW
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300">
            <Twitter size={14} className="text-gray-700" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300">
            <Globe size={14} className="text-gray-700" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300">
            <Music size={14} className="text-gray-700" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300">
            <Share2 size={14} className="text-gray-700" />
          </Button>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mt-3">
          <span className="mr-3">Monthly Listeners: 12.8M</span>
          <span>Top Chart Position: #4</span>
        </div>
      </div>
    </div>
  );
};

export default ArtistBanner;
