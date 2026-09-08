import { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import "./Navbar.scss";

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path d="M5 22L9 7L23 9L21 24L5 22Z" stroke="#2F6F4E" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="5" cy="22" r="2" fill="#2F6F4E" />
      <circle cx="9" cy="7" r="2" fill="#2F6F4E" />
      <circle cx="23" cy="9" r="2" fill="#2F6F4E" />
      <circle cx="21" cy="24" r="2" fill="#2F6F4E" />
    </svg>
  );
}

export default function Navbar() {
  const { t, view, setView, lang, setLang } = useApp();
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

  return (
    <header className="topbar">
      <button className="brand" onClick={() => go("home")} aria-label="Chegara">
        <BrandMark />
        <span className="brand-name">Chegara</span>
      </button>

      <nav className={`nav-links${open ? " open" : ""}`} aria-label="Main">
        <button className={`nav-btn${view === "home" ? " active" : ""}`} onClick={() => go("home")}>
          {t("nav.home")}
        </button>
        <button className="nav-btn" onClick={() => goAnchor("how-it-works")}>
          {t("nav.how")}
        </button>
        <button className="nav-btn" onClick={() => goAnchor("features")}>
          {t("nav.features")}
        </button>
        <button className={`nav-btn${view === "measure" ? " active" : ""}`} onClick={() => go("measure")}>
          {t("nav.measure")}
        </button>
        <button className={`nav-btn${view === "settings" ? " active" : ""}`} onClick={() => go("settings")}>
          {t("nav.settings")}
        </button>
      </nav>

      <div className="topbar-actions">
        <div className="lang-pill" role="group" aria-label="Language">
          <button className={lang === "uz" ? "active" : ""} onClick={() => setLang("uz")}>
            O‘zbekcha
          </button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
            English
          </button>
        </div>
        <button className="btn btn-primary btn-cta" onClick={() => go("measure")}>
          {t("nav.cta")}
        </button>
        <button className="nav-toggle" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="#182420" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
