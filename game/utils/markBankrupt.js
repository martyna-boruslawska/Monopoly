import { unmortgageTransferredProperties } from "../rules/mortgageRules.js";

/**
 * Marks a player as bankrupt
 * @param {Object} player - The player to mark bankrupt
 */
export function markPlayerBankrupt(player) {
  player.isBankrupt = true;
  console.log(`${player.name} is bankrupt and out of the game.`);
}

/**
 * Releases all properties owned by a player (sets them as unowned on the board).
 * @param {Object} player - The player whose properties should be released
 * @param {Object} board - The game board
 */
export function releasePlayerAssets(player, board) {
  for (const tile of board) {
    if (tile.ownerId === player.id) {
      tile.ownerId = null;
      tile.isMortgaged = false;
    }
  }
  player.propertyIds = [];
  player.money = 0;
}

/**
 * Transfers all properties owned by a player to another player.
 * @param {Object} fromPlayer - The player whose properties are being transferred
 * @param {Object} toPlayer - The player receiving the properties
 * @param {Object} game - The game object
 */
export function transferPlayerAssets(fromPlayer, toPlayer, game) {
  const transferredTiles = [];
  for (const tile of game.board) {
    if (tile.ownerId === fromPlayer.id) {
      tile.ownerId = toPlayer.id;
      toPlayer.propertyIds.push(tile.id);
      transferredTiles.push(tile);
    }
  }
  toPlayer.money += fromPlayer.money;
  fromPlayer.money = 0;
  fromPlayer.propertyIds = [];
  unmortgageTransferredProperties(toPlayer, transferredTiles, game);
}
