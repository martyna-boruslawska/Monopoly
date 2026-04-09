# Homework. Safe refactoring - introduction game object

## Goal

Introduce a `game` object safely, in small verifiable steps, so that state is centralized in `createGame(playerNames)` and the main flow moves toward:

- `movePlayer(game, steps)`
- `playRound(game)`
- current turn tracking through `game.currentPlayerId` and `game.currentPlayer()`

Main rule: change one function signature at a time and keep behavior stable while tests stay green.

## First read

Start with `tests/createGame.test.js`.

These tests define the first safe step. They prove that `createGame(playerNames)` returns an object with:

- `players`
- `board`
- `rollDice`
- `currentPlayerId`
- `currentPlayer()`
- `countActivePlayers()`
- `getActivePlayers()`
- `nextActivePlayer()`

They also prove turn navigation:

- no selected player returns `null`
- the first active player is selected correctly
- bankrupt players are skipped
- active-player counting ignores bankrupt players
- when no active players remain, navigation returns `false` and clears the current player

Why this matters:

- first prove the new object shape in isolation
- then migrate callers one by one
- this keeps failures narrow and easy to diagnose
- this starts with introducing a parameter object, not with changing the game rules themselves

## Task

### Step 1. Introduce `createGame(playerNames)`

Create `game/createGame.js` as a small assembly layer.

The object should contain:

- `players` from `createPlayers(playerNames)`
- `board` from `createBoard()`
- `rollDice`
- `currentPlayerId` initialized to `null`
- `currentPlayer()`, `countActivePlayers()`, `getActivePlayers()`, `nextActivePlayer()`

Do not refactor `movePlayer`, `playRound`, `index.js`, or `locationRules` yet.

Run only:

- `tests/createGame.test.js`

### Step 2. Refactor `movePlayer` to use `game`

Change the function signature to `movePlayer(game, steps)`.

Rules:

- resolve the active player with `game.currentPlayer()`
- keep movement math unchanged
- keep Start bonus unchanged
- keep `locationRules` behavior unchanged

Update the tests to build a game object and set `game.currentPlayerId` explicitly.

Run only:

- `tests/movePlayer.test.js`

### Step 3. Refactor `playRound` to use `game`

Change the function signature to `playRound(game)`.

Rules:

- calculate turns from active players
- use `game.currentPlayerId` and `game.nextActivePlayer()` for turn selection
- keep doubles behavior unchanged
- stop extra turns when the player becomes bankrupt
- keep the same round order for non-bankrupt players

Update the tests to use a real game object.

Run only:

- `tests/playRound.test.js`

### Step 4. Update the entrypoint

Refactor `index.js` last.

Replace separate setup with `createGame(playerNames)`, then:

- pass `game` into `playRound(game)`
- keep intro and summary based on `game.players`

### Step 5. Update `locationRules` to use `game` object - use safe refactoring with a temporary adapter

Migrate `locationRules` through a temporary adapter:

- the old signature (`handle` --> `handle_old`) was preserved temporarily
- update tests `locationRules.test.js` to use a game object: use `createGame(playerNames)` and call the new `handle_new(game)`
- rename `handle_new` back to `handle` and remove `handle_old`, migrate game logic to use the new `handle(game)` directly, and verify all tests pass again

This is a good example of safe refactoring in practice. The temporary adapter reduced risk by preserving old behavior while callers and tests migrated.

### Step 6. Migrate tests to the game object in other test files

Tests now use game-oriented setup rather than assembling `players`, `board`, and the current player separately.

That reduced test setup noise and made the new game-oriented interface explicit.

### Step 7. Run the full suite

After the focused slices were stable, the full suite passed.

## Guardrails

- Keep external behavior stable where tests already define it.
- Introduce a temporary adapter and remove it after callers migrate.
   - use it while migrating `locationRules.handle`
   - rename `handle` to `handle_old`
   - add a new `handle_new(game)` that calls `handle_old(player)`
   - verify all tests pass with the adapter
   - then migrate tests first: `locationRules.test.js` to use `game` and remove the adapter
   - rename `handle_new` back to `handle` and remove `handle_old`, migrate game logic to use the new `handle(game)` directly, and verify all tests pass again
- Prefer additive changes before replacing old call sites.
- Keep each step small enough that one failing test points to one recent change.
- Extract shared test helpers only after the new game shape is clear.

## Acceptance checklist

- [ ] `game/createGame.js` exists and returns an object with `players`, `board`, `rollDice`, `currentPlayerId`, `currentPlayer()`, `countActivePlayers()`, `getActivePlayers()`, and `nextActivePlayer()`.
- [ ] `currentPlayerId` starts as `null`.
- [ ] `currentPlayer()` returns `null` when no player is selected.
- [ ] `nextActivePlayer()` selects the first active player when starting from `null`.
- [ ] `nextActivePlayer()` skips bankrupt players.
- [ ] `nextActivePlayer()` returns `false` and clears `currentPlayerId` when no active players remain.
- [ ] `movePlayer` accepts `game` and `steps`.
- [ ] `movePlayer` still moves the current player correctly.
- [ ] Passing or landing through Start still gives the same $200 behavior as before.
- [ ] `movePlayer` still triggers location handling with no behavior change.
- [ ] `playRound` accepts `game`.
- [ ] `playRound` still gives each non-bankrupt player one turn per round.
- [ ] Doubles still grant another turn.
- [ ] A player who becomes bankrupt during extra turns stops taking more turns.
- [ ] `index.js` creates the game through `createGame(...)` and uses `game.players` for intro and summary.
- [ ] `tests/createGame.test.js` passes after Step 1.
- [ ] `tests/movePlayer.test.js` passes after Step 2.
- [ ] `tests/playRound.test.js` passes after Step 3.
- [ ] `locationRules` uses the `game` object correctly after migration.
- [ ] `locationRules` still trigger with the same behavior when called through `playRound(game)`.
- [ ] `tests/locationRules.test.js` passes after Step 5.
- [ ] The full test suite passes after the final step.

## Core idea

Safe refactoring means:

1. introduce a small, explicit object boundary
2. prove it with focused tests
3. migrate one caller at a time
4. run the smallest relevant test slice after each step
5. run the full suite only when the slices are stable
6. if needed, add a temporary adapter to bridge old and new function signatures (function or module)
7. remove the temporary adapter once all callers and tests have migrated

In this case, the central refactoring is `Introduce Parameter Object`: replace clusters of related arguments with a `game` object, keep behavior unchanged, and migrate callers in small verified steps.