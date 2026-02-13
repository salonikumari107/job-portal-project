import React, { useState } from 'react';
import { Plus, Eye, Download, UserCheck, PhoneIncoming, UserX, ArrowLeft } from 'lucide-react';

const RecruiterDashboard = ({ jobs, applicants }) => {
  const [activeAction, setActiveAction] = useState('LIST');
  const [selectedJob, setSelectedJob] = useState(null);

  if (activeAction === 'APPLICANTS') {
    return (
      <div className="space-y-6">
        <button onClick={() => setActiveAction('LIST')} className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><ArrowLeft size={16}/> Back</button>
        <h3 className="text-2xl font-black uppercase italic mb-6">Applicants List</h3>
        {applicants.filter(a => a.jobId === selectedJob).map(app => (
          <div key={app.id} className="bg-white p-8 rounded-[3.5rem] border flex justify-between items-center shadow-sm">
            <div><h5 className="text-lg font-black uppercase italic">{app.name}</h5><span className="text-[9px] font-black px-3 py-1 bg-blue-50 text-blue-600 rounded-lg uppercase">{app.status}</span></div>
            <div className="flex gap-2">
              <button className="p-4 bg-slate-50 text-slate-600 rounded-2xl border" title="Download Resume"><Download size={20}/></button>
              <button onClick={() => alert('Shortlisted')} className="p-4 bg-green-50 text-green-600 rounded-2xl" title="Shortlist"><UserCheck size={20}/></button>
              <button onClick={() => alert('Calling')} className="p-4 bg-blue-50 text-blue-600 rounded-2xl" title="Interview Call"><PhoneIncoming size={20}/></button>
              <button onClick={() => alert('Rejected')} className="p-4 bg-red-50 text-red-500 rounded-2xl" title="Reject"><UserX size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black uppercase italic">Job <span className="text-[#ff7b25]">Manager</span></h2>
        <button className="bg-[#ff7b25] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-2 shadow-lg"><Plus size={16}/> Post New Job</button>
      </div>
      {jobs.map(job => (
        <div key={job.id} className="bg-white p-8 rounded-[3rem] border flex justify-between items-center shadow-sm">
          <div><h4 className="text-xl font-black uppercase italic">{job.title}</h4><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: #{job.id}</p></div>
          <button onClick={() => { setSelectedJob(job.id); setActiveAction('APPLICANTS'); }} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2"><Eye size={16}/> View Applicants</button>
        </div>
      ))}
    </div>
  );
};
export default RecruiterDashboard;