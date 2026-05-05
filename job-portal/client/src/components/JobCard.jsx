import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import api, { getResumeUrl } from '../api/axios'; // ✅ getResumeUrl import kiya
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaBriefcase, FaArrowRight, FaFilePdf } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const JobCard = ({ job, isSaved, onToggleRefresh, application }) => { // ✅ application prop add kiya
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post(`/jobs/save/${job._id}`); 
      if (res.data.success) {
        toast.success(res.data.isSaved ? "Saved to Orbit" : "Removed");
        if (onToggleRefresh) onToggleRefresh(); 
      }
    } catch {
      toast.error("Sync error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative bg-white border border-gray-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500">
      
      {/* Save Button */}
      <button 
        onClick={handleToggleSave} 
        className="absolute top-5 right-5 z-20 p-3 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        {isSaved ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
      </button>

      <div className="mt-4 text-left">
        <h3 className="text-2xl font-black italic uppercase text-zinc-900 leading-tight">
          {job?.title}
        </h3>
        <p className="text-blue-500 font-bold text-sm mt-1">
          {job?.company}
        </p>
      </div>

      {/* Job Details */}
      <div className="flex gap-4 text-zinc-500 text-sm font-bold my-6">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-zinc-400" />
          <span>{job?.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaBriefcase className="text-zinc-400" />
          {/* Fresher status prioritized based on your profile */}
          <span>{job?.experienceLevel || 'Fresher'}</span> 
        </div>
      </div>

      {/* --- ✅ VIEW RESUME BUTTON (Sirf tab dikhega jab application data ho) --- */}
      {application?.resume && (
        <button 
          onClick={() => {
            const finalUrl = getResumeUrl(application.resume);
            window.open(finalUrl, '_blank');
          }}
          className="w-full mb-3 border-2 border-zinc-900 text-zinc-900 font-black py-3 rounded-2xl flex justify-center items-center gap-3 hover:bg-zinc-100 transition-all duration-300"
        >
          <FaFilePdf /> VIEW RESUME
        </button>
      )}

      {/* Action Button */}
      <button 
        onClick={() => navigate(`/job/${job?._id}`)} 
        className="w-full bg-zinc-900 text-white font-black py-4 rounded-2xl flex justify-between px-8 items-center hover:bg-blue-600 transition-all duration-300"
      >
        VIEW DETAILS <FaArrowRight />
      </button>
    </div>
  );
};

export default JobCard;