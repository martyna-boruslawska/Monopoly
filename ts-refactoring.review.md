# TypeScript Refactoring Plan Review

Date: 2026-04-18
Reviewed file: `ts-refactoring.md`

## Verdict

The plan is directionally sound, but it has one blocking runtime mismatch and several under-scoped migration details.

The biggest issue is that the recommended combination of native Node type-stripping and `.js` import specifiers is not valid in the current environment. That recommendation should be changed before any conversion work starts.

## Validated Baseline

- Current environment: Node `v22.22.0`
- Current test baseline: `npm test` passes with `63/63` tests green
- Existing project runtime is direct source execution via `node index.js` and `node --test`

## Findings

### 1. Blocking mismatch: A1 + E1 does not work as written

The plan recommends:

- A1: native Node type-stripping
- E1: keep `.js` suffixes in source imports after renaming files to `.ts`

That combination fails under the current Node runtime.

Observed behavior:

- `node --experimental-strip-types b.ts` works with `.ts` files
- but `import "./a.js"` from `b.ts` does not resolve to `a.ts`
- Node looks for a real `a.js` file and throws `ERR_MODULE_NOT_FOUND`

Implication:

- If the project uses native Node type-stripping, source imports must use `.ts` specifiers, not `.js`
- If the project wants `.js` specifiers in source, it should use `tsx` or compile with `tsc`

### 2. Migration sequencing is too optimistic for a no-build project

The plan suggests renaming leaves first and progressing through the graph.

That is risky in this repository because:

- the project runs directly from source
- imports are ESM and extension-sensitive
- partial conversion can easily break runtime resolution mid-migration

Safer alternatives:

- convert one connected module slice at a time
- or add temporary compatibility wrappers during the transition
- or choose a runtime that tolerates `.ts` imports cleanly from the start

### 3. Strict discriminated unions will affect more code than the plan states

The plan correctly recommends a discriminated union for board locations, but it understates the impact.

Current code accesses `ownerId` across mixed tile types in several places, including:

- `game/rules/locationRules.js`
- `game/rules/jailRules.js`
- `tests/helpers/createTestGame.js`

Under `strict`, these sites will need one of:

- an `isOwnableLocation(tile)` type guard
- a shared ownable base type
- or broader narrowing before accessing `ownerId`

This should be explicitly added to the plan.

### 4. Tooling guardrails are missing

If the project keeps native Node type-stripping, the plan should also add:

- a Node engine floor in `package.json`
- explicit guidance on `import type` usage
- a phase-zero sanity check proving the chosen TS runtime works before mass renames begin

Without that, the project may commit to a strategy that only fails after many files are renamed.

### 5. The inventory in the plan is not fully pressure-tested

The production file count in the plan is incorrect.

- It says `Production (9 files)`
- but the list contains 11 files

This is minor, but it suggests the migration inventory should be rechecked before execution.

## What Holds Up Well

The following recommendations in the plan are still solid:

- keep the `Game` factory instead of converting to a class
- convert tests along with production code
- centralize domain types in one file
- use discriminated unions for board locations
- preserve behavior and avoid structural rewrites during the TS migration

## Recommended Alternatives

### Option 1. Recommended practical path: use `tsx`

Why this is the safest choice here:

- no build output to manage
- less friction than compile-first ESM
- avoids the native Node `.js`/`.ts` resolution trap
- fits the current educational, direct-run setup

### Option 2. Recommended pure-Node path: keep native strip-types, but change imports

If native Node type-stripping is preferred, then the plan should be updated to:

- use `.ts` import specifiers in source
- enable `allowImportingTsExtensions: true`
- keep `noEmit: true`
- document the minimum supported Node version explicitly

### Option 3. Recommended long-term packaging path: compile with `tsc`

If the goal is stable Node ESM semantics with `.js` specifiers in source, then compile-first is the clean option.

Tradeoff:

- more ceremony
- but fewer runtime surprises

## Changes Needed In The Plan

Before implementation starts, update the plan to include these corrections:

1. Replace the current A1 + E1 recommendation with one of these valid combinations:
   - `tsx` + `.js` or `.ts` strategy chosen consistently
   - native strip-types + `.ts` imports
   - compile-first + `.js` imports
2. Add a phase-zero step:
   - install TypeScript tooling
   - prove a trivial `.ts` module runs
   - prove the chosen typecheck command works
3. Add a stated `isOwnableLocation` guard or equivalent narrowing strategy.
4. Replace the generic “rename leaves first” sequence with “convert one connected module slice at a time”.
5. Add the Node version requirement to `package.json` if native Node execution remains the plan.
6. Fix the scope counts and recheck the migration inventory.

## Suggested Revised Recommendation

For this repository, the most pragmatic path is:

1. Use `tsx` for runtime and tests during the migration.
2. Keep `strict: true`.
3. Keep the discriminated union model.
4. Add an `isOwnableLocation` helper early.
5. Convert one connected slice at a time:
   - types + simple leaf modules
   - rules and movement modules
   - game assembly and entrypoint
   - tests and helper cleanup

This keeps the project close to its current workflow while avoiding the native Node import-resolution pitfall.

## Evidence Used

- Reviewed the current implementation in:
  - `game/createGame.js`
  - `game/movePlayer.js`
  - `game/createBoard.js`
  - `game/createPlayers.js`
  - `game/rules/locationRules.js`
  - `game/rules/jailRules.js`
  - `tests/helpers/createTestGame.js`
  - `package.json`
- Verified current test baseline with `npm test`
- Verified native Node type-stripping behavior with a minimal `.ts` import-resolution experiment