
export const gameUtils = {
  getOwner,
};

/**
 * Handles rent payment when a player lands on an owned property.
 * Calculates and processes rent based on property type: regular, railroad, or utility.
 * @param {Object} game - The game object
 * @returns {Object} The tile the current player has landed on
 */ 
export function getPlayerTile(player, board) {
    if (!player) throw new Error(`Missing player object ${player}`);
    if (typeof player.position !== "number") 
      throw new Error(`Invalid player object shape. Field position not exist. Player: ${player}`);
    if (player.position < 0 || player.position >= board.length)
      throw new Error(`Player position has invalid value ${player.position}. Expected: [0..${board.length-1}]`);

    return board[player.position];
}

/**
 * Retrieves the owner of the tile the current player has landed on, if any.
 * @param {Object} game - The game object
 * @returns {Object|null} The owner player object or null if unowned
 */
function getOwner(game) {
  const currentPlayer = game.currentPlayer();
  const tile = game.board[currentPlayer.position];
  const owner = game.players.find((p) => p.id === tile.ownerId) ?? null;
  return owner;
};

