import { sendCurrentPlayerToJail } from "./jailRules.js";
import { markBankruptIfNeeded } from "./bankruptcyRules.js";
import { calculateRailroadRent } from "./railroadRent.js";
import { calculateUtilityRent } from "./utilityRent.js";

const rentCalculators = {
  property: (_game, tile) => tile.rent,
  railroad: calculateRailroadRent,
  utility: calculateUtilityRent,
};

const tileHandlers = {
  "go-to-jail": _handleGoToJail,
  "tax": _handleTax,
  "property": _handlePurchasable,
  "railroad": _handlePurchasable,
  "utility": _handlePurchasable,
};

export const locationRules = {
  handle(game) {
    const tile = game.board[game.currentPlayer().position];
    const handler = tileHandlers[tile?.type];
    if (handler) handler(game);
  },
};

function _handleGoToJail(game) {
  sendCurrentPlayerToJail(game);
}

function _handleTax(game) {
  const tile = game.board[game.currentPlayer().position];
  game.currentPlayer().money -= tile.amount;
  console.log(`${game.currentPlayer().name} landed on ${tile.name} and lost $${tile.amount}`);
  markBankruptIfNeeded(game);
}

function _handlePurchasable(game) {
  _buyProperty(game);
  markBankruptIfNeeded(game);
  if (game.currentPlayer().isBankrupt) return;
  _payRent(game);
  markBankruptIfNeeded(game);
}

function _buyProperty(game) {
  const tile = game.board[game.currentPlayer().position];
  if (!tile || tile.ownerId !== null || !tile.price) return;

  console.log(`${tile.name} is available for $${tile.price}`);

  if (tile.price > game.currentPlayer().money) return;

  game.currentPlayer().money -= tile.price;
  tile.ownerId = game.currentPlayer().id;
  game.currentPlayer().propertyIds = game.currentPlayer().propertyIds || [];
  game.currentPlayer().propertyIds.push(tile.id);
  console.log(`${game.currentPlayer().name} bought ${tile.name} for $${tile.price}.`);
}

function _payRent(game) {
  const tile = game.board[game.currentPlayer().position];
  const isRentPaymentRequired =
    tile && tile.price &&
    tile.ownerId !== null && tile.ownerId !== undefined &&
    tile.ownerId !== game.currentPlayer().id;
  if (!isRentPaymentRequired) return;

  const owner = game.players.find((p) => p.id === tile.ownerId);
  if (!owner) return;

  if (owner.isInJail) {
    console.log(`${owner.name} is in jail and cannot collect rent from ${game.currentPlayer().name}.`);
    return;
  }

  const calculateRent = rentCalculators[tile.type];
  if (!calculateRent) return;

  const rent = calculateRent(game, tile);
  if (rent === null || rent === undefined) {
    console.log(`Cannot calculate utility rent on ${tile.name} because last roll total is unavailable.`);
    return;
  }

  game.currentPlayer().money -= rent;
  owner.money += rent;
  console.log(`${game.currentPlayer().name} pays $${rent} rent to ${owner.name}`);
}
