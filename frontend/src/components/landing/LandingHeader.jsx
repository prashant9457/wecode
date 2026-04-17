import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

const LandingHeader = () => {
  return (
    <header className="px-6 lg:px-12 h-20 flex items-center border-b border-white/10 bg-black/30 backdrop-blur-md z-50 sticky top-0 transition-all duration-300">
      <Link className="flex items-center justify-center group" to="/">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] group-hover:scale-110 transition-all duration-300">
          <Rocket className="h-5 w-5 text-black" />
        </div>
        <span className="ml-4 font-black text-3xl tracking-tighter bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">WeCode</span>
      </Link>
      <nav className="ml-auto flex gap-6 items-center">
        <Link className="text-sm font-bold text-zinc-300 hover:text-white transition-colors uppercase tracking-widest hidden sm:block" to="/login">
          Login
        </Link>
        <Link to="/signup">
          <Button className="bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-transform font-bold rounded-full px-8 h-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            ENTER ARENA
          </Button>
        </Link>
      </nav>
    </header>
  );
};

export default LandingHeader;
