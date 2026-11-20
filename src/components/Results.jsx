import { topicMeta } from '../lib/topics.js'
import { formatTime } from '../lib/scoring.js'

export default function Results({ result, elapsed, onReview, onRetry, onNew }) {
  const { score, maxScore, correct, wrong, unattempted, accuracy, byTopic } = result
  const pct = maxScore > 0 ? Math.max(0, Math.round((score / maxScore) * 100)) : 0
  const accPct = Math.round(accuracy * 100)

  const verdict =
    accPct >= 80 ? ['Excellent! 🏆', 'var(--good)']
    : accPct >= 60 ? ['Solid work 👍', 'var(--accent)']
    : accPct >= 40 ? ['Keep pushing 💪', 'var(--warn)']
    : ['Needs practice 📚', 'var(--bad)']

  return (
    <div className="container">
      <h2 className="page-title">Your result</h2>
      <p className="page-sub" style={{ color: verdict[1], fontWeight: 600 }}>{verdict[0]}</p>

      <div className="grid cols-2">
        <div className="card score-hero">
          <div className="ring" style={{ '--p': pct, '--accent': verdict[1] }}>
            <div className="inner">
              <div>
                <div className="big">{score}</div>
                <div className="small">out of {maxScore}</div>
              </div>
            </div>
          </div>
          <div className="row wrap" style={{ justifyContent: 'center', gap: 20, marginTop: 6 }}>
            <Mini n={correct} l="Correct" c="var(--good)" />
            <Mini n={wrong} l="Wrong" c="var(--bad)" />
            <Mini n={unattempted} l="Skipped" c="var(--muted)" />
          </div>
        </div>

        <div className="card">
          <div className="grid cols-2" style={{ gap: 14 }}>
            <Kpi label="Accuracy" value={`${accPct}%`} />
            <Kpi label="Attempted" value={`${correct + wrong}/${maxScore}`} />
            <Kpi label="Time taken" value={formatTime(elapsed)} />
            <Kpi label="Net score" value={`${score} / ${maxScore}`} />
          </div>
          <div className="row wrap mt" style={{ gap: 10 }}>
            <button className="btn" onClick={onReview}>🔍 Review answers &amp; solutions</button>
            <button className="btn secondary" onClick={onRetry}>🔁 New set, same config</button>
            <button className="btn ghost" onClick={onNew}>⚙️ New test</button>
          </div>
        </div>
      </div>

      <div className="card mt-lg">
        <h4 style={{ margin: '0 0 14px' }}>Topic breakdown</h4>
        <div className="bars">
          {byTopic
            .slice()
            .sort((a, b) => b.total - a.total)
            .map((t) => {
              const meta = topicMeta(t.topic)
              const okW = (t.correct / t.total) * 100
              const noW = (t.wrong / t.total) * 100
              const unW = (t.unattempted / t.total) * 100
              const tAcc = t.correct + t.wrong > 0 ? Math.round((t.correct / (t.correct + t.wrong)) * 100) : 0
              return (
                <div className="bar-row" key={t.topic}>
                  <div className="top">
                    <span>{meta.icon} {meta.label}</span>
                    <span className="muted">
                      {t.correct}/{t.total} correct · {tAcc}%
                    </span>
                  </div>
                  <div className="bar">
                    <span className="ok" style={{ width: `${okW}%` }} />
                    <span className="no" style={{ width: `${noW}%` }} />
                    <span className="un" style={{ width: `${unW}%` }} />
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

function Mini({ n, l, c }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{n}</div>
      <div className="muted" style={{ fontSize: 12 }}>{l}</div>
    </div>
  )
}

function Kpi({ label, value }) {
  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
      <div className="muted" style={{ fontSize: 12.5 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div>
    </div>
  )
}
