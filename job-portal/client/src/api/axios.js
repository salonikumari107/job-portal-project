import axios from 'axios';
import toast from 'react-hot-toast';

// ✅ Dynamic URL: Local par 8001 use karega, Render par Environment Variable
// Agar aapne Render par VITE_API_URL set nahi kiya hai, toh niche di gayi line ko replace karein
const RENDER_BACKEND_URL = "https://job-portal-project-27ux.onrender.com"; // 👈 Yahan apna asli Render Backend URL dalein
const LOCAL_URL = "http://localhost:8001";

const BASE_URL = import.meta.env.MODE === 'production' ? RENDER_BACKEND_URL : LOCAL_URL;

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 1. REQUEST INTERCEPTOR (Token Injection) ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 2. RESPONSE INTERCEPTOR (Global Error Handling) ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A. Network Error Check
    if (!error.response) {
      const errorMsg = import.meta.env.MODE === 'production' 
        ? "Network Error! Cloud server se connect nahi ho pa raha." 
        : "Network Error! Server se connect nahi ho pa raha (Check Port 8001).";
      
      toast.error(errorMsg);
      console.error("❌ Connection Refused: Ensure Backend is running.");
    }

    // B. Unauthorized Check (401)
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath.includes('/auth') || currentPath.includes('/login');

      if (!isAuthPage) {
        localStorage.removeItem('token'); 
        toast.error("Session Expired. Please Login again.");
        setTimeout(() => {
            window.location.href = '/auth';
        }, 1500);
      }
    }

    // C. Middleware & Server Errors (500+)
    if (error.response && error.response.status >= 500) {
        const msg = error.response.data?.message || "Internal Server Error!";
        toast.error(msg);
    }

    // D. Validation Errors (400)
    if (error.response && error.response.status === 400) {
        toast.error(error.response.data?.message || "Invalid Data Submitted");
    }

    return Promise.reject(error);
  }
);

// --- 3. RESUME VIEW HELPER ---
export const getResumeUrl = (resumePath) => {
    if (!resumePath) return "#";

    // Purane localhost:8000 paths ko fix karne ke liye
    if (resumePath.includes('localhost:8000') || resumePath.includes('localhost:8001')) {
        const parts = resumePath.split('/');
        const filename = parts[parts.length - 1];
        return `${BASE_URL}/uploads/${filename}`;
    }

    const cleanPath = resumePath.startsWith('uploads/') ? resumePath : `uploads/${resumePath}`;
    return `${BASE_URL}/${cleanPath}`;
};

export default api;