
export interface Project {
  title: string;
  description: string;
  points: string[];
  tags: string[];
  link?: string;
  github?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
