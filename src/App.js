import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = (process.env.REACT_APP_API_URL || "https://new-clean-umeed-backend.onrender.com").replace(/\/$/, "");

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [registered, setRegistered] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", city: "", role: "seeker" });

  useEffect(() => {
    axios.get(`${API_URL}/api/jobs`).then((res) => {
      setJobs(res.data.jobs || []);
      setLoading(false);
    }).catch(() => {
      setError("Jobs load nahi ho paayi. Please try again.");
      setLoading(false);
    });
  }, []);

  const register = async (event) => {
    event.preventDefault();
    setRegistered("");
    try {
      await axios.post(`${API_URL}/api/users`, form);
      setRegistered("Profile successfully created!");
      setForm({ name: "", phone: "", city: "", role: "seeker" });
    } catch (err) {
      setRegistered(err.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5fff8", color: "#173b2b", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "#087f3d", color: "white", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div><h1 style={{ margin: 0 }}>Umeed</h1><div style={{ fontSize: 14 }}>रोज़गार सबके लिए</div></div>
        <button onClick={() => setShowRegister(true)} style={{ background: "white", color: "#087f3d", border: 0, borderRadius: 8, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>Register / Create Profile</button>
      </header>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        <section style={{ textAlign: "center", marginBottom: 30 }}><h2 style={{ fontSize: 34, marginBottom: 8 }}>Find Your Next Job</h2><p style={{ color: "#587064" }}>Apni city mein driver, helper, salesman, accountant aur doosri jobs dekhiye.</p></section>
        <section style={{ background: "white", borderRadius: 14, padding: 22, boxShadow: "0 4px 18px rgba(0,0,0,.08)" }}>
          <h2 style={{ marginTop: 0 }}>Available Jobs</h2>
          {loading && <p>Loading jobs...</p>}
          {error && <p style={{ color: "#b42318" }}>{error}</p>}
          {!loading && !error && jobs.length === 0 && <p>No jobs available yet.</p>}
          {jobs.map((job) => <article key={job._id} style={{ border: "1px solid #dfeee5", borderRadius: 10, padding: 16, marginBottom: 12 }}><h3 style={{ margin: "0 0 6px" }}>{job.title}</h3><div>{job.company} • {job.category} • {job.city}</div>{job.description && <p style={{ color: "#587064" }}>{job.description}</p>}</article>)}
        </section>
      </main>
      {showRegister && <div onClick={() => setShowRegister(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <form onSubmit={register} onClick={(e) => e.stopPropagation()} style={{ background: "white", width: "100%", maxWidth: 430, borderRadius: 14, padding: 24 }}>
          <h2 style={{ marginTop: 0 }}>Create your Umeed profile</h2><p style={{ color: "#587064", fontSize: 14 }}>Basic registration is live. Mobile OTP authentication will be added next.</p>
          <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          <input required placeholder="Mobile number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
          <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={inputStyle} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={inputStyle}><option value="seeker">I am looking for a job</option><option value="employer">I want to post jobs</option></select>
          <div style={{ display: "flex", gap: 10 }}><button type="submit" style={primaryButton}>Register</button><button type="button" onClick={() => setShowRegister(false)} style={secondaryButton}>Cancel</button></div>
          {registered && <p style={{ color: registered.includes("successfully") ? "#087f3d" : "#b42318" }}>{registered}</p>}
        </form>
      </div>}
    </div>
  );
}
const inputStyle = { width: "100%", boxSizing: "border-box", padding: 12, marginBottom: 12, border: "1px solid #ccdcd3", borderRadius: 8, fontSize: 15 };
const primaryButton = { flex: 1, background: "#087f3d", color: "white", border: 0, borderRadius: 8, padding: 12, fontWeight: 700, cursor: "pointer" };
const secondaryButton = { flex: 1, background: "#eef5f1", color: "#173b2b", border: 0, borderRadius: 8, padding: 12, cursor: "pointer" };
export default App;
