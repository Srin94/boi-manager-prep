import { TOPICS } from '../lib/topics.js'

export default function About({ total, countByTopic }) {
  return (
    <div className="container">
      <h2 className="page-title">About this prep tool</h2>
      <p className="page-sub">Built for the Bank of India SO (IT) written exam.</p>

      <div className="card">
        <h4 style={{ marginTop: 0 }}>The exam (from the official notice)</h4>
        <ul style={{ lineHeight: 1.7 }}>
          <li><strong>Post:</strong> Manager – Full-Stack Engineering (Scale II / MMGS-II), Sr. No. 20, Project 2026-27/02.</li>
          <li><strong>Online test:</strong> English Language (25 marks, qualifying only) + Professional Knowledge (100 marks, merit). Composite time: <strong>100 minutes</strong>.</li>
          <li><strong>Negative marking:</strong> 1/4th mark deducted per wrong answer in Professional Knowledge.</li>
          <li><strong>Final selection:</strong> 60% online test + 40% interview.</li>
          <li><strong>Core skills tested:</strong> React, JavaScript, TypeScript, Java, Spring Boot, Python, REST APIs; plus DBMS, Core CS, Cloud/DevSecOps, AI/GenAI and Banking/RBI technology.</li>
        </ul>
      </div>

      <div className="card mt-lg">
        <h4 style={{ marginTop: 0 }}>What's inside</h4>
        <ul style={{ lineHeight: 1.7 }}>
          <li><strong>{total} questions</strong> with worked solutions, spanning every syllabus topic.</li>
          <li><strong>Fresh set every session:</strong> questions are drawn least-seen-first, then shuffled, and the answer options are reshuffled too — so repeats are rare and you cycle the whole bank over time.</li>
          <li><strong>Two modes:</strong> Exam (solutions at the end, like the real test) and Practice (instant feedback per question).</li>
          <li><strong>Learn mode:</strong> flip-cards and printable-style cheat sheets for last-minute revision.</li>
          <li><strong>Progress tracking:</strong> accuracy trend, weak-topic analysis and full attempt history — all stored locally in your browser.</li>
        </ul>
        <div className="grid cols-3 mt">
          {Object.values(TOPICS).map((t) => (
            <div className="row" key={t.key} style={{ gap: 8 }}>
              <span>{t.icon}</span>
              <span style={{ fontSize: 13.5 }}>{t.short}</span>
              <span className="muted" style={{ marginLeft: 'auto', fontSize: 13 }}>{countByTopic[t.key] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-lg" style={{ borderLeft: '3px solid var(--warn)' }}>
        <h4 style={{ marginTop: 0 }}>Disclaimer</h4>
        <p className="muted" style={{ margin: 0 }}>
          This is an independent study aid, not affiliated with or endorsed by Bank of India. Questions
          are compiled from the preparation guides and general computer-science knowledge for practice
          only. The official notification does not publish exact question counts or previous papers;
          always verify facts and exam details against the official Bank of India notice.
        </p>
      </div>
    </div>
  )
}
