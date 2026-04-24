# Refactoring Suggestions

## 1. Centralize money transfer and bankruptcy settlement

Rent, taxes, buying, and passing Start all mutate balances directly. Add a small money API such as `creditPlayer`, `debitPlayer`, and `transferMoney`, then trigger bankruptcy handling from one place.

Why:
- Removes repeated arithmetic and logging patterns.
- Makes edge cases around negative balances consistent.
- Reduces the chance of forgetting bankruptcy checks after a balance change.

## 2. Rework turn sequencing in `playRound()` to avoid ID-based round logic

`playRound()` currently infers whether a round should continue using `game.currentPlayerId > player.id`, which depends on player IDs matching turn order and can become fragile when bankrupt players are skipped.

Why:
- Turn progression should be based on turn position, not numeric IDs.
- A loop over active players or a tracked starting player is easier to reason about.
- This is a likely source of subtle round-ending bugs.

## 3. Give game state a dedicated turn manager

`createGame()` owns player data, board state, current player lookup, active-player filtering, and next-turn selection. Extract turn-related operations into a dedicated module or class.

Why:
- Separates board/game data from turn navigation rules.
- Makes `createGame()` easier to read.
- Helps isolate and test turn sequencing independently.

## 4. Normalize purchasable-location behavior behind a shared abstraction

Properties, railroads, and utilities all rely on `price` and `ownerId`, but the logic is spread across `createBoard()` and `locationRules`. Introduce helpers like `isPurchasable(tile)` and `canCollectRent(tile)`.

Why:
- Removes truthy checks like `tile.price` from business logic.
- Prevents bugs when a tile shape changes.
- Makes ownership rules explicit instead of inferred.

## 5. Separate gameplay side effects from console output

Game logic currently logs directly with `console.log()` and `console.warn()`. Refactor to emit events or return action messages, then let the CLI layer decide how to display them.

Why:
- Core logic becomes easier to test without mocking console methods.
- The game engine becomes reusable outside the terminal UI.
- Behavior and presentation stop leaking into each other.
