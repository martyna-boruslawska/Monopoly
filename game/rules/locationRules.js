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

  handle(game, tile) {
    const currentPlayer = game.currentPlayer();
    this._handleTaxLocations(currentPlayer, tile);
    this._markBankruptIfNeeded(currentPlayer, game.board);
    if (currentPlayer.isBankrupt) return;

    this._handleBuyProperty(currentPlayer, tile);
    this._markBankruptIfNeeded(currentPlayer, game.board);
    if (currentPlayer.isBankrupt) return;

    this._handlePayRent(currentPlayer, tile, game.players);
    this._markBankruptIfNeeded(currentPlayer, game.board);
  },
  

  _markBankruptIfNeeded(player, board) {
    if (player.isBankrupt || player.money >= 0) {
      return;
    }

    player.isBankrupt = true;
    this._releasePlayerProperties(player, board);
    console.log(`${player.name} is bankrupt and out of the game.`);
  },

  _releasePlayerProperties(player, board) {
    for (const tile of board) {
      if (tile.ownerId === player.id) {
        tile.ownerId = null;
      }
    }

    player.propertyIds = [];
  },

  _handlePayRent(player, tile, players) {
    const isRentPaymentRequired = tile && tile.rent && tile.ownerId != null && tile.ownerId !== player.id;
    if (!isRentPaymentRequired) return;

    const owner = players.find((p) => p.id === tile.ownerId);
    if (!owner) return;

    const rent = tile.rent;

    player.money -= rent;
    owner.money += rent;
    console.log(`${player.name} pays $${rent} rent to ${owner.name}`);
  },

  _handleBuyProperty(player, tile) {
    const isLocationAvailableForPurchase = tile && tile.ownerId === null && tile.price;
    if (!isLocationAvailableForPurchase) {
      return;
    }

    console.log(`${tile.name} is available for $${tile.price}`);

    if (tile.price > player.money) {
      return;
    }

    player.money -= tile.price;
    tile.ownerId = player.id;
    player.propertyIds = player.propertyIds || [];
    player.propertyIds.push(tile.id);
    console.log(`${player.name} bought ${tile.name} for $${tile.price}.`);
  },

  _handleTaxLocations(player, tile) {
    if (tile.type === "tax") {
      player.money -= tile.amount; // Deduct tax amount from player's money
      console.log(
        `${player.name} landed on ${tile.name} and lost $${tile.amount}`,
      );
    }
  },
};
