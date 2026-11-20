import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import RichText from './RichText.jsx'
import { topicMeta } from '../lib/topics.js'
import { scoreSession, formatTime } from '../lib/scoring.js'

const KEYS = ['A', 'B', 'C', 'D']

export default function Quiz({ questions, config, onFinish, onQuit }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({}) // { idx: optIdx }
  const [flags, setFlags] = useState(() => new Set())
  const [revealed, setRevealed] = useState(() => new Set()) // practice-mode reveals
  const [secondsLeft, setSecondsLeft] = useState(config.timed ? config.durationSec : 0)
  const [elapsed, setElapsed] = useState(0)
  const submittedRef = useRef(false)

  const practice = config.mode === 'practice'
  const q = questions[current]
  const total = questions.length
  const answeredCount = Object.keys(answers).length

  const submit = useCallback(() => {
    if (submittedRef.current) return
    submittedRef.current = true
    const res = scoreSession(questions, answers, { negativeMarking: config.negativeMarking })
    onFinish({ questions, answers, elapsed, result: res, config })
  }, [questions, answers, config, elapsed, onFinish])

  // Timer tick
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((e) => e + 1)
      if (config.timed) {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(id)
            setTimeout(() => submit(), 0)
            return 0
          }
          return s - 1
        })
      }
    }, 1000)
    return () => clearInterval(id)
  }, [config.timed, submit])

  function choose(optIdx) {
    if (practice && revealed.has(current)) return // locked after reveal
    setAnswers((a) => ({ ...a, [current]: optIdx }))
    if (practice) setRevealed((r) => new Set(r).add(current))
  }

  function toggleFlag() {
    setFlags((f) => {
      const n = new Set(f)
      n.has(current) ? n.delete(current) : n.add(current)
      return n
    })
  }

  const goTo = useCallback((i) => setCurrent(Math.max(0, Math.min(total - 1, i))), [total])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (['1', '2', '3', '4'].includes(e.key)) choose(Number(e.key) - 1)
      else if (e.key === 'ArrowRight') goTo(current + 1)
      else if (e.key === 'ArrowLeft') goTo(current - 1)
      else if (e.key.toLowerCase() === 'f') toggleFlag()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const meta = topicMeta(q.topic)
  const sel = answers[current]
  const showAnswer = practice && revealed.has(current)

  const timerClass = useMemo(() => {
    if (!config.timed) return ''
    if (secondsLeft <= 30) return 'danger'
    if (secondsLeft <= 120) return 'warn'
    return ''
  }, [config.timed, secondsLeft])

  const pct = Math.round((answeredCount / total) * 100)

  return (
    <div className="container">
      <div className="quiz-top">
        {config.timed ? (
          <div className={`timer ${timerClass}`} title="Time left">
            ⏱ {formatTime(secondsLeft)}
          </div>
        ) : (
          <div className="timer" title="Time elapsed">
            ⏱ {formatTime(elapsed)}
          </div>
        )}
        <div className="progressbar" title={`${answeredCount}/${total} answered`}>
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="muted" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
          {answeredCount}/{total} answered
        </div>
        <button className="btn danger" style={{ padding: '8px 14px' }} onClick={submit}>
          Submit
        </button>
      </div>

      <div className="card">
        <div className="qmeta">
          <span className="qnum">
            Q{current + 1} <span className="muted">/ {total}</span>
          </span>
          <span className="pill" style={{ color: meta.color }}>
            <span className="dot" style={{ background: meta.color }} />
            {meta.short}
            {q.subtopic ? ` · ${q.subtopic}` : ''}
          </span>
          <span className={`badge ${q.difficulty}`}>{q.difficulty}</span>
          <button
            className="btn ghost"
            style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: 13 }}
            onClick={toggleFlag}
          >
            {flags.has(current) ? '🚩 Flagged' : '⚑ Flag'}
          </button>
        </div>

        <div className="qtext">
          <RichText text={q.question} />
        </div>

        <div className="options">
          {q.options.map((opt, i) => {
            let cls = 'opt'
            if (showAnswer) {
              if (i === q.answerIndex) cls += ' correct'
              else if (i === sel) cls += ' wrong'
              cls += ' disabled'
            } else if (sel === i) {
              cls += ' selected'
            }
            return (
              <div className={cls} key={i} onClick={() => choose(i)}>
                <span className="key">{KEYS[i]}</span>
                <span className="opt-text">
                  <RichText text={opt} />
                </span>
                {showAnswer && i === q.answerIndex && <span>✓</span>}
                {showAnswer && i === sel && i !== q.answerIndex && <span>✗</span>}
              </div>
            )
          })}
        </div>

        {showAnswer && (
          <div className="explain">
            <div className="lbl">
              {sel === q.answerIndex ? '✓ Correct' : `✗ Correct answer: ${KEYS[q.answerIndex]}`}
            </div>
            <div style={{ marginTop: 6 }}>
              <RichText text={q.explanation || 'No explanation provided.'} />
            </div>
          </div>
        )}

        <div className="quiz-nav">
          <button className="btn secondary" onClick={() => goTo(current - 1)} disabled={current === 0}>
            ← Prev
          </button>
          {sel !== undefined && !practice && (
            <button
              className="btn ghost"
              style={{ padding: '8px 12px', fontSize: 13 }}
              onClick={() => setAnswers((a) => { const n = { ...a }; delete n[current]; return n })}
            >
              Clear
            </button>
          )}
          <div className="spacer" />
          {current < total - 1 ? (
            <button className="btn" onClick={() => goTo(current + 1)}>
              Next →
            </button>
          ) : (
            <button className="btn" onClick={submit}>
              Finish &amp; see score
            </button>
          )}
        </div>
      </div>

      <div className="card mt">
        <div className="row between">
          <strong style={{ fontSize: 14 }}>Question palette</strong>
          <span className="muted" style={{ fontSize: 12.5 }}>
            Press 1–4 to answer · ← → to move · F to flag
          </span>
        </div>
        <div className="palette">
          {questions.map((_, i) => {
            let cls = ''
            if (i === current) cls += ' current'
            if (answers[i] !== undefined) cls += ' answered'
            if (flags.has(i)) cls += ' flagged'
            return (
              <button key={i} className={cls.trim()} onClick={() => goTo(i)} title={`Question ${i + 1}`}>
                {i + 1}
              </button>
            )
          })}
        </div>
        <div className="row wrap mt" style={{ gap: 16, fontSize: 12.5 }}>
          <span className="muted"><span className="dot" style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--primary)', borderRadius: 3, marginRight: 5 }} />Answered</span>
          <span className="muted"><span style={{ display: 'inline-block', width: 10, height: 10, border: '2px solid var(--warn)', borderRadius: 3, marginRight: 5 }} />Flagged</span>
          <button className="btn ghost" style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: 13 }} onClick={onQuit}>
            Quit test
          </button>
        </div>
      </div>
    </div>
  )
}
