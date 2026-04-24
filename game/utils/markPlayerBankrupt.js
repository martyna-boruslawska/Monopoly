/**
 * Marks a player as bankrupt and releases all their owned properties.
 * @param {Object} player - The player to mark bankrupt
 * @param {Object} board - The game board
 */
export function markPlayerBankrupt(player, board) {
  player.isBankrupt = true;
  releasePlayerProperties(player, board);
  console.log(`${player.name} is bankrupt and out of the game.`);
}

/**
 * Releases all properties owned by a player (sets them as unowned on the board).
 * @param {Object} player - The player whose properties should be released
 * @param {Object} board - The game board
 */
function releasePlayerProperties(player, board) {
  for (const tile of board) {
    if (tile.ownerId === player.id) {
      tile.ownerId = null;
    }
  }

  player.propertyIds = [];
}
