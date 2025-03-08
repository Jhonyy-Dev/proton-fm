import { Twitter, MessageCircle, Heart, Share, MoreHorizontal } from 'lucide-react';

const ArtistTweets = () => {
  return (
    <div className="px-4 sm:px-6 md:px-8 py-4 mb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-app-accent">Artist Tweets</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-app-accent/80 font-medium hidden sm:inline">7 new tweets</span>
          <button className="text-app-accent hover:text-white transition-colors">
            <Twitter size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-app-accent/20 hover:border-app-accent/40 shadow-lg hover:shadow-xl transition-all hover:translate-y-[-2px] group">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-app-darker flex items-center justify-center border border-app-accent/30 overflow-hidden group-hover:border-app-accent/60 transition-all">
                <Twitter size={16} className="text-app-accent" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white text-sm sm:text-base truncate">Maná Official</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 flex-shrink-0">Yesterday</span>
                  <button className="text-gray-400 hover:text-app-accent transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 line-clamp-3">
                Your green room looks pretty while lounging #manatour #bestcrowdoftheseason #latinrock
              </p>
              <div className="flex items-center gap-4 sm:gap-5 text-gray-400 text-xs">
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <Heart size={14} className="sm:w-4 sm:h-4" />
                  <span>245</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                  <span>32</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <Share size={14} className="sm:w-4 sm:h-4" />
                  <span>18</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-app-accent/20 hover:border-app-accent/40 shadow-lg hover:shadow-xl transition-all hover:translate-y-[-2px] group">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-app-darker flex items-center justify-center border border-app-accent/30 overflow-hidden group-hover:border-app-accent/60 transition-all">
                <Twitter size={16} className="text-app-accent" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white text-sm sm:text-base truncate">Maná Official</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 flex-shrink-0">2 days ago</span>
                  <button className="text-gray-400 hover:text-app-accent transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 line-clamp-3">
                Wow - Who had a blast at our 3 sold-out shows at Madison Square Garden? We are so grateful to all our fans for making this possible! #ManaLegacy
              </p>
              <div className="flex items-center gap-4 sm:gap-5 text-gray-400 text-xs">
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <Heart size={14} className="sm:w-4 sm:h-4" />
                  <span>513</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                  <span>74</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <Share size={14} className="sm:w-4 sm:h-4" />
                  <span>42</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-app-accent/20 hover:border-app-accent/40 shadow-lg hover:shadow-xl transition-all hover:translate-y-[-2px] group">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-app-darker flex items-center justify-center border border-app-accent/30 overflow-hidden group-hover:border-app-accent/60 transition-all">
                <Twitter size={16} className="text-app-accent" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white text-sm sm:text-base truncate">Maná Official</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 flex-shrink-0">5 days ago</span>
                  <button className="text-gray-400 hover:text-app-accent transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 line-clamp-3">
                New music coming soon! We've been in the studio working on something special for all of you. Stay tuned for announcements #NewMusic #Anticipation
              </p>
              <div className="flex items-center gap-4 sm:gap-5 text-gray-400 text-xs">
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <Heart size={14} className="sm:w-4 sm:h-4" />
                  <span>842</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                  <span>156</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <Share size={14} className="sm:w-4 sm:h-4" />
                  <span>98</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-app-accent/20 hover:border-app-accent/40 shadow-lg hover:shadow-xl transition-all hover:translate-y-[-2px] group">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-app-darker flex items-center justify-center border border-app-accent/30 overflow-hidden group-hover:border-app-accent/60 transition-all">
                <Twitter size={16} className="text-app-accent" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white text-sm sm:text-base truncate">Maná Official</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 flex-shrink-0">3 days ago</span>
                  <button className="text-gray-400 hover:text-app-accent transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 line-clamp-3">
                We're excited to announce our new environmental initiative with @SelvaNegraOrg to plant 50,000 trees in the Amazon rainforest. Join us in making a difference! #SaveTheAmazon
              </p>
              <div className="flex items-center gap-4 sm:gap-5 text-gray-400 text-xs">
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <Heart size={14} className="sm:w-4 sm:h-4" />
                  <span>782</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                  <span>129</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <Share size={14} className="sm:w-4 sm:h-4" />
                  <span>95</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-app-accent/20 hover:border-app-accent/40 shadow-lg hover:shadow-xl transition-all hover:translate-y-[-2px] group">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-app-darker flex items-center justify-center border border-app-accent/30 overflow-hidden group-hover:border-app-accent/60 transition-all">
                <Twitter size={16} className="text-app-accent" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white text-sm sm:text-base truncate">Maná Official</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 flex-shrink-0">5 days ago</span>
                  <button className="text-gray-400 hover:text-app-accent transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 line-clamp-3">
                Our new single "Amor Clandestino" is now available on all streaming platforms! Listen now and let us know what you think. #NuevaMusica #ManaMusic
              </p>
              <div className="flex items-center gap-4 sm:gap-5 text-gray-400 text-xs">
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <Heart size={14} className="sm:w-4 sm:h-4" />
                  <span>621</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                  <span>87</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-app-accent transition-colors">
                  <Share size={14} className="sm:w-4 sm:h-4" />
                  <span>63</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistTweets;
