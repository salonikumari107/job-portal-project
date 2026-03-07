import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const FindJob = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");     // ✅ correct API
        setJobs(res.data.data);                 // ✅ correct response
      } catch (error) {
        console.log("Jobs fetch karne mein error:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>

        <div className="banner">
          {jobs.length === 0 ? (
            <p>No jobs available</p>
          ) : (
            jobs.map((job) => (
              <div className="card" key={job._id}>
                <p><b>{job.title}</b></p>
                <p>{job.company}</p>
                <p>{job.location}</p>

                <Link to={`/job/${job._id}`}>Job Details</Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FindJob;
