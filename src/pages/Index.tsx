
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ArtistHeader from '@/components/ArtistHeader';
import TrackList from '@/components/TrackList';
import PlayerBar from '@/components/PlayerBar';
import NowPlaying from '@/components/NowPlaying';

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
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
    <div className="flex h-screen overflow-hidden bg-app-darker">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <ArtistHeader 
            name="Steve Aoki" 
            image="/lovable-uploads/6535285e-5eec-40af-ba8f-0e9bbfca9742.png"
            followers={1893042}
            verified={true}
          />
          
          <div className="bg-gradient-to-b from-app-darker to-app-darkest py-4">
            <TrackList title="Latest tracks" tracks={tracks} />
            
            <div className="mt-4">
              <TrackList title="Popular Releases" tracks={tracks} />
            </div>
          </div>
        </div>
        
        <PlayerBar />
      </div>
      
      <NowPlaying playlist={nowPlaying} />
    </div>
  );
};

export default Index;
