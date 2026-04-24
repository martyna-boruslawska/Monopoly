import { gameUtils } from "../../utils/gameUtils.js";

/**
 * Handles property purchasing when a player lands on an unowned property.
 * Trading functionality can be added here in the future.
 * @param {Object} game - The game object
 */
export function handleBuyOrTrade(game) {
  const tile = gameUtils.getTile(game);
  const player = game.currentPlayer();
  
  console.log(`${tile.name} is available for $${tile.price}`);

  const hasMoneyToBuy = tile.price <= player.money;
  
  if (!hasMoneyToBuy) {
    console.log(`${player.name} does not have enough money to buy ${tile.name}.`);
    return;
  }
  
  player.money -= tile.price;

  tile.ownerId = player.id;
  player.propertyIds = player.propertyIds || [];
  player.propertyIds.push(tile.id);
  
  console.log(`${player.name} bought ${tile.name} for $${tile.price}.`);
}
