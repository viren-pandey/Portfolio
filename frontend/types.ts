
export interface ProjectStat {
  value: string;
  label: string;
}

export interface Project {
  title: string;
  description: string;
  points: string[];
  tags: string[];
  stats?: ProjectStat[];
  link?: string;
  github?: string;
  detailPath?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
