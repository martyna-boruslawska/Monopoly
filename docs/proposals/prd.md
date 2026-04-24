# PRD: Training Monopoly App - Simulation, History, and Replay

## Summary

Build a React application that runs Monopoly simulations played entirely by computer-controlled players and lets the user inspect the game by moving forward or backward through the recorded history.

The product is used to train junior developers in coding, testing, and refactoring a JavaScript and TypeScript codebase. It is not intended to be a full-featured Monopoly game for human players. The user configures the simulation, starts it, and observes how different player strategies behave over time.

## Problem

The current project is a terminal-based Monopoly engine with partially implemented rules. It can simulate some parts of a game, but it is not yet structured as a reusable simulation engine and it does not support product-level observation features such as replay, rewind, or strategy comparison.

Without a replayable history and a UI built on top of it, it is difficult to:

- compare computer-player behaviors
- understand why one strategy outperformed another
- verify that rule changes produce expected outcomes
- present the project as a visual simulation instead of a CLI exercise

## Product Vision

Create a deterministic, inspectable Monopoly simulator where:

- every player is controlled by a named strategy profile
- the full game can be replayed step by step
- the user can move backward and forward through the simulation without mutating the original run
- the simulation engine stays independent from the React UI

## Product Goals

1. Support AI-only Monopoly matches with configurable computer-player profiles.
2. Full Monopoly rules - rule engine is not fully implemented yet
3. Expose replayable simulation history that is stable and testable.
4. Provide a React UI for observing game progress instead of relying on terminal output.
5. Make strategy differences visible through the same board state and match history.

## Non-Goals

The first version does not include:

- human turns or interactive gameplay decisions
- online multiplayer or persistence across devices
- in-game board editing after a match starts
- advanced analytics dashboards beyond the replay and visible game state

## Target User

Primary user:

- a learner, developer, or reviewer who wants to observe how different Monopoly strategies behave in a controlled simulation

Secondary user:

- a maintainer of the engine who needs deterministic replay and testable game history when extending rules

## User Stories

1. As a user, I want to create a match with several named AI profiles so I can compare how different strategies behave.
2. As a user, I want to watch the simulation one step at a time so I can understand what happened during each turn.
3. As a user, I want to rewind to an earlier point in the match so I can inspect a key decision again.
4. As a user, I want the displayed game state to match the recorded simulation history exactly so I can trust what I see.
5. As a developer, I want the engine history to be deterministic under mocked dice so I can write stable tests.

## Core Experience

### Match Setup

The user creates an AI-only match by selecting computer-player profiles. Initial target profiles:

- Aggressive Buyer
- Monopolist
- Cash Hoarder
- Railroad Baron
- Risk-Averse
- Builder

The UI may also support a configurable turn limit to prevent unbounded simulations.

### Simulation Run

Once started, the simulation is executed by the engine, not by React components. The engine returns recorded history for the full run, including turn boundaries and gameplay events.

### Replay

The user can:

- play the simulation forward one step at a time
- step forward one event or state transition
- step backward one event or state transition
- 10 steps forward
- 10 steps backward

> Step = a single player turn.

### State Inspection

For the current replay position, the UI should show at least:

- each player name and strategy profile
- current position on the board
- current cash
- owned properties
- bankruptcy state
- relevant event text or action summary for the current replay step

## Functional Requirements

### 1. Reusable Simulation Engine

The project must provide a reusable engine API that is separate from CLI presentation.

Requirements:

- simulation can stop when only one active player remains
- simulation can stop when a configured turn limit is reached
- simulation returns structured history instead of depending on direct console output
- current CLI output can be preserved through an adapter layered on top of the engine output

### 2. Recorded History

The engine must return replayable history for currently implemented rules.

Minimum history requirements:

- match configuration
- player roster and strategy identifiers
- turn boundaries
- event or action records
- enough data to reconstruct visible game state at any replay point

Preferred implementation direction:

- event log with deterministic replay
- avoid coupling replay to mutable live engine state

### 3. Computer-Player Profiles

The engine must support AI players with named profiles.

Initial decision points:

- buying unowned purchasable tiles
- deciding whether to pay to leave jail when rules allow a choice
- buying houses and hotels *(in backlog, required for V1)*
- mortgages *(in backlog, required for V1)*
- trades *(in backlog, required for V1)*

### 4. React Replay UI

The React app must:

- create an AI-only match from available strategy profiles
- run a simulation through the engine API
- render replayable game progress
- support forward and backward navigation
- display the current visible game state from the selected replay point

## Supported Rules in V1

The first version should rely only on rules already implemented or explicitly selected for near-term implementation in the engine:

- movement
- passing Go
- property purchase
- property rent
- railroad rent
- utility rent
- taxes
- jail and go-to-jail
- current bankruptcy behavior

These mechanics exist in backlog, but they are not implemented yet, but required to ship the first version:

- Chance and Community Chest full support
- houses and hotels
- mortgages
- property trading
- asset auctions
- human-vs-AI turns

## UX Requirements

1. The app must be read-only during simulation replay.
2. Replay controls must feel immediate and consistent.
3. The visible state must never drift from the recorded simulation state.
4. The UI should make strategy names easy to compare during and after a match.

## Technical Requirements

1. Keep the engine framework-agnostic.
2. Keep the history format serializable.
3. Preserve deterministic tests through mocked dice rolls.
4. Keep current Node test coverage green while adding new engine and UI tests.

## Success Criteria

The first version is successful when:

- a user can configure and run an AI-only match in a React UI
- the match can be replayed forward and backward without recomputing incorrect state
- at least two strategy profiles visibly behave differently in the same general scenario
- engine-level tests prove deterministic replay from mocked dice sequences

## Milestones

### Milestone 1: Backfill missing rules in rule engine

- implement Chance and Community Chest cards
- implement house and hotel buying
- implement mortgages
- implement asset auctions (auctioning unpurchased properties after a declined buy)
- implement property trading (negotiated trades and trade offers between players)

### Milestone 2: Simulation History and Replay Contract

- replace the fixed top-level loop with a reusable simulation runner
- return structured history from the engine
- keep terminal output through an adapter

### Milestone 3: Computer-Player Strategies

- add AI-only match definitions
- introduce strategy hooks for buying and jail decisions
- implement the first six profiles

### Milestone 4: React Replay Viewer

- add a React application entry point
- render replay controls and visible game state
- support step forward, step backward, and turn navigation

## Risks

1. Replay complexity may grow quickly if the engine continues mutating live state without a stable history contract.
2. Strategy design may become hard to evolve if profiles are represented as ad hoc code instead of serializable configuration.
3. UI scope may expand into full gameplay unless read-only boundaries are kept explicit.

## Open Product Decisions

Recommended defaults for the first version:

1. Use a turn limit by default to keep simulations bounded.
2. Represent replay history as an event log plus deterministic reconstruction rather than storing full snapshots after every action.
3. Keep the first UI focused on clarity and correctness, not animation-heavy presentation.

## Related Backlog

- [plans](/docs/proposals/plans.md)
- [Issue: Replay and Simulation History](/docs/issues/2026-xx-xx-simulation-history-and-replay.md)
- [Issue: Strategies for Computer Players](/docs/issues/2026-xx-xx-computer-player-strategies.md)
- [Issue: React UI Viewer](/docs/issues/2026-xx-xx-react-replay-viewer.md)
