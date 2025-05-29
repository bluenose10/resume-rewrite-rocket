
import React from 'react';

const WelcomeButton: React.FC = () => {
  return (
    <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300 cursor-pointer group">
      <div className="flex-shrink-0">
        <img 
          src="/lovable-uploads/4cb3dfc5-c2e6-46c1-8d89-7e6fcebf82e3.png" 
          alt="Digital Gringo AI Logo" 
          className="h-6 w-6"
        />
      </div>
      <span className="text-white text-sm font-medium group-hover:text-brand-cyan transition-colors duration-300">
        Welcome Digital Gringo AI
      </span>
    </div>
  );
};

export default WelcomeButton;
