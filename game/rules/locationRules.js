import { sendCurrentPlayerToJail } from "./jailRules.js";
import { markBankruptIfNeeded } from "./bankruptcyService.js";
import { rentCalculators } from "./rentCalculators.js";

/**
 * Handles the rules for landing on different types of locations on the board,
 * such as paying rent, buying properties, and handling income tax.
 */
export const locationRules = {
  handle(game) {
    if (this._handleGoToJail(game)) {
      return;
    }

    this._handleTaxLocations(game);
    markBankruptIfNeeded(game);
    if (game.currentPlayer().isBankrupt) return;

    this._handleBuyProperty(game);
    markBankruptIfNeeded(game);
    if (game.currentPlayer().isBankrupt) return;

    this._handlePayRent(game);
    markBankruptIfNeeded(game);
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

    const calculator = rentCalculators[tile.type] ?? rentCalculators.property;
    calculator(game, tile, owner);
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
      game.currentPlayer().money -= tile.amount;
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
