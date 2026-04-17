import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="w-full pt-24 pb-32 md:pt-32 md:pb-40 px-4 md:px-6 relative flex flex-col items-center justify-center">
      {/* Floating animated blobs behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000"></div>

      <div className="max-w-6xl mx-auto text-center relative z-20">
        <div className="inline-flex justify-center items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-cyan-300 font-bold tracking-widest uppercase mb-8 shadow-xl backdrop-blur-md animate-in slide-in-from-top-4 duration-700">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          WebGL Immersive Edition v2.0
        </div>
        
        <h1 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter drop-shadow-2xl text-balance leading-[1.05] mb-8 animate-in zoom-in-95 fade-in duration-1000">
          DOMINATE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 drop-shadow-[0_0_40px_rgba(99,102,241,0.5)]">
            THE ALGORITHM
          </span>
        </h1>
        
        <p className="mx-auto max-w-2xl text-zinc-300 md:text-2xl font-medium leading-relaxed mb-12 animate-in slide-in-from-bottom-8 duration-1000 delay-150">
          The hyper-realistic social network for elite competitive programmers. Track friends, conquer leaderboards, and witness real-time problem solving.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link to="/signup">
            <Button size="lg" className="px-10 h-16 text-lg rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black shadow-[0_0_40px_rgba(99,102,241,0.6)] border-0 hover:scale-110 transition-all duration-300 group flex items-center gap-3">
              INITIATE RUN <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
