# Homework: Add bankruptcy handling and skip bankrupt players

Start using the existing `isBankrupt` field in the player model so negative-balance players affect the game flow.

# Description

The player shape already contains `isBankrupt`, and the summary already distinguishes players with debt, but the main game flow does not react to bankruptcy at all.

Implement a simple first version:

- if a player’s money drops below `0`, mark them as bankrupt
- bankrupt players are skipped in later rounds
- their owned properties return to the bank

# Scope

1. Add a small bankruptcy check after money-changing actions.
2. Update the player state:
   - set `isBankrupt = true` when `money < 0`
3. Free all owned properties for a bankrupt player:
   - set matching board tile `ownerId` values back to `null`
   - clear `player.propertyIds`
4. Update `game/playRound.js` so bankrupt players are skipped.

# Acceptance Criteria

- A player with negative money is marked as bankrupt.
- Bankrupt players do not take future turns.
- Properties owned by a bankrupt player become unowned again.
- The game does not crash when a bankrupt player remains in the players array.

# Notes

- Keep the scope simple.
- Do not remove the player from the `players` array in this issue.
- Do not transfer properties to a creditor in this issue.

# Suggested Tests

- Paying tax that drops money below `0` marks the player as bankrupt.
- A bankrupt player’s properties are released.
- `playRound()` skips a player whose `isBankrupt` is already `true`.
