import React from 'react';
import { Search, Globe, Laptop } from 'lucide-react';

const SeekerDashboard = ({ jobs, searchQuery, setSearchQuery }) => {
  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black uppercase italic mb-6">Explore <span className="text-[#1a5f7a]">Jobs</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border">
            <Search size={18} className="text-slate-400"/><input type="text" placeholder="Search Role..." className="bg-transparent outline-none w-full font-bold text-sm" onChange={(e)=>setSearchQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border"><Globe size={18}/><select className="bg-transparent outline-none w-full font-bold text-sm"><option>National</option><option>State</option></select></div>
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border"><Laptop size={18}/><select className="bg-transparent outline-none w-full font-bold text-sm"><option>Hybrid</option><option>Online</option></select></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white p-8 rounded-[3rem] border hover:shadow-2xl transition-all">
            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">{job.mode}</span>
            <h3 className="text-2xl font-black uppercase italic mt-4">{job.title}</h3>
            <p className="text-slate-400 font-bold text-xs uppercase mb-6">{job.company} • {job.location}</p>
            <div className="pt-6 border-t flex justify-between items-center font-black">
              <span className="text-[#1a5f7a]">{job.salary}</span>
              <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] uppercase">Apply Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SeekerDashboard;