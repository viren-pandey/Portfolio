
import React from 'react';
import { useUI } from '../contexts/UIContext';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Education from '../components/Education';

const Home: React.FC = () => {
  const { openTerminal } = useUI();

  return (
    <>
      <Hero onOpenTerminal={openTerminal} />
      <section id="skills" className="py-24">
        <Skills />
      </section>
      <section id="projects" className="py-24 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <Projects />
      </section>
      <section id="education" className="py-24">
        <Education />
      </section>
    </>
  );
};

export default Home;
