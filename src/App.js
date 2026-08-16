import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API = process.env.REACT_APP_API_URL || "https://new-clean-umeed-backend.onrender.com";
const categories = ["All", "Driver", "Helper", "Cook", "Security Guard", "Shop Helper", "Accountant", "Computer Operator", "Salesman"];

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showPostJob, setShowPostJob] = useState(false);
  const [notice, setNotice] = useState("");

  const loadJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (query.trim()) params.q = query.trim();
      if (city.trim()) params.city = city.trim();
      if (category !== "All") params.category = category;
      const { data } = await axios.get(`${API}/jobs`, { params });
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Jobs load nahi ho paaye. Thodi der baad try karein.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobs(); }, []);

  const visibleJobs = useMemo(() => jobs, [jobs]);

  const apply = async (form) => {
    try {
      await axios.post(`${API}/applications`, { ...form, job: selectedJob._id });
      setNotice("Application successfully submit ho gayi! 🎉");
      setSelectedJob(null);
    } catch (err) {
      setNotice(err.response?.data?.error || "Application submit nahi hui.");
    }
  };

  const postJob = async (form) => {
    try {
      await axios.post(`${API}/jobs`, form);
      setShowPostJob(false);
      setNotice("Job successfully post ho gayi! 🎉");
      loadJobs();
    } catch (err) {
      setNotice(err.response?.data?.error || "Job post nahi hui.");
    }
  };

  return (
    <div className="app">
      <header className="nav">
        <div className="brand"><span className="brand-mark">U</span><div><strong>Umeed</strong><small>रोज़गार सबके लिए</small></div></div>
        <button className="post-btn" onClick={() => setShowPostJob(true)}>+ Post a Job</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">ROZGAR SAATHI</span>
            <h1>Apne shehar mein<br /><span>apna kaam</span> dhoondhiye.</h1>
            <p>Drivers, helpers, salesmen, cooks aur har tarah ke local jobs — simple, fast aur free.</p>
            <div className="search-box">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Job, skill ya company..." />
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="📍 City" />
              <button onClick={loadJobs}>Search Jobs</button>
            </div>
          </div>
          <div className="hero-card"><div className="hero-icon">💼</div><b>Umeed par job dhoondhna</b><p>Apni skill aur city select kijiye, suitable jobs dekhiye aur directly apply kijiye.</p></div>
        </section>

        <section className="categories">
          <div className="section-title"><div><span>EXPLORE</span><h2>Popular job categories</h2></div><p>{jobs.length} jobs available</p></div>
          <div className="chips">{categories.map(c => <button key={c} className={category === c ? "chip active" : "chip"} onClick={() => { setCategory(c); }}>{c}</button>)}</div>
        </section>

        <section className="jobs-section">
          <div className="section-title"><div><span>FIND YOUR NEXT JOB</span><h2>Latest opportunities</h2></div></div>
          {loading ? <div className="state">Jobs load ho rahi hain...</div> : error ? <div className="state error">{error}</div> : visibleJobs.length === 0 ? <div className="empty"><div>🔎</div><h3>Abhi matching job nahi mili</h3><p>City ya category change karke dobara search karein.</p></div> : <div className="job-grid">{visibleJobs.map(job => <article className="job-card" key={job._id}><div className="job-top"><div className="company-logo">{(job.companyName || "U").charAt(0).toUpperCase()}</div><span className="tag">{job.category}</span></div><h3>{job.title}</h3><p className="company">{job.companyName || "Local Employer"}</p><div className="meta"><span>📍 {job.city}</span>{job.salary && <span>₹ {job.salary}</span>}</div><button className="apply-btn" onClick={() => setSelectedJob(job)}>View & Apply →</button></article>)}</div>}
        </section>
      </main>

      <footer><strong>Umeed</strong> — Rozgaar sabke liye. <span>Made for local India 🇮🇳</span></footer>

      {selectedJob && <Modal title="Apply for this job" onClose={() => setSelectedJob(null)}><ApplyForm job={selectedJob} onSubmit={apply} /></Modal>}
      {showPostJob && <Modal title="Post a new job" onClose={() => setShowPostJob(false)}><JobForm onSubmit={postJob} /></Modal>}
      {notice && <div className="toast" onClick={() => setNotice("")}>{notice}</div>}
    </div>
  );
}

function Modal({ title, onClose, children }) { return <div className="overlay"><div className="modal"><button className="close" onClick={onClose}>×</button><h2>{title}</h2>{children}</div></div>; }
function ApplyForm({ job, onSubmit }) {
  const [f, setF] = useState({ name: "", phone: "", city: job.city || "", experience: "", salary: "" });
  const change = e => setF({ ...f, [e.target.name]: e.target.value });
  return <form onSubmit={e => { e.preventDefault(); onSubmit(f); }}><p className="form-job">{job.title} · {job.city}</p><input name="name" required placeholder="Your name" value={f.name} onChange={change} /><input name="phone" required placeholder="Mobile number" value={f.phone} onChange={change} /><input name="city" required placeholder="City" value={f.city} onChange={change} /><input name="experience" placeholder="Experience (e.g. 2 years)" value={f.experience} onChange={change} /><input name="salary" placeholder="Expected salary" value={f.salary} onChange={change} /><button className="submit" type="submit">Submit Application</button></form>;
}
function JobForm({ onSubmit }) {
  const [f, setF] = useState({ title: "", category: "", city: "", companyName: "", salary: "", description: "" });
  const change = e => setF({ ...f, [e.target.name]: e.target.value });
  return <form onSubmit={e => { e.preventDefault(); onSubmit(f); }}><input name="title" required placeholder="Job title" value={f.title} onChange={change} /><input name="companyName" placeholder="Shop / company name" value={f.companyName} onChange={change} /><input name="category" required placeholder="Category (Driver, Salesman...)" value={f.category} onChange={change} /><input name="city" required placeholder="City" value={f.city} onChange={change} /><input name="salary" placeholder="Salary" value={f.salary} onChange={change} /><textarea name="description" placeholder="Job description" value={f.description} onChange={change} /><button className="submit" type="submit">Post Job</button></form>;
}

export default App;
