import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../api/axios";
import { Search, Rocket, Orbit, Sparkles, MapPin } from "lucide-react"; // MapPin icon add kiya
import toast from "react-hot-toast";
import JobCard from "../components/JobCard";

const FindJob = ({ viewType = "all" }) => {
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]); 
  const [userSkills, setUserSkills] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- Location States ---
  const [coords, setCoords] = useState(null);
  const [isNearbyFilter, setIsNearbyFilter] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Query parameters taiyar karein
      let url = viewType === "saved" ? "/jobs/saved" : "/jobs";
      
      // Agar nearby filter active hai aur coordinates hain, toh URL mein add karein
      if (isNearbyFilter && coords) {
        url += `?lng=${coords.lng}&lat=${coords.lat}&distance=10000`; // 10km
      }

      const [jobRes, userRes] = await Promise.allSettled([
        api.get(url),
        api.get("/auth/me")
      ]);
      
      if (userRes.status === "fulfilled") {
        const responseData = userRes.value.data;
        const userData = responseData.data || responseData.user || responseData;
        
        const rawSkills = Array.isArray(userData?.skills) ? userData.skills : [];
        const cleanSkills = rawSkills.map(s => {
          const val = typeof s === 'object' ? (s.name || s.skill || s.label) : s;
          return String(val || "").trim();
        }).filter(Boolean);

        setUserSkills(cleanSkills); 
        const rawSaved = userData?.savedJobs || [];
        const currentSavedIds = rawSaved.map(j => (j._id || j).toString());
        setSavedJobIds(currentSavedIds);
      }

      if (jobRes.status === "fulfilled") {
        const res = jobRes.value.data;
        const finalJobs = res.data || res.jobs || res || [];
        setJobs(Array.isArray(finalJobs) ? finalJobs : []);
      }
    } catch (error) {
      console.error("Universe Sync Error:", error);
      toast.error("Orbit Connectivity Lost.");
    } finally {
      setLoading(false);
    }
  }, [viewType, isNearbyFilter, coords]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Location Permission Handler ---
  const handleNearbySearch = () => {
    if (!isNearbyFilter) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setIsNearbyFilter(true);
            toast.success("Nearby mode activated! 🌍");
          },
          () => toast.error("Please allow location access.")
        );
      }
    } else {
      setIsNearbyFilter(false);
      setCoords(null);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      (job.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-600 text-white p-1 rounded-md"><Orbit size={14} /></span>
              <span className="text-blue-600 font-black tracking-[0.4em] text-[10px] uppercase">
                {viewType === 'saved' ? "Your Personal Orbit" : "Active Galaxy Nodes"}
              </span>
            </div>
            <h1 className="text-6xl font-black italic tracking-tighter text-black uppercase leading-[0.9]">
              {viewType === 'saved' ? "Saved" : "Explore"} <br />
              <span className="text-blue-600 flex items-center gap-4">
                Opportunities <Sparkles className="text-orange-400 animate-pulse" size={40} />
              </span>
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            {/* Nearby Filter Button */}
            <button 
              onClick={handleNearbySearch}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all ${
                isNearbyFilter 
                ? "bg-black text-white shadow-lg" 
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400"
              }`}
            >
              <MapPin size={18} className={isNearbyFilter ? "animate-bounce" : ""} />
              {isNearbyFilter ? "Nearby Jobs Active (10km)" : "Find Jobs Near Me"}
            </button>

            <div className="relative w-full md:w-[400px] group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
              <input 
                type="text"
                placeholder="Search across the galaxy..."
                className="w-full pl-14 p-5 bg-white border border-slate-100 rounded-2xl outline-none shadow-xl font-bold text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ... Loading aur Jobs Grid wala part same rahega ... */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[50vh] gap-6">
            <Rocket className="text-blue-600 animate-bounce" size={40} />
            <p className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Syncing Orbit...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job._id} 
                job={job} 
                isSaved={savedJobIds.includes(job._id.toString())}
                onToggleRefresh={fetchData}
                userSkills={userSkills} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
            <h3 className="text-slate-300 font-black italic text-4xl uppercase tracking-tighter">No Signals</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindJob;