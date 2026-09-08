import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { searchLocations } from "../../data/locations.js";

export default function SearchBar({ mapInstance, onSelectLocation }) {
  const { t, showToast } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function runSearch(value) {
    setQuery(value);
    const found = searchLocations(value);
    setResults(found);
    setOpen(value.trim().length > 0);
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
      } else {
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
        {results.length === 0
          ? query.trim() && <div className="suggestion-empty">{t("err.searchNoResults")}</div>
          : results.map((loc) => (
              <div key={loc.name} className="suggestion" role="option" onClick={() => selectLocation(loc)}>
                <span>{loc.name}</span>
                <small>{loc.region}</small>
              </div>
            ))}
      </div>
    </div>
  );
}
