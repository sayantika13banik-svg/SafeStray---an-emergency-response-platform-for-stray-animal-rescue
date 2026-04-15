import { useState, useEffect } from "react";
import "./Home.css";

function Report() {
  const [form, setForm] = useState({
    animal: "",
    description: "",
    lat: "",
    lng: "",
    image: ""
  });

  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }));
      },
      () => setError("Location required !")
    );
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    const data = new FormData();
    data.append("image", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://safestray-backend.onrender.com/upload"); 

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);

        setForm((prev) => ({
          ...prev,
          image: res.filename 
        }));

        setUploading(false);
        setProgress(0);
      } else {
        setError("Upload failed !");
        setUploading(false);
      }
    };

    xhr.send(data);
  };


  const handleSubmit = async () => {
    if (uploading) {
      setError("Wait for image upload to finish");
      return;
    }

    if (!form.animal.trim()) {
      setError("Animal required");
      return;
    }

    if (!form.lat || !form.lng) {
      setError("Location required");
      return;
    }

    try {
      await fetch("https://safestray-backend.onrender.com/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      alert("Report submitted!");
      setError("");

    } catch {
      setError("Submit failed !");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="outer-container">
        <div className="content-card">
          <div className="inner-box visible">

            <h1>Report a Stray</h1>
            <p className="subtitle">Help animals in need</p>

            {error && <p className="error-text">{error}</p>}

            <input
              className="input"
              name="animal"
              placeholder="Animal type"
              onChange={handleChange}
            />

            <textarea
              className="input"
              name="description"
              placeholder="Description"
              onChange={handleChange}
            />


            <label className="btn">
              📸 Upload Photo
              <input type="file" accept="image/*" onChange={handleImage} hidden />
            </label>


            {fileName && (
  <p
    className="file-link"
    style={{
      cursor: "pointer",
      textDecoration: "underline"
    }}
    onClick={() => {
      if (form.image) {
        window.open(
          `https://safestray-backend.onrender.com/uploads/${form.image}`,
          "_blank"
        );
      }
    }}
  >
    📸 {fileName} (click to preview)
  </p>
)}


            {uploading && (
              <div style={{ width: "100%" }}>
                <div style={{
                  width: `${progress}%`,
                  height: "8px",
                  background: "#9d4edd"
                }} />
                <p className="subtitle">{progress}% uploading...</p>
              </div>
            )}


            {form.lat && (
              <p className="subtitle">
                📍 {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
              </p>
            )}

            <button
              className="btn"
              onClick={handleSubmit}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Submit Report"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;