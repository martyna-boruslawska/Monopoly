import { gameUtils } from "../../utils/gameUtils.js";
import { transferMoneyBetweenPlayers } from "../../utils/transferMoney.js";

const RAILROAD_RENT = [ 25, 50, 100, 200 ];

export function handlePayRentRailroads(game) {
  const player = game.currentPlayer();
  const tile = game.getPlayerTile(player);
  const owner = gameUtils.getOwner(game);

  const railroadsOwned = game.countOwnedTilesOfType(owner, "railroad");
  if (railroadsOwned < 1 || railroadsOwned > 4)
      throw new Error(`Incorrect number of railroads owned by ${player.name}. Current: ${railroadsOwned}`);

  const rent = RAILROAD_RENT[railroadsOwned-1];
  const railroadsLabel = railroadsOwned === 1 ? "railroad" : "railroads";

  transferMoneyBetweenPlayers(player, owner, rent, game);
  if (!player.isBankrupt) {
    console.log(
      `${player.name} pays ${owner.name} $${rent} for landing on ${tile.name} (${railroadsOwned} ${railroadsLabel} owned).`
    );
  }   
}
