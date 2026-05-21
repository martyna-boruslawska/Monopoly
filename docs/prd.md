# PRD: Training Monopoly - Computer-Only Strategy Simulation and Replay

## Summary

Build a read-only React replay application on top of the current Monopoly engine, focused on computer-only strategy simulation matches.

The product is for training junior developers in coding, testing, and refactoring. It is not a full interactive Monopoly game for human turns.

## Current State Snapshot (2026-05-21)

Current codebase status:

- Terminal-first Node.js engine (`index.js` starts a match and prints output)
- Rules implemented in play loop: movement, passing Go, property purchase, property rent, railroad rent, utility rent, taxes, jail/go-to-jail, doubles-to-jail, bankruptcy marking
- Building rules implemented: deterministic house/hotel buying with reserve guard and mortgage-block check
- 103 tests passing in Node test runner

Known gaps to target product:

- Chance and Community Chest tile resolution is not implemented
- Purchase flow still auto-buys affordable unowned properties
- Mortgage and unmortgage actions are not implemented
- Property trading flow is not implemented
- Reusable simulation history/replay contract is not implemented
- Computer-player profiles and strategy hooks are not implemented
- React replay app is not implemented

## Problem

The engine can run terminal games, but behavior is coupled to mutable runtime state and console output. This blocks product-level replay, strategy comparison, and visual inspection.

Without structured history and a replay UI, it is hard to:

- compare computer-player strategies
- understand why one strategy outperformed another
- verify rule changes against deterministic scenarios
- present the project as a simulation product instead of a CLI exercise

## Product Vision

Create a deterministic, inspectable Monopoly simulator where:

- every player uses a named, serializable computer strategy profile
- a full match can be replayed step by step
- replay navigation can move backward and forward without mutating source run history
- engine logic stays framework-agnostic and independent from React

## Product Goals

1. Support computer-only strategy simulation matches with configurable computer-player profiles.
2. Complete the minimum rule set required for meaningful strategy simulation (auctions, mortgages, trading, card tiles).
3. Expose deterministic, structured simulation history suitable for replay.
4. Provide a React replay UI for match setup, playback, and state inspection.
5. Keep the engine testable and deterministic with mocked dice.

## Non-Goals (V1)

- Human-turn gameplay or in-turn prompts
- Online multiplayer or cross-device persistence
- In-game board editing after simulation start
- Advanced analytics dashboards beyond replay and visible state

## Target Users

Primary user:

- Learner, developer, or reviewer comparing strategy behavior in controlled runs

Secondary user:

- Engine maintainer extending rules while preserving deterministic behavior

## User Stories

1. As a user, I want to run a match with named computer profiles so I can compare strategy outcomes.
2. As a user, I want to step through a match one turn at a time so I can inspect decisions.
3. As a user, I want to rewind to an earlier step so I can re-check a critical transition.
4. As a user, I want the visible board state to always match recorded history.
5. As a developer, I want mocked dice to produce deterministic history for stable tests.

## Core Experience

### Match Setup

The user creates a computer-only strategy simulation match by choosing profile definitions and turn limit.

Initial profile set:

- Aggressive Buyer
- Monopolist
- Cash Hoarder
- Railroad Baron
- Risk-Averse
- Builder

### Simulation Run

The simulation runs inside engine API, not React components. Engine returns structured history (turn boundaries and action records).

### Replay

The user can:

- step forward by one replay step
- step backward by one replay step
- jump to turn boundaries
- jump to match start or end

Replay step default: one player turn.

### State Inspection

For selected replay step, UI shows:

- player identity and strategy profile
- position on board
- cash
- owned properties
- bankruptcy status
- action/event summary

## Functional Requirements

### 1. Rule Engine Completion

1. Implement Chance and Community Chest draw/resolve flow.
2. Add decline-to-buy branch and deterministic property auctions.
3. Add mortgage and unmortgage actions with rent suppression for mortgaged tiles.
4. Add deterministic end-of-turn cash-for-property trading flow.
5. Keep out-of-scope complexity deferred (human negotiation, counter-offers, building scarcity auctions, bankruptcy transfer edge flows not selected for this phase).

### 2. Reusable Simulation Runner and History Contract

1. Provide reusable runner outside CLI entry point.
2. Stop conditions:
	- one active player remains
	- configured turn limit reached
3. Return structured history instead of depending on console logs.
4. Keep CLI output through thin adapter using runner output.
5. Ensure replay determinism under mocked dice.

### 3. Computer-Player Profiles

1. Match configuration accepts computer-player profile definitions.
2. Introduce strategy hooks for existing decision points first:
	- buy or decline unowned tile
	- jail exit decision when choice exists
3. Keep strategy API open for building, mortgage, and trade hooks.
4. Ship six initial profiles and test divergent behavior.

### 4. React Replay Viewer

1. Add React app entry point for computer-only strategy simulation.
2. Run simulation through reusable engine API.
3. Render replay timeline and visible match state.
4. Support forward/backward and boundary jumps.
5. Keep UI read-only in V1.

## Rules Coverage

### Implemented Now

- movement and passing Go
- unowned tile purchase (auto-buy if affordable)
- rent: property, railroad, utility
- taxes
- jail and go-to-jail
- bankruptcy marking/removal from active play
- deterministic building (houses/hotels) strategy

### Required Before Replay Product V1

- Chance and Community Chest resolution
- auction flow after declined purchase
- mortgage and unmortgage mechanics
- deterministic trading flow

## UX Requirements

1. Replay is read-only and deterministic.
2. Navigation response feels immediate.
3. Visible state never drifts from selected history point.
4. Profile names and outcomes are easy to compare.

## Technical Requirements

1. Keep engine framework-agnostic.
2. Keep history and profile definitions serializable.
3. Preserve deterministic tests through mocked dice.
4. Keep current Node test suite green while adding runner/profile/UI tests.

## Success Criteria

V1 is successful when:

- user can run a computer-only strategy simulation match in React
- user can replay forward/backward without state drift
- at least two profiles show different behavior from same scenario
- deterministic tests prove stable history from mocked dice

## Milestones and Status

### Milestone 0: Baseline Engine (Done)

- Current terminal engine, core movement/rent/jail/tax flow
- Deterministic building rules
- 103 passing tests

### Milestone 1: Auctions and Mortgages (Planned)

- [Forced Mortgage](issues/2026-05-25-forced-mortgage.md)
- [Proposal: Auctions](proposals/NextStep1_auctions.md)
- [Proposal: Mortgages](proposals/NextStep1_mortgages.md)

### Milestone 2: Trading (Planned)

- [Proposal: NextStep2_trading](proposals/NextStep2_trading.md)

### Milestone 3: Simulation History and Computer Profiles (Planned)

- [Proposal: NextStep3_simulation-history-and-replay](proposals/NextStep3_simulation-history-and-replay.md)
- [Proposal: NextStep3_computer-player-strategies](proposals/NextStep3_computer-player-strategies.md)

### Milestone 4: React Replay Viewer (Planned)

- [Proposal: NextStep4_react-replay-viewer](proposals/NextStep4_react-replay-viewer.md)

## Risks

1. History format drift if event contract is not locked early.
2. Strategy logic becoming hard-coded if hooks are added ad hoc.
3. UI scope creep into interactive gameplay.
4. Documentation drift between proposal files and PRD.

## Open Product Decisions

1. History representation: pure event log vs event log plus sparse snapshots.
2. Default turn limit for simulation runs.
3. Final naming convention for profile IDs and strategy configuration schema.

## Related Backlog and Specs

- [Plans](plans.md)
- [Chance and Community Chest issue](issues/2026-04-27-chance-and-community-chest.md)
- [Houses and Hotels issue](issues/2026-05-01-houses-hotels.md)
- [Auctions proposal](proposals/NextStep1_auctions.md)
- [Mortgages proposal](proposals/NextStep1_mortgages.md)
- [Trading proposal](proposals/NextStep2_trading.md)
- [Simulation history proposal](proposals/NextStep3_simulation-history-and-replay.md)
- [Computer profiles proposal](proposals/NextStep3_computer-player-strategies.md)
- [React replay viewer proposal](proposals/NextStep4_react-replay-viewer.md)
