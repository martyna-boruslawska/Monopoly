Issue: Double street rent for complete color sets

In Monopoly, owning every street in a color set creates a monopoly. When a street in that full set has no houses or hotel, its base rent is doubled. The current engine charges printed rent, but it does not yet increase street rent when the owner holds the full color group.

Implement doubled unimproved rent for complete color sets.

1. Detect complete ownership of a color set
  - Brown and dark blue sets have 2 street properties
  - All other street color sets have 3 street properties
  - Railroads and utilities are not part of this rule
2. Apply the doubled-rent rule to unimproved streets
  - When a player lands on another player's street property and that owner holds the full color set, charge `2 x base rent`
  - Only apply this rule when the street has no houses and no hotel
3. Keep ownership checks explicit
  - The same owner must hold every street in the color set
  - Landing on your own property still does not charge rent
4. Add tests for both 2-property and 3-property sets
  - At least one test should cover a 2-street monopoly
  - At least one test should cover a 3-street monopoly
  - At least one test should prove that partial ownership keeps the normal rent

# Acceptance Criteria

[ ] Owning both properties in a 2-street color set doubles unimproved rent.
[ ] Owning all three properties in a 3-street color set doubles unimproved rent.
[ ] Partial ownership of a color set does not change the normal rent.
[ ] Railroads and utilities are not affected by this rule.
[ ] Landing on your own property still does not charge rent.

# Notes

- Start from the existing street rent path and keep the change local to property-rent logic.
- This issue covers only unimproved monopoly rent. House, hotel, and mortgage interactions belong to later issues.
- Use tests to document the expected color-set ownership behavior before changing the rent calculation.