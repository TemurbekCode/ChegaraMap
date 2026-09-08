import { useApp } from "../../context/AppContext.jsx";
import "./CtaBand.scss";

export default function CtaBand() {
  const { t, setView, requestMeasure } = useApp();

  return (
    <div className="cta-band">
      <div>
        <h2>{t("home.ctaBand.title")}</h2>
        <p>{t("home.ctaBand.text")}</p>
      </div>
      <button className="btn btn-primary" onClick={() => requestMeasure(() => setView("measure"))}>
        {t("home.cta1")}
      </button>
    </div>
  );
}
