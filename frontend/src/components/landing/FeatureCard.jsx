import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

const FeatureCard = ({ icon, title, desc, delay, gradient, className, imageSrc }) => {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div 
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group flex flex-col rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-500 relative overflow-hidden",
        className,
        delay
      )}
    >
      {/* Super smooth Spotlight overlay moving with mouse */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-screen"
        style={{
          background: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.1), transparent 40%)`
        }}
      />
      
      {/* Background Gradient overlay */}
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-br z-0", gradient)} />

      {/* Optional Integrated Image */}
      {imageSrc && (
        <div className="relative w-full h-48 md:h-64 overflow-hidden border-b border-white/10 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10 mix-blend-multiply opacity-50" />
          <img src={imageSrc} alt={title} className="w-full h-full object-cover filter brightness-75 group-hover:scale-110 group-hover:brightness-100 transition-all duration-700 ease-out" />
        </div>
      )}

      {/* Content Floor */}
      <div className="relative z-20 p-8 flex-1 flex flex-col">
        {icon && (
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 bg-gradient-to-br shrink-0", gradient)}>
            {icon}
          </div>
        )}
        <h3 className={cn("font-bold text-white mb-3 tracking-tight", imageSrc ? "text-3xl" : "text-2xl")}>{title}</h3>
        <p className="text-zinc-400 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
