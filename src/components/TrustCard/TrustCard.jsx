import { useApp } from "../../context/AppContext.jsx";
import "./TrustCard.scss";

export default function TrustCard() {
  const { t } = useApp();

  return (
    <div className="trust-card">
      <svg className="trust-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3l7 3v6c0 4.5-2.9 8.3-7 9.5-4.1-1.2-7-5-7-9.5V6l7-3z"
          stroke="#234F38"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M12 8v5" stroke="#234F38" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="16" r="0.9" fill="#234F38" />
      </svg>
      <div>
        <h3>{t("home.trust.title")}</h3>
        <p>{t("home.trust.text")}</p>
      </div>
    </div>
  );
}
