import { useState } from 'react'
import RichText from './RichText.jsx'
import { topicMeta } from '../lib/topics.js'

const KEYS = ['A', 'B', 'C', 'D']

export default function Review({ questions, answers, onBack, onNew }) {
  const [filter, setFilter] = useState('all') // all | wrong | skipped

  const items = questions
    .map((q, i) => ({ q, i, sel: answers[i] }))
    .filter(({ q, sel }) => {
      if (filter === 'wrong') return sel !== undefined && sel !== q.answerIndex
      if (filter === 'skipped') return sel === undefined
      return true
    })

  const wrongCount = questions.filter((q, i) => answers[i] !== undefined && answers[i] !== q.answerIndex).length
  const skipCount = questions.filter((q, i) => answers[i] === undefined).length

  return (
    <div className="container">
      <div className="row between wrap">
        <h2 className="page-title" style={{ marginBottom: 6 }}>Review &amp; solutions</h2>
        <div className="row wrap" style={{ gap: 8 }}>
          <button className="btn secondary" onClick={onBack}>← Back to score</button>
          <button className="btn" onClick={onNew}>New test</button>
        </div>
      </div>

      <div className="tabs" style={{ marginTop: 10 }}>
        <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>
          All ({questions.length})
        </button>
        <button className={filter === 'wrong' ? 'on' : ''} onClick={() => setFilter('wrong')}>
          Wrong ({wrongCount})
        </button>
        <button className={filter === 'skipped' ? 'on' : ''} onClick={() => setFilter('skipped')}>
          Skipped ({skipCount})
        </button>
      </div>

      {items.length === 0 && (
        <div className="card empty">
          <span className="ic">🎉</span>
          Nothing here — great job!
        </div>
      )}

      <div className="grid" style={{ gap: 16 }}>
        {items.map(({ q, i, sel }) => {
          const meta = topicMeta(q.topic)
          const isCorrect = sel === q.answerIndex
          const isSkipped = sel === undefined
          return (
            <div className="card" key={q.id}>
              <div className="qmeta">
                <span className="qnum">Q{i + 1}</span>
                <span className="pill" style={{ color: meta.color }}>
                  <span className="dot" style={{ background: meta.color }} />
                  {meta.short}{q.subtopic ? ` · ${q.subtopic}` : ''}
                </span>
                <span
                  className="badge"
                  style={{ color: isSkipped ? 'var(--muted)' : isCorrect ? 'var(--good)' : 'var(--bad)' }}
                >
                  {isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Wrong'}
                </span>
              </div>

              <div className="qtext" style={{ fontSize: 16 }}>
                <RichText text={q.question} />
              </div>

              <div className="options">
                {q.options.map((opt, oi) => {
                  let cls = 'opt disabled'
                  if (oi === q.answerIndex) cls += ' correct'
                  else if (oi === sel) cls += ' wrong'
                  return (
                    <div className={cls} key={oi}>
                      <span className="key">{KEYS[oi]}</span>
                      <span className="opt-text"><RichText text={opt} /></span>
                      {oi === q.answerIndex && <span>✓</span>}
                      {oi === sel && oi !== q.answerIndex && <span>✗ your answer</span>}
                    </div>
                  )
                })}
              </div>

              <div className="explain">
                <div className="lbl">Explanation</div>
                <div style={{ marginTop: 6 }}>
                  <RichText text={q.explanation || 'No explanation provided.'} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
