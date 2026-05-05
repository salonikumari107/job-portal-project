import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; 
import JobSeekerProfile from '../components/JobSeekerProfile'; // 1. Ise import karein

const SeekerDashboard = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        {/* Profile Tab logic */}
        {activeTab === 'profile' && (
          <JobSeekerProfile data={user} setData={setUser} />
        )}

        {/* Baaki tabs */}
        {activeTab === 'dashboard' && <div className="p-10 font-black italic text-3xl">SEEKER OVERVIEW.</div>}
        {activeTab === 'applied' && <div className="p-10 font-black italic text-3xl">MY APPLICATIONS.</div>}
      </main>
    </div>
  );
};

export default SeekerDashboard;