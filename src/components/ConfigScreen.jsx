import { useMemo, useState } from 'react'
import { TOPICS, ALL_TOPIC_KEYS, PK_TOPICS } from '../lib/topics.js'
import { getSettings, saveSettings } from '../lib/storage.js'

const PRESETS = [
  { key: 'quick', label: '⚡ Quick 10', topics: PK_TOPICS, count: 10, minutes: 12, mode: 'exam' },
  { key: 'mock', label: '📝 Full PK mock', topics: PK_TOPICS, count: 50, minutes: 60, mode: 'exam' },
  { key: 'learn', label: '🧠 Practice (instant feedback)', topics: PK_TOPICS, count: 15, minutes: 0, mode: 'practice' },
  { key: 'english', label: '📖 English only', topics: ['english'], count: 20, minutes: 15, mode: 'exam' },
]

export default function ConfigScreen({ countByTopic, total, onStart }) {
  const saved = getSettings()
  const [topics, setTopics] = useState(saved?.topics?.length ? saved.topics : PK_TOPICS)
  const [count, setCount] = useState(saved?.count || 15)
  const [minutes, setMinutes] = useState(saved?.minutes ?? 20)
  const [timed, setTimed] = useState(saved?.timed ?? true)
  const [negativeMarking, setNegativeMarking] = useState(saved?.negativeMarking ?? true)
  const [shuffleOptions, setShuffleOptions] = useState(saved?.shuffleOptions ?? true)
  const [mode, setMode] = useState(saved?.mode || 'exam')

  const poolSize = useMemo(
    () => topics.reduce((s, t) => s + (countByTopic[t] || 0), 0),
    [topics, countByTopic]
  )
  const effectiveCount = Math.min(count, poolSize)

  function toggleTopic(t) {
    setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  function applyPreset(p) {
    setTopics(p.topics)
    setCount(p.count)
    setMode(p.mode)
    if (p.minutes === 0) {
      setTimed(false)
    } else {
      setTimed(true)
      setMinutes(p.minutes)
    }
  }

  function begin() {
    if (!topics.length || poolSize === 0) return
    const config = {
      topics,
      count: effectiveCount,
      durationSec: timed ? minutes * 60 : 0,
      timed,
      negativeMarking,
      shuffleOptions,
      mode,
    }
    saveSettings({ topics, count, minutes, timed, negativeMarking, shuffleOptions, mode })
    onStart(config)
  }

  return (
    <div className="container">
      <h2 className="page-title">Configure your test</h2>
      <p className="page-sub">
        Pick topics and a format — every session draws a fresh, shuffled set (prioritising questions
        you've seen least).
      </p>

      <div className="field">
        <label>Quick presets</label>
        <div className="chip-row">
          {PRESETS.map((p) => (
            <button key={p.key} className="chip" onClick={() => applyPreset(p)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="field">
          <label>
            Topics <span className="muted">· {poolSize} questions available</span>
          </label>
          <div className="chip-row">
            {ALL_TOPIC_KEYS.map((t) => {
              const meta = TOPICS[t]
              const on = topics.includes(t)
              return (
                <label key={t} className={`chip ${on ? 'on' : ''}`} style={{ '--tc': meta.color }}>
                  <input type="checkbox" checked={on} onChange={() => toggleTopic(t)} />
                  <span className="ic">{meta.icon}</span>
                  {meta.short}
                  <span className="muted">({countByTopic[t] || 0})</span>
                </label>
              )
            })}
          </div>
          <div className="row wrap" style={{ marginTop: 10, gap: 8 }}>
            <button className="btn ghost" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => setTopics([...PK_TOPICS])}>
              Professional Knowledge
            </button>
            <button className="btn ghost" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => setTopics([...ALL_TOPIC_KEYS])}>
              Select all
            </button>
            <button className="btn ghost" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => setTopics([])}>
              Clear
            </button>
          </div>
        </div>

        <div className="grid cols-2">
          <div className="field">
            <label>Number of questions</label>
            <div className="row">
              <input
                type="range"
                min="5"
                max={Math.max(5, Math.min(100, poolSize))}
                step="5"
                value={Math.min(count, Math.max(5, poolSize))}
                onChange={(e) => setCount(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                className="num-inline"
                type="number"
                min="1"
                max={poolSize || 1}
                value={effectiveCount}
                onChange={(e) => setCount(Number(e.target.value) || 1)}
              />
            </div>
            {count > poolSize && (
              <div className="hint">Only {poolSize} available for the chosen topics — will use {poolSize}.</div>
            )}
          </div>

          <div className="field">
            <label>Mode</label>
            <div className="seg">
              <button className={mode === 'exam' ? 'on' : ''} onClick={() => setMode('exam')}>
                Exam (solutions at end)
              </button>
              <button className={mode === 'practice' ? 'on' : ''} onClick={() => setMode('practice')}>
                Practice (instant feedback)
              </button>
            </div>
          </div>
        </div>

        <div className="grid cols-2">
          <div className="field">
            <label>Timer</label>
            <div className="row wrap" style={{ gap: 14 }}>
              <Switch on={timed} onChange={() => setTimed(!timed)} label={timed ? 'Timed' : 'Untimed'} />
              {timed && (
                <div className="row">
                  <input
                    className="num-inline"
                    type="number"
                    min="1"
                    max="180"
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value) || 1)}
                  />
                  <span className="muted">minutes</span>
                </div>
              )}
            </div>
            <div className="hint">Real exam pace ≈ 2 min/question for PK.</div>
          </div>

          <div className="field">
            <label>Options</label>
            <div className="row wrap" style={{ gap: 18 }}>
              <Switch on={negativeMarking} onChange={() => setNegativeMarking(!negativeMarking)} label="Negative marking (−¼)" />
              <Switch on={shuffleOptions} onChange={() => setShuffleOptions(!shuffleOptions)} label="Shuffle options" />
            </div>
          </div>
        </div>

        <div className="row between wrap mt">
          <div className="muted" style={{ fontSize: 13.5 }}>
            {effectiveCount} questions{timed ? ` · ${minutes} min` : ' · untimed'} ·{' '}
            {negativeMarking ? '−¼ per wrong' : 'no negative marking'}
          </div>
          <button className="btn lg" disabled={!topics.length || poolSize === 0} onClick={begin}>
            Start test →
          </button>
        </div>
      </div>
    </div>
  )
}

function Switch({ on, onChange, label }) {
  return (
    <div className={`switch ${on ? 'on' : ''}`} onClick={onChange} role="switch" aria-checked={on}>
      <span className="track">
        <span className="knob" />
      </span>
      <span style={{ fontSize: 14 }}>{label}</span>
    </div>
  )
}
