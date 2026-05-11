import React from 'react';
import { Home, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[85px] bg-black/80 backdrop-blur-xl border-t border-white/5 flex justify-around items-start pt-3 z-50">
      
      {/* 首頁按鈕 */}
      <button 
        className="flex-1 h-full flex flex-col items-center outline-none" 
        onClick={() => setActiveTab('home')}
      >
        <motion.div
          whileTap={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`p-2 ${activeTab === 'home' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <Home size={35} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        </motion.div>
      </button>
      
      {/* 搜尋按鈕 */}
      <button 
        className="flex-1 h-full flex flex-col items-center outline-none" 
        onClick={() => setActiveTab('search')}
      >
        <motion.div
          whileTap={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`p-2 ${activeTab === 'search' ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <Search size={35} strokeWidth={activeTab === 'search' ? 2.5 : 2} />
        </motion.div>
      </button>
    </nav>
  );
};

export default Navbar;