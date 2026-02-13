import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Code, Save, Edit3, Building, GraduationCap, Plus, Trash2, CheckCircle2, FileText, Upload, Layout } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Profile = ({ role, data, setData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ 
    name: '', 
    email: '', 
    mobile: '', 
    skills: '', 
    education: [], 
    experience: [], 
    companyDetails: { name: '', website: '', description: '' },
    ...data 
  });

  useEffect(() => {
    if (data) {
      setTempData(prev => ({
        ...prev,
        ...data,
        companyDetails: {
          ...prev.companyDetails,
          ...(data.companyDetails || {})
        },
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || '')
      }));
    }
  }, [data]);

  const calculateProgress = () => {
    let totalFields = 4; // Name, Email, Mobile, Skills/Company
    let completedFields = 0;
    if (tempData.name) completedFields++;
    if (tempData.email) completedFields++;
    if (tempData.mobile) completedFields++;
    
    if (role === 'seeker') {
      if (tempData.skills) completedFields++;
      totalFields += (tempData.education?.length > 0 ? 1 : 0);
      totalFields += (tempData.experience?.length > 0 ? 1 : 0);
      completedFields += (tempData.education?.length > 0 ? 1 : 0);
      completedFields += (tempData.experience?.length > 0 ? 1 : 0);
      totalFields = 6;
    } else {
      if (tempData.companyDetails?.name) completedFields++;
      if (tempData.companyDetails?.website) completedFields++;
      totalFields = 5;
    }
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...tempData,
        skills: typeof tempData.skills === 'string' ? tempData.skills.split(',').map(s => s.trim()) : tempData.skills
      };
      const res = await api.put('/users/profile', payload);
      if (res.data.success) {
        setData(res.data.data);
        setIsEditing(false);
        toast.success(`${role.toUpperCase()} Profile Updated!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating profile");
    }
  };

  const addEducation = () => {
    setTempData({
      ...tempData,
      education: [...(tempData.education || []), { institution: '', degree: '', year: '' }]
    });
  };

  const removeEducation = (index) => {
    const newEdu = [...tempData.education];
    newEdu.splice(index, 1);
    setTempData({ ...tempData, education: newEdu });
  };

  const updateEducation = (index, field, value) => {
    const newEdu = [...tempData.education];
    newEdu[index][field] = value;
    setTempData({ ...tempData, education: newEdu });
  };

  const addExperience = () => {
    setTempData({
      ...tempData,
      experience: [...(tempData.experience || []), { company: '', position: '', duration: '' }]
    });
  };

  const removeExperience = (index) => {
    const newExp = [...tempData.experience];
    newExp.splice(index, 1);
    setTempData({ ...tempData, experience: newExp });
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...tempData.experience];
    newExp[index][field] = value;
    setTempData({ ...tempData, experience: newExp });
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-6">
        <div className="w-full md:w-auto">
          <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
            {role === 'seeker' ? 'Seeker' : 'Recruiter'} <span className="text-blue-600">Profile.</span>
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-full md:w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase">{progress}% Complete</span>
          </div>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-black text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all"
        >
          {isEditing ? <><Save size={16}/> Save Profile</> : <><Edit3 size={16}/> Edit Profile</>}
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-4">Personal Node Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Full Name" icon={<User size={18}/>} value={tempData.name} disabled={!isEditing} onChange={(val) => setTempData({...tempData, name: val})} />
            <Field label="Email Address" icon={<Mail size={18}/>} value={tempData.email} disabled={true} />
            <Field label="Mobile Number" icon={<FileText size={18}/>} value={tempData.mobile} disabled={!isEditing} onChange={(val) => setTempData({...tempData, mobile: val})} />
            {role === 'seeker' && (
              <Field label="Professional Skills" icon={<Code size={18}/>} value={tempData.skills} disabled={!isEditing} onChange={(val) => setTempData({...tempData, skills: val})} placeholder="React, Node, Figma" />
            )}
          </div>
        </div>

        {role === 'seeker' && (
          <>
            {/* Education */}
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Education Background</h3>
                {isEditing && (
                  <button onClick={addEducation} className="p-2 bg-blue-600 text-white rounded-full hover:bg-black transition-all">
                    <Plus size={16}/>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {tempData.education?.map((edu, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 relative group">
                    {isEditing && (
                      <button onClick={() => removeEducation(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2">
                        <Trash2 size={16}/>
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input placeholder="Institution" disabled={!isEditing} value={edu.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} className="p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none border-2 border-transparent focus:border-blue-100" />
                      <input placeholder="Degree" disabled={!isEditing} value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} className="p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none border-2 border-transparent focus:border-blue-100" />
                      <input placeholder="Year" disabled={!isEditing} value={edu.year} onChange={(e) => updateEducation(idx, 'year', e.target.value)} className="p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none border-2 border-transparent focus:border-blue-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Work Experience</h3>
                {isEditing && (
                  <button onClick={addExperience} className="p-2 bg-blue-600 text-white rounded-full hover:bg-black transition-all">
                    <Plus size={16}/>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {tempData.experience?.map((exp, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 relative">
                    {isEditing && (
                      <button onClick={() => removeExperience(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2">
                        <Trash2 size={16}/>
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input placeholder="Company" disabled={!isEditing} value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none border-2 border-transparent focus:border-blue-100" />
                      <input placeholder="Position" disabled={!isEditing} value={exp.position} onChange={(e) => updateExperience(idx, 'position', e.target.value)} className="p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none border-2 border-transparent focus:border-blue-100" />
                      <input placeholder="Duration" disabled={!isEditing} value={exp.duration} onChange={(e) => updateExperience(idx, 'duration', e.target.value)} className="p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none border-2 border-transparent focus:border-blue-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Management */}
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-4">Resume Repository</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tempData.resumes?.map((res, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-blue-500"/>
                      <span className="text-[10px] font-black uppercase truncate max-w-[150px]">{res.name}</span>
                    </div>
                    {res.isDefault && <CheckCircle2 size={16} className="text-green-500"/>}
                  </div>
                ))}
                <label className="border-2 border-dashed border-slate-200 p-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-white transition-all text-slate-400">
                  <Upload size={18}/>
                  <span className="text-[10px] font-black uppercase">Add New Resume</span>
                  <input type="file" id="resume-upload" className="hidden" accept=".pdf,.doc,.docx" onChange={async (e) => {
                    console.log("Input onChange triggered");
                    const file = e.target.files[0];
                    if (file) {
                      console.log("File detected:", file.name);
                      const formData = new FormData();
                      formData.append('resume', file);
                      
                      // Debugging FormData
                      for (let pair of formData.entries()) {
                        console.log('FormData entry:', pair[0], pair[1]);
                      }

                      try {
                        const res = await api.post('/users/resume', formData);
                        console.log("Upload response:", res.data);
                        if (res.data.success) {
                          setTempData({ ...tempData, resumes: res.data.data });
                          toast.success("Resume Uploaded!");
                        }
                      } catch (err) {
                        const errMsg = err.response?.data?.message || err.message || "Upload Failed";
                        toast.error(errMsg);
                        console.error("Upload error full details:", err);
                        if (err.response) {
                          console.error("Server response data:", err.response.data);
                          console.error("Server response status:", err.response.status);
                        }
                      }
                    }
                  }} />
                </label>
              </div>
            </div>
          </>
        )}

        {role === 'recruiter' && (
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-4">Company Node Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Company Name" icon={<Building size={18}/>} value={tempData.companyDetails?.name} disabled={!isEditing} onChange={(val) => setTempData({...tempData, companyDetails: {...(tempData.companyDetails || {}), name: val}})} />
              <Field label="Website" icon={<Layout size={18}/>} value={tempData.companyDetails?.website} disabled={!isEditing} onChange={(val) => setTempData({...tempData, companyDetails: {...(tempData.companyDetails || {}), website: val}})} />
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Company Description</label>
                <textarea 
                  disabled={!isEditing}
                  value={tempData.companyDetails?.description || ''}
                  onChange={(e) => setTempData({...tempData, companyDetails: {...(tempData.companyDetails || {}), description: e.target.value}})}
                  className="w-full p-5 rounded-3xl bg-white outline-none font-bold text-xs h-32 resize-none border-2 border-transparent focus:border-blue-100"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, icon, value, disabled, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-4">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
        {icon}
      </div>
      <input 
        disabled={disabled}
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-14 p-5 rounded-3xl bg-white outline-none font-bold italic disabled:opacity-60 transition-all border-2 border-transparent focus:border-blue-100"
      />
    </div>
  </div>
);

export default Profile;