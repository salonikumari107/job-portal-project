import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Layout, Heart, ClipboardList, PlusCircle, LogOut, Briefcase, X } from 'lucide-react';



const SidebarBtn = ({ to, label, icon, onClick }) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    className={({ isActive }) => `w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${isActive ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
  >
    {icon} {label}
  </NavLink>
);

const Sidebar = ({ userRole, onLogout, savedCount, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm animate-in fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 h-full bg-white border-r border-slate-100 flex flex-col p-8 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="flex justify-between items-start mb-16">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Job Orbit.</h1>
          <button onClick={onClose} className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-all text-slate-400">
            <X size={20}/>
          </button>
        </div>
        
        <nav className="flex-1 space-y-2">
          {/* Profile Tab */}
          <SidebarBtn 
            to="/profile"
            label="My Profile" 
            icon={<User size={18}/>} 
            onClick={onClose}
          />

          {/* Seeker Specific Tabs */}
          {userRole === 'seeker' && (
            <>
              <SidebarBtn 
                to="/find-job"
                label="Universe / Find Job" 
                icon={<Layout size={18}/>} 
                onClick={onClose}
              />
              {/* VIEW SAVED OPTION RIGHT UNDER FIND JOB */}
              <SidebarBtn 
                to="/wishlist"
                label={`Saved Nodes (${savedCount})`} 
                icon={<Heart size={18} className={savedCount > 0 ? "text-red-500 fill-red-500" : ""}/>} 
                onClick={onClose}
              />
              <SidebarBtn 
                to="/app-status"
                label="Application Status" 
                icon={<ClipboardList size={18}/>} 
                onClick={onClose}
              />
            </>
          )}

          {/* Recruiter Specific Tabs */}
          {userRole === 'recruiter' && (
            <>
              <SidebarBtn 
                to="/rec-dash"
                label="Candidate Dash" 
                icon={<Briefcase size={18}/>} 
                onClick={onClose}
              />
              <SidebarBtn 
                to="/post-job"
                label="Post New Job" 
                icon={<PlusCircle size={18}/>} 
                onClick={onClose}
              />
            </>
          )}
        </nav>

        <button onClick={onLogout} className="mt-auto p-4 text-red-500 font-black text-[10px] uppercase flex items-center gap-3 hover:bg-red-50 rounded-2xl transition-all">
          <LogOut size={18}/> Disconnect
        </button>
      </div>
    </>
  );
};




export default Sidebar;