import { useState } from 'react'
import { getHistory, clearHistory, resetSeen, getStats } from '../lib/storage.js'
import { topicMeta } from '../lib/topics.js'
import { formatTime } from '../lib/scoring.js'

export default function Progress({ onStart }) {
  const [history, setHistory] = useState(() => getHistory())
  const stats = getStats()

  if (!history.length) {
    return (
      <div className="container">
        <h2 className="page-title">Your progress</h2>
        <div className="card empty">
          <span className="ic">📊</span>
          No attempts yet. Take a practice test and your scores, accuracy trend and weak topics will
          appear here.
          <div style={{ marginTop: 16 }}>
            <button className="btn" onClick={onStart}>Start a test →</button>
          </div>
        </div>
      </div>
    )
  }

  const attempts = history.length
  const avgAcc = Math.round((history.reduce((s, h) => s + h.accuracy, 0) / attempts) * 100)
  const bestPct = Math.max(...history.map((h) => (h.maxScore ? Math.round((h.score / h.maxScore) * 100) : 0)))
  const totalQ = history.reduce((s, h) => s + h.correct + h.wrong + h.unattempted, 0)

  // Aggregate topic accuracy across all sessions.
  const topicAgg = {}
  for (const h of history) {
    for (const t of h.byTopic || []) {
      const a = (topicAgg[t.topic] = topicAgg[t.topic] || { correct: 0, wrong: 0, total: 0 })
      a.correct += t.correct
      a.wrong += t.wrong
      a.total += t.total
    }
  }
  const weak = Object.entries(topicAgg)
    .map(([topic, a]) => ({
      topic,
      acc: a.correct + a.wrong > 0 ? a.correct / (a.correct + a.wrong) : 0,
      attempted: a.correct + a.wrong,
      total: a.total,
    }))
    .filter((t) => t.attempted >= 3)
    .sort((a, b) => a.acc - b.acc)

  // Trend sparkline (last 12 attempts, oldest→newest).
  const trend = history
    .slice(0, 12)
    .reverse()
    .map((h) => (h.maxScore ? (h.score / h.maxScore) * 100 : 0))

  function doClear() {
    clearHistory()
    setHistory([])
  }

  return (
    <div className="container">
      <h2 className="page-title">Your progress</h2>
      <p className="page-sub">Across {attempts} attempt{attempts > 1 ? 's' : ''}.</p>

      <div className="grid cols-4">
        <Kpi n={attempts} l="Attempts" />
        <Kpi n={`${avgAcc}%`} l="Avg accuracy" />
        <Kpi n={`${bestPct}%`} l="Best score" />
        <Kpi n={totalQ} l="Questions done" />
      </div>

      <div className="card mt-lg">
        <h4 style={{ margin: '0 0 14px' }}>Score trend (% of max)</h4>
        <Sparkline values={trend} />
      </div>

      {weak.length > 0 && (
        <div className="card mt-lg">
          <h4 style={{ margin: '0 0 14px' }}>Topics to focus on</h4>
          <div className="bars">
            {weak.map((t) => {
              const meta = topicMeta(t.topic)
              return (
                <div className="bar-row" key={t.topic}>
                  <div className="top">
                    <span>{meta.icon} {meta.label}</span>
                    <span className="muted">{Math.round(t.acc * 100)}% · {t.attempted} attempted</span>
                  </div>
                  <div className="bar">
                    <span className="ok" style={{ width: `${t.acc * 100}%` }} />
                    <span className="no" style={{ width: `${(1 - t.acc) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card mt-lg">
        <h4 style={{ margin: '0 0 10px' }}>History</h4>
        {history.map((h, i) => {
          const pct = h.maxScore ? Math.round((h.score / h.maxScore) * 100) : 0
          const c = pct >= 60 ? 'var(--good)' : pct >= 40 ? 'var(--warn)' : 'var(--bad)'
          return (
            <div className="hist-item" key={i}>
              <div className="hist-score" style={{ color: c }}>{pct}%</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>
                  {h.score} / {h.maxScore} · {h.correct}✓ {h.wrong}✗ {h.unattempted}–
                </div>
                <div className="muted" style={{ fontSize: 12.5 }}>
                  {new Date(h.date).toLocaleString()} · {formatTime(h.elapsed || 0)} ·{' '}
                  {(h.topics || []).map((t) => topicMeta(t).short).join(', ')}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="row wrap mt-lg" style={{ gap: 10 }}>
        <button className="btn" onClick={onStart}>Start a new test →</button>
        <button className="btn ghost" onClick={() => { resetSeen(); alert('Question rotation reset — the bank will start cycling from scratch.') }}>
          Reset question rotation
        </button>
        <button className="btn danger" onClick={doClear}>Clear history</button>
      </div>
    </div>
  )
}

function Kpi({ n, l }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{n}</div>
      <div className="muted" style={{ fontSize: 12.5 }}>{l}</div>
    </div>
  )
}

function Sparkline({ values }) {
  if (!values.length) return <div className="muted">Not enough data yet.</div>
  const w = 100, h = 36
  const max = 100
  const step = values.length > 1 ? w / (values.length - 1) : 0
  const pts = values.map((v, i) => `${i * step},${h - (v / max) * h}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: 70 }}>
      <polyline points={pts} fill="none" stroke="var(--primary-2)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      {values.map((v, i) => (
        <circle key={i} cx={i * step} cy={h - (v / max) * h} r="1.4" fill="var(--accent)" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}
