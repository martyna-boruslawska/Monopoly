import { gameUtils } from "../../utils/gameUtils.js";

/**
 * Handles tax locations - deducts money from player when landing on tax tiles.
 * @param {Object} game - The game object
 */
export function handlePayTax(game){
  const tile = gameUtils.getTile(game);
  
  game.currentPlayer().money -= tile.amount;
  console.log(`${game.currentPlayer().name} landed on ${tile.name} and lost $${tile.amount}`);
}