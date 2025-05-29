
import React from 'react';

const WelcomeButton: React.FC = () => {
  return (
    <div className="relative group cursor-pointer">
      {/* Outer glow container */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan/20 via-purple-500/20 to-brand-cyan/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      
      {/* Main button container */}
      <div className="relative inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.08] backdrop-blur-xl border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_12px_48px_rgba(0,195,255,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-500 overflow-hidden">
        
        {/* Inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent rounded-2xl"></div>
        
        {/* Moving shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
        
        {/* Text content */}
        <span className="relative z-10 text-white text-lg font-semibold tracking-wide bg-gradient-to-r from-white via-white to-brand-cyan bg-clip-text group-hover:text-transparent transition-all duration-500 drop-shadow-sm">
          Welcome Digital Gringo AI
        </span>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent group-hover:w-3/4 transition-all duration-700"></div>
      </div>
    </div>
  );
};

export default WelcomeButton;
