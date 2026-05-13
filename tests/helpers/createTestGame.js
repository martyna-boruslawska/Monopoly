import { createGame } from "../../game/factories/createGame.js";

export function createTestGame(testPlayers) {
  const game = createGame(testPlayers.map(({ name }) => name));
  const assignedPropertyIds = new Set();
  
  for (let idx = 0; idx < game.players.length; idx++) {
    const player = game.players[idx];
    const testPlayer = testPlayers[idx];
    testPlayer.position !== undefined && (player.position = testPlayer.position);
    testPlayer.money !== undefined && (player.money = testPlayer.money);
    testPlayer.propertyIds !== undefined && (player.propertyIds = [...testPlayer.propertyIds]);
    
    if (player.propertyIds.length > 0) {
      player.propertyIds.forEach((propertyId) => {
        const location = game.board.find((t) => t.id === propertyId);
        if (location === undefined) {
          throw new Error(`Unknown property id: ${propertyId}`);
        }

        if (!isOwnableTile(location)) {
          throw new Error(`Tile ${propertyId} is not ownable`);
        }

        if (assignedPropertyIds.has(propertyId)) {
          throw new Error(`Duplicate property id assignment: ${propertyId}`);
        }

        assignedPropertyIds.add(propertyId);
        location.ownerId = player.id;
      });
    }
  }

  game.decks = null;
  game.currentPlayerId = game.players[0].id;
  return game;
}

function isOwnableTile(tile) {
  return tile.type === "property" || tile.type === "railroad" || tile.type === "utility";
}
