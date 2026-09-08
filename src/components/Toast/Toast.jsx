import { useApp } from "../../context/AppContext.jsx";
import "./Toast.scss";

export default function Toast() {
  const { toast } = useApp();

  return (
    <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
      {toast || ""}
    </div>
  );
}
