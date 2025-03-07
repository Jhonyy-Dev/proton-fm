import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ArtistHeader from '@/components/ArtistHeader';
import TrackList from '@/components/TrackList';
import PlayerBar from '@/components/PlayerBar';
import NowPlaying from '@/components/NowPlaying';
import { Menu } from 'lucide-react';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const sidebarToggle = document.getElementById('sidebar-toggle');
      
      if (sidebar && !sidebar.contains(event.target as Node) && 
          sidebarToggle && !sidebarToggle.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tracks = [
    {
      id: "1",
      title: "Lemonade",
      artist: "Sophie",
      coverArt: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&auto=format"
    },
    {
      id: "2",
      title: "No Broken Hearts",
      artist: "Bebe Rexha",
      coverArt: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&auto=format"
    },
    {
      id: "3",
      title: "La La Land",
      artist: "Demi Lovato",
      coverArt: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&auto=format"
    },
    {
      id: "4",
      title: "Don't Let Me Down",
      artist: "The Chainsmokers",
      coverArt: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&auto=format"
    },
    {
      id: "5",
      title: "Runway",
      artist: "Galantis",
      coverArt: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&auto=format"
    }
  ];

  const nowPlaying = [
    {
      id: "p1",
      title: "Don't Let Me Down",
      artist: "The Chainsmokers",
      coverArt: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&auto=format",
      isPlaying: true
    },
    {
      id: "p2",
      title: "Tonight Feat. iDubbbz",
      artist: "Alex",
      coverArt: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&auto=format"
    },
    {
      id: "p3",
      title: "No Money",
      artist: "Galantis",
      coverArt: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&auto=format"
    },
    {
      id: "p4",
      title: "Faded",
      artist: "Alan Walker",
      coverArt: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&auto=format"
    },
    {
      id: "p5",
      title: "Together",
      artist: "The xx",
      coverArt: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&auto=format"
    },
    {
      id: "p6",
      title: "Runaway",
      artist: "Bon Iver",
      coverArt: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&auto=format"
    },
    {
      id: "p7",
      title: "Oxygen",
      artist: "Winona Oak",
      coverArt: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&auto=format"
    }
  ];

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-app-darkest">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-app-darker relative">
      {/* Mobile sidebar toggle */}
      <button 
        id="sidebar-toggle"
        className="lg:hidden fixed top-4 left-4 z-50 bg-app-dark p-2 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5 text-white" />
      </button>
      
      {/* Sidebar with responsive behavior */}
      <div 
        id="sidebar"
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out lg:relative lg:z-0`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <div className="flex-1 overflow-y-auto pb-28 md:pb-32">
          <ArtistHeader 
            name="Steve Aoki" 
            image="/lovable-uploads/6535285e-5eec-40af-ba8f-0e9bbfca9742.png"
            followers={1893042}
            verified={true}
          />
          
          <div className="bg-gradient-to-b from-app-darker to-app-darkest py-4 px-4 md:px-6">
            <TrackList title="Latest tracks" tracks={tracks} />
            
            <div className="mt-4 mb-24">
              <TrackList title="Popular Releases" tracks={tracks} />
            </div>
          </div>
        </div>
        
        <PlayerBar 
          onNowPlayingToggle={() => setNowPlayingOpen(!nowPlayingOpen)} 
          nowPlayingOpen={nowPlayingOpen}
        />
      </div>
      
      {/* Now Playing with responsive behavior */}
      <div 
        className={`${
          nowPlayingOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 fixed inset-y-0 right-0 z-40 transition-transform duration-300 ease-in-out lg:relative lg:z-0`}
      >
        <NowPlaying playlist={nowPlaying} onClose={() => setNowPlayingOpen(false)} />
      </div>
    </div>
  );
};

export default Index;
