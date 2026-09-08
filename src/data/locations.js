// Demo location dataset. Swap searchLocations() for a real geocoder
// (e.g. Nominatim, Google Places) later without touching any component.
export const DEMO_LOCATIONS = [
  { name: "Toshkent", region: "Uzbekistan", lat: 41.2995, lng: 69.2401, zoom: 12 },
  { name: "Samarqand", region: "Samarqand region, Uzbekistan", lat: 39.627, lng: 66.975, zoom: 13 },
  { name: "Urgut", region: "Samarqand region, Uzbekistan", lat: 39.4, lng: 67.2333, zoom: 14 },
  { name: "Buxoro", region: "Bukhara region, Uzbekistan", lat: 39.7747, lng: 64.4286, zoom: 13 },
  { name: "Andijon", region: "Andijan region, Uzbekistan", lat: 40.7821, lng: 72.3442, zoom: 13 },
  { name: "Namangan", region: "Namangan region, Uzbekistan", lat: 40.9983, lng: 71.6726, zoom: 13 },
  { name: "Samarqand Region", region: "Uzbekistan", lat: 39.65, lng: 66.95, zoom: 9 },
  { name: "Urgut District", region: "Samarqand region, Uzbekistan", lat: 39.4, lng: 67.25, zoom: 11 }
];

export function searchLocations(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const first = q.split(",")[0].trim();
  return DEMO_LOCATIONS.filter((loc) => {
    const n = loc.name.toLowerCase();
    return n.includes(q) || (first && n.includes(first));
  }).slice(0, 6);
}
