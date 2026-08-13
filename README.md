# EQUARROW

A playable browser prototype for a language-free logic puzzle built around diagonal arrows.

## Play

GitHub Pages:

`https://wtrak.github.io/arrowpuzzle/`

### Navigation

- `index.html` — EQUARROW home
- `tutorial.html` — 5-step beginner walkthrough
- `puzzles.html` — choose a difficulty
- `easy-puzzles.html` — 10 Easy puzzles (004–013)
- `medium-puzzles.html` — Medium calibration puzzles
- `hard-puzzles.html` — Hard challenge
- `play.html?p=004` — shared puzzle player

The player has persistent Home / Tutorial / Puzzles navigation, difficulty breadcrumbs, next-puzzle navigation, and local best-time/completion tracking.

## Rules

Fill every empty cell with one of four diagonal arrows: ↖ ↗ ↙ ↘.

1. **Every interior dot has exactly one arrow pointing at it.**
2. **Every row is balanced:** on a 4×4 board, 2 arrows point left and 2 point right.
3. **Every column is balanced:** on a 4×4 board, 2 arrows point up and 2 point down.

## Difficulty calibration

- **Easy:** direct visible deductions throughout; current set is 004–013.
- **Medium:** longer combinations / more candidate pressure; current calibration puzzles are 002–003.
- **Hard:** deeper candidate reasoning; Puzzle 001 is the original challenge.

## Prototype features

- Mobile-friendly, fixed equal-size board rows/columns
- Touch/mouse arrow entry
- Live row/column counters
- Dot conflict indicators
- Reset and rule validation
- Persistent site navigation
- Difficulty libraries
- Solved-state and best-time tracking via localStorage
