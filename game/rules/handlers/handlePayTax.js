import { transferMoneyPlayerToBank } from "../../utils/transferMoney.js";

/**
 * Handles tax locations - deducts money from player when landing on tax tiles.
 * @param {Object} game - The game object
 */
export function handlePayTax(game){
  const player = game.currentPlayer();
  const tile = game.getPlayerTile(player);
  
  transferMoneyPlayerToBank(player, tile.amount, game);
  if (!player.isBankrupt) {
    console.log(`${game.currentPlayer().name} landed on ${tile.name} and lost $${tile.amount}`);
  }
}
