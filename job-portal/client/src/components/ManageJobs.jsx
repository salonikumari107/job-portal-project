import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ useNavigate import karein
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Trash2, Edit, Briefcase, RefreshCw } from 'lucide-react';

const ManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // ✅ Navigate function define karein

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/jobs/my-jobs');
            if (data.success) setJobs(data.data);
        } catch (error) {
            console.error("Fetch Jobs Error:", error);
            toast.error("Jobs load nahi ho payi");
        } finally {
            setLoading(false);
        }
    };

    // --- EDIT HANDLER ---
    const handleEdit = (id) => {
        // ✅ Ye user ko edit form page par bhej dega (e.g., /recruiter/edit-job/123)
        navigate(`/recruiter/edit-job/${id}`); 
    };

    const handleToggle = async (id) => {
        try {
            const res = await api.put(`/jobs/toggle-status/${id}`);
            if (res.data.success) {
                toast.success(res.data.message);
                fetchJobs(); 
            }
        } catch (err) {
            console.error("Toggle Status Error:", err);
            toast.error("Status update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Kya aap is job ko delete karna chahte hain?")) return;
        try {
            await api.delete(`/jobs/${id}`); 
            toast.success("Job Deleted!");
            fetchJobs();
        } catch (error) {
            console.error("Frontend Delete Error:", error);
            toast.error("Delete fail ho gaya");
        }
    };

    useEffect(() => { 
        fetchJobs(); 
    }, []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-black uppercase italic flex items-center gap-3">
                    <Briefcase size={35} className="text-blue-600" /> Manage Your Nodes
                </h2>
                <button 
                    onClick={fetchJobs} 
                    className={`p-3 bg-white rounded-full border border-slate-100 text-slate-400 hover:text-blue-600 transition-all ${loading ? 'animate-spin' : ''}`}
                    disabled={loading}
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-100 p-6 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-slate-400 font-black uppercase text-[10px] tracking-widest border-b border-slate-100">
                            <th className="pb-4 px-4">Job Title</th>
                            <th className="pb-4 px-4">Location</th>
                            <th className="pb-4 px-4">Salary</th>
                            <th className="pb-4 px-4 text-center">Status</th>
                            <th className="pb-4 px-4 text-right">Management</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {jobs.map((job) => (
                            <tr key={job._id} className="hover:bg-blue-50/50 transition-all group">
                                <td className="py-5 px-4 font-bold text-slate-800 uppercase text-sm">{job.title}</td>
                                <td className="py-5 px-4 text-slate-500 font-bold text-xs uppercase">{job.location}</td>
                                <td className="py-5 px-4 text-blue-600 font-black text-xs">{job.salaryRange || 'N/A'}</td>
                                
                                <td className="py-5 px-4 text-center">
                                    <button 
                                        onClick={() => handleToggle(job._id)}
                                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic transition-all shadow-sm ${
                                            job.status === 'active' 
                                            ? 'bg-green-100 text-green-600 border border-green-200' 
                                            : 'bg-red-100 text-red-600 border border-red-200'
                                        }`}
                                    >
                                        {job.status || 'active'}
                                    </button>
                                </td>

                                <td className="py-5 px-4 flex justify-end gap-3">
                                    {/* ✅ EDIT BUTTON UPDATED */}
                                    <button 
                                        onClick={() => handleEdit(job._id)}
                                        className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(job._id)}
                                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageJobs;