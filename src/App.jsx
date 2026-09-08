import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./components/Home/Home.jsx";
import Measure from "./components/Measure/Measure.jsx";
import Settings from "./components/Settings/Settings.jsx";
import Toast from "./components/Toast/Toast.jsx";
import ConfirmModal from "./components/ConfirmModal/ConfirmModal.jsx";
import RegisterModal from "./components/Auth/RegisterModal.jsx";
import Splash from "./components/Splash/Splash.jsx";
import { useApp } from "./context/AppContext.jsx";
import "./App.scss";

const SPLASH_VISIBLE_MS = 900;
const SPLASH_FADE_MS = 400;

// All three views stay mounted at all times (just hidden with CSS).
// This matters a lot for Measure: it holds a real Leaflet map instance —
// if it unmounted every time you left the tab, you'd lose the map (and
// have to re-initialize Leaflet) every time you switched to Settings and back.
export default function App() {
  const { view } = useApp();

  const [splashVisible, setSplashVisible] = useState(true);
  const [splashLeaving, setSplashLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSplashLeaving(true), SPLASH_VISIBLE_MS);
    const t2 = setTimeout(() => setSplashVisible(false), SPLASH_VISIBLE_MS + SPLASH_FADE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div id="app">
      <Navbar />

      <section className={`view view-home${view === "home" ? " active" : ""}`}>
        <Home />
      </section>

      <section className={`view view-measure${view === "measure" ? " active" : ""}`}>
        <Measure />
      </section>

      <section className={`view view-settings${view === "settings" ? " active" : ""}`}>
        <Settings />
      </section>

      <ConfirmModal />
      <RegisterModal />
      <Toast />

      {splashVisible && <Splash leaving={splashLeaving} />}
    </div>
  );
}
