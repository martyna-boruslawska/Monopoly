import { checkIfHasFullStreetColorSet, listFullStreetColorSetsOwnedByPlayer } from "../utils/gameUtils.js";
import { transferMoneyPlayerToBank } from "../utils/transferMoney.js";

const MORTGAGE_INTEREST_RATE = 0.1;
const MIN_CASH_RESERVE_AFTER_UNMORTGAGE = 500;

export function mortgageRules(game, player, targetMoney) {
  
  const mortgageSteps = [
    () => sellBuildingsFromOrphanStreets(game, player, targetMoney),
    () => mortgageByType(game, player, targetMoney, "utility"),
    () => mortgageByType(game, player, targetMoney, "railroad"),
    () => mortgageOrphanStreets(game, player, targetMoney),
    () => mortgageCompleteSets(game, player, targetMoney),
  ];

  for (const step of mortgageSteps) {
    step();
    if (player.money >= targetMoney) return true;
  }

  return false;
}



// An orphan (incomplete-set) street should not carry buildings: they can't be built there.
// This step exists as a guard against future edge cases.
// Those buildings must be sold before the street can be mortgaged.
function sellBuildingsFromOrphanStreets(game, player, targetMoney) {
  const board = game.board;
  const ownedImprovedOrphanStreets = board
    .filter(tile => tile.type === "property"
    && isOwnedAndUnmortgaged(tile, player)
    && streetHasBuildings(tile)
    && isOrphan(tile, game, player))
    .sort(sortFromMostImprovedThenAscId);

  for (const tile of ownedImprovedOrphanStreets) {
    while (tile.houses > 0 || tile.hasHotel) {
      sellOneBuilding(tile, player);
      if (player.money >= targetMoney) return;
    }
  }
}

function mortgageByType(game, player, targetMoney, type) {
  const board = game.board;
  const ownedTilesOfTypeWithoutMortgage = board
    .filter(tile => tile.type === type
    && isOwnedAndUnmortgaged(tile, player))
    .sort(sortFromCheapestThenAscId);
  for (const tile of ownedTilesOfTypeWithoutMortgage) {
    mortgageProperty(tile, player);
    if (player.money >= targetMoney) return;
  }
}

function mortgageOrphanStreets(game, player, targetMoney) {
  const board = game.board;
  const ownedOrphanStreetsWithoutMortgage = board
    .filter(tile => tile.type === "property"
    && isOwnedAndUnmortgaged(tile, player)
    && isOrphan(tile, game, player))
    .sort(sortFromCheapestThenAscId);
  for (const tile of ownedOrphanStreetsWithoutMortgage) {
    mortgageProperty(tile, player);
    if (player.money >= targetMoney) return;
  }
}

function mortgageCompleteSets(game, player, targetMoney) {
  let canRaiseMoreFunds = true;
  while (player.money < targetMoney && canRaiseMoreFunds) {
    canRaiseMoreFunds = raiseFundsFromOneCompleteSet(game, player, targetMoney);
  }
}

function raiseFundsFromOneCompleteSet(game, player, targetMoney) {
  const board = game.board;

  const completeColors = listFullStreetColorSetsOwnedByPlayer(game, player);
  if (completeColors.length === 0) return false;

  const unimprovedColorsToMortgage = findUnimprovedCompleteSetColorsFromCheapest(board, player, completeColors);
  if (unimprovedColorsToMortgage.length > 0) {
    mortgageColorSetsUntilTargetReached(board, player, unimprovedColorsToMortgage, targetMoney);
    return true;
  }

  const leastImprovedColor = findLeastImprovedCompleteSetColor(board, completeColors);
  if (!leastImprovedColor) return false;

  sellMostImprovedBuildingOfColor(board, player, leastImprovedColor);
  return true;
}

function findUnimprovedCompleteSetColorsFromCheapest(board, player, completeColors) {
  return completeColors
    .filter(color => !setHasBuildings(board, color)
    && board.some(tile => tile.color === color
    && isOwnedAndUnmortgaged(tile, player)))
    .sort((a, b) => totalStreetPriceByColor(board, player, a) - totalStreetPriceByColor(board, player, b));
}

function mortgageColorSetsUntilTargetReached(board, player, colors, targetMoney) {
  for (const color of colors) {
    const targetReached = mortgageColorSet(board, player, color, targetMoney);
    if (targetReached) return;
  }
}

function mortgageColorSet(board, player, color, targetMoney) {
  const tilesOfColorWithoutMortgageFromCheapest = board
    .filter(tile => tile.color === color
    && isOwnedAndUnmortgaged(tile, player))
    .sort(sortFromCheapestThenAscId);

  for (const tile of tilesOfColorWithoutMortgageFromCheapest) {
    mortgageProperty(tile, player);
    if (player.money >= targetMoney) return true;
  }
  return false;
}

function findLeastImprovedCompleteSetColor(board, completeColors) {
  const ownedImprovedColors = completeColors.filter(color => setHasBuildings(board, color));
  if (ownedImprovedColors.length === 0) return undefined;

  ownedImprovedColors.sort((a, b) => countColorBuildingLevel(board, a) - countColorBuildingLevel(board, b));
  return ownedImprovedColors[0];
}

function sellMostImprovedBuildingOfColor(board, player, color) {
  const tilesOfColorFromMostImproved = board
    .filter(tile => tile.color === color
    && isOwnedBy(tile, player))
    .sort(sortFromMostImprovedThenAscId);
  sellOneBuilding(tilesOfColorFromMostImproved[0], player);
}



function mortgageValue(tile) {
  return tile.price / 2;
}

function mortgageProperty(tile, player) {
  tile.isMortgaged = true;
  player.money += mortgageValue(tile);
}

function sellOneBuilding(tile, player) {
  const refund = tile.houseCost / 2;
  if (tile.hasHotel) {
    tile.hasHotel = false;
    tile.houses = 4;
  } else {
    tile.houses -= 1;
  }
  player.money += refund;
}

function streetHasBuildings(tile) {
  return tile.houses > 0 || tile.hasHotel;
}

function setHasBuildings(board, color) {
  return board
    .some(tile => tile.color === color
    && streetHasBuildings(tile));
}

function buildingLevel(tile) {
  return tile.hasHotel ? 5 : tile.houses;
}

function countColorBuildingLevel(board, color) {
  return board
    .filter(tile => tile.color === color)
    .reduce((sum, tile) => sum + buildingLevel(tile), 0);
}

function isOwnedBy(tile, player) {
  return tile.ownerId === player.id;
}

function isUnmortgaged(tile) {
  return !tile.isMortgaged;
}

function isOwnedAndUnmortgaged(tile, player) {
  return isOwnedBy(tile, player) && isUnmortgaged(tile);
}

function totalStreetPriceByColor(board, player, color) {
  return board
    .filter(tile => tile.color === color && isOwnedBy(tile, player))
    .reduce((sum, tile) => sum + tile.price, 0);
}

function isOrphan(tile, game, player) {
  return !checkIfHasFullStreetColorSet(game, tile.color, player);
}

function sortFromCheapestThenAscId(a, b) {
  return a.price - b.price || a.id - b.id;
}

function sortFromMostImprovedThenAscId(a, b) {
  return buildingLevel(b) - buildingLevel(a) || a.id - b.id;
}



export function unmortgageTransferredProperties(toPlayer, transferredTiles, game) {
  const mortgagedTiles = transferredTiles.filter(tile => tile.isMortgaged);
  if (mortgagedTiles.length === 0) return;

  // The 10% interest is due on transfer for every mortgaged property received,
  // whether or not it is later redeemed. Paying it is mandatory and can by
  // itself bankrupt the recipient.
  const totalBasicFees = mortgagedTiles
    .reduce((sum, tile) => sum + MORTGAGE_INTEREST_RATE * mortgageValue(tile), 0);

  transferMoneyPlayerToBank(toPlayer, totalBasicFees, game);
  if (toPlayer.isBankrupt) return;

  // Redeem mortgages cheapest-first, keeping a minimum cash reserve in hand.
  const mortgagedTilesSortedByPrice = [...mortgagedTiles]
    .sort((a, b) => a.price - b.price);
  for (const tile of mortgagedTilesSortedByPrice) {
    if (toPlayer.money - mortgageValue(tile) > MIN_CASH_RESERVE_AFTER_UNMORTGAGE) {
      transferMoneyPlayerToBank(toPlayer, mortgageValue(tile), game);
      tile.isMortgaged = false;
    }
  }
}
