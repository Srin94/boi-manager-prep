// Topic metadata for the BOI SO (IT) Full-Stack Engineering exam.
// Keys match the `topic` field on every question / flashcard.

export const TOPICS = {
  backend: {
    key: 'backend',
    label: 'Full-Stack & Backend',
    short: 'Backend',
    blurb: 'Java, Spring Boot, React, JS/TS, Python, REST APIs, Microservices',
    color: '#6366f1',
    icon: '⚙️',
  },
  dbms: {
    key: 'dbms',
    label: 'DBMS, SQL & Warehousing',
    short: 'DBMS',
    blurb: 'Normalization, ACID, indexing, tuning, OLAP/OLTP',
    color: '#0ea5e9',
    icon: '🗄️',
  },
  'cs-core': {
    key: 'cs-core',
    label: 'Core CS Fundamentals',
    short: 'Core CS',
    blurb: 'DSA & complexity, Operating Systems, Computer Networks',
    color: '#10b981',
    icon: '🧮',
  },
  'se-arch': {
    key: 'se-arch',
    label: 'SE, Architecture & ITIL',
    short: 'SE / ITIL',
    blurb: 'SDLC, design patterns, architecture, ITSM / ITIL',
    color: '#f59e0b',
    icon: '🏗️',
  },
  emerging: {
    key: 'emerging',
    label: 'Emerging Tech & DevSecOps',
    short: 'Emerging',
    blurb: 'AI/ML, GenAI/RAG, Cloud, Docker, Kubernetes, CI/CD',
    color: '#ec4899',
    icon: '🤖',
  },
  'security-banking': {
    key: 'security-banking',
    label: 'Security, Banking & RBI',
    short: 'Security/Banking',
    blurb: 'Crypto, OWASP, UPI/NEFT/RTGS, RBI & NPCI governance',
    color: '#ef4444',
    icon: '🔐',
  },
  english: {
    key: 'english',
    label: 'English Language',
    short: 'English',
    blurb: 'Grammar, vocabulary, comprehension, para-jumbles (qualifying)',
    color: '#8b5cf6',
    icon: '📖',
  },
}

// Professional-knowledge topics (merit) vs the qualifying English section.
export const PK_TOPICS = [
  'backend',
  'dbms',
  'cs-core',
  'se-arch',
  'emerging',
  'security-banking',
]

export const ALL_TOPIC_KEYS = Object.keys(TOPICS)

export function topicMeta(key) {
  return (
    TOPICS[key] || {
      key,
      label: key,
      short: key,
      blurb: '',
      color: '#94a3b8',
      icon: '•',
    }
  )
}
