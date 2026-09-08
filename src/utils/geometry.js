import * as turf from "@turf/turf";

// Great-circle distance between two {lat,lng} points, in meters.
export function haversine(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function metersLabel(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m * 10) / 10} m`;
}

// Midpoint + distance label for each polygon/polyline edge, for map overlays.
export function edgeLabels(points, closed) {
  const n = points.length;
  if (n < 2) return [];
  const count = closed ? n : n - 1;
  const labels = [];
  for (let i = 0; i < count; i++) {
    const a = points[i];
    const b = points[(i + 1) % n];
    const dist = haversine(a, b);
    labels.push({
      pos: [(a.lat + b.lat) / 2, (a.lng + b.lng) / 2],
      text: metersLabel(dist)
    });
  }
  return labels;
}

// Full measurement result for a finished polygon: geodesic area (turf),
// perimeter + side lengths (haversine), and an approximate bounding-box size.
// Never computed from raw lat/lng degrees.
export function computeResult(points, center) {
  const ring = points.map((p) => [p.lng, p.lat]);
  ring.push(ring[0]);
  const poly = turf.polygon([ring]);
  const areaM2 = turf.area(poly);

  let perimeterM = 0;
  const sides = [];
  for (let i = 0; i < points.length; i++) {
    const d = haversine(points[i], points[(i + 1) % points.length]);
    perimeterM += d;
    sides.push(d);
  }

  const bbox = turf.bbox(poly); // [minX, minY, maxX, maxY]
  const widthM = turf.distance([bbox[0], bbox[1]], [bbox[2], bbox[1]], { units: "kilometers" }) * 1000;
  const heightM = turf.distance([bbox[0], bbox[1]], [bbox[0], bbox[3]], { units: "kilometers" }) * 1000;

  return {
    areaM2,
    sotix: areaM2 / 100,
    perimeterM,
    widthM,
    heightM,
    sides,
    points: points.slice(),
    center: { lat: center.lat, lng: center.lng }
  };
}
