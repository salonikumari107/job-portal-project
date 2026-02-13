import React, { useState } from 'react';
import { Mail, Lock, User, Upload, X, FileText, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Auth = ({ onLoginSuccess, setUserRole }) => {
  const { login: authLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPass, setIsForgotPass] = useState(false); // Forgot Password Toggle
  const [role, setRole] = useState('seeker');
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null);
  
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    // --- FORGOT PASSWORD LOGIC ---
    if (isForgotPass) {
      // Not implemented in backend yet, just show simulated success
      setSuccessMsg("RESET LINK SENT TO YOUR REGISTERED EMAIL.");
      setTimeout(() => setIsForgotPass(false), 3000);
      return;
    }

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const res = await api.post('/auth/login', { email, password });
        if (res.data.success) {
          authLogin(res.data.user, res.data.token);
          setUserRole(res.data.user.role);
          onLoginSuccess(res.data.user);
          toast.success(`Welcome back, ${res.data.user.name}!`);
        }
      } else {
        // --- SIGNUP LOGIC ---
        const res = await api.post('/auth/register', { name, email, password, role });
        if (res.data.success) {
          toast.success("Account Created Successfully!");
          setTimeout(() => setIsLogin(true), 2000);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white p-6">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Orbit <span className="text-blue-600">Nodes.</span></h1>
          <p className="text-[10px] font-black uppercase text-slate-400 mt-2">
            {isForgotPass ? "Access Recovery" : isLogin ? "Initialize Session" : "New Node Registration"}
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 border border-red-100"><AlertCircle size={16}/> {error}</div>}
        {successMsg && <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 border border-green-100"><CheckCircle2 size={16}/> {successMsg}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isForgotPass && (
            <div className="flex gap-2 rounded-2xl bg-slate-50 p-2">
              <button type="button" onClick={() => setRole('seeker')} className={`flex-1 rounded-xl py-4 text-[10px] font-black uppercase transition-all ${role === 'seeker' ? 'bg-black text-white' : 'text-slate-400'}`}>Seeker</button>
              <button type="button" onClick={() => setRole('recruiter')} className={`flex-1 rounded-xl py-4 text-[10px] font-black uppercase transition-all ${role === 'recruiter' ? 'bg-black text-white' : 'text-slate-400'}`}>Recruiter</button>
            </div>
          )}

          {!isLogin && !isForgotPass && (
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="FULL NAME" required className="w-full rounded-2xl bg-slate-50 py-5 pl-14 pr-6 text-xs font-bold outline-none border-2 border-transparent focus:border-blue-100" onChange={(e)=>setName(e.target.value)} />
            </div>
          )}

          {/* EMAIL INPUT (With name="email" for browser autocomplete/selection) */}
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              name="email"
              type="email" 
              autoComplete="email"
              placeholder="EMAIL ADDRESS" 
              required 
              className="w-full rounded-2xl bg-slate-50 py-5 pl-14 pr-6 text-xs font-bold outline-none border-2 border-transparent focus:border-blue-100" 
              onChange={(e)=>setEmail(e.target.value)} 
            />
          </div>

          {!isForgotPass && (
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="password" placeholder="PASSWORD" required className="w-full rounded-2xl bg-slate-50 py-5 pl-14 pr-6 text-xs font-bold outline-none border-2 border-transparent focus:border-blue-100" onChange={(e)=>setPassword(e.target.value)} />
            </div>
          )}

          {!isLogin && role === 'seeker' && !isForgotPass && (
            <div className="space-y-4">
              <input type="text" placeholder="SKILLS (E.G. REACT, PYTHON)" className="w-full rounded-2xl bg-slate-50 py-5 px-6 text-xs font-bold outline-none" onChange={(e)=>setSkills(e.target.value)} />
              <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 py-6 hover:bg-slate-50">
                <Upload className="mb-2 text-slate-300" size={20} />
                <span className="text-[10px] font-black uppercase text-slate-400">{resume ? resume.name : "Upload Resume"}</span>
                <input type="file" className="hidden" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />
              </label>
            </div>
          )}

          <button type="submit" className="w-full rounded-3xl bg-black py-5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-blue-600 transition-all">
            {isForgotPass ? "Send Reset Link" : isLogin ? "Initialize Session" : "Create Account"}
          </button>
        </form>

        <div className="text-center space-y-4">
          {isLogin && !isForgotPass ? (
            <>
              <button type="button" onClick={() => setIsForgotPass(true)} className="text-[9px] font-black uppercase tracking-widest text-slate-400 block w-full hover:text-blue-600">Forgot Password?</button>
              <button type="button" onClick={() => setIsLogin(false)} className="text-[9px] font-black uppercase tracking-widest text-slate-900">Don't have an account? <span className="underline">Create Node</span></button>
            </>
          ) : isForgotPass ? (
            <button type="button" onClick={() => setIsForgotPass(false)} className="text-[9px] font-black uppercase tracking-widest text-slate-900 flex items-center justify-center gap-2 w-full"><ArrowLeft size={12}/> Back to Login</button>
          ) : (
            <button type="button" onClick={() => setIsLogin(true)} className="text-[9px] font-black uppercase tracking-widest text-slate-900">Already have an account? <span className="underline">Login Now</span></button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;