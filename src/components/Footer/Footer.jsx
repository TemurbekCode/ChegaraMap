import { useApp } from "../../context/AppContext.jsx";
import "./Footer.scss";

export default function Footer() {
  const { t, lang, setLang, setView, requestMeasure } = useApp();
  const year = new Date().getFullYear();

  function go(v) {
    setView(v);
  }
  function goAnchor(id) {
    setView("home");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 30);
  }
  function goMeasure() {
    requestMeasure(() => setView("measure"));
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand" style={{ cursor: "default" }}>
            <svg className="brand-mark" viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <path d="M5 22L9 7L23 9L21 24L5 22Z" stroke="#2F6F4E" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="5" cy="22" r="2" fill="#2F6F4E" />
              <circle cx="9" cy="7" r="2" fill="#2F6F4E" />
              <circle cx="23" cy="9" r="2" fill="#2F6F4E" />
              <circle cx="21" cy="24" r="2" fill="#2F6F4E" />
            </svg>
            <span className="brand-name">Chegara</span>
          </div>
          <p>{t("footer.tagline")}</p>
        </div>

        <div className="footer-links">
          <button className="footer-link" onClick={() => go("home")}>
            {t("nav.home")}
          </button>
          <button className="footer-link" onClick={() => goAnchor("how-it-works")}>
            {t("nav.how")}
          </button>
          <button className="footer-link" onClick={goMeasure}>
            {t("nav.measure")}
          </button>
          <button className="footer-link" onClick={() => go("settings")}>
            {t("nav.settings")}
          </button>
        </div>

        <div className="lang-pill">
          <button className={lang === "uz" ? "active" : ""} onClick={() => setLang("uz")}>
            O‘zbekcha
          </button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
            English
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t("footer.disclaimer")}</p>
        <p>&copy; {year} Chegara</p>
      </div>
    </footer>
  );
}
