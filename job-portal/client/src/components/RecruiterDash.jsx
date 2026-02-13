import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, XCircle, PhoneCall, User, Briefcase, Trash2, Edit, Eye, X, Mail, Phone, GraduationCap, Clock } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const RecruiterDash = ({ applications, updateStatus }) => {
  const [activeTab, setActiveTab] = useState('applications');
  const [myJobs, setMyJobs] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      // We need a backend endpoint for this. 
      // For now let's assume getJobs filter by recruiter works or add a new one.
      const res = await api.get('/jobs'); 
      // Filter in frontend for now as a quick fix, but backend is better
      setMyJobs(res.data.data); 
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm("Delete this Job Node?")) {
      try {
        const res = await api.delete(`/jobs/${id}`);
        if (res.data.success) {
          setMyJobs(myJobs.filter(j => j._id !== id));
          toast.success("Job Deleted");
        }
      } catch (err) {
        toast.error("Error deleting job");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black italic uppercase">Recruiter <span className="text-blue-600">Control.</span></h2>
        <div className="flex bg-slate-50 p-2 rounded-2xl gap-2">
          <button 
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'applications' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Incoming Signals ({applications.length})
          </button>
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'jobs' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            My Broadcasts ({myJobs.length})
          </button>
        </div>
      </div>

      {activeTab === 'applications' ? (
        <div className="space-y-4">
          {applications.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400">No signals detected yet.</p>
            </div>
          )}
          {applications.map(app => (
            <div key={app.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                  <User size={24}/>
                </div>
                <div>
                  <h4 className="font-black italic uppercase text-xl leading-none">{app.candidateName}</h4>
                  <div className="flex gap-4 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="text-blue-600">{app.role}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">{app.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-6 md:mt-0 w-full md:w-auto">
                <button onClick={() => setSelectedApp(app)} className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm" title="View Full Profile"><Eye size={20}/></button>
                <button onClick={() => updateStatus(app.id, 'Shortlisted')} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Shortlist"><CheckCircle size={20}/></button>
                <button onClick={() => updateStatus(app.id, 'Rejected')} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Reject"><XCircle size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {myJobs.map(job => (
            <div key={job._id} className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                  <Briefcase size={24}/>
                </div>
                <div>
                  <h4 className="font-black italic uppercase text-xl leading-none">{job.title}</h4>
                  <div className="flex gap-4 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{job.jobType}</span>
                    <span>{job.location}</span>
                    <span className="text-blue-600">{job.salaryRange}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-6 md:mt-0">
                <button onClick={() => deleteJob(job._id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicant Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 space-y-8 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
                  <User size={32}/>
                </div>
                <div>
                  <h3 className="font-black italic text-3xl uppercase leading-none">{selectedApp.candidateName}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">Applying for {selectedApp.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-3 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={24}/>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <section className="space-y-3">
                  <h5 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Mail size={14}/> Contact Data</h5>
                  <p className="font-bold text-sm">{selectedApp.email}</p>
                  <p className="font-bold text-sm">{selectedApp.mobile}</p>
                </section>

                <section className="space-y-3">
                  <h5 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><GraduationCap size={14}/> Academic Nodes</h5>
                  <div className="space-y-2">
                    {selectedApp.education && selectedApp.education.length > 0 ? (
                      selectedApp.education.map((edu, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-2xl">
                          <p className="font-black text-[10px] uppercase">{edu.degree}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{edu.institution} • {edu.year}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No academic nodes found.</p>
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="space-y-3">
                  <h5 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Clock size={14}/> Experience Flux</h5>
                  <div className="space-y-2">
                    {selectedApp.experience && selectedApp.experience.length > 0 ? (
                      selectedApp.experience.map((exp, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-2xl">
                          <p className="font-black text-[10px] uppercase">{exp.position}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{exp.company} • {exp.duration}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No experience flux detected.</p>
                    )}
                  </div>
                </section>

                <button 
                  onClick={() => {
                    if (selectedApp.resume) {
                      const resumeUrl = selectedApp.resume.startsWith('http') 
                        ? selectedApp.resume 
                        : `http://localhost:5000/${selectedApp.resume.replace(/\\/g, '/')}`;
                      window.open(resumeUrl, '_blank');
                    } else {
                      toast.error("No resume node found");
                    }
                  }}
                  className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl">
                  <Download size={18}/> Access Resume Node
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDash;