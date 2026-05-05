import React from 'react';
import { NavLink } from 'react-router-dom'; // ✅ NavLink import kiya
import { User, Layout, Heart, ClipboardList, PlusCircle, LogOut, Briefcase, X, FileText, Settings, Map } from 'lucide-react';

// ✅ SidebarBtn ko NavLink ke saath update kiya taaki active state automatic handle ho
const SidebarBtn = ({ to, label, icon, savedCount, id }) => {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `
        w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300
        ${isActive 
          ? 'bg-black text-white shadow-xl shadow-slate-200 translate-x-2' 
          : 'text-slate-400 hover:bg-slate-50 hover:text-black'}
      `}
    >
      {/* Saved Nodes ke liye icon logic */}
      {id === 'wishlist' ? (
        <Heart size={18} className={savedCount > 0 ? "text-red-500 fill-red-500" : ""} />
      ) : icon}
      
      {label}
    </NavLink>
  );
};

const Sidebar = ({ userRole, onLogout, savedCount, isOpen, onClose }) => {
  const role = userRole?.toString().toLowerCase().trim();
  
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-all"
          onClick={onClose}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-72 h-full bg-white border-r border-slate-100 flex flex-col p-8 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        
        <div className="flex justify-between items-start mb-16 px-4">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-black">
            Job Orbit<span className="text-blue-600">.</span>
          </h1>
          <button onClick={onClose} className="md:hidden p-2 rounded-full hover:bg-slate-100 text-slate-400">
            <X size={20}/>
          </button>
        </div>
        
        <nav className="flex-1 space-y-2">
          {/* Default Profile Link */}
          <SidebarBtn 
            to="/profile"
            label="My Profile" 
            icon={<User size={18}/>} 
          />

          {/* Job Seeker Tabs */}
          {(role === 'seeker' || role === 'jobseeker') && (
            <>
              <SidebarBtn 
                to="/universe"
                label="Find Job" 
                icon={<Layout size={18}/>} 
              />

              <SidebarBtn 
                to="/job-map"
                label="Job Map 🌍" 
                icon={<Map size={18}/>} 
              />
              
              <SidebarBtn 
                to="/saved"
                id="wishlist"
                label={`Saved Nodes (${savedCount || 0})`} 
                savedCount={savedCount}
              />

              <SidebarBtn 
                to="/applications"
                label="Application Status" 
                icon={<ClipboardList size={18}/>} 
              />

              <SidebarBtn 
                to="/build-resume"
                label="Build Resume" 
                icon={<FileText size={18}/>} 
              />
            </>
          )}

          {/* Recruiter Tabs */}
          {role === 'recruiter' && (
            <>
              <SidebarBtn 
                to="/recruiter/dashboard"
                label="Candidate Dash" 
                icon={<Briefcase size={18}/>} 
              />
              
              <SidebarBtn 
                to="/recruiter/manage-jobs"
                label="Manage My Nodes" 
                icon={<Settings size={18}/>} 
              />

              <SidebarBtn 
                to="/recruiter/post-job" 
                label="Post New Job" 
                icon={<PlusCircle size={18}/>} 
              />
            </>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-50">
          <button 
            onClick={onLogout} 
            className="w-full p-4 text-red-500 font-black text-[10px] uppercase flex items-center gap-3 hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={18}/> Disconnect
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;