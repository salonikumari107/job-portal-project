import React, { useState, useEffect } from 'react';
import { Briefcase, Zap, Loader2, SignalHigh, FileText } from 'lucide-react'; // ✅ FileText icon add kiya
import api, { getResumeUrl } from '../api/axios'; // ✅ getResumeUrl import kiya

const AppStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApps = async () => {
      try {
        setLoading(true);
        // Backend route singular hai as per project structure
        const res = await api.get('/application/my-applications'); 
        
        if (res.data.success) {
          const fetchedData = res.data.applications || res.data.data || [];
          setApplications(fetchedData);
        }
      } catch (err) {
        console.error("❌ Signal Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyApps();
  }, []);

  const getStatusStyle = (status) => {
    const s = status?.toUpperCase();
    const styles = {
      'ACCEPTED': 'bg-emerald-100 text-emerald-600 border-emerald-200',
      'REJECTED': 'bg-red-100 text-red-600 border-red-200',
      'APPLIED': 'bg-orange-100 text-orange-600 border-orange-200',
      'SHORTLISTED': 'bg-purple-100 text-purple-600 border-purple-200',
      'PENDING': 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return styles[s] || styles['PENDING'];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-[3rem]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing with Orbit...</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
        <div className="flex justify-center mb-4">
            <SignalHigh className="text-slate-200" size={60} />
        </div>
        <h3 className="text-slate-300 font-black italic text-2xl uppercase tracking-tighter text-slate-400">
            No active mission protocols found.
        </h3>
        <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-2 font-bold">Start applying to initiate data transmission.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in space-y-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-5xl font-black italic uppercase text-slate-900 tracking-tighter leading-none">
            My <span className="text-blue-600">Signal.</span>
          </h2>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-2">Monitoring active nodes in the job universe.</p>
        </div>
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 bg-white px-4 py-2 rounded-full border border-slate-100">
          {applications.length} Nodes Online
        </span>
      </div>
      
      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="group bg-white p-8 rounded-[3rem] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                {app.job?.jobType === 'Internship' ? <Zap size={24}/> : <Briefcase size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-black italic uppercase leading-none">
                    {app.job?.title || 'Unknown Assignment'}
                  </h4>
                  <span className="text-[8px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-400 uppercase">
                    {app.job?.jobType || 'MISSION'}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                  {app.job?.companyName || app.job?.company || 'Orbit Galaxy'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* ✅ VIEW RESUME BUTTON: Current port (8001) support ke saath */}
              {app.resume && (
                <button 
                  onClick={() => window.open(getResumeUrl(app.resume), '_blank')}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                >
                  <FileText size={14} /> My Resume
                </button>
              )}

              <div className={`px-8 py-3 rounded-full font-black text-[9px] uppercase tracking-widest border shadow-sm transition-colors ${getStatusStyle(app.status)}`}>
                {app.status || 'PENDING'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppStatus;