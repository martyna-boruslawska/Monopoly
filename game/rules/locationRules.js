/**
 * Handles the rules for landing on different types of locations on the board, 
 * such as paying rent, buying properties, and handling income tax.
 */
export const locationRules = {
  /**
   * Handles the actions that occur when a player lands on a tile, including: 
   * paying rent, buying properties, and handling income tax.
   * @param {Array<Object>} players - The list of all players in the game
   * @param {Object} tile - The tile that the player landed on
   * @param {Object} currentPlayer - The player who landed on the tile
   */

  handle(game) {
      
    this._handleTaxLocations(game);
    this._markBankruptIfNeeded(game);
    if (game.currentPlayer().isBankrupt) return;

    this._handleBuyProperty(game);
    this._markBankruptIfNeeded(game);
    if (game.currentPlayer().isBankrupt) return;

    this._handlePayRent(game);
    this._markBankruptIfNeeded(game);
  },

  _markBankruptIfNeeded(game) {
    if (game.currentPlayer().isBankrupt || game.currentPlayer().money >= 0) {
      return;
    }

    game.currentPlayer().isBankrupt = true;
    this._releasePlayerProperties(game);
    console.log(`${game.currentPlayer().name} is bankrupt and out of the game.`);
  },

  _releasePlayerProperties(game) {
    for (const tile of game.board) {
      if (tile.ownerId === game.currentPlayer().id) {
        tile.ownerId = null;
      }
    }

    game.currentPlayer().propertyIds = [];
  },

  _handlePayRent(game) {
    const tile = game.board[game.currentPlayer().position];
    const isRentPaymentRequired = tile && tile.rent && tile.ownerId != null && tile.ownerId !== game.currentPlayer().id;
    if (!isRentPaymentRequired) return;

    const owner = game.players.find((p) => p.id === tile.ownerId);
    if (!owner) return;

    const rent = tile.rent;

    game.currentPlayer().money -= rent;
    owner.money += rent;
    console.log(`${game.currentPlayer().name} pays $${rent} rent to ${owner.name}`);
  },

  _handleBuyProperty(game) {
    const tile = game.board[game.currentPlayer().position];
    const isLocationAvailableForPurchase = tile && tile.ownerId === null && tile.price;
    if (!isLocationAvailableForPurchase) {
      return;
    }

    console.log(`${tile.name} is available for $${tile.price}`);

    if (tile.price > game.currentPlayer().money) {
      return;
    }

    game.currentPlayer().money -= tile.price;
    tile.ownerId = game.currentPlayer().id;
    game.currentPlayer().propertyIds = game.currentPlayer().propertyIds || [];
    game.currentPlayer().propertyIds.push(tile.id);
    console.log(`${game.currentPlayer().name} bought ${tile.name} for $${tile.price}.`);
  },

  _handleTaxLocations(game) {
    const tile = game.board[game.currentPlayer().position];
    if (tile && tile.type === "tax") {
      game.currentPlayer().money -= tile.amount; // Deduct tax amount from player's money
      console.log(
        `${game.currentPlayer().name} landed on ${tile.name} and lost $${tile.amount}`,
      );
    }
  },
};
