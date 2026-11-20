import { useEffect, useState } from 'react'
import { QUESTIONS, countByTopic, poolForTopics, FLASHCARDS, CHEATSHEETS } from './data/index.js'
import { buildSession } from './lib/session.js'
import { load, save, bumpSeen, recordAnswers, pushHistory } from './lib/storage.js'
import { PK_TOPICS } from './lib/topics.js'

import Home from './components/Home.jsx'
import ConfigScreen from './components/ConfigScreen.jsx'
import Quiz from './components/Quiz.jsx'
import Results from './components/Results.jsx'
import Review from './components/Review.jsx'
import Learn from './components/Learn.jsx'
import Progress from './components/Progress.jsx'
import About from './components/About.jsx'

const NAV = [
  { key: 'home', label: 'Home' },
  { key: 'config', label: 'Practice' },
  { key: 'learn', label: 'Learn' },
  { key: 'progress', label: 'Progress' },
  { key: 'about', label: 'About' },
]

export default function App() {
  const [view, setView] = useState('home')
  const [theme, setTheme] = useState(() => load('theme', 'dark'))
  const [sessionData, setSessionData] = useState(null) // { questions, config, seed }
  const [result, setResult] = useState(null) // { result, answers, elapsed }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    save('theme', theme)
  }, [theme])

  const totalQuestions = QUESTIONS.length

  function startSession(config) {
    const pool = poolForTopics(config.topics)
    const { seed, questions } = buildSession({
      pool,
      count: config.count,
      shuffleOptions: config.shuffleOptions,
    })
    setSessionData({ questions, config, seed })
    setResult(null)
    setView('quiz')
    window.scrollTo(0, 0)
  }

  function finishSession({ questions, answers, elapsed, result: res, config }) {
    // Persist learning signals.
    bumpSeen(questions.map((q) => q.id))
    recordAnswers(res.perQuestion.map((p) => ({ id: p.id, correct: p.correct })))
    pushHistory({
      date: Date.now(),
      score: res.score,
      maxScore: res.maxScore,
      correct: res.correct,
      wrong: res.wrong,
      unattempted: res.unattempted,
      accuracy: res.accuracy,
      elapsed,
      topics: config.topics,
      mode: config.mode,
      byTopic: res.byTopic,
    })
    setResult({ result: res, answers, elapsed })
    setView('results')
    window.scrollTo(0, 0)
  }

  function go(v) {
    setView(v)
    window.scrollTo(0, 0)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand" onClick={() => go('home')}>
            <span className="logo">🏦</span>
            <div>
              <h1>BOI SO (IT) Prep</h1>
              <div className="sub">Manager – Full-Stack Engineering · Scale II</div>
            </div>
          </div>
          <nav className="nav">
            {NAV.map((n) => (
              <button
                key={n.key}
                className={view === n.key || (n.key === 'config' && view === 'quiz') ? 'active' : ''}
                onClick={() => go(n.key)}
              >
                {n.label}
              </button>
            ))}
            <button
              className="icon-btn"
              title="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, width: '100%' }}>
        {view === 'home' && (
          <Home
            total={totalQuestions}
            countByTopic={countByTopic()}
            flashcards={FLASHCARDS.length}
            onStartPractice={() => go('config')}
            onQuickStart={() =>
              startSession({
                topics: PK_TOPICS,
                count: 10,
                durationSec: 12 * 60,
                timed: true,
                negativeMarking: true,
                shuffleOptions: true,
                mode: 'exam',
              })
            }
            onLearn={() => go('learn')}
          />
        )}

        {view === 'config' && (
          <ConfigScreen countByTopic={countByTopic()} total={totalQuestions} onStart={startSession} />
        )}

        {view === 'quiz' && sessionData && (
          <Quiz
            key={sessionData.seed}
            questions={sessionData.questions}
            config={sessionData.config}
            onFinish={finishSession}
            onQuit={() => go('config')}
          />
        )}

        {view === 'results' && result && sessionData && (
          <Results
            result={result.result}
            elapsed={result.elapsed}
            onReview={() => go('review')}
            onRetry={() => startSession(sessionData.config)}
            onNew={() => go('config')}
          />
        )}

        {view === 'review' && result && sessionData && (
          <Review
            questions={sessionData.questions}
            answers={result.answers}
            onBack={() => go('results')}
            onNew={() => go('config')}
          />
        )}

        {view === 'learn' && <Learn flashcards={FLASHCARDS} cheatsheets={CHEATSHEETS} />}

        {view === 'progress' && <Progress onStart={() => go('config')} />}

        {view === 'about' && <About total={totalQuestions} countByTopic={countByTopic()} />}
      </main>

      <footer className="footer">
        Study tool for Bank of India Project 2026-27/02 · Sr. No. 20 · Manager – Full-Stack
        Engineering (Scale II). Not affiliated with Bank of India. Verify all facts against the
        official notification.
      </footer>
    </div>
  )
}
