
import React from 'react';

const WelcomeButton: React.FC = () => {
  return (
    <button className="group relative inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,195,255,0.1)] hover:border-gray-600 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:ring-offset-2 focus:ring-offset-gray-900">
      {/* Inner highlight for depth */}
      <div className="absolute inset-px rounded-[7px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Subtle hover effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-brand-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <span className="relative text-white text-sm font-medium tracking-normal group-hover:text-gray-100 transition-colors duration-200">
        Digital Gringo AI
      </span>
    </button>
  );
};

export default WelcomeButton;
