import React, { useState, useEffect } from 'react';
import { 
    Pencil, Save, FileText, Eye, Trash2, 
    UploadCloud, Github, Linkedin, ExternalLink,
    MapPin, Mail, Phone, Briefcase
} from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const JobSeekerProfile = ({ profileData, setProfileData }) => {
    const [isEditing, setIsEditing] = useState(false);
    // Initialize state directly from profileData
    const [tempData, setTempData] = useState(profileData || {});
    
    const BASE_URL = "http://localhost:8001";

    // ✅ FIXED: Cascading Render Logic
    // Sirf tabhi update karein jab profileData sach mein badla ho (Deep Comparison)
    useEffect(() => {
        if (profileData && JSON.stringify(profileData) !== JSON.stringify(tempData)) {
            setTempData(profileData);
        }
    }, [profileData]);

    const handleSync = async () => {
        try {
            const skillsArray = typeof tempData.skills === 'string' 
                ? tempData.skills.split(',').map(s => s.trim()).filter(Boolean) 
                : (tempData.skills || []);

            const res = await api.put('/auth/profile', { ...tempData, skills: skillsArray });
            
            if (res.data.success) {
                setProfileData(res.data.user);
                setIsEditing(false);
                toast.success("Profile Updated Successfully!");
            }
        } catch (error) {
            console.error("Sync Error:", error);
            toast.error("Sync failed. Check your connection.");
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            return toast.error("File size should be less than 5MB");
        }

        const formData = new FormData();
        formData.append('resume', file);
        const loadingToast = toast.loading("Uploading to Vault...");

        try {
            const res = await api.post('/auth/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (res.data.success) {
                const updatedUser = res.data.user;
                setProfileData(updatedUser);
                setTempData(updatedUser); 
                toast.success("Resume Synced!", { id: loadingToast });
            }
        } catch (err) {
            console.error("Upload Error:", err);
            toast.error(err.response?.data?.message || "Upload failed", { id: loadingToast });
        }
    };

    const handleDeleteResume = async () => {
        if (!window.confirm("Are you sure you want to delete your resume?")) return;
        
        const deleteToast = toast.loading("Removing resume...");
        try {
            const res = await api.delete('/auth/resume/default');
            if (res.data.success) {
                const updated = { ...profileData, resume: null, resumes: [] };
                setProfileData(updated);
                setTempData(updated);
                toast.success("Resume Removed", { id: deleteToast });
            }
        } catch (err) { 
            console.error("Delete Error:", err);
            toast.error("Action failed", { id: deleteToast }); 
        }
    };

    // Resume visibility logic
    const currentResume = tempData?.resume || profileData?.resume || 
                         (tempData?.resumes?.length > 0 ? `uploads/resumes/${tempData.resumes[tempData.resumes.length - 1].url}` : null);

    const hasResume = Boolean(currentResume);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* --- TOP IDENTITY CARD --- */}
            <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                    <div className="h-32 w-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-100 shrink-0">
                        {tempData?.name?.charAt(0) || "U"}
                    </div>

                    <div className="space-y-4 w-full text-center md:text-left">
                        <div className="space-y-1">
                            {isEditing ? (
                                <input 
                                    className="text-3xl font-black border-b-4 border-blue-500 outline-none w-full max-w-md bg-slate-50 px-2 rounded-t-lg" 
                                    value={tempData.name || ""} 
                                    onChange={e => setTempData({...tempData, name: e.target.value})} 
                                />
                            ) : (
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{tempData.name || "Set Name"}</h1>
                            )}
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                                {isEditing ? (
                                    <select 
                                        className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase border-none outline-none cursor-pointer"
                                        value={tempData.role || "fresher"}
                                        onChange={e => setTempData({...tempData, role: e.target.value})}
                                    >
                                        <option value="fresher">Fresher</option>
                                        <option value="experienced">Experienced</option>
                                    </select>
                                ) : (
                                    <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                        {tempData.role || "Fresher"}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <Briefcase size={18} className="text-blue-500 shrink-0"/>
                            {isEditing ? (
                                <input 
                                    className="text-sm font-bold text-blue-600 uppercase tracking-widest border-b border-slate-200 outline-none w-full max-w-sm bg-slate-50 p-1"
                                    value={tempData.title || ""}
                                    onChange={e => setTempData({...tempData, title: e.target.value})}
                                    placeholder="e.g. FULL STACK WEB DEVELOPER"
                                />
                            ) : (
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest leading-none">
                                    {tempData.title || "Add Professional Title"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => isEditing ? handleSync() : setIsEditing(true)} 
                    className={`whitespace-nowrap px-12 py-5 rounded-[2rem] font-black transition-all flex items-center justify-center gap-3 shadow-2xl ${isEditing ? 'bg-green-500 text-white shadow-green-100 scale-105' : 'bg-black text-white hover:bg-blue-600 shadow-slate-200'}`}
                >
                    {isEditing ? <Save size={24}/> : <Pencil size={20}/>} 
                    {isEditing ? "SYNC NOW" : "EDIT PROFILE"}
                </button>
            </div>

            {/* --- CONTACT BAR --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { icon: Mail, key: 'email', placeholder: 'Email Address' },
                    { icon: Phone, key: 'phone', placeholder: 'Phone Number' },
                    { icon: MapPin, key: 'location', placeholder: 'City, Country' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4">
                        <div className="p-2 bg-slate-50 rounded-xl text-blue-600">
                            <item.icon size={20} />
                        </div>
                        <input 
                            disabled={!isEditing}
                            className="bg-transparent w-full outline-none text-sm font-bold text-slate-700 disabled:opacity-70"
                            value={tempData[item.key] || ""}
                            onChange={e => setTempData({...tempData, [item.key]: e.target.value})}
                            placeholder={item.placeholder}
                        />
                    </div>
                ))}
            </div>

            {/* --- RESUME SECTION --- */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1 rounded-[3rem]">
                <div className="bg-white p-8 rounded-[2.8rem] border-4 border-white shadow-inner flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className={`p-5 rounded-[1.5rem] shadow-lg ${hasResume ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                            <FileText size={40} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 uppercase text-lg tracking-tight">Resume Vault</h3>
                            <p className="text-sm text-slate-500 font-medium">
                                {hasResume ? "Your blueprint is synced and visible to recruiters." : "Enhance your profile by uploading your latest CV."}
                            </p>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-auto">
                        {hasResume ? (
                            <div className="flex items-center gap-3">
                                <a 
                                    href={`${BASE_URL}/${currentResume}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex-1 md:flex-none bg-black text-white px-10 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase hover:bg-blue-700 transition-all shadow-xl shadow-slate-200"
                                >
                                    <Eye size={18}/> View Resume
                                </a>
                                <button 
                                    onClick={handleDeleteResume}
                                    className="p-4 bg-red-100 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all group"
                                    title="Delete Resume"
                                >
                                    <Trash2 size={20} className="group-hover:scale-110 transition-transform"/>
                                </button>
                            </div>
                        ) : (
                            <label className="w-full md:w-auto bg-blue-600 text-white px-12 py-5 rounded-[2rem] cursor-pointer flex items-center justify-center gap-3 font-black text-xs uppercase hover:bg-black transition-all shadow-2xl shadow-blue-200 active:scale-95">
                                <UploadCloud size={22}/> Sync Resume
                                <input type="file" className="hidden" onChange={handleResumeUpload} accept=".pdf" />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            {/* --- SKILLS & SUMMARY --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                        <h4 className="font-black border-b pb-4 flex items-center gap-3 text-slate-900 text-sm tracking-widest uppercase">
                            <ExternalLink size={20} className="text-blue-500"/> Connect Handles
                        </h4>
                        <div className="space-y-4">
                            {[
                                { icon: Github, key: 'githubUrl', label: 'Github Profile' },
                                { icon: Linkedin, key: 'linkedinUrl', label: 'LinkedIn Profile' }
                            ].map((social) => (
                                <div key={social.key} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-transparent focus-within:border-blue-200 transition-all">
                                    <social.icon size={22} className={social.key === 'githubUrl' ? 'text-slate-800' : 'text-blue-600'}/>
                                    <input 
                                        disabled={!isEditing} 
                                        className="bg-transparent w-full outline-none text-xs font-bold text-slate-600 placeholder:text-slate-300" 
                                        value={tempData[social.key] || ""} 
                                        onChange={e => setTempData({...tempData, [social.key]: e.target.value})} 
                                        placeholder={social.label} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                        <h4 className="font-black text-slate-900 text-sm tracking-widest uppercase flex items-center gap-2">
                            Technical Arsenal
                        </h4>
                        {isEditing ? (
                            <textarea 
                                className="w-full p-6 bg-slate-50 rounded-3xl outline-none border-2 border-transparent focus:border-blue-400 font-bold text-blue-600 placeholder:font-normal leading-relaxed shadow-inner" 
                                value={Array.isArray(tempData.skills) ? tempData.skills.join(', ') : (tempData.skills || "")} 
                                onChange={e => setTempData({...tempData, skills: e.target.value})} 
                                placeholder="React, Node.js, MongoDB, Tailwind, Docker..." 
                                rows="3"
                            />
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {(Array.isArray(tempData.skills) ? tempData.skills : (tempData.skills?.split(',') || [])).map((s, i) => s && (
                                    <span key={i} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[11px] font-black tracking-widest shadow-lg shadow-slate-100 hover:bg-blue-600 transition-colors cursor-default uppercase">
                                        {s.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                        <h4 className="font-black text-slate-900 text-sm tracking-widest uppercase">Professional Summary</h4>
                        <textarea 
                            disabled={!isEditing} 
                            className="w-full h-40 p-6 bg-slate-50 rounded-[2rem] outline-none resize-none font-medium text-slate-600 leading-relaxed focus:bg-white border-2 border-transparent focus:border-blue-100 transition-all disabled:bg-slate-50/50" 
                            value={tempData.summary || ""} 
                            onChange={e => setTempData({...tempData, summary: e.target.value})} 
                            placeholder="Introduce yourself and your career goals to recruiters..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSeekerProfile;