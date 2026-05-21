Homework: Simulation history and replay contract

The current game engine is still coupled to terminal output and a fixed top-level loop. To support an AI-only React viewer with forward and rewind controls, extract a reusable simulation runner that records structured history instead of relying on direct console logging.

Implement the first reusable engine contract for simulation history.

1. Replace fixed-length game execution with a game-state-driven runner
  - The simulation can stop when only one active player remains
  - The simulation can also stop when a configured turn limit is reached
  - The CLI entry point can still print output, but the runner must be reusable outside the terminal
2. Record structured simulation history
  - Capture enough data to reconstruct the match step by step
  - At minimum, history should include match configuration, turn boundaries, and action-level records for currently implemented mechanics
  - Supported mechanics in this issue: movement, passing Go, purchasing, rent, taxes, jail, utilities, railroads, and bankruptcy handling that already exists in the engine
3. Separate gameplay effects from presentation
  - Core game logic should emit events or action records instead of writing directly to `console.log`
  - Keep a thin adapter so the existing CLI can still display the simulation output
4. Keep replay deterministic in tests
  - The history must be stable when dice rolls are mocked
  - It must be possible to replay the same recorded simulation and obtain the same visible state progression

# Acceptance Criteria

[ ] A reusable simulation runner exists outside the CLI entry point.
[ ] Simulation execution can stop because only one active player remains.
[ ] Simulation execution can stop because a turn limit is reached.
[ ] The engine returns structured history for the simulation instead of depending on console logs.
[ ] The CLI can still display the game using the new runner output.
[ ] Tests prove the same mocked dice sequence produces the same history and replayed state.

# Notes

- Start from `index.js`, `game/playRound.js`, and `game/createGame.js`.
- Use the refactoring direction from `docs/proposals/refactorings.md`: separate gameplay side effects from console output.
- Keep the first history format simple. Prefer an event log that can rebuild state over storing deep snapshots after every action unless needed.
- This issue is a blocker for AI player profiles and the React replay UI.