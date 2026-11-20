// localStorage helpers — all reads/writes guarded so the app still works
// in private windows or when storage is blocked.

const PREFIX = 'boi-prep:'

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* ignore quota / disabled storage */
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    /* ignore */
  }
}

// --- Domain-specific state ---------------------------------------------------

// How many times each question id has been served, so sessions can prefer
// least-seen questions and cycle through the whole bank over time.
export function getSeenMap() {
  return load('seen', {})
}

export function bumpSeen(ids) {
  const seen = getSeenMap()
  for (const id of ids) seen[id] = (seen[id] || 0) + 1
  save('seen', seen)
}

export function resetSeen() {
  remove('seen')
}

// Per-question performance for spaced-ish review (counts right/wrong).
export function getStats() {
  return load('stats', {})
}

export function recordAnswers(records) {
  // records: [{ id, correct: bool }]
  const stats = getStats()
  for (const r of records) {
    const s = stats[r.id] || { seen: 0, correct: 0, wrong: 0 }
    s.seen += 1
    if (r.correct) s.correct += 1
    else s.wrong += 1
    stats[r.id] = s
  }
  save('stats', stats)
}

// History of completed sessions (score summaries).
export function getHistory() {
  return load('history', [])
}

export function pushHistory(entry) {
  const h = getHistory()
  h.unshift(entry)
  save('history', h.slice(0, 100))
}

export function clearHistory() {
  remove('history')
}

// User settings for the config screen (remembered between visits).
export function getSettings() {
  return load('settings', null)
}

export function saveSettings(s) {
  save('settings', s)
}
