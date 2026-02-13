import React, { useState, useEffect } from 'react';
import { Heart, Share2, Briefcase, GraduationCap, Upload, X, Send, Layers, Search, DollarSign, MapPin, Navigation, Info, Building } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const FindJob = ({ jobs, savedJobs, toggleWishlist }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [level, setLevel] = useState("ALL");
  const [mode, setMode] = useState("ALL");
  const [salaryFilter, setSalaryFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  
  const [selectedJob, setSelectedJob] = useState(null); // Modal state
  const [resume, setResume] = useState(null);
  const [coverNote, setCoverNote] = useState("");
  const [isNearbySearch, setIsNearbySearch] = useState(false);
  const [nearbyJobs, setNearbyJobs] = useState([]);

  const handleApply = async () => {
    if (!resume) {
      toast.error("Please upload a resume");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('jobId', selectedJob._id);
      formData.append('resume', resume);
      formData.append('coverLetter', coverNote);

      const res = await api.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        toast.success("APPLICATION BROADCASTED!");
        setSelectedJob(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error applying");
    }
  };

  const toggleNearby = async () => {
    if (isNearbySearch) {
      setIsNearbySearch(false);
      setNearbyJobs([]);
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await api.get(`/jobs/radius/${latitude}/${longitude}/50`); // 50km radius
        if (res.data.success) {
          setNearbyJobs(res.data.data);
          setIsNearbySearch(true);
          toast.success(`Found ${res.data.count} Nodes nearby!`);
        }
      } catch (err) {
        toast.error("Error fetching nearby jobs");
      }
    }, () => {
      toast.error("Unable to retrieve your location");
    });
  };

  const displayJobs = isNearbySearch ? nearbyJobs : jobs;

  const filtered = displayJobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (j.skillsRequired?.join(', ').toLowerCase().includes(skillFilter.toLowerCase()) || true) &&
    (level === "ALL" || j.experienceLevel === level) &&
    (categoryFilter === "ALL" || j.jobType === categoryFilter)
  );

  return (
    <div className="space-y-6 relative">
      <h2 className="text-4xl font-black italic uppercase italic">Universe <span className="text-blue-600">Nodes.</span></h2>
      
      {/* --- ALL FILTERS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 bg-slate-50 p-4 rounded-[2.5rem]">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
          <input type="text" placeholder="Title..." className="w-full p-3 pl-10 rounded-xl text-xs font-bold outline-none" onChange={e => setSearchTerm(e.target.value)} />
        </div>
        
        <select onChange={e => setCategoryFilter(e.target.value)} className="p-3 rounded-xl text-[10px] font-black uppercase outline-none bg-white">
          <option value="ALL">ALL TYPES</option>
          <option value="Full-time">FULL-TIME</option>
          <option value="Part-time">PART-TIME</option>
          <option value="Internship">INTERNSHIP</option>
          <option value="Freelance">FREELANCE</option>
        </select>

        <select onChange={e => setLevel(e.target.value)} className="p-3 rounded-xl text-[10px] font-black uppercase outline-none bg-white">
          <option value="ALL">EXPERIENCE</option>
          <option value="Fresher">FRESHER</option>
          <option value="1-3 years">1-3 YEARS</option>
          <option value="3-5 years">3-5 YEARS</option>
          <option value="5+ years">5+ YEARS</option>
        </select>

        <button 
          onClick={toggleNearby}
          className={`p-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${isNearbySearch ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}
        >
          <Navigation size={14}/> {isNearbySearch ? "Showing Nearby" : "Nearby Nodes"}
        </button>

        <input type="text" placeholder="Skills..." className="p-3 rounded-xl text-xs font-bold outline-none bg-white lg:col-span-1" onChange={e => setSkillFilter(e.target.value)} />
      </div>

      {/* --- LISTINGS --- */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <Info className="mx-auto text-slate-300 mb-4" size={40}/>
            <p className="text-[10px] font-black uppercase text-slate-400">No Nodes detected in this sector.</p>
          </div>
        )}
        {filtered.map(job => (
          <div key={job._id} className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-xl transition-all group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                {job.jobType === 'Internship' ? <GraduationCap size={28}/> : <Briefcase size={28}/>}
              </div>
              <div>
                <h4 className="font-black italic uppercase text-xl leading-none group-hover:text-blue-600 transition-all">{job.title}</h4>
                <div className="flex flex-wrap gap-4 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="text-blue-600 italic bg-blue-50 px-2 py-1 rounded">{job.salaryRange || 'NOT DISCLOSED'}</span>
                  <span className="flex items-center gap-1"><Building size={12}/> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">{job.jobType}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6 md:mt-0 w-full md:w-auto">
              <button onClick={() => toggleWishlist(job._id)} className={`p-5 rounded-2xl transition-all ${savedJobs.includes(job._id) ? 'text-red-500 bg-red-50 shadow-inner' : 'bg-slate-50 hover:bg-slate-100'}`}><Heart size={20} className={savedJobs.includes(job._id) ? "fill-current" : ""}/></button>
              <button onClick={() => setSelectedJob(job)} className="flex-1 md:flex-none px-10 py-5 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 shadow-xl active:scale-95 transition-all">Connect Now</button>
            </div>
          </div>
        ))}
      </div>

      {/* --- FIXED APPLY MODAL --- */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black italic text-xl uppercase leading-none">{selectedJob.title}</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 tracking-widest">{selectedJob.company} Node</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20}/>
              </button>
            </div>

            <div className="space-y-4">
              <label className="block w-full border-2 border-dashed border-slate-100 p-8 rounded-3xl text-center cursor-pointer hover:bg-slate-50 transition-all group">
                <Upload className="mx-auto mb-2 text-slate-300 group-hover:text-blue-500 transition-all" size={24}/>
                <span className="text-[10px] font-black uppercase text-slate-400">
                  {resume ? <span className="text-blue-600 underline">{resume.name}</span> : "Upload Node Resume (PDF)"}
                </span>
                <input type="file" className="hidden" accept=".pdf" onChange={e => setResume(e.target.files[0])} />
              </label>

              {resume && (
                <button onClick={() => setResume(null)} className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1 mx-auto tracking-widest">
                  <X size={12}/> Remove File
                </button>
              )}

              <textarea placeholder="Write a short cover note..." value={coverNote} onChange={e => setCoverNote(e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl h-28 outline-none font-bold text-xs resize-none focus:bg-white border-2 border-transparent focus:border-blue-100 transition-all" />

              <div className="flex gap-2 pt-2">
                <button onClick={() => window.open('https://wa.me/?text=Check this Node!', '_blank')} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-[10px] uppercase flex gap-2 justify-center items-center hover:bg-blue-50 hover:text-blue-600 transition-all">
                  <Share2 size={14}/> Share
                </button>
                <button onClick={handleApply} className="flex-[2] py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
                  Submit Node <Send size={14} className="inline ml-1"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindJob;