import { gameUtils } from "../../utils/gameUtils.js";
import { transferMoney } from "../../utils/transferMoney.js";

export function handlePayRentProperties(game) {
  const player = game.currentPlayer();
  const tile = game.getPlayerTile(player);
  const owner = gameUtils.getOwner(game);

  transferMoney(player, owner, tile.rent);
  console.log(`${player.name} pays $${tile.rent} rent to ${owner.name}`);
}
