import { gameUtils } from "../../utils/gameUtils.js";
import { transferMoney } from "../../utils/transferMoney.js";

export function handlePayRentProperties(game) {
  const player = game.currentPlayer();
  const tile = game.getPlayerTile(player);
  const owner = gameUtils.getOwner(game);
  let rent = tile.rent;

  if (checkIfHasFullStreetColorSet(game, tile.color, owner) && tile.houses === 0 && !tile.hasHotel) {
    rent *= 2;
  }

  if (tile.hasHotel && tile.houses === 0) {
    rent = tile.rentHotel;
  }

  if (!tile.hasHotel && tile.houses > 0) {
    if (tile.houses === 1) {
      rent = tile.rent1House;
    } else if (tile.houses === 2) {
      rent = tile.rent2Houses;
    } else if (tile.houses === 3) {
      rent = tile.rent3Houses;
    } else if (tile.houses === 4) {
      rent = tile.rent4Houses;
    }
  }

  transferMoney(player, owner, rent);
  console.log(`${player.name} pays $${rent} rent to ${owner.name}`);
}

export function checkIfHasFullStreetColorSet(game, tileColor, owner) {
  const totalTilesOfColor = game.board.filter((t) => t.color === tileColor).length;
  const ownedTilesOfColor = game.board.filter((t) => t.color === tileColor && t.ownerId === owner.id).length;

  if (ownedTilesOfColor === totalTilesOfColor) {
      return true;
    }

  return false;
}
