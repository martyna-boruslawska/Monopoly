Goal: production-quality codebase where the type system prevents bad state at construction time, not just at test time. Four techniques, applied in phases
so each phase leaves npm test green.

---

Technique Overview

| Phase | Technique | Risk | Behavioral change |
|---|---|---|---|
| 1 | Branded Types | Low | None |
| 2 | Value Objects | Medium | None |
| 3 | Readonly + Copy-on-Write | High | None |
| 4 | Result\<T,E\> | Medium | None (still 63 tests) |

---

# Phase 1 — Branded Types

What: Prevent PlayerId, LocationId, Money from being accidentally mixed at compile time.

New types in game/types.ts:

```ts
export type PlayerId   = number & { readonly __brand: 'PlayerId' };
export type LocationId = number & { readonly __brand: 'LocationId' };
export type Money      = number & { readonly __brand: 'Money' };
export type DiceValue  = 1 | 2 | 3 | 4 | 5 | 6;
``

Brand helper (keeps call sites clean):

```ts
export const brand = {
 playerId:   (n: number) => n as PlayerId,
 locationId: (n: number) => n as LocationId,
 money:      (n: number) => n as Money,
};
```

Updated interfaces:
- Player.id: PlayerId, Player.money: Money, Player.propertyIds: LocationId[]
- BoardLocation.id: LocationId
- OwnableLocation.price: Money, OwnableLocation.ownerId: PlayerId | null
- TaxLocation.amount: Money
- DiceRoll.dice1: DiceValue, DiceRoll.dice2: DiceValue

Creation sites (only place casts appear):
- game/createPlayers.ts — brand player id and starting money: brand.money(1500)
- game/createBoard.ts — brand each tile id, price, amount
- game/rollDice.ts — brand dice values

No behavioral change — branded types are structural at runtime; all arithmetic still works.

Files to modify: game/types.ts, game/createPlayers.ts, game/createBoard.ts, game/rollDice.ts, game/rules/locationRules.ts, game/rules/jailRules.ts,
tests/helpers/createTestGame.ts

---

# Phase 2 — Value Objects

What: Encapsulate invariants in objects so illegal values cannot be constructed.

2a. BoardPosition (replaces bare number position)

```ts
export class BoardPosition {
 private constructor(readonly value: number) {}
 static of(n: number): BoardPosition {
   if (n < 0 || n > 39) throw new Error(`Invalid board position: ${n}`);
   return new BoardPosition(n);
 }
 advance(steps: number): BoardPosition {
   return new BoardPosition((this.value + steps) % 40);
 }
 equals(other: BoardPosition): boolean {
   return this.value === other.value;
 }
}
```

Update Player.position: BoardPosition.
Update game/movePlayer.ts to use player.position.advance(steps).
Update all tile lookups to use game.board[player.position.value].

2b. JailState (replaces isInJail + failedJailRolls)

```ts
export interface JailState {
 readonly isInJail: boolean;
 readonly failedRolls: number;
}
export const JailState = {
 free:          (): JailState => ({ isInJail: false, failedRolls: 0 }),
 jailed:        (): JailState => ({ isInJail: true, failedRolls: 0 }),
 incrementRolls:(s: JailState): JailState => ({ ...s, failedRolls: s.failedRolls + 1 }),
};
```

Update Player to use jail: JailState (remove isInJail and failedJailRolls fields).
Update game/rules/jailRules.ts to use JailState.* factory methods.

Files to modify: game/types.ts, game/createPlayers.ts, game/movePlayer.ts, game/rules/jailRules.ts, game/rules/locationRules.ts,
tests/helpers/createTestGame.ts, all test files that reference position, isInJail, or failedJailRolls

---

# Phase 3 — Readonly + Copy-on-Write

What: Add readonly to all entity fields. Mutations become explicit spread-based updates. Makes data flow visible and prevents accidental aliasing.

Updated interfaces:

```ts
export interface Player {
 readonly id: PlayerId;
 readonly name: string;
 readonly position: BoardPosition;
 readonly money: Money;
 readonly propertyIds: readonly LocationId[];
 readonly isBankrupt: boolean;
 readonly jail: JailState;
}

export type Board = readonly BoardLocation[];
// (each BoardLocation variant gets all-readonly fields too)

export interface Game {
 readonly players: readonly Player[];
 readonly board: Board;
 readonly rollDice: () => DiceRoll;
 readonly currentPlayerId: PlayerId | null;
 readonly lastRoll: DiceRoll | null;
 currentPlayer(): Player | null;
 getActivePlayers(): Player[];
 countActivePlayers(): number;
 nextActivePlayer(): Player | false;
}
```

Mutation pattern — copy-on-write:

```ts
// Before (locationRules.ts)
player.money -= rent;

// After (returns updated Player)
const updated: Player = { ...player, money: (player.money - rent) as Money };
```

Functions that previously mutated will now return updated values:
- jailRules.ts → return { player: Player, board: Board }
- locationRules.ts → handle(game)→ returns{ player: Player; board: Board }`
- movePlayer.ts → returns Player
- playRound.ts assembles all returned values into a new Game snapshot

Creating updated Game:

```ts
// playRound.ts — reassemble game after each step
function withPlayer(game: Game, updated: Player): Game {
 return {
   ...game,
   players: game.players.map(p => p.id === updated.id ? updated : p)
 };
}
```

Files to modify: game/types.ts, game/createGame.ts, game/movePlayer.ts, game/playRound.ts, game/rules/locationRules.ts, game/rules/jailRules.ts,
tests/helpers/createTestGame.ts

---

# Phase 4 — Result<T,E> Errors

What: Replace silent returns (early-return on insufficient funds, silent no-ops) with explicit typed errors. Call sites must acknowledge failure paths.

Error type:

```ts
export type GameError =
 | 'InsufficientFunds'
 | 'PlayerBankrupt'
 | 'JailEscapeFailed'
 | 'PropertyAlreadyOwned';

export type Result<T, E = GameError> =
 | { ok: true;  value: T }
 | { ok: false; error: E };

export const ok   = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const fail = <E>(error: E): Result<never, E> => ({ ok: false, error });
```

Updated signatures:

```ts
// locationRules.ts
export function handleBuyProperty(
 game: Game, player: Player, tile: OwnableLocation
): Result<{ player: Player; board: Board }>;

// jailRules.ts
export function attemptJailEscape(game: Game): Result<JailResult>;

playRound.ts — handles results:
const result = handleBuyProperty(game, player, tile);
if (!result.ok) {
 // log or skip — explicit, not silent
 console.log(`Cannot buy: ${result.error}`);
} else {
 game = withPlayer(withBoard(game, result.value.board), result.value.player);
}
```

Tests get richer assertions:

```ts
// Before
assert.equal(player.money, 1300);  // was rent paid?

// After (also works)
const result = handlePayRent(game, player, tile);
assert.ok(result.ok);
assert.equal(result.value.player.money, brand.money(1300));
```

Files to modify: `game/types.ts`, `game/rules/locationRules.ts`, `game/rules/jailRules.ts`, `game/playRound.ts`, relevant test files

---

Critical Files

| File | Change |
|---|---|
| game/types.ts | All phases — branded types, Value Objects, readonly, Result |
| game/createPlayers.ts | Brand ids/money, use JailState.free() |
| game/createBoard.ts | Brand ids/prices/amounts |
| game/rollDice.ts | Brand DiceValue (1–6 literal union) |
| game/movePlayer.ts | Return Player, use BoardPosition.advance() |
| game/playRound.ts | Assemble Game from returned values, handle Result |
| game/rules/locationRules.ts | Copy-on-write, return Result |
| game/rules/jailRules.ts | Copy-on-write, return Result |
| game/createGame.ts | Adapt to readonly Game shape |
| tests/helpers/createTestGame.ts | Brand values, use new Player shape |
| tests/*.test.ts | Adapt to BoardPosition.value, jail.isInJail, Result checks |

---
Output artifact

At the start of implementation, create /Users/bogdanpolak/Martyna-Monopoly/DomainHardening.md — a concise record of design decisions made (branded types
strategy, Value Object API, copy-on-write pattern, Result type shape) for future reference.

---
Verification

After each phase:
- npm test → 63/63 passing
- npm run typecheck → zero errors

After all phases:
- Confirm a compile error when assigning player.id to a Money variable
- Confirm BoardPosition.of(40) throws at runtime
- Confirm locationRules.handle() returning a Result is checked at every call site
- npm start → game runs to completion normally
