Add core property interactions so players can buy unowned properties, pay rent to owners, and see a game-end summary printed to the console.

# Scope
1. Property buying logic
   - When a player lands on an unowned property tile, call `buyProperty`. Validate if player has money.
   - On success: deduct money, set owner in board tile and add property to player properties.
   - Log the transaction with `console.log`.
   - **Implementation suggestion**: Create new module `game/buyProperty.js` with `buyProperty(player, tile)`.
2. Rent payment logic
   - Deduct `tile.rent` from player and add to owner when landing on an owned property tile.
   - Log the transaction with `console.log`.
3. **End-of-game summary**
   - At the end of the game loop, print a summary with `console.log`:
     - Each player name
     - Emoji: 🏆 = winner, 💰 = has money, ⚠️ = bankrupt (has debt)
     - Money balance
     - Property count and list of property IDs
    - Example output:
       ```text
       =================================
       🏁 Game Summary 🏁
       =================================
       🏆 Max Douglas:    $1820 | 🏠 properties (2): [1, 7]
       💰 Alex:            $540 | 🏠 properties (1): [12]
       ⚠️ Kasia Kowalska:  -$40 | 🏠 properties (0): []
       ```

## Acceptance Criteria
- Players can buy unowned properties and ownership is reflected on both player and board state.
- Players landing on owned properties pay rent to the owner.
- Console logs show purchases and rent payments (use any message format).
- Game does not crash when a player lands on their own property.
- A single end-of-game summary log is displayed after all turns.

## Notes
- Keep logic simple (no bankruptcy rules in this issue).

## Suggested Tests
- Landing on unowned property with enough money buys it.
- Landing on unowned property without enough money does not buy it.
- Landing on owned property transfers rent to the owner.
- End-of-game summary prints once after the last turn.
