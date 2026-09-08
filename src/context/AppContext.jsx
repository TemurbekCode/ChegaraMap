import { createContext, useCallback, useContext, useRef, useState } from "react";
import { translations } from "../i18n/translations.js";

const LANG_KEY = "chegara_lang";
const UNITS_KEY = "chegara_units";
const USER_KEY = "chegara_user";
// Local-only registration log. IMPORTANT: this lives in this one browser's
// storage — it cannot see or count registrations made by other people on
// their own devices. A real "how many users signed up" number requires a
// backend (even a tiny one — Supabase/Firebase/a Google Sheet webhook all work).
const ALL_USERS_KEY = "chegara_all_users_local_only";
const ADMIN_EMAIL = "temurbekalisherov82@gmail.com";

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
function safeParse(key) {
  try {
    return JSON.parse(safeGet(key));
  } catch {
    return null;
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

  // ---------- registration gate ----------
  const [user, setUser] = useState(() => safeParse(USER_KEY));
  const [registerState, setRegisterState] = useState({ open: false, onSuccess: null });

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

  // Gate for anything that should require registration first (entering Measure).
  // If already registered (in this browser), runs the action immediately.
  const requestMeasure = useCallback(
    (onSuccess) => {
      if (user) {
        onSuccess();
        return;
      }
      setRegisterState({ open: true, onSuccess });
    },
    [user]
  );

  const closeRegister = useCallback(() => setRegisterState({ open: false, onSuccess: null }), []);

  const submitRegister = useCallback(
    ({ name, email }) => {
      const cleanEmail = email.trim().toLowerCase();
      const newUser = {
        name: name.trim(),
        email: cleanEmail,
        isAdmin: cleanEmail === ADMIN_EMAIL,
        registeredAt: new Date().toISOString()
      };
      safeSet(USER_KEY, JSON.stringify(newUser));

      // local-only log, see note above USER_KEY/ALL_USERS_KEY
      const list = safeParse(ALL_USERS_KEY) || [];
      list.push(newUser);
      safeSet(ALL_USERS_KEY, JSON.stringify(list));

      setUser(newUser);
      const action = registerState.onSuccess;
      setRegisterState({ open: false, onSuccess: null });
      if (action) action();
    },
    [registerState]
  );

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
    confirmOk,
    user,
    registerState,
    requestMeasure,
    closeRegister,
    submitRegister
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}
