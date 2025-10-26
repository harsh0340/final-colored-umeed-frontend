import React from "react";

function App() {
  return (
    <div style={{ fontFamily: "Arial", textAlign: "center", padding: "20px" }}>
      <img src="logo.png" alt="Umeed Logo" width="80" />
      <h1>Umeed - रोज़गार सबके लिए</h1>
      <p>Jobs for Everyone</p>
      <h2>Available Job Categories</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>🚚 Driver</li>
        <li>🛠️ Helper</li>
        <li>🍳 Cook</li>
        <li>🛡️ Security Guard</li>
        <li>🛍️ Shop Helper</li>
        <li>📒 Accountant</li>
        <li>💻 Computer Operator</li>
        <li>🛒 Salesman</li>
      </ul>
      <p style={{marginTop:"30px"}}>
        Apply for jobs easily. Registration with <b>Mobile OTP Login</b>.
      </p>
    </div>
  );
}

export default App;
