import { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import "./RegisterModal.scss";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterModal() {
  const { registerState, closeRegister, submitRegister, lang } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  if (!registerState.open) return null;

  const isUz = lang === "uz";

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!name.trim()) {
      nextErrors.name = isUz ? "Ismingizni kiriting" : "Enter your name";
    }
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      nextErrors.email = isUz ? "To'g'ri email kiriting" : "Enter a valid email";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    submitRegister({ name, email });
    setName("");
    setEmail("");
    setErrors({});
  }

  return (
    <div
      className="modal-backdrop open"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeRegister();
      }}
    >
      <form className="modal-card register-card" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="register-title">
        <button type="button" className="register-close" aria-label="Close" onClick={closeRegister}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <h3 id="register-title">{isUz ? "Boshlashdan oldin" : "Before you start"}</h3>
        <p className="register-sub">
          {isUz
            ? "Ismingiz va emailingizni kiriting — parol shart emas. Bir marta kiritasiz, keyingi safar so'ralmaydi."
            : "Enter your name and email — no password needed. You'll only do this once."}
        </p>

        <label className="field-label" htmlFor="reg-name">
          {isUz ? "Ismingiz" : "Your name"}
        </label>
        <input
          id="reg-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isUz ? "Ism" : "e.g. Alex"}
          autoComplete="name"
        />
        {errors.name && <div className="field-error">{errors.name}</div>}

        <label className="field-label" htmlFor="reg-email">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@gmail.com"
          autoComplete="email"
        />
        {errors.email && <div className="field-error">{errors.email}</div>}

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={closeRegister}>
            {isUz ? "Bekor qilish" : "Cancel"}
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            {isUz ? "Boshlash" : "Start"}
          </button>
        </div>
      </form>
    </div>
  );
}
