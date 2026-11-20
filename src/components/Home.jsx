import { TOPICS, PK_TOPICS } from '../lib/topics.js'

export default function Home({ total, countByTopic, flashcards, onStartPractice, onQuickStart, onLearn }) {
  return (
    <div className="container">
      <section className="hero">
        <span className="tag">Professional Knowledge · 100 Marks · 100 Minutes</span>
        <h2>
          Ace the <span className="grad">BOI SO (IT)</span> Full-Stack
          <br />
          Engineering exam
        </h2>
        <p>
          Timed MCQ practice with detailed solutions, built from the official syllabus — React, Java,
          Spring Boot, DBMS, Core CS, Cloud &amp; DevSecOps, AI/GenAI, and Banking/RBI. A fresh set of
          questions every session.
        </p>
        <div className="hero-actions">
          <button className="btn lg" onClick={onStartPractice}>
            🎯 Start a practice test
          </button>
          <button className="btn lg secondary" onClick={onQuickStart}>
            ⚡ Quick 10 (12 min)
          </button>
          <button className="btn lg ghost" onClick={onLearn}>
            📚 Learn &amp; revise
          </button>
        </div>

        <div className="stat-row">
          <div className="stat">
            <div className="n">{total}</div>
            <div className="l">Questions</div>
          </div>
          <div className="stat">
            <div className="n">{Object.keys(TOPICS).length}</div>
            <div className="l">Topics</div>
          </div>
          <div className="stat">
            <div className="n">{flashcards}</div>
            <div className="l">Flashcards</div>
          </div>
          <div className="stat">
            <div className="n">−¼</div>
            <div className="l">Neg. marking</div>
          </div>
        </div>
      </section>

      <h3 className="mt-lg" style={{ marginBottom: 12 }}>
        Syllabus coverage
      </h3>
      <div className="grid cols-2">
        {Object.values(TOPICS).map((t) => (
          <div
            className="card topic-card"
            key={t.key}
            style={{ '--tc': t.color }}
          >
            <span className="ic">{t.icon}</span>
            <div>
              <h4>{t.label}</h4>
              <p>{t.blurb}</p>
            </div>
            <span className="cnt">{countByTopic[t.key] || 0} Qs</span>
          </div>
        ))}
      </div>

      <div className="card mt-lg" style={{ borderLeft: '3px solid var(--accent)' }}>
        <div className="row between wrap">
          <div>
            <h4 style={{ margin: '0 0 4px' }}>How scoring works</h4>
            <p className="muted" style={{ margin: 0 }}>
              English is qualifying only; <strong>Professional Knowledge</strong> decides merit. Each
              correct answer is +1, each wrong answer is −0.25 (toggle it off in settings). Spend ~15
              min on English, ~85 min on PK in the real exam.
            </p>
          </div>
          <button className="btn" onClick={onStartPractice}>
            Configure a test →
          </button>
        </div>
      </div>
    </div>
  )
}
