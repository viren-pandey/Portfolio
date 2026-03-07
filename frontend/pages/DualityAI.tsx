import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Github,
  ExternalLink,
  ArrowLeft,
  Cpu,
  Brain,
  Layers,
  ShieldAlert,
  Zap,
  ChevronDown,
  ChevronUp,
  Server,
  Code2,
  Camera,
  Activity,
  Package,
  FileText,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const TECH_STACK = [
  { label: 'YOLOv8', icon: <Brain size={16} />, color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', text: 'text-purple-400' },
  { label: 'PyTorch', icon: <Cpu size={16} />, color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/30', text: 'text-orange-400' },
  { label: 'OpenCV', icon: <Camera size={16} />, color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/30', text: 'text-green-400' },
  { label: 'Streamlit', icon: <Code2 size={16} />, color: 'from-red-500/20 to-red-500/5', border: 'border-red-500/30', text: 'text-red-400' },
  { label: 'Ultralytics', icon: <Activity size={16} />, color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', text: 'text-blue-400' },
  { label: 'NumPy', icon: <Layers size={16} />, color: 'from-sky-500/20 to-sky-500/5', border: 'border-sky-500/30', text: 'text-sky-400' },
  { label: 'Conda / pip', icon: <Package size={16} />, color: 'from-teal-500/20 to-teal-500/5', border: 'border-teal-500/30', text: 'text-teal-400' },
  { label: 'PyYAML', icon: <FileText size={16} />, color: 'from-gray-500/20 to-gray-500/5', border: 'border-gray-500/30', text: 'text-gray-400' },
];

const CLASSES = [
  { name: 'OxygenTank', color: 'bg-blue-500/20 border-blue-500/40 text-blue-400', icon: '🫁' },
  { name: 'NitrogenTank', color: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400', icon: '💨' },
  { name: 'FirstAidBox', color: 'bg-green-500/20 border-green-500/40 text-green-400', icon: '🩺' },
  { name: 'FireAlarm', color: 'bg-red-500/20 border-red-500/40 text-red-400', icon: '🚨' },
  { name: 'SafetySwitchPanel', color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400', icon: '⚡' },
  { name: 'EmergencyPhone', color: 'bg-purple-500/20 border-purple-500/40 text-purple-400', icon: '📞' },
  { name: 'FireExtinguisher', color: 'bg-orange-500/20 border-orange-500/40 text-orange-400', icon: '🧯' },
];

const FEATURES = [
  {
    icon: <Brain size={22} />,
    title: 'Custom YOLOv8 on Falcon Synthetic Dataset',
    desc: 'Fine-tuned YOLOv8 on DualityAI\'s Falcon synthetic dataset — a photorealistic 3D-rendered space station environment. Synthetic data eliminates the cost of real-world annotation while providing full label coverage across all 7 safety-critical classes.',
  },
  {
    icon: <Camera size={22} />,
    title: 'Real-Time Streamlit Inference App',
    desc: 'Judges upload any image via a drag-and-drop widget. Streamlit passes the bytes to YOLO, which runs inference in <2 s, draws bounding boxes with class labels and confidence scores using cv2, and returns the annotated image with a download button.',
  },
  {
    icon: <Activity size={22} />,
    title: 'Complete Auditable Training Pipeline',
    desc: 'train.py wraps the Ultralytics training API with hyperparameter config (epochs, batch, imgsz). All runs are saved to runs/detect/trainX/ — including confusion matrices, precision-recall curves, and F1 plots — so every training decision is traceable.',
  },
  {
    icon: <Package size={22} />,
    title: 'Reproducible Dual-Environment Setup',
    desc: 'Two parallel setup paths: pip install -r requirements.txt for standard environments, and setup_env.bat → conda activate EDU for exact environment reproduction. Eliminates the "works on my machine" problem for judges replicating results.',
  },
  {
    icon: <ShieldAlert size={22} />,
    title: 'Falcon Model Update Pipeline',
    desc: 'The Streamlit app includes a dedicated explanation panel showing how the Falcon-generated synthetic scenes are used to update the base YOLO weights — closing the loop between dataset generation, fine-tuning, and deployment.',
  },
  {
    icon: <Server size={22} />,
    title: 'Full Submission Package',
    desc: 'Final_Submission/ contains models/ (best.pt), runs/ (training logs), predictions/ (output images + YOLO label .txt files), code/ (train.py, predict.py, app.py), and docs/Report.pdf — a complete, self-contained submission artefact.',
  },
];

const QA = [
  {
    q: 'Why use synthetic Falcon data instead of real images?',
    a: 'Real space station images with annotated safety equipment are extremely scarce and expensive to label. DualityAI\'s Falcon platform generates photorealistic 3D-rendered scenes with automatic ground-truth labels — pixel-perfect bounding boxes, depth maps, and segmentation masks. This gives thousands of labelled training samples at zero annotation cost. The trade-off is a potential domain gap at deployment, which is mitigated by Falcon\'s photorealism and material accuracy.',
  },
  {
    q: 'What does the YOLOv8 training configuration look like?',
    a: 'train.py calls model.train(data="dataset.yaml", epochs=100, batch=16, imgsz=640). The dataset.yaml specifies the Falcon dataset path and the 7 class names. YOLOv8 uses mosaic augmentation, mixup, random flips, and HSV jitter by default — all controlled via the Ultralytics config. best.pt (lowest validation loss checkpoint) is saved automatically and used for all inference.',
  },
  {
    q: 'How does predict.py work and where do outputs go?',
    a: 'predict.py loads best.pt via YOLO("models/best.pt") and calls model.predict(source="test_images/", save=True, save_txt=True). Ultralytics writes annotated JPEG images to predictions/images/ and YOLO-format label files (class x_center y_center width height confidence) to predictions/labels/. Each label file corresponds 1:1 to its source image.',
  },
  {
    q: 'How does the Streamlit app handle large image uploads?',
    a: 'st.file_uploader() returns a BytesIO object. It\'s converted to a NumPy array via np.frombuffer → cv2.imdecode (BGR). YOLO runs inference on the NumPy array directly — no temp file needed. The result image is re-encoded to JPEG bytes via cv2.imencode and displayed with st.image(). A download button is wired to the same bytes via st.download_button.',
  },
  {
    q: 'Why Conda alongside pip for environment setup?',
    a: 'PyTorch has CUDA-specific wheel variants that conda resolves more reliably than pip on Windows — pip can pull a CPU-only wheel even on a CUDA-capable machine. The Conda environment (setup_env.bat → conda activate EDU) pins exact package versions including cudatoolkit, ensuring that GPU acceleration works on the same machine used for training. Judges with non-CUDA machines can use the pip path, which falls back to CPU inference.',
  },
  {
    q: 'What metrics were used to evaluate the model?',
    a: 'Ultralytics logs mAP@0.5 (mean Average Precision at IoU threshold 0.5) and mAP@0.5:0.95 per class and overall. The training run also records precision and recall curves per class, and a confusion matrix showing per-class false positive / false negative rates. These are all saved to runs/detect/trainX/ as PNG plots and a results.csv for programmatic analysis.',
  },
];

const PIPELINE_STEPS = [
  { step: '01', label: 'Falcon Synthetic Dataset', detail: 'Photorealistic 3D-rendered space station scenes + auto-labelled bounding boxes', color: 'text-blue-400 border-blue-500/40' },
  { step: '02', label: 'Dataset Config (dataset.yaml)', detail: '7 class names, train/val split paths, image count', color: 'text-cyan-400 border-cyan-500/40' },
  { step: '03', label: 'train.py — YOLOv8 Fine-Tune', detail: 'epochs=100, batch=16, imgsz=640 → best.pt checkpoint', color: 'text-teal-400 border-teal-500/40' },
  { step: '04', label: 'Training Logs (runs/)', detail: 'mAP, precision, recall, confusion matrix, F1 curves saved', color: 'text-green-400 border-green-500/40' },
  { step: '05', label: 'predict.py — Batch Inference', detail: 'best.pt → test images → annotated JPEGs + YOLO label .txts', color: 'text-amber-400 border-amber-500/40' },
  { step: '06', label: 'app.py — Streamlit Web App', detail: 'Upload image → YOLO inference → annotated download in <2 s', color: 'text-orange-400 border-orange-500/40' },
  { step: '07', label: 'Final_Submission/ Package', detail: 'models/ + runs/ + predictions/ + code/ + docs/Report.pdf', color: 'text-red-400 border-red-500/40' },
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

const DualityAIPage: React.FC = () => {
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
              <Zap size={12} />
              <span>BuildWithIndia 2.0 · DualityAI Challenge · Deep Dive</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Duality<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">AI</span> Safety Detection
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl leading-relaxed">
              Custom YOLOv8 model detecting 7 safety-critical objects in space station environments — trained on the Falcon synthetic dataset, deployed via a Streamlit web app.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/viren-pandey/DualityAI-Safety-Detection-Model"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Github size={16} />
                <span>View on GitHub</span>
              </a>
              <a
                href="https://duality-ai-safety-detection-model.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-purple-500/40 text-purple-500 dark:text-purple-400 text-sm font-medium hover:bg-purple-500/10 transition-colors"
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
            { value: '7', label: 'Safety-Critical Object Classes' },
            { value: '95%+', label: 'mAP on Falcon Dataset' },
            { value: '<2 s', label: 'Streamlit Inference Latency' },
            { value: '100%', label: 'Pipeline Coverage (train → deploy)' },
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

        {/* ── Detected Classes ── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Detected Safety Classes</SectionTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            All 7 classes are mission-critical aboard a space station. Missing or obscured safety equipment can be life-threatening — making high-accuracy automated detection a genuine safety requirement, not just a demo.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CLASSES.map(({ name, color, icon }) => (
              <div key={name} className={`rounded-2xl border p-4 ${color} flex items-center space-x-3`}>
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-medium">{name}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Architecture ── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Submission Architecture</SectionTitle>
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/30 overflow-hidden">
            <div className="border-b border-black/10 dark:border-white/10 px-6 py-3 flex items-center space-x-2 bg-gray-50 dark:bg-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-gray-500 dark:text-gray-500 font-mono">Final_Submission/structure.txt</span>
            </div>
            <pre className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-mono p-6 overflow-x-auto leading-relaxed">{`Final_Submission/
│
├── models/
│   └── best.pt              ← trained YOLOv8 weights (lowest val loss)
│
├── runs/
│   └── detect/train/        ← mAP, P/R curves, confusion matrix, F1
│       ├── results.csv
│       ├── confusion_matrix.png
│       └── PR_curve.png
│
├── predictions/
│   ├── images/              ← annotated test images (JPEG)
│   └── labels/              ← YOLO .txt label files (class x y w h conf)
│
├── code/
│   ├── train.py             ← fine-tune YOLOv8 on Falcon dataset
│   ├── predict.py           ← batch inference → predictions/
│   ├── app.py               ← Streamlit web app for judges
│   └── ENV_SETUP/
│       └── setup_env.bat    ← conda env reproduction script
│
├── docs/
│   └── Report.pdf           ← full methodology + results writeup
│
└── requirements.txt         ← pip install path`}</pre>
          </div>
        </motion.section>

        {/* ── Pipeline ── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>End-to-End Pipeline</SectionTitle>
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

        {/* ── Code Snippets ── */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionTitle>Code Highlights</SectionTitle>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'train.py — Core Training Call',
                code: `from ultralytics import YOLO

model = YOLO("yolov8n.pt")
model.train(
  data="dataset.yaml",
  epochs=100,
  batch=16,
  imgsz=640,
  project="runs",
  name="detect",
)`,
                desc: 'Ultralytics handles augmentation, validation split, and checkpointing automatically. best.pt is saved at the lowest val/mAP epoch.',
              },
              {
                title: 'predict.py — Batch Inference',
                code: `from ultralytics import YOLO

model = YOLO("models/best.pt")
results = model.predict(
  source="test_images/",
  save=True,       # annotated JPEGs
  save_txt=True,   # YOLO label files
  conf=0.25,
)`,
                desc: 'conf=0.25 filters low-confidence detections. save_txt writes class + normalised bbox coordinates for programmatic evaluation.',
              },
              {
                title: 'app.py — Streamlit Inference',
                code: `import streamlit as st, cv2
import numpy as np
from ultralytics import YOLO

model = YOLO("models/best.pt")
f = st.file_uploader("Upload image")
if f:
  arr = np.frombuffer(f.read(),
                      np.uint8)
  img = cv2.imdecode(arr, 1)
  res = model(img)[0].plot()
  st.image(res[:,:,::-1])`,
                desc: 'No temp files — BytesIO → NumPy → YOLO → annotated array → st.image(). Fast path with zero disk I/O.',
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
            Common questions about synthetic data, YOLOv8 training configuration, evaluation metrics, and the Streamlit deployment pipeline.
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
          <Zap size={40} className="mx-auto mb-4 text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Explore the Full Submission</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            The GitHub repo contains every artefact: trained model, training logs, prediction outputs, Streamlit app, and the PDF report.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/viren-pandey/DualityAI-Safety-Detection-Model"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Github size={16} />
              <span>GitHub Repository</span>
            </a>
            <a
              href="https://duality-ai-safety-detection-model.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-purple-500/40 text-purple-500 dark:text-purple-400 text-sm font-medium hover:bg-purple-500/10 transition-colors"
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
          href="https://duality-ai-safety-detection-model.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          title="Live Demo"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-lg backdrop-blur-sm transition-colors text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400"
        >
          <ExternalLink size={18} />
        </a>
        <a
          href="https://github.com/viren-pandey/DualityAI-Safety-Detection-Model"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Repository"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-lg backdrop-blur-sm transition-colors text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400"
        >
          <Github size={18} />
        </a>
      </div>
    </div>
  );
};

export default DualityAIPage;
