import { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { metersLabel } from "../../utils/geometry.js";
import "./ResultPanel.scss";

export default function ResultPanel({
  open,
  result,
  savedList,
  onClose,
  onSave,
  onShare,
  onLoadSaved,
  onDeleteSaved
}) {
  const { t } = useApp();
  const [sellerValue, setSellerValue] = useState("");
  const [sellerUnit, setSellerUnit] = useState("sotix");
  const [compare, setCompare] = useState(null); // { sellerSotix, mapSotix, diff, pct, significant } | { error: true }
  const [savedOpen, setSavedOpen] = useState(false);

  if (!open || !result) return null;

  const letters = "ABCDEFGHIJ";

  function runCompare() {
    const val = parseFloat(sellerValue);
    if (!sellerValue || Number.isNaN(val) || val <= 0) {
      setCompare({ error: true });
      return;
    }
    const sellerSotix = sellerUnit === "sotix" ? val : val / 100;
    const mapSotix = result.sotix;
    const diff = sellerSotix - mapSotix;
    const pct = mapSotix > 0 ? (diff / mapSotix) * 100 : 0;
    setCompare({ sellerSotix, mapSotix, diff, pct, significant: Math.abs(diff) > 0.05 });
  }

  return (
    <div className="result-panel open">
      <div className="result-head">
        <h3>{t("measure.resultTitle")}</h3>
        <button className="result-close" aria-label="Close" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="result-body">
        <div className="stat-row">
          <div className="stat-box">
            <div className="stat-label">{t("measure.area")}</div>
            <div className="stat-value">{Math.round(result.areaM2).toLocaleString()} m²</div>
          </div>
          <div className="stat-box alt">
            <div className="stat-label">{t("measure.sotix")}</div>
            <div className="stat-value">{result.sotix.toFixed(2)} sotix</div>
          </div>
        </div>

        <div className="dims-row">
          <div className="stat-label">{t("measure.perimeter")}</div>
          <div className="stat-value small">{metersLabel(result.perimeterM)}</div>
        </div>
        <div className="dims-row">
          <div className="stat-label">{t("measure.dimensions")}</div>
          <div className="stat-value small">
            {result.widthM.toFixed(1)} × {result.heightM.toFixed(1)} m
          </div>
        </div>

        <div className="sides-list">
          <div className="sides-list-title">{t("measure.sides")}</div>
          <div>
            {result.sides.map((len, i) => {
              const from = letters[i % letters.length];
              const to = letters[(i + 1) % result.sides.length % letters.length];
              return (
                <div className="side-row" key={i}>
                  <span>
                    {from} → {to}
                  </span>
                  <span>{metersLabel(len)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="warn-note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3l9 16H3l9-16z" stroke="#6E3E17" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M12 10v4" stroke="#6E3E17" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.8" fill="#6E3E17" />
          </svg>
          <span>{t("measure.warn")}</span>
        </div>

        <div className="divider" />

        <div className="seller-block">
          <label htmlFor="seller-value">{t("measure.sellerLabel")}</label>
          <div className="seller-inputs">
            <input
              id="seller-value"
              type="number"
              min="0"
              step="0.01"
              placeholder="6"
              value={sellerValue}
              onChange={(e) => setSellerValue(e.target.value)}
              aria-label="Seller's stated area"
            />
            <select value={sellerUnit} onChange={(e) => setSellerUnit(e.target.value)} aria-label="Unit">
              <option value="sotix">{t("measure.unitSotix")}</option>
              <option value="m2">{t("measure.unitM2")}</option>
            </select>
            <button className="btn btn-secondary btn-sm" onClick={runCompare}>
              {t("measure.compare")}
            </button>
          </div>

          {compare && compare.error && <div className="field-error">{t("err.enterSellerValue")}</div>}

          {compare && !compare.error && (
            <div className="compare-result">
              <div className="compare-row">
                <span>{t("measure.sellerRow")}</span>
                <strong>{compare.sellerSotix.toFixed(2)} sotix</strong>
              </div>
              <div className="compare-row">
                <span>{t("measure.mapRow")}</span>
                <strong>{compare.mapSotix.toFixed(2)} sotix</strong>
              </div>
              <div className="compare-row">
                <span>{t("measure.diffRow")}</span>
                <span className="compare-diff" style={{ color: compare.significant ? "#A85A2A" : "#2F6F4E" }}>
                  {compare.diff >= 0 ? "+" : ""}
                  {compare.diff.toFixed(2)} sotix{" "}
                  <span className="compare-pct">
                    ({compare.pct >= 0 ? "+" : ""}
                    {compare.pct.toFixed(1)}%)
                  </span>
                </span>
              </div>
              <div className="warn-note" style={{ marginTop: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3l9 16H3l9-16z" stroke="#6E3E17" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M12 10v4" stroke="#6E3E17" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="12" cy="17" r="0.8" fill="#6E3E17" />
                </svg>
                <span>{compare.significant ? t("measure.compareWarn") : t("measure.compareMatch")}</span>
              </div>
            </div>
          )}
        </div>

        <div className="panel-actions">
          <button className="btn btn-secondary btn-sm" onClick={onSave}>
            {t("measure.save")}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onShare}>
            {t("measure.share")}
          </button>
        </div>

        <button className="saved-toggle" aria-expanded={savedOpen} onClick={() => setSavedOpen((o) => !o)}>
          <span>
            {t("measure.savedLabel")} ({savedList.length})
          </span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{ transform: savedOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {savedOpen && (
          <div className="saved-list open">
            {savedList.length === 0 ? (
              <div className="saved-empty">{t("measure.savedEmpty")}</div>
            ) : (
              savedList.map((item) => (
                <div className="saved-item" key={item.id}>
                  <div className="saved-item-main" onClick={() => onLoadSaved(item)}>
                    <div className="saved-item-name">{item.name}</div>
                    <div className="saved-item-meta">
                      {item.sotix} sotix · {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    className="saved-item-del"
                    aria-label="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSaved(item.id);
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
