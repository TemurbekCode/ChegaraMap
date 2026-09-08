import { useApp } from "../../context/AppContext.jsx";
import "./Settings.scss";

export default function Settings() {
  const { t, lang, setLang, units, setUnits, mapStyle, setMapStyle } = useApp();

  return (
    <div className="settings-inner">
      <h1>{t("settings.title")}</h1>
      <p className="settings-intro">{t("settings.intro")}</p>

      <div className="settings-group">
        <h2>{t("settings.language")}</h2>
        <div className="option-row">
          <div>
            <div className="label">{t("settings.languageLabel")}</div>
          </div>
          <div className="seg">
            <button className={lang === "uz" ? "active" : ""} onClick={() => setLang("uz")}>
              O‘zbekcha
            </button>
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
              English
            </button>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h2>{t("settings.units")}</h2>
        <div className="option-row">
          <div>
            <div className="label">{t("settings.unitsLabel")}</div>
            <div className="hint">{t("settings.unitsHint")}</div>
          </div>
          <div className="seg">
            <button className={units === "sotix" ? "active" : ""} onClick={() => setUnits("sotix")}>
              sotix
            </button>
            <button className={units === "m2" ? "active" : ""} onClick={() => setUnits("m2")}>
              m²
            </button>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h2>{t("settings.mapStyle")}</h2>
        <div className="option-row">
          <div>
            <div className="label">{t("settings.mapStyleLabel")}</div>
            <div className="hint">{t("settings.mapStyleHint")}</div>
          </div>
          <div className="seg">
            <button className={mapStyle === "standard" ? "active" : ""} onClick={() => setMapStyle("standard")}>
              {t("settings.standard")}
            </button>
            <button className={mapStyle === "satellite" ? "active" : ""} onClick={() => setMapStyle("satellite")}>
              {t("settings.satellite")}
            </button>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h2>{t("settings.about")}</h2>
        <p className="about-text">{t("settings.aboutText")}</p>
      </div>

      <div className="settings-group">
        <h2>{t("settings.disclaimerTitle")}</h2>
        <p className="about-text">{t("settings.disclaimerText")}</p>
      </div>
    </div>
  );
}
