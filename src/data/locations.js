// Demo location dataset. Swap searchLocations() for a real geocoder
// (e.g. Nominatim, Google Places) later without touching any component.
//
// NOTE ON "boundary": these polygons are illustrative placeholders drawn by
// hand for the demo — they are NOT surveyed administrative boundaries. For
// production, replace them with real boundary geometry (e.g. an OSM/Nominatim
// polygon lookup, or Uzbekistan's official SOATO/GADM administrative data).
export const DEMO_LOCATIONS = [
  {
    name: "Toshkent",
    region: "Uzbekistan",
    lat: 41.2995,
    lng: 69.2401,
    zoom: 12,
    level: "city",
    keywords: ["tashkent"]
  },
  {
    name: "Samarqand",
    region: "Samarqand region, Uzbekistan",
    lat: 39.627,
    lng: 66.975,
    zoom: 13,
    level: "city",
    boundary: [
      [39.655, 66.93],
      [39.655, 67.02],
      [39.6, 67.02],
      [39.6, 66.93]
    ]
  },
  {
    name: "Urgut",
    region: "Samarqand viloyati, Urgut tumani",
    lat: 39.4,
    lng: 67.2333,
    zoom: 14,
    level: "district",
    keywords: ["urgut tumani", "urgut shahri"],
    // Rough town-level outline — placeholder, not a surveyed district border.
    boundary: [
      [39.418, 67.205],
      [39.418, 67.262],
      [39.382, 67.262],
      [39.382, 67.205]
    ]
  },
  {
    name: "Kengash",
    region: "Urgut tumani, Samarqand viloyati (mahalla)",
    lat: 39.409,
    lng: 67.246,
    zoom: 15,
    level: "mahalla",
    keywords: ["kengash mfy", "urgut kengash", "kengash mahallasi"],
    // Small illustrative neighborhood outline within Urgut — placeholder only.
    boundary: [
      [39.4125, 67.241],
      [39.4125, 67.251],
      [39.4055, 67.251],
      [39.4055, 67.241]
    ]
  },
  {
    name: "Buxoro",
    region: "Bukhara region, Uzbekistan",
    lat: 39.7747,
    lng: 64.4286,
    zoom: 13,
    level: "city"
  },
  {
    name: "Andijon",
    region: "Andijan region, Uzbekistan",
    lat: 40.7821,
    lng: 72.3442,
    zoom: 13,
    level: "city"
  },
  {
    name: "Namangan",
    region: "Namangan region, Uzbekistan",
    lat: 40.9983,
    lng: 71.6726,
    zoom: 13,
    level: "city"
  },
  {
    name: "Samarqand Region",
    region: "Uzbekistan",
    lat: 39.65,
    lng: 66.95,
    zoom: 9,
    level: "region",
    keywords: ["samarqand viloyati"]
  }
];

// Boundary line color by administrative level, so a district/city outline is
// always visually distinct from a smaller mahalla/neighborhood outline —
// and both stay distinct from the user's own moss-green measurement polygon.
export function boundaryColorForLevel(level) {
  if (level === "mahalla") return "#A85A2A"; // clay
  if (level === "district") return "#3B6E91"; // steel blue
  return "#5B6E63"; // muted green-gray for city/region
}

// Token-based matching: "Urgut Kengash" splits into ["urgut","kengash"], so it
// matches the "Kengash" entry even though no single field contains the full
// two-word phrase. Also checks each location's optional keyword aliases.
export function searchLocations(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/[\s,]+/).filter(Boolean);

  return DEMO_LOCATIONS.filter((loc) => {
    const haystacks = [loc.name.toLowerCase(), ...(loc.keywords || []).map((k) => k.toLowerCase())];
    return haystacks.some((h) => h.includes(q) || tokens.some((tok) => h.includes(tok)));
  }).slice(0, 6);
}
