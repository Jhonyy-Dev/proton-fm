import { Home, Search, Radio, User, Calendar, Newspaper, ShoppingBag, Smartphone, Menu, Heart, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const Sidebar = ({ className, onClose }: SidebarProps) => {
  const location = useLocation();
  
  return (
    <div className={cn("w-64 bg-app-darkest flex flex-col h-screen", className)}>
      <div className="p-4 flex justify-between items-center border-b border-app-light/10">
        <div className="flex items-center space-x-2">
          <Radio className="h-5 w-5 text-app-accent" />
          <span className="font-bold text-lg text-white">PARADZIT</span>
        </div>
        <div className="flex items-center space-x-1">
          {onClose && (
            <button 
              className="lg:hidden p-1 rounded-full text-gray-400 hover:text-white"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
          <button className="p-1 rounded-full text-gray-400 hover:text-white">
            <Menu size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-app-dark text-sm rounded-md pl-3 pr-8 py-2 text-gray-300 placeholder-gray-500 outline-none"
          />
          <Search className="absolute right-2 top-2 h-4 w-4 text-gray-500" />
        </div>
      </div>

      <div className="px-2 py-1 overflow-y-auto">
        <nav className="space-y-1">
          <Link to="/" className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/listen" className={`sidebar-link ${location.pathname === '/listen' ? 'active' : ''}`}>
            <Radio size={20} />
            <span>Listen</span>
          </Link>
          <Link to="/shows" className={`sidebar-link ${location.pathname === '/shows' ? 'active' : ''}`}>
            <Radio size={20} />
            <span>Shows</span>
          </Link>
          <Link to="/djs" className={`sidebar-link ${location.pathname === '/djs' ? 'active' : ''}`}>
            <User size={20} />
            <span>Resident DJ's</span>
          </Link>
          <Link to="/events" className={`sidebar-link ${location.pathname === '/events' ? 'active' : ''}`}>
            <Calendar size={20} />
            <span>Events</span>
          </Link>
          <Link to="/news" className={`sidebar-link ${location.pathname === '/news' ? 'active' : ''}`}>
            <Newspaper size={20} />
            <span>News</span>
          </Link>
          <Link to="/shop" className={`sidebar-link ${location.pathname === '/shop' ? 'active' : ''}`}>
            <ShoppingBag size={20} />
            <span>Shop</span>
          </Link>
          <Link to="/apps" className={`sidebar-link ${location.pathname === '/apps' ? 'active' : ''}`}>
            <Smartphone size={20} />
            <span>Applications</span>
          </Link>
        </nav>
      </div>

      <div className="mt-auto px-3 py-4 border-t border-app-light/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium text-white">T</div>
          <div className="text-sm text-white truncate">Break Through The Silence</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-white">
            <Heart size={16} />
          </button>
          <div className="text-xs text-gray-400 truncate">Martin Garrix and Matisse & Sadko</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
