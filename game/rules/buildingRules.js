import { checkIfHasFullStreetColorSet } from "./handlers/handlePayRentProperties.js";

export function buildingRules(game) {
  const player = game.currentPlayer();
  
  const moneyReserve = 300;
  
  if (player.money < moneyReserve) {
    return;
  }

  let spendCap = 200;
    if (player.money >= 1000) {
      spendCap = 450;
    }

  const uniqueStreetColorsArray = listUniqueStreetColors(game.board);

  const playersFullStreetColorSetArray = uniqueStreetColorsArray.filter((color) => checkIfHasFullStreetColorSet(game, color, player));
  if (playersFullStreetColorSetArray.length === 0) {
    return;
  }

  colorLoop: for (const color of playersFullStreetColorSetArray) {
    const propertiesOfColor = game.board.filter((t) => t.color === color && t.ownerId === player.id);
    if (propertiesOfColor.some((property) => property.isMortgaged)) {
      continue;
    }

    const houseCost = propertiesOfColor[0].houseCost;

    while (player.money >= (houseCost + moneyReserve) && spendCap >= houseCost) {

      const buildableProperties = propertiesOfColor.filter((property) => !property.hasHotel);
      if (buildableProperties.length === 0) {
        continue colorLoop;
      }

      const lowestNumberOfHouses = Math.min(...buildableProperties.map(property => property.houses));
      for (const property of buildableProperties) {  
        if (property.houses !== lowestNumberOfHouses) {
          continue;
        }

        if (player.money < (houseCost + moneyReserve) || spendCap < houseCost) {
          return;
        }
        
        if (property.houses < 4) {
          property.houses += 1;
          player.money -= houseCost;
          spendCap -= houseCost;
        } else if (property.houses === 4) {
          property.hasHotel = true;
          property.houses = 0;
          player.money -= houseCost;
          spendCap -= houseCost;
        }        
      }
    }
    return;
  }
}

function listUniqueStreetColors(board) {
  const colors = [];

  for (const location of board) {
    if (location.type !== "property") {
      continue;
    }

    if (!colors.includes(location.color)) {
      colors.push(location.color);
    }
  }

  return colors;
}