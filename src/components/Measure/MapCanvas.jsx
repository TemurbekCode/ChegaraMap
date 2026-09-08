import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polygon, Polyline, ZoomControl, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { edgeLabels } from "../../utils/geometry.js";

const vertexIcon = L.divIcon({
  className: "",
  html: '<div class="vertex-dot" style="width:14px;height:14px;"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

function labelIcon(text) {
  return L.divIcon({
    className: "",
    html: `<div class="edge-label">${text}</div>`,
    iconSize: null
  });
}

// Hands the underlying Leaflet map instance up to the parent (Measure),
// which needs it for search flyTo, getCenter() on finish, and fitBounds()
// when loading a saved measurement.
function MapRefBridge({ onReady }) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  return null;
}

function ClickHandler({ onMapClick, disabled }) {
  useMapEvents({
    click(e) {
      if (!disabled) onMapClick(e.latlng);
    }
  });
  return null;
}

export default function MapCanvas({ points, finished, mapStyle, onMapClick, onMapReady }) {
  const latlngs = points.map((p) => [p.lat, p.lng]);
  const labels = edgeLabels(points, finished);

  return (
    <MapContainer center={[39.627, 66.975]} zoom={13} zoomControl={false} className="map-instance">
      <MapRefBridge onReady={onMapReady} />

      {mapStyle === "satellite" ? (
        <TileLayer
          key="satellite"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri"
          maxZoom={19}
        />
      ) : (
        <TileLayer
          key="standard"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          maxZoom={19}
        />
      )}

      <ZoomControl position="bottomright" />
      <ClickHandler onMapClick={onMapClick} disabled={finished} />

      {points.map((p, i) => (
        <Marker key={`v-${i}`} position={[p.lat, p.lng]} icon={vertexIcon} keyboard={false} />
      ))}

      {points.length >= 2 &&
        (finished ? (
          <Polygon positions={latlngs} pathOptions={{ color: "#2F6F4E", weight: 2.5, fillColor: "#2F6F4E", fillOpacity: 0.12 }} />
        ) : (
          <Polyline positions={latlngs} pathOptions={{ color: "#2F6F4E", weight: 2.5, dashArray: "6 6" }} />
        ))}

      {labels.map((lbl, i) => (
        <Marker key={`l-${i}`} position={lbl.pos} icon={labelIcon(lbl.text)} interactive={false} keyboard={false} />
      ))}
    </MapContainer>
  );
}
