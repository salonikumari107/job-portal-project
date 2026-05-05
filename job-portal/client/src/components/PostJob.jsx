import React, { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Globe, Rocket } from 'lucide-react';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    salaryRange: "",
    jobType: "Full-Time Job", // Backend matching string
    experienceLevel: "Fresher",
    skillsInput: "",
    description: "" 
  });

  const [loading, setLoading] = useState(false);

  const handleJobPost = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🚀 SKILLS ARRAY LOGIC
    const finalSkills = formData.skillsInput
      ? formData.skillsInput.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    if (finalSkills.length === 0) {
      setLoading(false);
      return toast.error("Kam se kam ek skill (e.g. React) likhna zaroori hai!");
    }

    // ✅ FIXED PAYLOAD: Mapping keys to match Backend Controller requirements
    const finalPayload = {
      title: formData.title.trim(),
      company: formData.companyName.trim(), // Backend 'company' field uses this
      location: formData.location.trim(),
      salaryRange: formData.salaryRange,
      jobType: formData.jobType,
      experienceLevel: formData.experienceLevel,
      skillsRequired: finalSkills,
      description: formData.description || `Hiring for ${formData.title} at ${formData.companyName}.`
    };

    try {
      // API request to backend (Fixed "next is not a function" by sending correct data structure)
      const res = await api.post("/jobs", finalPayload);
      
      if (res.data.success) {
        toast.success("Opportunity Broadcasted! 🚀");
        // Form Reset
        setFormData({
          title: "", companyName: "", location: "", salaryRange: "",
          jobType: "Full-Time Job", experienceLevel: "Fresher", skillsInput: "", description: ""
        });
      }
    } catch (error) {
      console.error("Orbit Debug:", error.response?.data);
      // Backend se exact validation error message fetch karna
      const errorMsg = error.response?.data?.message || "Post fail ho gaya!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white p-6 lg:p-10">
      <form onSubmit={handleJobPost} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Section: Main Info */}
        <div className="lg:col-span-2 space-y-6 text-left">
          {/* Title */}
          <div className="bg-slate-50 p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest italic">Opportunity Title</label>
            <input 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              placeholder="e.g. Full Stack Developer" required 
              className="w-full p-4 lg:p-5 bg-white border border-slate-200 rounded-2xl font-bold text-lg outline-none focus:ring-2 focus:ring-blue-400 transition-all" 
            />
          </div>

          {/* Company */}
          <div className="bg-slate-50 p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest italic">Company Name</label>
            <input 
              value={formData.companyName} 
              onChange={(e) => setFormData({...formData, companyName: e.target.value})} 
              placeholder="e.g. Orbit Nodes Tech" required 
              className="w-full p-4 lg:p-5 bg-white border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-400 transition-all" 
            />
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest italic">Job Description (Optional)</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              placeholder="Briefly describe the role..."
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl h-32 font-medium outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none" 
            />
          </div>

          {/* Skills */}
          <div className="bg-slate-50 p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest italic">Technical Stack (Comma Separated)</label>
            <textarea 
              value={formData.skillsInput} 
              onChange={(e) => setFormData({...formData, skillsInput: e.target.value})} 
              placeholder="React, Node.js, MongoDB, Express..." required 
              className="w-full p-4 lg:p-5 bg-white border border-slate-200 rounded-2xl h-48 font-medium outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none" 
            />
          </div>
        </div>

        {/* Right Section: Sidebar / Configuration */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 text-left shadow-sm">
             <label className="text-[10px] font-black uppercase text-blue-500 block mb-4 italic tracking-widest">Configuration</label>
             <select 
               value={formData.jobType} 
               onChange={(e) => setFormData({...formData, jobType: e.target.value})} 
               className="w-full p-4 bg-white border border-slate-200 rounded-xl mb-4 font-bold outline-none cursor-pointer"
             >
                <option value="Full-Time Job">Full-Time Job</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
             </select>
             <select 
               value={formData.experienceLevel} 
               onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})} 
               className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold outline-none cursor-pointer"
             >
                <option value="Fresher">Fresher / Entry Level</option>
                <option value="Intermediate">Intermediate (1-3 yrs)</option>
                <option value="Senior Expert">Senior Expert (5+ yrs)</option>
             </select>
          </div>

          <div className="bg-[#1A1F2C] p-6 lg:p-8 rounded-[2.5rem] text-white shadow-2xl">
             <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[9px] uppercase text-slate-400 ml-2">Budget / Salary</label>
                   <input 
                     value={formData.salaryRange} 
                     onChange={(e) => setFormData({...formData, salaryRange: e.target.value})} 
                     placeholder="e.g. 5 LPA" required 
                     className="w-full p-4 bg-white/10 rounded-xl outline-none border border-white/10 font-bold focus:bg-white/20 transition-all" 
                   />
                </div>
                
                <div className="space-y-1">
                   <label className="text-[9px] uppercase text-slate-400 ml-2">Location</label>
                   <input 
                     value={formData.location} 
                     onChange={(e) => setFormData({...formData, location: e.target.value})} 
                     placeholder="e.g. Pune / Remote" required 
                     className="w-full p-4 bg-white/10 rounded-xl outline-none border border-white/10 font-bold focus:bg-white/20 transition-all" 
                   />
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-5 bg-blue-500 hover:bg-blue-600 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg mt-4 disabled:opacity-50"
                >
                    {loading ? <Rocket className="animate-bounce" size={18}/> : <Globe size={18}/>}
                    {loading ? "DEPLOYING..." : "DEPLOY BROADCAST"}
                </button>
             </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostJob;