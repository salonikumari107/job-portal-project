import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { 
  X, Briefcase, Search, Heart, MapPin, 
  Upload, Download, Zap, 
  GraduationCap, BarChart3, PlusCircle, Trash2, 
  UserCheck, UserX, PhoneCall, Clock 
} from 'lucide-react';

const OrbitSupremeFinalMerged = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState('seeker'); 
  const [activeTab, setActiveTab] = useState('find-job');
  const [jobs, setJobs] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState("ALL"); 
  const [savedJobs, setSavedJobs] = useState([]); 
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [postType, setPostType] = useState('JOB'); 
  const [loading, setLoading] = useState(false);

  const [applications, setApplications] = useState([
    { id: 101, name: "Rahul Sharma", role: "React Architect", status: "PENDING", company: "Google Cloud", date: "2026-01-15" },
    { id: 102, name: "Ananya Iyer", role: "UI Designer", status: "INTERVIEW", company: "Design Academy", date: "2026-01-16" }
  ]);

  const getAllJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      if (res.data.success) setJobs(res.data.data);
    } catch (err) {
      // FIX: 'err' ko console mein use kiya taaki 'defined but never used' error hat jaye
      console.error("Transmission Error:", err);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  const fetchNearbyJobs = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { longitude, latitude } = position.coords;
        try {
          const res = await axios.get(`/api/jobs/near-me?longitude=${longitude}&latitude=${latitude}&distance=50`);
          if (res.data.success) {
            setJobs(res.data.data);
            alert(`${res.data.count} Jobs found!`);
          }
        } catch (err) {
          console.error("Mapping Error:", err);
        } finally {
          setLoading(false);
        }
      }, () => setLoading(false));
    }
  };

  const toggleSave = (id) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]);
  };

  const updateStatus = (id, newStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter(job => {
      const title = job.title || "";
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMode = selectedMode === "ALL" || job.jobType === selectedMode;
      return matchesSearch && matchesMode;
    });
  }, [searchQuery, selectedMode, jobs]);

  // FIX: isLoggedIn ka use karke component return kiya
  if (!isLoggedIn) return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <button onClick={() => setIsLoggedIn(true)} className="text-white bg-blue-600 px-8 py-4 rounded-xl">Re-Connect to Orbit</button>
    </div>
  );

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
           <button onClick={() => setUserRole(userRole === 'seeker' ? 'recruiter' : 'seeker')} className="w-full py-3 bg-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Switch Role</button>
           <button onClick={() => setIsLoggedIn(false)} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase hover:bg-red-500 hover:text-white transition-all">Logout</button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 overflow-hidden flex flex-col p-10">
        {activeTab === 'find-job' && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-end mb-10">
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">Universe Portal.</h2>
                <button onClick={fetchNearbyJobs} disabled={loading} className="flex items-center gap-2 px-6 py-4 bg-white/30 backdrop-blur-md border border-white/50 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                    <MapPin size={16} className={loading ? "animate-bounce" : "text-red-500"} />
                    {loading ? "Scanning..." : "Radar"}
                </button>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md p-4 rounded-[2.5rem] border border-white shadow-xl flex items-center gap-4 mb-10">
              <input type="text" placeholder="Search..." className="flex-1 bg-transparent px-4 py-2 outline-none font-bold" onChange={(e) => setSearchQuery(e.target.value)} />
              <select value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)} className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase">
                <option value="ALL">All Modes</option>
                <option value="Full-Time Job">Full-Time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {filteredJobs.map(job => (
                <div key={job._id || job.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-50 flex items-center justify-between group shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">{job.jobType === 'Internship' ? <Zap/> : <Briefcase/>}</div>
                    <div>
                      <h4 className="text-2xl font-black italic uppercase leading-none">{job.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => toggleSave(job._id || job.id)} className={`p-4 rounded-xl ${savedJobs.includes(job._id || job.id) ? 'bg-red-500 text-white' : 'bg-slate-50 text-slate-300'}`}><Heart size={20}/></button>
                    <button onClick={() => {setSelectedJob(job); setShowApplyModal(true);}} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase">Engage</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECRUITER DASHBOARD (Summary) */}
        {activeTab === 'rec-dash' && (
           <div className="h-full">
              <h2 className="text-6xl font-black italic uppercase text-orange-600 mb-10">Pipeline Control.</h2>
              {applications.map(c => (
                <div key={c.id} className="bg-white p-8 rounded-[3.5rem] flex items-center justify-between mb-4 border border-slate-50">
                  <h4 className="text-2xl font-black italic uppercase">{c.name} <span className="block text-xs font-bold text-slate-300 italic">{c.role}</span></h4>
                  <div className="flex gap-4">
                    <button onClick={() => updateStatus(c.id, 'SELECTED')} className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><UserCheck size={20}/></button>
                    <button onClick={() => updateStatus(c.id, 'REJECTED')} className="p-4 bg-red-50 text-red-600 rounded-xl"><UserX size={20}/></button>
                  </div>
                </div>
              ))}
           </div>
        )}

        {activeTab === 'post-vacancy' && (
           <div className="h-full flex flex-col items-center justify-center">
              <h2 className="text-5xl font-black italic uppercase mb-12">New Node Deployment.</h2>
              <div className="flex gap-6 mb-12">
                 {['JOB', 'TRAINING', 'INTERNSHIP'].map(type => (
                   <button key={type} onClick={() => setPostType(type)} className={`p-10 rounded-[3rem] border-2 font-black italic ${postType === type ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-300 border-slate-100'}`}>{type}</button>
                 ))}
              </div>
              <button className="w-full max-w-xl py-8 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xl tracking-[0.4em]">Broadcast</button>
           </div>
        )}
      </main>

      {/* MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-3xl rounded-[4rem] p-12 relative shadow-2xl">
            <button onClick={() => setShowApplyModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500"><X size={32}/></button>
            <h3 className="text-4xl font-black italic uppercase mb-8">Deploying to <span className="text-blue-600">{selectedJob?.title}</span></h3>
            <textarea placeholder="Your Pitch..." className="w-full h-40 bg-slate-50 rounded-[2rem] p-6 mb-8 outline-none font-bold italic" />
            <button onClick={() => {setShowApplyModal(false); alert("Success!");}} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest">Confirm Application</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrbitSupremeFinalMerged;