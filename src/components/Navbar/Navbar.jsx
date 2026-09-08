import { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import "./Navbar.scss";

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path className="brand-mark-path" d="M5 22L9 7L23 9L21 24L5 22Z" stroke="#2F6F4E" strokeWidth="1.8" strokeLinejoin="round" />
      <circle className="brand-mark-dot d1" cx="5" cy="22" r="2" fill="#2F6F4E" />
      <circle className="brand-mark-dot d2" cx="9" cy="7" r="2" fill="#2F6F4E" />
      <circle className="brand-mark-dot d3" cx="23" cy="9" r="2" fill="#2F6F4E" />
      <circle className="brand-mark-dot d4" cx="21" cy="24" r="2" fill="#2F6F4E" />
    </svg>
  );
}

export default function Navbar() {
  const { t, view, setView, lang, setLang, requestMeasure } = useApp();
  const [open, setOpen] = useState(false);

  function go(v) {
    setView(v);
    setOpen(false);
  }

  function goAnchor(id) {
    setView("home");
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 30);
  }

  function goMeasure() {
    setOpen(false);
    requestMeasure(() => setView("measure"));
  }

  return (
    <header className="topbar">
      <button className="brand" onClick={() => go("home")} aria-label="Chegara">
        <BrandMark />
        <span className="brand-name">Chegara</span>
      </button>

      {/* backdrop for the mobile slide-in drawer */}
      <div className={`nav-backdrop${open ? " open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />

      <nav className={`nav-links${open ? " open" : ""}`} aria-label="Main">
        <button className="nav-drawer-close" aria-label="Close menu" onClick={() => setOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <button className={`nav-btn${view === "home" ? " active" : ""}`} onClick={() => go("home")}>
          {t("nav.home")}
        </button>
        <button className="nav-btn" onClick={() => goAnchor("how-it-works")}>
          {t("nav.how")}
        </button>
        <button className="nav-btn" onClick={() => goAnchor("features")}>
          {t("nav.features")}
        </button>
        <button className={`nav-btn${view === "settings" ? " active" : ""}`} onClick={() => go("settings")}>
          {t("nav.settings")}
        </button>
      </nav>

      <div className="topbar-actions">
        {/* <button className="btn btn-primary btn-cta" onClick={goMeasure}>
          {t("nav.cta")}
        </button> */}
        <button className="nav-toggle" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="#182420" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
