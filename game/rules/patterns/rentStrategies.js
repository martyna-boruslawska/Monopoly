import { gameUtils } from "../../utils/gameUtils.js";
import { handlePayRentProperties } from "../handlers/handlePayRentProperties.js";
import { handlePayRentRailroads } from "../handlers/handlePayRentRailroads.js";
import { handlePayRentUtilities } from "../handlers/handlePayRentUtilities.js";

export const rentStrategies = [
  {
    name: "railroad",
    activator: (tile) => tile.type === "railroad",
      handler: handlePayRentRailroads,
  },
  {
    name: "utility",
    activator: (tile) => tile.type === "utility",
    handler: handlePayRentUtilities,
  },
  {
    name: "property",
    activator: (tile) => tile.type === "property",
    handler: handlePayRentProperties,
  },
];

function transferMoney(fromPlayer, toPlayer, amount) {
  fromPlayer.money -= amount;
  toPlayer.money += amount;
}

function countOwnedTiles(board, ownerId, type) {
  return board.filter((tile) => tile.type === type && tile.ownerId === ownerId).length;
}
