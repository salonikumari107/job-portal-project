import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, MapPin, Briefcase } from 'lucide-react';
import api from '../api/axios'; // Ensure karein path sahi ho
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Database se Saved Jobs Fetch karein
  const fetchSavedJobs = async () => {
    try {
      const res = await api.get('/jobs/saved'); // Backend Route
      if (res.data.success) {
        setSavedJobs(res.data.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load signals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  // 2. Remove (Unlike) Logic
  const handleRemove = async (jobId) => {
    try {
      const res = await api.post(`/jobs/${jobId}/save`);
      if (res.data.success) {
        toast.success("Node removed from wishlist");
        // List ko turant update karein
        setSavedJobs(prev => prev.filter(job => job._id !== jobId));
      }
    } catch (err) {
      toast.error("Disconnection failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">
          My <span className="text-red-500">Wishlist.</span>
        </h2>
        <span className="bg-slate-100 px-4 py-1 rounded-full text-[10px] font-black uppercase">
          {savedJobs.length} Nodes Archived
        </span>
      </div>
      
      {savedJobs.length === 0 ? (
        <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
          <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">
            No signals archived in your wishlist yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <div 
              key={job._id} 
              className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between hover:shadow-xl transition-all duration-300"
            >
              <div className="flex-1">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                  {job.jobType || "Full-time"}
                </span>
                <h4 className="text-xl font-black italic uppercase text-zinc-900 mt-1">
                  {job.title}
                </h4>
                <div className="flex gap-3 mt-2">
                   <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                     <MapPin size={10} /> {job.location}
                   </p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                     <Briefcase size={10} /> {job.company}
                   </p>
                </div>
              </div>
              
              <button 
                onClick={() => handleRemove(job._id)} 
                className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all group"
              >
                <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;