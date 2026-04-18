# TypeScript Refactoring Plan — Monopoly JS (Final)

## 1. Context

Pure ESM Node.js Monopoly simulation using `node:test` + `node:assert/strict`. No build, no bundler, no linter, no tsconfig today — runtime is `node index.js` / `node --test`. Node version in use: **v22.22.0**. Test baseline: **63/63 green**.

Goal: convert every `.js` file (production + tests + helpers) to TypeScript with domain types derived from the current code, existing JSDoc, and [docs/concepts/Monopoly - Data Model.md](docs/concepts/Monopoly - Data Model.md). **No behavioral change; `npm test` must still be 63/63.**

This version of the plan incorporates feedback from [ts-refactoring.review.md](ts-refactoring.review.md) and the user's decisions.

---

## 2. Finalized decisions

| # | Topic | Choice |
|---|-------|--------|
| A | Runtime | **A2 — `tsx`** (runtime + tests) |
| B | Strictness | **B2 — `strict: true`** |
| C | Location modeling | **C1 — discriminated union** + explicit `isOwnableLocation` guard |
| D | Game shape | **D1 — keep factory**, return-type `Game` |
| E | Import specifiers | `.js` suffixes in source (works natively with `tsx`) |
| F | Tests | **F1 — convert tests too** |
| G | `locationRules` internals | **G3 — module-level non-exported helpers** |
| 7 | Domain hardening (branded IDs, negative money, etc.) | Out of scope |
| 8 | ESLint + Prettier | Out of scope (user will add later) |
| 9 | Commit strategy | **Commit per phase** |

### Why `tsx` + `.js` specifiers is safe here
`tsx` resolves `./foo.js` to `./foo.ts` on disk automatically, so import statements remain runtime-valid even if we later swap to `tsc`-emitted output. This avoids the native Node type-stripping trap flagged by the review (native stripping *requires* `.ts` specifiers, which then breaks a future `tsc`-based compile path).

---

## 3. Scope — files in the conversion

### Production (11 files)
- [index.js](index.js)
- [game/createGame.js](game/createGame.js)
- [game/createBoard.js](game/createBoard.js)
- [game/createPlayers.js](game/createPlayers.js)
- [game/movePlayer.js](game/movePlayer.js)
- [game/playRound.js](game/playRound.js)
- [game/rollDice.js](game/rollDice.js)
- [game/showIntro.js](game/showIntro.js)
- [game/showSummary.js](game/showSummary.js)
- [game/rules/locationRules.js](game/rules/locationRules.js)
- [game/rules/jailRules.js](game/rules/jailRules.js)

### Tests (9 files incl. helper)
- [tests/createBoard.test.js](tests/createBoard.test.js)
- [tests/createGame.test.js](tests/createGame.test.js)
- [tests/createPlayers.test.js](tests/createPlayers.test.js)
- [tests/jailRules.test.js](tests/jailRules.test.js)
- [tests/locationRules.test.js](tests/locationRules.test.js)
- [tests/movePlayer.test.js](tests/movePlayer.test.js)
- [tests/playRound.test.js](tests/playRound.test.js)
- [tests/showSummary.test.js](tests/showSummary.test.js)
- [tests/helpers/createTestGame.js](tests/helpers/createTestGame.js)
- [tests/helpers/createTestGame.test.js](tests/helpers/createTestGame.test.js)

**Total: 21 source files to rename + 2 new files (`game/types.ts`, `tsconfig.json`).**

### Out of scope
- `docs/concepts/createPlayer.js` — reference/teaching file, not imported anywhere.
- Markdown docs — unchanged.

---

## 4. Type model (`game/types.ts`)

```ts
// Discriminated union on `type` field
export type LocationType =
  | "start" | "property" | "railroad" | "utility"
  | "tax" | "chance" | "community-chest"
  | "jail" | "go-to-jail" | "free-parking";

export type PropertyColor =
  | "dark-purple" | "light-blue" | "purple" | "orange"
  | "red" | "yellow" | "green" | "dark-blue";

export interface StartLocation          { id: number; name: string; type: "start" }
export interface JailLocation           { id: number; name: string; type: "jail" }
export interface GoToJailLocation       { id: number; name: string; type: "go-to-jail" }
export interface FreeParkingLocation    { id: number; name: string; type: "free-parking" }
export interface ChanceLocation         { id: number; name: string; type: "chance" }
export interface CommunityChestLocation { id: number; name: string; type: "community-chest" }
export interface TaxLocation            { id: number; name: string; type: "tax"; amount: number }

export interface PropertyLocation {
  id: number; name: string; type: "property";
  color: PropertyColor;
  price: number; rent: number;
  ownerId: number | null;
  houses: number;
  hasHotel: boolean;
}
export interface RailroadLocation {
  id: number; name: string; type: "railroad";
  price: number; rent: number;
  ownerId: number | null;
}
export interface UtilityLocation {
  id: number; name: string; type: "utility";
  price: number;
  ownerId: number | null;
}

export type BoardLocation =
  | StartLocation | JailLocation | GoToJailLocation | FreeParkingLocation
  | ChanceLocation | CommunityChestLocation | TaxLocation
  | PropertyLocation | RailroadLocation | UtilityLocation;

export type OwnableLocation = PropertyLocation | RailroadLocation | UtilityLocation;
export type Board = BoardLocation[];

export function isOwnableLocation(tile: BoardLocation): tile is OwnableLocation {
  return tile.type === "property"
      || tile.type === "railroad"
      || tile.type === "utility";
}

export interface Player {
  id: number;
  name: string;
  position: number;
  money: number;
  propertyIds: number[];
  isBankrupt: boolean;
  isInJail: boolean;
  failedJailRolls: number;
}

export interface DiceRoll {
  dice1: number;
  dice2: number;
  total: number;
  isDouble: boolean;
}

export interface Game {
  players: Player[];
  board: Board;
  rollDice: () => DiceRoll;
  currentPlayerId: number | null;
  lastRoll: DiceRoll | null;
  currentPlayer(): Player | null;
  getActivePlayers(): Player[];
  countActivePlayers(): number;
  nextActivePlayer(): Player | false;
}

export interface JailResult {
  canMove: boolean;
  roll: DiceRoll | null;
  usedJailRoll: boolean;
}

export type TestPlayerInput = {
  name: string;
  position?: number;
  money?: number;
  propertyIds?: number[];
};
```

### Where `isOwnableLocation` will be used
Review correctly flagged that discriminated unions will affect multiple call sites. Concrete sites needing narrowing:
- [game/rules/locationRules.js](game/rules/locationRules.js) — `_handleBuyProperty`, `_handlePayRent` access `tile.price` / `tile.ownerId` / `tile.rent`.
- [game/rules/locationRules.js](game/rules/locationRules.js) — `_releasePlayerProperties` iterates `game.board` setting `tile.ownerId = null`.
- [game/rules/jailRules.js](game/rules/jailRules.js) — `markPlayerBankrupt` does the same iteration.
- [tests/helpers/createTestGame.js](tests/helpers/createTestGame.js) — sets `location.ownerId = player.id` after `board.find(...)`.

Strategy: call `isOwnableLocation(tile)` to narrow before any `ownerId` / `price` / `rent` access. Existing runtime guards (`tile && tile.price && ...`) collapse into the type predicate.

---

## 5. Tooling

### New: `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["game/**/*.ts", "tests/**/*.ts", "index.ts"]
}
```
(`noEmit: true` because runtime is `tsx`. `types: ["node"]` to pick up `node:test` / `node:assert` types from `@types/node`.)

### Updated: `package.json`
```json
{
  "name": "monopoly-js",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start":     "tsx index.ts",
    "test":      "tsx --test tests/**/*.test.ts",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0"
  }
}
```

### No `.gitignore` change required — no `dist/`.

---

## 6. Conversion sequence — connected slices (per review)

Instead of leaves-first, we migrate in self-contained slices so every commit leaves `npm test` green.

**Phase 0 — Sanity check** *(commit: "TS setup and runtime sanity check")*
1. Install `typescript`, `tsx`, `@types/node` as devDeps.
2. Add `tsconfig.json`.
3. Create a throwaway `scratch.ts` that imports from an existing `.js` file, run `tsx scratch.ts`, verify it executes. Delete scratch.
4. Add scripts (`start`, `test`, `typecheck`) but keep pointing at `.js` for now (or leave existing scripts untouched — phase 5 will flip them).
5. Run `npm test` — must still be 63/63.

**Phase 1 — Types foundation** *(commit: "Add domain type definitions")*
6. Create `game/types.ts` with all interfaces + `isOwnableLocation`.
7. Run `npx tsc --noEmit` — no errors (it's just type definitions).
8. Tests still green (nothing imports yet).

**Phase 2 — Pure utilities slice** *(commit: "Convert pure utilities to TypeScript")*
9. Rename + type:
   - `game/rollDice.js` → `.ts` — returns `DiceRoll`.
   - `game/createPlayers.js` → `.ts` — `(names: string[]) => Player[]`.
   - `game/showIntro.js` → `.ts` — `(players: Player[]) => void`.
   - `game/showSummary.js` → `.ts` — `(players: Player[]) => void`.
10. Update the corresponding test files (rename + import tweaks).
11. `npm test` green; `npm run typecheck` green.

**Phase 3 — Board + rules slice** *(commit: "Convert board and rules modules to TypeScript")*
12. `game/createBoard.js` → `.ts` — returns `Board`. Internal `board` array typed as seed array of tile defs (use `satisfies` to preserve narrow literal types).
13. `game/rules/jailRules.js` → `.ts`:
    - exported `jailRules(game: Game): JailResult`, `sendCurrentPlayerToJail(game: Game): void`.
    - module-local `releasePlayerFromJail` and `markPlayerBankrupt` stay unexported functions.
14. `game/rules/locationRules.js` → `.ts`:
    - Per choice G3: extract all `_*` methods to module-level non-exported functions `handleGoToJail`, `handleTaxLocations`, `handleBuyProperty`, `handlePayRent`, `markBankruptIfNeeded`, `releasePlayerProperties`.
    - Export remains as `locationRules` object with just `handle(game: Game): void` method — keeps the public API stable so `movePlayer` doesn't change.
    - Use `isOwnableLocation` in `handleBuyProperty` / `handlePayRent` / `releasePlayerProperties`.
15. Rename tests: `createBoard.test.ts`, `jailRules.test.ts`, `locationRules.test.ts`.
16. `npm test` green; `npm run typecheck` green.

**Phase 4 — Game assembly slice** *(commit: "Convert game orchestration to TypeScript")*
17. `game/createGame.js` → `.ts` — `(playerNames: string[]) => Game`.
18. `game/movePlayer.js` → `.ts` — `(game: Game, steps: number) => void`.
19. `game/playRound.js` → `.ts` — `(game: Game) => void`; internal `executePlayerTurn` is a non-exported function.
20. Update tests: `createGame.test.ts`, `movePlayer.test.ts`, `playRound.test.ts`.
21. Update `tests/helpers/createTestGame.js` → `.ts` — `(input: TestPlayerInput[]) => Game`, uses `isOwnableLocation` for the property-assignment loop.
22. Update `tests/helpers/createTestGame.test.ts`.
23. `npm test` green; `npm run typecheck` green.

**Phase 5 — Entry point + script flip** *(commit: "Convert entry point and switch runtime to tsx")*
24. `index.js` → `index.ts`.
25. Update `package.json` scripts to `tsx`-based commands.
26. Delete any leftover `.js` files and confirm nothing references them.
27. Run `npm start` — game runs, intro + summary visible.
28. `npm test` green; `npm run typecheck` green.

**Phase 6 — Cleanup** *(commit: "Remove redundant JSDoc and finalize docs")*
29. Remove JSDoc type annotations that are now duplicated by real TS types (keep JSDoc that describes *intent* or *examples*, drop the `@type` / `@param` type tags).
30. Final `npm test` + `npm run typecheck`.

---

## 7. Verification

After each phase:
- `npm test` → **63/63 passing** (unchanged).
- `npm run typecheck` → zero errors.

After phase 5:
- `npm start` → game runs to completion, intro + summary render normally.

Manual spot-checks (if time permits):
- Land on Go-To-Jail (tile 30) — player sent to jail.
- Opponent owning 2 railroads — rent = $50.
- Land on Luxury Tax — `money -= 100`.

---

## 8. Risks

- **Board seed array typing.** The inline `board` literal in `createBoard.js` mixes all 10 tile variants. Fix: use `satisfies readonly BoardLocation[]` so each literal is still narrowed to its specific variant but the whole array is validated against the union.
- **`nextActivePlayer(): Player | false`** — awkward but preserved. Call sites like `playRound` already handle the `!currentPlayer` case.
- **`tile.rent` on `PropertyLocation` vs `UtilityLocation`** — `UtilityLocation` has no `rent`; `_handlePayRent` already branches on `tile.type === "utility"` before accessing `rent`, so TS narrowing will match the runtime logic.

---

## 9. Out of scope (explicitly, per user)

- Branded `PlayerId` / `LocationId` types.
- Negative-money / bankruptcy modeling changes.
- ESLint + `@typescript-eslint` + Prettier (user will add later).
- Class-based `Game` refactor.
- Compile-to-`dist/` packaging (current runtime stays `tsx`-driven).
