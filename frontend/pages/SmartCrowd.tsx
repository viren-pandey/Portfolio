import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Github,
  ExternalLink,
  ArrowLeft,
  Users,
  Brain,
  Layers,
  Cpu,
  ShieldAlert,
  Zap,
  ChevronDown,
  ChevronUp,
  Server,
  Code2,
  Camera,
  Activity,
  AlertTriangle,
  Globe,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const TECH_STACK = [
  { label: 'YOLOv8', icon: <Brain size={16} />, color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', text: 'text-purple-400' },
  { label: 'FastAPI', icon: <Server size={16} />, color: 'from-teal-500/20 to-teal-500/5', border: 'border-teal-500/30', text: 'text-teal-400' },
  { label: 'React.js', icon: <Code2 size={16} />, color: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  { label: 'Vite', icon: <Zap size={16} />, color: 'from-yellow-500/20 to-yellow-500/5', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  { label: 'Python', icon: <Cpu size={16} />, color: 'from-indigo-500/20 to-indigo-500/5', border: 'border-indigo-500/30', text: 'text-indigo-400' },
  { label: 'TailwindCSS', icon: <Layers size={16} />, color: 'from-sky-500/20 to-sky-500/5', border: 'border-sky-500/30', text: 'text-sky-400' },
  { label: 'Uvicorn', icon: <Globe size={16} />, color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/30', text: 'text-green-400' },
  { label: 'Webcam API', icon: <Camera size={16} />, color: 'from-rose-500/20 to-rose-500/5', border: 'border-rose-500/30', text: 'text-rose-400' },
];

const RISK_LEVELS = [
  { level: 'CRITICAL', threshold: '≥ 40 people', color: 'bg-red-500/20 border-red-500/40 text-red-400', bar: 'bg-red-500', width: 'w-full', desc: 'Immediate evacuation protocol triggered' },
  { level: 'HIGH', threshold: '≥ 25 people', color: 'bg-orange-500/20 border-orange-500/40 text-orange-400', bar: 'bg-orange-500', width: 'w-4/5', desc: 'Security alert dispatched to operators' },
  { level: 'MEDIUM', threshold: '≥ 15 people', color: 'bg-amber-500/20 border-amber-500/40 text-amber-400', bar: 'bg-amber-500', width: 'w-3/5', desc: 'Monitor closely, entry restriction advised' },
  { level: 'LOW', threshold: '< 15 people', color: 'bg-green-500/20 border-green-500/40 text-green-400', bar: 'bg-green-500', width: 'w-1/5', desc: 'Normal — no action required' },
];

const FEATURES = [
  {
    icon: <Camera size={22} />,
    title: 'Live Webcam Inference Pipeline',
    desc: 'Continuous MJPEG frames are pulled from the browser\'s MediaDevices API, POSTed to the FastAPI backend, processed through YOLOv8, and streamed back as annotated images — all at 5 fps with bounding boxes and confidence scores.',
  },
  {
    icon: <Brain size={22} />,
    title: 'YOLOv8 Person Detection',
    desc: 'YOLOv8 runs on raw frames using the COCO-pretrained model filtered to the "person" class. Detection count per frame feeds into density metrics, risk classification, and historical trend graphs.',
  },
  {
    icon: <Activity size={22} />,
    title: 'Real-Time Dashboard',
    desc: 'React dashboard polls the /stats endpoint every 1 s, updating crowd count, density percentage, risk level badge, and a rolling time-series chart — without any page refresh, using fetch + useEffect intervals.',
  },
  {
    icon: <Server size={22} />,
    title: 'RESTful API with Dual Error Layers',
    desc: 'FastAPI endpoints (/stats, /video-feed, /classify) return structured JSON. Both client (try/catch + fallback UI) and server (HTTPException + Pydantic validation) handle failures independently — zero blank-screen crashes.',
  },
  {
    icon: <AlertTriangle size={22} />,
    title: '7 Safety Violation Categories',
    desc: 'Beyond person count, the system flags: overcrowding, boundary breach, restricted-zone entry, crowd surge, queue violation, unsafe clustering, and no-movement deadlock — each with a custom alert icon and response protocol.',
  },
  {
    icon: <ShieldAlert size={22} />,
    title: 'Environment-Variable-Driven Config',
    desc: 'VITE_API_BASE_URL in a .env file is the sole connection point between frontend and backend. No hardcoded URLs exist anywhere in the codebase — the most common hackathon deployment failure eliminated by design.',
  },
];

const QA = [
  {
    q: 'How does the webcam feed reach the FastAPI backend?',
    a: 'The React frontend accesses the camera via navigator.mediaDevices.getUserMedia(). Frames are captured to a <canvas> element, converted to a Blob (JPEG), and POSTed to POST /process-frame. The backend runs YOLOv8 inference on the raw bytes using cv2.imdecode, draws bounding boxes with cv2.rectangle, re-encodes to JPEG, and returns as a base64 string. The dashboard sets this as the src of an <img> tag.',
  },
  {
    q: 'Why FastAPI over Flask or Django?',
    a: 'FastAPI uses Python\'s async/await natively via Uvicorn (ASGI), which means multiple webcam frame POSTs can be handled concurrently without blocking. Flask is WSGI (synchronous) — each frame would queue behind the previous one, adding latency. Django is overkill for a stateless inference API. FastAPI also auto-generates OpenAPI docs at /docs, invaluable for quick debugging during hackathon development.',
  },
  {
    q: 'How is the 5 fps inference rate achieved without dropping frames?',
    a: 'The frontend uses setInterval(captureAndSend, 200) — one frame every 200 ms. To prevent queue buildup, the POST request is only sent if no previous request is in-flight (tracked with a boolean ref). This back-pressure mechanism ensures inference is always on the most recent frame rather than a stale buffer.',
  },
  {
    q: 'How does the risk classification work?',
    a: 'The /classify endpoint accepts a person_count integer. A threshold ladder maps count → risk tier: <15 = LOW, <25 = MEDIUM, <40 = HIGH, ≥40 = CRITICAL. The frontend displays a colour-coded badge and triggers a browser Notification API alert for CRITICAL and HIGH states, even if the user\'s tab is backgrounded.',
  },
  {
    q: 'What does the dual-layer error handling look like in practice?',
    a: 'Server side: FastAPI raises HTTPException(status_code=422) if Pydantic model validation fails (e.g. negative count). It raises 503 if the YOLO model file is missing at startup. Client side: every fetch() is wrapped in try/catch. On network failure, the dashboard shows a "Backend unreachable — retrying" banner while continuing to poll, so the UI never goes blank.',
  },
  {
    q: 'How was the hackathon postmortem useful?',
    a: 'Three real incidents: (1) Accidentally running git submodule add instead of git add — fixed by removing the .gitmodules entry and re-adding as a regular folder. (2) Running git rm -rf frontend/ in the wrong directory, losing the React source. Recovered from GitHub history with git checkout HEAD~1 -- frontend/. (3) Import/export mismatches: using named imports for default exports — fixed by standardising on default exports throughout and adding an eslint rule.',
  },
];

const PIPELINE_STEPS = [
  { step: '01', label: 'Browser Webcam Capture', detail: 'MediaDevices API → canvas → JPEG Blob @ 200 ms intervals', color: 'text-blue-400 border-blue-500/40' },
  { step: '02', label: 'POST /process-frame', detail: 'Blob POSTed to FastAPI — back-pressure prevents queue buildup', color: 'text-cyan-400 border-cyan-500/40' },
  { step: '03', label: 'YOLOv8 Inference', detail: 'cv2.imdecode → YOLOv8 (person class only) → bounding boxes', color: 'text-teal-400 border-teal-500/40' },
  { step: '04', label: 'Frame Re-encode', detail: 'cv2.rectangle + cv2.imencode → base64 JPEG response', color: 'text-green-400 border-green-500/40' },
  { step: '05', label: 'GET /stats (1 s poll)', detail: 'Count, density %, risk tier, violation flags → JSON', color: 'text-amber-400 border-amber-500/40' },
  { step: '06', label: 'Risk Classification', detail: 'Threshold ladder → LOW / MEDIUM / HIGH / CRITICAL', color: 'text-orange-400 border-orange-500/40' },
  { step: '07', label: 'Dashboard Update', detail: 'React state → badge, chart, alert banner, browser Notification', color: 'text-red-400 border-red-500/40' },
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

const SmartCrowdPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative py-24 px-6 overflow-hidden">
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

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-medium mb-6">
              <Users size={12} />
              <span>Full-Stack AI Project · Deep Dive</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Crowd</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl leading-relaxed">
              Real-time crowd density monitoring and safety risk detection — YOLOv8 on live webcam streams, FastAPI backend, React dashboard.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/viren-pandey/Smartcrowd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Github size={16} />
                <span>View on GitHub</span>
              </a>
              <a
                href="https://smartcrowd.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-400 dark:text-purple-300 text-sm font-medium hover:bg-purple-500/20 transition-colors"
              >
                <ExternalLink size={16} />
                <span>Live Demo</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats band ── */}
      <section className="border-y border-black/10 dark:border-white/10 bg-gray-100/60 dark:bg-white/[0.03] px-6 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '5 fps', label: 'Live YOLOv8 Webcam Inference' },
            { value: '<4 s', label: 'End-to-End Alert Latency' },
            { value: '7', label: 'Safety Violation Categories' },
            { value: '0', label: 'Hardcoded API URLs' },
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
│          Browser  (React + Vite SPA)            │
│  Dashboard │ Webcam Feed │ Alerts │ Stats Chart │
└────────────┬──────────────────────┬─────────────┘
             │ POST /process-frame  │ GET /stats (1s)
             │ (JPEG frame blob)    │ GET /classify
             ▼                      ▼
┌─────────────────────────────────────────────────┐
│           FastAPI Backend  (port 8000)          │
│  /process-frame  /stats  /classify  /health     │
└──────────────────────┬──────────────────────────┘
                       │
          ┌────────────┴─────────────┐
          ▼                          ▼
┌──────────────────┐      ┌──────────────────────┐
│  YOLOv8 Infer.   │      │   Risk Classifier    │
│  (person class)  │      │  count → threshold   │
│  cv2 → bbox draw │      │  → LOW/MED/HIGH/CRIT │
└────────┬─────────┘      └──────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│           Response (JSON + base64 JPEG)         │
│  { count, density, risk, violations, frame }    │
└─────────────────────────────────────────────────┘`}</pre>
          </div>
        </motion.section>

        {/* ── Pipeline ── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Inference Pipeline</SectionTitle>
          <div className="space-y-3">
            {PIPELINE_STEPS.map(({ step, label, detail, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className={`flex items-start space-x-5 p-4 rounded-2xl border ${color.split(' ')[1]} bg-white dark:bg-black/20`}
              >
                <span className={`text-xs font-mono font-bold ${color.split(' ')[0]} pt-0.5`}>{step}</span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Key Features ── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Key Features</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 flex flex-col space-y-3">
                <div className="p-2.5 w-fit rounded-xl bg-purple-500/10 text-purple-400">{icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Risk Classification ── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Risk Classification Engine</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                The classifier maps real-time person count to a 4-tier risk level using a threshold ladder. Each tier triggers a different UI state and (for CRITICAL/HIGH) a browser Notification API push even in backgrounded tabs.
              </p>
              <div className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
                <div className="bg-gray-50 dark:bg-white/5 border-b border-black/10 dark:border-white/10 px-4 py-2 flex items-center space-x-2">
                  <Brain size={13} className="text-gray-400" />
                  <span className="text-xs font-mono text-gray-500">classifier.py — threshold ladder</span>
                </div>
                <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 p-4 overflow-x-auto">{`def classify(count: int) -> str:
    if count >= 40: return "CRITICAL"
    if count >= 25: return "HIGH"
    if count >= 15: return "MEDIUM"
    return "LOW"`}</pre>
              </div>
              <div className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
                <div className="bg-gray-50 dark:bg-white/5 border-b border-black/10 dark:border-white/10 px-4 py-2 flex items-center space-x-2">
                  <AlertTriangle size={13} className="text-gray-400" />
                  <span className="text-xs font-mono text-gray-500">frontend — alert thresholds</span>
                </div>
                <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 p-4 overflow-x-auto">{`CRITICAL → Browser Notification + red banner
HIGH     → Browser Notification + orange badge
MEDIUM   → Amber badge (no notification)
LOW      → Green badge (normal state)`}</pre>
              </div>
            </div>

            <div className="space-y-3">
              {RISK_LEVELS.map(({ level, threshold, color, bar, width, desc }) => (
                <div key={level} className={`rounded-2xl border p-4 ${color}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold tracking-widest">{level}</span>
                    <span className="text-xs font-mono opacity-70">{threshold}</span>
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

        {/* ── Engineering Highlights ── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Engineering Highlights</SectionTitle>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Back-Pressure Frame Sending',
                code: `const inFlight = useRef(false);

const sendFrame = async () => {
  if (inFlight.current) return; // skip stale
  inFlight.current = true;
  await postFrame(blob);
  inFlight.current = false;
};

setInterval(sendFrame, 200);`,
                desc: 'Prevents frame queue buildup. If inference takes >200 ms, the next capture tick is dropped rather than queued, so the dashboard always shows the most recent state.',
              },
              {
                title: 'Env-Var Config (No Hardcoding)',
                code: `# .env
VITE_API_BASE_URL=http://127.0.0.1:8000

# Usage in React
const BASE = import.meta.env
               .VITE_API_BASE_URL;

fetch(\`\${BASE}/process-frame\`, ...)`,
                desc: 'Single .env variable drives all API calls. Switching from local dev to production requires changing one line, not hunting through source files.',
              },
              {
                title: 'Dual-Layer Error Handling',
                code: `# Server (FastAPI)
@app.exception_handler(Exception)
async def global_handler(req, exc):
    raise HTTPException(503, str(exc))

// Client (React)
try {
  const r = await fetch(url);
  if (!r.ok) showBanner("retrying…");
} catch { showBanner("offline"); }`,
                desc: 'Server validates all inputs via Pydantic and returns structured error JSON. Client wraps every call — network failure shows a retry banner, never a blank page.',
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
          <SectionTitle>FAQ</SectionTitle>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Common questions about the webcam pipeline, FastAPI design decisions, error handling patterns, and hackathon postmortem lessons.
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
          <Users size={40} className="mx-auto mb-4 text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Explore the Codebase</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Every detail in this breakdown corresponds to real code — from the back-pressure frame sender to the dual error-handling layers.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/viren-pandey/Smartcrowd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Github size={16} />
              <span>GitHub Repository</span>
            </a>
            <a
              href="https://smartcrowd.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors"
            >
              <ExternalLink size={16} />
              <span>Live Demo</span>
            </a>
          </div>
        </motion.section>

      </div>

      {/* ── Floating corner buttons ── */}
      <div className="fixed bottom-24 right-8 z-[70] flex flex-col gap-3">
        <a
          href="https://github.com/viren-pandey/Smartcrowd"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Repository"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-lg backdrop-blur-sm transition-colors text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400"
        >
          <Github size={18} />
        </a>
        <a
          href="https://smartcrowd.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          title="Live Demo"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-lg backdrop-blur-sm transition-colors text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400"
        >
          <ExternalLink size={18} />
        </a>
      </div>
    </div>
  );
};

export default SmartCrowdPage;
