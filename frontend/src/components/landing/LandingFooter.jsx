import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="relative z-10 w-full shrink-0 bg-black/80 backdrop-blur-xl border-t border-white/10 pt-16 pb-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link className="flex items-center gap-3 group" to="/">
            <Rocket className="h-6 w-6 text-cyan-400 group-hover:-translate-y-1 transition-transform" />
            <span className="font-black text-2xl tracking-tighter text-white">WeCode Arena</span>
          </Link>
          <p className="text-sm text-zinc-500 font-medium">Architected for the future of competitive mind athletes.</p>
        </div>
        
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Link className="text-sm font-bold text-zinc-400 hover:text-cyan-400 transition-colors uppercase tracking-widest" to="#">Command Center</Link>
          <Link className="text-sm font-bold text-zinc-400 hover:text-cyan-400 transition-colors uppercase tracking-widest" to="#">Directives</Link>
          <Link className="text-sm font-bold text-zinc-400 hover:text-cyan-400 transition-colors uppercase tracking-widest" to="#">Privacy</Link>
        </nav>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest">
        © {new Date().getFullYear()} WeCode Arena Protocol. Secure connection established.
      </div>
    </footer>
  );
};

export default LandingFooter;
