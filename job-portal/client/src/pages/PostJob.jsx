import React, { useState } from 'react';
import { Send, Briefcase, MapPin, DollarSign, AlignLeft } from 'lucide-react';

const PostJob = () => {
  const [isPosted, setIsPosted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPosted(true);
    setTimeout(() => setIsPosted(false), 3000);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      {isPosted && (
        <div className="mb-6 p-4 bg-green-500 text-white rounded-2xl font-black text-center animate-bounce">
          JOB POSTED SUCCESSFULLY! 🚀
        </div>
      )}

      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <div className="flex items-center gap-4 mb-10 border-b pb-6">
          <div className="w-14 h-14 bg-[#ff7b25] rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Briefcase size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Post a New Job</h2>
            <p className="text-slate-400 font-bold text-sm">Find the best talent for your company</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 ml-2 uppercase">Job Title</label>
              <div className="relative">
                <input type="text" placeholder="e.g. Senior React Developer" className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 ring-[#1a5f7a]" required />
                <Briefcase className="absolute left-4 top-4 text-slate-300" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 ml-2 uppercase">Location</label>
              <div className="relative">
                <input type="text" placeholder="e.g. Remote / New York" className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 ring-[#1a5f7a]" required />
                <MapPin className="absolute left-4 top-4 text-slate-300" size={20} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 ml-2 uppercase">Salary Range</label>
            <div className="relative">
              <input type="text" placeholder="e.g. $80k - $120k" className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 ring-[#1a5f7a]" />
              <DollarSign className="absolute left-4 top-4 text-slate-300" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 ml-2 uppercase">Job Description</label>
            <div className="relative">
              <textarea rows="4" placeholder="Tell us about the role..." className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 ring-[#1a5f7a] resize-none"></textarea>
              <AlignLeft className="absolute left-4 top-4 text-slate-300" size={20} />
            </div>
          </div>

          <button className="w-full bg-[#1a5f7a] text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-[#144a61] transition-all flex items-center justify-center gap-3 active:scale-95 mt-4">
            POST JOB NOW <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;