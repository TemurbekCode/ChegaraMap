import { useApp } from "../../context/AppContext.jsx";

export default function MapControls({ pointCount, finished, onUndo, onClear, onFinish }) {
  const { t } = useApp();

  return (
    <div className="map-controls">
      <button className="ctrl-btn" disabled={pointCount === 0} onClick={onUndo}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 7L4 12l5 5M4 12h11a5 5 0 010 10h-1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{t("measure.undo")}</span>
      </button>
      <button className="ctrl-btn" disabled={pointCount === 0} onClick={onClear}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{t("measure.clear")}</span>
      </button>
      <button className="ctrl-btn primary" disabled={pointCount < 3 || finished} onClick={onFinish}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{t("measure.finish")}</span>
      </button>
    </div>
  );
}
