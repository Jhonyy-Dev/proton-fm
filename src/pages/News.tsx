import Sidebar from '@/components/Sidebar';
import ArtistTracks from '@/components/ArtistTracks';
import ArtistTweets from '@/components/ArtistTweets';
import ArtistBanner from '@/components/ArtistBanner';
import PlayerBar from '@/components/PlayerBar';
import { CalendarDays, Award, Disc3, Users, Menu, Music } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const News = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTracksOpen, setIsTracksOpen] = useState(false);
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-app-darkest text-white">
      {/* Mobile header with menu button */}
      <div className="md:hidden flex items-center justify-between p-3 bg-black/80 backdrop-blur-md text-white border-b border-app-accent/30 sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-app-accent hover:bg-app-dark/40"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </Button>
        <h1 className="text-lg font-semibold text-app-accent">News</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-app-accent hover:bg-app-dark/40 lg:hidden"
          onClick={() => setIsTracksOpen(true)}
        >
          <Music size={20} />
        </Button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile, shown when toggled */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5 absolute md:relative z-30 h-full`}>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
        
        {/* Main content */}
        <main className="w-full md:w-3/4 lg:w-3/5 flex flex-col overflow-hidden bg-gradient-to-b from-app-darkest to-app-dark pb-20">
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto">
              {/* Artist Header Section */}
              <div className="w-full relative overflow-hidden animate-fade-in">
                {/* Artist Banner with image */}
                <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
                  <ArtistBanner name="Maná" />
                </div>
                
                {/* Statistics Cards */}
                <div className="px-4 sm:px-6 md:px-8 py-2 mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-app-darker/60 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-app-accent/20 hover:border-app-accent/40 transition-all hover:translate-y-[-2px]">
                      <div className="flex items-center gap-2">
                        <Disc3 size={18} className="text-app-accent" />
                        <span className="text-sm font-medium text-white">12 Albums</span>
                      </div>
                    </div>
                    <div className="bg-app-darker/60 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-app-accent/20 hover:border-app-accent/40 transition-all hover:translate-y-[-2px]">
                      <div className="flex items-center gap-2">
                        <Award size={18} className="text-app-accent" />
                        <span className="text-sm font-medium text-white">24 Grammy Awards</span>
                      </div>
                    </div>
                    <div className="bg-app-darker/60 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-app-accent/20 hover:border-app-accent/40 transition-all hover:translate-y-[-2px]">
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-app-accent" />
                        <span className="text-sm font-medium text-white">40M+ Fans</span>
                      </div>
                    </div>
                    <div className="bg-app-darker/60 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-app-accent/20 hover:border-app-accent/40 transition-all hover:translate-y-[-2px]">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={18} className="text-app-accent" />
                        <span className="text-sm font-medium text-white">30+ Years Active</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Biography Section */}
                <div className="px-4 sm:px-6 md:px-8 py-6 bg-black/40 backdrop-blur-sm rounded-xl mx-4 sm:mx-6 md:mx-8 mb-8 shadow-xl border border-app-accent/20">
                  <h2 className="text-xl font-semibold text-app-accent mb-4">Biography</h2>
                  <p className="text-sm text-gray-200 leading-relaxed mb-4">
                    Maná is a Mexican rock band from Guadalajara, Jalisco formed in 1986. The group's current lineup consists 
                    of vocalist/guitarist Fher Olvera, drummer Alex González, guitarist Sergio Vallín, and bassist Juan Calleros. 
                    Considered the most influential and successful Latin American band of all time with over 40 million albums sold worldwide, 
                    their sound draws from pop rock, Latin pop, calypso, reggae and ska music genres. They became known for their socially 
                    conscious lyrics and strong advocacy for environmental protection and human rights causes.
                  </p>
                  <p className="text-sm text-gray-200 leading-relaxed mb-4">
                    Throughout their career, Maná has been recognized with multiple Grammy and Latin Grammy Awards. Their album 
                    "Revolución de Amor" won a Grammy Award for Best Latin Rock/Alternative Album, and the band has received numerous 
                    accolades for their environmental activism through their Selva Negra Ecological Foundation.
                  </p>
                  <button className="text-sm text-app-accent hover:text-white hover:underline transition-colors">Read More</button>
                </div>
                
                {/* Artist Tweets Section */}
                <ArtistTweets />
              </div>
            </div>
          </div>
        </main>
        
        {/* Artist tracks sidebar - hidden on mobile and small tablets */}
        <div className="hidden lg:block lg:w-1/5 border-l border-app-accent/20 bg-app-darker">
          <ArtistTracks />
        </div>
        
        {/* Mobile Artist Tracks panel */}
        {isTracksOpen && (
          <div className="lg:hidden">
            <ArtistTracks isOpen={isTracksOpen} onClose={() => setIsTracksOpen(false)} />
          </div>
        )}
      </div>

      <PlayerBar />
    </div>
  );
};

export default News;
