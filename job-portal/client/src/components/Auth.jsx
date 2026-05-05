import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle, Sparkles, ArrowLeft, Code } from 'lucide-react';
import api from '../api/axios'; 
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useNavigate, Link } from 'react-router-dom'; // Link yahan add kiya gaya hai
import toast from 'react-hot-toast';

const Auth = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('seeker'); 
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [skills, setSkills] = useState(""); 
  
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const currentRole = role.toLowerCase();

      if (isLogin) {
        const res = await api.post('/auth/login', { email, password, role: currentRole });
        
        if (res.data.success) {
          const token = res.data.token || res.data.data?.token;
          const userData = res.data.user || res.data.data?.user || res.data.data; 

          if (!token) throw new Error("Security token missing.");

          localStorage.setItem("token", token);

          const isContextUpdated = await authLogin(userData, token);
          
          if (isContextUpdated) {
            toast.success(`Welcome back, ${userData?.name || 'User'}`);
            setTimeout(() => {
              const path = currentRole === 'recruiter' ? '/recruiter/dashboard' : '/profile';
              navigate(path, { replace: true });
            }, 200);
          }
        }
      } else {
        const res = await api.post('/auth/register', { 
          name, 
          email, 
          password, 
          role: currentRole,
          skills: currentRole === 'seeker' ? (skills ? skills.split(',').map(s => s.trim()) : []) : []
        });
        
        if (res.data.success) {
          toast.success("Account Created! Please Login.");
          setIsLogin(true);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Operation Failed";
      setError(errorMessage); 
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen w-screen flex items-center justify-center bg-[#F8FAFC] overflow-hidden text-slate-900">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 z-50 flex items-center gap-3 px-5 py-3 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white hover:bg-blue-600 hover:text-white transition-all group font-black text-[10px] uppercase tracking-widest"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      {/* Main Container with Motion */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/40 backdrop-blur-2xl p-10 rounded-[45px] shadow-2xl border border-white/60"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">
              ORBIT <span className="text-blue-600">NODES.</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">
            {isLogin ? "Initialize Session" : "New Node Registration"}
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }} 
              className="mb-6 p-4 rounded-2xl text-[10px] font-bold uppercase flex items-center gap-2 border bg-red-50 text-red-500 border-red-100 overflow-hidden"
            >
              <AlertCircle size={16}/> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleAuth} className="space-y-4">
          {/* Role Switcher */}
          <div className="flex gap-2 rounded-2xl bg-slate-100/50 p-1.5 border border-white/50">
            <button 
              type="button" 
              onClick={() => setRole('seeker')} 
              className={`flex-1 rounded-xl py-3 text-[10px] font-black uppercase transition-all ${role === 'seeker' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Seeker
            </button>
            <button 
              type="button" 
              onClick={() => setRole('recruiter')} 
              className={`flex-1 rounded-xl py-3 text-[10px] font-black uppercase transition-all ${role === 'recruiter' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Recruiter
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                >
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="FULL NAME" 
                      required 
                      className="w-full rounded-2xl bg-white/50 py-5 pl-14 pr-6 text-xs font-bold outline-none border border-white focus:bg-white transition-all shadow-sm focus:shadow-md" 
                      value={name} 
                      onChange={(e)=>setName(e.target.value)} 
                    />
                  </div>
                  {role === 'seeker' && (
                    <div className="relative group">
                      <Code className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="SKILLS (JS, REACT, NODE)" 
                        required 
                        className="w-full rounded-2xl bg-white/50 py-5 pl-14 pr-6 text-xs font-bold outline-none border border-white focus:bg-white transition-all shadow-sm focus:shadow-md" 
                        value={skills} 
                        onChange={(e)=>setSkills(e.target.value)} 
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                required 
                className="w-full rounded-2xl bg-white/50 py-5 pl-14 pr-6 text-xs font-bold outline-none border border-white focus:bg-white transition-all shadow-sm focus:shadow-md" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder="PASSWORD" 
                required 
                className="w-full rounded-2xl bg-white/50 py-5 pl-14 pr-6 text-xs font-bold outline-none border border-white focus:bg-white transition-all shadow-sm focus:shadow-md" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
              />
            </div>

            {/* --- Forgot Password Link Start --- */}
            {isLogin && (
              <div className="text-right px-2">
                <Link 
                  to="/forgot-password" 
                  className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            )}
            {/* --- Forgot Password Link End --- */}

          </div>

          <motion.button 
            disabled={loading} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            type="submit" 
            className={`w-full rounded-2xl py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl transition-all ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? "Processing Node..." : isLogin ? "Login to Orbit" : "Create Node"}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(""); }} 
            className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors"
          >
            {isLogin ? "New here? " : "Already a member? "}
            <span className="text-blue-600 underline underline-offset-4 font-black">{isLogin ? "Create Node" : "Login Now"}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;