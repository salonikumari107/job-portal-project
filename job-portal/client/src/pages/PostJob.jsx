import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PostJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        description: '',
        location: '',
        salaryRange: '',
        skillsRequired: '', 
        jobType: 'Full-Time Job',
        experienceLevel: 'Fresher' // Simplified for backend matching
    });

    // --- 1. FETCH DATA FOR EDIT MODE ---
    useEffect(() => {
        if (isEditMode) {
            const fetchJob = async () => {
                try {
                    const { data } = await api.get(`/jobs/${id}`);
                    if (data.success) {
                        const job = data.data;
                        setFormData({
                            title: job.title || '',
                            companyName: job.company || job.companyName || '', 
                            description: job.description || '',
                            location: job.location || '',
                            salaryRange: job.salaryRange || '',
                            skillsRequired: Array.isArray(job.skillsRequired) ? job.skillsRequired.join(', ') : '',
                            jobType: job.jobType || 'Full-Time Job',
                            experienceLevel: job.experienceLevel || 'Fresher'
                        });
                    }
                } catch (error) {
                    console.error("Orbit Fetch Error:", error);
                    toast.error("Job details load nahi ho payi");
                }
            };
            fetchJob();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- 2. UPDATED SUBMISSION LOGIC ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Basic Validation
        if (!formData.description || formData.description.trim().length < 10) {
            return toast.error("Description kam se kam 10 characters ki honi chahiye.");
        }

        // 2. Skills Formatting
        const finalSkills = formData.skillsRequired 
            ? formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s !== "") 
            : [];

        if (finalSkills.length === 0) {
            return toast.error("Kam se kam ek skill zaroori hai.");
        }

        // ✅ FINAL PAYLOAD MAPPING (Backend compatibility fixed)
        const payload = {
            title: formData.title.trim(),
            company: formData.companyName.trim(), // Backend expects 'company'
            companyName: formData.companyName.trim(), // Fallback for some routes
            description: formData.description.trim(),
            location: formData.location.trim(),
            salaryRange: formData.salaryRange,
            skillsRequired: finalSkills,
            jobType: formData.jobType,
            experienceLevel: formData.experienceLevel
        };

        console.log("Orbit Deploying Payload:", payload);

        try {
            let response;
            if (isEditMode) {
                response = await api.put(`/jobs/${id}`, payload);
            } else {
                response = await api.post('/jobs', payload);
            }

            if (response.data.success) {
                toast.success(isEditMode ? "Broadcast Updated! 🚀" : "Broadcast Deployed! 🚀");
                navigate('/recruiter/manage-jobs');
            }
        } catch (error) {
            // "WhatsApp Image 2026-05-01 at 6.49.32 PM.jpeg" mein dikh raha hai error details yahan print honge
            console.error("Orbit Error Details:", error.response?.data);
            const errorMsg = error.response?.data?.message || "Operation failed. Server error.";
            toast.error(errorMsg);
        }
    };

    return (
        <div className="p-8">
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                {/* Left Side: Main Content */}
                <div className="flex-1 space-y-6">
                    <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
                        {isEditMode ? "Modifying Active Node" : "Initializing New Node"}
                    </h1>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 block">Opportunity Title</label>
                        <input 
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. MERN Stack Developer"
                            className="w-full text-2xl font-bold border-none outline-none placeholder:text-slate-200"
                            required
                        />
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 block">Required Skills (Comma Separated)</label>
                        <input 
                            name="skillsRequired"
                            value={formData.skillsRequired}
                            onChange={handleChange}
                            placeholder="e.g. React, Node.js, MongoDB"
                            className="w-full text-xl font-bold border-none outline-none placeholder:text-slate-200"
                            required
                        />
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 block">Company Name</label>
                        <input 
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="e.g. Orbit Tech"
                            className="w-full text-xl font-bold border-none outline-none placeholder:text-slate-200"
                            required
                        />
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 block">Detailed Mission Brief</label>
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe roles, responsibilities and requirements..."
                            rows={6}
                            className="w-full text-lg font-medium border-none outline-none resize-none placeholder:text-slate-200"
                            required
                        />
                    </div>
                </div>

                {/* Right Side: Configuration */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 block">Configuration</label>
                        <select 
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                            className="w-full p-3 bg-slate-50 rounded-xl font-bold text-xs outline-none border border-slate-100"
                        >
                            <option value="Full-Time Job">Full-Time Job</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                        </select>
                        <select 
                            name="experienceLevel"
                            value={formData.experienceLevel}
                            onChange={handleChange}
                            className="w-full p-3 bg-slate-50 rounded-xl font-bold text-xs outline-none border border-slate-100"
                        >
                            <option value="Fresher">Fresher / Entry Level</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Senior Expert">Senior Expert</option>
                        </select>
                    </div>

                    <div className="bg-[#1e222d] p-6 rounded-[2rem] shadow-xl space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Location & Budget</label>
                        <input 
                            name="salaryRange"
                            value={formData.salaryRange}
                            onChange={handleChange}
                            placeholder="Budget (e.g. 5 lpa)"
                            className="w-full p-4 bg-white/5 rounded-xl text-white font-bold placeholder:text-slate-500 outline-none"
                        />
                        <input 
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Location (e.g. Patna)"
                            className="w-full p-4 bg-white/5 rounded-xl text-white font-bold placeholder:text-slate-500 outline-none"
                            required
                        />
                        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">
                            {isEditMode ? "Update Broadcast" : "Deploy Broadcast"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostJob;