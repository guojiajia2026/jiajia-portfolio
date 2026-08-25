import type { KnowledgeData } from './knowledge'
import {
  mockProfile, mockSkills, mockEducation, mockInternships,
  mockProductCases, mockAwards, mockHobbies, mockCertificates, mockCampus,
} from '@/data/mockData'

// 将mockData转换为KnowledgeData格式
export const knowledgeData: KnowledgeData = {
  profile: {
    name: mockProfile.name,
    title: mockProfile.title,
    school: '中央财经大学',
    education: '保险硕士',
    location: '北京',
    focus: 'AI + 商业化产品方向',
  },
  education: mockEducation.map(e => ({
    school: e.school,
    degree: e.degree,
    period: e.period,
    detail: e.detail,
  })),
  skills: mockSkills.map(s => ({
    name: s.name,
    level: s.level,
    maxLevel: s.maxLevel,
    knowledge: s.details?.knowledge || [],
    projects: s.details?.projects || [],
  })),
  internships: mockInternships.map(intern => ({
    company: intern.company,
    period: intern.period,
    role: intern.role,
    department: intern.department,
    tags: intern.tags,
    description: intern.description,
    highlight: intern.highlight,
    projects: intern.projects?.map(p => ({
      name: p.name,
      detail: p.detail,
      tags: p.tags,
    })) || [],
  })),
  productCases: mockProductCases.map(c => ({
    name: c.name,
    company: c.company,
    tag: c.tag,
    stars: c.stars,
    desc: c.desc,
    background: c.background,
    solution: c.solution,
    results: c.results,
    insights: c.insights,
    tags: c.tags,
  })),
  awards: mockAwards.map(a => ({
    name: a.name,
    level: a.level,
    year: a.year,
    category: a.category,
  })),
  hobbies: mockHobbies.map(h => ({
    name: h.name,
    desc: h.desc,
  })),
  certificates: mockCertificates.map(c => ({
    name: c.name,
    score: c.score,
    category: c.category,
  })),
  campus: mockCampus.map(c => ({
    role: c.role,
    period: c.period,
    desc: c.desc,
  })),
}
