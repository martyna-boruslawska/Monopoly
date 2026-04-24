Bug: Players in jail incorrectly do not collect rent

The current implementation blocks rent collection when the property owner is in jail. That behavior does not match the official Monopoly rules documented in this repository.

## Verified Problem

Current code in `game/rules/handlers/handlePayRent.js` returns early when the owner has `isInJail === true` and logs:

```js
if (owner.isInJail) {
  console.log(
    `${owner.name} is in jail and cannot collect rent from ${game.currentPlayer().name}.`,
  );
  return;
}
```

The test suite currently reinforces the same incorrect behavior in `tests/jailRules.test.js` with the test:

- `player in jail cannot collect rent`

But the project rule source says the opposite in `docs/concepts/monopoly-rules.md`:

- `While in Jail, a player does not move, but may still buy and sell buildings, join auctions, collect rent, and trade.`

## Expected Behavior

If a player owns a property, railroad, or utility and another player lands on it, rent should still be charged even when the owner is in jail.

## Current Incorrect Behavior

- Street rent is skipped when the owner is in jail.
- Railroad rent is skipped when the owner is in jail.
- Utility rent is skipped when the owner is in jail.
- The game logs an incorrect rules message about jailed owners being unable to collect rent.

## Acceptance Criteria

[ ] A jailed owner still receives rent when another player lands on their street property.
[ ] A jailed owner still receives rent when another player lands on their railroad.
[ ] A jailed owner still receives rent when another player lands on their utility.
[ ] The early return in the shared rent path is removed or replaced so jail status does not suppress rent collection.
[ ] The incorrect test `player in jail cannot collect rent` is replaced with tests proving rent is still collected while the owner is in jail.
[ ] No log message remains that claims jailed owners cannot collect rent.

## Notes

- Keep the change local to the rent path unless a broader rules refactor is already in progress.
- Reuse the same rent calculations that already exist for streets, railroads, and utilities.
- This is a rules-correction bug, not a new feature.