import React, { useState } from 'react';
import { 
  User, CheckCircle2, Plus, X, 
  AlignLeft, Zap, FileText, Eye, Trash2, UploadCloud, Phone 
} from 'lucide-react';
import api, { BASE_URL } from '../api/axios';
import toast from 'react-hot-toast';

const Profile = ({ profileData, setProfileData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  // --- 1. SKILLS LOGIC ---
  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData?.skills?.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...(profileData?.skills || []), newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: (profileData?.skills || []).filter(s => s !== skillToRemove)
    });
  };

  // --- 2. RESUME VAULT LOGIC ---
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    const loadingToast = toast.loading("Uploading resume to Orbit...");
    try {
      const res = await api.post('/auth/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success("Resume Vault Updated!", { id: loadingToast });
        setProfileData({ ...profileData, resume: res.data.resumePath || res.data.resume });
      }
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error("Upload failed", { id: loadingToast });
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm("Are you sure you want to remove your resume?")) return;
    const loadingToast = toast.loading("Removing resume...");
    try {
      const res = await api.delete('/auth/delete-resume');
      if (res.data.success) {
        toast.success("Resume Removed", { id: loadingToast });
        setProfileData({ ...profileData, resume: null });
      }
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Delete failed", { id: loadingToast });
    }
  };

  // --- 3. PROFILE SYNC LOGIC (The Fix) ---
  const handleSave = async () => {
    const loadingToast = toast.loading("Syncing with Orbit...");
    try {
      // Dono keys bhej rahe hain backend compatibility ke liye
      const payload = {
        ...profileData,
        phoneNumber: profileData.mobile || profileData.phoneNumber
      };
      
      const res = await api.put('/auth/profile', payload);
      
      if (res.data.success) {
        toast.success("Profile Updated!", { id: loadingToast });
        
        // 🚨 Yahan backend se aaya fresh data (updatedUser) state mein dal rahe hain
        // Taki UI turant naya number show kare
        const updatedUser = res.data.user || res.data.data;
        setProfileData(updatedUser); 
        
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Update Failed:", err);
      toast.error(err.response?.data?.message || "Update Failed", { id: loadingToast });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8 text-left">
      {/* Identity Card */}
      <div className="bg-white p-10 rounded-[3rem] border shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shrink-0">
            <User size={40} strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
              {profileData?.name || "User"}
            </h1>
            <p className="text-slate-400 font-bold tracking-widest text-xs uppercase mt-2">
              {profileData?.email}
            </p>
            {/* DISPLAY PHONE NUMBER: Dono fields check kar rahe hain */}
            <p className="text-blue-600 font-bold text-sm mt-1 flex items-center gap-2">
               <Phone size={14}/> {profileData?.mobile || profileData?.phoneNumber || "No Phone Linked"}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
        >
          Edit Profile
        </button>
      </div>

      {/* Resume Vault Section */}
      <div className="bg-white p-8 rounded-[3rem] border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Resume Vault</h3>
            <p className="text-xs text-slate-400 font-medium">
              {profileData?.resume ? "Your resume is active." : "No resume uploaded yet."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {profileData?.resume ? (
            <>
              <a href={`${BASE_URL}/${profileData.resume}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs uppercase hover:bg-slate-200 transition-all">
                <Eye size={16} /> View
              </a>
              <button onClick={handleDeleteResume} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all">
                <Trash2 size={18} />
              </button>
            </>
          ) : (
            <label className="cursor-pointer flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-blue-700 transition-all shadow-md">
              <UploadCloud size={16} /> Upload Resume
              <input type="file" className="hidden" onChange={handleResumeUpload} accept=".pdf,.doc,.docx" />
            </label>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-10 rounded-[3rem] border shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <AlignLeft size={16} className="text-blue-600"/> Professional Summary
          </h3>
          <p className="text-slate-600 font-medium leading-relaxed italic">
            {profileData?.summary || "Write about your journey..."}
          </p>
        </div>

        <div className="bg-[#f8faff] p-10 rounded-[3rem] border border-blue-50 shadow-inner">
          <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <Zap size={16} fill="currentColor"/> AI Core Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {profileData?.skills?.map((skill, index) => (
              <span key={index} className="bg-white text-slate-800 px-4 py-2 rounded-xl font-black text-[10px] uppercase border shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 text-left">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl p-10 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-300 hover:text-red-500">
              <X size={30} />
            </button>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Update Profile</h2>
            
            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
                <input 
                  type="text"
                  value={profileData?.mobile || profileData?.phoneNumber || ""}
                  onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value, mobile: e.target.value})}
                  className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border-none focus:ring-2 ring-blue-600"
                  placeholder="Enter phone number..."
                />
              </div>

              {/* Summary Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Professional Summary</label>
                <textarea 
                  value={profileData?.summary || ""}
                  onChange={(e) => setProfileData({...profileData, summary: e.target.value})}
                  className="w-full p-6 bg-slate-50 rounded-[2rem] border-none font-medium outline-none focus:ring-2 ring-blue-600"
                  placeholder="Describe your journey..."
                  rows="3"
                />
              </div>
              
              {/* Skills Input */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Skills</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData?.skills?.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-xl font-bold text-xs uppercase border border-blue-100">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="flex-1 p-5 bg-slate-50 rounded-2xl font-bold outline-none border-none focus:ring-2 ring-blue-600"
                    placeholder="Add a skill..."
                  />
                  <button onClick={handleAddSkill} className="bg-black text-white p-5 rounded-2xl hover:bg-blue-600 transition-colors">
                    <Plus/>
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full mt-10 bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl hover:bg-blue-700 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              Sync Changes <CheckCircle2 size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;