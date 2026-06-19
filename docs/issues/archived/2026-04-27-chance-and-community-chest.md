Chance and Community Chest cards

The board already contains `Chance` and `Community Chest` tiles, and the project data model already lists the card types. The engine still does not resolve those spaces, which means the simulation cannot represent a full Monopoly match.

Implement support for drawing and resolving Chance and Community Chest cards.

1. Add deck handling for both card types
  - `Chance` spaces draw from the Chance deck
  - `Community Chest` spaces draw from the Community Chest deck
  - After a normal card is resolved, it goes to the bottom of its deck
  - `Get Out of Jail Free` cards are kept by the player until used or transferred in a future task
2. Support the card actions already described in the project data model
  - advance to a named location, including collecting `$200` when passing `Go` if the card allows it
  - move to nearest railroad or utility with the special rent rules from the card
  - collect money from the bank
  - pay money to the bank
  - collect money from other players
  - pay money to other players
  - go back 3 spaces and then resolve the landed space
  - go directly to jail without collecting `$200`
  - property or street repair payments based on houses and hotels when those buildings exist
3. Preserve reusable card state in the engine
  - The game state must know which player currently owns a `Get Out of Jail Free` card
  - A used `Get Out of Jail Free` card returns to the bottom of the correct deck
4. Add clear tests for the main card categories
  - Tests should verify deck order, movement, payments, jail effects, and retained cards

# Acceptance Criteria

- [ ] Landing on `Chance` draws and resolves the top Chance card.
- [ ] Landing on `Community Chest` draws and resolves the top Community Chest card.
- [ ] Normal cards return to the bottom of the deck after use.
- [ ] `Get Out of Jail Free` cards stay with the player until used.
- [ ] Advance cards correctly handle passing `Go`.
- [ ] Railroad and utility movement cards apply their special payment rules.
- [ ] `Go to Jail` cards move the player directly to jail without paying `$200`.
- [ ] Payment cards transfer money to or from the bank or other players as described.

# Notes

- Use `docs/concepts/Monopoly - Data Model.md` and `docs/concepts/createChanceCardDeck.js` as the source for the card catalog.
   - [repository "/docs/concepts" folder](/martyna-boruslawska/Monopoly/tree/main/docs/concepts)
- Implement reusable class `Deck` - to manage card order, drawing and returning cards for both Chance and Community Chest.
- Keep the implementation compatible with the simulation history work so card draws and effects can be replayed.
- Houses and hotels are not implemented yet. Write the repair-card tests first and decide whether to defer full resolution behind a documented placeholder.
