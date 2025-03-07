
import Sidebar from '@/components/Sidebar';
import ArtistTracks from '@/components/ArtistTracks';
import ArtistTweets from '@/components/ArtistTweets';
import ArtistBanner from '@/components/ArtistBanner';
import PlayerBar from '@/components/PlayerBar';
import { CalendarDays, Award, Disc3, Users } from 'lucide-react';

const News = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/4">
        <Sidebar />
      </div>
      
      <main className="w-1/2 flex flex-col overflow-hidden bg-white pb-20">
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto">
            {/* Artist Header Section */}
            <div className="w-full relative overflow-hidden animate-fade-in">
              {/* Artist Banner with image */}
              <div className="px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4">
                <ArtistBanner name="Maná" />
              </div>
              
              {/* Statistics Cards */}
              <div className="px-4 sm:px-6 md:px-8 py-2 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Disc3 size={18} className="text-app-accent" />
                      <span className="text-sm font-medium text-gray-700">12 Albums</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Award size={18} className="text-app-accent" />
                      <span className="text-sm font-medium text-gray-700">24 Grammy Awards</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-app-accent" />
                      <span className="text-sm font-medium text-gray-700">40M+ Fans</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={18} className="text-app-accent" />
                      <span className="text-sm font-medium text-gray-700">30+ Years Active</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Biography Section */}
              <div className="px-4 sm:px-6 md:px-8 py-4 bg-gray-50 rounded-lg mx-4 sm:mx-6 md:mx-8 mb-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-black mb-3">Biography</h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  Maná is a Mexican rock band from Guadalajara, Jalisco formed in 1986. The group's current lineup consists 
                  of vocalist/guitarist Fher Olvera, drummer Alex González, guitarist Sergio Vallín, and bassist Juan Calleros. 
                  Considered the most influential and successful Latin American band of all time with over 40 million albums sold worldwide, 
                  their sound draws from pop rock, Latin pop, calypso, reggae and ska music genres. They became known for their socially 
                  conscious lyrics and strong advocacy for environmental protection and human rights causes.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  Throughout their career, Maná has been recognized with multiple Grammy and Latin Grammy Awards. Their album 
                  "Revolución de Amor" won a Grammy Award for Best Latin Rock/Alternative Album, and the band has received numerous 
                  accolades for their environmental activism through their Selva Negra Ecological Foundation.
                </p>
                <button className="text-sm text-app-accent hover:underline">Read More</button>
              </div>
              
              {/* Artist Tweets Section */}
              <ArtistTweets />
            </div>
          </div>
        </div>
      </main>
      
      <div className="w-1/4">
        <ArtistTracks />
      </div>

      <PlayerBar />
    </div>
  );
};

export default News;
