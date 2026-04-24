Homework: React replay viewer for AI-only games

Build the first React application for observing a Monopoly simulation played entirely by computer-controlled players. The user does not take turns in the game. They can only configure the match, view the progress, and move forward or backward through the simulation.

Implement the first read-only React replay UI.

1. Add a React app entry point for AI-only simulations
  - The UI can create a match using computer-player profiles
  - The UI runs the simulation through the reusable engine API instead of calling game-rule internals directly
2. Render replayable game progress
  - Show enough game state to understand the match at each step: player positions, cash, bankruptcy state, and owned properties
  - Show a timeline or equivalent navigation model based on the engine history
3. Support replay controls
  - Move forward by one step
  - Move backward by one step
  - Jump to turn boundaries or the start/end of the simulation
4. Keep the first version read-only
  - No human turns
  - No in-game prompts for buying, trading, or jail decisions
  - No board editing after the match starts
5. Add focused UI tests
  - Replay navigation updates the visible state correctly
  - Stepping backward restores the previously visible state

# Acceptance Criteria

[ ] A React app exists in the repository and can run an AI-only Monopoly simulation.
[ ] The UI can configure a match using the available computer-player profiles.
[ ] The UI displays replayable simulation progress without requiring terminal output.
[ ] The user can step forward and backward through the simulation.
[ ] The user can jump to the beginning, end, or turn boundaries of the simulation.
[ ] Tests cover the replay controls and visible state restoration.

# Notes

- Keep the simulation engine framework-agnostic. React should consume engine history rather than mutate game state directly.
- Prefer a read-only timeline first. Avoid mixing new UI work with unfinished gameplay features such as trading, houses, or mortgages.
- This issue depends on `2026-04-24-simulation-history-and-replay.md` and `2026-04-24-computer-player-strategies.md`.
- If Chance and Community Chest become required for demo completeness, track that as a separate engine issue instead of folding it into the UI task.