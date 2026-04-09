# Homework: Game end and main loop redesign

I want to implement the top-level game loop so the game can finish based on game state instead of always running a hardcoded fixed number of rounds. Game should end when only one active player remains, or when the turns limit is reached.

- Redesign the main application architecture in this issue. Example below shows a possible implementation of the main loop, but you can choose a different architecture if you prefer. Introduce movePlayer function to separate concerns and make the main loop more readable. Introduce or missing game state methods as needed, such as isActive() to check if the game should continue.

## Acceptance Criteria

- The game can stop before the turn limit when only one active player remains.
- The game still stops at the maximum turn limit if multiple active players remain.
- A game over message is printed instead of the summary
   ```
    =================================
    🏁  Game Over 🏁
    =================================
    The winner is **Luke Skywalker** with $1500. Owns 11 properties and 2 houses.
    Places:
      1. Luke Skywalker
      2. Yoda
      3. Han Solo
    ```

# Example

End-of-game handling and the main loop.

```js
game.start( maxTurns: 10_000 );
while (game.isActive()) {
  movePlayer(game);
  if (!game.isActive()) break;
  handleLanding(game);
  game.nextPlayer();  // game counts rounds
}
```
