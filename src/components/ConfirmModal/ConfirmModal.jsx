import { useApp } from "../../context/AppContext.jsx";
import "./ConfirmModal.scss";

export default function ConfirmModal() {
  const { t, confirmState, closeConfirm, confirmOk } = useApp();

  if (!confirmState.open) return null;

  return (
    <div
      className="modal-backdrop open"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeConfirm();
      }}
    >
      <div className="modal-card" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <h3 id="confirm-title">{t("confirm.clearTitle")}</h3>
        <p>{t("confirm.clearText")}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary btn-sm" onClick={closeConfirm}>
            {t("confirm.cancel")}
          </button>
          <button className="btn btn-primary btn-sm" onClick={confirmOk}>
            {t("confirm.ok")}
          </button>
        </div>
      </div>
    </div>
  );
}
