// Builds a fresh practice session each time it is called.
//
// "A new set every session" is achieved by:
//   1. Preferring least-recently-seen questions (via the `seen` map in storage),
//      with randomness as the tie-breaker, so you steadily cycle the whole bank.
//   2. Shuffling the chosen questions into a fresh order.
//   3. Shuffling each question's options (and remapping the correct answer).
// All three use a per-session seed, so a session is reproducible (for review)
// but different every time you start one.

import { makePrng, randomSeed, shuffle, shuffleOptions } from './shuffle.js'
import { getSeenMap } from './storage.js'

// Pick `count` questions from `pool`, biased toward least-seen items.
function pickLeastSeen(pool, count, seenMap, rng) {
  const decorated = pool.map((q) => ({
    q,
    seen: seenMap[q.id] || 0,
    r: rng(),
  }))
  // Fewer views first; random tie-breaker shuffles within the same view-count.
  decorated.sort((a, b) => a.seen - b.seen || a.r - b.r)
  return decorated.slice(0, count).map((d) => d.q)
}

/**
 * @param {Object} opts
 * @param {Array}  opts.pool        questions already filtered to chosen topics
 * @param {number} opts.count       how many questions to serve
 * @param {number} [opts.seed]      optional fixed seed (otherwise random)
 * @param {boolean}[opts.shuffleOptions=true]
 */
export function buildSession({
  pool,
  count,
  seed = randomSeed(),
  shuffleOptions: doShuffleOptions = true,
}) {
  const rng = makePrng(seed)
  const seenMap = getSeenMap()

  const n = Math.min(count, pool.length)
  const chosen = pickLeastSeen(pool, n, seenMap, rng)
  const ordered = shuffle(chosen, rng)

  const questions = ordered.map((q) =>
    doShuffleOptions ? shuffleOptions(q, rng) : q
  )

  return { seed, questions }
}

export { randomSeed }
