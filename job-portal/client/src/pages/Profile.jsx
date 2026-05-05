import React, { useState, useEffect } from 'react';
import { User, CheckCircle2, Plus, X, Briefcase, Code, MapPin, Phone } from 'lucide-react';
import api from '../api/axios'; 
import toast from 'react-hot-toast';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobile: "",
    skills: [],
    summary: "",
    location: "",
    experienceLevel: "Fresher"
  });

  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // --- 1. FETCH DATA ON LOAD ---
  const fetchData = async () => {
    try {
      const res = await api.get('/auth/profile');
      if (res.data.success) {
        // Backend user data ko extract karein
        const userData = res.data.user || res.data.data;
        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
          mobile: userData.mobile || "",
          skills: Array.isArray(userData.skills) ? userData.skills : [],
          // Dono fields check karein sync ke liye
          summary: userData.summary || userData.bio || "",
          location: userData.location || "",
          experienceLevel: userData.experienceLevel || "Fresher"
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load profile data");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. SKILLS MANAGEMENT ---
  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill !== "") {
      const currentSkills = Array.isArray(profileData.skills) ? profileData.skills : [];
      if (!currentSkills.some(s => s.toLowerCase() === trimmedSkill.toLowerCase())) {
        setProfileData({
          ...profileData,
          skills: [...currentSkills, trimmedSkill]
        });
      }
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // --- 3. SAVE CHANGES (Clean Sync) ---
  const handleSync = async () => {
    setLoading(true);
    try {
      // ✅ FIX: Sirf wahi fields bhejein jo editable hain
      // Email ya password update request mein bhejna kabhi-kabhi 500 error deta hai
      const payload = {
        name: profileData.name,
        mobile: profileData.mobile,
        location: profileData.location,
        summary: profileData.summary,
        bio: profileData.summary, // Backend sync ke liye dono bhejein
        skills: profileData.skills,
        experienceLevel: profileData.experienceLevel
      };

      const res = await api.put('/auth/profile', payload);

      if (res.data.success) {
        toast.success("Profile Updated Successfully!");
        const updatedUser = res.data.user;
        
        // Response data se state update karein
        setProfileData(prev => ({
            ...prev,
            ...updatedUser,
            summary: updatedUser.summary || updatedUser.bio || ""
        }));
      }
    } catch (err) {
      // Error details ko console mein print karein debugging ke liye
      console.error("Sync Error Details:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Server Communication Error";
      toast.error(`Sync Failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-[#1a5f7a] border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-slate-600 animate-pulse">ORBITING TO YOUR PROFILE...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10">
      <div className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center gap-4 md:gap-6 mb-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1a5f7a] rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-lg border-4 border-slate-50">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : <User />}
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Your Identity</h2>
            <p className="text-slate-500 font-medium italic text-sm md:text-base">Orbit Nodes Profile</p>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-slate-700 font-bold ml-2 text-sm">Full Name</label>
              <input 
                value={profileData.name} 
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-[#1a5f7a] transition-all font-bold text-slate-700 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 font-bold ml-2 text-sm">
                <Phone className="w-4 h-4" /> Mobile Number
              </label>
              <input 
                value={profileData.mobile} 
                onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-[#1a5f7a] transition-all font-bold text-slate-700 shadow-sm"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-700 font-bold ml-2 text-sm">
                <MapPin className="w-4 h-4" /> Current Location
            </label>
            <input 
              value={profileData.location} 
              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-[#1a5f7a] transition-all font-bold text-slate-700 shadow-sm"
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <label className="text-slate-700 font-bold ml-2 text-sm">Professional Summary</label>
            <textarea 
              rows="4"
              value={profileData.summary} 
              onChange={(e) => setProfileData({...profileData, summary: e.target.value})}
              className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-[#1a5f7a] transition-all font-medium text-slate-600 shadow-sm"
            />
          </div>

          {/* Skills */}
          <div className="space-y-4 bg-slate-50/50 p-5 md:p-6 rounded-3xl border border-dashed border-slate-200">
            <label className="flex items-center gap-2 text-slate-700 font-black ml-2">
              <Code className="w-5 h-5 text-[#1a5f7a]" /> Skills
            </label>
            <div className="flex gap-2 md:gap-3">
              <input 
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 p-4 bg-white rounded-2xl border-2 border-slate-100 outline-none focus:border-[#1a5f7a] transition-all font-bold shadow-inner text-sm md:text-base"
                placeholder="React, Node.js..."
              />
              <button onClick={handleAddSkill} className="bg-slate-800 text-white px-5 md:px-6 rounded-2xl hover:bg-[#1a5f7a] transition-all shadow-md active:scale-95">
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <div key={index} className="bg-white text-[#1a5f7a] px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 border border-slate-200 shadow-sm transition-colors">
                  {skill}
                  <X size={14} className="cursor-pointer text-slate-400 hover:text-red-500" onClick={() => removeSkill(skill)} />
                </div>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-700 font-bold ml-2 text-sm">
              <Briefcase className="w-5 h-5 text-[#1a5f7a]" /> Career Stage
            </label>
            <div className="relative">
                <select 
                value={profileData.experienceLevel}
                onChange={(e) => setProfileData({...profileData, experienceLevel: e.target.value})}
                className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-[#1a5f7a] font-black text-[#1a5f7a] appearance-none cursor-pointer shadow-sm text-sm md:text-base"
                >
                <option value="Fresher">Fresher (Student/Newcomer)</option>
                <option value="1-3 years">Junior (1-3 years)</option>
                <option value="3-5 years">Mid-Level (3-5 years)</option>
                <option value="5+ years">Senior (5+ years)</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-400"></div>
            </div>
          </div>

          <hr className="border-slate-100 my-6" />

          {/* Action Button */}
          <button 
            onClick={handleSync}
            disabled={loading}
            className={`w-full ${loading ? 'bg-slate-300' : 'bg-gradient-to-r from-[#1a5f7a] to-[#144a5f] hover:shadow-xl'} text-white py-5 md:py-6 rounded-[2rem] font-black text-lg md:text-xl flex items-center justify-center gap-3 transition-all transform active:scale-95`}
          >
            {loading ? "SAVING..." : "SYNC CHANGES"} <CheckCircle2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;