// Live place search + real administrative/settlement boundaries via the
// public Nominatim (OpenStreetMap) API. This is what makes "any village or
// city in Central Asia" actually work — a hand-written list could never
// cover that; Nominatim already indexes everything OSM contributors have
// mapped, worldwide, including small qishloqs/mahallas where OSM has data.
//
// Fair-use note: the public Nominatim instance is for light, non-commercial
// use only (max ~1 request/second, no bulk/heavy traffic — see
// https://operations.osmfoundation.org/policies/nominatim/). If this app
// gets real production traffic, self-host Nominatim or switch to a paid
// geocoding provider (Google Places, Mapbox, LocationIQ, etc).

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

// Biased toward Central Asia, not restricted to it — if nothing matches
// well in these countries, widen or drop this param.
const CENTRAL_ASIA_COUNTRY_CODES = "uz,kz,kg,tj,tm";

export function boundaryColorForLevel(level) {
    if (level === "mahalla") return "#A85A2A"; // clay — village / neighborhood level
    if (level === "district") return "#3B6E91"; // steel blue — district level
    return "#5B6E63"; // muted green-gray — city / region level
}

function levelFromAddressType(addresstype, type) {
    const smallTypes = ["village", "hamlet", "suburb", "neighbourhood", "quarter", "isolated_dwelling"];
    const districtTypes = ["county", "district", "state_district", "municipality"];
    if (smallTypes.includes(addresstype) || smallTypes.includes(type)) return "mahalla";
    if (districtTypes.includes(addresstype) || districtTypes.includes(type)) return "district";
    return "city";
}

// Rough zoom pick from the bounding box size — smaller box = tighter zoom.
function zoomFromBoundingBox(bbox) {
    if (!bbox || bbox.length !== 4) return 13;
    const [south, north, west, east] = bbox.map(Number);
    const span = Math.max(Math.abs(north - south), Math.abs(east - west));
    if (span > 2) return 7;
    if (span > 0.5) return 9;
    if (span > 0.15) return 11;
    if (span > 0.05) return 13;
    if (span > 0.015) return 14;
    return 16;
}

// GeoJSON uses [lng, lat]; Leaflet wants [lat, lng]. Handles Polygon and
// MultiPolygon transparently — Leaflet's <Polygon> accepts nested ring/polygon
// arrays natively, so no flattening is needed here.
function toLeafletPositions(geojson) {
    if (!geojson) return null;
    if (geojson.type === "Polygon") {
        return geojson.coordinates.map((ring) => ring.map(([lng, lat]) => [lat, lng]));
    }
    if (geojson.type === "MultiPolygon") {
        return geojson.coordinates.map((poly) => poly.map((ring) => ring.map(([lng, lat]) => [lat, lng])));
    }
    return null; // Point/LineString or missing — we still fly to it, just no outline
}

let requestCounter = 0;

export async function searchPlacesOnline(query, { signal } = {}) {
    const q = query.trim();
    if (!q) return [];

    const params = new URLSearchParams({
        format: "jsonv2",
        q,
        polygon_geojson: "1",
        addressdetails: "1",
        limit: "6",
        countrycodes: CENTRAL_ASIA_COUNTRY_CODES,
        "accept-language": "uz,en"
    });

    const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
        signal,
        headers: { Accept: "application/json" }
    });

    if (!res.ok) throw new Error(`Nominatim ${res.status}`);
    const data = await res.json();

    return data.map((item) => ({
        id: `osm-${item.osm_type}-${item.osm_id}-${requestCounter++}`,
        name: item.name || item.display_name.split(",")[0],
        region: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        zoom: zoomFromBoundingBox(item.boundingbox),
        level: levelFromAddressType(item.addresstype, item.type),
        boundary: toLeafletPositions(item.geojson)
    }));
}