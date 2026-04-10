import { jailRules, sendCurrentPlayerToJail } from "./jailRules.js";

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
    if (this._handleGoToJail(game)) {
      return;
    }
      
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
    const isRentPaymentRequired = tile && tile.price && tile.ownerId !== null && tile.ownerId !== undefined && tile.ownerId !== game.currentPlayer().id;
    if (!isRentPaymentRequired) return;

    const owner = game.players.find((p) => p.id === tile.ownerId);
    if (!owner) return;

    if (owner.isInJail) {
      console.log(`${owner.name} is in jail and cannot collect rent from ${game.currentPlayer().name}.`);
      return;
    }

    if (tile.type === "railroad") {
      let railroadRent = tile.rent;
      const railroadsOwned = game.board.filter((t) => t.type === "railroad" && t.ownerId === owner.id).length;
      const railroadsLabel = railroadsOwned === 1 ? "railroad" : "railroads";
      if (railroadsOwned === 2) {
        railroadRent = 50;
      }
      else if (railroadsOwned === 3) {
        railroadRent = 100;
      }
      else if (railroadsOwned === 4) {
        railroadRent = 200;
      }
      game.currentPlayer().money -= railroadRent;
      owner.money += railroadRent;
      console.log(`${game.currentPlayer().name} pays ${owner.name} $${railroadRent} for landing on ${tile.name} (${railroadsOwned} ${railroadsLabel} owned).`);
      return;
    }
    
    if (tile.type === "utility") {
      const diceRollTotal = game.lastRoll && game.lastRoll.total;
      if (typeof diceRollTotal !== "number") {
        console.log(`Cannot calculate utility rent on ${tile.name} because last roll total is unavailable.`);
        return;
      }
      const utilitiesOwned = game.board.filter((t) => t.type === "utility" && t.ownerId === owner.id).length;
      const utilitiesLabel = utilitiesOwned === 1 ? "utility" : "utilities";
      const utilityRent = utilitiesOwned === 2 ? diceRollTotal * 10 : diceRollTotal * 4;
      game.currentPlayer().money -= utilityRent;
      owner.money += utilityRent;
      console.log(`${game.currentPlayer().name} pays ${owner.name} $${utilityRent} for landing on ${tile.name} (${utilitiesOwned} ${utilitiesLabel} owned).`);
      return;
    }
    
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

  _handleGoToJail(game) {
    const tile = game.board[game.currentPlayer().position];
    if (!tile || tile.type !== "go-to-jail") {
      return false;
    }

    sendCurrentPlayerToJail(game);
    return true;
  },
};
