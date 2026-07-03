import { gameUtils } from "../../utils/gameUtils.js";
import { transferMoneyPlayerToPlayer } from "../../utils/transferMoney.js";
import { checkIfHasFullStreetColorSet } from "../../utils/gameUtils.js";

export function handlePayRentProperties(game) {
  const player = game.currentPlayer();
  const tile = game.getPlayerTile(player);
  const owner = gameUtils.getOwner(game);
  let rent = tile.rent;

  const houseRent = [tile.rent1House, tile.rent2Houses, tile.rent3Houses, tile.rent4Houses];
  
  if (tile.hasHotel && tile.houses === 0) {
    rent = tile.rentHotel;
  }
  else if (!tile.hasHotel && tile.houses > 0) {
    rent = houseRent[tile.houses - 1];
  }
  else if (checkIfHasFullStreetColorSet(game, tile.color, owner) && !tile.hasHotel && tile.houses === 0) {
    rent *= 2;
  }

  transferMoneyPlayerToPlayer(player, owner, rent, game);
  if (!player.isBankrupt) {
    console.log(`${player.name} pays $${rent} rent to ${owner.name}`);
  }
}
