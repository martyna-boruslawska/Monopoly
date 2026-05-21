Issue: Mortgage and unmortgage properties

Milestone 1 needs mortgage support so the engine can model asset management before full bankruptcy handling is expanded. The first version should work with the current player model, current rent handlers, and the existing flat Node test suite.

1. Add mortgage state to purchasable tiles
  - Purchasable tiles currently store `ownerId` but no mortgage state
  - Add `isMortgaged: false` to every purchasable tile
  - Add `mortgageValue` to purchasable tiles
  - Add `unmortgageCost` only if it keeps tests clearer than computing value plus 10% at runtime
2. Implement mortgage and unmortgage rules
  - A player may mortgage an owned property to receive cash from the Bank
  - A street may be mortgaged only if its color set has no houses or hotel
  - Mortgaged properties do not charge rent
  - Unmortgaged streets in a full color set still qualify for doubled unimproved rent even if another street in the set is mortgaged
  - Railroads and utilities continue to use their normal count-based rent rules, but mortgaged tiles themselves do not collect rent
  - A player may unmortgage an owned property by paying mortgage value plus 10% interest
3. Use one simple deterministic mortgage strategy
  - Only mortgage when the current player owes money and does not have enough cash to pay immediately
  - Mortgage one property at a time until the player can cover the current debt
  - Mortgage order: utilities, railroads, street properties outside complete sets, then street properties in complete sets only if the full set has no buildings
  - Within each category, choose the cheapest eligible property first
  - Never unmortgage automatically during this issue
4. Keep the implementation local to the current engine
  - Street tiles already have building state, which interacts with mortgage rules
  - Enforce mortgage behavior in the existing rent handlers instead of building a second rent path
  - The current engine has no explicit debt-resolution workflow beyond immediate money transfer and bankruptcy checks
  - Avoid introducing a general action queue or a broad debt workflow redesign in this issue
5. Add focused mortgage tests
  - Mortgaging a single owned utility adds the correct cash and marks it mortgaged
  - Attempting to mortgage a street in a developed set is rejected
  - A mortgaged railroad does not charge railroad rent
  - A mortgaged utility does not charge utility rent
  - A mortgaged street does not charge rent
  - An unmortgaged partner street in the same monopoly still charges doubled unimproved rent
  - Debt resolution mortgages the cheapest eligible properties until the amount due can be paid

# Acceptance Criteria

[ ] A player can mortgage an owned eligible property and receive its mortgage value from the Bank.
[ ] Street properties with houses or a hotel in their color set cannot be mortgaged.
[ ] Landing on a mortgaged street, railroad, or utility does not charge rent.
[ ] Unmortgaged streets in a monopoly still charge doubled unimproved rent when another street in the set is mortgaged.
[ ] A player can unmortgage an owned property by paying mortgage value plus 10% interest.
[ ] The simple mortgage strategy raises enough cash to satisfy a debt when eligible assets exist.

# Notes

- Keep the first implementation local to ownership, rent, and debt-payment code paths.
- Use explicit tests to pin the mortgage ordering rules before refactoring any payment logic.
- Out of scope: bankruptcy-transfer mortgage choices, selling buildings for half price, partial interest rules by edition, human prompts or debt negotiation, and proactive mortgaging to fund building.
