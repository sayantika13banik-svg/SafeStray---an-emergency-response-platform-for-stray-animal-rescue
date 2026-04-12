import { useState } from "react";
import "./Home.css";

function Report() {
  const [form, setForm] = useState({
    animal: "",
    description: "",
    lat: "",
    lng: ""
  });

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm({
        ...form,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
      alert("Location captured!");
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.lat || !form.lng) {
      alert("⚠️ Please get your location first");
      return;
    }

    try {
      await fetch("http://localhost:5000/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      alert("Report submitted!");

      setForm({
        animal: "",
        description: "",
        lat: "",
        lng: ""
      });

    } catch (err) {
      console.error(err);
      alert("Error submitting report");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="outer-container">
        <div className="content-card">
          <div className="inner-box visible">

            <h1>🐾 Report a Stray</h1>
            <p className="subtitle">Help animals in need</p>

            <input
              className="input"
              name="animal"
              placeholder="Animal type"
              value={form.animal}
              onChange={handleChange}
            />

            <textarea
              className="input"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />

            <button className="btn" onClick={getLocation}>
               Get My Location
            </button>

            {form.lat && (
              <p className="subtitle">
                Location captured 
              </p>
            )}

            <button
              className="btn"
              onClick={handleSubmit}
              disabled={!form.lat}
            >
              Submit Report
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;