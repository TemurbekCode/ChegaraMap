import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import MapCanvas from "./MapCanvas.jsx";
import SearchBar from "./SearchBar.jsx";
import MapControls from "./MapControls.jsx";
import ResultPanel from "./ResultPanel.jsx";
import { computeResult } from "../../utils/geometry.js";
import { loadSavedMeasurements, persistSavedMeasurements } from "../../utils/storage.js";
import "./Measure.scss";

export default function Measure() {
  const { t, view, mapStyle, showToast, askConfirm } = useApp();

  const [points, setPoints] = useState([]);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [savedList, setSavedList] = useState(() => loadSavedMeasurements());

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

  return (
    <div className="measure-stage">
      <MapCanvas points={points} finished={finished} mapStyle={mapStyle} onMapClick={handleMapClick} onMapReady={handleMapReady} />

      <SearchBar mapInstance={mapReady ? mapInstanceRef.current : null} />

      <div className="badge-estimate">
        <span className="dot" aria-hidden="true"></span>
        <span>{t("measure.badge")}</span>
      </div>

      {points.length === 0 && (
        <div className="map-empty-hint">
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
