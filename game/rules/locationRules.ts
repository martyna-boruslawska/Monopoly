import type { Game } from "../types.js";
import { isOwnableLocation } from "../types.js";
import { sendCurrentPlayerToJail } from "./jailRules.js";

export const locationRules = {
  handle(game: Game): void {
    if (handleGoToJail(game)) {
      return;
    }

    handleTaxLocations(game);
    markBankruptIfNeeded(game);
    if (game.currentPlayer()?.isBankrupt) return;

    handleBuyProperty(game);
    markBankruptIfNeeded(game);
    if (game.currentPlayer()?.isBankrupt) return;

    handlePayRent(game);
    markBankruptIfNeeded(game);
  },
};

function handleGoToJail(game: Game): boolean {
  const player = game.currentPlayer();
  if (player === null) return false;
  const tile = game.board[player.position];
  if (!tile || tile.type !== "go-to-jail") {
    return false;
  }

  sendCurrentPlayerToJail(game);
  return true;
}

function handleTaxLocations(game: Game): void {
  const player = game.currentPlayer();
  if (player === null) return;
  const tile = game.board[player.position];
  if (tile && tile.type === "tax") {
    player.money -= tile.amount;
    console.log(`${player.name} landed on ${tile.name} and lost $${tile.amount}`);
  }
}

function handleBuyProperty(game: Game): void {
  const player = game.currentPlayer();
  if (player === null) return;
  const tile = game.board[player.position];
  if (!tile || !isOwnableLocation(tile) || tile.ownerId !== null) {
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
}

function handlePayRent(game: Game): void {
  const player = game.currentPlayer();
  if (player === null) return;
  const tile = game.board[player.position];
  if (!tile || !isOwnableLocation(tile) || tile.ownerId === null || tile.ownerId === player.id) {
    return;
  }

  const owner = game.players.find(p => p.id === tile.ownerId);
  if (!owner) return;

  if (owner.isInJail) {
    console.log(`${owner.name} is in jail and cannot collect rent from ${player.name}.`);
    return;
  }

  if (tile.type === "railroad") {
    let railroadRent = tile.rent;
    const railroadsOwned = game.board.filter(
      t => t.type === "railroad" && t.ownerId === owner.id,
    ).length;
    const railroadsLabel = railroadsOwned === 1 ? "railroad" : "railroads";
    if (railroadsOwned === 2) {
      railroadRent = 50;
    } else if (railroadsOwned === 3) {
      railroadRent = 100;
    } else if (railroadsOwned === 4) {
      railroadRent = 200;
    }
    player.money -= railroadRent;
    owner.money += railroadRent;
    console.log(
      `${player.name} pays ${owner.name} $${railroadRent} for landing on ${tile.name} (${railroadsOwned} ${railroadsLabel} owned).`,
    );
    return;
  }

  if (tile.type === "utility") {
    const diceRollTotal = game.lastRoll && game.lastRoll.total;
    if (typeof diceRollTotal !== "number") {
      console.log(
        `Cannot calculate utility rent on ${tile.name} because last roll total is unavailable.`,
      );
      return;
    }
    const utilitiesOwned = game.board.filter(
      t => t.type === "utility" && t.ownerId === owner.id,
    ).length;
    const utilitiesLabel = utilitiesOwned === 1 ? "utility" : "utilities";
    const utilityRent = utilitiesOwned === 2 ? diceRollTotal * 10 : diceRollTotal * 4;
    player.money -= utilityRent;
    owner.money += utilityRent;
    console.log(
      `${player.name} pays ${owner.name} $${utilityRent} for landing on ${tile.name} (${utilitiesOwned} ${utilitiesLabel} owned).`,
    );
    return;
  }

  const rent = tile.rent;
  player.money -= rent;
  owner.money += rent;
  console.log(`${player.name} pays $${rent} rent to ${owner.name}`);
}

function markBankruptIfNeeded(game: Game): void {
  const player = game.currentPlayer();
  if (player === null) return;
  if (player.isBankrupt || player.money >= 0) {
    return;
  }

  player.isBankrupt = true;
  releasePlayerProperties(game, player);
  console.log(`${player.name} is bankrupt and out of the game.`);
}

function releasePlayerProperties(game: Game, player: { id: number; propertyIds: number[] }): void {
  for (const tile of game.board) {
    if (isOwnableLocation(tile) && tile.ownerId === player.id) {
      tile.ownerId = null;
    }
  }
  player.propertyIds = [];
}
