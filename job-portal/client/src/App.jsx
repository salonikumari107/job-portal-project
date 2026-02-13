import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import FindJob from './components/FindJob';
import Wishlist from './components/Wishlist';
import AppStatus from './components/AppStatus';
import RecruiterDash from './components/RecruiterDash';
import PostJob from './components/PostJob';
import { useAuth } from './context/AuthContext';
import api from './api/axios';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState('seeker'); 
  const [savedJobs, setSavedJobs] = useState([]);
  const [userData, setUserData] = useState(null);
  const [jobDatabase, setJobDatabase] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (user) {
      setUserRole(user.role);
      setUserData(user);
      fetchJobs();
      if (user.role === 'seeker') {
        fetchMyApplications();
      } else if (user.role === 'recruiter') {
        fetchRecruiterApplications();
      }
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobDatabase(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await api.get('/applications/my-applications');
      setApplications(res.data.data.map(app => ({
        id: app._id,
        candidateName: user.name,
        role: app.job.title,
        company: app.job.company,
        status: app.status.toUpperCase(),
        type: app.job.jobType
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecruiterApplications = async () => {
    try {
      const res = await api.get('/applications/recruiter/all');
      setApplications(res.data.data.map(app => ({
        id: app._id,
        candidateName: app.seeker.name,
        email: app.seeker.email,
        mobile: app.seeker.mobile,
        education: app.seeker.education,
        experience: app.seeker.experience,
        resume: app.resume,
        role: app.job.title,
        company: app.job.company,
        status: app.status.toUpperCase(),
        type: app.job.jobType
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/applications/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus.toUpperCase() } : app));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlist = (id) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (loading) return null;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ... (existing effects)

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden relative">
      <Toaster position="top-right" />
      {!user ? (
        <Routes>
          <Route path="/auth" element={<Auth onLoginSuccess={(data) => {setUserData(data); navigate('/');}} setUserRole={setUserRole} />} />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      ) : (
        <div className="flex w-full h-full relative">
          <Sidebar 
            userRole={userRole} 
            savedCount={savedJobs.length} 
            onLogout={handleLogout} 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
          />
          
          <main className="flex-1 overflow-y-auto p-6 md:p-12 w-full relative">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between mb-8">
              <h1 className="text-xl font-black italic uppercase tracking-tighter">Job Orbit.</h1>
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
              >
                <Menu size={24}/>
              </button>
            </div>

            <Routes>
              <Route path="/profile" element={<Profile role={userRole} data={userData} setData={setUserData} />} />
              
              {userRole === 'seeker' && (
                <>
                  <Route path="/find-job" element={<FindJob jobs={jobDatabase} savedJobs={savedJobs} toggleWishlist={toggleWishlist} />} />
                  <Route path="/wishlist" element={<Wishlist jobs={jobDatabase} savedJobs={savedJobs} toggleWishlist={toggleWishlist} />} />
                  <Route path="/app-status" element={<AppStatus applications={applications} />} />
                  <Route path="/" element={<Navigate to="/profile" />} />
                </>
              )}
              
              {userRole === 'recruiter' && (
                <>
                  <Route path="/rec-dash" element={<RecruiterDash applications={applications} updateStatus={updateStatus} />} />
                  <Route path="/post-job" element={<PostJob />} />
                  <Route path="/" element={<Navigate to="/profile" />} />
                </>
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;