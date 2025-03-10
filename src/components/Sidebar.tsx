import { Home, Search, Radio, User, Calendar, Newspaper, ShoppingBag, Smartphone, Menu, Heart, X, Tv } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { RadioStation } from "@/hooks/useRadioPlayer";
import { useState, useEffect } from "react";
import { useRadio } from "@/contexts/RadioContext";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
  onStationSelect?: (station: RadioStation) => void;
}

const Sidebar = ({ className, onClose, onStationSelect }: SidebarProps) => {
  const location = useLocation();
  const { currentStation, isFavorite, toggleFavorite } = useRadio();
  
  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/listen', label: 'Listen', icon: Radio },
    { href: '/shows', label: 'Shows', icon: Tv },
    { href: '/djs', label: 'Resident DJ\'s', icon: User },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/news', label: 'News', icon: Newspaper },
    { href: '/shop', label: 'Shop', icon: ShoppingBag },
    { href: '/apps', label: 'Applications', icon: Smartphone },
  ];

  return (
    <div className={cn("w-full md:w-72 bg-gradient-to-b from-app-darkest to-[#121212] flex flex-col h-screen", className)}>
      {/* Header con logo y botón de cierre */}
      <div className="p-4 flex justify-between items-center border-b border-app-light/10">
        <div className="flex items-center space-x-2">
          <div className="bg-app-accent rounded-full p-1.5">
            <Radio className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-wider">PARADZIT</span>
        </div>
        {/* Botón de cierre optimizado para móvil */}
        {onClose && (
          <button 
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-app-light/10 transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      {/* Barra de búsqueda mejorada para móvil */}
      <div className="px-4 py-4">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search"
            className="w-full bg-app-dark/60 text-sm rounded-full pl-10 pr-4 py-3 text-gray-300 placeholder-gray-500 outline-none border border-transparent focus:border-app-accent/50 transition-all"
          />
          <Search className="absolute left-3.5 top-3 h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
        </div>
      </div>

      {/* Navegación principal optimizada para móvil */}
      <div className="px-3 py-2 overflow-y-auto flex-grow">
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link 
                to={link.href} 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-base font-medium transition-all ${
                  isActive 
                    ? 'bg-app-accent/10 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-app-light/5'
                }`} 
                key={link.href}
              >
                <link.icon size={22} className={isActive ? 'text-app-accent' : ''} />
                <span>{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-6 bg-app-accent rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
