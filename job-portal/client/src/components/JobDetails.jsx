import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { 
  ArrowLeft, MapPin, IndianRupee, Briefcase, 
  CheckCircle, ShieldCheck, FileText, Heart 
} from "lucide-react";
import { useAuth } from "../context/AuthContext"; 

const JobDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const { user, setData } = useAuth(); 
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH JOB DATA ---
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`); 
        if (res.data.success) {
          setJob(res.data.data);
        }
      } catch (error) {
        console.error("Signal Lost: Job not found", error);
        toast.error("Signal Lost: Job not found");
        navigate("/universe");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id, navigate]);

  // --- SAVE JOB LOGIC ---
  const handleSaveJob = async () => {
    try {
      const res = await api.post(`/auth/save-job/${id}`);
      if (res.data.success) {
        if (setData) setData(res.data.data); 
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Connectivity Lost");
    }
  };

  // --- UPDATED APPLY LOGIC (FIXED SINGULAR ENDPOINT) ---
 // --- UPDATED APPLY LOGIC ---
const handleApply = async () => {
  try {
    const resumeId = user?.resumes?.[0]?._id || 
                     user?.resumes?.[user.resumes.length - 1]?._id || 
                     user?.resume;

    console.log("🚀 TRANSMISSION_START:", { resumeId, jobId: id });

    // Yahan payload mein key ka naam 'resume' rakhein, kyunki backend wahi maang raha hai
    const res = await api.post(`/application/apply/${id}`, { 
      resume: resumeId  // Pehle yahan resumeId: resumeId tha, ise 'resume' kar dein
    });

    if (res.data.success) {
      toast.success("Signal Transmitted!");
      setTimeout(() => navigate("/universe"), 2000);
    }
  } catch (err) {
    console.error("❌ TRANSMISSION_FAILED:", err.response?.data);
    toast.error(err.response?.data?.message || "Transmission Failed");
  }
};

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse text-blue-600 font-black tracking-widest uppercase italic">Scanning Node...</div>
    </div>
  );

  if (!job) return null;

  // UI status check - Thoda relaxed check taaki UI block na ho
  const isResumeReady = (user?.resumes && user.resumes.length > 0) || user?.resume;
  
  const isSaved = user?.savedJobs?.some(savedJob => {
    const savedId = savedJob._id || savedJob;
    return savedId === id;
  });

  return (
    <div className="p-6 md:p-12 animate-in fade-in duration-500 bg-gray-50 min-h-screen">
      {/* Header Buttons */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate("/universe")} 
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={16} /> Return to Universe
        </button>

        <button 
          onClick={handleSaveJob}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all border-2 ${
            isSaved ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-100'
          }`}
        >
          <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Saved in Universe" : "Save Node"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Job Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase mb-6 inline-block italic">
              {job.jobType || "Full-time"}
            </span>
            <h1 className="text-5xl font-black italic tracking-tighter text-slate-900 leading-none mb-4 uppercase">
              {job.title}
            </h1>
            <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-8 italic">{job.company}</p>

            <div className="grid grid-cols-3 gap-4 py-8 border-y border-slate-50">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-300 uppercase italic">Location</span>
                <div className="flex items-center gap-2 text-slate-900 font-black italic uppercase text-xs">
                  <MapPin size={14} className="text-blue-500" /> {job.location}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-300 uppercase italic">Salary</span>
                <div className="flex items-center gap-2 text-slate-900 font-black italic uppercase text-xs">
                  <IndianRupee size={14} className="text-green-500" /> {job.salaryRange || "Negotiable"}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-300 uppercase italic">Level</span>
                <div className="flex items-center gap-2 text-slate-900 font-black italic uppercase text-xs">
                  <Briefcase size={14} className="text-orange-500" /> {job.experienceLevel || "Fresher"}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 italic border-l-4 border-blue-600 pl-3">Mission Briefing</h3>
              <p className="text-slate-600 leading-relaxed font-bold text-sm whitespace-pre-wrap italic">
                {job.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Apply Sidebar */}
        <div className="space-y-6">
          <div className="bg-black p-8 rounded-[3rem] text-white shadow-2xl border border-slate-900">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-blue-400" size={20} />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Verified Signal</h4>
            </div>
            
            <div className="mb-8 p-5 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <FileText size={14} className={isResumeReady ? "text-green-400" : "text-red-400"} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Payload: {isResumeReady ? "Resume Ready" : "Resume Missing"}
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-bold leading-tight italic uppercase">
                {isResumeReady ? "Automatic transmission enabled via profile link." : "Upload resume in profile to enable transmission."}
              </p>
            </div>

            <button 
              onClick={handleApply}
              className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 group bg-blue-600 hover:bg-white hover:text-black cursor-pointer`}
            >
              <CheckCircle size={18} className="group-hover:animate-pulse" /> Apply for Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;