import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function App() {
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState(null);
  const [cases, setCases] = useState([]);
useEffect(() => {
  fetch("http://localhost:5000/cases")
    .then((res) => res.json())
    .then((data) => setCases(data));
}, []);
  // 📍 Get Location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        alert("Location captured!");
      },
      () => {
        alert("Location permission denied");
      }
    );
  };

  // 💾 Save Report
  const submit = async () => {
  if (!desc || !location) {
    alert("Please add description and location");
    return;
  }
  const updated = await fetch("http://localhost:5000/cases");
const data = await updated.json();
setCases(data);

  const res = await fetch("http://localhost:5000/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: desc,
      lat: location.lat,
      lng: location.lng,
    }),
  });

  await res.json();

  alert("🚨 Report submitted!");

  setDesc("");
  setLocation(null);
};



  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🐾 SafeStray</h1>

      <h2>🚨 Report Animal</h2>

      <textarea
        placeholder="Describe the situation..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        style={{ width: "100%", height: "80px" }}
      />

      <br /><br />

      <button onClick={getLocation}>📍 Get Location</button>

      <br /><br />

      <button onClick={submit}>🚨 Submit Report</button>

      <br /><br />

      {location && (
        <p>
          📌 Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}

      <hr />

      <h2>📋 Reported Cases</h2>

      {cases.length === 0 ? (
        <p>No cases yet</p>
      ) : (
        cases.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "8px",
            }}
          >
            <p><strong>Description:</strong> {c.description}</p>
            <p><strong>Status:</strong> {c.status}</p>
          </div>
        ))
      )}

      <hr />

      <h2>🗺️ Nearby Help</h2>

      <div style={{ height: "300px", width: "100%" }}>
        {location ? (
          <MapContainer
            key={location.lat}
            center={[location.lat, location.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Your location */}
            <Marker position={[location.lat, location.lng]}>
              <Popup>📍 You are here</Popup>
            </Marker>

            {/* NGOs */}
            <Marker position={[19.0760, 72.8777]}>
              <Popup>🐾 Animal NGO</Popup>
            </Marker>

            <Marker position={[19.0820, 72.8800]}>
              <Popup>🏥 Vet Clinic</Popup>
            </Marker>

            <Marker position={[19.0700, 72.8700]}>
              <Popup>🏠 Shelter</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Click "Get Location" to load map</p>
        )}
      </div>
    </div>
  );
}



export default App;