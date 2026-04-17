import React from 'react';
import FeatureCard from './FeatureCard';
import { Cpu, Zap, Users, Code } from 'lucide-react';

const BentoGridSection = () => {
  return (
    <section className="w-full py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl skew-y-3 scale-110 -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
         <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
            THE ULTIMATE <span className="text-cyan-400">CODING MATRIX</span>
         </h2>
         <p className="text-xl text-zinc-400 max-w-3xl mx-auto font-medium">Immerse yourself perfectly in the coding flow state with an asymmetric, deeply interactive layout.</p>
      </div>

      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-min">
          
          <FeatureCard 
            className="md:col-span-4 lg:col-span-4 shadow-[0_0_50px_rgba(34,211,238,0.15)] group"
            title="Elite Global Leaderboards"
            desc="Experience a real-time WebSockets-powered feed displaying exactly when your connections crack complex logic gates. Watch the global state shift instantly as top minds submit their logic blocks to the arena."
            imageSrc="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000"
            gradient="from-cyan-400 to-blue-600"
            delay="delay-100"
          />

          <FeatureCard 
            className="md:col-span-2 lg:col-span-2 md:row-span-2 flex-col justify-end"
            icon={<Cpu className="h-10 w-10 text-white" />}
            title="Neural Verification"
            desc="Instantly and securely integrate your entire competitive history from LeetCode. We automatically poll the matrices so you never have to manually sync your algorithmic rating."
            gradient="from-indigo-500 to-purple-600"
            delay="delay-200"
          />

          <FeatureCard 
            className="md:col-span-2 lg:col-span-2"
            icon={<Zap className="h-8 w-8 text-white" />}
            title="Hyper-Speed Feed"
            desc="Zero latency streaming of friend activity. You solve it, the entire connected matrix sees it instantly."
            gradient="from-yellow-400 to-orange-500"
            delay="delay-300"
          />

          <FeatureCard 
            className="md:col-span-2 lg:col-span-2"
            icon={<Users className="h-8 w-8 text-white" />}
            title="Elite Squads"
            desc="Construct heavily guarded private networks of developers. Form intense rivalries and track daily heatmaps."
            gradient="from-emerald-400 to-cyan-500"
            delay="delay-400"
          />

          <FeatureCard 
            className="md:col-span-2 lg:col-span-3"
            icon={<Code className="h-8 w-8 text-white" />}
            title="Logic Vaults"
            desc="Save your most deeply optimized algorithmic solutions strictly linked to your integrated platform identities. A personal library of computational supremacy."
            gradient="from-pink-500 to-rose-600"
            delay="delay-500"
          />

          <FeatureCard 
            className="md:col-span-2 lg:col-span-3"
            imageSrc="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000"
            title="Arena Analytics"
            desc="Immersive dynamic charts tracking your progression and accuracy against global competitors."
            gradient="from-blue-500 to-indigo-600"
            delay="delay-600"
          />

        </div>
      </div>
    </section>
  );
};

export default BentoGridSection;
