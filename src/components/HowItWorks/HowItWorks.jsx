import { useApp } from "../../context/AppContext.jsx";
import "./HowItWorks.scss";

export default function HowItWorks() {
  const { t } = useApp();

  return (
    <div className="steps" id="how-it-works">
      <div className="section-head">
        <div className="section-label">{t("home.stepsLabel")}</div>
        <h2>{t("home.stepsTitle")}</h2>
      </div>
      <div className="steps-grid">
        <div className="step-card">
          <div className="step-num">01</div>
          <svg className="step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="#182420" strokeWidth="1.6" />
            <path d="M20 20l-4.3-4.3" stroke="#182420" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <h3>{t("home.step1.title")}</h3>
          <p>{t("home.step1.text")}</p>
        </div>
        <div className="step-card">
          <div className="step-num">02</div>
          <svg className="step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 18L9 6l6 3 5-4" stroke="#182420" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="4" cy="18" r="1.6" fill="#182420" />
            <circle cx="9" cy="6" r="1.6" fill="#182420" />
            <circle cx="15" cy="9" r="1.6" fill="#182420" />
            <circle cx="20" cy="5" r="1.6" fill="#182420" />
          </svg>
          <h3>{t("home.step2.title")}</h3>
          <p>{t("home.step2.text")}</p>
        </div>
        <div className="step-card">
          <div className="step-num">03</div>
          <svg className="step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#182420" strokeWidth="1.6" />
            <path d="M8 12h8M8 16h5" stroke="#182420" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <h3>{t("home.step3.title")}</h3>
          <p>{t("home.step3.text")}</p>
        </div>
      </div>
    </div>
  );
}
