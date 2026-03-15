import { motion } from 'motion/react';
import { Star, Info, Compass } from 'lucide-react';
import SpaceScene from './components/SpaceScene';

export default function App() {
  return (
    <div className="relative w-full h-screen bg-black text-white font-sans overflow-hidden">
      {/* Three.js Background */}
      <SpaceScene />

      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-8 md:p-12">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex justify-between items-start"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-light tracking-tighter uppercase italic">
              Cosmic <span className="font-bold not-italic">Particles</span>
            </h1>
            <p className="text-xs md:text-sm tracking-[0.3em] uppercase opacity-50 mt-2 flex items-center gap-2">
              <Star size={12} className="text-orange-400" />
              Real-time Stellar Simulation
            </p>
          </div>
          <div className="flex gap-4 pointer-events-auto">
            <button className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors group">
              <Info size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </motion.header>

        {/* Center Content (Optional) */}
        <div className="flex-1 flex items-center justify-center">
          {/* Empty center to let the galaxy shine */}
        </div>

        {/* Footer / Controls Info */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-[1px] bg-white/30" />
              <span className="text-[10px] uppercase tracking-widest opacity-60">Navigation Data</span>
            </div>
            <div className="flex gap-8 text-[11px] font-mono opacity-40">
              <div>LAT: 42.3601° N</div>
              <div>LONG: 71.0589° W</div>
              <div>ALT: 12.4 LY</div>
            </div>
          </div>

          <div className="flex items-center gap-4 pointer-events-auto">
            <div className="text-right hidden md:block">
              <p className="text-[10px] uppercase tracking-widest opacity-40">Interaction</p>
              <p className="text-xs font-medium">Move mouse to explore the void</p>
            </div>
            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center animate-pulse">
              <Compass size={24} className="opacity-50" />
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-white/5 rounded-full" />
      </div>
    </div>
  );
}
