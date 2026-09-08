import { useApp } from "../../context/AppContext.jsx";
import "./Features.scss";

const ITEMS = [
  { emoji: "📐", titleKey: "feat.area.title", textKey: "feat.area.text" },
  { emoji: "📏", titleKey: "feat.perimeter.title", textKey: "feat.perimeter.text" },
  { emoji: "🗺️", titleKey: "feat.map.title", textKey: "feat.map.text" },
  { emoji: "⚖️", titleKey: "feat.compare.title", textKey: "feat.compare.text" }
];

export default function Features() {
  const { t } = useApp();

  return (
    <div className="features" id="features">
      <div className="section-head">
        <div className="section-label">{t("home.featuresLabel")}</div>
        <h2>{t("home.featuresTitle")}</h2>
      </div>
      <div className="features-grid">
        {ITEMS.map((item) => (
          <div className="feature-card" key={item.titleKey}>
            <span className="feature-emoji" aria-hidden="true">
              {item.emoji}
            </span>
            <h3>{t(item.titleKey)}</h3>
            <p>{t(item.textKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
