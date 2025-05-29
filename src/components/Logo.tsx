
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src="/lovable-uploads/4cb3dfc5-c2e6-46c1-8d89-7e6fcebf82e3.png" 
        alt="Digital Gringo AI Logo" 
        className="h-8 w-8"
      />
      <span className="text-xl font-semibold text-gray-900">
        Digital Gringo AI
      </span>
    </div>
  );
};

export default Logo;
