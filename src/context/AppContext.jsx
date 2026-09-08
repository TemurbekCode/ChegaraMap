import { createContext, useCallback, useContext, useRef, useState } from "react";
import { translations } from "../i18n/translations.js";

const LANG_KEY = "chegara_lang";
const UNITS_KEY = "chegara_units";

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key, val) {
  try {
    localStorage.setItem(key, val);
    return true;
  } catch {
    return false;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLangState] = useState(() => safeGet(LANG_KEY) || "uz");
  const [units, setUnitsState] = useState(() => safeGet(UNITS_KEY) || "sotix");
  const [mapStyle, setMapStyle] = useState("standard");
  const [view, setView] = useState("home");

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const [confirmState, setConfirmState] = useState({ open: false, onConfirm: null });

  const t = useCallback((key) => (translations[lang] && translations[lang][key]) || translations.uz[key] || key, [lang]);

  const setLang = useCallback((l) => {
    setLangState(l);
    safeSet(LANG_KEY, l);
  }, []);

  const setUnits = useCallback((u) => {
    setUnitsState(u);
    safeSet(UNITS_KEY, u);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const askConfirm = useCallback((onConfirm) => {
    setConfirmState({ open: true, onConfirm });
  }, []);

  const closeConfirm = useCallback(() => setConfirmState({ open: false, onConfirm: null }), []);

  const confirmOk = useCallback(() => {
    const action = confirmState.onConfirm;
    setConfirmState({ open: false, onConfirm: null });
    if (action) action();
  }, [confirmState]);

  const value = {
    lang,
    setLang,
    units,
    setUnits,
    mapStyle,
    setMapStyle,
    view,
    setView,
    t,
    toast,
    showToast,
    confirmState,
    askConfirm,
    closeConfirm,
    confirmOk
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}
