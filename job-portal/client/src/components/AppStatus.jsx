import React from 'react';
import { Briefcase, GraduationCap, Zap } from 'lucide-react';

const AppStatus = ({ applications }) => {
  const getStatusStyle = (status) => {
    const styles = {
      'VIEWED': 'bg-blue-100 text-blue-600 border-blue-200',
      'SHORTLISTED': 'bg-emerald-100 text-emerald-600 border-emerald-200',
      'INTERVIEW CALL': 'bg-purple-100 text-purple-600 border-purple-200',
      'REJECTED': 'bg-red-100 text-red-600 border-red-200',
      'PENDING': 'bg-orange-100 text-orange-600 border-orange-200'
    };
    return styles[status] || styles['PENDING'];
  };

  return (
    <div className="animate-in fade-in space-y-8">
      <h2 className="text-5xl font-black italic uppercase text-slate-900 mb-10 tracking-tighter">
        My <span className="text-blue-600">Signal.</span>
      </h2>
      
      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-6">
              {/* Dynamic Icon based on application type */}
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                {app.type === 'TRAINING' ? <GraduationCap size={24}/> : app.type === 'INTERNSHIP' ? <Zap size={24}/> : <Briefcase size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-black italic uppercase leading-none">{app.role}</h4>
                  <span className="text-[8px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-400 uppercase">{app.type || 'JOB'}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">{app.company}</p>
              </div>
            </div>
            
            <div className={`px-8 py-3 rounded-full font-black text-[9px] uppercase tracking-widest border shadow-sm ${getStatusStyle(app.status)}`}>
              {app.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppStatus;