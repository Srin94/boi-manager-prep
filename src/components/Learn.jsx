import { useMemo, useState } from 'react'
import RichText from './RichText.jsx'
import { TOPICS, topicMeta } from '../lib/topics.js'
import { shuffle } from '../lib/shuffle.js'

export default function Learn({ flashcards, cheatsheets }) {
  const [tab, setTab] = useState('flashcards')
  return (
    <div className="container">
      <h2 className="page-title">Learn &amp; revise</h2>
      <p className="page-sub">Flip flashcards for quick recall, or scan the cheat sheets before the exam.</p>

      <div className="tabs">
        <button className={tab === 'flashcards' ? 'on' : ''} onClick={() => setTab('flashcards')}>
          🃏 Flashcards ({flashcards.length})
        </button>
        <button className={tab === 'cheats' ? 'on' : ''} onClick={() => setTab('cheats')}>
          📋 Cheat sheets ({cheatsheets.length})
        </button>
      </div>

      {tab === 'flashcards' ? (
        <Flashcards cards={flashcards} />
      ) : (
        <Cheatsheets sheets={cheatsheets} />
      )}
    </div>
  )
}

function topicsPresent(items) {
  const set = new Set(items.map((i) => i.topic))
  return Object.values(TOPICS).filter((t) => set.has(t.key)).concat(
    [...set].filter((k) => !TOPICS[k]).map((k) => topicMeta(k))
  )
}

function Flashcards({ cards }) {
  const [topic, setTopic] = useState('all')
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [nonce, setNonce] = useState(0) // reshuffle trigger

  const deck = useMemo(() => {
    const filtered = topic === 'all' ? cards : cards.filter((c) => c.topic === topic)
    return shuffle(filtered)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, topic, nonce])

  const card = deck[idx]
  const present = topicsPresent(cards)

  function reset(toTopic) {
    setTopic(toTopic)
    setIdx(0)
    setFlipped(false)
  }
  function next() {
    setFlipped(false)
    setIdx((i) => (i + 1) % deck.length)
  }
  function prev() {
    setFlipped(false)
    setIdx((i) => (i - 1 + deck.length) % deck.length)
  }

  if (!deck.length) return <div className="card empty">No flashcards for this topic.</div>

  const meta = topicMeta(card.topic)

  return (
    <div>
      <div className="chip-row" style={{ marginBottom: 18 }}>
        <label className={`chip ${topic === 'all' ? 'on' : ''}`} onClick={() => reset('all')}>
          All
        </label>
        {present.map((t) => (
          <label
            key={t.key}
            className={`chip ${topic === t.key ? 'on' : ''}`}
            style={{ '--tc': t.color }}
            onClick={() => reset(t.key)}
          >
            <span className="ic">{t.icon}</span>
            {t.short}
          </label>
        ))}
      </div>

      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((f) => !f)}>
        <div className="flashcard-inner">
          <div className="flash-face flash-front" style={{ borderTop: `3px solid ${meta.color}` }}>
            <span className="lbl">{meta.short} · tap to flip</span>
            <div className="q"><RichText text={card.front} /></div>
          </div>
          <div className="flash-face flash-back">
            <span className="lbl">Answer</span>
            <div className="a"><RichText text={card.back} /></div>
          </div>
        </div>
      </div>
      <div className="flash-hint">Card {idx + 1} of {deck.length}</div>

      <div className="row" style={{ justifyContent: 'center', gap: 10, marginTop: 14 }}>
        <button className="btn secondary" onClick={prev}>← Prev</button>
        <button className="btn ghost" onClick={() => { setNonce((n) => n + 1); setIdx(0); setFlipped(false) }}>🔀 Shuffle</button>
        <button className="btn" onClick={next}>Next →</button>
      </div>
    </div>
  )
}

function Cheatsheets({ sheets }) {
  const [topic, setTopic] = useState('all')
  const present = topicsPresent(sheets)
  const list = topic === 'all' ? sheets : sheets.filter((s) => s.topic === topic)

  return (
    <div>
      <div className="chip-row" style={{ marginBottom: 18 }}>
        <label className={`chip ${topic === 'all' ? 'on' : ''}`} onClick={() => setTopic('all')}>All</label>
        {present.map((t) => (
          <label
            key={t.key}
            className={`chip ${topic === t.key ? 'on' : ''}`}
            style={{ '--tc': t.color }}
            onClick={() => setTopic(t.key)}
          >
            <span className="ic">{t.icon}</span>
            {t.short}
          </label>
        ))}
      </div>

      <div className="grid cols-2">
        {list.map((s) => {
          const meta = topicMeta(s.topic)
          return (
            <div className="card cheat" key={s.id} style={{ borderLeft: `3px solid ${meta.color}` }}>
              <h4>
                <span>{meta.icon}</span> {s.title}
              </h4>
              <ul>
                {s.items.map((it, i) => (
                  <li key={i}><RichText text={it} /></li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
