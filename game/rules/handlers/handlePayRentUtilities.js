import { gameUtils } from "../../utils/gameUtils.js";
import { transferMoneyBetweenPlayers } from "../../utils/transferMoney.js";

export function handlePayRentUtilities(game) {
  const player = game.currentPlayer();
  const tile = game.getPlayerTile(player);
  const owner = gameUtils.getOwner(game);

  const diceRollTotal = game.lastRoll && game.lastRoll.total;
  if (typeof diceRollTotal !== "number") {
    console.log(
      `Cannot calculate utility rent on ${tile.name} because last roll total is unavailable.`,
    );
    return;
  }

  const utilitiesOwned = game.countOwnedTilesOfType(owner, "utility");
  const rent = utilitiesOwned === 2 ? diceRollTotal * 10 : diceRollTotal * 4;
  const utilitiesLabel = utilitiesOwned === 1 ? "utility" : "utilities";

  transferMoneyBetweenPlayers(player, owner, rent, game);
  if (!player.isBankrupt) {
    console.log(
    `${player.name} pays ${owner.name} $${rent} for landing on ${tile.name} (${utilitiesOwned} ${utilitiesLabel} owned).`,
   );
  }  
}
