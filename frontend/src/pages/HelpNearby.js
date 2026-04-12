import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Home.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});


function RecenterMap({ position }) {
  const map = useMap();
  map.setView(position, 13);
  return null;
}

function HelpNearby() {
  const [cases, setCases] = useState([]);
  const [position, setPosition] = useState(null);
  const [places, setPlaces] = useState([]);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        console.log("Location denied");
        setPosition([19.0760, 72.8777]); // fallback
      }
    );
  }, []);


  useEffect(() => {
    fetch("http://localhost:5000/cases")
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
  if (!position) return;

  const [lat, lng] = position;

  const query = `
    [out:json];
    (
      node["amenity"="veterinary"](around:10000,${lat},${lng});
      way["amenity"="veterinary"](around:10000,${lat},${lng});
      node["amenity"="animal_shelter"](around:10000,${lat},${lng});
      way["amenity"="animal_shelter"](around:10000,${lat},${lng});
    );
    out center;
  `;

  fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  })
    .then(res => res.json())
    .then(data => {
      console.log("PLACES:", data);

      // ✅ fallback if empty
      if (!data.elements || data.elements.length === 0) {
        setPlaces([
          {
            lat: lat + 0.01,
            lon: lng + 0.01,
            tags: { name: "Nearby Animal NGO", amenity: "fallback" }
          }
        ]);
      } else {
        setPlaces(data.elements);
      }
    })
    .catch(err => {
      console.error(err);

      // ✅ fallback if API fails
      setPlaces([
        {
          lat: lat + 0.01,
          lon: lng + 0.01,
          tags: { name: "Nearby Animal NGO", amenity: "fallback" }
        }
      ]);
    });

}, [position]);

  if (!position) {
    return (
      <p style={{ color: "white", textAlign: "center" }}>
        Loading map...
      </p>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="outer-container">
        <div className="content-card">
          <div className="inner-box visible">

            <h1>🗺️ Nearby Help</h1>
            <p className="subtitle">Animals & help near you</p>

            <div style={{ height: "400px", width: "100%" }}>
              <MapContainer center={position} zoom={13} style={{ height: "100%" }}>

                <RecenterMap position={position} />

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


                <Marker position={position}>
                  <Popup>📍 You are here</Popup>
                </Marker>


                {cases.map((c, i) => (
                  c.lat && c.lng && (
                    <Marker key={i} position={[c.lat, c.lng]}>
                      <Popup>
                        <b>{c.animal}</b><br />
                        {c.description}
                      </Popup>
                    </Marker>
                  )
                ))}


                {Array.isArray(places) &&
                  places.map((p, i) => {
                    const lat = p.lat || p.center?.lat;
                    const lng = p.lon || p.center?.lon;

                    if (!lat || !lng) return null;

                    return (
                      <Marker key={`place-${i}`} position={[lat, lng]}>
                        <Popup>
                          🐾 <b>{p.tags?.name || "Animal Help"}</b><br />
                          {p.tags?.amenity}
                        </Popup>
                      </Marker>
                    );
                  })}

              </MapContainer>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpNearby;