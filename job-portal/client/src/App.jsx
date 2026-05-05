import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import api from './api/axios';
import WelcomePage from './components/WelcomePage';
import Auth from './components/Auth';
import ForgotPassword from './pages/ForgotPassword'; // Naya Import
import ResetPassword from './pages/ResetPassword';   // Naya Import
import RecruiterProfile from './components/RecruiterProfile'; 
import JobSeekerProfile from './components/JobSeekerProfile';
import Sidebar from './components/Sidebar';
import PostJob from './components/PostJob'; 
import FindJob from './components/FindJob';
import JobDetails from './components/JobDetails'; 
import ResumeBuilder from './components/ResumeBuilder/ResumeBuilder';
import CandidateHub from './components/CandidateHub'; 
import ManageJobs from './components/ManageJobs'; 
import StatusTracker from './components/StatusTracker'; 
import JobMap from './components/JobMap'; 
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // --- Leaflet CSS Injector ---
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);
  }, []);

  const [userData, setUserData] = useState({
    skills: [],
    experience: [],
    name: "",
    summary: "",
    email: ""
  });
  
  const [dataLoading, setDataLoading] = useState(false); 
  const [activeTab, setActiveTab] = useState('profile');

  const currentUserRole = useMemo(() => {
    const role = user?.role?.toString().toLowerCase().trim();
    return role;
  }, [user]);

  const isRecruiter = currentUserRole === 'recruiter';
  const isSeeker = currentUserRole === 'seeker' || currentUserRole === 'jobseeker';

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const res = await api.get("/auth/me");
      if (res.data.success) {
        const finalData = res.data.data || res.data.user;
        setUserData({
          ...finalData,
          skills: finalData?.skills || [],
          experience: finalData?.experience || []
        });
      }
    } catch (error) {
      console.error("User fetch error:", error);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && !userData.email && !authLoading) {
      fetchUserData();
    }
  }, [user, authLoading, fetchUserData, userData.email]);

  const handleLogout = () => {
    logout();
    setUserData({ skills: [], experience: [], name: "", summary: "" });
    navigate('/auth'); 
  };

  if (authLoading) {
    return <div className="h-screen w-full flex items-center justify-center font-bold text-blue-600">Orbiting...</div>;
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      <Toaster position="top-center" />

      {user && userData.email && (
        <Sidebar 
          userRole={currentUserRole}
          onLogout={handleLogout} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          savedCount={userData?.savedJobs?.length || 0}
        />
      )}

      <main className="flex-1 relative overflow-y-auto bg-gray-50">
        <Routes>
          <Route path="/" element={!user ? <WelcomePage onGetStarted={() => navigate('/auth')} /> : <Navigate to="/profile" />} />
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/profile" />} />
          
          {/* Public Password Recovery Routes (Login ke bina access ho sakein) */}
          <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/profile" />} />
          <Route path="/reset-password/:token" element={!user ? <ResetPassword /> : <Navigate to="/profile" />} />

          {/* Protected Profile Route */}
          <Route path="/profile" element={
            user ? (
              dataLoading ? (
                <div className="p-10 text-center font-bold animate-pulse">Initializing Orbit Data...</div>
              ) : (
                isRecruiter 
                  ? <RecruiterProfile userData={userData} refreshData={fetchUserData} /> 
                  : <JobSeekerProfile profileData={userData} setProfileData={setUserData} />
              )
            ) : <Navigate to="/auth" />
          } />

          {/* Seeker Specific Routes */}
          <Route path="/build-resume" element={
            user && isSeeker ? <ResumeBuilder userData={userData} /> : <Navigate to="/profile" />
          } />
          
          <Route path="/universe" element={user && isSeeker ? <FindJob viewType="all" onRefresh={fetchUserData} /> : <Navigate to="/auth" />} />
          <Route path="/saved" element={user && isSeeker ? <FindJob viewType="saved" onRefresh={fetchUserData} /> : <Navigate to="/auth" />} />
          <Route path="/applications" element={user && isSeeker ? <StatusTracker /> : <Navigate to="/auth" />} />

          <Route path="/job-map" element={user ? <JobMap /> : <Navigate to="/auth" />} />

          {/* Recruiter Specific Routes */}
          <Route path="/recruiter/dashboard" element={user && isRecruiter ? <CandidateHub /> : <Navigate to="/auth" />} />
          <Route path="/recruiter/post-job" element={user && isRecruiter ? <PostJob /> : <Navigate to="/auth" />} />
          <Route path="/recruiter/manage-jobs" element={user && isRecruiter ? <ManageJobs /> : <Navigate to="/auth" />} />

          <Route path="/job/:id" element={user ? <JobDetails /> : <Navigate to="/auth" />} />
          
          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;