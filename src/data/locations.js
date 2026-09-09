// OFFLINE FALLBACK ONLY. The real search now goes through
// src/utils/geocode.js (live OpenStreetMap/Nominatim data — covers any
// mapped village, mahalla, town or city across Central Asia). This tiny
// list is just what SearchBar shows instantly before the network reply
// comes back, and what it falls back to if the device has no internet.
export const DEMO_LOCATIONS = [
  { name: "Toshkent", region: "Uzbekistan", lat: 41.2995, lng: 69.2401, zoom: 12, level: "city", keywords: ["tashkent"] },
  { name: "Samarqand", region: "Samarqand region, Uzbekistan", lat: 39.627, lng: 66.975, zoom: 13, level: "city" },
  { name: "Urgut", region: "Samarqand viloyati, Urgut tumani", lat: 39.4, lng: 67.2333, zoom: 14, level: "district" },
  { name: "Buxoro", region: "Bukhara region, Uzbekistan", lat: 39.7747, lng: 64.4286, zoom: 13, level: "city" },
  { name: "Andijon", region: "Andijan region, Uzbekistan", lat: 40.7821, lng: 72.3442, zoom: 13, level: "city" },
  { name: "Namangan", region: "Namangan region, Uzbekistan", lat: 40.9983, lng: 71.6726, zoom: 13, level: "city" },
  { name: "Nukus", region: "Qoraqalpog'iston, Uzbekistan", lat: 42.4531, lng: 59.6103, zoom: 13, level: "city" },
  { name: "Qarshi", region: "Qashqadaryo, Uzbekistan", lat: 38.8606, lng: 65.7891, zoom: 13, level: "city" },
  { name: "Termiz", region: "Surxondaryo, Uzbekistan", lat: 37.2242, lng: 67.2783, zoom: 13, level: "city" },
  { name: "Farg'ona", region: "Farg'ona viloyati, Uzbekistan", lat: 40.3864, lng: 71.7864, zoom: 13, level: "city" },
  // Central Asia beyond Uzbekistan — also just quick offline anchors
  { name: "Almaty", region: "Kazakhstan", lat: 43.2389, lng: 76.8897, zoom: 12, level: "city" },
  { name: "Bishkek", region: "Kyrgyzstan", lat: 42.8746, lng: 74.5698, zoom: 12, level: "city" },
  { name: "Dushanbe", region: "Tajikistan", lat: 38.5598, lng: 68.787, zoom: 12, level: "city" },
  { name: "Ashgabat", region: "Turkmenistan", lat: 37.9601, lng: 58.3261, zoom: 12, level: "city" }
];

export function searchLocations(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/[\s,]+/).filter(Boolean);

  return DEMO_LOCATIONS.filter((loc) => {
    const haystacks = [loc.name.toLowerCase(), ...(loc.keywords || []).map((k) => k.toLowerCase())];
    return haystacks.some((h) => h.includes(q) || tokens.some((tok) => h.includes(tok)));
  }).slice(0, 6);
}