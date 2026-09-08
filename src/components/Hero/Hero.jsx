import { useApp } from "../../context/AppContext.jsx";
import "./Hero.scss";

export default function Hero() {
  const { t, setView, requestMeasure } = useApp();

  return (
    <div className="hero">
      <div>
        <div className="hero-eyebrow">{t("home.eyebrow")}</div>
        <h1>{t("home.h1")}</h1>
        <p className="hero-sub">{t("home.sub")}</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => requestMeasure(() => setView("measure"))}>
            {t("home.cta1")}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            {t("home.cta2")}
          </button>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <svg className="plot-sketch" viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="400" height="320" rx="20" fill="#EFEBDD" />
          <path d="M56 86 L268 52 L344 166 L116 204 Z" stroke="#2F6F4E" strokeWidth="3" fill="#2F6F4E" fillOpacity="0.1" />
          <circle cx="56" cy="86" r="7" fill="#2F6F4E" stroke="#fff" strokeWidth="3" />
          <circle cx="268" cy="52" r="7" fill="#2F6F4E" stroke="#fff" strokeWidth="3" />
          <circle cx="344" cy="166" r="7" fill="#2F6F4E" stroke="#fff" strokeWidth="3" />
          <circle cx="116" cy="204" r="7" fill="#2F6F4E" stroke="#fff" strokeWidth="3" />
          <line x1="56" y1="86" x2="268" y2="52" stroke="#A85A2A" strokeWidth="1.5" strokeDasharray="5 5" />
          <text x="128" y="60" fontFamily="Inter" fontSize="17" fontWeight="600" fill="#6E3E17">
            20.1 m
          </text>
          <line x1="268" y1="52" x2="344" y2="166" stroke="#A85A2A" strokeWidth="1.5" strokeDasharray="5 5" />
          <text x="352" y="112" fontFamily="Inter" fontSize="17" fontWeight="600" fill="#6E3E17">
            29.8 m
          </text>
          <rect x="16" y="228" width="368" height="76" rx="16" fill="#182420" />
          <line x1="200" y1="246" x2="200" y2="286" stroke="#3A453F" strokeWidth="1" />
          <text x="34" y="254" fontFamily="Inter" fontSize="12" fontWeight="600" fill="#9FB0A6" letterSpacing="0.04em">
            MAYDON
          </text>
          <text x="34" y="282" fontFamily="Fraunces" fontSize="22" fontWeight="600" fill="#fff">
            6.00 sotix
          </text>
          <text x="216" y="254" fontFamily="Inter" fontSize="12" fontWeight="600" fill="#9FB0A6" letterSpacing="0.04em">
            PERIMETR
          </text>
          <text x="216" y="282" fontFamily="Fraunces" fontSize="20" fontWeight="600" fill="#fff">
            100.1 m
          </text>
        </svg>
      </div>
    </div>
  );
}
