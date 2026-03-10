import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Github,
  ExternalLink,
  ArrowLeft,
  Satellite,
  Brain,
  Layers,
  Cpu,
  Globe,
  ShieldAlert,
  Zap,
  ChevronDown,
  ChevronUp,
  Server,
  Code2,
  Database,
  Activity,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const TECH_STACK = [
  { label: 'FastAPI', icon: <Server size={16} />, color: 'from-teal-500/20 to-teal-500/5', border: 'border-teal-500/30', text: 'text-teal-400' },
  { label: 'SGP4 / TLE', icon: <Satellite size={16} />, color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', text: 'text-blue-400' },
  { label: 'React 19', icon: <Code2 size={16} />, color: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  { label: 'Vite 7', icon: <Zap size={16} />, color: 'from-yellow-500/20 to-yellow-500/5', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  { label: 'Python 3.11', icon: <Cpu size={16} />, color: 'from-indigo-500/20 to-indigo-500/5', border: 'border-indigo-500/30', text: 'text-indigo-400' },
  { label: 'Docker', icon: <Layers size={16} />, color: 'from-sky-500/20 to-sky-500/5', border: 'border-sky-500/30', text: 'text-sky-400' },
  { label: 'CelesTrak API', icon: <Globe size={16} />, color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/30', text: 'text-green-400' },
  { label: 'ML Classifier', icon: <Brain size={16} />, color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', text: 'text-purple-400' },
];

const RISK_LEVELS = [
  { level: 'CRITICAL', score: '≥ 85', color: 'bg-red-500/20 border-red-500/40 text-red-400', bar: 'bg-red-500', width: 'w-full', desc: 'Emergency maneuver required immediately' },
  { level: 'HIGH', score: '≥ 60', color: 'bg-orange-500/20 border-orange-500/40 text-orange-400', bar: 'bg-orange-500', width: 'w-4/5', desc: 'Immediate maneuver recommended' },
  { level: 'MEDIUM', score: '≥ 30', color: 'bg-amber-500/20 border-amber-500/40 text-amber-400', bar: 'bg-amber-500', width: 'w-3/5', desc: 'Monitor closely, prepare maneuver' },
  { level: 'LOW', score: '< 30', color: 'bg-green-500/20 border-green-500/40 text-green-400', bar: 'bg-green-500', width: 'w-1/5', desc: 'Safe orbital separation' },
];

const FEATURES = [
  {
    icon: <Satellite size={22} />,
    title: 'SGP4 Orbital Propagation',
    desc: 'Live TLE data from CelesTrak is propagated using the NORAD SGP4 algorithm to compute real-time 3D position vectors (x, y, z) in the TEME inertial frame, then converted to geodetic lat/lon/alt via WGS-84.',
  },
  {
    icon: <Activity size={22} />,
    title: 'Conjunction Screening',
    desc: 'Every unique pair of N satellites is evaluated using itertools.combinations — N×(N−1)/2 pairs. 3D Euclidean distance filters out co-location artifacts (<0.5 km) and surfaces real close approaches.',
  },
  {
    icon: <Brain size={22} />,
    title: 'Altitude-Weighted ML Classifier',
    desc: 'Risk scores are weighted by orbital regime: LEO (<500 km) ×1.2, MEO ×1.0, HEO/GEO ×0.8. This reflects the higher debris density and collision speed in low Earth orbit.',
  },
  {
    icon: <ShieldAlert size={22} />,
    title: 'Maneuver Recommendation Engine',
    desc: 'For each detected conjunction, the avoidance module recommends an altitude boost (CRITICAL: +25 km, HIGH: +15 km, MEDIUM: +8 km). Re-classification proves the maneuver effectiveness.',
  },
  {
    icon: <Zap size={22} />,
    title: '3-Tier Fallback Architecture',
    desc: 'Live CelesTrak feed → local .tle file → 20 hand-crafted simulated satellites with designed-close pairs covering all four risk levels. Zero downtime for demos.',
  },
  {
    icon: <Code2 size={22} />,
    title: 'React 19 Animated Dashboard',
    desc: 'Auto-advancing risk cards with 5s setInterval + useRef, CSS key-trick for animation reset, animated star field (180 stars via useMemo), letter-fall navbar, and a seamless ticker loop.',
  },
];

const FEATURED_PAGES = [
  {
    title: 'Risk Dashboard',
    href: 'https://spacedebrisai.vercel.app/',
    desc: 'Auto-advancing conjunction risk cards with maneuver recommendations.',
  },
  {
    title: 'Satellite Registry',
    href: 'https://spacedebrisai.vercel.app/satellites',
    desc: 'Full satellite table with mission metadata and risk highlights.',
  },
  {
    title: 'Live Tracker',
    href: 'https://spacedebrisai.vercel.app/tracker',
    desc: 'World-map orbital plotting powered by live tracker positions.',
  },
];

const API_LINKS = [
  { method: 'GET', endpoint: '/simulate', href: 'https://virenn77-spacedebrisai.hf.space/simulate', desc: 'Full conjunction pipeline response' },
  { method: 'GET', endpoint: '/satellites', href: 'https://virenn77-spacedebrisai.hf.space/satellites', desc: 'Tracked satellite positions' },
  { method: 'GET', endpoint: '/tracker/positions', href: 'https://virenn77-spacedebrisai.hf.space/tracker/positions', desc: 'Live world-map tracker data' },
  { method: 'GET', endpoint: '/health', href: 'https://virenn77-spacedebrisai.hf.space/health', desc: 'Backend liveness check' },
  { method: 'GET', endpoint: '/docs', href: 'https://virenn77-spacedebrisai.hf.space/docs', desc: 'Swagger UI for all endpoints' },
];

const QA = [
  {
    q: 'What is a conjunction and why does it matter?',
    a: 'A conjunction is when two orbiting objects come within a dangerous threshold distance — typically measured in km. Below ~5 km needs monitoring; below ~2 km triggers emergency protocols. With 27,000+ tracked objects in orbit, a single collision can create thousands of fragments (Kessler Syndrome), threatening all future spaceflight.',
  },
  {
    q: 'How do you calculate satellite positions?',
    a: 'We use the SGP4 orbital propagation model. A TLE (Two-Line Element set) encodes the orbit. SGP4 takes TLE + timestamp → 3D position vector in the TEME inertial frame. We then rotate TEME → ECEF using GMST, then run Bowring\'s iterative algorithm with the WGS-84 ellipsoid to get lat/lon/altitude.',
  },
  {
    q: 'Why is the altitude factor important?',
    a: 'LEO (<500 km) is the most congested region. Objects there travel at ~7.8 km/s, so collision energy is enormous and reaction time is minimal. The same 4 km separation at 400 km altitude is more dangerous than at 2000 km. The classifier multiplies the base score by 1.2 in LEO to reflect this elevated risk.',
  },
  {
    q: 'How does the auto-advance timer avoid stale closures?',
    a: 'useCallback wraps resetTimer so its identity only changes when total changes. useRef holds the interval ID without triggering re-renders. When total changes, resetTimer gets a new stable reference, which triggers useEffect to restart the interval with the correct total in scope.',
  },
  {
    q: 'How does the CSS animation reset when the card changes?',
    a: 'By changing the key prop on the .rp-progress-line element to match idx. React unmounts the old element and mounts a fresh one. The fresh element starts the CSS rp-sweep animation from width: 0% — no JavaScript animation manipulation needed.',
  },
  {
    q: 'What happens if CelesTrak is unreachable?',
    a: 'Three-tier fallback: (1) Live CelesTrak GP feed. (2) Local TLE file. (3) 20 hand-crafted simulated satellites with designed-close pairs covering all four risk levels — ISS ↔ PROGRESS at ~3 km (CRITICAL), STARLINK pair at ~14 km (MEDIUM), TERRA ↔ AQUA at ~49 km (LOW).',
  },
];

const PIPELINE_STEPS = [
  { step: '01', label: 'Fetch TLEs', detail: 'CelesTrak GP feed → local file → simulated fallback', color: 'text-blue-400 border-blue-500/40' },
  { step: '02', label: 'SGP4 Propagation', detail: 'Each TLE → TEME position vector at current UTC', color: 'text-cyan-400 border-cyan-500/40' },
  { step: '03', label: 'TEME → Geodetic', detail: 'GMST rotation + WGS-84 Bowring algorithm', color: 'text-teal-400 border-teal-500/40' },
  { step: '04', label: 'Pair Screening', detail: 'N×(N-1)/2 pairs via itertools.combinations + 3D distance', color: 'text-green-400 border-green-500/40' },
  { step: '05', label: 'Risk Classification', detail: 'Base score × altitude factor → 4-tier risk level', color: 'text-amber-400 border-amber-500/40' },
  { step: '06', label: 'Maneuver Recommendation', detail: 'Altitude boost + re-classification proves improvement', color: 'text-orange-400 border-orange-500/40' },
  { step: '07', label: 'JSON Response', detail: 'Sorted top-10 conjunctions + all satellite positions', color: 'text-red-400 border-red-500/40' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col items-start mb-10">
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{children}</h2>
    <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
  </div>
);

const QAItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex justify-between items-center px-6 py-4 text-left bg-white dark:bg-black/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white text-sm pr-4">{q}</span>
        {open ? <ChevronUp size={16} className="flex-shrink-0 text-purple-500" /> : <ChevronDown size={16} className="flex-shrink-0 text-gray-400" />}
      </button>
      {open && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-black/10 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const SpaceDebrisAIPage: React.FC = () => {
  const [openPipelineIndex, setOpenPipelineIndex] = useState<number | null>(0);
  const [openFeatureIndex, setOpenFeatureIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-8"
            >
              <ArrowLeft size={14} />
              <span>Back to Portfolio</span>
            </Link>

            {/* eyebrow */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-medium mb-6">
              <Satellite size={12} />
              <span>Full-Stack AI Project · Deep Dive</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Space<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Debris</span>AI
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 max-w-3xl leading-relaxed">
              A real-time satellite conjunction monitoring system — tracking orbital debris, calculating collision risk using SGP4 propagation, and recommending avoidance maneuvers via a Python ML pipeline.
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-500 mb-10 max-w-2xl">
              Simulates the screening pipeline run daily by NASA, ESA, and SpaceX — built with FastAPI, React 19, and real orbital physics.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/viren-pandey/SpaceDebrisAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Github size={16} />
                <span>View on GitHub</span>
              </a>
              <a
                href="https://spacedebrisai.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-400 dark:text-purple-300 text-sm font-medium hover:bg-purple-500/20 transition-colors"
              >
                <ExternalLink size={16} />
                <span>Live Demo</span>
              </a>
              <a
                href="https://virenn77-spacedebrisai.hf.space/simulate"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-blue-500/40 bg-blue-500/10 text-blue-500 dark:text-blue-300 text-sm font-medium hover:bg-blue-500/20 transition-colors"
              >
                <ExternalLink size={16} />
                <span>Live API</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats band ── */}
      <section className="border-y border-black/10 dark:border-white/10 bg-gray-100/60 dark:bg-white/[0.03] px-6 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '27,000+', label: 'Tracked Objects in Orbit' },
            { value: 'SGP4', label: 'NORAD Propagation Model' },
            { value: '19,900', label: 'Pairs Screened (200 sats)' },
            { value: '4-Tier', label: 'Risk Classification System' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">

        {/* ── Tech Stack ── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Tech Stack</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TECH_STACK.map(({ label, icon, color, border, text }) => (
              <div key={label} className={`rounded-2xl border ${border} bg-gradient-to-br ${color} p-4 flex items-center space-x-3`}>
                <span className={text}>{icon}</span>
                <span className={`text-sm font-medium ${text}`}>{label}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Featured Pages &amp; API Links</SectionTitle>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frontend Pages</h3>
              <div className="space-y-3">
                {FEATURED_PAGES.map((page) => (
                  <a
                    key={page.title}
                    href={page.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-4 hover:bg-blue-500/[0.12] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-300">{page.title}</div>
                      <ExternalLink size={14} className="text-blue-500 dark:text-blue-300 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{page.desc}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Backend API</h3>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                Base URL: <span className="font-mono">https://virenn77-spacedebrisai.hf.space</span>
              </p>
              <div className="space-y-2.5">
                {API_LINKS.map((api) => (
                  <a
                    key={api.endpoint}
                    href={api.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-purple-500/20 bg-purple-500/[0.06] p-3.5 hover:bg-purple-500/[0.12] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-purple-500/30 text-purple-500 dark:text-purple-300 font-mono">{api.method}</span>
                      <span className="text-xs font-mono text-gray-700 dark:text-gray-200">{api.endpoint}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{api.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Architecture ── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>System Architecture</SectionTitle>
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/30 overflow-hidden">
            <div className="border-b border-black/10 dark:border-white/10 px-6 py-3 flex items-center space-x-2 bg-gray-50 dark:bg-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-gray-500 dark:text-gray-500 font-mono">system-architecture.txt</span>
            </div>
            <pre className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-mono p-6 overflow-x-auto leading-relaxed">{`┌─────────────────────────────────────────────────┐
│              Browser (React 19 SPA)             │
│   Navbar │ Dashboard │ Satellites │ Tracker     │
└──────────────────────┬──────────────────────────┘
                       │ HTTP GET /simulate (JSON)
                       ▼
┌─────────────────────────────────────────────────┐
│          FastAPI Backend  (port 8000)           │
│   /simulate  /health  /tracker  /satellites     │
└──────────────────────┬──────────────────────────┘
                       │
          ┌────────────┴─────────────┐
          ▼                          ▼
┌──────────────────┐      ┌──────────────────────┐
│  CelesTrak API   │      │  Simulated Fallback  │
│  (live TLE feed) │      │  (20 Keplerian sats) │
└────────┬─────────┘      └──────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│               SGP4 Propagator                   │
│  TLE → TEME position vectors (x, y, z in km)   │
│  TEME → ECEF → WGS-84 geodetic (lat/lon/alt)   │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│              ML Logic Layer                     │
│  classifier.py → altitude-weighted risk score  │
│  avoidance.py  → maneuver recommendation       │
└─────────────────────────────────────────────────┘`}</pre>
          </div>
        </motion.section>

        {/* Simulation Pipeline */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Simulation Pipeline</SectionTitle>
          <div className="space-y-3">
            {PIPELINE_STEPS.map(({ step, label, detail, color }, i) => {
              const isOpen = openPipelineIndex === i;
              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className={`rounded-2xl border ${color.split(' ')[1]} bg-white dark:bg-black/20 overflow-hidden`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenPipelineIndex(isOpen ? null : i)}
                    className="w-full flex items-start space-x-5 p-4 text-left"
                  >
                    <span className={`text-xs font-mono font-bold ${color.split(' ')[0]} pt-0.5`}>{step}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">{label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Click to expand details</div>
                    </div>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pl-[3.75rem] text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {detail}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Key Features */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Key Features</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map(({ icon, title, desc }, i) => {
              const isOpen = openFeatureIndex === i;
              return (
                <div key={title} className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFeatureIndex(isOpen ? null : i)}
                    className="w-full p-6 text-left flex items-start gap-3"
                  >
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 flex-shrink-0">{icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Click to expand details</p>
                    </div>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {desc}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ML Risk Engine */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>ML Risk Classification</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                The classifier wraps a base distance engine and multiplies by an altitude factor reflecting orbital congestion. Final scores map to four risk tiers displayed on the dashboard.
              </p>
              <div className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
                <div className="bg-gray-50 dark:bg-white/5 border-b border-black/10 dark:border-white/10 px-4 py-2 flex items-center space-x-2">
                  <Database size={13} className="text-gray-400" />
                  <span className="text-xs font-mono text-gray-500">classifier.py — altitude factors</span>
                </div>
                <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 p-4 overflow-x-auto">{`LEO  (< 500 km)   → ×1.20  # densest debris
MEO  (< 2000 km)  → ×1.00  # baseline
HEO/GEO (> 2000)  → ×0.80  # more reaction time

final_score = min(base × factor, 100)`}</pre>
              </div>
              <div className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
                <div className="bg-gray-50 dark:bg-white/5 border-b border-black/10 dark:border-white/10 px-4 py-2 flex items-center space-x-2">
                  <ShieldAlert size={13} className="text-gray-400" />
                  <span className="text-xs font-mono text-gray-500">avoidance.py — delta boosts</span>
                </div>
                <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 p-4 overflow-x-auto">{`CRITICAL → +25 km altitude boost
HIGH     → +15 km altitude boost
MEDIUM   →  +8 km altitude boost
LOW      →   0 km (no action needed)`}</pre>
              </div>
            </div>

            <div className="space-y-3">
              {RISK_LEVELS.map(({ level, score, color, bar, width, desc }) => (
                <div key={level} className={`rounded-2xl border p-4 ${color}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold tracking-widest">{level}</span>
                    <span className="text-xs font-mono opacity-70">score {score}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 mb-2">
                    <div className={`h-full rounded-full ${bar} ${width} transition-all`} />
                  </div>
                  <div className="text-xs opacity-80">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── Frontend highlights ── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Frontend Engineering Highlights</SectionTitle>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'CSS Key-Trick Animation Reset',
                code: '<div className="progress-line"\n  key={idx}   ← triggers remount\n  style={{ ... }} />',
                desc: 'Changing key unmounts + remounts the element, restarting the CSS animation from 0% without any JS animation API.',
              },
              {
                title: 'Stale-Closure-Safe Timer',
                code: 'const timerRef = useRef(null);\nconst resetTimer = useCallback(() => {\n  clearInterval(timerRef.current);\n  timerRef.current = setInterval(...);\n}, [total]);',
                desc: 'useRef holds the interval ID (no re-render). useCallback ensures the function identity only changes when total changes.',
              },
              {
                title: 'Seamless Ticker Loop',
                code: '[...items, ...items].map(...);\n/* CSS: translateX(0) → translateX(-50%) */\n/* At -50% it looks identical to 0% */\n/* loop: infinite */  ',
                desc: 'Items duplicated so the scroll resets to 0% at the exact point it looks the same — invisible snap creates an infinite loop illusion.',
              },
            ].map(({ title, code, desc }) => (
              <div key={title} className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 overflow-hidden">
                <div className="p-5 border-b border-black/10 dark:border-white/10">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">{desc}</p>
                </div>
                <pre className="text-xs font-mono text-gray-600 dark:text-gray-400 p-4 bg-gray-50 dark:bg-white/5 overflow-x-auto">{code}</pre>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Q&A ── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Some Q&amp;A</SectionTitle>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Common questions about architecture decisions, orbital mechanics, and React patterns used in this project.
          </p>
          <div className="space-y-3">
            {QA.map(({ q, a }) => (
              <QAItem key={q} q={q} a={a} />
            ))}
          </div>
        </motion.section>

        {/* ── CTA ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center py-12 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/5"
        >
          <Satellite size={40} className="mx-auto mb-4 text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Explore the Codebase</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Every detail in this breakdown corresponds to real code — from the SGP4 propagator to the CSS key-trick.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/viren-pandey/SpaceDebrisAI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Github size={16} />
              <span>GitHub Repository</span>
            </a>
            <a
              href="https://spacedebrisai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors"
            >
              <ExternalLink size={16} />
              <span>Live Demo</span>
            </a>
            <a
              href="https://virenn77-spacedebrisai.hf.space/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-blue-500/40 bg-blue-500/10 text-blue-500 dark:text-blue-300 text-sm font-medium hover:bg-blue-500/20 transition-colors"
            >
              <Database size={16} />
              <span>API Docs</span>
            </a>
          </div>
        </motion.section>

      </div>

      {/* ── Floating corner buttons ── */}
      <div className="fixed bottom-24 right-8 z-[70] flex flex-col gap-3">
        <a
          href="https://github.com/viren-pandey/SpaceDebrisAI"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Repository"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-lg backdrop-blur-sm transition-colors text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400"
        >
          <Github size={18} />
        </a>
        <a
          href="https://spacedebrisai.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          title="Live Demo"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-lg backdrop-blur-sm transition-colors text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400"
        >
          <ExternalLink size={18} />
        </a>
        <a
          href="https://virenn77-spacedebrisai.hf.space/docs"
          target="_blank"
          rel="noopener noreferrer"
          title="Live API Docs"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-lg backdrop-blur-sm transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300"
        >
          <Database size={18} />
        </a>
      </div>
    </div>
  );
};

export default SpaceDebrisAIPage;

