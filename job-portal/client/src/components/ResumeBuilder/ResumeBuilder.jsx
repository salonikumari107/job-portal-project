import React, { useState } from 'react';
import ResumeTemplate from './ResumeTemplate';
import api from "../../api/axios";
import { toast } from 'react-hot-toast';

const ResumeBuilder = () => {
  const [theme, setTheme] = useState('white');
  const [resumeData, setResumeData] = useState({
    fullName: '', role: '', email: '', phone: '', location: '', linkedin: '', github: '',
    objective: '', skills: '', achievements: '', projects: '',
    isFresher: true, experienceDetails: '',
    declaration: '',
    educationList: [{ course: '', institute: '', year: '', scoreType: 'CGPA', score: '' }]
  });

  // --- 1. CLEAN DOWNLOAD HANDLER ---
  // Isme se saari AI sync aur loading logic hata di gayi hai
  const handleDownloadOnly = () => {
    // Seedhe window.print() trigger hoga jaise hi button click hoga
    window.print();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setResumeData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEduChange = (index, e) => {
    const { name, value } = e.target;
    const newList = [...resumeData.educationList];
    newList[index][name] = value;
    setResumeData(prev => ({ ...prev, educationList: newList }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      educationList: [...prev.educationList, { course: '', institute: '', year: '', scoreType: 'CGPA', score: '' }]
    }));
  };

  const removeEducation = (index) => {
    if (resumeData.educationList.length > 1) {
      const newList = resumeData.educationList.filter((_, i) => i !== index);
      setResumeData(prev => ({ ...prev, educationList: newList }));
    }
  };

  return (
    <>
      <style>
        {`
          @media print {
            body { background: white !important; margin: 0 !important; padding: 0 !important; }
            .no-print { display: none !important; }
            #printable-resume { 
              visibility: visible !important; 
              position: absolute; 
              left: 0; 
              top: 0; 
              width: 100% !important; 
              margin: 0 auto !important;
              padding: 10mm !important;
              border: none !important;
              box-shadow: none !important;
            }
            @page { size: A4; margin: 0; }
          }
        `}
      </style>

      <div className={`flex flex-col lg:flex-row p-4 gap-6 min-h-screen transition-colors duration-500 
        ${theme === 'glass' ? 'bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500' : 'bg-slate-100'}`}>
        
        {/* Input Form Panel */}
        <div className="w-full lg:w-2/5 bg-white/95 backdrop-blur-lg p-6 rounded-[2rem] shadow-2xl h-[90vh] overflow-y-auto no-print custom-scrollbar border border-white/40">
          <h2 className="text-2xl font-black mb-4 text-indigo-900 tracking-tighter italic border-b pb-2 text-center">Resume Architect</h2>
          
          <div className="space-y-4">
            <section className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-indigo-800 uppercase tracking-widest">Experience Status</span>
                <button onClick={() => setResumeData(p => ({...p, isFresher: !p.isFresher}))} className={`px-4 py-1 rounded-full text-[9px] font-bold transition-all ${resumeData.isFresher ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'}`}>
                  {resumeData.isFresher ? "FRESHER" : "EXPERIENCED"}
                </button>
              </div>
              <div className="space-y-2">
                 <input name="fullName" placeholder="Full Name" value={resumeData.fullName} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-100 text-xs outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm" />
                 <input name="role" placeholder="Role (e.g. Full Stack Developer)" value={resumeData.role} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-100 text-xs outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm" />
              </div>
            </section>

            <section className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input name="email" placeholder="Email Address" value={resumeData.email} onChange={handleChange} className="p-2.5 rounded-xl border border-gray-100 text-xs outline-none" />
                <input name="phone" placeholder="Mobile Number" value={resumeData.phone} onChange={handleChange} className="p-2.5 rounded-xl border border-gray-100 text-xs outline-none" />
              </div>
              <input name="linkedin" placeholder="LinkedIn Profile URL" value={resumeData.linkedin} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-100 text-xs outline-none bg-blue-50/20" />
              <input name="github" placeholder="GitHub Profile URL" value={resumeData.github} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-100 text-xs outline-none bg-gray-50/20" />
              <input name="location" placeholder="Address (City, State)" value={resumeData.location} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-100 text-xs outline-none" />
            </section>

            <textarea name="objective" placeholder="Professional Summary..." value={resumeData.objective} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-100 h-20 text-xs outline-none shadow-sm" />

            <section className="space-y-4 pt-2 border-t">
              <label className="text-[11px] font-black uppercase text-indigo-500 flex justify-between items-center">
                Education Details
                <button onClick={addEducation} className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] hover:bg-indigo-700 transition-colors">+ Add</button>
              </label>
              {resumeData.educationList.map((edu, idx) => (
                <div key={idx} className="relative p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-100 group">
                  {resumeData.educationList.length > 1 && (
                    <button onClick={() => removeEducation(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] shadow-md opacity-100 transition-opacity">✕</button>
                  )}
                  <input name="course" placeholder="Degree/Course" value={edu.course} onChange={(e) => handleEduChange(idx, e)} className="w-full p-1.5 text-xs border-b bg-transparent outline-none" />
                  <input name="institute" placeholder="College/School Name" value={edu.institute} onChange={(e) => handleEduChange(idx, e)} className="w-full p-1.5 text-xs border-b bg-transparent outline-none" />
                  <div className="flex gap-2">
                    <input name="year" placeholder="Year" value={edu.year} onChange={(e) => handleEduChange(idx, e)} className="w-1/3 p-1.5 text-xs border-b bg-transparent outline-none" />
                    <select name="scoreType" value={edu.scoreType} onChange={(e) => handleEduChange(idx, e)} className="w-1/3 p-1.5 text-xs border-b bg-transparent outline-none text-gray-500">
                      <option value="CGPA">CGPA</option>
                      <option value="Percentage">Percentage</option>
                    </select>
                    <input name="score" placeholder="Score" value={edu.score} onChange={(e) => handleEduChange(idx, e)} className="w-1/3 p-1.5 text-xs border-b bg-transparent outline-none" />
                  </div>
                </div>
              ))}
            </section>

            <div>
              <label className="text-[10px] font-black uppercase text-indigo-500">Technical Skills (Comma separated)</label>
              <textarea name="skills" placeholder="React, Node.js, MongoDB..." value={resumeData.skills} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-100 h-20 text-xs outline-none shadow-sm" />
            </div>
            
            <textarea name="projects" placeholder="Project Details..." value={resumeData.projects} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-100 h-20 text-xs outline-none shadow-sm" />
            
            {!resumeData.isFresher && (
               <textarea name="experienceDetails" placeholder="Experience details..." value={resumeData.experienceDetails} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-100 h-20 text-xs outline-none shadow-sm" />
            )}

            <textarea name="achievements" placeholder="Achievements..." value={resumeData.achievements} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-100 h-20 text-xs outline-none shadow-sm" />
            <textarea name="declaration" placeholder="Custom Declaration..." value={resumeData.declaration} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-100 h-20 text-xs outline-none bg-yellow-50/20 shadow-sm" />

            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white/95 py-2">
              <button onClick={() => setTheme('white')} className={`flex-1 py-3 rounded-xl font-bold text-[10px] ${theme === 'white' ? 'bg-black text-white' : 'bg-gray-200'}`}>Modern White</button>
              <button onClick={() => setTheme('glass')} className={`flex-1 py-3 rounded-xl font-bold text-[10px] ${theme === 'glass' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Glass UI</button>
              
              {/* ✅ CLEAN BUTTON: No loading, no AI sync */}
              <button 
                onClick={handleDownloadOnly} 
                className="px-5 py-3 bg-green-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg hover:bg-green-700 transition-all"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="w-full lg:w-3/5 flex justify-center p-2 overflow-y-auto h-[90vh] bg-gray-200/50 rounded-3xl">
          <ResumeTemplate data={resumeData} theme={theme} />
        </div>
      </div>
    </>
  );
};

export default ResumeBuilder;