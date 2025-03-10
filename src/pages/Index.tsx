import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import ArtistHeader from '@/components/ArtistHeader';
import TrackList from '@/components/TrackList';
import PlayerBar from '@/components/PlayerBar';
import NowPlaying from '@/components/NowPlaying';
import { Menu, X, Radio } from 'lucide-react';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) && 
        sidebarOpen
      ) {
        const target = event.target as HTMLElement;
        // No cerrar si se hace clic en el botón de toggle
        if (target.id !== 'sidebar-toggle' && !target.closest('#sidebar-toggle')) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

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
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-app-darkest to-black">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-app-accent rounded-full p-2 animate-pulse">
            <Radio className="h-6 w-6 text-white" />
          </div>
          <div className="text-white text-xl font-medium tracking-wider">PARADZIT</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-app-darker to-app-darkest relative">
      {/* Overlay para cerrar el sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar toggle */}
      <button 
        id="sidebar-toggle"
        className="md:hidden fixed top-4 left-4 z-40 bg-black/70 backdrop-blur-md p-2.5 rounded-full shadow-lg active:scale-95 transition-transform"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>
      
      {/* Logo en móvil */}
      <div className="md:hidden fixed top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
          <div className="bg-app-accent rounded-full p-1">
            <Radio className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-wider">PARADZIT</span>
        </div>
      </div>
      
      {/* Sidebar with responsive behavior */}
      <div 
        ref={sidebarRef}
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:z-10 md:w-72 md:shadow-xl`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden w-full md:ml-72">
        <div className="flex-1 overflow-y-auto pb-28 md:pb-32 pt-16 md:pt-0">
          <ArtistHeader 
            name="Steve Aoki" 
            image="/lovable-uploads/6535285e-5eec-40af-ba8f-0e9bbfca9742.png"
            followers={1893042}
            verified={true}
          />
          
          <div className="py-4 px-4 md:px-6">
            <div className="mb-8">
              <TrackList title="Latest tracks" tracks={tracks} />
            </div>
            
            <div className="mt-4 mb-28">
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
        className={`fixed inset-y-0 right-0 w-full sm:w-80 md:w-96 z-50 transition-transform duration-300 ease-in-out ${
          nowPlayingOpen ? 'translate-x-0' : 'translate-x-full'
        } shadow-2xl`}
      >
        <NowPlaying playlist={nowPlaying} onClose={() => setNowPlayingOpen(false)} />
      </div>
      
      {/* Overlay para cerrar Now Playing en móvil */}
      {nowPlayingOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setNowPlayingOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
