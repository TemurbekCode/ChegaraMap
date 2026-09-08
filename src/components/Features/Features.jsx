import { useApp } from "../../context/AppContext.jsx";
import "./Features.scss";

const ITEMS = [
  { emoji: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={"currentColor"} viewBox={"0 0 24 24"}>{/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}<path d="M18.36 13.36c-.4.4-.83.75-1.29 1.07l-2.63-5.7c.35-.49.56-1.09.56-1.73 0-1.3-.84-2.4-2-2.82V2h-2v2.18C9.84 4.59 9 5.69 9 7c0 .65.21 1.24.56 1.73l-2.63 5.7c-.46-.31-.89-.67-1.29-1.07l-.71-.71-1.41 1.41.71.71c.57.57 1.19 1.06 1.86 1.49l-2.22 4.81 1.82.84 2.18-4.73c1.32.53 2.71.81 4.14.81s2.82-.27 4.14-.81c1.37-.55 2.59-1.37 3.64-2.42l.71-.71-1.41-1.41-.71.71ZM12 6c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m-3.3 9.37 2.53-5.48c.25.07.5.11.77.11s.52-.05.77-.11l2.53 5.48c-2.11.83-4.49.83-6.6 0m8.28 3.64 1.34 2.91 1.82-.84-1.38-2.99c-.57.35-1.16.66-1.78.92"></path></svg>, titleKey: "feat.area.title", textKey: "feat.area.text" },
  { emoji: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={"currentColor"} viewBox={"0 0 24 24"}>{/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}<path d="M22 7H2c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h20c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1m-1 8H3V9h2v3h2V9h2v4h2V9h2v3h2V9h2v4h2V9h2z"></path></svg>, titleKey: "feat.perimeter.title", textKey: "feat.perimeter.text" },
  { emoji: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={"currentColor"} viewBox={"0 0 24 24"}>{/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}<path d="m21.51 6.14-5-3a.99.99 0 0 0-.87-.08L8.09 5.89 3.51 3.14a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v13c0 .35.18.68.49.86l5 3c.26.16.58.19.87.08l7.55-2.83 4.59 2.75c.16.1.34.14.51.14s.34-.04.49-.13c.31-.18.51-.51.51-.87V7a.99.99 0 0 0-.49-.86M7 18.23l-3-1.8V5.77l3 1.8v10.67Zm8-1.93-6 2.25V7.69l6-2.25zm5 1.93-3-1.8V5.77l3 1.8v10.67Z"></path></svg>, titleKey: "feat.map.title", textKey: "feat.map.text" },
  { emoji: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={"currentColor"} viewBox={"0 0 24 24"}>{/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}<path d="M9 2H4c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M4 9V4h5v5zm13.5 4c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5m0 7a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5M7 18H4v-5H2v5c0 1.1.9 2 2 2h3v2l4-3-4-3zM20 4h-3V2l-4 3 4 3V6h3v5h2V6c0-1.1-.9-2-2-2"></path></svg>, titleKey: "feat.compare.title", textKey: "feat.compare.text" }
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
