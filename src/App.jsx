import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./components/Home/Home.jsx";
import Measure from "./components/Measure/Measure.jsx";
import Settings from "./components/Settings/Settings.jsx";
import Toast from "./components/Toast/Toast.jsx";
import ConfirmModal from "./components/ConfirmModal/ConfirmModal.jsx";
import { useApp } from "./context/AppContext.jsx";
import "./App.scss";

// All three views stay mounted at all times (just hidden with CSS).
// This matters a lot for Measure: it holds a real Leaflet map instance —
// if it unmounted every time you left the tab, you'd lose the map (and
// have to re-initialize Leaflet) every time you switched to Settings and back.
export default function App() {
  const { view } = useApp();

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
      <Toast />
    </div>
  );
}
