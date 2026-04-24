import { gameUtils } from "../../utils/gameUtils.js";

export function handlePayRentUtilities(game) {
  const player = game.currentPlayer();
  const tile = gameUtils.getTile(game);
  const owner = gameUtils.getOwner(game);

  const diceRollTotal = game.lastRoll && game.lastRoll.total;
  if (typeof diceRollTotal !== "number") {
    console.log(
      `Cannot calculate utility rent on ${tile.name} because last roll total is unavailable.`,
    );
    return;
  }

  const utilitiesOwned = countOwnedTiles(game.board, owner.id, "utility");
  const rent = utilitiesOwned === 2 ? diceRollTotal * 10 : diceRollTotal * 4;
  const utilitiesLabel = utilitiesOwned === 1 ? "utility" : "utilities";

  transferMoney(player, owner, rent);
  console.log(
    `${player.name} pays ${owner.name} $${rent} for landing on ${tile.name} (${utilitiesOwned} ${utilitiesLabel} owned).`,
  );
}

function transferMoney(fromPlayer, toPlayer, amount) {
  fromPlayer.money -= amount;
  toPlayer.money += amount;
}

function countOwnedTiles(board, ownerId, type) {
  return board.filter((tile) => tile.type === type && tile.ownerId === ownerId)
    .length;
}
