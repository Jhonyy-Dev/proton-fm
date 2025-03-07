
import { Heart, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArtistHeaderProps {
  name: string;
  image: string;
  followers?: number;
  verified?: boolean;
}

const ArtistHeader = ({ name, image, followers = 0, verified = false }: ArtistHeaderProps) => {
  return (
    <div className="w-full relative overflow-hidden animate-fade-in">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-app-darker/80 to-app-darkest z-0"></div>
      
      {/* Background image (blurred) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50 blur-sm z-[-1]" 
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      
      {/* Artist info */}
      <div className="flex p-8 pb-12 relative z-10">
        <div className="flex flex-1 items-end">
          <div className="mr-6">
            <img 
              src={image} 
              alt={name} 
              className="w-52 h-52 object-cover shadow-xl"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            {verified && (
              <div className="mb-1">
                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white font-medium">
                  Verified Artist
                </span>
              </div>
            )}
            
            <h1 className="text-5xl font-bold text-white mb-2">{name}</h1>
            
            {followers > 0 && (
              <p className="text-sm text-gray-300 mb-4">
                {followers.toLocaleString()} monthly listeners
              </p>
            )}
            
            <div className="flex gap-3 mt-2">
              <Button className="bg-app-accent hover:bg-app-accent/90 text-white font-semibold rounded-full px-8">
                More
              </Button>
              <Button 
                variant="secondary" 
                className="bg-transparent hover:bg-white/10 border border-gray-600 text-white rounded-full">
                Also
              </Button>
            </div>
          </div>
        </div>
        
        <div className="self-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-300 hover:text-white hover:bg-transparent">
            <MoreHorizontal size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistHeader;
