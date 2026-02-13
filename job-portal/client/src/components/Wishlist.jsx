import React from 'react';
import { Heart, Trash2 } from 'lucide-react';

const Wishlist = ({ jobs, savedJobs, toggleWishlist }) => {
  const mySavedJobs = jobs.filter(job => savedJobs.includes(job.id));

  return (
    <div className="animate-in fade-in space-y-8">
      <h2 className="text-4xl font-black italic uppercase tracking-tighter">My <span className="text-red-500">Wishlist.</span></h2>
      
      {mySavedJobs.length === 0 ? (
        <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
          <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">No nodes liked yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {mySavedJobs.map((job) => (
            <div key={job.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xl font-black italic uppercase">{job.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{job.company} • {job.level}</p>
              </div>
              <button onClick={() => toggleWishlist(job.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Wishlist;