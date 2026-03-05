
import { Project, SkillCategory } from './types';

export const SKILLS: SkillCategory[] = [
  {
    category: "Core Technologies",
    skills: ["TypeScript", "React.js", "Java", "Python", "JavaScript"]
  },
  {
    category: "AI/ML Frameworks",
    skills: ["YOLOv8", "PyTorch", "OpenCV", "TensorFlow", "Generative AI"]
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
    title: "SmartCrowd",
    description: "Real-Time Crowd Density & Safety Monitoring System",
    points: [
      "Developed full-stack AI system analyzing live video streams for real-time person detection.",
      "Built responsive React.js dashboard with TailwindCSS for monitoring crowd metrics.",
      "Engineered RESTful API endpoints for statistics and video feed streaming.",
      "Integrated continuous webcam streaming with YOLO inference pipeline."
    ],
    tags: ["YOLOv8", "FastAPI", "React.js", "TailwindCSS"],
    github: "https://github.com/viren-pandey",
    link: "https://smartcrowd.netlify.app"
  },
  {
    title: "DualityAI",
    description: "Safety Detection Model for Space Station Challenge",
    points: [
      "Built AI-powered object detection system identifying 7 safety-critical objects (Oxygen Tank, Fire Alarm, etc.).",
      "Trained YOLOv8 model on DualityAI Falcon dataset achieving high-accuracy detection.",
      "Developed Streamlit web application enabling real-time image uploads and inference.",
      "Implemented complete end-to-end pipeline including training, testing, and deployment."
    ],
    tags: ["YOLOv8", "Streamlit", "PyTorch", "OpenCV"],
    github: "https://github.com/viren-pandey"
  }
];

export const EDUCATION = [
  {
    institution: "Dr. A.P.J. Abdul Kalam Technical University",
    period: "August 2024 – August 2028",
    degree: "Bachelor of Technology - BTech, Computer Science And Engineering",
    specialization: "Artificial Intelligence And Machine learning"
  },
  {
    institution: "Central Hindu Boys School",
    period: "September 2021 – April 2023",
    degree: "Higher Secondary Education (12th, PCM)"
  },
  {
    institution: "D.A.V. Public School - India",
    period: "April 2016 – May 2021",
    degree: "CLASS 10"
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
    learned: [
      "Core mechanics of how Artificial Intelligence learns and iterates.",
      "Hands-on practice with Generative AI tools and frameworks.",
      "Exploring real-world industrial use cases for AI and computer vision.",
      "Hardware acceleration fundamentals for deep learning workloads."
    ]
  }
];
