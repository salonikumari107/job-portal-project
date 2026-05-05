import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { 
  ArrowRight, Globe, Zap, ShieldCheck, Star, 
  Code, Briefcase, MapPin, DollarSign, Terminal,
  Database, Cpu, Cloud, Laptop, Rocket
} from 'lucide-react';

const FloatingIcon = ({ Icon, delay, x, y, size = 40, mouseX, mouseY }) => {
  const moveX = useTransform(mouseX, [0, window.innerWidth], [20, -20]);
  const moveY = useTransform(mouseY, [0, window.innerHeight], [20, -20]);

  return (
    <motion.div
      style={{ left: x, top: y, x: moveX, y: moveY }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.1, 0.15, 0.1],
        y: [0, -25, 0],
        rotate: [0, 15, -15, 0] 
      }}
      transition={{ 
        duration: 6, 
        repeat: Infinity, 
        delay: delay,
        ease: "easeInOut" 
      }}
      className="absolute text-blue-600 pointer-events-none z-0"
    >
      <Icon size={size} />
    </motion.div>
  );
};

const WelcomePage = ({ onGetStarted }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-screen h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden flex flex-col justify-between"
    >
      {/* 1. BACKGROUND ICONS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingIcon Icon={Code} x="5%" y="15%" delay={0} size={50} mouseX={mouseX} mouseY={mouseY} />
        <FloatingIcon Icon={Database} x="85%" y="10%" delay={2} size={40} mouseX={mouseX} mouseY={mouseY} />
        <FloatingIcon Icon={Cpu} x="10%" y="60%" delay={1} size={45} mouseX={mouseX} mouseY={mouseY} />
        <FloatingIcon Icon={Rocket} x="80%" y="70%" delay={5} size={40} mouseX={mouseX} mouseY={mouseY} />
      </div>

      {/* 2. NAVIGATION */}
      <nav className="relative z-50 px-8 py-6 flex justify-between items-center">
        <div className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
          <span className="text-slate-900 uppercase">Job</span>
          <span className="text-blue-600 uppercase">Orbit.</span>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 flex-grow">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 px-4 py-1 rounded-full bg-white border border-blue-100 shadow-sm flex items-center gap-2"
        >
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Trusted by 10k+ Professionals</span>
        </motion.div>

        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter text-slate-900 mb-4">
            Your Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
              In Full Motion.
            </span>
          </h1>

          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-medium">
            Connect with premium opportunities and orbit your career to new heights.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-blue-200 transition-all hover:bg-blue-700"
          >
            Start Exploring
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </div>
      </main>

      {/* 4. PREMIUM FOOTER (0000FF & Dark Blue Cards) */}
      <footer className="relative z-30 w-full pt-6 pb-8 border-t-2 border-blue-400" style={{ backgroundColor: '#0000FF' }}>
        <div className="flex flex-col items-center mb-6">
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/90">Designed & Developed by</span>
           <h4 className="text-xs font-bold text-white tracking-widest">GEC BANKA STUDENTS</h4>
        </div>

        {/* Name Cards (Dark Blue #1E3A8A) */}
        <div className="px-10 w-full grid grid-cols-4 items-center gap-6">
          
          {/* Left: Saloni */}
          <div className="flex justify-start">
            <motion.div 
              whileHover={{ y: -5, scale: 1.05 }} 
              style={{ backgroundColor: '#1E3A8A', borderColor: '#60A5FA' }} 
              className="px-5 py-3 rounded-xl shadow-2xl min-w-[190px] flex items-center gap-3 border-2"
            >
               <div className="w-2 h-2 bg-[#38BDF8] rounded-full animate-pulse shadow-[0_0_8px_#38BDF8]"></div>
               <span className="text-[11px] font-black text-white tracking-wider">SALONI KUMARI</span>
            </motion.div>
          </div>

          {/* Middle 1: Priyanshu */}
          <div className="flex justify-center">
            <motion.div 
              whileHover={{ y: -5, scale: 1.05 }} 
              style={{ backgroundColor: '#1E3A8A', borderColor: '#60A5FA' }} 
              className="px-5 py-3 rounded-xl shadow-2xl min-w-[190px] flex items-center gap-3 border-2"
            >
              <div className="w-2 h-2 bg-[#38BDF8] rounded-full shadow-[0_0_8px_#38BDF8]"></div>
              <span className="text-[11px] font-black text-white tracking-wider">PRIYANSHU KUMARI</span>
            </motion.div>
          </div>

          {/* Middle 2: Anamika */}
          <div className="flex justify-center">
            <motion.div 
              whileHover={{ y: -5, scale: 1.05 }} 
              style={{ backgroundColor: '#1E3A8A', borderColor: '#60A5FA' }} 
              className="px-5 py-3 rounded-xl shadow-2xl min-w-[190px] flex items-center gap-3 border-2"
            >
              <div className="w-2 h-2 bg-[#38BDF8] rounded-full shadow-[0_0_8px_#38BDF8]"></div>
              <span className="text-[11px] font-black text-white tracking-wider">ANAMIKA SAHGAL</span>
            </motion.div>
          </div>

          {/* Right: Muskan */}
          <div className="flex justify-end">
            <motion.div 
              whileHover={{ y: -5, scale: 1.05 }} 
              style={{ backgroundColor: '#1E3A8A', borderColor: '#60A5FA' }} 
              className="px-5 py-3 rounded-xl shadow-2xl min-w-[190px] flex items-center gap-3 border-2"
            >
               <div className="w-2 h-2 bg-[#38BDF8] rounded-full animate-pulse shadow-[0_0_8px_#38BDF8]"></div>
               <span className="text-[11px] font-black text-white tracking-wider">MUSKAN ARYA</span>
            </motion.div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;