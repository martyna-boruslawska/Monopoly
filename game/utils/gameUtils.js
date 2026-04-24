
export const gameUtils = {
  getTile,
  getOwner,
};

/**
 * Handles rent payment when a player lands on an owned property.
 * Calculates and processes rent based on property type: regular, railroad, or utility.
 * @param {Object} game - The game object
 * @returns {Object} The tile the current player has landed on
 */ 
function getTile(game) {
    const currentPlayer = game.currentPlayer();
    const tile = game.board[currentPlayer.position];
    return tile;
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

