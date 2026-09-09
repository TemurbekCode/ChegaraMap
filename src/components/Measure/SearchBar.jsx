import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { searchLocations as searchOffline } from "../../data/locations.js";
import { searchPlacesOnline } from "../../utils/geocode.js";

const DEBOUNCE_MS = 500;

export default function SearchBar({ mapInstance, onSelectLocation }) {
  const { t, showToast } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // clean up any in-flight request/timer if the component unmounts
  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  function runSearch(value) {
    setQuery(value);
    const trimmed = value.trim();
    setOpen(trimmed.length > 0);

    // instant offline suggestions while the real (online) search is in flight
    setResults(searchOffline(trimmed));

    clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (!trimmed) {
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const online = await searchPlacesOnline(trimmed, { signal: controller.signal });
        setResults(online.length ? online : searchOffline(trimmed));
      } catch (err) {
        if (err.name !== "AbortError") {
          // no internet, or the public Nominatim instance is rate-limiting us —
          // silently fall back to the offline list rather than showing an error
          setResults(searchOffline(trimmed));
        }
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
  }

  function selectLocation(loc) {
    if (mapInstance) mapInstance.flyTo([loc.lat, loc.lng], loc.zoom, { duration: 0.9 });
    if (onSelectLocation) onSelectLocation(loc);
    setQuery(loc.name);
    setOpen(false);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      if (results.length) {
        selectLocation(results[0]);
      } else if (!loading) {
        showToast(t("err.searchNoResults"));
      }
    }
  }

  return (
    <div className="search-bar" ref={wrapRef}>
      <div className="search-input-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          placeholder={t("measure.searchPh")}
          autoComplete="off"
          aria-label="Search location"
          onChange={(e) => runSearch(e.target.value)}
          onFocus={() => query && setOpen(true)}
          onKeyDown={onKeyDown}
        />
      </div>

      <div className={`search-suggestions${open ? " open" : ""}`} role="listbox">
        {loading && <div className="suggestion-loading">{t("measure.searchingOnline")}</div>}
        {!loading && results.length === 0 && query.trim() && <div className="suggestion-empty">{t("err.searchNoResults")}</div>}
        {results.map((loc) => (
          <div key={loc.id || loc.name} className="suggestion" role="option" onClick={() => selectLocation(loc)}>
            <span>{loc.name}</span>
            <small>{loc.region}</small>
          </div>
        ))}
      </div>
    </div>
  );
}