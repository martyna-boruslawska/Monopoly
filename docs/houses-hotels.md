Issue: Buy houses and hotels for complete street sets

Milestone 1 adds the first building flow for street properties. The current board model already stores `houses` and `hasHotel` on street tiles, and card tests already rely on those fields, but the engine does not yet let players buy buildings or charge building-adjusted rent.

This issue defines a small first version that stays compatible with the current rule engine and test style.

## Current Project Fit

- Street tiles already track `houses` and `hasHotel` in `createBoard()`.
- Street rent currently uses base rent plus the recently added monopoly double-rent rule for unimproved sets.
- There is no strategy abstraction yet, so this issue should introduce the smallest possible building decision hook.
- The first version should avoid Bank inventory limits and cross-player building auctions for scarce houses or hotels.

## Scope

Implement only these building rules in V1:

1. Detect when a player owns a full street color set.
2. Allow building only on street properties, never on railroads or utilities.
3. Allow houses first, then a hotel after four houses.
4. Enforce even building within a color set.
5. Prevent building on a set if any street in that set is mortgaged.
6. Charge rent using the building level on the landed street.

Out of scope for this issue:

- Bank house and hotel inventory limits
- Auctions for scarce houses or hotels
- Human choices or prompts
- Selling buildings
- Building at arbitrary times outside the chosen engine hook

## Simple Strategy

Use one deterministic building strategy for all players in this milestone:

- Run the building check once at the end of the current player's turn.
- If the player owns at least one complete, unmortgaged street set, try to buy exactly one building.
- Choose the first complete set in board order.
- Within that set, choose the eligible street with the lowest building level.
- Break ties by board position.
- Buy the next legal building only if the player keeps at least $300 cash after paying the building cost.
- If every street in the set has four houses, upgrade the first eligible street to a hotel by replacing its four houses.

This issue does not require multiple strategy profiles. It only creates one baseline rule so later computer-player profiles can override it.

## Data Model

Add only the minimum building data needed for deterministic rules:

- Keep using `houses` and `hasHotel` on street tiles.
- Add per-street `houseCost` and the full rent ladder needed for rent calculation.
- Keep railroad and utility tiles unchanged.

Prefer enriching the board definition directly from the existing property reference document instead of adding a second rent source.

## Acceptance Criteria

[ ] A player who owns a full street color set can buy exactly one legal building at the end of their turn.
[ ] Building is blocked when the player would fall below the $300 cash reserve after paying the building cost.
[ ] Building is blocked for any set that contains a mortgaged street.
[ ] Houses are built evenly across the set.
[ ] A hotel can be bought only after every street in the set has four houses.
[ ] Street rent uses the correct value for 1, 2, 3, or 4 houses and for a hotel.
[ ] Railroads and utilities cannot receive buildings.

## Suggested Tests

1. End-of-turn building on a 2-street monopoly buys one house on the first eligible street.
2. End-of-turn building on a 3-street monopoly respects even-building rules across the set.
3. A player with insufficient post-purchase reserve does not build.
4. A mortgaged street in the set blocks building.
5. Landing on a street with houses charges the house rent.
6. Landing on a street with a hotel charges hotel rent.

## Notes

- Start from the current turn flow and add one local post-turn hook rather than a free-form action phase.
- Keep the first implementation deterministic so tests can assert exact tile choice and cash totals.
- If the existing board data is missing rent ladders or building cost values, expand the board definition as part of this issue.
