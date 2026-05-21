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
   - Prevent building on a set if any street in that color set is mortgaged
   - Charge rent using the building level on the landed street
3. Use one simple deterministic strategy
   - Run the building check once at the end of the current player's turn
   - When the player has less than $350, they can't buy a house in that turn.
   - When the player has at least than $350 up to 500, they can buy only one house unless they go below the $300 reserve
   - When the player has more than equal $500 cash, they should spend $200 on buildings and buy more than one house on cheaper streets or one house or more expensive streets: eg, 4x $50 or 2x $100 or 1x $150 or 1x $200.
   - When the player has more than or equal to $1000 cash, they should spend up to $450 on buildings and buy more than one house: 9x $50, 4x $100, 3x $150, 2x $200.
   - Player can buy a building only when he keeps at reserve $300 cash after the transaction
4. Location selection 
   - Choose the first complete set in board order
   - Within that set, choose the eligible street with the lowest building level.
   - Build houses and hotels evenly within the color set - see Monopoly original rules
   - When a player owns more than one complete and unmortgaged color set, they keep buying legal buildings on other owned color sets until the spend cap or reserve rule stops further building
   - If every street in the set has four houses, upgrade the first eligible street to a hotel by replacing its four houses
4. Extend the board data only where needed
   - Keep using `houses` and `hasHotel` on street tiles
   - Add per-street `houseCost` and the full rent ladder needed for rent calculation
   - Keep railroad and utility tiles unchanged
5. Add focused tests for building and renting
   - Cover at least one 2-street monopoly and one 3-street monopoly
   - Verify reserve checks, mortgage blocking, even building, house rent, and hotel rent

# Acceptance Criteria

- [ ] A player who owns a full street color set can buy more than one legal house at the end of their turn when the turn spend cap and `$300` reserve both allow it.
- [ ] When the player has more than `$500` cash, they spend up to `$200` on legal house purchases for the chosen set.
- [ ] When the player has more than `$1000` cash, they spend up to `$450` on legal house purchases for the chosen set.
- [ ] Multiple house purchases in the same turn still follow even-building rules after each individual purchase.
- [ ] Building stops as soon as the next legal purchase would exceed the turn spend cap or drop the player below the `$300` cash reserve.
- [ ] Building is blocked when the player would fall below the `$300` cash reserve after paying the building cost.
- [ ] Building is blocked for any set that contains a mortgaged street.
- [ ] Houses are built evenly across the set.
- [ ] A hotel can be bought only after every street in the set has four houses.
- [ ] Street rent uses the correct value for 1, 2, 3, or 4 houses and for a hotel.
- [ ] Railroads and utilities cannot receive buildings.
- [ ] Tests cover the new building rules and rent calculations.

# Suggested Additional Tests

- [ ] A player with a cheap monopoly and more than `$500` cash buys multiple houses in one turn until the `$200` spend cap is reached.
- [ ] A player with more than `$1000` cash buys multiple houses in one turn until the `$450` spend cap is reached.
- [ ] Multiple purchases in one turn still rotate across the set in even-building order.

# Notes

- Start from the current turn flow and add one local post-turn hook rather than a free-form action phase.
- Keep the first implementation deterministic so tests can assert exact tile choice and cash totals.
- If the existing board data is missing rent ladders or building cost values, expand the board definition as part of this issue.
