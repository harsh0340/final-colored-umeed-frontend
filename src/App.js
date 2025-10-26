import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL || "https://new-clean-umeed-backend.onrender.com"}/jobs`)
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load jobs");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: "Arial", textAlign: "center", padding: "20px" }}>
      <h1>Umeed – रोज़गार सबके लिए</h1>
      <p>Jobs for Everyone</p>
      <h2>Available Jobs</h2>

      {loading && <p>Loading jobs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {jobs.map((job) => (
          <li key={job._id} style={{ margin: "10px 0" }}>
            <b>{job.title}</b> – {job.category}  
          </li>
        ))}
      </ul>

      <p style={{ marginTop: "30px" }}>
        Apply for jobs easily. Registration with <b>Mobile OTP Login</b>.
      </p>
    </div>
  );
}

export default App;
