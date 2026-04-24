Issue: Mortgage and unmortgage properties

Milestone 1 needs mortgage support so the engine can model asset management before full bankruptcy handling is expanded. The first version should work with the current player model, current rent handlers, and the existing flat Node test suite.

## Current Project Fit

- Purchasable tiles currently store `ownerId` but no mortgage state.
- Street tiles already have building state, which interacts with mortgage rules.
- Rent is resolved by tile-type handlers, so mortgage behavior should be enforced in those handlers instead of bolting on a second rent path.
- The current engine has no explicit debt-resolution workflow beyond immediate money transfer and bankruptcy checks.

## Scope

Implement only these mortgage behaviors in V1:

1. A player may mortgage an owned property to receive cash from the Bank.
2. A street may be mortgaged only if its color set has no houses or hotel.
3. Mortgaged properties do not charge rent.
4. Unmortgaged streets in a full color set still qualify for doubled unimproved rent even if another street in that set is mortgaged.
5. Railroads and utilities continue to use their normal count-based rent rules, but mortgaged tiles themselves do not collect rent.
6. A player may unmortgage an owned property by paying mortgage value plus 10% interest.

Out of scope for this issue:

- Forced mortgage decisions during bankruptcy transfers
- Selling buildings for half price
- Partial interest rules by edition
- Human prompts or negotiation around debt resolution
- Mortgaging property to fund speculative building

## Simple Strategy

Use one deterministic mortgage strategy for all players in this milestone:

- Only mortgage when the current player owes money and does not have enough cash to pay immediately.
- Mortgage one property at a time until the player can cover the current debt.
- Mortgage order:
  1. utilities
  2. railroads
  3. street properties that are not part of a complete set
  4. street properties in complete sets, only if the full set has no buildings
- Within each category, choose the cheapest eligible property first.
- Never unmortgage automatically during this issue.

This keeps the first implementation local to debt resolution. Later strategy work can add proactive mortgaging and unmortgaging behavior.

## Data Model

Add only the minimum data needed:

- Add `isMortgaged: false` to every purchasable tile.
- Add `mortgageValue` to purchasable tiles.
- Add `unmortgageCost` only if it keeps tests clearer than computing value plus 10% at runtime.

## Acceptance Criteria

[ ] A player can mortgage an owned eligible property and receive its mortgage value from the Bank.
[ ] Street properties with houses or a hotel in their color set cannot be mortgaged.
[ ] Landing on a mortgaged street, railroad, or utility does not charge rent.
[ ] Unmortgaged streets in a monopoly still charge doubled unimproved rent when another street in the set is mortgaged.
[ ] A player can unmortgage an owned property by paying mortgage value plus 10% interest.
[ ] The simple mortgage strategy raises enough cash to satisfy a debt when eligible assets exist.

## Suggested Tests

1. Mortgaging a single owned utility adds the correct cash and marks it mortgaged.
2. Attempting to mortgage a street in a developed set is rejected.
3. A mortgaged railroad does not charge railroad rent.
4. A mortgaged utility does not charge utility rent.
5. A mortgaged street does not charge rent.
6. An unmortgaged partner street in the same monopoly still charges doubled unimproved rent.
7. Debt resolution mortgages the cheapest eligible properties until the amount due can be paid.

## Notes

- Keep the first implementation local to ownership, rent, and debt-payment code paths.
- Avoid introducing a general action queue in this issue.
- Use explicit tests to pin the mortgage ordering rules before refactoring any payment logic.
