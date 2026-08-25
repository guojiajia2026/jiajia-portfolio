export interface UserProfile {
  name: string
  title: string
  education: string
  school: string
  avatarUrl: string
  tags: InfoTag[]
}

export interface InfoTag {
  icon: string
  label: string
  value: string
  subValue?: string
}

export interface Skill {
  id: string
  icon: string
  name: string
  level: number
  maxLevel: number
  details?: SkillDetail
}

export interface SkillDetail {
  title: string
  knowledge: string[]
  projects: string[]
  exploreLink?: string
}

export interface ExpRecord {
  label: string
  value: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  cards?: ChatCard[]
  timestamp: number
}

export interface ChatCard {
  type: 'insight' | 'experience' | 'suggestion'
  title: string
  content?: string
  tags?: string[]
  link?: string
}

export interface StarterQuestion {
  id: string
  title: string
  prompt: string
  category: string
}

export interface JourneyItem {
  year: string
  title: string
  description?: string
}

export interface MatchResult {
  score: number
  position: string
  level: string
  summary: string
  matches: MatchItem[]
  gaps: string[]
  highlights: string[]
  recommendations: string[]
  elevatorPitch: string
}

export interface MatchItem {
  requirement: string
  stars: number
  evidence: string
}

export interface ProductCase {
  id: string
  name: string
  company: string
  tag: string
  stars: number
  icon: string
  desc: string
  background: string
  solution: string[]
  results: { label: string; value: string }[]
  insights: string
  tags: string[]
}

export interface ExperienceItem {
  id: string
  company: string
  project: string
  role: string
  tag: string
  brief: string
  caseId?: string
}
