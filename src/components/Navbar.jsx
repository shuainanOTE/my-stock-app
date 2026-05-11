import React from 'react';
import { Home, Search } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-15 bg-black/80 backdrop-blur-md border-t border-white/10 flex justify-between px-16 pb-1 items-center z-50">
      <button 
        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-blue-500' : 'text-gray-500'}`} 
        onClick={() => setActiveTab('home')}
      >
        <Home size={28} />

      </button>
      
      <button 
        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'search' ? 'text-blue-500' : 'text-gray-500'}`} 
        onClick={() => setActiveTab('search')}
      >
        <Search size={28} />
      </button>
    </nav>
  );
};

export default Navbar;