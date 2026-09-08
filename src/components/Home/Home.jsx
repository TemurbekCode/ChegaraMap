import Hero from "../Hero/Hero.jsx";
import HowItWorks from "../HowItWorks/HowItWorks.jsx";
import Features from "../Features/Features.jsx";
import TrustCard from "../TrustCard/TrustCard.jsx";
import CtaBand from "../CtaBand/CtaBand.jsx";
import Footer from "../Footer/Footer.jsx";
import Reveal from "../Reveal/Reveal.jsx";
import "./Home.scss";

export default function Home() {
  return (
    <>
      <div className="home-inner">
        <Hero />
        <Reveal>
          <HowItWorks />
        </Reveal>
        <Reveal>
          <Features />
        </Reveal>
        <Reveal>
          <TrustCard />
        </Reveal>
        <Reveal>
          <CtaBand />
        </Reveal>
      </div>
      <Footer />
    </>
  );
}
