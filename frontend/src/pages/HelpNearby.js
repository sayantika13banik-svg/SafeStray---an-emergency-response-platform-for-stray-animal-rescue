import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Home.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function HelpNearby() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/cases")
      .then((res) => res.json())
      .then((data) => setCases(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="outer-container">
        <div className="content-card">
          <div className="inner-box visible">

            <h1>🗺️ Nearby Help</h1>
            <p className="subtitle">
              Stray animals reported around you
            </p>

            <div style={{ height: "400px", width: "100%", borderRadius: "10px", overflow: "hidden" }}>
              <MapContainer
                center={[19.0760, 72.8777]} // Mumbai default
                zoom={12}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {cases.map((c, index) => (
                  <Marker key={index} position={[c.lat, c.lng]}>
                    <Popup>
                      <b>{c.animal || "Animal"}</b><br />
                      {c.description}<br />
                      Status: {c.status}
                    </Popup>
                  </Marker>
                ))}

              </MapContainer>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpNearby;