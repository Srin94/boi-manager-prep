// Seedable PRNG + shuffling so every session can produce a fresh, reproducible order.

// mulberry32 — tiny, fast, good enough for quiz shuffling.
export function makePrng(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomSeed() {
  return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0
}

// Fisher–Yates using a supplied rng (() => [0,1)).
export function shuffle(arr, rng = Math.random) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Shuffle a question's options and remap the correct index.
export function shuffleOptions(question, rng = Math.random) {
  const idx = question.options.map((_, i) => i)
  const order = shuffle(idx, rng)
  const options = order.map((i) => question.options[i])
  const answerIndex = order.indexOf(question.answerIndex)
  return { ...question, options, answerIndex }
}
