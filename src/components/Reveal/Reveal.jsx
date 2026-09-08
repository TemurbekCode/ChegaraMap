import { useEffect, useRef, useState } from "react";
import "./Reveal.scss";

// Fades + slides a section up once it scrolls into view. Used to wrap the
// Home page sections below the fold (HowItWorks, Features, TrustCard, CtaBand)
// so the page feels alive as you scroll, without animating everything at once.
export default function Reveal({ children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal${visible ? " reveal-visible" : ""}`}>
      {children}
    </div>
  );
}
