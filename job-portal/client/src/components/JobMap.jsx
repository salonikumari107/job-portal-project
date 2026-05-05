import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { initialJobs } from '../data/mockData';
import L from 'leaflet';

// Leaflet marker icon fix (taaki marker dikhayi de)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const JobMap = () => {
  const centerPosition = [20.5937, 78.9629]; // India Center

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={centerPosition} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {initialJobs.map((job) => (
          <Marker key={job.id} position={job.position}>
            <Popup>
              <div style={{ minWidth: "150px" }}>
                <h3 style={{ margin: "0", color: "#2563eb" }}>{job.title}</h3>
                <p style={{ margin: "5px 0", fontWeight: "bold" }}>{job.company}</p>
                <div style={{ fontSize: "12px" }}>
                   <p>📍 {job.location}</p>
                   <p>💰 {job.salary}</p>
                   <p>🏢 {job.mode}</p>
                </div>
                <button style={{ 
                  backgroundColor: "#2563eb", 
                  color: "white", 
                  border: "none", 
                  padding: "5px 10px", 
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "5px"
                }}>
                  Apply Now
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default JobMap;