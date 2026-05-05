import axios from 'axios';
import toast from 'react-hot-toast';

// ✅ Port 8001 set kiya gaya hai kyunki aapka backend wahan chal raha hai
const BASE_URL = "http://localhost:8001"; 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${BASE_URL}/api/v1`,
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
    // A. Network Error Check (Updated error message to Port 8001)
    if (!error.response) {
      toast.error("Network Error! Server se connect nahi ho pa raha (Check Port 8001).");
      console.error("❌ Connection Refused: Ensure Backend is running on Port 8001.");
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
// Is function ko aap JobCard.jsx ya AppStatus.jsx mein import karke use kar sakte hain
// src/api/axios.js mein ye update karein
export const getResumeUrl = (resumePath) => {
    if (!resumePath) return "#";

    // 1. Agar database mein "http://localhost:8000/..." save hai
    // toh use current BASE_URL (8001) se replace kar dega
    if (resumePath.includes('localhost:8000')) {
        return resumePath.replace('http://localhost:8000', BASE_URL);
    }

    // 2. Agar sirf filename save hai (e.g., "123.pdf")
    const cleanPath = resumePath.startsWith('uploads/') ? resumePath : `uploads/${resumePath}`;
    return `${BASE_URL}/${cleanPath}`;
};

export default api;