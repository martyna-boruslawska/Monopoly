import { gameUtils } from "../../utils/gameUtils.js";

export function handlePayRentProperties(game) {
  const player = game.currentPlayer();
  const tile = gameUtils.getTile(game);
  const owner = gameUtils.getOwner(game);

  transferMoney(player, owner, tile.rent);
  console.log(`${player.name} pays $${tile.rent} rent to ${owner.name}`);
}

function transferMoney(fromPlayer, toPlayer, amount) {
  fromPlayer.money -= amount;
  toPlayer.money += amount;
}

function countOwnedTiles(board, ownerId, type) {
  return board.filter((tile) => tile.type === type && tile.ownerId === ownerId)
    .length;
}
