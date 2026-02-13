import React, { useState, useMemo } from 'react';
import { 
  X, Briefcase, Search, ShieldCheck, Heart, Building2, MapPin, Share2, 
  CheckCircle2, Upload, Send, ChevronLeft, Download, Zap, 
  GraduationCap, BarChart3, PlusCircle, ChevronDown, Trash2, Filter, 
  UserCheck, UserX, PhoneCall, Clock
} from 'lucide-react';

const OrbitSupremeFinalMerged = () => {
  // --- CORE SYSTEM STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Preview mode
  const [userRole, setUserRole] = useState('seeker'); 
  const [activeTab, setActiveTab] = useState('find-job');
  
  // --- FILTER & DATA STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState("ALL"); 
  const [savedJobs, setSavedJobs] = useState([]); // Wishlist state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [postType, setPostType] = useState('JOB'); 

  // --- DATABASE & APPLICATIONS ---
  const jobDatabase = [
    { id: 1, title: "Senior React Architect", company: "Google Cloud", location: "Bangalore", type: "JOB", mode: "REMOTE", geo: "NATIONAL", salary: "24-30 LPA" },
    { id: 2, title: "UI/UX Masterclass", company: "Design Academy", location: "Pune", type: "TRAINING", mode: "OFFICE", geo: "CITY", salary: "Certification" },
    { id: 3, title: "Backend Systems Intern", company: "Amazon", location: "Hyderabad", type: "INTERNSHIP", mode: "HYBRID", geo: "STATE", salary: "45k/mo" }
  ];

  const [applications, setApplications] = useState([
    { id: 101, name: "Rahul Sharma", role: "React Architect", status: "PENDING", company: "Google Cloud", date: "2026-01-15" },
    { id: 102, name: "Ananya Iyer", role: "UI Designer", status: "INTERVIEW", company: "Design Academy", date: "2026-01-16" }
  ]);

  // --- CORE LOGIC FUNCTIONS ---
  const toggleSave = (id) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]);
  };

  const updateStatus = (id, newStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  const filteredJobs = useMemo(() => {
    return jobDatabase.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMode = selectedMode === "ALL" || job.mode === selectedMode;
      return matchesSearch && matchesMode;
    });
  }, [searchQuery, selectedMode]);

  return (
    <div className="h-screen w-full bg-[#F3F7FA] flex overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-white border-r flex flex-col p-8 shrink-0 shadow-sm">
        <div className="text-2xl font-black italic mb-12 tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white not-italic text-sm">O</div>
          ORBIT.
        </div>
        <nav className="flex-1 space-y-2">
          {userRole === 'seeker' ? (
            <>
              <button onClick={() => setActiveTab('find-job')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all ${activeTab === 'find-job' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><Search size={18}/> Discover</button>
              <button onClick={() => setActiveTab('wishlist')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all ${activeTab === 'wishlist' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><Heart size={18}/> Wishlist ({savedJobs.length})</button>
              <button onClick={() => setActiveTab('app-status')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all ${activeTab === 'app-status' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><Clock size={18}/> My Status</button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab('rec-dash')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all ${activeTab === 'rec-dash' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400'}`}><BarChart3 size={18}/> Management</button>
              <button onClick={() => setActiveTab('post-vacancy')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all ${activeTab === 'post-vacancy' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400'}`}><PlusCircle size={18}/> Deploy Node</button>
            </>
          )}
        </nav>
        <div className="mt-auto space-y-4">
           <button onClick={() => setUserRole(userRole === 'seeker' ? 'recruiter' : 'seeker')} className="w-full py-3 bg-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Switch to {userRole === 'seeker' ? 'Recruiter' : 'Seeker'}</button>
           <button onClick={() => setIsLoggedIn(false)} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase hover:bg-red-500 hover:text-white transition-all">Logout</button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 overflow-hidden flex flex-col p-10">
        
        {/* TAB 1: FIND JOB (SEEKER) */}
        {activeTab === 'find-job' && (
          <div className="flex flex-col h-full animate-in fade-in">
            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-10">Universe <span className="text-[#1a5f7a]">Portal.</span></h2>
            
            <div className="bg-white/70 backdrop-blur-md p-4 rounded-[2.5rem] border border-white shadow-xl flex items-center gap-4 mb-10">
              <div className="flex-1 bg-white rounded-3xl px-6 py-4 flex items-center gap-4 border border-slate-100 shadow-inner">
                <Search size={20} className="text-slate-300" />
                <input type="text" placeholder="Designation or Company..." className="flex-1 bg-transparent outline-none font-semibold text-sm italic" onChange={(e) => setSearchQuery(e.value)} />
              </div>
              <select value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)} className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest outline-none">
                <option value="ALL">All Modes</option><option value="REMOTE">Remote</option><option value="OFFICE">Office</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-4">
              {filteredJobs.map(job => (
                <div key={job.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-50 hover:shadow-xl transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                      {job.type === 'TRAINING' ? <GraduationCap size={28}/> : job.type === 'INTERNSHIP' ? <Zap size={28}/> : <Briefcase size={28}/>}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black italic uppercase mb-1">{job.title}</h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{job.company} • {job.mode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleSave(job.id)} className={`p-4 rounded-2xl transition-all shadow-sm ${savedJobs.includes(job.id) ? 'bg-red-500 text-white scale-110' : 'bg-slate-50 text-slate-200 hover:text-red-400'}`}>
                      <Heart size={20} fill={savedJobs.includes(job.id) ? "currentColor" : "none"}/>
                    </button>
                    <button onClick={() => {setSelectedJob(job); setShowApplyModal(true);}} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#1a5f7a] shadow-lg">Engage</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: WISHLIST (SEEKER) */}
        {activeTab === 'wishlist' && (
          <div className="h-full animate-in slide-in-from-right-4">
            <h2 className="text-6xl font-black italic uppercase text-red-500 mb-10 tracking-tighter">SAVED <br/> <span className="text-slate-900">NODES.</span></h2>
            <div className="grid grid-cols-2 gap-6">
              {jobDatabase.filter(j => savedJobs.includes(j.id)).map(j => (
                <div key={j.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 flex items-center justify-between group shadow-sm hover:shadow-xl transition-all">
                  <div>
                    <h4 className="text-2xl font-black italic uppercase mb-1">{j.title}</h4>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{j.company}</p>
                  </div>
                  <button onClick={() => toggleSave(j.id)} className="p-5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={24}/></button>
                </div>
              ))}
              {savedJobs.length === 0 && <div className="col-span-2 py-20 text-center border-4 border-dashed border-slate-100 rounded-[4rem] text-slate-200 uppercase font-black tracking-widest">Memory Bank Empty</div>}
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATION STATUS (SEEKER) */}
        {activeTab === 'app-status' && (
           <div className="h-full animate-in fade-in">
              <h2 className="text-6xl font-black italic uppercase text-slate-900 mb-10 tracking-tighter">MY <br/> <span className="text-[#1a5f7a]">SIGNAL.</span></h2>
              {applications.map(app => (
                <div key={app.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 flex items-center justify-between mb-4 shadow-sm">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400"><Briefcase size={24}/></div>
                      <h4 className="text-xl font-black italic uppercase">{app.role} <span className="block text-[10px] font-bold text-slate-300 mt-1">{app.company}</span></h4>
                   </div>
                   <div className={`px-8 py-3 rounded-full font-black text-[9px] uppercase tracking-widest ${app.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                      {app.status}
                   </div>
                </div>
              ))}
           </div>
        )}

        {/* TAB 4: RECRUITER MANAGEMENT */}
        {activeTab === 'rec-dash' && (
           <div className="h-full animate-in fade-in">
              <h2 className="text-6xl font-black italic uppercase text-orange-600 mb-10 tracking-tighter">PIPELINE <br/> <span className="text-slate-900">CONTROL.</span></h2>
              <div className="space-y-4">
                {applications.map(c => (
                  <div key={c.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-50 flex flex-col gap-6 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-black">#</div>
                        <h4 className="text-2xl font-black italic uppercase leading-none">{c.name} <span className="block text-[10px] font-bold text-slate-300 mt-1">{c.role} • Status: {c.status}</span></h4>
                      </div>
                      <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase"><Download size={14}/> CV</button>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                        <button onClick={() => updateStatus(c.id, 'SELECTED')} className="flex-1 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[9px] uppercase hover:bg-emerald-600 hover:text-white transition-all"><UserCheck className="mx-auto" size={18}/></button>
                        <button onClick={() => updateStatus(c.id, 'REJECTED')} className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[9px] uppercase hover:bg-red-600 hover:text-white transition-all"><UserX className="mx-auto" size={18}/></button>
                        <button onClick={() => updateStatus(c.id, 'INTERVIEW')} className="flex-1 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-[9px] uppercase hover:bg-blue-600 hover:text-white transition-all"><PhoneCall className="mx-auto" size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* TAB 5: POST VACANCY (RECRUITER) */}
        {activeTab === 'post-vacancy' && (
          <div className="h-full flex flex-col items-center justify-center animate-in zoom-in-95">
             <h2 className="text-5xl font-black italic uppercase mb-12 text-center tracking-tighter">Deploy New <br/> <span className="text-orange-600">Transmission Node.</span></h2>
             <div className="grid grid-cols-3 gap-6 w-full max-w-2xl mb-10">
                {['JOB', 'TRAINING', 'INTERNSHIP'].map(type => (
                  <button key={type} onClick={() => setPostType(type)} className={`p-8 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-4 ${postType === type ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                    {type === 'JOB' ? <Briefcase/> : type === 'TRAINING' ? <GraduationCap/> : <Zap/>}
                    <span className="font-black italic uppercase text-[10px] tracking-widest">{type}</span>
                  </button>
                ))}
             </div>
             <button className="w-full max-w-2xl py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-lg hover:bg-orange-600 transition-all shadow-xl">Broadcast Node</button>
          </div>
        )}
      </main>

      {/* GLOBAL APPLY MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-5xl rounded-[5rem] p-16 shadow-2xl relative">
            <button onClick={() => setShowApplyModal(false)} className="absolute top-12 right-12 p-4 bg-slate-50 rounded-full text-slate-300 hover:text-red-500 transition-all"><X size={32}/></button>
            <h3 className="text-5xl font-black italic uppercase tracking-tighter text-slate-800 mb-10">APPLY FOR <span className="text-[#1a5f7a]">{selectedJob?.title}</span></h3>
            <div className="grid grid-cols-2 gap-12 mb-10">
              <label className="flex flex-col items-center justify-center h-56 border-4 border-dashed border-slate-50 rounded-[3.5rem] cursor-pointer hover:bg-slate-50">
                 <Upload className="text-[#1a5f7a] mb-2" size={32}/>
                 <span className="text-[10px] font-black uppercase text-slate-200">Transmit CV</span>
                 <input type="file" className="hidden" />
              </label>
              <textarea placeholder="Your pitch..." className="w-full h-56 p-8 bg-slate-50 rounded-[3.5rem] outline-none font-bold text-sm italic" />
            </div>
            <button onClick={() => { setShowApplyModal(false); alert("Application Transmitted!"); }} className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.6em] text-xl hover:bg-[#1a5f7a] transition-all">Send Application</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrbitSupremeFinalMerged;