import React, { useState } from 'react';
import { Send, MapPin, IndianRupee, Briefcase, GraduationCap, Zap, Navigation } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PostJob = () => {
  const [jobType, setJobType] = useState('Full-time'); // Default Category mapped to model
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salaryRange: "",
    description: "",
    company: "",
    coordinates: null
  });

  const fetchCoordinates = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setFormData({
        ...formData,
        coordinates: {
          type: 'Point',
          coordinates: [position.coords.longitude, position.coords.latitude]
        }
      });
      toast.success("Coordinates Linked!");
    });
  };

  const handlePost = async () => {
    try {
      const res = await api.post('/jobs', {
        ...formData,
        jobType,
        company: formData.company || "My Company" 
      });
      if (res.data.success) {
        toast.success("JOB BROADCASTED!");
        setFormData({ title: "", location: "", salaryRange: "", description: "", company: "", coordinates: null });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error posting job");
    }
  };

  const mapType = (type) => {
    if (type === 'JOB') return 'Full-time';
    if (type === 'TRAINING') return 'Internship';
    if (type === 'INTERNSHIP') return 'Internship';
    return type;
  };

  return (
    <div className="max-w-5xl space-y-10 animate-in fade-in duration-700">
      {/* CATEGORY SELECTOR TABS */}
      <div className="grid grid-cols-3 gap-6">
        <button 
          onClick={() => setJobType('Full-time')}
          className={`p-8 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all shadow-sm ${jobType === 'Full-time' ? 'bg-orange-600 text-white scale-105 shadow-orange-200' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
        >
          <Briefcase size={32} />
          <span className="font-black italic uppercase text-[10px] tracking-widest">Post Full Job</span>
        </button>

        <button 
          onClick={() => setJobType('Internship')}
          className={`p-8 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all shadow-sm ${jobType === 'Internship' ? 'bg-blue-600 text-white scale-105 shadow-blue-200' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
        >
          <GraduationCap size={32} />
          <span className="font-black italic uppercase text-[10px] tracking-widest">Post Training</span>
        </button>

        <button 
          onClick={() => setJobType('Freelance')}
          className={`p-8 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all shadow-sm ${jobType === 'Freelance' ? 'bg-indigo-600 text-white scale-105 shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
        >
          <Zap size={32} />
          <span className="font-black italic uppercase text-[10px] tracking-widest">Post Freelance</span>
        </button>
      </div>

      {/* INPUT FORM SECTION */}
      <div className="bg-slate-50/50 p-10 rounded-[4rem] border border-slate-100 space-y-6">
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder={`Title of ${jobType}...`} 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full p-8 bg-white rounded-[2rem] font-black italic text-xl uppercase tracking-tighter outline-none border-2 border-transparent focus:border-blue-100 shadow-sm transition-all"
          />

          <input 
            type="text" 
            placeholder="Company Name" 
            value={formData.company}
            onChange={e => setFormData({...formData, company: e.target.value})}
            className="w-full p-4 bg-white rounded-[1.5rem] font-bold text-sm outline-none border-2 border-transparent focus:border-blue-100 shadow-sm"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LOCATION ENABLED */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  placeholder="Location (e.g. Remote, Mumbai)" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-16 p-6 bg-white rounded-[1.8rem] font-bold text-sm outline-none border-2 border-transparent focus:border-blue-100 shadow-sm"
                />
              </div>
              <button 
                onClick={fetchCoordinates}
                className={`p-6 rounded-[1.8rem] transition-all ${formData.coordinates ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
                title="Use Current GPS Coordinates"
              >
                <Navigation size={20} />
              </button>
            </div>

            {/* SALARY/STIPEND ENABLED */}
            <div className="relative">
              <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                placeholder={jobType === 'Full-time' ? "Package (e.g. 15-22 LPA)" : "Stipend (e.g. 15k/mo)"} 
                value={formData.salaryRange}
                onChange={e => setFormData({...formData, salaryRange: e.target.value})}
                className="w-full pl-16 p-6 bg-white rounded-[1.8rem] font-bold text-sm outline-none border-2 border-transparent focus:border-blue-100 shadow-sm"
              />
            </div>
          </div>

          <textarea 
            placeholder="Node Description & Requirements..." 
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full p-8 bg-white rounded-[2.5rem] h-40 outline-none font-bold text-sm resize-none border-2 border-transparent focus:border-blue-100 shadow-sm"
          ></textarea>
        </div>

        <button onClick={handlePost} className="w-full py-8 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl active:scale-95">
          <Send size={18} /> Broadcast {jobType} Node
        </button>
      </div>
    </div>
  );
};

export default PostJob;