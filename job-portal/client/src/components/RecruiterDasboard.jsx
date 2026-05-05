import React, { useState } from 'react';
import axios from 'axios'; 
import { toast } from 'react-hot-toast'; 
import Sidebar from '../components/Sidebar'; 
import RecruiterProfile from '../components/RecruiterProfile';
import CandidateHub from '../components/CandidateHub'; 

const RecruiterDashboard = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5001/api/applications/status/${id}`, 
        { status: newStatus },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(`Candidate ${newStatus} successfully! Email sent.`);
        if (typeof setApplications === 'function') {
          setApplications(prev => 
            prev.map(app => 
                app._id === id ? { ...app, status: newStatus.toLowerCase() } : app
            )
          );
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
      console.error("Status Update Error:", error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        userRole="recruiter" // Pass the role correctly
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'profile' && (
          <RecruiterProfile data={user} setData={setUser} />
        )}

        {/* ✅ FIXED: Changed 'applications' to 'candidate-dash' to match Sidebar.jsx */}
        {activeTab === 'candidate-dash' && (
          <CandidateHub 
            handleStatusUpdate={handleStatusUpdate} 
            applications={applications} 
            setApplications={setApplications} 
          /> 
        )}

        {activeTab === 'dashboard' && (
          <div className="p-10">
            <h1 className="font-black italic text-3xl mb-6 text-slate-900">RECRUITER STATS.</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Active Apps</p>
                    <p className="text-4xl font-black mt-2">{applications?.length || 0}</p>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'manage-jobs' && (
          <div className="p-10 font-black italic text-3xl text-slate-900">MANAGE JOBS.</div>
        )}
      </main>
    </div>
  );
};

export default RecruiterDashboard;