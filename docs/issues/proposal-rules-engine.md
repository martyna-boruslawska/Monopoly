User Story: Introduce Landing Rule Engine

Replace `handleLocations` with a flexible Landing Rule Engine based on `tile.type`

As a developer working on the Monopoly game engine
I want to replace the current `handleLocations` logic with a configurable rule engine stored within the `game` object
So that the game logic becomes more modular, extensible, and easier to maintain and test

# Scope

**In Scope**

* create `landingEngine` inside `game`
* introduce `rulesByTileType`
* implement rule handlers
* refactor `movePlayer.js` to use the engine instead of `handleLocations`
* replace logic from `locationRules.js`
* update unit tests accordingly

**❌ Out of Scope**

* player movement logic redesign
* pre-move / post-move hooks
* UI decisions (e.g. interactive property purchase)
* full event-driven architecture

# Definition of Done

* `handleLocations` removed
* `locationRules.js` replaced or deprecated
* `movePlayer.js` uses `landingEngine`
* all tests passing
* no regression in gameplay behavior
* code reviewed and aligned with project standards

# Acceptance Criteria

1. **Engine integration**
   * `landingEngine` exists inside the `game` object
   * it exposes `execute(game, playerId)`
2. **Replacement of old logic**
   * `handleLocations` / `locationRules.js` is no longer used
   * `movePlayer.js` calls `landingEngine.execute(...)`
3. **Rules mapping**
   * rules are defined via `rulesByTileType`
   * each `tile.type` has corresponding rules
4. **Execution logic**
   * rules are executed sequentially
   * execution can be interrupted (e.g. GO_TO_JAIL)
5. **Compatibility**
   * no structural changes required in `createBoard.js`
   * existing `tile.type` values are reused
6. **Handlers**
   * each rule has a dedicated handler
   * missing handler throws an error
7. **Tests**
   * existing tests in `locationRules.test.js` are updated or replaced
   * rule handlers are unit-testable independently
   * engine execution is testable

---

# Technical Details

The current implementation of handling player landing logic (`handleLocations` / `locationRules.js`) is based on conditional branching (`if/switch`) using `tile.type`.

This logic is tightly coupled with:
* player movement (`movePlayer.js`)
* location rules (`locationRules.js`)
* unit tests (`locationRules.test.js`)

The goal is to introduce a **Landing Rule Engine**, which:
* is stored inside the `game` object
* maps `tile.type` → list of rules
* executes rules sequentially in a defined order when a player lands on a tile
* replaces the existing `handleLocations` logic entirely
* keeps compatibility with existing `board` structure (values of the `tile.type`)
* `landingEngine` should be initialized in `createGame`
* rules should be mapped using `tile.type` (not embedded into board)
* handlers should operate directly on `game` state
* avoid introducing additional global state


# Risk Analysis

1. Tight coupling with `movePlayer.js` - High 🔴
   - Breaking flow of player turns or missing side effects after movement.
   - Mitigation:
2. Hidden logic in `locationRules.js` - High 🔴
   - Business logic may be implicitly coupled (e.g. order of conditions, fallthrough behavior).
   - Impact: Behavior changes after migration (subtle bugs).
   - Mitigation:
      - Migrate logic rule-by-rule (not rewrite)
      - Keep execution order identical
      - Add regression tests before refactor
3. Test fragility (`locationRules.test.js`) - High 🔴
   - Risk: Existing tests likely depend on:
      - function shape
      - internal implementation
   - Impact: Large test breakage after refactor.
   - Mitigation:
      - First: freeze current behavior via tests
      - Then: adapt tests to engine interface
      - Optionally: keep high-level tests unchanged (black-box)
4. Rule execution order dependency - Medium 🟠
   - Risk: Order of rules (e.g. BUY_PROPERTY → PAY_RENT) affects behavior.
   - Impact: Incorrect game logic if order is wrong.
   - Mitigation:
      - Explicit rule ordering in `rulesByTileType`
      - (Optional) introduce `priority`
5. Implicit side effects - Medium 🟠
   - Risk: Some logic may:
      - modify multiple parts of state
      - assume execution context
   - Impact: Difficult debugging after decoupling.
   - Mitigation:
      - Keep handlers small and focused
      - Avoid shared mutable helpers
      - Log rule execution (optional debug mode)
6. Partial migration risk - Medium 🟠
   - Risk: Mix of old (`handleLocations`) and new (engine) logic.
   - Impact: Inconsistent behavior, duplicated logic.
   - Mitigation:
      - Feature flag OR full replacement in one PR
      - Remove old code immediately after migration
7. Board compatibility risk - Low 🟢
   - Risk: Mismatch between `tile.type` and rule definitions.
   - Impact: Missing behavior for some tiles.
   - Mitigation:
      - Reuse existing `tile.type` values
      - Validate mapping completeness (every `tile.type` has rules)
      - Fail fast on missing handler
   - Add validation:
      - every `tile.type` must have rules
      - fail fast on missing mapping
8. Performance - Low 🟢
   - Risk: Additional abstraction layer.
   - Impact: Negligible (small rule sets per tile)
   - Mitigation:
      - No action needed


# Suggested Implementation Steps

1. Add `landingEngine` to `game`
2. Create `rulesByTileType`
3. Implement handlers (copy logic from `locationRules`)
4. Replace usage in `movePlayer.js`
5. Update tests
6. Remove old logic
