
import { Project, ProjectStat, SkillCategory } from './types';
export type { ProjectStat };

export const SKILLS: SkillCategory[] = [
  {
    category: "Core Technologies",
    skills: ["TypeScript", "MERN STACK", "Java", "Python", "JavaScript", "C/C++"]
  },
  {
    category: "ML Frameworks",
    skills: ["YOLOv8", "PyTorch", "OpenCV", "TensorFlow", "Pandas","Numpy"]
  },
  {
    category: "Web & Backend",
    skills: ["FastAPI", "Node.js", "Streamlit", "Vite", "TailwindCSS", "REST APIs"]
  },
  {
    category: "Tools & Clouds",
    skills: ["Google Cloud", "Oracle Cloud", "Git", "GitHub", "VS Code"]
  }
];

export const PROJECTS: Project[] = [
  {
    title: "SpaceDebrisAI",
    description: "Real-Time Satellite Conjunction Monitoring & Collision Risk System",
    points: [
      "Built a full-stack system tracking 200+ satellites using live TLE data from CelesTrak + SGP4 orbital propagation.",
      "Engineered a Python ML risk classifier with altitude-weighted scoring (LEO ×1.2 factor) and 4-tier risk levels.",
      "Developed React 19 dashboard with auto-advancing risk cards, animated star field, and real-time conjunction alerts.",
      "Implemented 3-tier fallback (CelesTrak → local TLE → simulated) ensuring 100% uptime for demos."
    ],
    stats: [
      { value: "190",    label: "Satellite pairs screened per run" },
      { value: "<50ms",  label: "Conjunction detection latency" },
      { value: "100%",   label: "Uptime via 3-tier fallback" },
      { value: "4×",     label: "Risk tiers classified" },
      { value: "+25km",  label: "Max maneuver altitude boost" },
      { value: "1.2×",   label: "LEO altitude risk multiplier" },
    ],
    tags: ["Python", "FastAPI", "React 19", "SGP4", "Docker", "Vite"],
    github: "https://github.com/viren-pandey/SpaceDebrisAI",
    link: "https://spacedebrisai.vercel.app",
    detailPath: "/project/space-debris-ai"
  },
  {
    title: "SmartCrowd",
    description: "Intelligent Crowd Analysis, Risk Detection & Simulation Platform",
    points: [
      "Full-stack React + Vite frontend with Python FastAPI backend — strict separation of concerns between UI and business logic.",
      "YOLOv8 on live webcam streams at 5 fps; real-time dashboard showing crowd density, risk scores, and safety alerts under <4 s latency.",
      "RESTful API with dual-layer error handling (client + server) — UI degrades gracefully on backend failures, zero blank screens.",
      "Env-var-driven config (VITE_API_BASE_URL), no hardcoded endpoints — deployed live on Netlify."
    ],
    stats: [
      { value: "5fps",  label: "Real-time YOLOv8 webcam inference" },
      { value: "<4s",   label: "End-to-end alert response latency" },
      { value: "7",     label: "Safety violation categories monitored" },
      { value: "0",     label: "Hardcoded API URLs (env-var driven)" },
      { value: "70%",   label: "Crowd accident risk reduction (simulation)" },
      { value: "100%",  label: "Uptime with graceful API error fallback" },
    ],
    tags: ["YOLOv8", "FastAPI", "React.js", "Vite", "TailwindCSS", "Python"],
    github: "https://github.com/viren-pandey/Smartcrowd",
    link: "https://smartcrowd.netlify.app",
    detailPath: "/project/smart-crowd"
  },
  {
    title: "DualityAI Safety Detection",
    description: "BuildWithIndia 2.0 — Space Station Safety Object Detection Challenge",
    points: [
      "Custom YOLOv8 model fine-tuned on the Falcon synthetic dataset — detects 7 safety-critical objects (OxygenTank, FireAlarm, FireExtinguisher, etc.) at 95%+ accuracy.",
      "Streamlit web app for judges: upload any image → live YOLO inference → annotated download in <2 s.",
      "Complete auditable pipeline: train.py → predict.py → app.py, with training logs, P/R curves, and a formal PDF report in docs/.",
      "Dual environment setup (pip + Conda) ensuring exact reproducibility across any machine."
    ],
    stats: [
      { value: "7",     label: "Safety-critical object classes detected" },
      { value: "95%+",  label: "Detection accuracy on Falcon synthetic dataset" },
      { value: "<2s",   label: "Streamlit real-time image inference latency" },
      { value: "100%",  label: "Pipeline coverage (train → predict → deploy)" },
      { value: "2",     label: "Environment setup paths (pip + Conda)" },
      { value: "1",     label: "Formal challenge submission with full report" },
    ],
    tags: ["YOLOv8", "Streamlit", "PyTorch", "OpenCV", "Python", "Conda"],
    github: "https://github.com/viren-pandey/DualityAI-Safety-Detection-Model",
    link: "https://github.com/viren-pandey/DualityAI-Safety-Detection-Model",
    detailPath: "/project/duality-ai"
  }
];

export const EDUCATION = [
  {
    institution: "Dr. A.P.J. Abdul Kalam Technical University",
    period: "August 2024 – August 2028",
    degree: "Bachelor of Technology - BTech, Computer Science And Engineering with Specialisation in Artificial Intelligence and Machine Learning",
    specialization: "Artificial Intelligence And Machine learning"
  },
  {
    institution: "Central Hindu Boys School B.H.U.",
    period: "September 2021 – April 2023",
    degree: "Higher Secondary Education (12th, PCM)",
    specialization: "Got admission in CHS BHU and completedd my class 12th and got the prior education from there"

  },
  {
    institution: "D.A.V. Public School - Varanasi",
    period: "April 2016 – May 2021",
    degree: "CLASS 10",
    specialization: "Completed it and got 95.33% in my boards"

  }
];

export interface Certification {
  name: string;
  issuer: string;
  link?: string;
  learned?: string[];
}

export const CERTIFICATIONS: Certification[] = [
  {
    name: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    issuer: "Oracle",
    link: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=0A2B6388E1FE5C603FA66F8726B283C97F43B1327F1E4A66498D36513764360F",
    learned: [
      "Fundamental concepts of AI, Machine Learning, and Deep Learning.",
      "Generative AI concepts including Large Language Models (LLMs) and Prompt Engineering.",
      "Oracle Cloud Infrastructure AI Services (Digital Assistant, Vision, Language, Speech).",
      "Building and deploying AI-powered applications on OCI."
    ]
  },
  {
    name: "Introduction to Cyber Security",
    issuer: "Cisco",
    link: "https://www.credly.com/badges/649f3119-d3fa-4e72-b591-e8de965e678c/public_url",
    learned: [
      "Understanding cyber security landscapes and common threats like malware and phishing.",
      "Protective measures for personal and organizational data.",
      "Networking basics and secure device configuration.",
      "Ethics and legal responsibilities in the cybersecurity domain."
    ]
  },
  {
    name: "Prepare Data for ML APIs on Google Cloud Skill",
    issuer: "Google Cloud",
    link: "https://www.credly.com/badges/77633f2c-9d0e-4078-98ca-c1555ecaa9cd/public_url",
    learned: [
      "Data preprocessing and feature engineering for machine learning models.",
      "Leveraging Google Cloud BigQuery and Vertex AI for dataset management.",
      "Exploratory Data Analysis (EDA) using Cloud SQL and BigQuery ML.",
      "Best practices for training and evaluating data for scalable ML APIs."
    ]
  },
  {
    name: "AI for All: From Basics to GenAI Practice",
    issuer: "NVIDIA",
    link: "https://ibb.co/DDTpQmr4",
    learned: [
      "Core mechanics of how Artificial Intelligence learns and iterates.",
      "Hands-on practice with Generative AI tools and frameworks.",
      "Exploring real-world industrial use cases for AI and computer vision.",
      "Hardware acceleration fundamentals for deep learning workloads."
    ]
  }
];
