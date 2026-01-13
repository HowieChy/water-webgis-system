import React from "react";
import MapContainer from "../components/MapContainer";

const MapPage: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "calc(100vh - 112px)" }}>
      <MapContainer />
    </div>
  );
};

export default MapPage;
