Homework: Simplify `game` arrange in tests

tests/helpers/createTestGame.js

```js
import { createGame } from "../../game/createGame.js";

export function createTestGame(testPlayers) {
  const game = createGame(testPlayers.map(({ name }) => name));
  for (let idx = 0; idx < game.players.length; idx++) {
    const player = game.players[idx];
    const tp = testPlayers[idx];
    tp.position && (player.position = tp.position);
    tp.money && (player.money = tp.money);
    tp.propertyIds && (player.propertyIds = [...tp.propertyIds]);
    if (player.propertyIds.length > 0) {
      player.propertyIds.forEach((propertyId) => {
        const location = game.board.find((t) => t.id === propertyId);
        if (location) {
          location.ownerId = player.id;
        }
      });
    }
  }
  game.currentPlayerId = game.players[0].id;
  return game;
}
```

minor change test player names: "Martyna", "Jarek"

createTestGame example:

```js
  /*
    - currentPlayerId = 1, Luke is an active player and is moving
    - Luke lands on Boardwalk [39], owner is Darth Vader, Luke should pay rent $50
    - Darth Vader stays on Start, owns Boardwalk
    - Han stays on Income Tax
  */
  const game = createTestGame([
    { name: "Luke Skywalker", position: 39, money: 200 },
    { name: "Darth Vader", propertyIds: [39] }
    { name: "Han Solo", position: 4, money: 1300},
  ]);
```
