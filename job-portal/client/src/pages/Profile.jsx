import React from 'react';
import { User, CheckCircle2 } from 'lucide-react';

const Profile = ({ profileData, setProfileData }) => {
  return (
    <div className="max-w-3xl mx-auto p-10">
      <div className="bg-white p-10 rounded-[3rem] border shadow-xl">
        <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 bg-[#1a5f7a] rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-3xl font-black text-slate-800">Complete Profile</h2>
        </div>

        <div className="space-y-6">
          <input 
            value={profileData.name} 
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            className="w-full p-5 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 ring-[#1a5f7a]"
            placeholder="Full Name"
          />
          <button className="w-full bg-[#1a5f7a] text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl">
            SAVE & PUBLISH <CheckCircle2 />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- DEFAULT EXPORT ---
export default Profile;