Issue: Buy houses and hotels for complete street sets

Milestone 1 adds the first building flow for street properties. The current board model already stores `houses` and `hasHotel` on street tiles, and card tests already rely on those fields, but the engine does not yet let players buy buildings or charge building-adjusted rent.

This issue defines a small first version that stays compatible with the current rule engine and test style.

1. Fit the new rules into the current engine
  - Street tiles already track `houses` and `hasHotel` in `createBoard()`
  - Street rent currently uses base rent plus the recently added monopoly double-rent rule for unimproved sets
  - Introduce the smallest possible building decision hook rather than a general action phase
  - Do not implement Bank house or hotel inventory limits in this issue
2. Implement the first building rules
  - Detect when a player owns a full street color set
  - Allow building only on street properties, never on railroads or utilities
  - Allow houses first, then a hotel only after four houses
  - Enforce even building within a color set
  - Prevent building on a set if any street in that set is mortgaged
  - Charge rent using the building level on the landed street
3. Use one simple deterministic strategy
  - Run the building check once at the end of the current player's turn
  - If the player owns at least one complete, unmortgaged street set, try to buy exactly one building
  - Choose the first complete set in board order
  - Within that set, choose the eligible street with the lowest building level
  - Break ties by board position
  - Buy the next legal building only if the player keeps at least `$300` cash after paying the building cost
  - If every street in the set has four houses, upgrade the first eligible street to a hotel by replacing its four houses
4. Extend the board data only where needed
  - Keep using `houses` and `hasHotel` on street tiles
  - Add per-street `houseCost` and the full rent ladder needed for rent calculation
  - Keep railroad and utility tiles unchanged
5. Add focused tests for building and rent
  - Cover at least one 2-street monopoly and one 3-street monopoly
  - Verify reserve checks, mortgage blocking, even building, house rent, and hotel rent

# Acceptance Criteria

[ ] A player who owns a full street color set can buy exactly one legal building at the end of their turn.
[ ] Building is blocked when the player would fall below the `$300` cash reserve after paying the building cost.
[ ] Building is blocked for any set that contains a mortgaged street.
[ ] Houses are built evenly across the set.
[ ] A hotel can be bought only after every street in the set has four houses.
[ ] Street rent uses the correct value for 1, 2, 3, or 4 houses and for a hotel.
[ ] Railroads and utilities cannot receive buildings.

# Notes

- Start from the current turn flow and add one local post-turn hook rather than a free-form action phase.
- Keep the first implementation deterministic so tests can assert exact tile choice and cash totals.
- If the existing board data is missing rent ladders or building cost values, expand the board definition as part of this issue.
- Out of scope: Bank inventory limits, house or hotel scarcity auctions, selling buildings, and human prompts.
