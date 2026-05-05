// src/data/mockData.js

export const initialJobs = [
  { 
    id: 1, 
    title: "Senior React Developer", 
    company: "Google", 
    location: "Bangalore", 
    region: "National", 
    mode: "Hybrid", 
    salary: "25 LPA",
    position: [12.9716, 77.5946] // Bangalore
  },
  { 
    id: 2, 
    title: "UI/UX Designer", 
    company: "Adobe", 
    location: "Noida", 
    region: "State", 
    mode: "Offline", 
    salary: "15 LPA",
    position: [28.5355, 77.3910] // Noida
  },
  { 
    id: 3, 
    title: "Frontend Intern", 
    company: "Zomato", 
    location: "Remote (Delhi)", 
    region: "National", 
    mode: "Online", 
    salary: "35k",
    position: [28.6139, 77.2090] // Delhi
  },
  { 
    id: 4, 
    title: "Backend Engineer", 
    company: "Meta", 
    location: "Mumbai", 
    region: "National", 
    mode: "Hybrid", 
    salary: "30 LPA",
    position: [19.0760, 72.8777] // Mumbai
  },
  { 
    id: 5, 
    title: "DevOps Specialist", 
    company: "Amazon", 
    location: "Hyderabad", 
    region: "National", 
    mode: "Offline", 
    salary: "22 LPA",
    position: [17.3850, 78.4867] // Hyderabad
  },
  { 
    id: 6, 
    title: "Product Manager", 
    company: "Flipkart", 
    location: "Chennai", 
    region: "National", 
    mode: "Hybrid", 
    salary: "28 LPA",
    position: [13.0827, 80.2707] // Chennai
  }
];

export const initialApplicants = [
  { id: 101, jobId: 1, name: "Rahul Verma", status: "Pending" },
  { id: 102, jobId: 1, name: "Sneha Kapoor", status: "Shortlisted" }
];