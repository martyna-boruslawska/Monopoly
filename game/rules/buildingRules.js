import { checkIfHasFullStreetColorSet } from "../utils/gameUtils.js";
import { subtractMoneyFromPlayer } from "../utils/transferMoney.js";

const MONEY_RESERVE = 300;
const MINIMAL_MONEY_TO_BUILD = 350;
const LOW_SPEND_THRESHOLD = 500;
const HIGH_SPEND_THRESHOLD = 1000;
const MAX_SPEND_ABOVE_LOW_THRESHOLD = 200;
const MAX_SPEND_ABOVE_HIGH_THRESHOLD = 450;

export function buildingRules(game) {
  const player = game.currentPlayer();
  const initialMoney = player.money;
  let spend = 0;

  while (checkIfCanBuild(spend, initialMoney, game)) {
    const property = cheapestBuildableProperty(game);
    const houseCost = property.houseCost;
    spend += houseCost;
    subtractMoneyFromPlayer(player, houseCost, game);
    upgradeProperty(property);
  }
}

function upgradeProperty(property) {
  if (property.houses < 4) {
    property.houses += 1;
    property.hasHotel = false;
  } else if (property.houses === 4) {
    property.hasHotel = true;
    property.houses = 0;
  }
}

function checkIfCanBuild(spend, initialMoney, game) {
  const player = game.currentPlayer();
  const maxSpend = (initialMoney >= HIGH_SPEND_THRESHOLD) ? MAX_SPEND_ABOVE_HIGH_THRESHOLD : MAX_SPEND_ABOVE_LOW_THRESHOLD;
  const property = cheapestBuildableProperty(game);

  if (property === null) {
    return false;
  }

  if (initialMoney < MINIMAL_MONEY_TO_BUILD) {
    return false;
  }

  if (initialMoney < LOW_SPEND_THRESHOLD && spend !== 0) {
    return false;
  }

  if (player.money - property.houseCost < MONEY_RESERVE) {
    return false;
  }

  if (spend + property.houseCost > maxSpend) {
    return false;
  }

  return true;
}

function cheapestBuildableProperty(game) {
  const player = game.currentPlayer();
  const buildableColors = listBuildableStreetColorSetsOwnedByPlayer(game);

  if (buildableColors.length === 0) {
    return null;
  }

  const firstBuildableColor = buildableColors[0];
  const propertiesOfFirstBuildableColor = game.board.filter((t) => t.color === firstBuildableColor && t.ownerId === player.id && !t.hasHotel);
  const lowestNumberOfHouses = Math.min(...propertiesOfFirstBuildableColor.map(property => property.houses));
  const leastDevelopedProperty = propertiesOfFirstBuildableColor.find(property => property.houses === lowestNumberOfHouses);

  return leastDevelopedProperty;
}

function listBuildableStreetColorSetsOwnedByPlayer(game) {
  const player = game.currentPlayer();
  const fullColors = listFullStreetColorSetsOwnedByPlayer(game);
  const buildableColors = fullColors.filter((color) => !streetColorsWithMortgage(game).includes(color) && streetColorsNotFullyHotelled(game).includes(color));

  return buildableColors;
}

function streetColorsWithMortgage(game) {
  const mortgagedColors = [];

  for (const location of game.board) {
    if (location.type !== "property") {
      continue;
    }

    if (!location.isMortgaged) {
      continue;
    }

    if (!mortgagedColors.includes(location.color)) {
      mortgagedColors.push(location.color);
    }
  }

  return mortgagedColors;
}

function streetColorsNotFullyHotelled(game) {
  const notFullyHotelledColors = [];

  for (const location of game.board) {
    if (location.type !== "property") {
      continue;
    }

    if (location.hasHotel) {
      continue;
    }

    if (!notFullyHotelledColors.includes(location.color)) {
      notFullyHotelledColors.push(location.color);
    }
  }

  return notFullyHotelledColors;
}

export function listFullStreetColorSetsOwnedByPlayer(game, player = game.currentPlayer()) {
  const uniqueStreetColors = listUniqueStreetColors(game);
  const fullyOwnedStreetColors = uniqueStreetColors.filter((color) => checkIfHasFullStreetColorSet(game, color, player));
  
  return fullyOwnedStreetColors;
}

function listUniqueStreetColors(game) {
  const colors = [];

  for (const location of game.board) {
    if (location.type !== "property") {
      continue;
    }

    if (!colors.includes(location.color)) {
      colors.push(location.color);
    }
  }

  return colors;
}
