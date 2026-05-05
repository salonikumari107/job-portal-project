import React, { useState, useEffect } from 'react';
import api from '../api/axios'; 
import { toast } from 'react-hot-toast';
import { 
 Building2, Globe, MapPin, Briefcase, 
 ShieldCheck, Mail, Phone, Users, 
 ExternalLink, LayoutDashboard  
} from 'lucide-react';

const RecruiterProfile = ({ userData, refreshData }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    industry: '',
    location: '',
    description: '',
    taxId: '',
    companySize: '1-10',
    email: '' // 1. Email field ko formData mein add kiya
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 2. Email ko userData se uthakar formData mein set karna
    if (userData) {
      setFormData({
        companyName: userData.companyDetails?.name || '',
        website: userData.companyDetails?.website || '',
        industry: userData.companyDetails?.industry || '',
        location: userData.companyDetails?.location || '',
        description: userData.companyDetails?.description || '',
        taxId: userData.companyDetails?.taxId || '',
        companySize: userData.companyDetails?.companySize || '1-10',
        email: userData.email || '' // Email state update
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 3. Ab formData ke saath updated email bhi backend par jayega
      const res = await api.put("/auth/profile-update", formData);
      if (res.data.success) {
        toast.success("Corporate Profile Updated!");
        if (refreshData) refreshData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 text-gray-700 font-medium shadow-sm";

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen bg-[#fcfcfc]">
      
      {/* 1. HERO HEADER SECTION */}
      <div className="relative bg-black rounded-[3rem] p-8 md:p-14 mb-12 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/30">
                Verified Recruiter
              </span>
              <span className="bg-white/10 text-white/60 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase">
                ID: {userData?._id?.slice(-8)}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">
              {formData.companyName || "Your Company"}
            </h1>
            <p className="text-gray-400 flex items-center gap-2 font-medium">
              <MapPin size={16} className="text-blue-500"/> {formData.location || "Location not set"}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-4">
            <div className="bg-blue-600 p-4 rounded-2xl">
               <Building2 size={32} className="text-white"/>
            </div>
            <div>
              <p className="text-white font-bold text-lg">{userData?.name}</p>
              <p className="text-gray-500 text-xs font-medium">Primary Admin Account</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 2. MAIN EDITING FORM */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3 uppercase italic">
                <LayoutDashboard className="text-blue-600" size={24}/> Corporate Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                  <input name="companyName" value={formData.companyName} onChange={handleChange} className={inputClasses} placeholder="e.g. Orbit Tech Solutions" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Official Website</label>
                  <div className="relative">
                    <input name="website" value={formData.website} onChange={handleChange} className={inputClasses} placeholder="https://company.com" />
                    <Globe size={18} className="absolute right-5 top-4 text-gray-300"/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Industry Type</label>
                  <input name="industry" value={formData.industry} onChange={handleChange} className={inputClasses} placeholder="e.g. Information Technology" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">HQ Location</label>
                  <input name="location" value={formData.location} onChange={handleChange} className={inputClasses} placeholder="City, Country" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Company Size</label>
                  <select name="companySize" value={formData.companySize} onChange={handleChange} className={inputClasses}>
                    <option value="1-10">1-10 Employees</option>
                    <option value="11-50">11-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201-500">201-500 Employees</option>
                    <option value="500+">500+ Employees</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tax ID / GST Number</label>
                  <input name="taxId" value={formData.taxId} onChange={handleChange} className={inputClasses} placeholder="Enter Legal Tax ID" />
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">About the Company</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="5" 
                  className={`${inputClasses} resize-none`} 
                  placeholder="Tell potential candidates about your mission, culture, and what you do..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full mt-10 py-5 bg-blue-600 text-white font-black rounded-[2rem] text-lg shadow-2xl shadow-blue-200 transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {loading ? "SAVING CORPORATE DATA..." : "PUBLISH PROFILE UPDATES"}
              </button>
            </div>
          </form>
        </div>

        {/* 3. ADMIN METRICS SECTION - AB YAHAN LIKH SAKTE HAIN */}
        <div className="space-y-8">
          <div className="bg-[#111111] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-500"></div>
            
            <h3 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Admin Metrics</h3>
            
            <div className="space-y-8 relative z-10">
              {/* Editable Support Email */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-2xl"><Mail size={20} className="text-blue-400"/></div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Support Email</p>
                  <input 
                    name="email" // 4. name field add kiya taaki handleChange kaam kare
                    type="email"
                    value={formData.email} 
                    onChange={handleChange} // 5. onChange add kiya editing ke liye
                    placeholder="Enter Support Email"
                    className="bg-transparent text-sm text-gray-200 font-medium border-b border-white/10 focus:border-blue-500 outline-none w-full py-1 transition-all"
                  />
                </div>
              </div>

              {/* Tax ID / GST - Editable inside Metrics too */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-2xl"><ShieldCheck size={20} className="text-green-400"/></div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Tax ID / GST</p>
                  <input 
                    name="taxId" 
                    value={formData.taxId || ""} 
                    onChange={handleChange} 
                    placeholder="Enter Tax ID"
                    className="bg-transparent text-sm text-white font-medium border-b border-white/10 focus:border-blue-500 outline-none w-full transition-all py-1 placeholder:text-gray-700"
                  />
                </div>
              </div>

              {/* Stats Section */}
              <div className="pt-8 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-2xl font-black text-white italic">0</p>
                    <p className="text-[8px] text-gray-500 font-bold uppercase mt-1">Active Jobs</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-2xl font-black text-white italic">0</p>
                    <p className="text-[8px] text-gray-500 font-bold uppercase mt-1">Hires</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 shadow-sm text-center">
             <div className="flex justify-center mb-4">
                <span className="bg-green-500/10 text-green-600 text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> VERIFICATION ACTIVE
                </span>
             </div>
             <p className="text-xs text-blue-700 leading-relaxed font-medium">
               Your company profile is visible to candidates. High quality bios attract better talent!
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;