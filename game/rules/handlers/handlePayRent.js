import { gameUtils } from "../../utils/gameUtils.js";
import { rentStrategies } from "../patterns/rentStrategies.js";

/**
 * Handles rent payment when a player lands on an owned property.
 * Calculates and processes rent based on property type: regular, railroad, or utility.
 * @param {Object} game - The game object
 */
export function handlePayRent(game, rentStrategies) {
  const player = game.currentPlayer();
  const tile = game.getPlayerTile(player);
  const owner = gameUtils.getOwner(game);

  if (owner.isInJail) {
    console.log(
      `${owner.name} is in jail and cannot collect rent from ${game.currentPlayer().name}.`,
    );
    return;
  }

  for (const rentStrategy of rentStrategies) {
    if (rentStrategy.activator(tile)) {
      rentStrategy.handler(game, tile);
      return;
    }
  }

  throw new Error(
    `No rent strategy found for tile type "${tile.type}". Please check the rent strategies configuration.`,
  );
}
