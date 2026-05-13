# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
node --test                              # run all tests
node --test --watch                      # run tests in watch mode
node --test tests/path/to/file.test.js   # run a single test file
node index.js                            # run the game simulation
```

No build step — pure ESM, no external dependencies.

## Architecture

### Game loop

`playGame` → iterates active players → `playTurn` → `jailRules` → `rollDice` → `movePlayer` → `landingRules`

`landingRules` iterates `landingRulesPipeline`: each step is `{ activator(tile, player), handler(game) }`. Steps run in sequence; if the player becomes jailed or bankrupt mid-pipeline, the loop exits early.

### Data model

**Board** (`game.board`): 40 tiles (id 0–39). Properties have `ownerId`, `houses`, `hasHotel`. The "Go" tile has `name: "Start"` and `type: "start"` — card `location: "Go"` must be mapped to `"Start"` when searching the board.

**Player**: `{ id, name, position, money, propertyIds, isBankrupt, isInJail, failedJailRolls, getOutOfJailFree }`

**Decks** (`game.decks.chance`, `game.decks.communityChest`): each exposes `drawCard()` and `returnCard(card)`. `get-out-jail` cards stay with the player and are NOT returned to the deck.

### Key directories

- `game/factories/` — `createGame`, `createBoard`, `createPlayers`
- `game/rules/` — `landingRules`, `movePlayer`, `jailRules`
- `game/rules/handlers/` — one handler per landing effect (`handleGoToJail`, `handlePayRent`, `handleCards`, etc.)
- `game/rules/patterns/` — `landingRulesPipeline` (pipeline config) and `rentStrategies` (strategy array for rent types)
- `game/utils/` — `transferMoney`, `gameUtils` (getOwner, getPlayerTile), `markPlayerBankrupt`
- `docs/concepts/` — reference data models and card deck definitions
- `docs/issues/` — feature specs; `docs/proposals/plans.md` — roadmap

### Testing

Uses Node.js built-in test runner (`node:test` + `node:assert/strict`). Tests mirror the `game/` directory structure under `tests/`.

`createTestGame(testPlayers)` in `tests/helpers/createTestGame.js` is the shared factory for test setup. Accepts `{ name, position?, money?, propertyIds? }` per player. For card tests, attach decks manually:

```js
game.decks = { chance: chanceDeck, communityChest: communityChestDeck };
```
