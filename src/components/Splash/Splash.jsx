import "./Splash.scss";

// Shown briefly while the app boots. The logo "draws itself" — a small nod
// to what the product actually does (tracing a plot's boundary) — then the
// whole screen fades to reveal the real app underneath.
export default function Splash({ leaving }) {
  return (
    <div className={`splash${leaving ? " splash-leaving" : ""}`}>
      <svg className="splash-mark" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path className="splash-path" d="M5 22L9 7L23 9L21 24L5 22Z" stroke="#2F6F4E" strokeWidth="1.8" strokeLinejoin="round" />
        <circle className="splash-dot d1" cx="5" cy="22" r="2" fill="#2F6F4E" />
        <circle className="splash-dot d2" cx="9" cy="7" r="2" fill="#2F6F4E" />
        <circle className="splash-dot d3" cx="23" cy="9" r="2" fill="#2F6F4E" />
        <circle className="splash-dot d4" cx="21" cy="24" r="2" fill="#2F6F4E" />
      </svg>
      <div className="splash-name">Chegara</div>
    </div>
  );
}
