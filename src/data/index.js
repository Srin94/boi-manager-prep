// Central question + study-material bank.
// Merges:
//   - authored questions (hand-written, per topic) in ./authored/*
//   - questions extracted from the official BOI prep guides in ./generated/*.json
// then normalizes, validates and de-duplicates them.

import g1 from './generated/g1.json'
import g2 from './generated/g2.json'
import study from './generated/study.json'

import { backend } from './authored/backend.js'
import { dbms } from './authored/dbms.js'
import { csCore } from './authored/cs-core.js'
import { seArch } from './authored/se-arch.js'
import { emerging } from './authored/emerging.js'
import { securityBanking } from './authored/security-banking.js'
import { english } from './authored/english.js'
import { authoredFlashcards } from './authored/flashcards.js'

const VALID_TOPICS = new Set([
  'backend',
  'dbms',
  'cs-core',
  'se-arch',
  'emerging',
  'security-banking',
  'english',
])

// The study-material extraction uses a 'banking' bucket; fold it into security-banking.
function remapTopic(t) {
  if (t === 'banking') return 'security-banking'
  return t
}

function normalizeQuestion(q, fallbackId) {
  if (!q || typeof q !== 'object') return null
  const options = Array.isArray(q.options)
    ? q.options.map((o) => (o == null ? '' : String(o).trim())).filter(Boolean)
    : []
  const question = (q.question || '').toString().trim()
  const answerIndex = Number(q.answerIndex)

  // Validation: must have a prompt, exactly 4 options, a valid answer index.
  if (!question) return null
  if (options.length !== 4) return null
  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3)
    return null

  const mapped = remapTopic(q.topic)
  const topic = VALID_TOPICS.has(mapped) ? mapped : 'backend'

  return {
    id: q.id || fallbackId,
    source: q.source || 'authored',
    topic,
    subtopic: (q.subtopic || '').toString().trim() || topicDefaultSub(topic),
    difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty)
      ? q.difficulty
      : 'medium',
    question,
    options,
    answerIndex,
    explanation: (q.explanation || '').toString().trim(),
  }
}

function topicDefaultSub(topic) {
  return (
    {
      backend: 'Full-Stack',
      dbms: 'DBMS',
      'cs-core': 'Core CS',
      'se-arch': 'Software Engineering',
      emerging: 'Emerging Tech',
      'security-banking': 'Security & Banking',
      english: 'English',
    }[topic] || 'General'
  )
}

function dedupeKey(q) {
  return q.question.toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '').trim().slice(0, 120)
}

const authored = [
  ...backend,
  ...dbms,
  ...csCore,
  ...seArch,
  ...emerging,
  ...securityBanking,
  ...english,
]

const rawAll = [...authored, ...g1, ...g2]

const seen = new Set()
export const QUESTIONS = []
rawAll.forEach((q, i) => {
  const n = normalizeQuestion(q, `q-${i}`)
  if (!n) return
  const key = dedupeKey(n)
  if (seen.has(key)) return
  seen.add(key)
  QUESTIONS.push(n)
})

// --- Study material (flashcards + cheat sheets) ------------------------------

export const FLASHCARDS = [
  ...authoredFlashcards,
  ...((study && study.flashcards) || []),
]
  .filter((c) => c && c.front && c.back)
  .map((c, i) => {
    const t = remapTopic(c.topic)
    return {
      id: c.id || `fc-${i}`,
      topic: VALID_TOPICS.has(t) ? t : 'backend',
      front: String(c.front).trim(),
      back: String(c.back).trim(),
    }
  })

export const CHEATSHEETS = ((study && study.cheatsheets) || [])
  .filter((s) => s && s.title && Array.isArray(s.items) && s.items.length)
  .map((s, i) => ({
    id: s.id || `cs-${i}`,
    topic: remapTopic(s.topic) || 'backend',
    title: String(s.title).trim(),
    items: s.items.map((x) => String(x).trim()).filter(Boolean),
  }))

// --- Derived helpers ---------------------------------------------------------

export function countByTopic() {
  const counts = {}
  for (const q of QUESTIONS) counts[q.topic] = (counts[q.topic] || 0) + 1
  return counts
}

export function poolForTopics(topicKeys) {
  const set = new Set(topicKeys)
  return QUESTIONS.filter((q) => set.has(q.topic))
}
