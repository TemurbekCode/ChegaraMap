import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import MapCanvas from "./MapCanvas.jsx";
import SearchBar from "./SearchBar.jsx";
import MapControls from "./MapControls.jsx";
import ResultPanel from "./ResultPanel.jsx";
import { computeResult } from "../../utils/geometry.js";
import { loadSavedMeasurements, persistSavedMeasurements } from "../../utils/storage.js";
import { boundaryColorForLevel } from "../../data/locations.js";
import "./Measure.scss";

const HINT_VISIBLE_MS = 4200;
const HINT_FADE_MS = 450;

export default function Measure() {
  const { t, view, mapStyle, showToast, askConfirm } = useApp();

  const [points, setPoints] = useState([]);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [savedList, setSavedList] = useState(() => loadSavedMeasurements());

  // the searched place's outline (district/city or mahalla), drawn in its own
  // color so it never gets confused with the user's own measurement polygon
  const [locationBoundary, setLocationBoundary] = useState(null);

  // the "start measuring" bubble: bounces in like a notification, then
  // fades itself out after a few seconds so it never blocks the map for long
  const [hintVisible, setHintVisible] = useState(false);
  const [hintLeaving, setHintLeaving] = useState(false);

  const mapInstanceRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const handleMapReady = useCallback((map) => {
    mapInstanceRef.current = map;
    setMapReady(true);
  }, []);

  // Leaflet initializes while this view may be hidden (display:none) —
  // its container has zero size then, so tiles render wrong until we
  // nudge Leaflet to recheck its size once the view actually becomes visible.
  useEffect(() => {
    if (view === "measure" && mapInstanceRef.current) {
      const id = setTimeout(() => mapInstanceRef.current.invalidateSize(), 60);
      return () => clearTimeout(id);
    }
  }, [view]);

  // empty-state hint: reappears (with its bounce-in) any time the canvas
  // goes back to zero points, and quietly fades out on its own after a bit
  useEffect(() => {
    if (points.length === 0) {
      setHintVisible(true);
      setHintLeaving(false);
      const t1 = setTimeout(() => setHintLeaving(true), HINT_VISIBLE_MS);
      const t2 = setTimeout(() => setHintVisible(false), HINT_VISIBLE_MS + HINT_FADE_MS);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    setHintVisible(false);
    setHintLeaving(false);
  }, [points.length]);

  function handleMapClick(latlng) {
    if (finished) return;
    setPoints((prev) => [...prev, { lat: latlng.lat, lng: latlng.lng }]);
  }

  function handleUndo() {
    if (finished) {
      setFinished(false);
      setPanelOpen(false);
    }
    setPoints((prev) => prev.slice(0, -1));
  }

  function doClear() {
    setPoints([]);
    setFinished(false);
    setResult(null);
    setPanelOpen(false);
    setLocationBoundary(null);
  }

  function handleClear() {
    if (finished && points.length >= 3) {
      askConfirm(doClear);
    } else {
      doClear();
    }
  }

  function handleFinish() {
    if (points.length < 3) {
      showToast(t("err.needThreePoints"));
      return;
    }
    setFinished(true);
    const center = mapInstanceRef.current ? mapInstanceRef.current.getCenter() : { lat: points[0].lat, lng: points[0].lng };
    const r = computeResult(points, center);
    setResult(r);
    setPanelOpen(true);
  }

  function handleSave() {
    if (!result) return;
    const entry = {
      id: Date.now(),
      name: `Uchastka #${savedList.length + 1}`,
      location: `${result.center.lat.toFixed(4)}, ${result.center.lng.toFixed(4)}`,
      areaM2: Math.round(result.areaM2),
      sotix: Number(result.sotix.toFixed(2)),
      perimeterM: Math.round(result.perimeterM * 10) / 10,
      points: result.points,
      createdAt: new Date().toISOString()
    };
    const nextList = [entry, ...savedList];
    const ok = persistSavedMeasurements(nextList);
    if (!ok) {
      showToast(t("err.saveFailed"));
      return;
    }
    setSavedList(nextList);
    showToast(t("toast.saved"));
  }

  function handleShare() {
    if (!result) return;
    const text = [
      t("share.title"),
      `${t("share.location")}: ${result.center.lat.toFixed(4)}, ${result.center.lng.toFixed(4)}`,
      `${t("share.area")}: ${result.sotix.toFixed(2)} sotix (${Math.round(result.areaM2)} m²)`,
      `${t("share.perimeter")}: ${result.perimeterM >= 1000 ? (result.perimeterM / 1000).toFixed(2) + " km" : Math.round(result.perimeterM * 10) / 10 + " m"}`,
      t("share.footer")
    ].join("\n");

    if (navigator.share) {
      navigator.share({ title: "Chegara", text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => showToast(t("toast.copied")))
        .catch(() => showToast(t("err.shareFailed")));
    } else {
      showToast(t("err.shareFailed"));
    }
  }

  function handleLoadSaved(entry) {
    const loadedPoints = entry.points.map((p) => ({ lat: p.lat, lng: p.lng }));
    setPoints(loadedPoints);
    setFinished(true);
    setLocationBoundary(null);
    const center = mapInstanceRef.current ? mapInstanceRef.current.getCenter() : loadedPoints[0];
    const r = computeResult(loadedPoints, center);
    setResult(r);
    setPanelOpen(true);

    if (mapInstanceRef.current && loadedPoints.length) {
      // Leaflet's fitBounds happily accepts a plain array of [lat,lng] pairs
      // and computes the bounding box itself — no need to build an L.latLngBounds by hand.
      mapInstanceRef.current.fitBounds(
        loadedPoints.map((p) => [p.lat, p.lng]),
        { padding: [60, 60] }
      );
    }
    showToast(t("toast.loaded"));
  }

  function handleDeleteSaved(id) {
    const nextList = savedList.filter((x) => x.id !== id);
    persistSavedMeasurements(nextList);
    setSavedList(nextList);
    showToast(t("toast.deleted"));
  }

  // called by SearchBar when a demo location with a known outline is chosen —
  // draws that outline so the searched place is obvious and hard to confuse
  // with a neighboring one
  function handleSelectLocation(loc) {
    if (loc.boundary) {
      setLocationBoundary({
        positions: loc.boundary,
        color: boundaryColorForLevel(loc.level)
      });
    } else {
      setLocationBoundary(null);
    }
  }

  return (
    <div className="measure-stage">
      <MapCanvas
        points={points}
        finished={finished}
        mapStyle={mapStyle}
        locationBoundary={locationBoundary}
        onMapClick={handleMapClick}
        onMapReady={handleMapReady}
      />

      <SearchBar mapInstance={mapReady ? mapInstanceRef.current : null} onSelectLocation={handleSelectLocation} />

      <div className="badge-estimate">
        <span className="dot" aria-hidden="true"></span>
        <span>{t("measure.badge")}</span>
      </div>

      {hintVisible && (
        <div className={`map-empty-hint${hintLeaving ? " hint-leaving" : ""}`}>
          <strong>{t("measure.emptyTitle")}</strong>
          <span>{t("measure.emptyText")}</span>
        </div>
      )}

      <MapControls pointCount={points.length} finished={finished} onUndo={handleUndo} onClear={handleClear} onFinish={handleFinish} />

      <ResultPanel
        open={panelOpen}
        result={result}
        savedList={savedList}
        onClose={() => setPanelOpen(false)}
        onSave={handleSave}
        onShare={handleShare}
        onLoadSaved={handleLoadSaved}
        onDeleteSaved={handleDeleteSaved}
      />
    </div>
  );
}
