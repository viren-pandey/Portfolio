import React from 'react';
import { useUI } from '../contexts/UIContext';
import Hero from '../components/Hero';
import { Metrics } from '../components/About';
import About from '../components/About';
import Projects from '../components/Projects';
import BuildingJourney from '../components/BuildingJourney';
import Skills from '../components/Skills';
import ContactCTA from '../components/ContactCTA';

const Home: React.FC = () => {
  const { openTerminal } = useUI();
  return (
    <>
      <Hero onOpenTerminal={openTerminal} />
      <Metrics />
      <About />
      <Projects />
      <BuildingJourney />
      <Skills />
      <ContactCTA />
      {/* Anchor kept for the legacy /projects deep-link scrolling */}
      <span id="projects" className="sr-only" aria-hidden="true" />
    </>
  );
};

export default Home;
