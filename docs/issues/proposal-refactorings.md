# Refactoring Suggestions

This list focuses on structural improvements that reduce bugs, make new Monopoly rules easier to add, and tighten the tests around behavior.

## 1. Split `locationRules.handle()` into an explicit rule pipeline

`locationRules.handle()` currently coordinates tax handling, bankruptcy checks, buying, and rent payment in one method. Extract a small ordered pipeline such as `applyTileEffect`, `resolvePurchase`, `resolveRent`, and `settleBankruptcy`.

Why:
- Makes turn resolution easier to read and change.
- Prevents accidental reordering bugs.
- Gives each rule a single reason to change.

## 2. Replace the `locationRules` object with pure functions

The current singleton relies on `this` for internal calls. Refactor the module into named functions that accept `game`, `player`, and `tile` explicitly.

Why:
- Removes the hidden `this` dependency.
- Makes unit tests more direct.
- Simplifies reuse from `movePlayer()` and future tile handlers.

## 3. Introduce tile-type dispatch instead of conditional branching

Move from scattered checks like `tile.type === "tax"` and purchase/rent inference to a handler map, for example `tileHandlers[property]`, `tileHandlers[railroad]`, `tileHandlers[tax]`, `tileHandlers[chance]`.

Why:
- Adding Chance, Community Chest, and Go To Jail becomes incremental instead of invasive.
- Tile behavior becomes discoverable in one place.
- Reduces coupling between unrelated tile rules.

## 4. Centralize money transfer and bankruptcy settlement

Rent, taxes, buying, and passing Start all mutate balances directly. Add a small money API such as `creditPlayer`, `debitPlayer`, and `transferMoney`, then trigger bankruptcy handling from one place.

Why:
- Removes repeated arithmetic and logging patterns.
- Makes edge cases around negative balances consistent.
- Reduces the chance of forgetting bankruptcy checks after a balance change.

## 5. Introduce board query helpers

Ownership and rent calculations repeatedly scan the full board with `find()` and `filter()`. Add helpers such as `getTileByPosition`, `getOwnedRailroads`, `getOwnedUtilities`, and `getPurchasableTile`.

Why:
- Removes repeated board traversal logic from rule code.
- Makes intent clearer than inline array expressions.
- Creates a stable place to optimize later if state grows.

## 6. Rework turn sequencing in `playRound()` to avoid ID-based round logic

`playRound()` currently infers whether a round should continue using `game.currentPlayerId > player.id`, which depends on player IDs matching turn order and can become fragile when bankrupt players are skipped.

Why:
- Turn progression should be based on turn position, not numeric IDs.
- A loop over active players or a tracked starting player is easier to reason about.
- This is a likely source of subtle round-ending bugs.

## 7. Give game state a dedicated turn manager

`createGame()` owns player data, board state, current player lookup, active-player filtering, and next-turn selection. Extract turn-related operations into a dedicated module or class.

Why:
- Separates board/game data from turn navigation rules.
- Makes `createGame()` easier to read.
- Helps isolate and test turn sequencing independently.

## 8. Normalize purchasable-location behavior behind a shared abstraction

Properties, railroads, and utilities all rely on `price` and `ownerId`, but the logic is spread across `createBoard()` and `locationRules`. Introduce helpers like `isPurchasable(tile)` and `canCollectRent(tile)`.

Why:
- Removes truthy checks like `tile.price` from business logic.
- Prevents bugs when a tile shape changes.
- Makes ownership rules explicit instead of inferred.

## 9. Separate gameplay side effects from console output

Game logic currently logs directly with `console.log()` and `console.warn()`. Refactor to emit events or return action messages, then let the CLI layer decide how to display them.

Why:
- Core logic becomes easier to test without mocking console methods.
- The game engine becomes reusable outside the terminal UI.
- Behavior and presentation stop leaking into each other.

## 10. Strengthen tests with factories and behavior-focused scenarios

The test suite already has a useful `createTestGame()` helper, but many tests still manually encode setup details. Add specialized builders for owned tiles, bankrupt players, roll sequences, and expected transactions.

Why:
- Test setup becomes shorter and more expressive.
- New rule handlers can be added with less duplication.
- Behavioral gaps like Chance, Community Chest, and Go To Jail become easier to cover.

## Suggested Order

If you want the highest-impact sequence, start here:

1. Refactor turn sequencing in `playRound()`.
2. Centralize money transfer and bankruptcy settlement.
3. Split `locationRules.handle()` into a rule pipeline.
4. Introduce tile-type dispatch.
5. Separate logging from gameplay logic.