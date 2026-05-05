import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import RecruiterProfile from './RecruiterProfile';
import CandidateHub from './CandidateHub'; // ✅ Import CandidateHub

const RecruiterDash = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // Default dashboard pe rakha hai

  const fetchMyJobs = () => {
    console.log("Fetching recruiter data...");
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'profile' && (
          <RecruiterProfile data={user} setData={setUser} />
        )}
        
        {/* ✅ Dashboard tab mein CandidateHub show hoga */}
        {activeTab === 'dashboard' && (
          <CandidateHub /> 
        )}

        {/* Manage Jobs wagera yahan add kar sakte hain */}
        {activeTab === 'manage' && <div className="p-10 font-black">MANAGE YOUR NODES</div>}
      </main>
    </div>
  );
};

export default RecruiterDash;