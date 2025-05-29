
import React from 'react';

const WelcomeButton: React.FC = () => {
  return (
    <div className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 shadow-2xl hover:shadow-brand-cyan/20 hover:border-brand-cyan/30 transition-all duration-500 cursor-pointer group relative overflow-hidden">
      {/* Subtle inner glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <span className="text-white text-lg font-semibold tracking-wide group-hover:text-brand-cyan transition-colors duration-300 relative z-10">
        Welcome Digital Gringo AI
      </span>
    </div>
  );
};

export default WelcomeButton;
