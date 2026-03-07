import React, { useState } from "react";
import api from "../api/axios"; // Updated axios instance with HTTPS support
import toast from "react-hot-toast";

const PostJob = () => {
  // 1. Puraani States aur Fields (Merge kiya gaya design)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [fixedPrice, setFixedPrice] = useState("");

  // 2. Integration Logic (Backend Connection)
  const handleJobPost = async (e) => {
    e.preventDefault();

    // Data object taiyar karein jo backend mang raha hai
    const jobData = {
      title,
      description,
      category,
      country,
      city,
      location,
      fixedPrice: Number(fixedPrice), // Price ko hamesha number mein bhejein
    };

    try {
      // Axios interceptor apne aap localStorage se token utha kar header mein bhej dega
      const res = await api.post("/job/post", jobData);

      if (res.data.success) {
        toast.success(res.data.message || "Job Posted Successfully!");
        
        // Form ko khali karna (Reset)
        setTitle("");
        setDescription("");
        setCategory("");
        setCountry("");
        setCity("");
        setLocation("");
        setFixedPrice("");
      }
    } catch (error) {
      // Backend se aane wala error (jaise: "Only recruiter can post")
      const errorMsg = error.response?.data?.message || "Post fail ho gaya!";
      toast.error(errorMsg);
    }
  };

  return (
    <section className="job_post page">
      <div className="container">
        <h3>POST NEW JOB</h3>
        <form onSubmit={handleJobPost}>
          <div className="wrapper">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job Title"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Graphics & Design">Graphics & Design</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="Frontend Web Development">Frontend Web Development</option>
              <option value="MERN Stack Development">MERN Stack Development</option>
              <option value="Video Animation">Video Animation</option>
            </select>
          </div>

          <div className="wrapper">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              required
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              required
            />
          </div>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location Details (Street, Building...)"
            required
          />

          <div className="salary_wrapper">
            <input
              type="number"
              value={fixedPrice}
              onChange={(e) => setFixedPrice(e.target.value)}
              placeholder="Enter Fixed Price (INR)"
              required
            />
          </div>

          <textarea
            rows="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Job Description (Skills, Experience, etc.)"
            required
          />

          <button type="submit">Create Job</button>
        </form>
      </div>
    </section>
  );
};

export default PostJob;