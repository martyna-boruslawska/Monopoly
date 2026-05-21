Homework: Go to jail after three doubles in one turn

The official Monopoly rules send a player directly to jail if they roll doubles three consecutive times in the same turn. The current implementation gives extra turns for doubles, but it does not yet enforce the jail rule after the third doubles roll.

Implement the three-doubles jail rule.

1. Detect three consecutive doubles during one turn
  - Count doubles only within the active player's current turn
  - Normal turn changes reset the counter
2. Send the player directly to jail after the third doubles roll
  - The player moves to the jail tile immediately
  - The player does not resolve the landing space from the third roll
  - The player does not collect `$200` for passing `Go` as part of that forced move to jail
  - The turn ends immediately after the player is sent to jail
3. Keep the rule compatible with existing jail logic
  - The player should enter the same jail state used by the existing `Go To Jail` support
  - Future turns should continue through the normal jail exit rules
4. Add logging and tests
  - Log a clear message that the player rolled doubles three times and was sent to jail
  - Test that the third doubles roll ends the turn and sends the player to jail

# Acceptance Criteria

[ ] A player who rolls doubles once still gets another roll.
[ ] A player who rolls doubles twice still gets another roll.
[ ] A player who rolls doubles three times in the same turn is sent directly to jail.
[ ] The third doubles roll does not also resolve the landed tile.
[ ] The forced move to jail does not award `$200` for passing `Go`.
[ ] The player's turn ends immediately after being sent to jail.

# Notes

- Start from `game/playRound.js` and reuse the jail state handling already added in `game/rules/jailRules.js`.
- This issue is different from the existing jail ticket about leaving jail after failed doubles attempts.
- Write a focused turn-level test that controls the dice sequence.