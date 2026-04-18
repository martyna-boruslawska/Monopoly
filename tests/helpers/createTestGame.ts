import { createGame } from "../../game/createGame.js";
import { isOwnableLocation } from "../../game/types.js";
import type { Game, TestPlayerInput } from "../../game/types.js";

export function createTestGame(testPlayers: TestPlayerInput[]): Game {
  const game = createGame(testPlayers.map(({ name }) => name));

  for (let idx = 0; idx < game.players.length; idx++) {
    const player = game.players[idx];
    const testPlayer = testPlayers[idx];
    if (testPlayer.position !== undefined) player.position = testPlayer.position;
    if (testPlayer.money !== undefined) player.money = testPlayer.money;
    if (testPlayer.propertyIds !== undefined) player.propertyIds = [...testPlayer.propertyIds];

    if (player.propertyIds.length > 0) {
      player.propertyIds.forEach((propertyId) => {
        const location = game.board.find(t => t.id === propertyId);
        if (location && isOwnableLocation(location)) {
          location.ownerId = player.id;
        }
      });
    }
  }

  game.currentPlayerId = game.players[0].id;
  return game;
}
