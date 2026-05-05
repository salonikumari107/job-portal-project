import React, { useEffect, useCallback, useState } from 'react';
import api from '../api/axios'; 
import { FiRefreshCw, FiCheckCircle, FiXCircle, FiUser, FiFileText } from 'react-icons/fi';
import { toast } from 'react-hot-toast'; 

const CandidateHub = () => {
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null); 
    const [localApplications, setLocalApplications] = useState([]); 

    const fetchApps = useCallback(async () => {
        if (loading) return; 
        setLoading(true);
        try {
            const res = await api.get('/application/recruiter/get'); 
            if (res.data && res.data.success) {
                const fetchedData = res.data.applications || res.data.data || [];
                setLocalApplications(fetchedData);
            }
        } catch (err) {
            console.error("❌ Fetch Error:", err.response?.data || err.message);
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        fetchApps();
    }, []); 

   const onUpdate = async (id, status) => {
    console.log("🟢 1. Clicked Status Update:", { id, status }); // Check if button works

    try {
        setUpdatingId(id); 
        console.log("🟡 2. Sending Request to Backend...");
        
        // Agar aapka backend base URL sahi hai, to ye trigger hona chahiye
        const response = await api.post(`/application/status/${id}/update`, { status });
        
        console.log("✅ 3. Backend Response:", response.data);

        if (response.data.success) {
            toast.success(`Candidate ${status === 'accepted' ? 'Accepted' : 'Rejected'}`);
            fetchApps(); 
        }
    } catch (err) {
        console.error("❌ 4. Update Error Details:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
        });
        toast.error(err.response?.data?.message || "Status update failed");
    } finally {
        setUpdatingId(null);
        console.log("⚪ 5. Update Cycle Finished.");
    }
};

    const openResume = (e, app) => {
        e.preventDefault(); 
        e.stopPropagation(); 

        const resumePath = app.resume || app.user?.resume || app.applicant?.resume || app.resumeUrl;

        if (resumePath) {
            let finalUrl;
            if (resumePath.startsWith('http')) {
                finalUrl = resumePath;
            } else {
                const cleanPath = resumePath.startsWith('/') ? resumePath.substring(1) : resumePath;
                const hasResumesFolder = cleanPath.includes('resumes/');
                
                if (hasResumesFolder) {
                    finalUrl = `http://localhost:8000/uploads/${cleanPath}`;
                } else {
                    finalUrl = `http://localhost:8000/uploads/resumes/${cleanPath}`;
                }
            }
            
            console.log("🚀 Opening Resume URL:", finalUrl);
            window.open(finalUrl, '_blank', 'noopener,noreferrer');
        } else {
            toast.error("Resume not found for this candidate");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen text-left font-sans">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                        Candidate Hub<span className="text-blue-600">.</span>
                    </h2>
                    <div className="flex items-center gap-3 mt-3">
                        <span className={`flex h-2 w-2 rounded-full ${loading ? 'bg-blue-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            Live Stream | {localApplications.length} Candidates Found
                        </p>
                    </div>
                </div>
                <button 
                    onClick={fetchApps} 
                    className="group flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest bg-white shadow-sm border border-slate-100 text-slate-600 transition-all hover:bg-slate-50"
                    disabled={loading}
                >
                    <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} size={16} />
                    {loading ? "Syncing..." : "Refresh Feed"}
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="p-8 text-slate-400 text-[10px] font-black uppercase tracking-widest">Applicant</th>
                                <th className="p-8 text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">Resume</th>
                                <th className="p-8 text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                                <th className="p-8 text-slate-400 text-[10px] font-black uppercase tracking-widest text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {localApplications.length > 0 ? (
                                localApplications.map((app) => {
                                    const hasResume = app.resume || app.user?.resume || app.applicant?.resume || app.resumeUrl;
                                    
                                    return (
                                        <tr key={app._id} className="hover:bg-blue-50/20 transition-colors group">
                                            <td className="p-8">
                                                <div className="flex items-center gap-4 text-left">
                                                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                                        <FiUser size={20} />
                                                    </div>
                                                    {/* Updated Applicant Info with Email */}
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800 text-lg tracking-tight">
                                                            {app.user?.name || app.applicant?.name || "Name Not Loaded"}
                                                        </span>
                                                        <span className="text-blue-500 text-xs font-semibold">
                                                            {app.user?.email || app.applicant?.email || "Email N/A"}
                                                        </span>
                                                        <span className="text-slate-400 text-[10px] font-medium uppercase tracking-wider mt-0.5">
                                                            {app.job?.title || "Role N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td className="p-8 text-center">
                                                {hasResume ? (
                                                    <button 
                                                        onClick={(e) => openResume(e, app)} 
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm"
                                                    >
                                                        <FiFileText size={16} /> View Resume / CV
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-300 text-[10px] uppercase font-bold italic">No Resume Uploaded</span>
                                                )}
                                            </td>

                                            <td className="p-8 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                    app.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                    {app.status === 'pending' ? 'APPLIED' : app.status}
                                                </span>
                                            </td>

                                            <td className="p-8">
                                                <div className="flex justify-end gap-3">
                                                    <button 
                                                        onClick={() => onUpdate(app._id, 'accepted')} 
                                                        disabled={updatingId === app._id}
                                                        className={`p-3 transition-colors ${app.status === 'accepted' ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-600'}`}
                                                        title="Accept Candidate"
                                                    >
                                                        <FiCheckCircle size={22}/>
                                                    </button>
                                                    <button 
                                                        onClick={() => onUpdate(app._id, 'rejected')} 
                                                        disabled={updatingId === app._id}
                                                        className={`p-3 transition-colors ${app.status === 'rejected' ? 'text-rose-500' : 'text-slate-400 hover:text-rose-600'}`}
                                                        title="Reject Candidate"
                                                    >
                                                        <FiXCircle size={22}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-32 text-center text-slate-400 uppercase text-xs font-bold tracking-widest">
                                        No Applications Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CandidateHub;