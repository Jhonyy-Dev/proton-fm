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
      <div className="flex flex-col md:flex-row p-4 sm:p-6 md:p-8 pb-8 md:pb-12 relative z-10">
        <div className="flex flex-col md:flex-row md:flex-1 items-center md:items-end">
          <div className="mb-4 md:mb-0 md:mr-6">
            <img 
              src={image} 
              alt={name} 
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 object-cover shadow-xl"
            />
          </div>
          
          <div className="flex flex-col gap-1 text-center md:text-left">
            {verified && (
              <div className="mb-1">
                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white font-medium">
                  Verified Artist
                </span>
              </div>
            )}
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">{name}</h1>
            
            {followers > 0 && (
              <p className="text-sm text-gray-300 mb-4">
                {followers.toLocaleString()} monthly listeners
              </p>
            )}
            
            <div className="flex justify-center md:justify-start gap-3 mt-2">
              <Button className="bg-app-accent hover:bg-app-accent/90 text-white font-semibold rounded-full px-6 md:px-8 text-sm md:text-base">
                More
              </Button>
              <Button 
                variant="secondary" 
                className="bg-transparent hover:bg-white/10 border border-gray-600 text-white rounded-full text-sm md:text-base">
                Also
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 md:relative md:self-end md:top-auto md:right-auto mt-4 md:mt-0">
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
