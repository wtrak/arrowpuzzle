# Arrow Puzzle Prototype

A playable browser prototype for a new logic puzzle concept.

## Rules

Fill every empty cell with one of four diagonal arrows: ↖ ↗ ↙ ↘.

1. **Every interior dot has exactly one arrow pointing at it.**
2. **Every row is balanced:** on a 4×4 board, 2 arrows point left and 2 point right.
3. **Every column is balanced:** on a 4×4 board, 2 arrows point up and 2 point down.

Puzzle 001 uses three starting clues and has exactly one valid solution.

## Play

GitHub Pages is configured to publish this repository from `main` at:

`https://wtrak.github.io/arrowpuzzle/`

You can also open `index.html` directly in any browser.

## Prototype features

- Touch/mouse arrow entry
- Live row/column teaching counters
- Dot conflict indicators
- Rule validation
- Reset
- Hint system that only identifies a cell as forced when all remaining legal completions agree on that arrow
- Mobile-friendly layout

This is an early mechanic test. `ARROW` is only a working title, not a final brand name.
