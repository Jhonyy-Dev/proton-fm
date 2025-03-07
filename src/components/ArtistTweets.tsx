import { Twitter, MessageCircle, Heart, Share } from 'lucide-react';

const ArtistTweets = () => {
  return (
    <div className="px-4 sm:px-6 md:px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black">Artist Tweets</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">7 new tweets</span>
          <button className="text-app-accent hover:text-app-accent/80">
            <Twitter size={16} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Twitter size={14} className="text-app-accent" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">Maná Official</h3>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">Yesterday</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 line-clamp-3">
                Your green room looks pretty while lounging #manatour #bestcrowdoftheseason #latinrock
              </p>
              <div className="flex items-center gap-3 sm:gap-4 text-gray-500 text-xs">
                <button className="flex items-center gap-1 hover:text-app-accent">
                  <Heart size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>245</span>
                </button>
                <button className="flex items-center gap-1 hover:text-app-accent">
                  <MessageCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>32</span>
                </button>
                <button className="flex items-center gap-1 hover:text-app-accent">
                  <Share size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>18</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Twitter size={14} className="text-app-accent" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">Maná Official</h3>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">2 days ago</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 line-clamp-3">
                Wow - Who had a blast at our 3 sold-out shows at Madison Square Garden? We are so grateful to all our fans for making this possible! #ManaLegacy
              </p>
              <div className="flex items-center gap-3 sm:gap-4 text-gray-500 text-xs">
                <button className="flex items-center gap-1 hover:text-app-accent">
                  <Heart size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>513</span>
                </button>
                <button className="flex items-center gap-1 hover:text-app-accent">
                  <MessageCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>74</span>
                </button>
                <button className="flex items-center gap-1 hover:text-app-accent">
                  <Share size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>42</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Twitter size={14} className="text-app-accent" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">Maná Official</h3>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">5 days ago</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 line-clamp-3">
                New music coming soon! We've been in the studio working on something special for all of you. Stay tuned for announcements #NewMusic #Anticipation
              </p>
              <div className="flex items-center gap-3 sm:gap-4 text-gray-500 text-xs">
                <button className="flex items-center gap-1 hover:text-app-accent">
                  <Heart size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>842</span>
                </button>
                <button className="flex items-center gap-1 hover:text-app-accent">
                  <MessageCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>156</span>
                </button>
                <button className="flex items-center gap-1 hover:text-app-accent">
                  <Share size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>98</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-sm text-app-accent hover:underline">View all tweets</button>
      </div>
    </div>
  );
};

export default ArtistTweets;
