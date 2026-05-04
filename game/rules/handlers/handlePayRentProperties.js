import { gameUtils } from "../../utils/gameUtils.js";
import { transferMoney } from "../../utils/transferMoney.js";

export function handlePayRentProperties(game) {
  const player = game.currentPlayer();
  const tile = game.getPlayerTile(player);
  const owner = gameUtils.getOwner(game);

  let rent = tile.rent;
  if (checkIfHasMonopoly(game, tile, owner) && tile.houses === 0 && !tile.hasHotel) {
    rent *= 2;
  }

  transferMoney(player, owner, rent);
  console.log(`${player.name} pays $${rent} rent to ${owner.name}`);
}

function checkIfHasMonopoly(game, tile, owner) {
  const tileColor = tile.color
  const ownedTilesOfColor = game.board.filter(
    (t) => t.color === tileColor && t.ownerId === owner.id);
  
  if (tileColor === "dark-purple" || tileColor === "dark-blue") {
    if (ownedTilesOfColor.length === 2) {
      return true;
    }
  } else if (ownedTilesOfColor.length === 3) {
      return true;
  }

  return false;
}