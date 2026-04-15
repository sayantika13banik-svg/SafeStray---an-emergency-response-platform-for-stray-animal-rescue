import { useEffect, useState } from "react";
import "./Home.css";

function MyReports() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetch("https://safestray-backend.onrender.com/cases")
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="outer-container">
        <div className="content-card">
          <div className="inner-box visible">

            <h1>My Reports</h1>
            <p className="subtitle">All reported cases</p>

            {cases.length === 0 ? (
              <p className="subtitle">No reports yet</p>
            ) : (
              <div style={{ width: "100%" }}>

                {cases.map((c, index) => (
                  <div key={index} className="report-card">

                    <h3>{c.animal}</h3>
                    <p>{c.description}</p>

                    <p style={{ color: "#aaa", fontSize: "0.9rem" }}>
                      📍 {c.lat}, {c.lng}
                    </p>

                    {/* IMAGE FILE NAME (CLICKABLE) */}
                    {c.image && (
  <p
    className="file-link"
    onClick={() =>
      window.open(
        `https://safestray-backend.onrender.com/uploads/${c.image}`,
        "_blank"
      )
    }
  >
    📸 {c.image} (click to view)
  </p>
)}

                    <span className="status">{c.status}</span>

                  </div>
                ))}

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default MyReports;