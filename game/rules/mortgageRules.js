import { listFullStreetColorSetsOwnedByPlayer } from "./buildingRules.js";
import { checkIfHasFullStreetColorSet } from "../utils/gameUtils.js";
import { subtractMoneyFromPlayer } from "../utils/transferMoney.js";

export function mortgageRules(game, player, targetMoney) {
  
  sellBuildingsFromOrphanStreets(game, player, targetMoney);
  if (player.money >= targetMoney) return true;

  mortgageByType(game, player, targetMoney, "utility");
  if (player.money >= targetMoney) return true;

  mortgageByType(game, player, targetMoney, "railroad");
  if (player.money >= targetMoney) return true;

  mortgageOrphanStreets(game, player, targetMoney);
  if (player.money >= targetMoney) return true;

  mortgageCompleteSets(game, player, targetMoney);
  if (player.money >= targetMoney) return true;

  return false;
}


function mortgageProperty(tile, player) {
  tile.isMortgaged = true;
  player.money += tile.price / 2;
}


function sellBuildingsFromOrphanStreets(game, player, targetMoney) {
  const board = game.board;
  const ownedImprovedOrphanStreets = board.filter(t => t.type === "property" && t.ownerId === player.id && !t.isMortgaged && (t.houses > 0 || t.hasHotel) &&
    !checkIfHasFullStreetColorSet(game, t.color, player)).sort((a, b) => buildingLevels(b) - buildingLevels(a) || a.id - b.id);

  for (const tile of ownedImprovedOrphanStreets) {
    while (tile.houses > 0 || tile.hasHotel) {
      sellOneBuilding(tile, player);
      if (player.money >= targetMoney) return;
    }
  }
}

function mortgageByType(game, player, targetMoney, type) {
  const board = game.board;
  const ownedTilesOfTypeWithoutMortgage = board.filter(t => t.type === type && t.ownerId === player.id && !t.isMortgaged).sort((a, b) => a.price - b.price);
  for (const tile of ownedTilesOfTypeWithoutMortgage) {
    mortgageProperty(tile, player);
    if (player.money >= targetMoney) return;
  }
}

function mortgageOrphanStreets(game, player, targetMoney) {
  const board = game.board;
  const ownedOrphanStreetsWithoutMortgage = board.filter(t =>t.type === "property" && t.ownerId === player.id && !t.isMortgaged &&
    !checkIfHasFullStreetColorSet(game, t.color, player)).sort((a, b) => a.price - b.price);
  for (const tile of ownedOrphanStreetsWithoutMortgage) {
    mortgageProperty(tile, player);
    if (player.money >= targetMoney) return;
  }
}

function mortgageCompleteSets(game, player, targetMoney) {
  const board = game.board;

  while (player.money < targetMoney) {
    const completeColors = listFullStreetColorSetsOwnedByPlayer(game, player);
    if (completeColors.length === 0) break;

    const ownedUnimprovedColorsWithoutFullMortgage = completeColors.filter(color => !setHasBuildings(board, color) && board.some(t => t.color === color && t.ownerId === player.id && !t.isMortgaged));

    if (ownedUnimprovedColorsWithoutFullMortgage.length > 0) {
      ownedUnimprovedColorsWithoutFullMortgage.sort((a, b) => {
        const totalStreetValueA = board.filter(t => t.color === a && t.ownerId === player.id).reduce((sum, t) => sum + t.price, 0);
        const totalStreetValueB = board.filter(t => t.color === b && t.ownerId === player.id).reduce((sum, t) => sum + t.price, 0);
        return totalStreetValueA - totalStreetValueB;
      });
      for (const color of ownedUnimprovedColorsWithoutFullMortgage) {
        const tilesOfColorAscendingByPriceWithoutMortgage = board.filter(t => t.color === color && t.ownerId === player.id && !t.isMortgaged).sort((a, b) => a.price - b.price || a.id - b.id);
        for (const tile of tilesOfColorAscendingByPriceWithoutMortgage) {
          mortgageProperty(tile, player);
          if (player.money >= targetMoney) return;
        }
      }
      continue;
    }

    const ownedImprovedColors = completeColors.filter(color => setHasBuildings(board, color));
    if (ownedImprovedColors.length === 0) break;

    ownedImprovedColors.sort((a, b) => countColorBuildingLevel(board, a) - countColorBuildingLevel(board, b));
    const leastImprovedColor = ownedImprovedColors[0];
    const tilesOfColorDescendingByBuildingLevel = board.filter(t => t.color === leastImprovedColor && t.ownerId === player.id).sort((a, b) => buildingLevels(b) - buildingLevels(a) || a.id - b.id);
    sellOneBuilding(tilesOfColorDescendingByBuildingLevel[0], player);
  }
}


function setHasBuildings(board, color) {
  return board.some(t => t.color === color && (t.houses > 0 || t.hasHotel));
}

function countColorBuildingLevel(board, color) {
  return board.filter(t => t.color === color).reduce((sum, t) => sum + (t.hasHotel ? 5 : t.houses), 0);
}

function buildingLevels(tile) {
  return tile.hasHotel ? 5 : tile.houses;
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


export function unmortgageTransferredProperties(toPlayer, transferredTiles, game) {
  const mortgagedTiles = transferredTiles.filter(t => t.isMortgaged);
  if (mortgagedTiles.length === 0) return;

  const totalBasicFees = mortgagedTiles.reduce((sum, t) => sum + 0.1 * (t.price / 2), 0);

  subtractMoneyFromPlayer(toPlayer, totalBasicFees, game);
  if (toPlayer.isBankrupt) return;

  const mortgagedTilesSortedByPrice = [...mortgagedTiles].sort((a, b) => a.price - b.price);
  for (const tile of mortgagedTilesSortedByPrice) {
    const mortgageValue = tile.price / 2;
    if (toPlayer.money - mortgageValue > 500) {
      subtractMoneyFromPlayer(toPlayer, mortgageValue, game)
      tile.isMortgaged = false;
    }
  }
}
