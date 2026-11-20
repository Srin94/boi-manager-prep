# BOI SO (IT) Prep — Manager, Full-Stack Engineering (Scale II)

An interactive React app to practice MCQs for the **Bank of India Specialist Officer (IT)** written
exam — *Manager – Full-Stack Engineering, Scale II* (Project 2026-27/02, Sr. No. 20).

Built from the official notification and the two intensive preparation guides in this folder.

## Features

- **Timed practice tests** — configurable topics, question count, timer, and negative marking (−¼,
  matching the real Professional-Knowledge section).
- **~490 questions with worked solutions** across every syllabus area: Full-Stack/Backend (React,
  Java, Spring Boot, JS/TS, Python, REST, microservices), DBMS/SQL, Core CS (DSA/OS/Networks),
  SE/Architecture/ITIL, Emerging Tech (AI/ML, GenAI/RAG, Cloud, Docker, Kubernetes, CI/CD,
  DevSecOps), Security/Banking/RBI, and English.
- **A fresh set every session** — questions are drawn *least-seen-first* then shuffled, and each
  question's options are reshuffled too, so repeats are rare and you cycle the whole bank over time.
- **Two modes** — *Exam* (solutions at the end, like the real test) and *Practice* (instant feedback
  per question).
- **Review screen** — every question with your answer, the correct answer, and an explanation;
  filter by All / Wrong / Skipped.
- **Learn & revise** — 170+ flip flashcards and 20 cheat sheets (HTTP codes, ports, ACID, isolation
  levels, payment limits, K8s objects, GoF patterns, and more).
- **Progress tracking** — accuracy trend, weak-topic analysis, and full attempt history (stored
  locally in your browser).
- Light / dark theme, keyboard shortcuts, and a responsive layout.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

To build a static production bundle:

```bash
npm run build      # outputs to dist/
npm run preview    # serve the built bundle
```

## Keyboard shortcuts (during a test)

- `1`–`4` — select option A–D
- `←` / `→` — previous / next question
- `F` — flag the current question

## Project structure

```
src/
  App.jsx                 # top-level view routing + session lifecycle
  components/             # Home, ConfigScreen, Quiz, Results, Review, Learn, Progress, About
  lib/
    topics.js             # topic metadata
    session.js            # fresh-set-per-session builder (least-seen + shuffle)
    shuffle.js            # seedable PRNG, Fisher–Yates, option shuffling
    scoring.js            # exam-style scoring with negative marking
    storage.js            # localStorage (seen map, stats, history, settings)
  data/
    index.js              # merges + normalizes + de-dupes the question bank
    authored/             # hand-written questions per topic + flashcards
    generated/            # questions & study material extracted from the prep guides
```

## Data sources

Questions and study material are compiled from the two `BOI_SO_IT_7_Day_Intensive_Preparation_Guide`
PDFs (chapter MCQs, four mock tests, cheat sheets and glossary) plus additional authored questions
grounded in standard computer-science knowledge.

## Disclaimer

Independent study aid — **not affiliated with or endorsed by Bank of India**. The official notice
does not publish exact question counts or previous papers. Always verify facts and exam details
against the official Bank of India notification.
