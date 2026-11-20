// Scoring that mirrors the real exam: +1 per correct Professional-Knowledge
// answer, -1/4 per wrong answer (configurable), 0 for unattempted.

import { topicMeta } from './topics.js'

export function scoreSession(questions, answers, { negativeMarking = true } = {}) {
  // answers: { [questionIndex]: selectedOptionIndex }  (missing = unattempted)
  let correct = 0
  let wrong = 0
  let unattempted = 0
  const penalty = negativeMarking ? 0.25 : 0

  const byTopic = {}
  const perQuestion = []

  questions.forEach((q, i) => {
    const sel = answers[i]
    const attempted = sel !== undefined && sel !== null
    const isCorrect = attempted && sel === q.answerIndex

    if (!attempted) unattempted += 1
    else if (isCorrect) correct += 1
    else wrong += 1

    const t = (byTopic[q.topic] = byTopic[q.topic] || {
      topic: q.topic,
      label: topicMeta(q.topic).label,
      correct: 0,
      wrong: 0,
      unattempted: 0,
      total: 0,
    })
    t.total += 1
    if (!attempted) t.unattempted += 1
    else if (isCorrect) t.correct += 1
    else t.wrong += 1

    perQuestion.push({ id: q.id, correct: isCorrect, attempted, selected: sel })
  })

  const rawScore = correct - wrong * penalty
  const score = Math.round(rawScore * 100) / 100
  const maxScore = questions.length
  const accuracy = correct + wrong > 0 ? correct / (correct + wrong) : 0

  return {
    correct,
    wrong,
    unattempted,
    score,
    maxScore,
    accuracy,
    byTopic: Object.values(byTopic),
    perQuestion,
  }
}

export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}
